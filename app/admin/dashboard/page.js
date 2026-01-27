"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Firebase
import { db } from '@/lib/firebase';
import { 
    collection, query, orderBy, limit, onSnapshot, 
    getCountFromServer, where, getDocs 
} from 'firebase/firestore'; 
// Context
import { useAuth } from '@/context/AuthContext';

import { 
    Users, 
    FileText, 
    Handshake, 
    TrendingUp,
    Loader2,
    Shield,
    Clock,
    FileBarChart,
    Search
} from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    
    // Stats State
    const [stats, setStats] = useState({
        donationAmount: 0,
        donationCount: 0,
        volunteers: 0,
        partners: 0,
        contentCount: 0 // Blogs (Articles + News + Research)
    });

    // Audit Logs State
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // --- 1. FETCH STATS ---
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // A. Donations (Sum & Count of Successful ones)
                const donationsRef = collection(db, "donations");
                const qDonations = query(donationsRef, where("status", "==", "Success"));
                const donationSnapshot = await getDocs(qDonations);
                
                const totalRaised = donationSnapshot.docs.reduce((acc, doc) => acc + Number(doc.data().amount || 0), 0);
                const totalDonations = donationSnapshot.size;

                // B. Volunteers Count
                const volSnap = await getCountFromServer(collection(db, "volunteers"));
                
                // C. Partners Count
                const partnerSnap = await getCountFromServer(collection(db, "partners"));

                // D. Content Count (Articles + News + Research)
                // We check all 3 collections used in your Blog creation page
                const articlesSnap = await getCountFromServer(collection(db, "articles"));
                const newsSnap = await getCountFromServer(collection(db, "news"));
                const researchSnap = await getCountFromServer(collection(db, "research"));
                const totalContent = articlesSnap.data().count + newsSnap.data().count + researchSnap.data().count;

                setStats({
                    donationAmount: totalRaised,
                    donationCount: totalDonations,
                    volunteers: volSnap.data().count,
                    partners: partnerSnap.data().count,
                    contentCount: totalContent
                });

            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    // --- 2. FETCH AUDIT LOGS (Real-time) ---
    useEffect(() => {
        const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- HELPERS ---
    const filteredLogs = logs.filter(log => 
        log.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actor?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats Configuration
    const statCards = [
        { 
            title: "Total Donations", 
            value: `₦${stats.donationAmount.toLocaleString()}`, 
            sub: `${stats.donationCount} successful transactions`,
            icon: TrendingUp, 
            color: "bg-green-100 text-green-600" 
        },
        { 
            title: "Active Volunteers", 
            value: stats.volunteers, 
            sub: "Registered members",
            icon: Users, 
            color: "bg-blue-100 text-blue-600" 
        },
        { 
            title: "Partnerships", 
            value: stats.partners, 
            sub: "Organizations & Sponsors",
            icon: Handshake, 
            color: "bg-purple-100 text-purple-600" 
        },
        { 
            title: "Published Content", 
            value: stats.contentCount, 
            sub: "Blogs, News & Research",
            icon: FileText, 
            color: "bg-orange-100 text-orange-600" 
        },
    ];

    if (loading) {
        return (
            <div className="h-[50vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 p-4 sm:p-6 lg:p-8 font-lato space-y-8">

            {/* 1. WELCOME HEADER */}
            <div>
                <h1 className="font-agency text-3xl text-brand-brown-dark">Dashboard Overview</h1>
                <p className="font-lato text-sm text-gray-500">
                    Welcome back, {user?.displayName || 'Administrator'}. System status as of today.
                </p>
            </div>

            {/* 2. STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-agency text-3xl font-bold text-gray-800">{stat.value}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                                <p className="text-[10px] text-gray-500">{stat.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. AUDIT LOG SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Audit Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-agency text-xl text-brand-brown-dark flex items-center gap-2">
                            <Shield className="w-5 h-5 text-brand-gold" /> System Audit Log
                        </h2>
                        <p className="text-xs text-gray-500">Real-time tracking of administrative actions.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search actions, emails..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 w-full md:w-64"
                        />
                    </div>
                </div>

                {/* Audit Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Summary</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        No logs found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 font-mono uppercase tracking-wide">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">
                                            {log.summary}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-brand-sand/30 flex items-center justify-center text-[10px] font-bold text-brand-brown-dark uppercase">
                                                    {log.actor?.displayName?.charAt(0) || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-800">{log.actor?.displayName || 'Unknown'}</span>
                                                    <span className="text-[10px] text-gray-500">{log.actor?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {log.createdAt?.seconds 
                                                    ? new Date(log.createdAt.seconds * 1000).toLocaleString() 
                                                    : 'Just now'}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer Link */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <Link href="/admin/audit" className="text-xs font-bold text-brand-brown-dark hover:text-brand-gold uppercase tracking-widest flex items-center justify-center gap-1">
                        View Full History <FileBarChart className="w-3 h-3" />
                    </Link>
                </div>
            </div>

        </div>
    );
}
