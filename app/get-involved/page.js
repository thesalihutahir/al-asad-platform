"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GetInvolvedPage() {
    
    const actions = [
        {
            id: 'donate',
            title: "Make a Donation",
            description: "Your Sadaqah and Zakat help us sustain our schools, feed the hungry, and spread beneficial knowledge.",
            link: "/get-involved/donate",
            icon: "/hero.jpg", // Placeholder for Donation Icon (e.g., Hand holding coin)
            btnText: "Donate Now"
        },
        {
            id: 'volunteer',
            title: "Become a Volunteer",
            description: "Dedicate your time and skills. Whether you are a teacher, medic, or creative, your service matters.",
            link: "/get-involved/volunteer",
            icon: "/hero.jpg", // Placeholder for Volunteer Icon (e.g., Raised hands)
            btnText: "Join the Team"
        },
        {
            id: 'partner',
            title: "Partner With Us",
            description: "Collaborate with us as an organization, corporate body, or institution to create larger scale impact.",
            link: "/get-involved/partner-with-us",
            icon: "/hero.jpg", // Placeholder for Handshake Icon
            btnText: "Collaborate"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" // Placeholder: Community working together
                            alt="Get Involved"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            Get Involved
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            "The best of people are those that bring most benefit to the rest of mankind."
                        </p>
                    </div>
                </section>

                {/* 2. ACTION GRID */}
                <section className="px-6 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {actions.map((action) => (
                            <div key={action.id} className="group bg-brand-sand/30 rounded-2xl p-6 border border-brand-gold/10 hover:border-brand-gold transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center">
                                
                                {/* Icon Circle */}
                                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-5 overflow-hidden p-4 group-hover:scale-110 transition-transform">
                                    <div className="relative w-full h-full">
                                        <Image src={action.icon} alt={action.title} fill className="object-contain" />
                                    </div>
                                </div>

                                <h2 className="font-agency text-2xl text-brand-brown-dark mb-3">
                                    {action.title}
                                </h2>
                                
                                <p className="font-lato text-sm text-brand-brown leading-relaxed mb-6 flex-grow">
                                    {action.description}
                                </p>

                                <Link 
                                    href={action.link}
                                    className="w-full py-3 bg-brand-brown-dark text-white font-agency text-lg rounded-xl hover:bg-brand-gold transition-colors shadow-md"
                                >
                                    {action.btnText}
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. IMPACT PREVIEW / MOTIVATION */}
                <section className="px-6">
                    <div className="bg-brand-brown-dark rounded-2xl p-8 text-center text-white relative overflow-hidden">
                        {/* Decorative Circle */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -ml-20 -mt-20"></div>
                        
                        <h2 className="font-agency text-2xl mb-4 relative z-10">
                            Why Support Al-Asad?
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 relative z-10">
                            <div>
                                <h3 className="text-3xl font-agency text-brand-gold mb-1">100%</h3>
                                <p className="text-xs font-lato uppercase tracking-widest opacity-80">Transparency</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-agency text-brand-gold mb-1">500+</h3>
                                <p className="text-xs font-lato uppercase tracking-widest opacity-80">Lives Impacted</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-agency text-brand-gold mb-1">Sadaqah</h3>
                                <p className="text-xs font-lato uppercase tracking-widest opacity-80">Jariyah</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
