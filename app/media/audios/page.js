"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
// Firebase Imports
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { Play, Download, ListMusic, Mic, Clock, Calendar, Filter, Loader2, Globe, ChevronRight } from 'lucide-react';

export default function AudiosPage() {

    // --- STATE ---
    const [allAudios, setAllAudios] = useState([]);
    const [allSeries, setAllSeries] = useState([]);
    
    // Filtered State
    const [filteredAudios, setFilteredAudios] = useState([]);
    const [filteredSeries, setFilteredSeries] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [activeLang, setActiveLang] = useState("English");
    const [activeGenre, setActiveGenre] = useState("All");
    const [visibleCount, setVisibleCount] = useState(6);

    const languages = ["English", "Hausa", "Arabic"];
    const genres = ["All", "Friday Sermon", "Tafsir Series", "Fiqh Class", "General Lecture", "Seerah"];

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Audios
                const qAudios = query(collection(db, "audios"), orderBy("date", "desc"));
                const audiosSnapshot = await getDocs(qAudios);
                const fetchedAudios = audiosSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllAudios(fetchedAudios);

                // 2. Fetch Audio Series
                const qSeries = query(collection(db, "audio_series"), orderBy("createdAt", "desc"));
                const seriesSnapshot = await getDocs(qSeries);
                const fetchedSeries = seriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllSeries(fetchedSeries);

            } catch (error) {
                console.error("Error fetching audio data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- FILTER LOGIC ---
    useEffect(() => {
        // 1. Filter by Language
        const langAudios = allAudios.filter(a => a.category === activeLang);
        const langSeries = allSeries.filter(s => s.category === activeLang);

        // 2. Filter Audios by Genre (if selected)
        const finalAudios = activeGenre === "All" 
            ? langAudios 
            : langAudios.filter(a => a.genre === activeGenre);

        setFilteredAudios(finalAudios);
        setFilteredSeries(langSeries);
        setVisibleCount(6); // Reset pagination

    }, [activeLang, activeGenre, allAudios, allSeries]);

    // --- HELPER: Format Date ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getDir = (text) => {
        if (!text) return 'ltr';
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text) ? 'rtl' : 'ltr';
    };

    const visibleAudios = filteredAudios.slice(0, visibleCount);

    return (
        <div className="min-h-screen flex flex-col bg-brand-sand font-lato">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8 md:mb-12">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[3.5/1] lg:aspect-[4/1]">
                        <Image
                            src="/images/heroes/media-audios-hero.webp" 
                            alt="Audio Library Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-brand-gold/40 to-transparent "></div>
                    </div>

                    <div className="relative -mt-16 md:-mt-32 text-center px-6 z-10 max-w-4xl mx-auto">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-brand-brown-dark mb-4 drop-shadow-md">
                            Audio Library
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
                        <p className="font-lato text-brand-brown text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            Listen to sermons, tafsir, and educational series on the go. Build your personal library of knowledge.
                        </p>
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader size="md" />
                    </div>
                ) : (
                    <>
                        {/* 2. LANGUAGE FILTER */}
                        <section className="px-6 md:px-12 lg:px-24 mb-10 max-w-7xl mx-auto">
                            <div className="flex justify-center">
                                <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100 flex gap-2">
                                    {languages.map((lang) => (
                                        <button 
                                            key={lang} 
                                            onClick={() => { setActiveLang(lang); setActiveGenre("All"); }}
                                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                                                activeLang === lang 
                                                ? 'bg-brand-brown-dark text-white shadow-md' 
                                                : 'bg-transparent text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 3. FEATURED SERIES */}
                        {filteredSeries.length > 0 && (
                            <section className="px-6 md:px-12 lg:px-24 mb-12 max-w-7xl mx-auto">
                                <div className="flex justify-between items-end mb-6">
                                    <h2 className="font-agency text-2xl md:text-3xl text-brand-brown-dark">
                                        Featured Series
                                    </h2>
                                    <Link href="/media/audios/series" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-gold transition-colors flex items-center gap-1">
                                        View All <ChevronRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 scrollbar-hide snap-x">
                                    {filteredSeries.slice(0, 3).map((item) => (
                                        <Link 
                                            key={item.id} 
                                            href={`/media/audios/series/${item.id}`}
                                            className="snap-center min-w-[200px] md:min-w-0 bg-white rounded-2xl overflow-hidden cursor-pointer group hover:shadow-xl transition-all border border-gray-100"
                                        >
                                            <div className="relative w-full aspect-square bg-gray-200">
                                                <Image 
                                                    src={item.cover || "/fallback.webp"} 
                                                    alt={item.title} 
                                                    fill 
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                                        <ListMusic className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-5 text-center">
                                                <h3 className={`font-agency text-lg md:text-xl text-brand-brown-dark leading-tight group-hover:text-brand-gold transition-colors truncate ${getDir(item.title) === 'rtl' ? 'font-tajawal font-bold' : ''}`}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                                                    <Mic className="w-3 h-3" /> {item.host || "Sheikh Goni"}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 4. GENRE FILTER BAR */}
                        <section className="px-6 md:px-12 lg:px-24 mb-8 max-w-7xl mx-auto">
                            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                                {genres.map((genre, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveGenre(genre)}
                                        className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                                            activeGenre === genre 
                                            ? 'bg-brand-brown-dark text-white border-brand-brown-dark shadow-md' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-brand-gold hover:text-brand-gold'
                                        }`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 5. AUDIO LIST */}
                        <section className="px-6 md:px-12 lg:px-24 space-y-4 max-w-7xl mx-auto">
                            <div className="flex justify-between items-end mb-4">
                                 <h2 className="font-agency text-2xl md:text-3xl text-brand-brown-dark">
                                    Latest Uploads
                                </h2>
                            </div>

                            {visibleAudios.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {visibleAudios.map((audio) => (
                                        <div key={audio.id} className="group bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-brand-gold/30">

                                            {/* Play Icon */}
                                            <Link 
                                                href={`/media/audios/play/${audio.id}`}
                                                className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-sand text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-colors shadow-sm"
                                            >
                                                <Play className="w-5 h-5 md:w-6 md:h-6 ml-1 fill-current" />
                                            </Link>

                                            {/* Content */}
                                            <div className="flex-grow min-w-0" dir={getDir(audio.title)}>
                                                <div className="flex justify-between items-start mb-1" dir="ltr">
                                                    <span className="text-[10px] md:text-xs font-bold text-brand-brown px-2 py-0.5 rounded bg-brand-sand uppercase tracking-wider">
                                                        {audio.genre}
                                                    </span>
                                                    <span className="text-[10px] md:text-xs text-gray-400 font-lato flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {audio.fileSize}
                                                    </span>
                                                </div>

                                                <Link href={`/media/audios/play/${audio.id}`}>
                                                    <h3 className={`font-agency text-lg md:text-xl text-brand-brown-dark leading-tight truncate pr-2 group-hover:text-brand-gold transition-colors cursor-pointer ${getDir(audio.title) === 'rtl' ? 'font-tajawal font-bold text-right' : ''}`}>
                                                        {audio.title}
                                                    </h3>
                                                </Link>

                                                <div className="flex items-center gap-3 mt-2" dir="ltr">
                                                    <p className="text-[10px] md:text-xs text-gray-500 font-lato flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {formatDate(audio.date)}
                                                    </p>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <p className="text-[10px] md:text-xs text-gray-500 font-lato truncate max-w-[120px]">
                                                        {audio.speaker}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Download Action */}
                                            <a 
                                                href={audio.audioUrl} 
                                                download 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 text-gray-300 hover:text-brand-brown-dark hover:bg-gray-50 p-2 rounded-full transition-colors" 
                                                title="Download Audio"
                                            >
                                                <Download className="w-5 h-5 md:w-6 md:h-6" />
                                            </a>

                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <Mic className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No audio tracks found for this category.</p>
                                </div>
                            )}
                        </section>

                        {/* 5. LOAD MORE */}
                        {visibleCount < filteredAudios.length && (
                            <section className="py-12 text-center">
                                <button 
                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                    className="px-8 py-3 bg-white border border-gray-200 text-brand-brown-dark rounded-full font-bold text-sm hover:bg-brand-brown-dark hover:text-white transition-colors shadow-sm uppercase tracking-wide"
                                >
                                    Load More Audios
                                </button>
                            </section>
                        )}
                    </>
                )}

            </main>

            <Footer />
        </div>
    );
}
