"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VideosPage() {
    
    // Mock Data for Videos
    const videos = [
        {
            id: 1,
            title: "Tafsir Surah Al-Baqarah: Ayah 255",
            category: "Tafsir",
            date: "20 Dec 2024",
            duration: "45:00",
            image: "/hero.jpg", // Placeholder
            url: "https://youtube.com/..." 
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
        }
    ];

    // Filter Categories (Visual only for now)
    const filters = ["All Videos", "Tafsir", "Lectures", "Events", "Shorts"];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-6">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" 
                            alt="Video Archive Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            Video Library
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            Watch lectures, sermons, and event highlights from Al-Asad Foundation.
                        </p>
                    </div>
                </section>

                {/* 2. FILTER BAR */}
                <section className="px-6 mb-8">
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                        {filters.map((filter, index) => (
                            <button 
                                key={index}
                                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                                    index === 0 
                                    ? 'bg-brand-gold text-white shadow-md' 
                                    : 'bg-brand-sand text-brand-brown-dark hover:bg-brand-gold/10'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. VIDEO GRID */}
                <section className="px-6 space-y-6">
                    {videos.map((video) => (
                        <div key={video.id} className="group block bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-transform hover:-translate-y-1">
                            
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
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-brand-gold group-hover:scale-110 transition-all duration-300">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Duration Badge */}
                                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {video.duration}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">
                                        {video.category}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-lato">
                                        {video.date}
                                    </span>
                                </div>
                                
                                <h3 className="font-agency text-xl text-brand-brown-dark leading-tight mb-2 group-hover:text-brand-gold transition-colors">
                                    {video.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 mt-3">
                                    <p className="text-xs font-bold text-brand-brown underline decoration-brand-gold/50">
                                        Watch Now
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 4. LOAD MORE (Future functionality) */}
                <section className="py-8 text-center">
                    <button className="px-6 py-3 border-2 border-brand-sand text-brand-brown-dark rounded-full font-agency text-sm hover:bg-brand-sand transition-colors">
                        Load More Videos
                    </button>
                </section>

            </main>

            <Footer />
        </div>
    );
}
