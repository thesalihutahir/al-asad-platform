"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Users, Handshake, ArrowRight, ShieldCheck, Globe, Star } from 'lucide-react';

export default function GetInvolvedPage() {

    const actions = [
        {
            id: 'donate',
            title: "Make a Donation",
            description: "Your Sadaqah and Zakat help us sustain our schools, feed the hungry, and spread beneficial knowledge to those who need it most.",
            link: "/get-involved/donate",
            icon: Heart, 
            color: "text-red-500",
            bgColor: "bg-red-50",
            btnText: "Donate Now",
            btnStyle: "bg-brand-gold text-white hover:bg-brand-brown-dark"
        },
        {
            id: 'volunteer',
            title: "Become a Volunteer",
            description: "Dedicate your time and skills. Whether you are a teacher, medic, engineer, or creative, your service matters to the Ummah.",
            link: "/get-involved/volunteer",
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            btnText: "Join the Team",
            btnStyle: "bg-brand-brown-dark text-white hover:bg-brand-gold"
        },
        {
            id: 'partner',
            title: "Partner With Us",
            description: "Collaborate with us as an organization, corporate body, or institution to create larger scale impact and sustainable development.",
            link: "/get-involved/partner-with-us",
            icon: Handshake,
            color: "text-green-600",
            bgColor: "bg-green-50",
            btnText: "Collaborate",
            btnStyle: "bg-brand-sand text-brand-brown-dark hover:bg-brand-brown-dark hover:text-white"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-12 md:mb-20">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[3.5/1] lg:aspect-[4/1]">
                        <Image
                            src="/images/heroes/get-involved-overview-hero.webp" 
                            alt="Get Involved Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-brand-gold/40 to-transparent "></div>
                    </div>

                    <div className="relative -mt-16 md:-mt-32 text-center px-6 z-10 max-w-4xl mx-auto">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-brand-brown-dark mb-4 drop-shadow-md">
                            Get Involved
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
                        <p className="font-lato text-brand-brown text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            "The best of people are those that bring most benefit to the rest of mankind." — Prophet Muhammad (SAW)
                        </p>
                    </div>
                </section>

                {/* 2. ACTION GRID */}
                <section className="px-6 md:px-12 lg:px-24 mb-16 md:mb-24 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                        {actions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <div key={action.id} className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center h-full">

                                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full ${action.bgColor} flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-10 h-10 md:w-12 md:h-12 ${action.color}`} />
                                    </div>

                                    <h2 className="font-agency text-2xl md:text-3xl text-brand-brown-dark mb-4">
                                        {action.title}
                                    </h2>

                                    <p className="font-lato text-sm md:text-base text-gray-600 leading-relaxed mb-8 flex-grow max-w-xs mx-auto">
                                        {action.description}
                                    </p>

                                    <Link 
                                        href={action.link}
                                        className={`w-full py-4 font-agency text-lg md:text-xl rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 ${action.btnStyle}`}
                                    >
                                        {action.btnText} <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 3. IMPACT PREVIEW / MOTIVATION */}
                <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
                    <div className="bg-brand-brown-dark rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -ml-20 -mt-20"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-gold opacity-10 rounded-full blur-3xl -mr-20 -mb-20"></div>

                        <h2 className="font-agency text-3xl md:text-4xl mb-8 relative z-10">
                            Why Support Al-Asad?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-8 md:mt-12 relative z-10 divide-y md:divide-y-0 md:divide-x divide-white/10">

                            {/* Stat 1 */}
                            <div className="flex flex-col items-center pt-8 md:pt-0">
                                <div className="mb-4 bg-white/10 p-3 rounded-full text-brand-gold">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-agency text-brand-gold mb-2">100%</h3>
                                <p className="text-xs md:text-sm font-lato uppercase tracking-widest opacity-80">Transparent & Accountable</p>
                            </div>

                            {/* Stat 2 */}
                            <div className="flex flex-col items-center pt-8 md:pt-0">
                                <div className="mb-4 bg-white/10 p-3 rounded-full text-brand-gold">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-agency text-brand-gold mb-2">500+</h3>
                                <p className="text-xs md:text-sm font-lato uppercase tracking-widest opacity-80">Lives Impacted Annually</p>
                            </div>

                            {/* Stat 3 */}
                            <div className="flex flex-col items-center pt-8 md:pt-0">
                                <div className="mb-4 bg-white/10 p-3 rounded-full text-brand-gold">
                                    <Star className="w-8 h-8" />
                                </div>
                                <h3 className="text-4xl md:text-5xl font-agency text-brand-gold mb-2">Jariyah</h3>
                                <p className="text-xs md:text-sm font-lato uppercase tracking-widest opacity-80">Endless Reward</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}