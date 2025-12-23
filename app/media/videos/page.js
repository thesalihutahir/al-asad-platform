"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Play, ListVideo, Clock, Filter } from 'lucide-react';

export default function VideosPage() {

    // Mock Data for Playlists (Series)
    const playlists = [
        {
            id: 'tafsir-2024',
            title: "Tafsir Surah Al-Baqarah (2024)",
            count: 24,
            image: "/hero.jpg", 
        },
        {
            id: 'ramadan-spiritual',
            title: "Ramadan Spiritual Guide",
            count: 10,
            image: "/hero.jpg", 
        },
        {
            id: 'seerah',
            title: "Seerah: Life of the Prophet (SAW)",
            count: 15,
            image: "/hero.jpg", 
        }
    ];

    // Mock Data for All Videos
    const videos = [
        {
            id: 1,
            title: "Tafsir Surah Al-Baqarah: Ayah 255",
            category: "Tafsir",
            date: "20 Dec 2024",
            duration: "45:00",
            image: "/hero.jpg", 
            url: "#" 
        },
        {
            id: 2,
            title: "The Importance of Zakat in Modern Society",
            category: "Lecture",
            date: "15 Dec 2024",
            duration: "32:15",
            image: "/hero.jpg", 
            url: "#"
        },
        {
            id: 3,
            title: "Annual Community Iftar Gathering 2024",
            category: "Event",
            date: "10 Mar 2024",
            duration: "12:50",
            image: "/hero.jpg", 
            url: "#"
        },
        {
            id: 4,
            title: "Preparing for Ramadan: Spiritual Guide",
            category: "Lecture",
            date: "01 Mar 2024",
            duration: "55:00",
            image: "/hero.jpg", 
            url: "#"
        },
        {
            id: 5,
            title: "Understanding Islamic Finance",
            category: "Workshop",
            date: "28 Feb 2024",
            duration: "1:15:00",
            image: "/hero.jpg", 
            url: "#"
        },
        {
            id: 6,
            title: "The Rights of Parents",
            category: "Khutbah",
            date: "20 Feb 2024",
            duration: "28:00",
            image: "/hero.jpg", 
            url: "#"
        }
    ];

    // Filter Categories
    const filters = ["All Videos", "Tafsir", "Lectures", "Events", "Shorts"];

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8 md:mb-12">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[3.5/1] lg:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" 
                            alt="Video Archive Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white"></div>
                    </div>

                    <div className="relative -mt-16 md:-mt-32 text-center px-6 z-10 max-w-4xl mx-auto">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-brand-brown-dark mb-4 drop-shadow-md">
                            Video Library
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
                        <p className="font-lato text-brand-brown text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            Watch lectures, sermons, and event highlights from Al-Asad Foundation. Explore our curated series and latest uploads.
                        </p>
                    </div>
                </section>

                {/* 2. PLAYLISTS / SERIES SECTION (NEW) */}
                <section className="px-6 md:px-12 lg:px-24 mb-12">
                    <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-2">
                        <h2 className="font-agency text-2xl md:text-4xl text-brand-brown-dark">
                            Featured Series
                        </h2>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">
                            Curated Playlists
                        </span>
                    </div>

                    {/* Mobile: Horizontal Scroll | Desktop: Grid */}
                    <div className="flex overflow-x-auto gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 scrollbar-hide snap-x">
                        {playlists.map((playlist) => (
                            <div 
                                key={playlist.id} 
                                className="snap-center min-w-[260px] md:min-w-0 bg-brand-sand/30 rounded-2xl overflow-hidden cursor-pointer group hover:shadow-lg transition-all"
                            >
                                {/* Playlist Thumbnail */}
                                <div className="relative w-full aspect-[16/10]">
                                    <Image 
                                        src={playlist.image} 
                                        alt={playlist.title} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Overlay with Playlist Icon */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                            <ListVideo className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    {/* Count Badge */}
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                        <ListVideo className="w-3 h-3" /> {playlist.count} Videos
                                    </div>
                                </div>
                                
                                {/* Playlist Info */}
                                <div className="p-4">
                                    <h3 className="font-agency text-lg md:text-xl text-brand-brown-dark leading-tight group-hover:text-brand-gold transition-colors">
                                        {playlist.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-wider">
                                        View Full Playlist →
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. FILTER BAR */}
                <section className="px-6 md:px-12 lg:px-24 mb-8">
                     <div className="flex items-center gap-2 mb-4 md:hidden">
                        <Filter className="w-4 h-4 text-brand-brown" />
                        <span className="text-xs font-bold uppercase tracking-widest text-brand-brown">Filter Content</span>
                    </div>
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide md:justify-center md:flex-wrap">
                        {filters.map((filter, index) => (
                            <button 
                                key={index}
                                className={`px-5 py-2 md:px-6 md:py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                                    index === 0 
                                    ? 'bg-brand-gold text-white shadow-md transform md:scale-105' 
                                    : 'bg-brand-sand text-brand-brown-dark hover:bg-brand-gold/10 hover:text-brand-gold'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 4. ALL VIDEOS GRID */}
                <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
                     <div className="flex justify-between items-end mb-6 md:mb-8">
                        <h2 className="font-agency text-2xl md:text-4xl text-brand-brown-dark">
                            Recent Uploads
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {videos.map((video) => (
                            <div key={video.id} className="group block bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-xl">

                                {/* Thumbnail Container */}
                                <div className="relative w-full aspect-video bg-gray-900">
                                    <Image
                                        src={video.image}
                                        alt={video.title}
                                        fill
                                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-brand-gold group-hover:scale-110 transition-all duration-300 shadow-md">
                                            <Play className="w-5 h-5 md:w-7 md:h-7 text-white fill-current ml-1" />
                                        </div>
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {video.duration}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest bg-brand-gold/10 px-2 py-0.5 rounded">
                                            {video.category}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-lato">
                                            {video.date}
                                        </span>
                                    </div>

                                    <h3 className="font-agency text-xl md:text-2xl text-brand-brown-dark leading-tight mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                                        {video.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-auto">
                                        <p className="text-xs font-bold text-brand-brown group-hover:underline decoration-brand-gold/50 underline-offset-4">
                                            Watch Now
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. LOAD MORE */}
                <section className="py-12 text-center">
                    <button className="px-8 py-3 border-2 border-brand-sand text-brand-brown-dark rounded-full font-agency text-lg hover:bg-brand-brown-dark hover:text-white transition-colors uppercase tracking-wide">
                        Load More Videos
                    </button>
                </section>

            </main>

            <Footer />
        </div>
    );
}
