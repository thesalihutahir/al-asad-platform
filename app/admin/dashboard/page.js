"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore'; 
// Context
import { useAuth } from '@/context/AuthContext';

import { 
    Users, 
    FileText, 
    Video, 
    Mic, 
    ArrowUpRight, 
    PlusCircle,
    Download,
    Loader2
} from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    
    // Data State
    const [counts, setCounts] = useState({
        volunteers: 0,
        blogs: 0,
        videos: 0,
        audios: 0
    });
    const [recentVolunteers, setRecentVolunteers] = useState([]);

    // --- FETCH DASHBOARD DATA ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Counts (Efficiently)
                const volCount = await getCountFromServer(collection(db, "volunteers"));
                const blogCount = await getCountFromServer(collection(db, "posts"));
                const vidCount = await getCountFromServer(collection(db, "videos"));
                const audioCount = await getCountFromServer(collection(db, "audios"));

                setCounts({
                    volunteers: volCount.data().count,
                    blogs: blogCount.data().count,
                    videos: vidCount.data().count,
                    audios: audioCount.data().count
                });

                // 2. Fetch Recent Volunteers (Limit 5)
                const volQuery = query(
                    collection(db, "volunteers"), 
                    orderBy("submittedAt", "desc"), 
                    limit(5)
                );
                const volSnapshot = await getDocs(volQuery);
                const volData = volSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecentVolunteers(volData);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper: Format Time Ago
    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    // Stats Configuration
    const stats = [
        { title: "Total Volunteers", value: counts.volunteers, icon: Users, color: "bg-blue-500" },
        { title: "Published Blogs", value: counts.blogs, icon: FileText, color: "bg-green-500" },
        { title: "Videos Uploaded", value: counts.videos, icon: Video, color: "bg-red-500" },
        { title: "Audio Lectures", value: counts.audios, icon: Mic, color: "bg-purple-500" },
    ];

    if (loading) {
        return (
            <div className="h-[50vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* 1. WELCOME HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Dashboard Overview</h1>
                    <p className="font-lato text-sm text-gray-500">
                        Welcome back, {user?.displayName || 'Administrator'}. Here is what's happening today.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <Link href="/admin/blogs/new" className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-white rounded-lg text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md">
                        <PlusCircle className="w-4 h-4" />
                        Create New
                    </Link>
                </div>
            </div>

            {/* 2. STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm ${stat.color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                                <h3 className="font-agency text-3xl text-brand-brown-dark">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 3. MAIN CONTENT SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Recent Volunteer Applications */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-agency text-xl text-brand-brown-dark">Recent Volunteer Requests</h2>
                        <Link href="/admin/volunteers" className="text-xs font-bold text-brand-gold hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Interest</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentVolunteers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-sm">No recent applications found.</td>
                                    </tr>
                                ) : (
                                    recentVolunteers.map((vol) => (
                                        <tr key={vol.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-brand-brown-dark">{vol.fullName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{vol.department}</td>
                                            <td className="px-6 py-4 text-xs text-gray-400">{formatTimeAgo(vol.submittedAt)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    vol.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    vol.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {vol.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href="/admin/volunteers" className="text-gray-400 hover:text-brand-gold">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-agency text-xl text-brand-brown-dark mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link href="/admin/blogs/new" className="block w-full p-4 rounded-xl border border-gray-100 hover:border-brand-gold hover:bg-brand-sand/20 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 text-green-600 p-2 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700 text-sm">Post New Blog</h3>
                                    <p className="text-xs text-gray-400">Write an article or update</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin/videos" className="block w-full p-4 rounded-xl border border-gray-100 hover:border-brand-gold hover:bg-brand-sand/20 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700 text-sm">Add YouTube Video</h3>
                                    <p className="text-xs text-gray-400">Link a new lecture</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/admin/audios" className="block w-full p-4 rounded-xl border border-gray-100 hover:border-brand-gold hover:bg-brand-sand/20 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Mic className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-700 text-sm">Upload Audio</h3>
                                    <p className="text-xs text-gray-400">Add MP3 sermon/tafsir</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

            </div>

        </div>
    );
}