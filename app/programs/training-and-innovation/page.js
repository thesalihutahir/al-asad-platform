"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
// Firebase Imports
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Laptop, Briefcase, Cpu, Code, ArrowRight, Zap, Target } from 'lucide-react';

export default function TrainingInnovationPage() {

    // --- STATE ---
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                // Fetch only 'Training & Innovation' programs
                const q = query(
                    collection(db, "programs"),
                    where("category", "==", "Training & Innovation"),
                    orderBy("createdAt", "desc")
                );
                
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPrograms(data);
            } catch (error) {
                console.error("Error fetching training programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    // Helper: Split programs for featured vs list view
    const featuredProgram = programs.find(p => p.status === 'Active') || programs[0];
    const otherPrograms = programs.filter(p => p.id !== featuredProgram?.id);

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-12 md:mb-20">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[3.5/1] lg:aspect-[4/1]">
                        <Image
                            src="/images/heroes/programs-training-innovation-hero.webp" 
                            alt="Training & Innovation Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-brand-gold/40 to-transparent "></div>
                    </div>

                    <div className="relative -mt-16 md:-mt-32 text-center px-6 z-10 max-w-4xl mx-auto">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-brand-brown-dark mb-4 drop-shadow-md">
                            Training & Innovation
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
                        <p className="font-lato text-brand-brown text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            Bridging the gap between traditional knowledge and modern skills to create self-reliant, future-ready leaders.
                        </p>
                    </div>
                </section>

                {/* 2. INTRODUCTION */}
                <section className="px-6 md:px-12 lg:px-24 mb-16 md:mb-24">
                    <div className="max-w-5xl mx-auto bg-brand-sand/30 rounded-3xl p-8 md:p-12 border-l-8 border-brand-gold flex flex-col md:flex-row gap-8 items-center">
                        <div className="md:w-1/3">
                            <h2 className="font-agency text-3xl md:text-4xl text-brand-brown-dark mb-2">
                                Empowering the Future
                            </h2>
                            <div className="h-1 w-12 bg-brand-brown-dark rounded-full"></div>
                        </div>
                        <div className="md:w-2/3">
                            <p className="font-lato text-base md:text-lg text-brand-brown leading-relaxed text-justify md:text-left">
                                In a rapidly changing world, religious education must be paired with practical capability. Our training programs are designed to equip students and community members with the digital, vocational, and entrepreneurial skills needed to thrive in the modern economy.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. ACTIVE INITIATIVES */}
                <section className="px-6 md:px-12 lg:px-24 space-y-12 max-w-7xl mx-auto mb-20">
                    <div className="text-center md:text-left border-b border-gray-100 pb-4 mb-8">
                        <h3 className="font-agency text-3xl md:text-5xl text-brand-brown-dark">
                            Skill Development
                        </h3>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader size="md" /></div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Featured Program (Active - Spans 2 cols) */}
                            {featuredProgram ? (
                                <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col group h-full hover:shadow-2xl transition-all hover:-translate-y-1">
                                    <div className="relative w-full h-64 md:h-80 bg-gray-200">
                                        <Image 
                                            src={featuredProgram.coverImage || "/fallback.webp"} 
                                            alt={featuredProgram.title} 
                                            fill 
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full p-2 text-brand-brown-dark">
                                            <Laptop className="w-5 h-5" />
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md tracking-wider ${
                                                featuredProgram.status === 'Active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                                            }`}>
                                                {featuredProgram.status} Program
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-10 flex flex-col justify-center flex-grow">
                                        <h4 className="font-agency text-3xl text-brand-brown-dark mb-4 leading-tight">
                                            {featuredProgram.title}
                                        </h4>
                                        <p className="font-lato text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                                            {featuredProgram.excerpt}
                                        </p>
                                        
                                        <div className="mt-auto flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                                            {featuredProgram.beneficiaries && (
                                                <div className="flex items-center gap-2 text-sm font-bold text-brand-brown">
                                                    <Target className="w-4 h-4 text-brand-gold" />
                                                    Target: {featuredProgram.beneficiaries}
                                                </div>
                                            )}
                                            <Link href={`/programs/${featuredProgram.id}`} className="inline-flex items-center gap-2 px-6 py-2 bg-brand-brown-dark text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-brand-gold transition-colors">
                                                View Details <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="lg:col-span-2 flex items-center justify-center bg-gray-50 rounded-3xl h-64 border border-dashed border-gray-200">
                                    <p className="text-gray-400">No active training programs found.</p>
                                </div>
                            )}

                            {/* Other Initiatives (Right Column) */}
                            <div className="flex flex-col gap-6">
                                {otherPrograms.length > 0 ? (
                                    otherPrograms.slice(0, 2).map((prog) => (
                                        <Link key={prog.id} href={`/programs/${prog.id}`} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col group h-full hover:shadow-lg transition-all">
                                            <div className="relative w-full h-40 bg-gray-200">
                                                <Image 
                                                    src={prog.coverImage || "/fallback.webp"} 
                                                    alt={prog.title} 
                                                    fill 
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full p-1.5 text-brand-brown-dark">
                                                    <Briefcase className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="p-6 flex-col flex flex-grow">
                                                <h4 className="font-agency text-xl text-brand-brown-dark mb-2 line-clamp-2">
                                                    {prog.title}
                                                </h4>
                                                <p className="font-lato text-xs text-gray-500 leading-relaxed mb-4 flex-grow line-clamp-3">
                                                    {prog.excerpt}
                                                </p>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                                                        prog.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {prog.status}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-brand-gold">Read More</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    // Placeholder for "Future Innovation"
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col group h-full opacity-80">
                                        <div className="relative w-full h-40 grayscale bg-gray-200">
                                            <Image 
                                                src="/images/placeholders/tech-hub.webp" 
                                                alt="Innovation Hub" 
                                                fill 
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-brand-brown-dark/50 flex items-center justify-center backdrop-blur-[1px]">
                                                <span className="text-white font-agency text-lg tracking-widest border border-white px-4 py-1 rounded-full">
                                                    FUTURE GOAL
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-col flex flex-grow bg-gray-50">
                                            <h4 className="font-agency text-xl text-brand-brown-dark mb-2">
                                                Al-Asad Tech Hub
                                            </h4>
                                            <p className="font-lato text-xs text-gray-500 mb-4 flex-grow">
                                                Planned dedicated space for coding, robotics, and design thinking to nurture future innovators.
                                            </p>
                                            <div className="flex items-center gap-2 text-brand-gold">
                                                <Cpu className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">In Development</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </section>

                {/* 4. IMPACT / STATS */}
                <section className="mt-20 md:mt-32 px-6 py-16 bg-brand-sand">
                    <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-16 text-center">
                        <div className="p-6">
                            <h3 className="font-agency text-5xl md:text-7xl text-brand-gold mb-2">150+</h3>
                            <p className="font-lato text-brand-brown-dark text-sm md:text-lg uppercase tracking-widest font-bold">
                                Youths Trained
                            </p>
                        </div>
                        <div className="p-6 border-l border-brand-brown-dark/10">
                            <h3 className="font-agency text-5xl md:text-7xl text-brand-gold mb-2">10+</h3>
                            <p className="font-lato text-brand-brown-dark text-sm md:text-lg uppercase tracking-widest font-bold">
                                Workshops Held
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. CTA */}
                <section className="px-6 mt-16 md:mt-24 mb-4">
                    <div className="max-w-4xl mx-auto bg-brand-brown-dark rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        
                        <Laptop className="w-12 h-12 text-brand-gold mx-auto mb-6" />

                        <h3 className="font-agency text-3xl md:text-5xl mb-4 relative z-10">Partner for Impact</h3>
                        <p className="font-lato text-base md:text-xl text-white/80 mb-8 relative z-10 italic max-w-2xl mx-auto">
                            Do you have skills to share or resources to support our vocational training programs?
                        </p>
                        <Link
                            href="/get-involved/partner-with-us"
                            className="inline-block py-4 px-10 font-agency text-xl text-brand-brown-dark bg-white rounded-full shadow-lg hover:bg-brand-gold hover:text-white transition-all transform hover:scale-105 relative z-10"
                        >
                            Become a Partner
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}