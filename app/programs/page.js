"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

import { 
    GraduationCap, 
    HandHeart, 
    Lightbulb, 
    Wrench,
    HeartPulse,
    Megaphone,
    Loader2
} from 'lucide-react';

export default function ProgramsPage() {

    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper: Map Category string to Icon Component
    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Education': return GraduationCap;
            case 'Welfare': return HandHeart;
            case 'Infrastructure': return Wrench;
            case 'Health': return HeartPulse;
            case 'Da\'wah': return Megaphone;
            default: return Lightbulb;
        }
    };

    // Fetch Data
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                // Fetch only 'Active' or 'Completed' programs
                const q = query(
                    collection(db, "programs"),
                    where("status", "in", ["Active", "Completed", "Upcoming"]),
                    orderBy("createdAt", "desc")
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPrograms(data);
            } catch (error) {
                console.error("Error fetching programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8 md:mb-16">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[3/1] lg:aspect-[4/1]">
                        <Image
                            src="/images/heroes/programs-overview-hero.webp" 
                            alt="Programs Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-brand-gold/40 to-transparent "></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-24 lg:-mt-32 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-brand-brown-dark mb-3 md:mb-6 drop-shadow-sm">
                            Our Programs
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-4 md:mb-6"></div>
                        <p className="font-lato text-brand-brown text-sm md:text-xl max-w-md md:max-w-2xl mx-auto leading-relaxed">
                            A holistic approach to serving humanity—building minds, supporting lives, and innovating for the future.
                        </p>
                    </div>
                </section>

                {/* 2. PROGRAM CARDS LIST */}
                <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
                        </div>
                    ) : programs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {programs.map((program) => {
                                const IconComponent = getCategoryIcon(program.category); 
                                
                                return (
                                    <Link 
                                        key={program.id} 
                                        href={`/programs/${program.id}`} // Dynamic Link
                                        className="block group relative bg-brand-sand rounded-3xl overflow-hidden shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full"
                                    >
                                        {/* Card Image Area */}
                                        <div className="relative w-full h-48 md:h-56 bg-gray-200">
                                            <Image
                                                src={program.coverImage || "/fallback.webp"}
                                                alt={program.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                            {/* Status Badge */}
                                            <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand-brown-dark">
                                                {program.status}
                                            </div>

                                            {/* Floating Icon Badge */}
                                            <div className="absolute -bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-brand-brown-dark z-10 group-hover:scale-110 transition-transform duration-300">
                                                <IconComponent 
                                                    className="w-7 h-7 md:w-8 md:h-8 text-brand-brown-dark" 
                                                    strokeWidth={1.5} 
                                                />
                                            </div>
                                        </div>

                                        {/* Card Content Area */}
                                        <div className="pt-10 pb-6 px-6 md:pt-12 md:px-8 flex-grow flex flex-col">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                                {program.category}
                                            </div>
                                            <h2 className="font-agency text-2xl md:text-3xl text-brand-brown-dark mb-3 group-hover:text-brand-gold transition-colors leading-tight">
                                                {program.title}
                                            </h2>
                                            <p className="font-lato text-sm md:text-base text-brand-brown leading-relaxed mb-6 line-clamp-3 flex-grow">
                                                {program.excerpt}
                                            </p>

                                            <div className="flex items-center text-brand-gold font-bold text-xs md:text-sm uppercase tracking-widest mt-auto">
                                                <span>Explore Program</span>
                                                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No active programs found at the moment.</p>
                        </div>
                    )}
                </section>

                {/* 3. CTA SECTION */}
                <section className="mt-16 md:mt-24 px-6 md:px-0">
                    <div className="mx-auto max-w-4xl bg-brand-brown-dark rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-brand-gold opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white opacity-5 rounded-full blur-3xl -ml-10 -mb-10"></div>

                        <h3 className="font-agency text-2xl md:text-4xl mb-4 relative z-10">Support Our Mission</h3>
                        <p className="font-lato text-sm md:text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed relative z-10">
                            Your contribution fuels these initiatives and brings hope to communities. Join us in building a legacy of knowledge and care.
                        </p>
                        <Link
                            href="/get-involved/donate"
                            className="inline-block py-3 px-8 md:px-12 md:py-4 font-agency text-lg md:text-xl text-brand-brown-dark bg-white rounded-full shadow-lg hover:bg-brand-gold hover:text-white transition-colors relative z-10 transform hover:scale-105 duration-200"
                        >
                            Donate Now
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}