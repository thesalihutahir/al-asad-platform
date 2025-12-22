"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
    
    const objectives = [
        {
            id: 1,
            title: "Financial Assistance & Infrastructure",
            text: "To provide financial assistance through scholarships, grants, or subsidies to students in need; support the development of educational infrastructure; and respect underserved communities."
        },
        {
            id: 2,
            title: "Access & Literacy",
            text: "To foster educational initiatives to ensure access to quality education for all, with a focus on underserved populations; aiming to improve literacy rates and enhance educational outcomes."
        },
        {
            id: 3,
            title: "Islamic Sciences & Research",
            text: "To support the study of the Qur’an, Hadith, Fiqh, and other Islamic sciences; provide resources and opportunities for Islamic research and scholarship."
        },
        {
            id: 4,
            title: "Heritage in a Modern Context",
            text: "To develop programs that instill pride in Islamic heritage and culture; ensure students understand their faith in the context of a modern, globalized educational system."
        },
        {
            id: 5,
            title: "Innovation in Teaching",
            text: "To promote teachers’ training programs through improving teaching methodologies; support innovative curriculum development and advanced learning technologies."
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
                            src="/hero.jpg" // Placeholder: Image of Sheikh or Foundation building
                            alt="About Al-Asad Foundation"
                            fill
                            className="object-cover object-top"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            Who We Are
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            Al-Asad Education Foundation is a beacon of knowledge, dedicated to serving humanity through faith, education, and community development.
                        </p>
                    </div>
                </section>

                {/* 2. MISSION & VISION */}
                <section className="px-6 mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Mission Card */}
                        <div className="bg-brand-brown-dark text-white p-8 rounded-2xl relative overflow-hidden shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <h2 className="font-agency text-2xl text-brand-gold mb-4">Our Mission</h2>
                            <p className="font-lato text-lg leading-relaxed">
                                "Expanding access to knowledge through Qur'an-centered and community driven education."
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-brand-sand p-8 rounded-2xl border border-brand-gold/20 shadow-lg relative">
                             <h2 className="font-agency text-2xl text-brand-brown-dark mb-4">Our Vision</h2>
                             <p className="font-lato text-lg text-brand-brown leading-relaxed">
                                "To be a leading force in transforming education through Qur'an values, excellence in learning, and empowerment of communities."
                             </p>
                        </div>
                    </div>
                </section>

                {/* 3. LEADERSHIP SPOTLIGHT */}
                <section className="px-6 mb-16">
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-brand-sand shadow-xl mb-6">
                            <Image 
                                src="/sheikhhero.jpg" // Use the Sheikh's image here
                                alt="Sheikh Muneer Ja'afar Katsina" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                        <h2 className="font-agency text-3xl text-brand-brown-dark mb-1">
                            Sheikh Muneer Ja'afar Katsina
                        </h2>
                        <p className="font-lato text-xs text-brand-gold font-bold uppercase tracking-widest mb-4">
                            Founder & Lead Scholar
                        </p>
                        <p className="font-lato text-sm text-brand-brown max-w-2xl leading-relaxed">
                            Guided by a deep commitment to Islamic scholarship and community welfare, Sheikh Muneer established the Al-Asad Foundation to bridge the gap between traditional Islamic sciences and modern educational needs, ensuring a future where faith and progress walk hand in hand.
                        </p>
                    </div>
                </section>

                {/* 4. AIMS & OBJECTIVES */}
                <section className="px-6">
                    <h2 className="font-agency text-2xl text-brand-brown-dark mb-8 text-center">
                        Our Strategic Objectives
                    </h2>

                    <div className="space-y-6">
                        {objectives.map((obj) => (
                            <div key={obj.id} className="flex gap-5 items-start">
                                {/* Styled Number */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-sand text-brand-gold font-agency text-xl font-bold flex items-center justify-center shadow-sm mt-1">
                                    {obj.id}
                                </div>
                                
                                {/* Content */}
                                <div>
                                    <h3 className="font-agency text-xl text-brand-brown-dark mb-2">
                                        {obj.title}
                                    </h3>
                                    <p className="font-lato text-sm text-brand-brown leading-relaxed text-justify border-b border-gray-100 pb-6">
                                        {obj.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
