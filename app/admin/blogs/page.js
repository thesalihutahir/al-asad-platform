"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
    PlusCircle, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    Eye,
    MoreHorizontal,
    BookOpen,
    ScrollText,
    LayoutList
} from 'lucide-react';

export default function ManageBlogsPage() {

    // State for Tabs
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'series'

    // Mock Data: Article Series (Collections)
    const [articleSeries, setArticleSeries] = useState([
        {
            id: 1,
            title: "Ramadan Preparation Guide",
            count: 4,
            status: "Active",
            cover: "/hero.jpg"
        },
        {
            id: 2,
            title: "The Fiqh of Prayer (Salat)",
            count: 8,
            status: "Completed",
            cover: "/hero.jpg"
        }
    ]);

    // Mock Data: Posts
    const [posts, setPosts] = useState([
        { 
            id: 1, 
            title: "The Role of the Youth in Nation Building", 
            category: "Article", 
            series: "-", // Single Article
            author: "Sheikh Muneer", 
            date: "22 Dec 2024", 
            status: "Published",
            image: "/hero.jpg"
        },
        { 
            id: 2, 
            title: "Ramadan Prep: Part 1 - Intention", 
            category: "Article", 
            series: "Ramadan Preparation Guide", // Linked Series
            author: "Ustaz Ibrahim", 
            date: "20 Dec 2024", 
            status: "Published",
            image: "/hero.jpg"
        },
        { 
            id: 3, 
            title: "Analysis of Zakat Distribution (PDF)", 
            category: "Research", 
            series: "-", 
            author: "Sheikh Muneer", 
            date: "15 Dec 2024", 
            status: "Draft",
            image: "/hero.jpg"
        },
    ]);

    // Handle Delete (Frontend Simulation)
    const handleDelete = (id, type) => {
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            if (type === 'post') {
                setPosts(posts.filter(p => p.id !== id));
            } else {
                setArticleSeries(articleSeries.filter(s => s.id !== id));
            }
        }
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
                        <button 
                            onClick={() => alert("Open Create Series Modal")}
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-brown-dark text-white rounded-xl text-sm font-bold hover:bg-brand-gold transition-colors shadow-md"
                        >
                            <BookOpen className="w-4 h-4" />
                            Create Series
                        </button>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
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
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-brand-brown-dark text-sm line-clamp-1 max-w-[200px]">{post.title}</h3>
                                                    <p className="text-xs text-gray-400">{post.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {post.series !== '-' ? (
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
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 text-xs font-bold ${
                                                post.status === 'Published' ? 'text-green-600' : 'text-gray-400'
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full ${
                                                    post.status === 'Published' ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></span>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-brand-brown-dark hover:bg-gray-100 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                                                <Link href={`/admin/blogs/edit/${post.id}`}>
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                                                </Link>
                                                <button onClick={() => handleDelete(post.id, 'post')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- SERIES VIEW --- */}
                {activeTab === 'series' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articleSeries.map((series) => (
                                <div key={series.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-gold/30">
                                    {/* Cover */}
                                    <div className="relative w-full aspect-[2/1] bg-gray-100">
                                        <Image src={series.cover} alt={series.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="px-4 py-2 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full border border-white/50 hover:bg-brand-gold hover:border-brand-gold transition-colors">
                                                Manage Articles
                                            </button>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                            <ScrollText className="w-3 h-3" /> {series.count} Posts
                                        </div>
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest bg-brand-gold/10 px-2 py-0.5 rounded">
                                                Series
                                            </span>
                                            <button className="text-gray-400 hover:text-brand-brown-dark"><MoreHorizontal className="w-4 h-4" /></button>
                                        </div>
                                        <h3 className="font-agency text-lg text-brand-brown-dark leading-tight mb-2 line-clamp-2">
                                            {series.title}
                                        </h3>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
                                            <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded font-bold uppercase">{series.status}</span>
                                            <div className="flex gap-2">
                                                <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-3 h-3" /></button>
                                                <button onClick={() => handleDelete(series.id, 'series')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}
