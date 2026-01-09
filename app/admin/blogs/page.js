"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
// Global Modal & Loader
import { useModal } from '@/context/ModalContext';
import Loader from '@/components/Loader'; 

import { 
    PlusCircle, Search, Edit, Trash2, 
    FileText, Bell, BookOpen, // Icons for types
    Filter, X, ArrowUpDown, Calendar
} from 'lucide-react';

export default function ManageBlogsPage() {
    const router = useRouter();
    const { showSuccess, showConfirm } = useModal(); 

    const [activeTab, setActiveTab] = useState('articles'); // 'articles', 'news', 'research'
    const [isLoading, setIsLoading] = useState(true);
    const [contentList, setContentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. FETCH DATA BASED ON TAB
    useEffect(() => {
        setIsLoading(true);
        const collectionName = activeTab; // 'articles', 'news', or 'research'
        
        const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setContentList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [activeTab]);

    // 2. SEARCH FILTER
    const filteredContent = contentList.filter(item => {
        const title = item.title || item.headline || item.researchTitle || '';
        return title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // 3. DELETE ACTION
    const handleDelete = (id) => {
        showConfirm({
            title: "Delete Content?",
            message: "This action cannot be undone.",
            type: 'danger', 
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, activeTab, id));
                    showSuccess({ title: "Deleted", message: "Content removed successfully." });
                } catch (error) {
                    console.error("Delete error:", error);
                    alert("Failed to delete.");
                }
            }
        });
    };

    // 4. EDIT ACTION
    const handleEdit = (id) => {
        // We pass the type as a query param or separate route
        router.push(`/admin/blogs/edit/${id}?type=${activeTab}`);
    };

    return (
        <div className="space-y-6 relative">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Content Manager</h1>
                    <p className="font-lato text-sm text-gray-500">Manage articles, news, and research publications.</p>
                </div>
                <Link 
                    href="/admin/blogs/new" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md"
                >
                    <PlusCircle className="w-4 h-4" /> Create New
                </Link>
            </div>

            {/* TABS */}
            <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm w-fit">
                <button 
                    onClick={() => setActiveTab('articles')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'articles' ? 'bg-brand-brown-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <FileText className="w-4 h-4" /> Articles
                </button>
                <button 
                    onClick={() => setActiveTab('news')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'news' ? 'bg-brand-brown-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Bell className="w-4 h-4" /> News
                </button>
                <button 
                    onClick={() => setActiveTab('research')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'research' ? 'bg-brand-brown-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <BookOpen className="w-4 h-4" /> Research
                </button>
            </div>

            {/* LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64"><Loader /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredContent.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">No content found.</td></tr>
                                ) : (
                                    filteredContent.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-brand-brown-dark text-sm line-clamp-1">
                                                    {item.title || item.headline || item.researchTitle}
                                                </p>
                                                {/* Sub-label based on type */}
                                                <p className="text-xs text-gray-400">
                                                    {activeTab === 'research' ? item.authors : (item.category || item.date)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {activeTab === 'research' && <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">{item.researchType}</span>}
                                                {activeTab === 'articles' && <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded">{item.author}</span>}
                                                {activeTab === 'news' && <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {item.eventDate}</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleEdit(item.id)} className="p-2 text-gray-400 hover:text-brand-gold"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}