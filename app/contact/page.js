"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" // Placeholder: Image of office or friendly reception
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
                            Have questions or want to get involved? We are here to listen.
                        </p>
                    </div>
                </section>

                {/* 2. CONTACT INFO & FORM GRID */}
                <section className="px-6 mb-12">
                    <div className="flex flex-col lg:flex-row gap-12">
                        
                        {/* LEFT: Contact Information */}
                        <div className="flex-1 space-y-8">
                            
                            {/* General Inquiries */}
                            <div className="bg-brand-sand/30 p-6 rounded-2xl border border-brand-gold/10">
                                <h2 className="font-agency text-2xl text-brand-brown-dark mb-4">
                                    General Inquiries
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-agency text-lg text-brand-brown-dark">Office Address</p>
                                            <p className="font-lato text-sm text-brand-brown">
                                                No. 123, Katsina Road,<br />Katsina State, Nigeria.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-agency text-lg text-brand-brown-dark">Phone</p>
                                            <p className="font-lato text-sm text-brand-brown">+234 800 000 0000</p>
                                            <p className="font-lato text-sm text-brand-brown">+234 800 111 1111</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gold shadow-sm">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-agency text-lg text-brand-brown-dark">Email</p>
                                            <p className="font-lato text-sm text-brand-brown">info@alasadfoundation.org</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Media Team Specific */}
                            <div className="p-6 rounded-2xl border-l-4 border-brand-brown-dark bg-white shadow-sm">
                                <h2 className="font-agency text-xl text-brand-brown-dark mb-2">
                                    Media & Press Team
                                </h2>
                                <p className="font-lato text-sm text-brand-brown mb-3">
                                    For interviews, resource usage permissions, or press inquiries:
                                </p>
                                <p className="font-lato text-sm font-bold text-brand-gold">
                                    media@alasadfoundation.org
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: Contact Form */}
                        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 border-t-8 border-brand-gold">
                            <h2 className="font-agency text-2xl text-brand-brown-dark mb-6">
                                Send us a Message
                            </h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-brand-sand/30 border border-gray-200 rounded-lg px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-brand-sand/30 border border-gray-200 rounded-lg px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-1">Subject</label>
                                    <select className="w-full bg-brand-sand/30 border border-gray-200 rounded-lg px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all">
                                        <option>General Inquiry</option>
                                        <option>Volunteering</option>
                                        <option>Donation Support</option>
                                        <option>Program Info</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown uppercase tracking-wider mb-1">Message</label>
                                    <textarea 
                                        rows="4"
                                        className="w-full bg-brand-sand/30 border border-gray-200 rounded-lg px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all"
                                        placeholder="Write your message here..."
                                    ></textarea>
                                </div>
                                <button 
                                    type="button"
                                    className="w-full py-3 bg-brand-brown-dark text-white font-agency text-xl rounded-lg hover:bg-brand-gold transition-colors shadow-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                    </div>
                </section>

                {/* 3. MAP PLACEHOLDER */}
                <section className="w-full h-64 bg-gray-100 relative grayscale hover:grayscale-0 transition-all duration-700">
                    {/* In production, replace this Image with a Google Maps Iframe */}
                    <Image
                        src="/hero.jpg" // Placeholder for Map Screenshot
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
