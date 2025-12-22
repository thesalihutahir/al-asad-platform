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
    MoreHorizontal 
} from 'lucide-react';

export default function ManageBlogsPage() {

    // Mock Data (Mirroring the structure of your public pages)
    const [posts, setPosts] = useState([
        { 
            id: 1, 
            title: "The Role of the Youth in Nation Building", 
            category: "Article", 
            author: "Sheikh Muneer", 
            date: "22 Dec 2024", 
            status: "Published",
            image: "/hero.jpg"
        },
        { 
            id: 2, 
            title: "Annual Qur'an Graduation Ceremony Announced", 
            category: "News", 
            author: "Admin", 
            date: "20 Dec 2024", 
            status: "Published",
            image: "/hero.jpg"
        },
        { 
            id: 3, 
            title: "Analysis of Zakat Distribution (PDF)", 
            category: "Research", 
            author: "Sheikh Muneer", 
            date: "15 Dec 2024", 
            status: "Draft",
            image: "/hero.jpg"
        },
    ]);

    // Handle Delete (Frontend Simulation)
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this post?")) {
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            
            {/* 1. HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Manage Blogs</h1>
                    <p className="font-lato text-sm text-gray-500">Create, edit, and manage articles, news, and research papers.</p>
                </div>
                <Link 
                    href="/admin/blogs/new" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md"
                >
                    <PlusCircle className="w-4 h-4" />
                    Create New Post
                </Link>
            </div>

            {/* 2. FILTERS & SEARCH */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search posts by title..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        <span>Filter Status</span>
                    </button>
                    <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50">
                        <option>All Categories</option>
                        <option>Articles</option>
                        <option>News & Updates</option>
                        <option>Research</option>
                    </select>
                </div>
            </div>

            {/* 3. POSTS TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Post Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                    
                                    {/* Post Details (Image + Title) */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                <Image src={post.image} alt={post.title} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-brand-brown-dark text-sm line-clamp-1 max-w-[200px]">{post.title}</h3>
                                                <p className="text-xs text-gray-400">ID: #{post.id}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                            post.category === 'Article' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            post.category === 'News' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            'bg-purple-50 text-purple-600 border-purple-100'
                                        }`}>
                                            {post.category}
                                        </span>
                                    </td>

                                    {/* Author */}
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {post.author}
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {post.date}
                                    </td>

                                    {/* Status */}
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

                                    {/* Actions */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-brand-brown-dark hover:bg-gray-100 rounded-lg transition-colors" title="View">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <Link href={`/admin/blogs/edit/${post.id}`}>
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Visual Only) */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <span>Showing 1-3 of 3 posts</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

        </div>
    );
}
