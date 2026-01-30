"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Play, Mic, Video, BookOpen, Camera, Headphones, ArrowRight, Loader2, Library } from 'lucide-react';

export default function MediaPage() {
    // State to handle Video Facade & Data
    const [playVideo, setPlayVideo] = useState(false);
    const [latestVideo, setLatestVideo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Media Categories Configuration
    const categories = [
        {
            id: 'videos',
            title: 'Video Library',
            subtitle: 'Lectures, Events & Series',
            link: '/media/videos',
            image: '/images/heroes/media-videos-hero.webp',
            icon: Video
        },
        {
            id: 'audios',
            title: 'Audio Archive',
            subtitle: 'Sermons, Tafsir & Recitations',
            link: '/media/audios',
            image: '/images/heroes/media-audios-hero.webp',
            icon: Mic 
        },
        {
            id: 'podcasts',
            title: 'Podcasts',
            subtitle: 'Discussions & Insights',
            link: '/media/podcasts',
            image: '/images/heroes/media-podcasts-hero.webp',
            icon: Headphones
        },
        {
            id: 'ebooks',
            title: 'Publications',
            subtitle: 'Books, Papers & Articles',
            link: '/media/ebooks',
            image: '/images/heroes/media-ebooks-hero.webp',
            icon: BookOpen
        },
        {
            id: 'gallery',
            title: 'Photo Gallery',
            subtitle: 'Moments & Memories',
            link: '/media/gallery',
            image: '/images/heroes/media-gallery-hero.webp',
            icon: Camera
        }
    ];

    // --- FETCH LATEST VIDEO ---
    useEffect(() => {
        const fetchLatestVideo = async () => {
            try {
                const q = query(
                    collection(db, "videos"), 
                    orderBy("createdAt", "desc"), 
                    limit(1)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const docData = snapshot.docs[0].data();
                    setLatestVideo({ id: snapshot.docs[0].id, ...docData });
                }
            } catch (error) {
                console.error("Error fetching latest video:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestVideo();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato text-brand-brown-dark">
            <Header />

            <main className="flex-grow pb-20">

                {/* 1. HERO SECTION (Refined) */}
                <section className="relative h-[50vh] min-h-[450px] w-full flex items-center justify-center overflow-hidden bg-brand-brown-dark mb-20">
                    <Image
                        src="/images/heroes/media-overview-hero.webp" 
                        alt="Media Library Hero"
                        fill
                        className="object-cover object-center opacity-40 mix-blend-luminosity"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-brown-dark via-brand-brown-dark/80 to-transparent"></div>

                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-brand-gold text-xs font-bold uppercase tracking-widest mb-6 shadow-lg">
                            <Library className="w-4 h-4" /> Digital Archive
                        </div>
                        <h1 className="font-agency text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none drop-shadow-2xl">
                            Media Resources
                        </h1>
                        <p className="font-lato text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            Access our archive of knowledge, lectures, and publications. Designed to inspire, educate, and preserve our heritage.
                        </p>
                    </div>
                </section>

                {/* 2. CATEGORY GRID (Modern Cards) */}
                <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto">
                    <div className="flex items-end justify-between border-b border-gray-100 pb-4 mb-10">
                        <div>
                            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Browse Content</span>
                            <h2 className="font-agency text-3xl md:text-5xl text-brand-brown-dark">
                                Library Sections
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                                <Link 
                                    key={cat.id} 
                                    href={cat.link}
                                    className={`group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-brand-gold/30 h-64 md:h-72 ${cat.id === 'gallery' ? 'lg:col-span-2' : ''}`}
                                >
                                    {/* Background Image */}
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-dark via-brand-brown-dark/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                                        <div className="flex items-center gap-4 mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors duration-300">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-agency text-3xl text-white leading-none mb-1">
                                                    {cat.title}
                                                </h3>
                                                <p className="font-lato text-xs text-white/70 uppercase tracking-widest font-bold">
                                                    {cat.subtitle}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Accent Line */}
                                        <div className="w-full h-0.5 bg-white/20 mt-6 overflow-hidden rounded-full">
                                            <div className="h-full w-full bg-brand-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* 3. FEATURED / LATEST UPLOAD */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
                    </div>
                ) : latestVideo && (
                    <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
                        <div className="mb-10 text-center md:text-left">
                            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Featured Content</span>
                            <h2 className="font-agency text-4xl md:text-6xl text-brand-brown-dark">
                                Latest Release
                            </h2>
                        </div>

                        <div className="bg-brand-brown-dark rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-gray-800">
                            {/* Video Preview Area */}
                            <div className="relative w-full lg:w-2/3 aspect-video bg-black group">
                                {!playVideo ? (
                                    <button 
                                        onClick={() => setPlayVideo(true)}
                                        className="absolute inset-0 w-full h-full relative cursor-pointer"
                                    >
                                        <Image 
                                            src={latestVideo.thumbnail || "/fallback.webp"} 
                                            alt={latestVideo.title} 
                                            fill 
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {/* Custom Play Button */}
                                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white shadow-2xl group-hover:scale-110 group-hover:bg-brand-gold group-hover:border-brand-gold transition-all duration-300">
                                                <Play className="w-8 h-8 fill-current ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">
                                            Click to Play
                                        </div>
                                    </button>
                                ) : (
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${latestVideo.videoId}?rel=0&modestbranding=1&autoplay=1`}
                                        title={latestVideo.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>

                            {/* Info Area */}
                            <div className="p-10 lg:w-1/3 flex flex-col justify-center bg-brand-brown-dark text-white relative overflow-hidden">
                                {/* Subtle Background Pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                                <div className="relative z-10">
                                    <span className="inline-block px-3 py-1 bg-brand-gold text-brand-brown-dark text-[10px] font-bold uppercase rounded-md shadow-sm w-fit mb-5">
                                        {latestVideo.category || "New Video"}
                                    </span>
                                    <h3 className="font-agency text-3xl md:text-4xl mb-4 leading-tight">
                                        {latestVideo.title}
                                    </h3>
                                    <div className="w-12 h-1 bg-brand-gold/30 rounded-full mb-6"></div>
                                    <p className="font-lato text-sm md:text-base text-white/70 line-clamp-4 leading-relaxed mb-8">
                                        {latestVideo.description || "Watch our latest lecture to gain insights and knowledge."}
                                    </p>
                                    
                                    <Link 
                                        href="/media/videos" 
                                        className="inline-flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest hover:text-white transition-colors group"
                                    >
                                        Browse Video Library <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    );
}
