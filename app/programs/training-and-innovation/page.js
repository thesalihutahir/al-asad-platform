"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TrainingInnovationPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" // Placeholder: Needs an image of computers/workshop
                            alt="Training & Innovation Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            Training & Innovation
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            Bridging the gap between traditional knowledge and modern skills to create self-reliant leaders.
                        </p>
                    </div>
                </section>

                {/* 2. INTRODUCTION */}
                <section className="px-6 mb-12">
                    <div className="bg-brand-sand/30 rounded-2xl p-6 border-l-4 border-brand-gold">
                        <h2 className="font-agency text-2xl text-brand-brown-dark mb-3">
                            Empowering the Future
                        </h2>
                        <p className="font-lato text-sm text-brand-brown leading-relaxed text-justify">
                            In a rapidly changing world, religious education must be paired with practical capability. Our training programs are designed to equip students and community members with the digital, vocational, and entrepreneurial skills needed to thrive in the modern economy.
                        </p>
                    </div>
                </section>

                {/* 3. KEY INITIATIVES */}
                <section className="px-6 space-y-8">
                    <h3 className="font-agency text-2xl text-brand-brown-dark border-b border-gray-100 pb-2 mb-6">
                        Skill Development
                    </h3>

                    {/* Initiative 1: Digital Literacy */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
                            <Image 
                                src="/hero.jpg" // Placeholder: Computer class
                                alt="Digital Literacy" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-agency text-xl text-brand-brown-dark mb-1">
                                Digital Literacy Bootcamp
                            </h4>
                            <p className="font-lato text-sm text-brand-brown leading-relaxed mb-3">
                                Fundamental computer training, internet safety, and introduction to modern productivity tools for students.
                            </p>
                            <span className="inline-block px-3 py-1 bg-brand-brown-dark/5 text-brand-brown-dark text-xs font-bold uppercase rounded-md">
                                Active Program
                            </span>
                        </div>
                    </div>

                    {/* Initiative 2: Vocational Workshops */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
                            <Image 
                                src="/hero.jpg" // Placeholder: Entrepreneurship/Trade
                                alt="Vocational Skills" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-agency text-xl text-brand-brown-dark mb-1">
                                Entrepreneurship Workshops
                            </h4>
                            <p className="font-lato text-sm text-brand-brown leading-relaxed mb-3">
                                Seminars on small business management, trade skills, and financial independence for youth and women.
                            </p>
                            <span className="inline-block px-3 py-1 bg-brand-brown-dark/5 text-brand-brown-dark text-xs font-bold uppercase rounded-md">
                                Periodic Events
                            </span>
                        </div>
                    </div>

                    {/* Initiative 3: Innovation Hub (Future) */}
                    <div className="flex flex-col gap-4 opacity-90">
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md grayscale-[50%]">
                            <Image 
                                src="/hero.jpg" // Placeholder: Tech hub/Coding
                                alt="Tech Innovation Hub" 
                                fill 
                                className="object-cover"
                            />
                             {/* Coming Soon Overlay */}
                             <div className="absolute inset-0 bg-brand-brown-dark/60 flex items-center justify-center">
                                <span className="text-white font-agency text-xl tracking-widest border border-white px-4 py-2 rounded">
                                    FUTURE GOAL
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-agency text-xl text-brand-brown-dark mb-1">
                                Al-Asad Tech Hub
                            </h4>
                            <p className="font-lato text-sm text-brand-brown leading-relaxed mb-3">
                                A planned dedicated space for advanced coding, robotics, and design thinking to nurture the next generation of Muslim innovators.
                            </p>
                            <span className="inline-block px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-bold uppercase rounded-md">
                                In Development
                            </span>
                        </div>
                    </div>
                </section>

                {/* 4. IMPACT / STATS */}
                <section className="mt-12 px-6 py-10 bg-brand-sand">
                    <div className="grid grid-cols-2 gap-8 text-center">
                        <div>
                            <h3 className="font-agency text-3xl text-brand-gold mb-1">150+</h3>
                            <p className="font-lato text-brand-brown-dark text-[10px] uppercase tracking-widest font-bold">
                                Youths Trained
                            </p>
                        </div>
                        <div>
                            <h3 className="font-agency text-3xl text-brand-gold mb-1">10+</h3>
                            <p className="font-lato text-brand-brown-dark text-[10px] uppercase tracking-widest font-bold">
                                Workshops Held
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. CTA */}
                <section className="px-6 mt-12 mb-4">
                    <div className="bg-brand-brown-dark rounded-2xl p-8 text-center text-white relative overflow-hidden">
                        <h3 className="font-agency text-2xl mb-3 relative z-10">Partner for Impact</h3>
                        <p className="font-lato text-sm text-white/80 mb-6 relative z-10">
                            Do you have skills to share or resources to support our vocational training?
                        </p>
                        <Link
                            href="/get-involved/partner-with-us"
                            className="inline-block py-3 px-8 font-agency text-lg text-brand-brown-dark bg-white rounded-full shadow-lg hover:bg-brand-gold transition-colors relative z-10"
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
