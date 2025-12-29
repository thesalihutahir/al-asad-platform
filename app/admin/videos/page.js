"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

import { 
    PlusCircle, 
    Search, 
    Edit, 
    Trash2, 
    PlayCircle, 
    ListVideo, 
    LayoutList, 
    Loader2,
    Image as ImageIcon
} from 'lucide-react';

export default function ManageVideosPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('videos'); 
    const [isLoading, setIsLoading] = useState(true);

    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);

    // 1. FETCH VIDEOS & PLAYLISTS
    useEffect(() => {
        setIsLoading(true);

        const qVideos = query(collection(db, "videos"), orderBy("createdAt", "desc"));
        const unsubVideos = onSnapshot(qVideos, (snapshot) => {
            setVideos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qPlaylists = query(collection(db, "video_playlists"), orderBy("createdAt", "desc"));
        const unsubPlaylists = onSnapshot(qPlaylists, (snapshot) => {
            setPlaylists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });

        return () => {
            unsubVideos();
            unsubPlaylists();
        };
    }, []);

    // 2. HANDLE DELETE
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

    // 3. HANDLE EDIT NAVIGATION
    const handleEdit = (id) => {
        router.push(`/admin/videos/edit/${id}`);
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
                    {activeTab === 'videos' ? (
                        <Link 
                            href="/admin/videos/new" 
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Upload Video
                        </Link>
                    ) : (
                        <Link 
                            href="/admin/videos/playlists/new"
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-brown-dark text-white rounded-xl text-sm font-bold hover:bg-brand-gold transition-colors shadow-md"
                        >
                            <ListVideo className="w-4 h-4" />
                            Create Playlist
                        </Link>
                    )}
                </div>
            </div>

            {/* 2. TABS & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('videos')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'videos' ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <PlayCircle className="w-4 h-4" /> Videos
                    </button>
                    <button 
                        onClick={() => setActiveTab('playlists')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'playlists' ? 'bg-white text-brand-brown-dark shadow-sm' : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <LayoutList className="w-4 h-4" /> Playlists
                    </button>
                </div>
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
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
                        {/* VIDEOS VIEW */}
                        {activeTab === 'videos' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Video</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Playlist</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {videos.length === 0 ? (
                                            <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">No videos uploaded yet.</td></tr>
                                        ) : (
                                            videos.map((video) => (
                                                <tr key={video.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                                                                <Image src={video.thumbnail || "/fallback.webp"} alt={video.title} fill className="object-cover opacity-80" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-brand-brown-dark text-sm line-clamp-1 max-w-[200px]">{video.title}</h3>
                                                                <span className="text-[10px] text-gray-500">{video.category}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4"><span className="text-xs text-brand-brown">{video.playlist || '-'}</span></td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => handleEdit(video.id)} // EDIT ACTION
                                                                className="p-2 text-gray-400 hover:text-brand-gold hover:bg-brand-sand rounded-lg transition-colors"
                                                                title="Edit Video"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(video.id, 'video')} 
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete Video"
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

                        {/* PLAYLISTS VIEW */}
                        {activeTab === 'playlists' && (
                            <div className="p-6">
                                {playlists.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <LayoutList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No playlists created yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {playlists.map((list) => (
                                            <div key={list.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-gold/30">
                                                <div className="relative w-full aspect-video bg-gray-100">
                                                    <Image src={list.cover || "/fallback.webp"} alt={list.title} fill className="object-cover" />
                                                    <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                                        <ListVideo className="w-3 h-3" /> {list.count || 0}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest bg-brand-gold/10 px-2 py-0.5 rounded">{list.category}</span>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <h3 className="font-agency text-lg text-brand-brown-dark leading-tight line-clamp-1">{list.title}</h3>
                                                        <button onClick={() => handleDelete(list.id, 'playlist')} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
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
