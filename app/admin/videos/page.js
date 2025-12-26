"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';

import { 
    PlusCircle, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    ExternalLink, 
    PlayCircle, 
    ListVideo, 
    LayoutList, 
    MoreVertical,
    Loader2
} from 'lucide-react';

export default function ManageVideosPage() {

    // State for Tabs
    const [activeTab, setActiveTab] = useState('videos'); // 'videos' or 'playlists'
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    // 1. FETCH VIDEOS & PLAYLISTS (Real-time)
    useEffect(() => {
        setIsLoading(true);

        // Listener for Videos
        const qVideos = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const unsubVideos = onSnapshot(qVideos, (snapshot) => {
            setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Listener for Playlists
        const qPlaylists = query(collection(db, "video_playlists"), orderBy("createdAt", "desc"));
        const unsubPlaylists = onSnapshot(qPlaylists, (snapshot) => {
            setPlaylists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });

        // Cleanup
        return () => {
            unsubVideos();
            unsubPlaylists();
        };
    }, []);

    // 2. HANDLE CREATE PLAYLIST (Simple Prompt for now)
    const handleCreatePlaylist = async () => {
        const title = prompt("Enter new Playlist Title (e.g. Tafsir Series 2024):");
        if (!title) return;

        const category = prompt("Enter Category (e.g. Tafsir, Lecture, Series):", "General");
        
        try {
            await addDoc(collection(db, "video_playlists"), {
                title,
                category: category || "General",
                count: 0, // Will update this logic later
                status: "Active",
                cover: "/hero.jpg", // Default cover for now
                createdAt: serverTimestamp()
            });
            alert("Playlist created successfully!");
        } catch (error) {
            console.error("Error creating playlist:", error);
            alert("Failed to create playlist.");
        }
    };

    // 3. HANDLE DELETE
    const handleDelete = async (id, type) => {
        if (!confirm(`Are you sure you want to delete this ${type}? This cannot be undone.`)) return;

        try {
            if (type === 'video') {
                await deleteDoc(doc(db, "videos", id));
            } else {
                await deleteDoc(doc(db, "video_playlists", id));
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete.");
        }
    };

    return (
        <div className="space-y-6">

            {/* 1. HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Video Manager</h1>
                    <p className="font-lato text-sm text-gray-500">Manage your library, playlists, and lecture series.</p>
                </div>
                <div className="flex gap-3">
                    {/* Dynamic 'Add' Button based on Tab */}
                    {activeTab === 'videos' ? (
                        <Link 
                            href="/admin/videos/new" 
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Upload Video
                        </Link>
                    ) : (
                        <button 
                            onClick={handleCreatePlaylist}
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-brown-dark text-white rounded-xl text-sm font-bold hover:bg-brand-gold transition-colors shadow-md"
                        >
                            <ListVideo className="w-4 h-4" />
                            Create Playlist
                        </button>
                    )}
                </div>
            </div>

            {/* 2. TABS & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                
                {/* Tab Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('videos')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'videos' 
                            ? 'bg-white text-brand-brown-dark shadow-sm' 
                            : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <PlayCircle className="w-4 h-4" /> Videos
                    </button>
                    <button 
                        onClick={() => setActiveTab('playlists')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'playlists' 
                            ? 'bg-white text-brand-brown-dark shadow-sm' 
                            : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <LayoutList className="w-4 h-4" /> Playlists
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
                        {/* --- VIDEOS VIEW --- */}
                        {activeTab === 'videos' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Video</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Playlist</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stats</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {videos.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                                    No videos uploaded yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            videos.map((video) => (
                                                <tr key={video.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-black group-hover:ring-2 ring-brand-gold/50 transition-all">
                                                                <Image src={video.thumbnail || "/hero.jpg"} alt={video.title} fill className="object-cover opacity-80" />
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <PlayCircle className="w-4 h-4 text-white" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-brand-brown-dark text-sm line-clamp-1 max-w-[200px]">{video.title}</h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                                        {video.category}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400">{video.date}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {video.playlist ? (
                                                            <span className="inline-flex items-center gap-1.5 text-xs text-brand-brown font-medium bg-brand-sand/30 px-2 py-1 rounded-md">
                                                                <ListVideo className="w-3 h-3 text-brand-brown-dark" />
                                                                {video.playlist}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">No Playlist</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">
                                                        {video.views || 0} <span className="text-[10px] font-normal text-gray-400">views</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                            Live
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDelete(video.id, 'video')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* --- PLAYLISTS VIEW --- */}
                        {activeTab === 'playlists' && (
                            <div className="p-6">
                                {playlists.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <LayoutList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No playlists created yet. Click "Create Playlist" to start.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {playlists.map((list) => (
                                            <div key={list.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-gold/30">
                                                {/* Cover */}
                                                <div className="relative w-full aspect-video bg-gray-100">
                                                    <Image src={list.cover || "/hero.jpg"} alt={list.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="px-4 py-2 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full border border-white/50 hover:bg-brand-gold hover:border-brand-gold transition-colors">
                                                            Manage Videos
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                                        <ListVideo className="w-3 h-3" /> {list.count || 0}
                                                    </div>
                                                </div>
                                                
                                                {/* Info */}
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest bg-brand-gold/10 px-2 py-0.5 rounded">
                                                            {list.category}
                                                        </span>
                                                        <button className="text-gray-400 hover:text-brand-brown-dark"><MoreVertical className="w-4 h-4" /></button>
                                                    </div>
                                                    <h3 className="font-agency text-lg text-brand-brown-dark leading-tight mb-2 line-clamp-1">
                                                        {list.title}
                                                    </h3>
                                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
                                                        <span className="text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded font-bold uppercase">{list.status}</span>
                                                        <div className="flex gap-2">
                                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-3 h-3" /></button>
                                                            <button onClick={() => handleDelete(list.id, 'playlist')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
                                                        </div>
                                                    </div>
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
