"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePaystackPayment } from 'react-paystack';
import { db, storage } from '@/lib/firebase';
import { 
    doc, getDoc, setDoc, updateDoc, serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
    ArrowLeft, ArrowRight, CreditCard, Landmark, CheckCircle, 
    Copy, User, Mail, Phone, MessageSquare, ShieldCheck,
    ChevronRight, Lock, Loader2, UploadCloud, AlertCircle
} from 'lucide-react';

export default function FundDonationWizard({ fundId }) {
    const router = useRouter();

    // --- STATE ---
    const [fund, setFund] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(1); 

    // Donation Data
    const [amount, setAmount] = useState(5000);
    const [customAmount, setCustomAmount] = useState('');
    const [donor, setDonor] = useState({ name: '', email: '', phone: '', note: '' });
    const [paymentMethod, setPaymentMethod] = useState('paystack'); 
    const [transactionRef, setTransactionRef] = useState(""); 
    
    // Bank Proof State
    const [proofFile, setProofFile] = useState(null);
    const [proofUploading, setProofUploading] = useState(false);

    const PRESET_AMOUNTS = [1000, 5000, 10000, 20000, 50000, 100000];
    const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    // --- INIT ---
    useEffect(() => {
        const fetchFund = async () => {
            if (!fundId) return;
            try {
                const docRef = doc(db, "donation_funds", fundId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFund({ id: docSnap.id, ...docSnap.data() });
                } else {
                    router.push('/get-involved/donate');
                }
            } catch (error) {
                console.error("Error fetching fund:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFund();
        // Generate initial ref
        setTransactionRef(`REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
    }, [fundId, router]);

    // --- PAYSTACK HOOK ---
    const config = {
        reference: transactionRef,
        email: donor.email,
        amount: amount * 100, // Paystack takes Kobo
        publicKey: PAYSTACK_KEY,
        metadata: {
            fundId: fund?.id,
            fundTitle: fund?.title,
            donorName: donor.name,
            custom_fields: [
                { display_name: "Fund", variable_name: "fund", value: fund?.title }
            ]
        }
    };
    
    const initializePaystack = usePaystackPayment(config);

    // --- HANDLERS ---
    
    const handleNextStep = () => {
        if (step === 1 && amount < 100) return alert("Minimum donation is ₦100");
        if (step === 2 && !donor.email) return alert("Email is required for receipt.");
        setStep(prev => prev + 1);
    };

    // 1. Create PENDING Record (The Critical Step)
    const createPendingRecord = async (method) => {
        setProcessing(true);
        try {
            // We use the Transaction Ref as the Document ID to enforce uniqueness
            await setDoc(doc(db, "donations", transactionRef), {
                fundId: fund.id,
                fundTitle: fund.title,
                reference: transactionRef,
                method: method,
                amount: amount,
                currency: "NGN",
                donorName: donor.name || "Anonymous",
                donorEmail: donor.email,
                donorPhone: donor.phone || "",
                message: donor.note || "",
                status: "Pending", // Always start as Pending
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error("Error creating record:", error);
            alert("Could not initialize donation. Please check connection.");
            setProcessing(false);
            return false;
        }
    };

    // 2. Process Payment
    const handlePayNow = async () => {
        // A. Pre-save to database
        const saved = await createPendingRecord('paystack');
        if (!saved) return;

        // B. Trigger Paystack
        initializePaystack(
            // On Success (Client side callback)
            async (response) => {
                // Now we verify on server to be sure
                try {
                    const res = await fetch('/api/paystack/verify', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ reference: response.reference })
                    });
                    
                    if (res.ok) {
                        // Update to Success
                        await updateDoc(doc(db, "donations", transactionRef), {
                            status: 'Success',
                            paystackReference: response.reference,
                            paystackTransactionId: response.transaction,
                            paidAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                        setStep(4);
                    } else {
                        alert("Payment received but verification failed. Admin will check.");
                        setStep(4); // Still show success but internal status might be pending
                    }
                } catch (err) {
                    console.error("Verification error", err);
                    setStep(4); // Assuming success since callback fired, webhook will reconcile
                } finally {
                    setProcessing(false);
                }
            },
            // On Close
            () => {
                alert("Payment window closed.");
                setProcessing(false);
                // Note: We leave the record as "Pending" in DB. 
                // You can optionally mark it "Cancelled" here if you prefer.
            }
        );
    };

    const handleBankTransfer = async () => {
        const saved = await createPendingRecord('bank');
        if (saved) {
            setProcessing(false);
            setStep(4);
        }
    };

    // 3. Optional Bank Proof Upload
    const handleProofUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setProofUploading(true);
        try {
            const storageRef = ref(storage, `proofs/${transactionRef}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            await updateDoc(doc(db, "donations", transactionRef), {
                bankProofUrl: downloadURL,
                bankProofFileName: file.name,
                bankProofUploadedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            setProofFile(file.name);
            alert("Receipt uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload receipt.");
        } finally {
            setProofUploading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand-gold" /></div>;
    if (!fund) return <div className="text-center p-20">Fund not found.</div>;

    const bankDetails = fund.bankDetails || { bankName: "Jaiz Bank", accountNumber: "0000000000", accountName: "Al Asad Foundation" };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* LEFT: INFO */}
            <div className="lg:col-span-7">
                <div className="sticky top-32">
                    <Link href="/get-involved/donate" className="flex items-center text-gray-500 hover:text-brand-brown-dark mb-6 text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Funds
                    </Link>
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-8">
                        <Image src={fund.coverImage || "/fallback.webp"} alt={fund.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 text-white">
                            <h1 className="font-agency text-4xl font-bold">{fund.title}</h1>
                        </div>
                    </div>
                    <div className="prose text-gray-600 font-lato">
                        <h3 className="font-agency text-2xl text-brand-brown-dark">About this Cause</h3>
                        <p>{fund.description}</p>
                    </div>
                </div>
            </div>

            {/* RIGHT: WIZARD */}
            <div className="lg:col-span-5 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-32">
                    
                    {/* Header Steps */}
                    {step < 4 && (
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between text-xs font-bold uppercase text-gray-400">
                            <span className={step >= 1 ? 'text-brand-brown-dark' : ''}>1. Amount</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className={step >= 2 ? 'text-brand-brown-dark' : ''}>2. Details</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className={step >= 3 ? 'text-brand-brown-dark' : ''}>3. Payment</span>
                        </div>
                    )}

                    <div className="p-8">
                        
                        {/* STEP 1 */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="font-agency text-3xl text-brand-brown-dark">Select Amount</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {PRESET_AMOUNTS.map(amt => (
                                        <button key={amt} onClick={() => { setAmount(amt); setCustomAmount(''); }}
                                            className={`py-3 rounded-xl text-sm font-bold border transition-all ${amount === amt && !customAmount ? 'bg-brand-brown-dark text-white' : 'hover:border-brand-gold'}`}>
                                            ₦{amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₦</span>
                                    <input type="number" placeholder="Other Amount" value={customAmount} 
                                        onChange={(e) => { setCustomAmount(e.target.value); setAmount(Number(e.target.value)); }}
                                        className="w-full pl-8 py-4 bg-gray-50 rounded-xl border border-gray-200 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                    />
                                </div>
                                <button onClick={handleNextStep} className="w-full py-4 bg-brand-gold text-white font-bold rounded-xl shadow-lg hover:bg-brand-brown-dark transition-all flex justify-center items-center gap-2">
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="font-agency text-3xl text-brand-brown-dark">Your Details</h2>
                                <div className="relative"><User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400"/><input type="text" placeholder="Full Name (Optional)" value={donor.name} onChange={e => setDonor({...donor, name: e.target.value})} className="w-full pl-10 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold"/></div>
                                <div className="relative"><Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400"/><input type="email" placeholder="Email Address *" value={donor.email} onChange={e => setDonor({...donor, email: e.target.value})} className="w-full pl-10 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold"/></div>
                                <div className="relative"><Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400"/><input type="tel" placeholder="Phone (Optional)" value={donor.phone} onChange={e => setDonor({...donor, phone: e.target.value})} className="w-full pl-10 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold"/></div>
                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setStep(1)} className="px-6 py-4 bg-gray-100 rounded-xl font-bold text-gray-600">Back</button>
                                    <button onClick={handleNextStep} className="flex-1 py-4 bg-brand-gold text-white rounded-xl font-bold shadow-lg">Review</button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="bg-brand-sand/10 p-4 rounded-xl text-center">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Total Donation</p>
                                    <p className="text-3xl font-agency font-bold text-brand-brown-dark">₦{amount.toLocaleString()}</p>
                                </div>
                                
                                <div className="space-y-3">
                                    <button onClick={() => setPaymentMethod('paystack')} className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${paymentMethod === 'paystack' ? 'border-brand-gold bg-brand-sand/10' : 'border-gray-100'}`}>
                                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><CreditCard className="w-5 h-5"/></div>
                                        <div className="text-left"><span className="block font-bold text-sm">Pay Online</span><span className="text-xs text-gray-500">Instant Secure Payment</span></div>
                                        {paymentMethod === 'paystack' && <CheckCircle className="ml-auto w-5 h-5 text-brand-gold"/>}
                                    </button>

                                    <button onClick={() => setPaymentMethod('bank')} className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${paymentMethod === 'bank' ? 'border-brand-gold bg-brand-sand/10' : 'border-gray-100'}`}>
                                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><Landmark className="w-5 h-5"/></div>
                                        <div className="text-left"><span className="block font-bold text-sm">Bank Transfer</span><span className="text-xs text-gray-500">Manual Confirmation</span></div>
                                        {paymentMethod === 'bank' && <CheckCircle className="ml-auto w-5 h-5 text-brand-gold"/>}
                                    </button>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setStep(2)} className="px-6 py-4 bg-gray-100 rounded-xl font-bold text-gray-600">Back</button>
                                    <button 
                                        onClick={paymentMethod === 'paystack' ? handlePayNow : handleBankTransfer} 
                                        disabled={processing}
                                        className="flex-1 py-4 bg-brand-gold text-white rounded-xl font-bold shadow-lg flex justify-center items-center gap-2"
                                    >
                                        {processing ? <Loader2 className="animate-spin" /> : (paymentMethod === 'paystack' ? 'Pay Now' : 'Get Account Details')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: RESULT */}
                        {step === 4 && (
                            <div className="text-center space-y-6">
                                {paymentMethod === 'paystack' ? (
                                    <div className="animate-in zoom-in">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10"/></div>
                                        <h2 className="font-agency text-3xl text-brand-brown-dark">Donation Successful!</h2>
                                        <p className="text-sm text-gray-500">Thank you for your generosity. A receipt has been sent to your email.</p>
                                        <Link href="/" className="block mt-8 py-4 bg-gray-100 rounded-xl font-bold text-gray-600">Return Home</Link>
                                    </div>
                                ) : (
                                    <div className="animate-in slide-in-from-bottom">
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-left space-y-4">
                                            <div><p className="text-xs font-bold text-gray-400 uppercase">Bank Name</p><p className="font-bold">{bankDetails.bankName}</p></div>
                                            <div><p className="text-xs font-bold text-gray-400 uppercase">Account Number</p><div className="flex justify-between"><p className="font-mono text-xl font-bold text-brand-brown-dark">{bankDetails.accountNumber}</p><Copy className="w-4 h-4 text-gray-400 cursor-pointer"/></div></div>
                                            <div><p className="text-xs font-bold text-gray-400 uppercase">Reference Code (Important)</p><div className="bg-white p-2 border rounded font-mono text-sm text-brand-gold font-bold">{transactionRef}</div></div>
                                        </div>
                                        
                                        <div className="mt-6">
                                            <p className="text-sm font-bold text-gray-600 mb-2">Upload Proof (Optional)</p>
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                                                {proofUploading ? <Loader2 className="animate-spin text-gray-400"/> : proofFile ? <span className="text-green-600 font-bold text-sm flex gap-2"><CheckCircle className="w-4 h-4"/> Uploaded</span> : <div className="text-center text-gray-400"><UploadCloud className="w-6 h-6 mx-auto"/><span className="text-xs">Click to upload receipt</span></div>}
                                                <input type="file" className="hidden" onChange={handleProofUpload} disabled={proofUploading || proofFile} />
                                            </label>
                                        </div>

                                        <Link href="/" className="block mt-6 py-4 bg-brand-brown-dark text-white rounded-xl font-bold">I have sent the money</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
