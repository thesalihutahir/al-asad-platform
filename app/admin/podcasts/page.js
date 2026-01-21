"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, writeBatch, where, getDocs } from 'firebase/firestore';
// Global Modal Context
import { useModal } from '@/context/ModalContext';
import LogoReveal from '@/components/logo-reveal'; 

import { 
    PlusCircle, Search, Edit, Trash2, Mic, LayoutGrid, 
    List, Loader2, Filter, X, ArrowUpDown, CalendarClock, Info,
    ChevronDown, Check
} from 'lucide-react';

// --- CUSTOM DROPDOWN COMPONENT (Internal) ---
const CustomSelect = ({ options, value, onChange, placeholder, icon: Icon, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className || ''}`} ref={dropdownRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full pl-3 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm flex justify-between items-center cursor-pointer transition-all hover:border-brand-gold/50 ${isOpen ? 'ring-2 ring-brand-gold/20 border-brand-gold' : ''}`}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {Icon && <Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />}
                    <span className={`truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 min-w-[140px]">
                    {options.map((opt) => (
                        <div 
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            className={`px-4 py-3 text-sm cursor-pointer hover:bg-brand-sand/10 flex justify-between items-center ${value === opt.value ? 'bg-brand-sand/20 text-brand-brown-dark font-bold' : 'text-gray-600'}`}
                        >
                            {opt.label}
                            {value === opt.value && <Check className="w-3 h-3 text-brand-gold" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function ManagePodcastsPage() {
    const router = useRouter();
    const { showSuccess, showConfirm } = useModal(); 

    const [activeTab, setActiveTab] = useState('episodes'); 
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [episodes, setEpisodes] = useState([]);
    const [shows, setShows] = useState([]);

    // Filter & Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('desc'); 

    // Helper: Auto-Detect Arabic
    const getDir = (text) => {
        if (!text) return 'ltr';
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text) ? 'rtl' : 'ltr';
    };

    // Helper: Format Date
    const formatUploadTime = (timestamp) => {
        if (!timestamp) return <span className="text-gray-300 italic">Processing...</span>;
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-NG', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: 'numeric', minute: 'numeric', hour12: true
        }).format(date).replace(',', '').replace(' at', ' •');
    };

    // 1. FETCH DATA (Real-time)
    useEffect(() => {
        setIsLoading(true);

        const qEpisodes = query(collection(db, "podcasts"), orderBy("createdAt", "desc"));
        const unsubEpisodes = onSnapshot(qEpisodes, (snapshot) => {
            setEpisodes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qShows = query(collection(db, "podcast_shows"), orderBy("createdAt", "desc"));
        const unsubShows = onSnapshot(qShows, (snapshot) => {
            setShows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });

        return () => {
            unsubEpisodes();
            unsubShows();
        };
    }, []);

    // 2. PROCESS CONTENT
    const getProcessedContent = () => {
        const term = searchTerm.toLowerCase();
        let content = [];

        if (activeTab === 'episodes') {
            content = episodes.filter(ep => {
                const matchesSearch = ep.title.toLowerCase().includes(term) || (ep.show && ep.show.toLowerCase().includes(term));
                const matchesCategory = categoryFilter === 'All' || ep.category === categoryFilter;
                return matchesSearch && matchesCategory;
            });
        } else {
            // Shows
            const showsWithCounts = shows.map(show => ({
                ...show,
                realCount: episodes.filter(ep => ep.show === show.title).length
            }));

            content = showsWithCounts.filter(show => {
                const matchesSearch = show.title.toLowerCase().includes(term) || show.host.toLowerCase().includes(term);
                const matchesCategory = categoryFilter === 'All' || show.category === categoryFilter;
                return matchesSearch && matchesCategory;
            });
        }

        return content.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    };

    const filteredContent = getProcessedContent();
    const totalItems = filteredContent.length;

    // 3. ACTIONS
    const handleDelete = (id, type) => {
        const message = type === 'show' 
            ? "Warning: Deleting this show will NOT delete the episodes inside it. They will become orphaned. Continue?"
            : "Are you sure you want to delete this episode? This cannot be undone.";

        showConfirm({
            title: `Delete ${type === 'show' ? 'Show' : 'Episode'}?`,
            message: message,
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            type: 'danger',
            onConfirm: async () => {
                try {
                    if (type === 'episode') await deleteDoc(doc(db, "podcasts", id));
                    else await deleteDoc(doc(db, "podcast_shows", id));

                    showSuccess({ title: "Deleted!", message: "Item deleted successfully.", confirmText: "Okay" });
                } catch (error) {
                    console.error("Error deleting:", error);
                    alert("Failed to delete.");
                }
            }
        });
    };

    const handleEdit = (id, type) => {
        router.push(type === 'show' ? `/admin/podcasts/shows/edit/${id}` : `/admin/podcasts/edit/${id}`);
    };

    // Quick View Modal
    const handleQuickView = (item) => {
        showSuccess({
            title: "Quick Info",
            message: (
                <div className="text-left space-y-3 mt-2 text-sm">
                    <div dir={getDir(item.title)}>
                        <p className="text-xs font-bold text-gray-400 uppercase">Title</p>
                        <p className="font-bold text-brand-brown-dark">{item.title}</p>
                    </div>
                    {item.show && (
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Show</p>
                            <p className="font-medium">{item.show}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Published On</p>
                        <p className="font-medium">{formatUploadTime(item.createdAt)}</p>
                    </div>
                </div>
            ),
            confirmText: "Close"
        });
    };

    const categoryOptions = [
        { value: "All", label: "All Categories" },
        { value: "English", label: "English" },
        { value: "Hausa", label: "Hausa" },
        { value: "Arabic", label: "Arabic" }
    ];
return (
        <div className="space-y-6 relative max-w-7xl mx-auto pb-12">

            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Podcast Manager</h1>
                    <p className="font-lato text-sm text-gray-500">Manage shows, episodes, and audio streams.</p>
                </div>
                <div className="flex gap-2 h-10">
                    <div className="bg-white border border-gray-100 px-4 rounded-xl text-center shadow-sm min-w-[80px] flex flex-col justify-center h-full">
                        <span className="block text-lg font-bold text-brand-gold leading-none">{totalItems}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider leading-none mt-0.5">Total</span>
                    </div>
                    {activeTab === 'episodes' ? (
                        <Link 
                            href="/admin/podcasts/new" 
                            className="flex items-center justify-center gap-2 px-5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md h-full"
                        >
                            <PlusCircle className="w-4 h-4" /> New Episode
                        </Link>
                    ) : (
                        <Link 
                            href="/admin/podcasts/shows/new"
                            className="flex items-center justify-center gap-2 px-5 bg-brand-brown-dark text-white rounded-xl text-sm font-bold hover:bg-brand-gold transition-colors shadow-md h-full"
                        >
                            <Mic className="w-4 h-4" /> Create Show
                        </Link>
                    )}
                </div>
            </div>

            {/* 2. TABS & FILTERS TOOLBAR */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                    <button 
                        onClick={() => { setActiveTab('episodes'); setSearchTerm(''); setCategoryFilter('All'); }}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'episodes' ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <List className="w-4 h-4" /> Episodes
                    </button>
                    <button 
                        onClick={() => { setActiveTab('shows'); setSearchTerm(''); setCategoryFilter('All'); }}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'shows' ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Shows
                    </button>
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-col w-full xl:w-auto gap-3">
                    <div className="flex flex-row gap-2 w-full">
                        <div className="relative flex-1 sm:flex-none sm:w-40 min-w-[160px]">
                            <CustomSelect options={categoryOptions} value={categoryFilter} onChange={setCategoryFilter} icon={Filter} placeholder="Category" />
                        </div>
                        <button 
                            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors flex-1 md:flex-none"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                        </button>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all" 
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
                    </div>
                </div>
            </div>

            {/* 3. CONTENT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">

                {isLoading ? (
                    <div className="flex items-center justify-center h-64 scale-75">
                        <LogoReveal />
                    </div>
                ) : (
                    <>
                        {/* --- EPISODES VIEW --- */}
                        {activeTab === 'episodes' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left whitespace-nowrap">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Episode</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lang</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Show</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredContent.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No episodes found.</td></tr>
                                        ) : (
                                            filteredContent.map((ep) => (
                                                <tr key={ep.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer" onClick={() => handleQuickView(ep)}>
                                                                <Image src={ep.thumbnail || "/fallback.webp"} alt={ep.title} fill className="object-cover" />
                                                            </div>
                                                            <div className="min-w-[150px]">
                                                                <h3 
                                                                    className={`font-bold text-brand-brown-dark text-sm cursor-pointer hover:text-brand-gold ${getDir(ep.title) === 'rtl' ? 'font-tajawal' : ''}`}
                                                                    onClick={() => handleQuickView(ep)}
                                                                >
                                                                    {ep.title}
                                                                </h3>
                                                                <p className="text-[10px] text-gray-400 font-bold">EP {ep.episodeNumber || '-'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                            ep.category === 'English' ? 'bg-blue-100 text-blue-700' :
                                                            ep.category === 'Hausa' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                            {ep.category || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        {ep.show ? (
                                                            <span className="text-xs font-bold text-brand-brown bg-brand-sand/30 px-2 py-1 rounded">
                                                                {ep.show}
                                                            </span>
                                                        ) : <span className="text-xs text-gray-400">-</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                                        {formatUploadTime(ep.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleQuickView(ep)} className="p-2 text-gray-400 hover:text-brand-brown-dark bg-gray-100 rounded-lg md:hidden"><Info className="w-4 h-4" /></button>
                                                            <button onClick={() => handleEdit(ep.id, 'episode')} className="p-2 text-gray-400 hover:text-brand-gold bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDelete(ep.id, 'episode')} className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* --- SHOWS VIEW --- */}
                        {activeTab === 'shows' && (
                            <div className="p-6">
                                {filteredContent.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No shows found.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredContent.map((show) => (
                                            <div key={show.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-gold/30 flex gap-4 p-4 items-center bg-brand-sand/10 cursor-pointer" onClick={() => handleEdit(show.id, 'show')}>
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md border border-white">
                                                    <Image src={show.cover || "/fallback.webp"} alt={show.title} fill className="object-cover" />
                                                    <div className="absolute top-1 left-1">
                                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shadow-sm ${
                                                            show.category === 'English' ? 'bg-blue-600 text-white' :
                                                            show.category === 'Hausa' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'
                                                        }`}>
                                                            {show.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex-grow min-w-0">
                                                    <h3 className={`font-agency text-lg text-brand-brown-dark leading-none mb-1 ${getDir(show.title) === 'rtl' ? 'font-tajawal font-bold' : ''}`}>
                                                        {show.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mb-2 truncate">{show.host}</p>
                                                    <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full font-bold text-brand-gold">
                                                        {show.realCount} Episodes
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(show.id, 'show'); }} className="p-2 text-gray-400 hover:text-brand-gold hover:bg-white rounded-lg">
                                                        <Edit className="w-3 h-3" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(show.id, 'show'); }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
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