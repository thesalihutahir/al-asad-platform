"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
// Firebase Imports
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { 
    Play, Mic, Calendar, Clock, Search, ArrowLeft, 
    Share2, Bell, Check, ListMusic 
} from 'lucide-react';

export default function ViewShowPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    // --- STATE ---
    const [show, setShow] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [filteredEpisodes, setFilteredEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // 1. Fetch Show Details
                const showDocRef = doc(db, "podcast_shows", id);
                const showSnap = await getDoc(showDocRef);

                if (showSnap.exists()) {
                    const showData = { id: showSnap.id, ...showSnap.data() };
                    setShow(showData);

                    // 2. Fetch Episodes for this Show
                    // Note: Episodes store the Show Title string based on previous Admin logic
                    const qEpisodes = query(
                        collection(db, "podcasts"),
                        where("show", "==", showData.title),
                        orderBy("date", "desc")
                    );
                    
                    const epSnapshot = await getDocs(qEpisodes);
                    const fetchedEpisodes = epSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setEpisodes(fetchedEpisodes);
                    setFilteredEpisodes(fetchedEpisodes);
                } else {
                    console.error("Show not found");
                    router.push('/media/podcasts/shows');
                }
            } catch (error) {
                console.error("Error fetching show data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    // --- FILTER LOGIC ---
    useEffect(() => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const results = episodes.filter(ep => 
                ep.title.toLowerCase().includes(term) ||
                (ep.description && ep.description.toLowerCase().includes(term))
            );
            setFilteredEpisodes(results);
        } else {
            setFilteredEpisodes(episodes);
        }
    }, [searchTerm, episodes]);

    // --- HELPER: Format Date ---
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // --- HELPER: Auto-Detect Arabic ---
    const getDir = (text) => {
        if (!text) return 'ltr';
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text) ? 'rtl' : 'ltr';
    };

    if (loading) return <Loader size="lg" className="h-screen bg-brand-sand" />;
    if (!show) return null;

    const isArabic = show.category === 'Arabic';

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-20">
                
                {/* 1. IMMERSIVE HEADER SECTION */}
                <div className="relative w-full bg-brand-brown-dark overflow-hidden">
                    {/* Blurred Backdrop */}
                    <div className="absolute inset-0">
                        <Image 
                            src={show.cover || "/fallback.webp"} 
                            alt="Backdrop" 
                            fill 
                            className="object-cover opacity-20 blur-3xl scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-brand-brown-dark/80 to-brand-brown-dark"></div>
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24">
                        {/* Back Link */}
                        <Link href="/media/podcasts/shows" className="inline-flex items-center text-white/60 hover:text-brand-gold mb-8 text-xs font-bold uppercase tracking-widest transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shows
                        </Link>

                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left">
                            
                            {/* Cover Art */}
                            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-gray-800">
                                <Image 
                                    src={show.cover || "/fallback.webp"} 
                                    alt={show.title} 
                                    fill 
                                    className="object-cover" 
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-grow flex flex-col justify-center h-full pt-2 text-white" dir={isArabic ? 'rtl' : 'ltr'}>
                                <div className={`flex items-center gap-3 mb-4 justify-center ${isArabic ? 'md:justify-end' : 'md:justify-start'}`} dir="ltr">
                                    <span className="px-3 py-1 bg-brand-gold text-white rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                        {show.category} Series
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                        <ListMusic className="w-3 h-3" /> {episodes.length} Episodes
                                    </span>
                                </div>

                                <h1 className={`text-4xl md:text-6xl font-bold mb-4 leading-tight ${isArabic ? 'font-tajawal' : 'font-agency'}`}>
                                    {show.title}
                                </h1>

                                <div className={`flex items-center gap-2 text-white/70 font-bold uppercase tracking-wide text-xs md:text-sm mb-6 justify-center ${isArabic ? 'md:justify-end' : 'md:justify-start'}`} dir="ltr">
                                    <Mic className="w-4 h-4 text-brand-gold" />
                                    <span>Hosted by {show.host}</span>
                                </div>

                                <p className={`text-white/80 text-sm md:text-lg leading-relaxed max-w-2xl mb-8 ${isArabic ? 'font-arabic' : 'font-lato'}`}>
                                    {show.description}
                                </p>

                                {/* Action Buttons */}
                                <div className={`flex items-center gap-4 justify-center ${isArabic ? 'md:justify-end' : 'md:justify-start'}`}>
                                    <button 
                                        onClick={() => setIsSubscribed(!isSubscribed)}
                                        className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                                            isSubscribed 
                                            ? 'bg-green-600 text-white hover:bg-green-700' 
                                            : 'bg-white text-brand-brown-dark hover:bg-brand-gold hover:text-white'
                                        }`}
                                    >
                                        {isSubscribed ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                    </button>
                                    <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. EPISODES LIST SECTION */}
                <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 md:p-10 min-h-[400px]">
                        
                        {/* Header & Search */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                            <h2 className="font-agency text-3xl text-brand-brown-dark">
                                All Episodes
                            </h2>
                            <div className="relative w-full md:w-72">
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={isArabic ? "بحث في الحلقات..." : "Search episodes..."}
                                    className={`w-full pl-10 pr-4 py-3 bg-brand-sand/30 border border-transparent focus:bg-white focus:border-brand-gold rounded-xl text-sm focus:outline-none transition-all ${isArabic ? 'text-right font-arabic' : ''}`}
                                    dir={isArabic ? 'rtl' : 'ltr'}
                                />
                                <Search className={`absolute w-4 h-4 text-gray-400 top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'}`} />
                            </div>
                        </div>

                        {/* List */}
                        {filteredEpisodes.length > 0 ? (
                            <div className="space-y-4">
                                {filteredEpisodes.map((ep) => (
                                    <div 
                                        key={ep.id} 
                                        className="group flex flex-col md:flex-row gap-5 p-4 rounded-2xl hover:bg-brand-sand/30 border border-transparent hover:border-brand-gold/20 transition-all"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-full md:w-48 aspect-video md:aspect-[3/2] flex-shrink-0 rounded-xl overflow-hidden bg-black shadow-sm">
                                            <Image 
                                                src={ep.thumbnail || "/fallback.webp"} 
                                                alt={ep.title} 
                                                fill 
                                                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" 
                                            />
                                            <Link href={`/media/podcasts/play/${ep.id}`} className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-grow flex flex-col justify-center" dir={getDir(ep.title)}>
                                            <div className="flex items-center gap-3 mb-2" dir="ltr">
                                                <span className="text-[10px] font-bold text-white bg-brand-brown px-2 py-0.5 rounded">
                                                    EP {ep.episodeNumber || '0'}
                                                </span>
                                                {ep.season && (
                                                    <span className="text-[10px] font-bold text-brand-brown-dark bg-brand-sand px-2 py-0.5 rounded">
                                                        Season {ep.season}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {formatDate(ep.date)}
                                                </span>
                                            </div>

                                            <Link href={`/media/podcasts/play/${ep.id}`}>
                                                <h3 className={`text-xl font-bold text-brand-brown-dark leading-tight mb-2 group-hover:text-brand-gold transition-colors ${getDir(ep.title) === 'rtl' ? 'font-tajawal' : 'font-agency'}`}>
                                                    {ep.title}
                                                </h3>
                                            </Link>

                                            <p className={`text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3 ${getDir(ep.description) === 'rtl' ? 'font-arabic' : ''}`}>
                                                {ep.description || "No description available."}
                                            </p>

                                            {/* Action Link */}
                                            <Link 
                                                href={`/media/podcasts/play/${ep.id}`}
                                                className={`text-xs font-bold text-brand-gold uppercase tracking-widest hover:text-brand-brown-dark transition-colors inline-flex items-center gap-1 ${getDir(ep.title) === 'rtl' ? 'flex-row-reverse self-end' : ''}`}
                                            >
                                                {getDir(ep.title) === 'rtl' ? 'استمع الآن' : 'Listen Now'} <Play className={`w-3 h-3 fill-current ${getDir(ep.title) === 'rtl' ? 'rotate-180' : ''}`} />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Mic className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-bold">No episodes found.</p>
                                <p className="text-xs">Try searching for something else.</p>
                            </div>
                        )}
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}
