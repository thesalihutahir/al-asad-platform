"use client";

import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, Banknote, Users, CheckCircle, Loader2, Target, Wallet } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Link from 'next/link';

export default function DonatePage() {
    // Data State
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    // Form State
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(5000);
    const [customAmount, setCustomAmount] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Static presets for quick selection
    const PRESET_AMOUNTS = [1000, 2500, 5000, 10000, 20000, 50000];

    // 1. Fetch Projects from Firebase
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const q = query(
                    collection(db, "donation_projects"),
                    where("status", "==", "Active"),
                    orderBy("createdAt", "desc")
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                setProjects(data);
                
                // Select the first project by default if available
                if (data.length > 0) setSelectedProject(data[0]);

            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchProjects();
    }, []);

    // Handle Amount Logic
    const handleAmountChange = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomChange = (e) => {
        const value = e.target.value;
        setCustomAmount(value);
        setSelectedAmount(parseInt(value) || 0);
    };

    // Simulate Payment
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if(selectedAmount < 100) {
            alert("Minimum donation amount is ₦100");
            return;
        }

        setLoadingPayment(true);
        setIsSuccess(false);

        // --- Simulated Payment Gateway Interaction ---
        setTimeout(() => {
            console.log(`Processing ₦${selectedAmount} for ${selectedProject?.title || 'General Fund'} (${isRecurring ? 'Recurring' : 'One-time'})`);
            setLoadingPayment(false);
            setIsSuccess(true);
            // Integration with Paystack/Flutterwave comes here later
        }, 2000);
    };

    const currencyCode = '₦';

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-lato">
            <Header />
            <main className="flex-grow pt-10 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-agency text-brand-brown-dark mb-3">
                            Invest in a Life. Donate Now.
                        </h1>
                        <p className="text-lg text-brand-brown max-w-2xl mx-auto font-lato">
                            Your contribution directly funds education, essential resources, and community resilience. Choose a cause below.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* LEFT: Project Selection */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            <h2 className="text-2xl font-agency text-brand-brown-dark flex items-center gap-2">
                                <Target className="w-5 h-5 text-brand-gold" /> Select a Cause
                            </h2>

                            {loadingProjects ? (
                                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
                            ) : projects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {projects.map((project) => (
                                        <button
                                            key={project.id}
                                            onClick={() => setSelectedProject(project)}
                                            className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md ${
                                                selectedProject?.id === project.id 
                                                ? 'border-brand-gold bg-brand-sand/20 ring-1 ring-brand-gold' 
                                                : 'border-gray-200 bg-white hover:border-brand-gold/50'
                                            }`}
                                        >
                                            <h3 className="font-bold text-brand-brown-dark text-lg mb-1">{project.title}</h3>
                                            <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
                                            {project.accountNumber && (
                                                <div className="mt-3 pt-3 border-t border-gray-200/50 flex items-center gap-2 text-xs text-gray-400 font-mono">
                                                    <Wallet className="w-3 h-3" /> {project.bankName}: {project.accountNumber}
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    {/* General Fund Option (Always there) */}
                                    <button
                                        onClick={() => setSelectedProject({ id: 'general', title: 'General Fund', description: 'Used where needed most.' })}
                                        className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md ${
                                            selectedProject?.id === 'general' 
                                            ? 'border-brand-gold bg-brand-sand/20 ring-1 ring-brand-gold' 
                                            : 'border-gray-200 bg-white hover:border-brand-gold/50'
                                        }`}
                                    >
                                        <h3 className="font-bold text-brand-brown-dark text-lg mb-1">General Fund</h3>
                                        <p className="text-xs text-gray-500">Allocated where the need is greatest.</p>
                                    </button>
                                </div>
                            ) : (
                                <p className="text-gray-500">No specific projects active. Donations go to General Fund.</p>
                            )}
                        </div>

                        {/* RIGHT: Payment Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
                                
                                {isSuccess ? (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce" />
                                        <h2 className="text-2xl font-agency text-gray-800">Payment Successful!</h2>
                                        <p className="text-sm text-gray-600 mt-2">
                                            May Allah reward you. Your ₦{selectedAmount.toLocaleString()} donation to <strong>{selectedProject?.title}</strong> has been recorded.
                                        </p>
                                        <button onClick={() => setIsSuccess(false)} className="mt-6 text-brand-gold font-bold text-sm hover:underline">
                                            Donate Again
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        
                                        {/* Frequency */}
                                        <div className="flex bg-gray-100 p-1 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setIsRecurring(false)}
                                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isRecurring ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500'}`}
                                            >
                                                One-Time
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsRecurring(true)}
                                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isRecurring ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500'}`}
                                            >
                                                Monthly
                                            </button>
                                        </div>

                                        {/* Amount Grid */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Select Amount ({currencyCode})</label>
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                {PRESET_AMOUNTS.map((amt) => (
                                                    <button
                                                        key={amt}
                                                        type="button"
                                                        onClick={() => handleAmountChange(amt)}
                                                        className={`py-2 px-1 rounded-lg text-sm font-bold border transition-colors ${
                                                            selectedAmount === amt && customAmount === ''
                                                            ? 'bg-brand-brown-dark text-white border-brand-brown-dark'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-brand-gold'
                                                        }`}
                                                    >
                                                        {amt.toLocaleString()}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{currencyCode}</span>
                                                <input
                                                    type="number"
                                                    placeholder="Custom Amount"
                                                    value={customAmount}
                                                    onChange={handleCustomChange}
                                                    onFocus={() => setSelectedAmount(0)}
                                                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 font-bold text-gray-700"
                                                />
                                            </div>
                                        </div>

                                        {/* Donor Details */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Your Information</label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                                <input type="text" placeholder="Full Name (Optional)" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-sm" />
                                            </div>
                                            <div className="relative">
                                                <Banknote className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                                <input type="email" placeholder="Email Address *" required className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold/50 text-sm" />
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={loadingPayment || selectedAmount < 100}
                                            className="w-full py-4 bg-brand-gold text-white font-agency text-xl rounded-xl hover:bg-brand-brown-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:transform-none disabled:cursor-not-allowed"
                                        >
                                            {loadingPayment ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <Heart className="w-5 h-5 fill-white" /> Donate {currencyCode}{selectedAmount.toLocaleString()}
                                                </>
                                            )}
                                        </button>
                                        
                                        <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Secure Payment
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}