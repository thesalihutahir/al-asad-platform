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
    Trash2, Edit, Eye, FileText, 
    Mail, Phone, Copy, AlertTriangle
} from 'lucide-react';

export default function AdminDonationsPage() {
    // --- STATE ---
    const [activeTab, setActiveTab] = useState('transactions'); 
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
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDonations(data);
        });

        // 2. Listen to Funds
        const qFunds = query(collection(db, "donation_funds"), orderBy("createdAt", "desc"));
        const unsubFunds = onSnapshot(qFunds, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFunds(data);
            setLoading(false);
        });

        return () => {
            unsubDonations();
            unsubFunds();
        };
    }, []);

    // --- ACTIONS ---
    const verifyDonation = async (donation) => {
        if(confirm(`Confirm receipt of ₦${donation.amount.toLocaleString()} from ${donation.donorName}?`)) {
            await updateDoc(doc(db, "donations", donation.id), { status: 'Success' });
            setViewDonation(null); 
        }
    };

    const deleteDonation = async (id) => {
        if(confirm("Delete this transaction record? This cannot be undone.")) {
            await deleteDoc(doc(db, "donations", id));
            setViewDonation(null);
        }
    };

    const deleteFund = async (id) => {
        if(confirm("Delete this fund? This will NOT delete associated donations, but the fund will disappear from the public site.")) {
            await deleteDoc(doc(db, "donation_funds", id));
            setViewFund(null);
        }
    };

    const toggleFundStatus = async (fund) => {
        const newStatus = fund.status === 'Active' ? 'Paused' : 'Active';
        await updateDoc(doc(db, "donation_funds", fund.id), { status: newStatus });
    };

    // --- FILTERS (SAFE) ---
    const filteredDonations = donations.filter(d => {
        const searchLower = searchTerm.toLowerCase();
        // Safe check using || "" to prevent undefined errors hiding rows
        const matchesSearch = (d.donorName || "").toLowerCase().includes(searchLower) || 
                              (d.reference || "").toLowerCase().includes(searchLower) ||
                              (d.donorEmail || "").toLowerCase().includes(searchLower);
        const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // --- STATS ---
    const totalRaised = donations.filter(d => d.status === 'Success').reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalDonors = new Set(donations.map(d => d.donorEmail)).size;
    const pendingCount = donations.filter(d => d.status === 'Pending').length;

    // --- HELPERS ---
    const formatCurrency = (amount) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
    
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 relative">
            
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
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
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
                                                    <div className="font-bold text-sm text-gray-800">{d.donorName || "Anonymous"}</div>
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
                                                    <button className="p-2 text-gray-400 hover:text-brand-gold bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400 text-sm">No transactions found.</td></tr>
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
                                <div className="absolute top-2 right-2 flex gap-1" onClick={(e) => e.stopPropagation()}>
                                    <button onClick={() => toggleFundStatus(fund)} className={`px-2 py-1 rounded text-[10px] font-bold uppercase backdrop-blur-sm ${fund.status === 'Active' ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                                        {fund.status}
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-agency text-xl text-brand-brown-dark mb-1">{fund.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{fund.description}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-gray-400">{fund.bankDetails?.bankName || "No Bank"}</span>
                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <Link href={`/admin/donations/funds/edit/${fund.id}`}>
                                            <button className="p-1.5 text-gray-400 hover:text-brand-brown-dark hover:bg-gray-100 rounded-md transition-colors"><Edit className="w-4 h-4" /></button>
                                        </Link>
                                        <button onClick={() => deleteFund(fund.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <Link href="/admin/donations/funds/new" className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-brand-gold hover:text-brand-gold transition-colors bg-gray-50/50 hover:bg-white min-h-[250px]">
                        <Plus className="w-10 h-10 mb-2 opacity-50" />
                        <span className="font-bold text-sm">Create New Fund</span>
                    </Link>
                </div>
            )}

            {/* --- MODAL: VIEW DONATION DETAILS --- */}
            {viewDonation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-brand-brown-dark px-6 py-4 flex justify-between items-center text-white">
                            <h3 className="font-agency text-xl">Transaction Details</h3>
                            <button onClick={() => setViewDonation(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="text-center pb-4 border-b border-gray-100">
                                <span className="block text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Amount Donated</span>
                                <h2 className="text-4xl font-bold text-brand-gold">{formatCurrency(viewDonation.amount)}</h2>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 mt-3 rounded-full text-xs font-bold uppercase ${viewDonation.status === 'Success' ? 'bg-green-50 text-green-700' : viewDonation.status === 'Pending' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                                    {viewDonation.status === 'Success' && <CheckCircle className="w-3 h-3" />}
                                    {viewDonation.status === 'Pending' && <Clock className="w-3 h-3" />}
                                    {viewDonation.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-xs text-gray-400 font-bold uppercase">Fund</p><p className="font-bold text-gray-700">{viewDonation.fundTitle || 'General Fund'}</p></div>
                                <div><p className="text-xs text-gray-400 font-bold uppercase">Payment Method</p><p className="font-bold text-gray-700 capitalize">{viewDonation.method}</p></div>
                                <div><p className="text-xs text-gray-400 font-bold uppercase">Reference</p><div className="flex items-center gap-1"><span className="font-mono font-bold text-gray-700 text-xs">{viewDonation.reference}</span><button onClick={() => copyToClipboard(viewDonation.reference)}><Copy className="w-3 h-3 text-gray-400 hover:text-brand-gold" /></button></div></div>
                                <div><p className="text-xs text-gray-400 font-bold uppercase">Date</p><p className="font-bold text-gray-700">{formatDate(viewDonation.createdAt)}</p></div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-100"><Users className="w-4 h-4" /></div>
                                    <div><p className="text-xs text-gray-400 font-bold">Donor Name</p><p className="text-sm font-bold text-gray-800">{viewDonation.donorName}</p></div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-100"><Mail className="w-4 h-4" /></div>
                                    <div><p className="text-xs text-gray-400 font-bold">Email</p><p className="text-sm font-bold text-gray-800">{viewDonation.donorEmail}</p></div>
                                </div>
                                {viewDonation.donorPhone && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-100"><Phone className="w-4 h-4" /></div>
                                        <div><p className="text-xs text-gray-400 font-bold">Phone</p><p className="text-sm font-bold text-gray-800">{viewDonation.donorPhone}</p></div>
                                    </div>
                                )}
                            </div>

                            {viewDonation.message && (
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase mb-2">Donor Message</p>
                                    <div className="bg-brand-sand/20 p-3 rounded-xl text-sm text-brand-brown-dark italic border border-brand-gold/20">
                                        "{viewDonation.message}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                            {viewDonation.status === 'Pending' && (
                                <button onClick={() => verifyDonation(viewDonation)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Verify Payment
                                </button>
                            )}
                            <button onClick={() => deleteDonation(viewDonation.id)} className="px-4 py-2 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
                                <Trash2 className="w-4 h-4" /> Delete Record
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL: VIEW FUND DETAILS --- */}
            {viewFund && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative">
                        <button onClick={() => setViewFund(null)} className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-sm"><X className="w-5 h-5" /></button>
                        
                        <div className="relative w-full h-48 bg-gray-200">
                            <Image src={viewFund.coverImage || "/fallback.webp"} alt={viewFund.title} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <h2 className="font-agency text-3xl mb-1">{viewFund.title}</h2>
                                <p className="text-xs font-bold text-brand-gold uppercase tracking-widest">{viewFund.tagline}</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Description</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{viewFund.description}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Landmark className="w-4 h-4" /> Bank Configuration</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="block text-xs text-gray-400">Bank Name</span><span className="font-bold text-gray-700">{viewFund.bankDetails?.bankName}</span></div>
                                    <div><span className="block text-xs text-gray-400">Account Number</span><span className="font-mono font-bold text-gray-700">{viewFund.bankDetails?.accountNumber}</span></div>
                                    <div className="col-span-2"><span className="block text-xs text-gray-400">Account Name</span><span className="font-bold text-gray-700">{viewFund.bankDetails?.accountName}</span></div>
                                </div>
                            </div>

                            <div className="flex gap-4 text-sm">
                                <div className="flex-1 bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                                    <span className="block text-xs font-bold text-green-700 uppercase">Status</span>
                                    <span className="font-bold text-gray-800">{viewFund.status}</span>
                                </div>
                                <div className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
                                    <span className="block text-xs font-bold text-blue-700 uppercase">Visibility</span>
                                    <span className="font-bold text-gray-800">{viewFund.visibility}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100">
                            <Link href={`/admin/donations/funds/edit/${viewFund.id}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
                                <Edit className="w-4 h-4" /> Edit
                            </Link>
                            <button onClick={() => deleteFund(viewFund.id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}