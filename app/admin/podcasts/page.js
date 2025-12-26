"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
// UploadThing
import { UploadButton } from '@/lib/uploadthing';

import { 
    PlusCircle, 
    Search, 
    Edit, 
    Trash2, 
    Play, 
    Headphones, 
    Mic, 
    LayoutGrid, 
    List,
    Loader2,
    X,
    Image as ImageIcon
} from 'lucide-react';

export default function ManagePodcastsPage() {

    const [activeTab, setActiveTab] = useState('episodes'); // 'episodes' or 'shows'
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [episodes, setEpisodes] = useState([]);
    const [shows, setShows] = useState([]);

    // --- CREATE SHOW MODAL STATE ---
    const [isShowModalOpen, setIsShowModalOpen] = useState(false);
    const [isCreatingShow, setIsCreatingShow] = useState(false);
    const [newShow, setNewShow] = useState({
        title: '',
        host: 'Sheikh Muneer',
        cover: ''
    });

    // 1. FETCH DATA (Real-time)
    useEffect(() => {
        setIsLoading(true);

        // Fetch Episodes
        const qEpisodes = query(collection(db, "podcasts"), orderBy("createdAt", "desc"));
        const unsubEpisodes = onSnapshot(qEpisodes, (snapshot) => {
            setEpisodes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch Shows
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

    // 2. HANDLE CREATE SHOW
    const handleSaveShow = async (e) => {
        e.preventDefault();
        setIsCreatingShow(true);

        try {
            if (!newShow.title) {
                alert("Please enter a show title.");
                setIsCreatingShow(false);
                return;
            }

            await addDoc(collection(db, "podcast_shows"), {
                ...newShow,
                count: 0, // Initial episode count
                cover: newShow.cover || "/hero.jpg",
                createdAt: serverTimestamp()
            });

            alert("Show created successfully!");
            setIsShowModalOpen(false);
            setNewShow({ title: '', host: 'Sheikh Muneer', cover: '' });

        } catch (error) {
            console.error("Error creating show:", error);
            alert("Failed to create show.");
        } finally {
            setIsCreatingShow(false);
        }
    };

    // 3. HANDLE DELETE
    const handleDelete = async (id, type) => {
        if (!confirm(`Are you sure you want to delete this ${type}? This cannot be undone.`)) return;

        try {
            if (type === 'episode') {
                await deleteDoc(doc(db, "podcasts", id));
            } else {
                await deleteDoc(doc(db, "podcast_shows", id));
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete.");
        }
    };

    return (
        <div className="space-y-6 relative">

            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Podcast Manager</h1>
                    <p className="font-lato text-sm text-gray-500">Manage shows, episodes, and audio streams.</p>
                </div>
                <div className="flex gap-3">
                    {activeTab === 'episodes' ? (
                        <Link 
                            href="/admin/podcasts/new" 
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Episode
                        </Link>
                    ) : (
                        <button 
                            onClick={() => setIsShowModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-brown-dark text-white rounded-xl text-sm font-bold hover:bg-brand-gold transition-colors shadow-md"
                        >
                            <Mic className="w-4 h-4" />
                            Create Show
                        </button>
                    )}
                </div>
            </div>

            {/* 2. TABS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('episodes')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'episodes' 
                            ? 'bg-white text-brand-brown-dark shadow-sm' 
                            : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <List className="w-4 h-4" /> Episodes
                    </button>
                    <button 
                        onClick={() => setActiveTab('shows')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'shows' 
                            ? 'bg-white text-brand-brown-dark shadow-sm' 
                            : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" /> Shows
                    </button>
                </div>
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                </div>
            </div>

            {/* 3. CONTENT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
                
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* --- EPISODES VIEW --- */}
                        {activeTab === 'episodes' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Episode</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Show</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {episodes.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No episodes uploaded yet.</td></tr>
                                        ) : (
                                            episodes.map((ep) => (
                                                <tr key={ep.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                                <Image src={ep.thumbnail || "/hero.jpg"} alt={ep.title} fill className="object-cover" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-brand-brown-dark text-sm line-clamp-1">{ep.title}</h3>
                                                                <p className="text-xs text-gray-400">EP {ep.episodeNumber || '-'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-medium text-brand-brown bg-brand-sand/30 px-2 py-1 rounded">
                                                            {ep.show}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{ep.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Published
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDelete(ep.id, 'episode')} className="p-2 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
                                {shows.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No shows created yet. Click "Create Show" to start.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {shows.map((show) => (
                                            <div key={show.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-gold/30 flex gap-4 p-4 items-center bg-brand-sand/10">
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                                    <Image src={show.cover || "/hero.jpg"} alt={show.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-agency text-lg text-brand-brown-dark leading-none mb-1">{show.title}</h3>
                                                    <p className="text-xs text-gray-500 mb-2">{show.host}</p>
                                                    <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full font-bold text-brand-gold">
                                                        {show.count} Episodes
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded"><Edit className="w-3 h-3" /></button>
                                                    <button onClick={() => handleDelete(show.id, 'show')} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3 h-3" /></button>
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

            {/* --- CREATE SHOW MODAL --- */}
            {isShowModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-agency text-xl text-brand-brown-dark">Create New Show</h3>
                            <button onClick={() => setIsShowModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveShow} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Show Title</label>
                                <input 
                                    type="text" 
                                    value={newShow.title}
                                    onChange={(e) => setNewShow({...newShow, title: e.target.value})}
                                    placeholder="e.g. The Young Believer" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Host Name</label>
                                <input 
                                    type="text" 
                                    value={newShow.host}
                                    onChange={(e) => setNewShow({...newShow, host: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-2">Cover Art</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-white hover:border-brand-gold transition-colors">
                                    {newShow.cover ? (
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                            <Image src={newShow.cover} alt="Cover" fill className="object-cover" />
                                            <button type="button" onClick={() => setNewShow({...newShow, cover: ''})} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"><X className="w-3 h-3" /></button>
                                        </div>
                                    ) : (
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                if (res && res[0]) setNewShow(prev => ({ ...prev, cover: res[0].url }));
                                            }}
                                            onUploadError={(error) => alert(`Error! ${error.message}`)}
                                            appearance={{ button: "bg-brand-brown-dark text-white text-xs px-3 py-2 rounded-lg" }}
                                            content={{ button({ ready }) { return ready ? 'Upload Image' : '...' } }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={isCreatingShow}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-md disabled:opacity-50"
                                >
                                    {isCreatingShow ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isCreatingShow ? 'Creating...' : 'Create Show'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
