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
    ExternalLink,
    PlayCircle,
    ListVideo,
    LayoutList,
    MoreVertical
} from 'lucide-react';

export default function ManageVideosPage() {

    // State for Tabs
    const [activeTab, setActiveTab] = useState('videos'); // 'videos' or 'playlists'

    // Mock Data: Playlists
    const [playlists, setPlaylists] = useState([
        {
            id: 1,
            title: "Tafsir Surah Al-Baqarah (2024)",
            count: 24,
            category: "Tafsir",
            status: "Active",
            cover: "/hero.jpg"
        },
        {
            id: 2,
            title: "Ramadan Spiritual Guide",
            count: 10,
            category: "Lecture",
            status: "Completed",
            cover: "/hero.jpg"
        }
    ]);

    // Mock Data: Videos
    const [videos, setVideos] = useState([
        { 
            id: 1, 
            title: "Understanding the Rights of Neighbors", 
            youtubeId: "BYdCnmAgvhs",
            category: "Lecture", 
            playlist: "Ramadan Spiritual Guide", // Linked Playlist
            date: "22 Dec 2024", 
            views: "1.2k",
            status: "Live",
            thumbnail: "/hero.jpg" 
        },
        { 
            id: 2, 
            title: "Ramadan Tafsir - Day 29", 
            youtubeId: "dQw4w9WgXcQ",
            category: "Tafsir", 
            playlist: "Tafsir Surah Al-Baqarah (2024)",
            date: "10 Apr 2024", 
            views: "850",
            status: "Live",
            thumbnail: "/hero.jpg"
        },
        { 
            id: 3, 
            title: "Community Outreach Highlights 2024", 
            youtubeId: "Ks-_Mh1QhMc",
            category: "Event", 
            playlist: "-", // No Playlist
            date: "15 Jan 2024", 
            views: "320",
            status: "Hidden",
            thumbnail: "/hero.jpg"
        },
    ]);

    // Handle Delete (Mock)
    const handleDelete = (id, type) => {
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            if (type === 'video') {
                setVideos(videos.filter(v => v.id !== id));
            } else {
                setPlaylists(playlists.filter(p => p.id !== id));
            }
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
                            onClick={() => alert("Open Create Playlist Modal")}
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
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
                                {videos.map((video) => (
                                    <tr key={video.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-black group-hover:ring-2 ring-brand-gold/50 transition-all">
                                                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover opacity-80" />
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
                                            {video.playlist !== '-' ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-brand-brown font-medium bg-brand-sand/30 px-2 py-1 rounded-md">
                                                    <ListVideo className="w-3 h-3 text-brand-brown-dark" />
                                                    {video.playlist}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No Playlist</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">
                                            {video.views} <span className="text-[10px] font-normal text-gray-400">views</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                video.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    video.status === 'Live' ? 'bg-green-500' : 'bg-gray-400'
                                                }`}></span>
                                                {video.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(video.id, 'video')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- PLAYLISTS VIEW --- */}
                {activeTab === 'playlists' && (
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {playlists.map((list) => (
                                <div key={list.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:border-brand-gold/30">
                                    {/* Cover */}
                                    <div className="relative w-full aspect-video bg-gray-100">
                                        <Image src={list.cover} alt={list.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="px-4 py-2 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-full border border-white/50 hover:bg-brand-gold hover:border-brand-gold transition-colors">
                                                Manage Videos
                                            </button>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                            <ListVideo className="w-3 h-3" /> {list.count}
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
                    </div>
                )}

            </div>

        </div>
    );
}
