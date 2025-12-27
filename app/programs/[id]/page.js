"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
// Firebase
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MapPin, Users, Calendar, ArrowLeft, Loader2 } from 'lucide-react';

export default function ProgramDetailPage() {
    const { id } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "programs", id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setProgram({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching program:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
            </div>
        );
    }

    if (!program) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Program Not Found</h1>
                <Link href="/programs" className="text-brand-gold hover:underline">Back to Programs</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-16">
                {/* Hero / Cover */}
                <div className="relative w-full h-[50vh] md:h-[60vh] bg-gray-900">
                    <Image 
                        src={program.coverImage || "/fallback.webp"} 
                        alt={program.title} 
                        fill 
                        className="object-cover opacity-60" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:px-24">
                        <div className="max-w-7xl mx-auto">
                            <span className="inline-block px-3 py-1 bg-brand-gold text-white text-xs font-bold uppercase rounded mb-4">
                                {program.category}
                            </span>
                            <h1 className="font-agency text-4xl md:text-6xl text-white mb-4 drop-shadow-md">
                                {program.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-white/80 text-sm font-bold">
                                {program.location && (
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {program.location}</span>
                                )}
                                {program.beneficiaries && (
                                    <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {program.beneficiaries}</span>
                                )}
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {program.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto py-12 md:py-20 flex flex-col lg:flex-row gap-12">
                    
                    {/* Main Text */}
                    <div className="lg:w-2/3">
                        <Link href="/programs" className="inline-flex items-center text-gray-400 hover:text-brand-gold mb-8 text-sm font-bold uppercase tracking-wider">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programs
                        </Link>
                        
                        {/* Render content with line breaks */}
                        <div className="prose prose-lg text-gray-700 leading-relaxed font-lato whitespace-pre-wrap">
                            {program.content}
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="lg:w-1/3">
                        <div className="bg-brand-sand/30 p-8 rounded-3xl border-l-4 border-brand-brown-dark sticky top-24">
                            <h3 className="font-agency text-2xl text-brand-brown-dark mb-4">Support This Cause</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Your donation helps us sustain programs like {program.title} and reach more beneficiaries.
                            </p>
                            <Link 
                                href="/get-involved/donate" 
                                className="block w-full py-4 text-center bg-brand-brown-dark text-white font-agency text-xl rounded-xl hover:bg-brand-gold transition-colors shadow-lg"
                            >
                                Donate Now
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}