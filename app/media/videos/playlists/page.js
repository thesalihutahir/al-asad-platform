"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { ListVideo, PlayCircle, Loader2, Layers } from 'lucide-react';

export default function PlaylistsPage() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");

    // Match the Admin Upload Categories
    const filters = ["All", "English", "Hausa", "Arabic"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Playlists
                const qPlaylists = query(collection(db, "video_playlists"), orderBy("createdAt", "desc"));
                const plSnap = await getDocs(qPlaylists);
                let fetchedPlaylists = plSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // 2. Fetch ALL Videos (to count)
                const qVideos = query(collection(db, "videos")); 
                const vidSnap = await getDocs(qVideos);
                const fetchedVideos = vidSnap.docs.map(doc => doc.data());

                // 3. Calculate Counts Dynamically
                fetchedPlaylists = fetchedPlaylists.map(playlist => {
                    const realCount = fetchedVideos.filter(v => v.playlist === playlist.title).length;
                    return { ...playlist, count: realCount };
                });

                setPlaylists(fetchedPlaylists);

            } catch (error) {
                console.error("Error fetching playlists:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper: RTL Detection
    const getDir = (text) => /[\u0600-\u06FF]/.test(text) ? 'rtl' : 'ltr';

    // Filter Logic
    const filteredPlaylists = activeFilter === "All" 
        ? playlists 
        : playlists.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-lato">
            <Header />

            <main className="flex-grow pb-20">
                
                {/* 1. HERO SECTION */}
                <section className="w-full relative h-[40vh] md:h-[50vh] min-h-[350px] bg-brand-brown-dark overflow-hidden mb-12">
                    <div className="absolute inset-0 opacity-30">
                        <Image 
                            src="/images/heroes/media-videos-hero.webp" 
                            alt="Background" 
                            fill 
                            className="object-cover"
                            priority
                        />
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-dark via-brand-brown-dark/80 to-transparent"></div>

                    <div className="relative z-10 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-4 py-1.5 rounded-full mb-6 border border-brand-gold/30 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Layers className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Series Collections</span>
                        </div>
                        <h1 className="font-agency text-5xl md:text-7xl text-white mb-4 drop-shadow-lg animate-in zoom-in-95 duration-700">
                            Video Playlists
                        </h1>
                        <div className="w-20 h-1 bg-brand-gold rounded-full mb-6"></div>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg font-lato leading-relaxed px-4">
                            Explore comprehensive collections of lectures, Tafsir, and seminars organized by topic and language.
                        </p>
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader size="md" />
                    </div>
                ) : (
                    <div className="container mx-auto px-4 md:px-12">
                        
                        {/* 2. FILTER BAR (Scrollable on Mobile) */}
                        <div className="flex items-center justify-center mb-10">
                            <div className="flex overflow-x-auto snap-x gap-3 pb-4 scrollbar-hide px-2 w-full md:w-auto md:justify-center">
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`snap-center px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                                            activeFilter === filter
                                            ? 'bg-brand-gold text-white border-brand-gold shadow-lg shadow-brand-gold/30 scale-105'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-brand-gold hover:text-brand-gold'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. PLAYLIST GRID */}
                        {filteredPlaylists.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {filteredPlaylists.map((playlist) => (
                                    <Link 
                                        key={playlist.id} 
                                        href={`/media/videos/playlists/${playlist.id}`}
                                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-brand-brown/10 transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col h-full"
                                    >
                                        {/* Image Area */}
                                        <div className="relative aspect-[16/10] bg-gray-200 overflow-hidden">
                                            <Image 
                                                src={playlist.cover || "/fallback.webp"} 
                                                alt={playlist.title} 
                                                fill 
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 border border-white/50">
                                                    <PlayCircle className="w-8 h-8 text-white fill-current" />
                                                </div>
                                            </div>
                                            
                                            {/* Top Badges */}
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm backdrop-blur-md border border-white/20 ${
                                                    playlist.category === 'English' ? 'bg-blue-600/90 text-white' :
                                                    playlist.category === 'Hausa' ? 'bg-green-600/90 text-white' : 
                                                    'bg-brand-gold/90 text-white'
                                                }`}>
                                                    {playlist.category}
                                                </span>
                                            </div>

                                            {/* Count Badge */}
                                            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-white/10">
                                                <ListVideo className="w-3 h-3 text-brand-gold" /> 
                                                {playlist.count} Videos
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-6 flex flex-col flex-grow" dir={getDir(playlist.title)}>
                                            <h3 className={`text-xl font-bold text-brand-brown-dark leading-snug group-hover:text-brand-gold transition-colors mb-2 line-clamp-2 ${getDir(playlist.title) === 'rtl' ? 'font-tajawal' : 'font-agency'}`}>
                                                {playlist.title}
                                            </h3>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-brand-brown transition-colors">
                                                    {getDir(playlist.title) === 'rtl' ? 'مشاهدة السلسلة' : 'View Series'}
                                                </span>
                                                <div className={`w-8 h-8 rounded-full bg-brand-sand flex items-center justify-center text-brand-brown group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300 ${getDir(playlist.title) === 'rtl' ? 'rotate-180' : ''}`}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ListVideo className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-400 font-agency">No Playlists Found</h3>
                                <p className="text-gray-400 text-sm mt-2">Try selecting a different category.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
