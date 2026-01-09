"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, writeBatch, where, getDocs } from 'firebase/firestore';
// Global Modal Context
import { useModal } from '@/context/ModalContext';
// Custom Loader
import Loader from '@/components/Loader'; 

import { 
    PlusCircle, Search, Edit, Trash2, Play, Music, Download, 
    ListMusic, Loader2, Filter, X, ArrowUpDown, CalendarClock, 
    Info, ChevronRight, AlertTriangle
} from 'lucide-react';

export default function ManageAudiosPage() {
    const router = useRouter();
    const { showSuccess, showConfirm } = useModal(); 

    const [activeTab, setActiveTab] = useState('audios'); 
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [audios, setAudios] = useState([]);
    const [series, setSeries] = useState([]);

    // Modal State
    const [selectedSeries, setSelectedSeries] = useState(null);

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

    // 1. FETCH DATA
    useEffect(() => {
        setIsLoading(true);

        const qAudios = query(collection(db, "audios"), orderBy("createdAt", "desc"));
        const unsubAudios = onSnapshot(qAudios, (snapshot) => {
            setAudios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qSeries = query(collection(db, "audio_series"), orderBy("createdAt", "desc"));
        const unsubSeries = onSnapshot(qSeries, (snapshot) => {
            setSeries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });

        return () => {
            unsubAudios();
            unsubSeries();
        };
    }, []);

    // 2. PROCESS CONTENT
    const getProcessedContent = () => {
        const term = searchTerm.toLowerCase();
        let content = [];

        if (activeTab === 'audios') {
            content = audios.filter(audio => {
                const matchesSearch = 
                    audio.title.toLowerCase().includes(term) || 
                    (audio.series && audio.series.toLowerCase().includes(term));
                const matchesCategory = categoryFilter === 'All' || audio.category === categoryFilter;
                return matchesSearch && matchesCategory;
            });
        } else {
            const seriesWithCounts = series.map(s => ({
                ...s,
                realCount: audios.filter(a => a.series === s.title).length
            }));
            content = seriesWithCounts.filter(s => {
                const matchesSearch = s.title.toLowerCase().includes(term);
                const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
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
    // 3. ACTIONS
    const handleDelete = (id, type) => {
        const message = type === 'series' 
            ? "Warning: Deleting this series will NOT delete the audio tracks inside it. They will become 'Single Tracks'. Continue?"
            : "Are you sure you want to delete this audio track? This cannot be undone.";

        showConfirm({
            title: `Delete ${type === 'series' ? 'Series' : 'Audio'}?`,
            message: message,
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            type: 'danger', 
            onConfirm: async () => {
                try {
                    if (type === 'audio') await deleteDoc(doc(db, "audios", id));
                    else await deleteDoc(doc(db, "audio_series", id));
                    
                    showSuccess({ title: "Deleted!", message: "Item deleted successfully.", confirmText: "Okay" });
                } catch (error) {
                    console.error("Error deleting:", error);
                    alert("Failed to delete.");
                }
            }
        });
    };

    // SPECIAL: Delete Entire Series
    const handleDeleteSeries = (targetSeries) => {
        showConfirm({
            title: "Delete ENTIRE Series?",
            message: `DANGER: This will delete the series "${targetSeries.title}" AND ALL ${targetSeries.realCount} audio tracks inside it. This cannot be undone.`,
            confirmText: "Yes, Delete Everything",
            cancelText: "Cancel",
            type: 'danger',
            onConfirm: async () => {
                try {
                    const q = query(collection(db, "audios"), where("series", "==", targetSeries.title));
                    const snapshot = await getDocs(q);

                    const batch = writeBatch(db);
                    const seriesRef = doc(db, "audio_series", targetSeries.id);
                    batch.delete(seriesRef);

                    snapshot.docs.forEach((doc) => {
                        batch.delete(doc.ref);
                    });

                    await batch.commit();
                    
                    setSelectedSeries(null);
                    showSuccess({ title: "Series Deleted", message: "The series and all its tracks were deleted.", confirmText: "Done" });

                } catch (error) {
                    console.error("Error deleting series:", error);
                    alert("Failed to delete series.");
                }
            }
        });
    };

    const handleEdit = (id, type) => {
        router.push(type === 'series' ? `/admin/audios/series/edit/${id}` : `/admin/audios/edit/${id}`);
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
                    {item.date && (
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Recorded Date</p>
                            <p className="font-medium">{item.date}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Uploaded On</p>
                        <p className="font-medium">{formatUploadTime(item.createdAt)}</p>
                    </div>
                    {item.fileSize && (
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">File Size</p>
                            <p className="font-medium">{item.fileSize}</p>
                        </div>
                    )}
                </div>
            ),
            confirmText: "Close"
        });
    };
return (
        <div className="space-y-6 relative">

            {/* --- SERIES DETAILS MODAL --- */}
            {selectedSeries && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-brown-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                            <div className="flex gap-4">
                                <div className="relative w-24 aspect-square rounded-lg overflow-hidden bg-gray-200 shadow-sm border border-white">
                                    <Image src={selectedSeries.cover || "/fallback.webp"} alt="Cover" fill className="object-cover" />
                                </div>
                                <div dir={getDir(selectedSeries.title)}>
                                    <h3 className="font-agency text-2xl text-brand-brown-dark leading-none mb-2">{selectedSeries.title}</h3>
                                    <div className="flex gap-2" dir="ltr">
                                        <span className="px-2 py-0.5 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase rounded-md">
                                            {selectedSeries.category}
                                        </span>
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase rounded-md">
                                            {selectedSeries.realCount} Tracks
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedSeries(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {audios.filter(a => a.series === selectedSeries.title).length > 0 ? (
                                audios.filter(a => a.series === selectedSeries.title).map((track, idx) => (
                                    <div key={track.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-all group">
                                        <span className="text-xs font-bold text-gray-300 w-6">{idx + 1}</span>
                                        <div className="w-10 h-10 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                                            <Music className="w-4 h-4" />
                                        </div>
                                        <div className="flex-grow min-w-0" dir={getDir(track.title)}>
                                            <p className="text-sm font-bold text-gray-700 line-clamp-1">{track.title}</p>
                                            <p className="text-[10px] text-gray-400 font-lato" dir="ltr">{formatUploadTime(track.createdAt)}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(track.id, 'audio')} className="p-2 text-gray-400 hover:text-brand-gold hover:bg-brand-sand rounded-lg"><Edit className="w-3 h-3" /></button>
                                            <button onClick={() => handleDelete(track.id, 'audio')} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    <ListMusic className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">No tracks in this series yet.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                            <button onClick={() => handleDeleteSeries(selectedSeries)} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" /> Delete Entire Series
                            </button>
                            <button onClick={() => handleEdit(selectedSeries.id, 'series')} className="px-6 py-2.5 bg-brand-gold text-white text-xs font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-sm">
                                Edit Series
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MAIN PAGE CONTENT --- */}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Audio Manager</h1>
                    <p className="font-lato text-sm text-gray-500">Upload and manage MP3 lectures, sermons, and series.</p>
                </div>
                <div className="flex gap-3">
                    {activeTab === 'audios' ? (
                        <Link href="/admin/audios/new" className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md">
                            <PlusCircle className="w-4 h-4" /> Upload Audio
                        </Link>
                    ) : (
                        <Link href="/admin/audios/series/new" className="flex items-center gap-2 px-5 py-2.5 bg-brand-brown-dark text-white rounded-xl text-sm font-bold hover:bg-brand-gold transition-colors shadow-md">
                            <ListMusic className="w-4 h-4" /> Create Series
                        </Link>
                    )}
                </div>
            </div>

            {/* TABS & FILTERS */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                    <button onClick={() => { setActiveTab('audios'); setSearchTerm(''); }} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'audios' ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500 hover:text-brand-brown-dark'}`}>
                        <Music className="w-4 h-4" /> All Tracks
                    </button>
                    <button onClick={() => { setActiveTab('series'); setSearchTerm(''); }} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'series' ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500 hover:text-brand-brown-dark'}`}>
                        <ListMusic className="w-4 h-4" /> Series & Sets
                    </button>
                </div>

                <div className="flex flex-col w-full xl:w-auto gap-3">
                    <div className="flex flex-row gap-2 w-full">
                        <div className="relative flex-1 md:flex-none">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold" />
                            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full md:w-40 pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 cursor-pointer">
                                <option value="All">All</option>
                                <option value="English">English</option>
                                <option value="Hausa">Hausa</option>
                                <option value="Arabic">Arabic</option>
                            </select>
                        </div>
                        <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors flex-1 md:flex-none">
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                        </button>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all" />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64"><Loader /></div>
                ) : (
                    <>
                        {activeTab === 'audios' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title / Speaker</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lang</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Series</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredContent.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No tracks found.</td></tr>
                                        ) : (
                                            filteredContent.map((audio) => (
                                                <tr key={audio.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0 cursor-pointer" onClick={() => handleQuickView(audio)}>
                                                                <Play className="w-4 h-4 ml-0.5 fill-current" />
                                                            </div>
                                                            <div className="min-w-[150px]">
                                                                <h3 className={`font-bold text-brand-brown-dark text-sm cursor-pointer hover:text-brand-gold ${getDir(audio.title) === 'rtl' ? 'font-tajawal' : ''}`} onClick={() => handleQuickView(audio)}>
                                                                    {audio.title}
                                                                </h3>
                                                                <p className="text-xs text-gray-400">{audio.speaker}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                            audio.category === 'English' ? 'bg-blue-100 text-blue-700' :
                                                            audio.category === 'Hausa' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                            {audio.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 hidden md:table-cell">
                                                        {audio.series ? <span className="text-xs font-bold text-brand-brown bg-brand-sand/30 px-2 py-1 rounded-md">{audio.series}</span> : <span className="text-xs text-gray-400">-</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => handleQuickView(audio)} className="p-2 text-gray-400 hover:text-brand-gold hover:bg-brand-sand rounded-lg md:hidden"><Info className="w-4 h-4" /></button>
                                                            <a href={audio.audioUrl} target="_blank" download className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><Download className="w-4 h-4" /></a>
                                                            <button onClick={() => handleEdit(audio.id, 'audio')} className="p-2 text-gray-400 hover:text-brand-gold hover:bg-brand-sand rounded-lg"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDelete(audio.id, 'audio')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'series' && (
                            <div className="p-6">
                                {filteredContent.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <ListMusic className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No series found.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredContent.map((s) => (
                                            <div key={s.id} onClick={() => setSelectedSeries(s)} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-gold/30 cursor-pointer">
                                                <div className="relative w-full aspect-square bg-gray-100">
                                                    <Image src={s.cover || "/fallback.webp"} alt={s.title} fill className="object-cover" />
                                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                                        <Music className="w-3 h-3" /> {s.realCount} Tracks
                                                    </div>
                                                    <div className="absolute top-2 left-2">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${
                                                            s.category === 'English' ? 'bg-blue-600 text-white' :
                                                            s.category === 'Hausa' ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'
                                                        }`}>
                                                            {s.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4" dir={getDir(s.title)}>
                                                    <div className="flex justify-between items-start mb-2" dir="ltr">
                                                        <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><CalendarClock className="w-3 h-3" /> {formatUploadTime(s.createdAt)}</span>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(s.id, 'series'); }} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                    <h3 className={`font-agency text-lg text-brand-brown-dark leading-tight line-clamp-2 ${getDir(s.title) === 'rtl' ? 'font-tajawal font-bold' : ''}`}>{s.title}</h3>
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
