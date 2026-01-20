"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { ArrowLeft, Loader2, Search, CreditCard, Calendar } from 'lucide-react';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch last 50 transactions
        const q = query(collection(db, "donations"), orderBy("createdAt", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/donations" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="font-agency text-3xl text-brand-brown-dark">Donation History</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-gold" /></div>
                ) : transactions.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">No donations yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Donor</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cause</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Reference</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-800 text-sm">{tx.donorName}</p>
                                            <p className="text-xs text-gray-500">{tx.donorEmail}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-green-700">₦{tx.amount?.toLocaleString()}</span>
                                            <span className="text-[10px] text-gray-400 block">+₦{tx.fee?.toLocaleString()} fee</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{tx.projectTitle}</td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{tx.reference}</td>
                                        <td className="px-6 py-4 text-xs text-gray-500">{formatDate(tx.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}