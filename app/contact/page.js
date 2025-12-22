"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
    
    // Mock Data for Media Team (11 Members)
    // ID 1 is the Lead/Head, IDs 2-11 are the rest of the team
    const teamMembers = [
        { id: 1, name: "Lead Name", role: "Head of Media", image: "/hero.jpg" },
        { id: 2, name: "Member Name", role: "Content Strategist", image: "/hero.jpg" },
        { id: 3, name: "Member Name", role: "Videographer", image: "/hero.jpg" },
        { id: 4, name: "Member Name", role: "Editor", image: "/hero.jpg" },
        { id: 5, name: "Member Name", role: "Social Media Manager", image: "/hero.jpg" },
        { id: 6, name: "Member Name", role: "Graphic Designer", image: "/hero.jpg" },
        { id: 7, name: "Member Name", role: "Photographer", image: "/hero.jpg" },
        { id: 8, name: "Member Name", role: "IT Support", image: "/hero.jpg" },
        { id: 9, name: "Member Name", role: "Audio Engineer", image: "/hero.jpg" },
        { id: 10, name: "Member Name", role: "Writer", image: "/hero.jpg" },
        { id: 11, name: "Member Name", role: "Community Manager", image: "/hero.jpg" },
    ];

    // Split the team: Lead (first person) vs. The Rest
    const teamLead = teamMembers[0];
    const teamRest = teamMembers.slice(1);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
                        <Image
                            src="/hero.jpg"
                            alt="Contact Us"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            Contact Us
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            Have questions, want to get involved, or need media resources? We are here to listen.
                        </p>
                    </div>
                </section>

                {/* 2. CONTACT INFO & FORM GRID */}
                <section className="px-6 mb-16">
                    <div className="flex flex-col lg:flex-row gap-12">
                        
                        {/* LEFT: Contact Information */}
                        <div className="flex-1 space-y-8">
                            
                            {/* General Inquiries */}
                            <div className="bg-brand-sand/30 p-6 rounded-2xl border border-brand-gold/10">
                                <h2 className="font-agency text-2xl text-brand-brown-dark mb-4">
                                    Get in Touch
                                </h2>
                                <div className="space-y-5">
                                    {/* Address */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-sm mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-agency text-lg text-brand-brown-dark leading-none mb-1">Office Address</p>
                                            <p className="font-lato text-sm text-brand-brown">
                                                No. 123, Katsina Road,<br />Katsina State, Nigeria.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phone/Email */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-sm mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-agency text-lg text-brand-brown-dark leading-none mb-1">Direct Contacts</p>
                                            <p className="font-lato text-sm text-brand-brown hover:text-brand-gold transition-colors">info@alasadfoundation.org</p>
                                            <p className="font-lato text-sm text-brand-brown">+234 800 000 0000</p>
                                        </div>
                                    </div>

                                    {/* Socials - ICONS ONLY (Fixed Overflow) */}
                                    <div className="flex items-start gap-3 pt-2">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-sm mt-1 flex-shrink-0">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-agency text-lg text-brand-brown-dark leading-none mb-2">Connect Online</p>
                                            <div className="flex gap-4">
                                                {/* Facebook Icon */}
                                                <a href="#" className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center hover:bg-brand-brown-dark transition-colors shadow-sm">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                                                </a>
                                                {/* Twitter/X Icon */}
                                                <a href="#" className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center hover:bg-brand-brown-dark transition-colors shadow-sm">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                                                </a>
                                                {/* Instagram Icon */}
                                                <a href="#" className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center hover:bg-brand-brown-dark transition-colors shadow-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                                </a>
                                                {/* YouTube Icon */}
                                                <a href="#" className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center hover:bg-brand-brown-dark transition-colors shadow-sm">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21.58 5.4a2.83 2.83 0 00-2-2C17.82 2.9 12 2.9 12 2.9s-5.82 0-7.58.5a2.83 2.83 0 00-2 2C1.9 7.16 1.9 12 1.9 12s0 4.84.52 6.6a2.83 2.83 0 002 2C6.18 21.1 12 21.1 12 21.1s5.82 0 7.58-.5a2.83 2.83 0 002-2C22.1 16.84 22.1 12 22.1 12s0-4.84-.52-6.6zM9.75 15.02V8.83l6.5 3.1-6.5 3.09z"/></svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Media Contact */}
                            <div className="p-6 rounded-2xl border-l-4 border-brand-brown-dark bg-white shadow-sm">
                                <h2 className="font-agency text-xl text-brand-brown-dark mb-2">
                                    For Press & Media
                                </h2>
                                <p className="font-lato text-sm text-brand-brown mb-2">
                                    Direct line for resources and press inquiries:
                                </p>
                                <p className="font-lato text-sm font-bold text-brand-gold">
                                    media@alasadfoundation.org
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: Contact Form */}
                        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 border-t-8 border-brand-gold h-fit">
                            <h2 className="font-agency text-2xl text-brand-brown-dark mb-6">
                                Send us a Message
                            </h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-1">Full Name</label>
                                    <input type="text" className="w-full bg-brand-sand/30 border border-gray-200 rounded-lg px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-1">Email</label>
                                    <input type="email" className="w-full bg-brand-sand/30 border border-gray-200 rounded-lg px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-1">Subject</label>
                                    <select className="w-full bg-brand-sand/30 border border-gray-200 rounded-lg px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all">
                                        <option>General Inquiry</option>
                                        <option>Media & Press</option>
                                        <option>Volunteering</option>
                                        <option>Donation Support</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-1">Message</label>
                                    <textarea rows="4" className="w-full bg-brand-sand/30 border border-gray-200 rounded-lg px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all"></textarea>
                                </div>
                                <button type="button" className="w-full py-3 bg-brand-brown-dark text-white font-agency text-xl rounded-lg hover:bg-brand-gold transition-colors shadow-lg">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </section>

                {/* 3. MEET THE MEDIA TEAM SECTION */}
                <section className="px-6 mb-16">
                    <div className="text-center mb-10">
                        <h2 className="font-agency text-3xl text-brand-brown-dark mb-2">
                            Meet Our Media Team
                        </h2>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-lg mx-auto">
                            The dedicated faces behind our digital presence, ensuring the message of Al-Asad Foundation reaches the world with excellence.
                        </p>
                    </div>

                    {/* 3a. TEAM LEAD (Centered & Larger) */}
                    <div className="flex justify-center mb-8">
                        <div className="group flex flex-col items-center w-full max-w-[200px]">
                            {/* Image Card */}
                            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-4 shadow-xl border-2 border-brand-gold bg-brand-sand">
                                <Image 
                                    src={teamLead.image} 
                                    alt={teamLead.name} 
                                    fill 
                                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-brand-brown-dark/0 group-hover:bg-brand-brown-dark/10 transition-colors"></div>
                            </div>
                            
                            {/* Info */}
                            <h3 className="font-agency text-2xl text-brand-brown-dark leading-none">
                                {teamLead.name}
                            </h3>
                            <p className="font-lato text-xs text-brand-gold font-bold uppercase tracking-wider mt-1 bg-brand-gold/10 px-3 py-1 rounded-full">
                                {teamLead.role}
                            </p>
                        </div>
                    </div>

                    {/* 3b. THE REST OF THE TEAM (Even Grid) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {teamRest.map((member) => (
                            <div key={member.id} className="group flex flex-col items-center">
                                {/* Image Card */}
                                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-md bg-brand-sand">
                                    <Image 
                                        src={member.image} 
                                        alt={member.name} 
                                        fill 
                                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                                    />
                                    <div className="absolute inset-0 bg-brand-brown-dark/20 group-hover:bg-brand-brown-dark/0 transition-colors"></div>
                                </div>
                                
                                {/* Info */}
                                <h3 className="font-agency text-lg text-brand-brown-dark leading-none text-center">
                                    {member.name}
                                </h3>
                                <p className="font-lato text-[10px] text-brand-gold font-bold uppercase tracking-wider mt-1 text-center">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. MAP PLACEHOLDER */}
                <section className="w-full h-64 bg-gray-100 relative grayscale hover:grayscale-0 transition-all duration-700">
                    <Image
                        src="/hero.jpg" 
                        alt="Map Location"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
                            <span className="font-agency text-brand-brown-dark text-lg">Locate us on Map</span>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
