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
import { BookOpen, Users, Award, CheckCircle, MapPin, ArrowRight } from 'lucide-react';

export default function EducationalSupportPage() {

    // --- STATE ---
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const q = query(
                    collection(db, "programs"),
                    where("category", "==", "Educational Support"),
                    orderBy("createdAt", "desc")
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPrograms(data);
            } catch (error) {
                console.error("Error fetching educational programs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    // Filter Active vs Others
    const activePrograms = programs.filter(p => p.status === 'Active');
    const otherPrograms = programs.filter(p => p.status !== 'Active');

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato text-brand-brown-dark">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION (Distinct & Refined) */}
                <section className="relative h-[65vh] min-h-[550px] w-full flex items-center justify-center overflow-hidden bg-brand-brown-dark mb-24">
                    <Image
                        src="/images/heroes/programs-educational-support-hero.webp" 
                        alt="Educational Support"
                        fill
                        className="object-cover object-center opacity-40 mix-blend-multiply"
                        priority
                    />
                    {/* Deep Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-brand-brown-dark/50 to-brand-brown-dark"></div>
                    
                    <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-6 shadow-lg">
                            <BookOpen className="w-8 h-8 text-brand-gold" />
                        </div>
                        <span className="text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-4">Core Pillar Initiative</span>
                        <h1 className="font-agency text-6xl md:text-8xl text-white mb-6 leading-none drop-shadow-2xl tracking-wide">
                            Educational Support
                        </h1>
                        <div className="w-24 h-1 bg-brand-gold rounded-full mb-8"></div>
                        <p className="font-lato text-white/80 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
                            Building a generation grounded in faith, pursuing academic excellence, and equipped for the modern world.
                        </p>
                    </div>
                </section>

                {/* 2. AIMS & OBJECTIVES (Refined - No Image Card) */}
                <section className="px-6 md:px-12 lg:px-24 mb-24 md:mb-32">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="font-agency text-4xl md:text-6xl text-brand-brown-dark leading-tight mb-8">
                            Cultivating Minds,<br />
                            <span className="text-brand-gold">Nurturing Souls.</span>
                        </h2>
                        
                        <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed font-lato max-w-4xl mx-auto mb-12">
                            <p>
                                At Al-Asad Foundation, we view education not just as a means to a career, but as a divine trust. Our primary objective is to bridge the gap between traditional Islamic scholarship and modern academic requirements.
                            </p>
                            <p>
                                We aim to produce <strong>Huffaz</strong> who are also leaders in professional fields—individuals who carry the light of the Quran in their hearts while serving humanity with competence.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                            {['Integrated Curriculum', 'Tahfeez Excellence', 'Character Building', 'Digital Literacy'].map((item, i) => (
                                <div key={i} className="flex flex-col items-center justify-center gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all group">
                                    <div className="w-10 h-10 bg-brand-sand rounded-full flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-brand-brown-dark font-bold text-sm uppercase tracking-wide">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. ACTIVE INITIATIVES (Beautiful Cards) */}
                <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-6">
                        <div>
                            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-2 block">Current Projects</span>
                            <h3 className="font-agency text-4xl md:text-5xl text-brand-brown-dark">
                                Active Initiatives
                            </h3>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader size="md" /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* ACTIVE PROGRAMS GRID */}
                            {activePrograms.length > 0 ? (
                                activePrograms.map((program) => (
                                    <div key={program.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
                                        
                                        {/* Image Section */}
                                        <div className="relative h-80 w-full overflow-hidden">
                                            <Image 
                                                src={program.coverImage || "/fallback.webp"} 
                                                alt={program.title} 
                                                fill 
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                                            
                                            {/* Status Badge */}
                                            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-brand-brown-dark uppercase tracking-wider flex items-center gap-2 shadow-sm z-10">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Active
                                            </div>

                                            {/* Title Overlay */}
                                            <div className="absolute bottom-0 left-0 w-full p-8 pt-20 bg-gradient-to-t from-black/90 to-transparent">
                                                <h4 className="font-agency text-3xl md:text-4xl text-white leading-tight drop-shadow-md group-hover:text-brand-gold transition-colors">
                                                    {program.title}
                                                </h4>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-8 flex flex-col flex-grow relative bg-white">
                                            {/* Meta Data */}
                                            <div className="flex flex-wrap gap-4 mb-6">
                                                {program.location && (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide bg-brand-sand px-3 py-1.5 rounded-lg">
                                                        <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {program.location}
                                                    </span>
                                                )}
                                                {program.beneficiaries && (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide bg-brand-sand px-3 py-1.5 rounded-lg">
                                                        <Users className="w-3.5 h-3.5 text-brand-gold" /> {program.beneficiaries}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="font-lato text-base md:text-lg text-gray-600 leading-relaxed mb-8 line-clamp-4 flex-grow">
                                                {program.excerpt}
                                            </p>

                                            <Link 
                                                href={`/programs/${program.id}`}
                                                className="w-full block text-center bg-brand-brown-dark text-white font-agency text-lg py-4 rounded-xl hover:bg-brand-gold transition-all shadow-md group-hover:shadow-lg"
                                            >
                                                View Project Details
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400 font-agency text-xl">No active educational programs at the moment.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* 4. UPCOMING / COMPLETED (Refined Grid) */}
                {!loading && otherPrograms.length > 0 && (
                    <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto border-t border-gray-100 pt-20">
                        <div className="text-center mb-16">
                            <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mb-3 block">Archive & Planning</span>
                            <h3 className="font-agency text-3xl md:text-4xl text-brand-brown-dark">
                                Upcoming & Past Projects
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherPrograms.map((prog) => (
                                <Link href={`/programs/${prog.id}`} key={prog.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
                                    <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                                        <Image src={prog.coverImage || "/fallback.webp"} alt={prog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-10 ${
                                            prog.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                        }`}>
                                            {prog.status}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h4 className="font-agency text-2xl text-brand-brown-dark mb-3 line-clamp-2 leading-tight group-hover:text-brand-gold transition-colors">{prog.title}</h4>
                                        <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed">{prog.excerpt}</p>
                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-xs font-bold text-brand-gold uppercase tracking-widest group-hover:underline">
                                            Read Details <ArrowRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* 5. IMPACT STATS */}
                <section className="py-24 bg-brand-sand/30 border-y border-brand-gold/10">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-brand-brown-dark/10">
                        <div className="pb-8 md:pb-0">
                            <h3 className="font-agency text-6xl md:text-7xl text-brand-gold mb-2">500+</h3>
                            <p className="font-lato text-brand-brown-dark text-sm uppercase tracking-widest font-bold opacity-80">
                                Students Enrolled
                            </p>
                        </div>
                        <div className="py-8 md:py-0">
                            <h3 className="font-agency text-6xl md:text-7xl text-brand-gold mb-2">30+</h3>
                            <p className="font-lato text-brand-brown-dark text-sm uppercase tracking-widest font-bold opacity-80">
                                Huffaz Graduated
                            </p>
                        </div>
                        <div className="pt-8 md:pt-0">
                            <h3 className="font-agency text-6xl md:text-7xl text-brand-gold mb-2">100%</h3>
                            <p className="font-lato text-brand-brown-dark text-sm uppercase tracking-widest font-bold opacity-80">
                                Commitment to Excellence
                            </p>
                        </div>
                    </div>
                </section>

                {/* 6. CTA */}
                <section className="px-6 my-24">
                    <div className="max-w-5xl mx-auto bg-brand-brown-dark rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none"></div>

                        <Award className="w-16 h-16 text-brand-gold mx-auto mb-8 animate-bounce-slow" />

                        <h3 className="font-agency text-4xl md:text-6xl mb-6 relative z-10">Sponsor Knowledge</h3>
                        <p className="font-lato text-lg md:text-xl text-white/80 mb-10 relative z-10 italic max-w-2xl mx-auto leading-relaxed">
                            "He who follows a path in pursuit of knowledge, Allah will make the path to Paradise easy for him."
                        </p>
                        <Link
                            href="/get-involved/donate"
                            className="inline-flex items-center gap-3 py-4 px-12 font-agency text-xl text-brand-brown-dark bg-white rounded-full shadow-lg hover:bg-brand-gold hover:text-white transition-all transform hover:scale-105 relative z-10"
                        >
                            Support Education <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
