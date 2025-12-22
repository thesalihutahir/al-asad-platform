"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CommunityDevelopmentPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" // Placeholder: Needs an image of food distribution/aid
                            alt="Community Development Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            Community Development
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            Extending the mercy of Islam through tangible support, welfare, and humanitarian services.
                        </p>
                    </div>
                </section>

                {/* 2. INTRODUCTION */}
                <section className="px-6 mb-12">
                    <div className="bg-brand-sand/30 rounded-2xl p-6 border-l-4 border-brand-gold">
                        <h2 className="font-agency text-2xl text-brand-brown-dark mb-3">
                            Our Approach
                        </h2>
                        <p className="font-lato text-sm text-brand-brown leading-relaxed text-justify">
                            We believe that spiritual growth and physical well-being go hand in hand. Our community development programs aim to alleviate hunger, support the vulnerable, and strengthen the social fabric of our society through consistent acts of Sadaqah and service.
                        </p>
                    </div>
                </section>

                {/* 3. KEY INITIATIVES */}
                <section className="px-6 space-y-8">
                    <h3 className="font-agency text-2xl text-brand-brown-dark border-b border-gray-100 pb-2 mb-6">
                        Active Projects
                    </h3>

                    {/* Initiative 1: Food Bank / Iftar */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
                            <Image 
                                src="/hero.jpg" // Placeholder: Food distribution
                                alt="Ramadan Iftar & Food Bank" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-agency text-xl text-brand-brown-dark mb-1">
                                Food Relief & Ramadan Iftar
                            </h4>
                            <p className="font-lato text-sm text-brand-brown leading-relaxed mb-3">
                                Annual Ramadan feeding programs and emergency food distribution for families in critical need within our locality.
                            </p>
                            <span className="inline-block px-3 py-1 bg-brand-brown-dark/5 text-brand-brown-dark text-xs font-bold uppercase rounded-md">
                                Seasonal & Ongoing
                            </span>
                        </div>
                    </div>

                    {/* Initiative 2: Orphan Support */}
                    <div className="flex flex-col gap-4">
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
                            <Image 
                                src="/hero.jpg" // Placeholder: Orphans/Children
                                alt="Orphan Support" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h4 className="font-agency text-xl text-brand-brown-dark mb-1">
                                Orphan & Widow Support
                            </h4>
                            <p className="font-lato text-sm text-brand-brown leading-relaxed mb-3">
                                Providing financial aid, clothing, and emotional support to widows and orphans to ensure they live with dignity.
                            </p>
                            <span className="inline-block px-3 py-1 bg-brand-brown-dark/5 text-brand-brown-dark text-xs font-bold uppercase rounded-md">
                                Active Program
                            </span>
                        </div>
                    </div>

                    {/* Initiative 3: Water Projects (Example of Future) */}
                    <div className="flex flex-col gap-4 opacity-90">
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md grayscale-[50%]">
                            <Image 
                                src="/hero.jpg" // Placeholder: Borehole/Water
                                alt="Clean Water Project" 
                                fill 
                                className="object-cover"
                            />
                             {/* Coming Soon Overlay */}
                             <div className="absolute inset-0 bg-brand-brown-dark/60 flex items-center justify-center">
                                <span className="text-white font-agency text-xl tracking-widest border border-white px-4 py-2 rounded">
                                    PLANNED
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-agency text-xl text-brand-brown-dark mb-1">
                                Clean Water Initiatives
                            </h4>
                            <p className="font-lato text-sm text-brand-brown leading-relaxed mb-3">
                                Future plans to construct boreholes and water stations in remote areas lacking access to clean drinking water.
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
                            <h3 className="font-agency text-3xl text-brand-gold mb-1">1000+</h3>
                            <p className="font-lato text-brand-brown-dark text-[10px] uppercase tracking-widest font-bold">
                                Meals Served
                            </p>
                        </div>
                        <div>
                            <h3 className="font-agency text-3xl text-brand-gold mb-1">50+</h3>
                            <p className="font-lato text-brand-brown-dark text-[10px] uppercase tracking-widest font-bold">
                                Families Supported
                            </p>
                        </div>
                    </div>
                </section>

                {/* 5. CTA */}
                <section className="px-6 mt-12 mb-4">
                    <div className="bg-brand-brown-dark rounded-2xl p-8 text-center text-white relative overflow-hidden">
                        <h3 className="font-agency text-2xl mb-3 relative z-10">Be the Helping Hand</h3>
                        <p className="font-lato text-sm text-white/80 mb-6 relative z-10">
                            "The best of people are those that bring most benefit to the rest of mankind."
                        </p>
                        <Link
                            href="/get-involved/donate"
                            className="inline-block py-3 px-8 font-agency text-lg text-brand-brown-dark bg-white rounded-full shadow-lg hover:bg-brand-gold transition-colors relative z-10"
                        >
                            Donate to Welfare
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
