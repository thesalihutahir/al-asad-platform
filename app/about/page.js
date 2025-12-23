"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Quote, Target, Eye, Heart, Book, Star, Users } from 'lucide-react';

export default function AboutPage() {

    // Core Values Data
    const values = [
        { title: "Iman (Faith)", text: "Grounding every action in sincerity and God-consciousness.", icon: Heart },
        { title: "Ilm (Knowledge)", text: "Pursuing beneficial knowledge as a lifelong sacred duty.", icon: Book },
        { title: "Ihsan (Excellence)", text: "Striving for perfection and beauty in service and conduct.", icon: Star },
        { title: "Khidmah (Service)", text: "Dedicating resources to the upliftment of the Ummah.", icon: Users },
    ];

    // Leadership Data
    const leaders = [
        { 
            id: 1, 
            name: "Sheikh Goni Dr. Muneer Ja'afar Katsina", 
            role: "Founder & Lead Scholar", 
            bio: "A renowned scholar and visionary dedicated to bridging the gap between traditional Islamic sciences and modern educational needs.",
            image: "/sheikhhero.jpg" 
        },
        { 
            id: 2, 
            name: "Ustaz Ibrahim Ahmed", 
            role: "Director of Education", 
            bio: "An educationist with over 15 years of experience in curriculum development and academic administration.",
            image: "/hero.jpg" 
        },
        { 
            id: 3, 
            name: "Hajiya Fatima Bello", 
            role: "Head of Welfare & Admin", 
            bio: "Driving the foundation's community outreach initiatives and ensuring operational excellence.",
            image: "/hero.jpg" 
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
                            src="/hero.jpg" // Placeholder: Foundation Building or Group Photo
                            alt="About Al-Asad Foundation"
                            fill
                            className="object-cover object-top"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-white"></div>
                    </div>

                    <div className="relative -mt-16 md:-mt-32 text-center px-6 z-10 max-w-4xl mx-auto">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-brand-brown-dark mb-4 drop-shadow-md">
                            About Us
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
                        <p className="font-lato text-brand-brown text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            Knowledge is a trust, education is service, and empowerment begins with faith.
                        </p>
                    </div>
                </section>

                {/* 2. WHO WE ARE (The Narrative) */}
                <section className="px-6 md:px-12 lg:px-24 mb-16 md:mb-24 max-w-5xl mx-auto">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="font-agency text-3xl md:text-5xl text-brand-brown-dark mb-6">
                            Who We Are
                        </h2>
                    </div>
                    
                    {/* Mobile: Justified Text | Desktop: Centered comfortable read width */}
                    <div className="font-lato text-brand-brown leading-loose text-base md:text-lg space-y-6 text-justify md:text-center max-w-4xl mx-auto">
                        <p>
                            Al-Asad Education Foundation is a Qur’an-centered, community-driven initiative committed to expanding access to quality education and nurturing morally grounded learners.
                        </p>
                        <p>
                            We believe education should shape character as much as it builds knowledge. Guided by Qur’anic values, we support students, educators, and underserved communities through inclusive educational initiatives, capacity building, and Islamic scholarship, while preparing learners for the realities of a modern world.
                        </p>
                    </div>

                    <div className="mt-10 md:mt-14 p-8 bg-brand-sand/30 rounded-2xl border-l-4 border-brand-gold text-center relative mx-auto max-w-3xl">
                        <Quote className="absolute top-4 left-4 w-6 h-6 text-brand-gold opacity-30 transform rotate-180" />
                        <p className="font-agency text-2xl md:text-3xl text-brand-brown-dark italic relative z-10 px-4">
                            "At Al-Asad, knowledge is a trust, education is service, and empowerment begins with faith."
                        </p>
                    </div>
                </section>

                {/* 3. OUR STORY & FOUNDER'S MESSAGE */}
                <section className="px-6 md:px-12 lg:px-24 mb-16 md:mb-24 max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                        {/* LEFT: The Story */}
                        <div className="flex-1 w-full">
                            <h2 className="font-agency text-3xl md:text-4xl text-brand-brown-dark mb-6 text-center lg:text-left">
                                Our Story
                            </h2>
                            <div className="space-y-6 font-lato text-brand-brown text-base md:text-lg leading-relaxed text-justify">
                                <p>
                                    Founded with a vision to harmonize religious devotion with societal development, Al-Asad Education Foundation began as a response to the growing need for an educational system that does not compromise on faith while pursuing excellence.
                                </p>
                                <p>
                                    Established in <strong>[Year]</strong>, the organization was created to fill the void where underserved communities lacked access to resources that dignify both their spiritual and academic potential. What started as a small circle of learning has today blossomed into a movement for intellectual and social revival.
                                </p>
                            </div>

                            {/* Mission & Vision Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                                <div className="bg-brand-brown-dark text-white p-6 rounded-2xl shadow-lg transform transition-transform hover:-translate-y-1">
                                    <div className="flex items-center gap-2 mb-3 text-brand-gold">
                                        <Target className="w-6 h-6" />
                                        <h3 className="font-agency text-2xl">Mission</h3>
                                    </div>
                                    <p className="font-lato text-sm md:text-base text-white/90">Expanding access to knowledge through Qur'an-centered and community driven education.</p>
                                </div>
                                <div className="bg-white text-brand-brown-dark p-6 rounded-2xl border border-gray-100 shadow-lg transform transition-transform hover:-translate-y-1">
                                    <div className="flex items-center gap-2 mb-3 text-brand-brown-dark">
                                        <Eye className="w-6 h-6" />
                                        <h3 className="font-agency text-2xl">Vision</h3>
                                    </div>
                                    <p className="font-lato text-sm md:text-base text-gray-600">To be a leading force in transforming education through Qur'an values and excellence.</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Founder's Message */}
                        <div className="flex-1 w-full lg:max-w-lg">
                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-t-8 border-brand-gold overflow-hidden group">
                                {/* Decorative Quote Mark */}
                                <div className="absolute -top-4 -right-4 text-[150px] text-brand-sand opacity-30 font-serif leading-none select-none group-hover:scale-110 transition-transform duration-700">”</div>

                                <h3 className="font-agency text-2xl md:text-3xl text-brand-brown-dark mb-6 relative z-10">
                                    Founder’s Message
                                </h3>

                                <p className="font-lato text-base md:text-lg text-gray-600 leading-relaxed italic mb-8 relative z-10 text-justify">
                                    "We established this foundation not merely to build schools, but to build souls. In a world rapidly changing, our anchor remains the Qur'an. Our goal is to raise a generation that is as competent in the sciences of the world as they are grounded in the sciences of the Deen. This is our trust, and this is our legacy."
                                </p>

                                <div className="flex items-center gap-5 relative z-10 border-t border-gray-100 pt-6">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-brand-gold shadow-md">
                                        <Image src="/sheikhhero.jpg" alt="Founder" width={80} height={80} className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-agency text-xl text-brand-brown-dark leading-tight">
                                            Sheikh Goni Dr. Muneer<br />Ja'afar Katsina
                                        </p>
                                        <p className="font-lato text-xs text-brand-gold uppercase font-bold mt-1 tracking-widest">
                                            Founder & Chairman
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. CORE VALUES (Dark Section) */}
                <section className="py-16 md:py-24 bg-brand-brown-dark text-white px-6 md:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="font-agency text-3xl md:text-5xl mb-4">Our Core Values</h2>
                            <div className="w-24 h-1.5 bg-white/20 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {values.map((val, idx) => {
                                const Icon = val.icon;
                                return (
                                    <div key={idx} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors text-center group hover:-translate-y-2 duration-300">
                                        <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-agency text-2xl text-brand-gold mb-3">{val.title}</h3>
                                        <p className="font-lato text-sm md:text-base text-white/80 leading-relaxed">{val.text}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 5. LEADERSHIP TEAM */}
                <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 max-w-7xl mx-auto">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="font-agency text-3xl md:text-5xl text-brand-brown-dark mb-3">
                            Leadership
                        </h2>
                        <p className="font-lato text-brand-brown text-base md:text-lg">
                            Guided by scholarship, wisdom, and professional excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                        {leaders.map((leader) => (
                            <div key={leader.id} className="group flex flex-col items-center text-center">
                                {/* Leader Image */}
                                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border-8 border-brand-sand shadow-xl group-hover:border-brand-gold transition-colors duration-500">
                                    <Image 
                                        src={leader.image} 
                                        alt={leader.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                </div>

                                {/* Leader Info */}
                                <h3 className="font-agency text-2xl md:text-3xl text-brand-brown-dark mb-1 group-hover:text-brand-gold transition-colors">
                                    {leader.name}
                                </h3>
                                <p className="font-lato text-xs md:text-sm text-brand-brown uppercase font-bold tracking-widest mb-4 opacity-70">
                                    {leader.role}
                                </p>
                                <div className="w-12 h-0.5 bg-gray-200 mx-auto mb-4 group-hover:w-24 group-hover:bg-brand-gold transition-all duration-300"></div>
                                <p className="font-lato text-sm md:text-base text-gray-600 max-w-xs leading-relaxed">
                                    {leader.bio}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
