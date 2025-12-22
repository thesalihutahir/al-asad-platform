"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
    
    // Core Values Data
    const values = [
        { title: "Iman (Faith)", text: "Grounding every action in sincerity and God-consciousness." },
        { title: "Ilm (Knowledge)", text: "Pursuing beneficial knowledge as a lifelong sacred duty." },
        { title: "Ihsan (Excellence)", text: "Striving for perfection and beauty in service and conduct." },
        { title: "Khidmah (Service)", text: " dedicating resources to the upliftment of the Ummah." },
    ];

    // Leadership Data (3 Prominent Leaders)
    const leaders = [
        { 
            id: 1, 
            name: "Sheikh Goni Dr. Muneer Ja'afar Katsina", 
            role: "Founder & Lead Scholar", 
            bio: "A renowned scholar and visionary dedicated to bridging the gap between traditional Islamic sciences and modern educational needs.",
            image: "/sheikhhero.jpg" // Use real photo
        },
        { 
            id: 2, 
            name: "Ustaz Ibrahim Ahmed", // Placeholder Name
            role: "Director of Education", 
            bio: "An educationist with over 15 years of experience in curriculum development and administration.",
            image: "/hero.jpg" // Placeholder
        },
        { 
            id: 3, 
            name: "Hajiya Fatima Bello", // Placeholder Name
            role: "Head of Welfare & Admin", 
            bio: "Driving the foundation's community outreach and ensuring operational excellence.",
            image: "/hero.jpg" // Placeholder
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-10">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" // Placeholder: Foundation Building or Group Photo
                            alt="About Al-Asad Foundation"
                            fill
                            className="object-cover object-top"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            About Us
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            Knowledge is a trust, education is service, and empowerment begins with faith.
                        </p>
                    </div>
                </section>

                {/* 2. WHO WE ARE (The Narrative) */}
                <section className="px-6 mb-16 max-w-4xl mx-auto text-center">
                    <h2 className="font-agency text-3xl text-brand-brown-dark mb-6">
                        Who We Are
                    </h2>
                    <div className="font-lato text-brand-brown leading-loose text-lg space-y-4">
                        <p>
                            Al-Asad Education Foundation is a Qur’an-centered, community-driven initiative committed to expanding access to quality education and nurturing morally grounded learners.
                        </p>
                        <p>
                            We believe education should shape character as much as it builds knowledge. Guided by Qur’anic values, we support students, educators, and underserved communities through inclusive educational initiatives, capacity building, and Islamic scholarship, while preparing learners for the realities of a modern world.
                        </p>
                    </div>
                    <div className="mt-8 p-6 bg-brand-sand/30 rounded-xl border-l-4 border-brand-gold inline-block">
                        <p className="font-agency text-2xl text-brand-brown-dark italic">
                            "At Al-Asad, knowledge is a trust, education is service, and empowerment begins with faith."
                        </p>
                    </div>
                </section>

                {/* 3. OUR STORY & FOUNDER'S MESSAGE */}
                <section className="px-6 mb-16">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        
                        {/* LEFT: The Story */}
                        <div className="flex-1">
                            <h2 className="font-agency text-3xl text-brand-brown-dark mb-4">
                                Our Story
                            </h2>
                            <div className="space-y-4 font-lato text-brand-brown leading-relaxed text-justify">
                                <p>
                                    Founded with a vision to harmonize religious devotion with societal development, Al-Asad Education Foundation began as a response to the growing need for an educational system that does not compromise on faith while pursuing excellence.
                                </p>
                                <p>
                                    Established in <strong>[Year]</strong>, the organization was created to fill the void where underserved communities lacked access to resources that dignify both their spiritual and academic potential. What started as a small circle of learning has today blossomed into a movement for intellectual and social revival.
                                </p>
                            </div>

                            {/* Mission & Vision Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                <div className="bg-brand-brown-dark text-white p-5 rounded-xl">
                                    <h3 className="font-agency text-xl text-brand-gold mb-2">Mission</h3>
                                    <p className="font-lato text-sm">Expanding access to knowledge through Qur'an-centered and community driven education.</p>
                                </div>
                                <div className="bg-brand-sand text-brand-brown-dark p-5 rounded-xl border border-brand-gold/20">
                                    <h3 className="font-agency text-xl text-brand-brown-dark mb-2">Vision</h3>
                                    <p className="font-lato text-sm">To be a leading force in transforming education through Qur'an values and excellence.</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Founder's Message */}
                        <div className="flex-1 w-full">
                            <div className="relative bg-white rounded-2xl shadow-xl p-8 border-t-8 border-brand-gold">
                                {/* Quote Icon */}
                                <div className="absolute top-4 right-6 text-6xl text-brand-sand font-serif">”</div>
                                
                                <h3 className="font-agency text-2xl text-brand-brown-dark mb-4">
                                    Founder’s Message
                                </h3>
                                
                                <p className="font-lato text-sm text-brand-brown leading-relaxed italic mb-6">
                                    "We established this foundation not merely to build schools, but to build souls. In a world rapidly changing, our anchor remains the Qur'an. Our goal is to raise a generation that is as competent in the sciences of the world as they are grounded in the sciences of the Deen. This is our trust, and this is our legacy."
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-gold">
                                        <Image src="/sheikhhero.jpg" alt="Founder" width={56} height={56} className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-agency text-lg text-brand-brown-dark leading-none">
                                            Sheikh Goni Dr. Muneer Ja'afar Katsina
                                        </p>
                                        <p className="font-lato text-xs text-brand-gold uppercase font-bold mt-1">
                                            Founder & Chairman
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. CORE VALUES */}
                <section className="py-16 bg-brand-brown-dark text-white px-6">
                    <div className="text-center mb-10">
                        <h2 className="font-agency text-3xl mb-2">Our Core Values</h2>
                        <div className="w-16 h-1 bg-white/20 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val, idx) => (
                            <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-center">
                                <h3 className="font-agency text-xl text-brand-gold mb-2">{val.title}</h3>
                                <p className="font-lato text-sm text-white/80">{val.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. LEADERSHIP TEAM (3 Prominent Leaders) */}
                <section className="px-6 py-16">
                    <div className="text-center mb-12">
                        <h2 className="font-agency text-3xl text-brand-brown-dark mb-2">
                            Leadership
                        </h2>
                        <p className="font-lato text-brand-brown text-sm">
                            Guided by scholarship and professional excellence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {leaders.map((leader) => (
                            <div key={leader.id} className="group flex flex-col items-center text-center">
                                {/* Leader Image */}
                                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 border-4 border-brand-sand shadow-lg group-hover:border-brand-gold transition-colors duration-500">
                                    <Image 
                                        src={leader.image} 
                                        alt={leader.name} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                </div>
                                
                                {/* Leader Info */}
                                <h3 className="font-agency text-2xl text-brand-brown-dark mb-1">
                                    {leader.name}
                                </h3>
                                <p className="font-lato text-xs text-brand-gold font-bold uppercase tracking-widest mb-3">
                                    {leader.role}
                                </p>
                                <div className="w-12 h-0.5 bg-gray-200 mx-auto mb-3"></div>
                                <p className="font-lato text-sm text-brand-brown max-w-xs leading-relaxed">
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
