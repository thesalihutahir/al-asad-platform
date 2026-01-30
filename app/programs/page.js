"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

import { 
    GraduationCap, 
    HandHeart, 
    Lightbulb,
    ArrowRight,
    Calendar,
    MapPin,
    Layers
} from 'lucide-react';

export default function ProgramsPage() {

    // --- STATE ---
    const [recentPrograms, setRecentPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH RECENT PROGRAMS ---
    useEffect(() => {
        const fetchRecent = async () => {
            try {
                // Fetch 3 latest 'Active' programs from ANY category
                const q = query(
                    collection(db, "programs"),
                    where("status", "==", "Active"),
                    orderBy("createdAt", "desc"),
                    limit(3)
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRecentPrograms(data);
            } catch (error) {
                console.error("Error fetching recent programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, []);

    // Static Category Configuration
    const categories = [
        {
            id: 'education',
            title: 'Educational Support',
            description: 'Nurturing minds through Qur’anic values, scholarships, and academic excellence initiatives.',
            link: '/programs/educational-support',
            image: '/images/heroes/programs-educational-support-hero.webp', 
            icon: GraduationCap 
        },
        {
            id: 'community',
            title: 'Community Development',
            description: 'Empowering society through welfare, hunger relief, and sustainable aid projects.',
            link: '/programs/community-development',
            image: '/images/heroes/programs-community-development-hero.webp', 
            icon: HandHeart
        },
        {
            id: 'training',
            title: 'Training & Innovation',
            description: 'Equipping the future generation with digital skills, workshops, and modern vocational training.',
            link: '/programs/training-and-innovation',
            image: '/images/heroes/programs-training-innovation-hero.webp', 
            icon: Lightbulb
        }
    ];

    // Helper: Format Date
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000); // Handle Firestore Timestamp
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato text-brand-brown-dark">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION (Redesigned) */}
                <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden bg-brand-brown-dark mb-16">
                    <Image
                        src="/images/heroes/programs-overview-hero.webp" 
                        alt="Programs Overview"
                        fill
                        className="object-cover object-center opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-dark via-transparent to-transparent"></div>
                    
                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
                            Our Initiatives
                        </span>
                        <h1 className="font-agency text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-none drop-shadow-xl">
                            Impact & Outreach
                        </h1>
                        <p className="font-lato text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            A holistic approach to serving humanity—building minds, supporting lives, and innovating for the future.
                        </p>
                    </div>
                </section>
                {/* 2. PROGRAM CATEGORIES (Core Pillars) */}
                <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-24 -mt-24 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat) => {
                            const IconComponent = cat.icon;
                            return (
                                <Link 
                                    key={cat.id} 
                                    href={cat.link}
                                    className="group relative bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col h-full hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
                                >
                                    {/* Card Image Area */}
                                    <div className="relative w-full h-56 overflow-hidden">
                                        <Image
                                            src={cat.image}
                                            alt={cat.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                        
                                        {/* Icon Overlay */}
                                        <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white group-hover:bg-brand-gold group-hover:border-brand-gold transition-colors duration-300">
                                            <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                                        </div>

                                        {/* Title Overlay */}
                                        <div className="absolute bottom-0 left-0 w-full p-6">
                                            <h2 className="font-agency text-3xl text-white mb-1 leading-tight group-hover:text-brand-gold transition-colors">
                                                {cat.title}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Card Content Area */}
                                    <div className="p-8 flex-grow flex flex-col bg-white">
                                        <p className="font-lato text-sm text-gray-600 leading-relaxed mb-6 flex-grow">
                                            {cat.description}
                                        </p>

                                        <div className="flex items-center text-brand-brown-dark font-bold text-xs uppercase tracking-widest mt-auto group/link pt-4 border-t border-gray-50">
                                            <span>Explore Pillar</span>
                                            <ArrowRight className="w-3.5 h-3.5 ml-2 text-brand-gold transition-transform group-hover/link:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* 3. RECENT HIGHLIGHTS (Dynamic) */}
                {!loading && recentPrograms.length > 0 && (
                    <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-3 block">What's Happening Now</span>
                            <h2 className="font-agency text-4xl md:text-5xl text-brand-brown-dark">Recent Initiatives</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {recentPrograms.map((program) => (
                                <Link 
                                    key={program.id} 
                                    href={`/programs/${program.id}`}
                                    className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-brand-gold/20"
                                >
                                    <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                                        <Image 
                                            src={program.coverImage || "/fallback.webp"} 
                                            alt={program.title} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-brand-brown-dark uppercase tracking-wider shadow-sm border border-white/50">
                                            {program.category}
                                        </div>
                                    </div>

                                    <div className="p-7 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-3 font-bold uppercase tracking-wider">
                                            {program.createdAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {formatDate(program.createdAt)}
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="font-agency text-2xl text-brand-brown-dark mb-3 line-clamp-2 leading-tight group-hover:text-brand-gold transition-colors">
                                            {program.title}
                                        </h4>

                                        <p className="font-lato text-sm text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
                                            {program.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                            {program.location ? (
                                                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                    <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {program.location}
                                                </span>
                                            ) : (<span></span>)}
                                            
                                            <span className="text-xs font-bold text-brand-brown-dark group-hover:text-brand-gold transition-colors flex items-center gap-1">
                                                Details <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
                {/* 4. CTA SECTION */}
                <section className="px-6 md:px-0 mb-16">
                    <div className="mx-auto max-w-5xl bg-brand-brown-dark rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        {/* Background Patterns */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                        <div className="relative z-10">
                            <span className="inline-block mb-4 p-3 bg-white/10 rounded-full">
                                <HandHeart className="w-8 h-8 text-brand-gold" />
                            </span>
                            <h3 className="font-agency text-3xl md:text-5xl mb-6">Support Our Mission</h3>
                            <p className="font-lato text-base md:text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                                Your contribution fuels these initiatives and brings hope to communities. Join us in building a legacy of knowledge and care.
                            </p>
                            <Link
                                href="/get-involved/donate"
                                className="inline-flex items-center gap-2 py-4 px-10 font-agency text-xl text-brand-brown-dark bg-white rounded-full shadow-lg hover:bg-brand-gold hover:text-white transition-all transform hover:scale-105 duration-200"
                            >
                                Donate Now <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
