"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Firebase
import { db } from '@/lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

import { 
    PlusCircle, 
    Search, 
    Edit, 
    Trash2, 
    Eye, 
    BookOpen,
    ScrollText,
    LayoutList,
    Loader2,
    MoreVertical
} from 'lucide-react';

export default function ManageBlogsPage() {

    // State for Tabs
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'series'
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [posts, setPosts] = useState([]);
    const [series, setSeries] = useState([]);

    // 1. FETCH DATA FROM FIREBASE (Real-time Listener)
    useEffect(() => {
        setIsLoading(true);

        // Query: Get all posts
        const qPosts = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubPosts = onSnapshot(qPosts, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(postsData);
        });

        // Query: Get all series
        const qSeries = query(collection(db, "blog_series"), orderBy("createdAt", "desc"));
        const unsubSeries = onSnapshot(qSeries, (snapshot) => {
            const seriesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSeries(seriesData);
            setIsLoading(false);
        });

        // Cleanup subscriptions
        return () => {
            unsubPosts();
            unsubSeries();
        };
    }, []);

    // 2. HANDLE DELETE
    const handleDelete = async (id, type) => {
        if (!confirm(`Are you sure you want to delete this ${type}? This cannot be undone.`)) return;

        try {
            if (type === 'post') {
                await deleteDoc(doc(db, "posts", id));
            } else {
                await deleteDoc(doc(db, "blog_series", id));
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Failed to delete. Check console.");
        }
    };

    // Helper: Count posts in a series
    const getSeriesCount = (seriesTitle) => {
        if (!posts) return 0;
        return posts.filter(p => p.series === seriesTitle).length;
    };

    return (
        <div className="space-y-6">

            {/* 1. HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Blog & Research Manager</h1>
                    <p className="font-lato text-sm text-gray-500">Manage articles, news, research papers, and multi-part series.</p>
                </div>
                <div className="flex gap-3">
                    {activeTab === 'posts' ? (
                        <Link 
                            href="/admin/blogs/new" 
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Create New Post
                        </Link>
                    ) : (
                        <Link 
                            href="/admin/blogs/series/new"
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-brown-dark text-white rounded-xl text-sm font-bold hover:bg-brand-gold transition-colors shadow-md"
                        >
                            <BookOpen className="w-4 h-4" />
                            Create Series
                        </Link>
                    )}
                </div>
            </div>

            {/* 2. TABS & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">

                {/* Tab Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'posts' 
                            ? 'bg-white text-brand-brown-dark shadow-sm' 
                            : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <ScrollText className="w-4 h-4" /> All Posts
                    </button>
                    <button 
                        onClick={() => setActiveTab('series')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'series' 
                            ? 'bg-white text-brand-brown-dark shadow-sm' 
                            : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <LayoutList className="w-4 h-4" /> Article Series
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={`Search ${activeTab}...`}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    />
                </div>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* --- POSTS VIEW --- */}
                        {activeTab === 'posts' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Post Details</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Series</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {posts.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                                    No posts found. Create your first one!
                                                </td>
                                            </tr>
                                        ) : (
                                            posts.map((post) => (
                                                <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                                                <Image src={post.coverImage || "/fallback.webp"} alt={post.title} fill className="object-cover" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-brand-brown-dark text-sm line-clamp-1 max-w-[200px]">{post.title}</h3>
                                                                {post.pdfName && (
                                                                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">PDF Attached</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {post.series ? (
                                                            <span className="inline-flex items-center gap-1.5 text-xs text-brand-brown font-medium bg-brand-sand/30 px-2 py-1 rounded-md">
                                                                <BookOpen className="w-3 h-3 text-brand-brown-dark" />
                                                                {post.series}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">Single Post</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                                            post.category === 'Article' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            post.category === 'News' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            'bg-purple-50 text-purple-600 border-purple-100'
                                                        }`}>
                                                            {post.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {post.author}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                                        {post.date}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <Link href={`/news/${post.id}`} target="_blank">
                                                                <button className="p-2 text-gray-400 hover:text-brand-brown-dark hover:bg-gray-100 rounded-lg transition-colors" title="View Live">
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            </Link>
                                                            {/* Edit Button Links to Dynamic Page */}
                                                            <Link href={`/admin/blogs/edit/${post.id}`}>
                                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Post">
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(post.id, 'post')} 
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* --- SERIES VIEW --- */}
                        {activeTab === 'series' && (
                            <div className="p-6">
                                {series.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <LayoutList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No series created yet. Click "Create Series" to start.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {series.map((item) => (
                                            <div key={item.id} className="group border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-lg transition-all bg-white relative">
                                                <div className="relative w-20 h-28 flex-shrink-0 shadow-md transform group-hover:-rotate-2 transition-transform">
                                                    <Image src={item.cover || "/fallback.webp"} alt={item.title} fill className="object-cover rounded" />
                                                    <div className="absolute top-1 -right-1 w-full h-full bg-gray-200 rounded -z-10 border border-gray-300"></div>
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-1 block">{item.category}</span>
                                                        <button onClick={() => handleDelete(item.id, 'series')} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                    <h3 className="font-agency text-lg text-brand-brown-dark leading-tight mb-2 line-clamp-2">{item.title}</h3>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
                                                        <ScrollText className="w-3 h-3" /> {getSeriesCount(item.title)} Posts
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    );
}