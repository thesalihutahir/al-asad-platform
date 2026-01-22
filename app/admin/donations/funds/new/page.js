"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { 
    collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { 
    Search, Plus, TrendingUp, Users, Clock, 
    CreditCard, Landmark, CheckCircle, X, 
    MoreVertical, Eye, Trash2, Edit, Calendar, Mail, Phone, MessageSquare, Copy
} from 'lucide-react';

export default function AdminDonationsPage() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'funds'
    const [donations, setDonations] = useState([]);
    const [funds, setFunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Modals
    const [viewDonation, setViewDonation] = useState(null);
    const [viewFund, setViewFund] = useState(null);

    // --- FETCH DATA ---
    useEffect(() => {
        setLoading(true);
        
        // 1. Listen to Donations
        const qDonations = query(collection(db, "donations"), orderBy("createdAt", "desc"));
        const unsubDonations = onSnapshot(qDonations, (snapshot) => {
            setDonations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // 2. Listen to Funds
        const qFunds = query(collection(db, "donation_funds"), orderBy("createdAt", "desc"));
        const unsubFunds = onSnapshot(qFunds, (snapshot) => {
            setFunds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => {
            unsubDonations();
            unsubFunds();
        };
    }, []);

    // --- ACTIONS ---
    const verifyDonation = async (id) => {
        if(confirm("Confirm that you have received this payment?")) {
            await updateDoc(doc(db, "donations", id), { status: 'Success' });
            setViewDonation(prev => ({ ...prev, status: 'Success' })); // Update local modal state
        }
    };

    const deleteFund = async (id) => {
        if(confirm("Delete this fund? This will not delete historical donations associated with it.")) {
            await deleteDoc(doc(db, "donation_funds", id));
            setViewFund(null);
        }
    };

    const toggleFundStatus = async (fund) => {
        const newStatus = fund.status === 'Active' ? 'Paused' : 'Active';
        await updateDoc(doc(db, "donation_funds", fund.id), { status: newStatus });
        if(viewFund) setViewFund(prev => ({ ...prev, status: newStatus }));
    };

    // --- FILTERING ---
    const filteredDonations = donations.filter(d => {
        const matchesSearch = d.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              d.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              d.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // --- STATS CALCULATION ---
    const totalRaised = donations.filter(d => d.status === 'Success').reduce((acc, curr) => acc + curr.amount, 0);
    const totalDonors = new Set(donations.map(d => d.donorEmail)).size;
    const pendingCount = donations.filter(d => d.status === 'Pending').length;

    // --- HELPERS ---
    const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20">
            
            {/* HEADER & STATS */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Donations Manager</h1>
                        <p className="font-lato text-sm text-gray-500">Track inflows, verify transfers, and manage funds.</p>
                    </div>
                    {activeTab === 'funds' && (
                        <Link href="/admin/donations/funds/new">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl font-bold hover:bg-brand-brown-dark transition-colors shadow-md text-sm">
                                <Plus className="w-4 h-4" /> Create Fund
                            </button>
                        </Link>
                    )}
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600"><TrendingUp className="w-6 h-6" /></div>
                        <div><p className="text-xs text-gray-400 font-bold uppercase">Total Raised</p><h3 className="text-2xl font-agency text-brand-brown-dark">{formatCurrency(totalRaised)}</h3></div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Users className="w-6 h-6" /></div>
                        <div><p className="text-xs text-gray-400 font-bold uppercase">Unique Donors</p><h3 className="text-2xl font-agency text-brand-brown-dark">{totalDonors}</h3></div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600"><Clock className="w-6 h-6" /></div>
                        <div><p className="text-xs text-gray-400 font-bold uppercase">Pending Verification</p><h3 className="text-2xl font-agency text-brand-brown-dark">{pendingCount}</h3></div>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-2 border-b border-gray-200">
                    <button onClick={() => setActiveTab('transactions')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'transactions' ? 'border-brand-gold text-brand-brown-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Transactions</button>
                    <button onClick={() => setActiveTab('funds')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'funds' ? 'border-brand-gold text-brand-brown-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Manage Funds</button>
                </div>
            </div>

            {/* --- TAB 1: TRANSACTIONS --- */}
            {activeTab === 'transactions' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search donor, email, or reference..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-gold/20" />
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {['All', 'Success', 'Pending', 'Failed'].map(status => (
                                <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${statusFilter === status ? 'bg-brand-brown-dark text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>{status}</button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Donor</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Fund / Method</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredDonations.length > 0 ? (
                                        filteredDonations.map((d) => (
                                            <tr key={d.id} onClick={() => setViewDonation(d)} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-sm text-gray-800">{d.donorName}</div>
                                                    <div className="text-xs text-gray-400">{d.donorEmail}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-brand-brown-dark">{formatCurrency(d.amount)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs font-bold text-gray-600 mb-1">{d.fundTitle || 'General Fund'}</div>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase">
                                                        {d.method === 'paystack' ? <CreditCard className="w-3 h-3" /> : <Landmark className="w-3 h-3" />}
                                                        {d.method}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${d.status === 'Success' ? 'bg-green-50 text-green-700' : d.status === 'Pending' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${d.status === 'Success' ? 'bg-green-500' : d.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                                                        {d.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">{formatDate(d.createdAt)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => setViewDonation(d)} className="p-2 text-gray-400 hover:text-brand-brown-dark rounded-lg hover:bg-gray-100 transition-colors"><Eye className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">No transactions found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 2: FUNDS --- */}
            {activeTab === 'funds' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {funds.map((fund) => (
                        <div key={fund.id} onClick={() => setViewFund(fund)} className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                            <div className="relative h-32 bg-gray-200">
                                <Image src={fund.coverImage || "/fallback.webp"} alt={fund.title} fill className="object-cover" />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase backdrop-blur-sm ${fund.status === 'Active' ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                                        {fund.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-agency text-xl text-brand-brown-dark mb-1">{fund.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{fund.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Landmark className="w-3 h-3"/> {fund.bankDetails?.bankName || "No Bank"}</span>
                                    <span className="p-1.5 text-gray-300 hover:text-brand-gold bg-gray-50 rounded-md transition-colors"><Eye className="w-4 h-4" /></span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Add Fund Card */}
                    <Link href="/admin/donations/funds/new" className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors bg-gray-50/50 hover:bg-white min-h-[250px]">
                        <Plus className="w-10 h-10 mb-2 opacity-50" />
                        <span className="font-bold text-sm">Create New Fund</span>
                    </Link>
                </div>
            )}

            {/* --- MODAL 1: VIEW DONATION DETAILS --- */}
            {viewDonation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-brand-brown-dark p-6 text-white flex justify-between items-start">
                            <div>
                                <h3 className="font-agency text-2xl mb-1">Donation Details</h3>
                                <div className="flex items-center gap-2 text-white/70 text-xs">
                                    <Clock className="w-3 h-3" /> {formatDate(viewDonation.createdAt)}
                                </div>
                            </div>
                            <button onClick={() => setViewDonation(null)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Amount Donated</span>
                                <span className="block text-4xl font-agency text-brand-gold">{formatCurrency(viewDonation.amount)}</span>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase mt-2 ${viewDonation.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {viewDonation.status}
                                </span>
                            </div>

                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-2"><User className="w-4 h-4"/> Donor Name</span>
                                    <span className="font-bold text-gray-800">{viewDonation.donorName}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-2"><Mail className="w-4 h-4"/> Email</span>
                                    <span className="font-bold text-gray-800">{viewDonation.donorEmail}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 flex items-center gap-2"><Phone className="w-4 h-4"/> Phone</span>
                                    <span className="font-bold text-gray-800">{viewDonation.donorPhone || "N/A"}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                    <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Reference ID</span>
                                    <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                                        <span className="font-mono text-xs font-bold text-gray-600">{viewDonation.reference}</span>
                                        <button onClick={() => copyToClipboard(viewDonation.reference)}><Copy className="w-3 h-3 text-gray-400 hover:text-brand-gold" /></button>
                                    </div>
                                </div>
                            </div>

                            {viewDonation.message && (
                                <div className="mb-6">
                                    <span className="text-xs font-bold text-gray-400 uppercase block mb-2">Message from Donor</span>
                                    <p className="text-sm text-gray-600 italic bg-brand-sand/10 p-3 rounded-lg border-l-4 border-brand-gold">
                                        "{viewDonation.message}"
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3">
                                {viewDonation.status === 'Pending' && (
                                    <button onClick={() => verifyDonation(viewDonation.id)} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                                        Confirm Payment
                                    </button>
                                )}
                                <button onClick={() => setViewDonation(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: VIEW FUND DETAILS --- */}
            {viewFund && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Fund Image Header */}
                        <div className="relative h-40 bg-gray-200">
                            <Image src={viewFund.coverImage || "/fallback.webp"} alt={viewFund.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <button onClick={() => setViewFund(null)} className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm"><X className="w-5 h-5" /></button>
                            <div className="absolute bottom-4 left-6 right-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase backdrop-blur-sm ${viewFund.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{viewFund.status}</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/20 text-white backdrop-blur-sm">{viewFund.visibility}</span>
                                </div>
                                <h3 className="font-agency text-3xl text-white leading-none">{viewFund.title}</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-gray-600 leading-relaxed mb-6">{viewFund.description}</p>

                            <div className="bg-brand-sand/10 rounded-2xl p-5 border border-brand-gold/20 mb-6">
                                <h4 className="text-xs font-bold text-brand-brown-dark uppercase tracking-wider mb-3 flex items-center gap-2"><Landmark className="w-4 h-4"/> Bank Configuration</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="block text-gray-400 text-xs">Bank Name</span><span className="font-bold text-gray-800">{viewFund.bankDetails?.bankName}</span></div>
                                    <div><span className="block text-gray-400 text-xs">Account Number</span><span className="font-mono font-bold text-brand-brown-dark">{viewFund.bankDetails?.accountNumber}</span></div>
                                    <div className="col-span-2"><span className="block text-gray-400 text-xs">Account Name</span><span className="font-bold text-gray-800">{viewFund.bankDetails?.accountName}</span></div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button onClick={() => deleteFund(viewFund.id)} className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors">Delete Fund</button>
                                <button onClick={() => toggleFundStatus(viewFund)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold transition-colors">
                                    {viewFund.status === 'Active' ? 'Pause Fund' : 'Activate Fund'}
                                </button>
                                <Link href={`/admin/donations/funds/edit/${viewFund.id}`} className="px-6 py-2 bg-brand-brown-dark text-white rounded-lg text-xs font-bold hover:bg-brand-gold transition-colors">
                                    Edit Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
