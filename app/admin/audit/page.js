"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Search, FileText, User, Clock, Shield } from 'lucide-react';

export default function AuditLogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(100));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-20 p-4 sm:p-6 lg:p-8 font-lato">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-agency font-bold text-brand-brown-dark">System Audit Log</h1>
                    <p className="text-gray-500 text-sm">Track all administrative actions.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400">
                        <tr>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Summary</th>
                            <th className="px-6 py-4">Actor</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm">
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-100 rounded-md text-xs font-bold text-gray-600 font-mono">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-700">{log.summary}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-brand-sand/30 flex items-center justify-center text-[10px] font-bold text-brand-brown-dark">
                                            {log.actor?.displayName?.charAt(0)}
                                        </div>
                                        <span className="text-xs text-gray-500">{log.actor?.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {log.createdAt?.seconds ? new Date(log.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                </td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-12 text-gray-400">No logs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}