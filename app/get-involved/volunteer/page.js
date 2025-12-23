"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Truck, Laptop, HeartHandshake, Calendar, User, Phone, Mail, MapPin } from 'lucide-react';

export default function VolunteerPage() {

    // Form State (Frontend Demo)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        interest: 'Teaching & Education',
        availability: 'Weekends Only',
        experience: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you! Your application has been received. (Frontend Demo)");
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-10 md:mb-16">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[3.5/1] lg:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" // Placeholder
                            alt="Volunteer with Us"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-white"></div>
                    </div>

                    <div className="relative -mt-16 md:-mt-32 text-center px-6 z-10 max-w-4xl mx-auto">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-brand-brown-dark mb-4 drop-shadow-md">
                            Join the Khidmah
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
                        <p className="font-lato text-brand-brown text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            "The most beloved people to Allah are those who are most beneficial to people."
                        </p>
                    </div>
                </section>

                {/* 2. MAIN CONTENT SPLIT (Left: Info / Right: Form) */}
                <div className="px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-7xl mx-auto">

                    {/* LEFT: INFORMATIONAL SIDEBAR (Sticky on Desktop) */}
                    <div className="flex-1 lg:sticky lg:top-32 lg:self-start space-y-8">
                        <div>
                            <h2 className="font-agency text-3xl text-brand-brown-dark mb-4 relative inline-block">
                                Why Volunteer?
                                <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-brand-gold rounded-full"></span>
                            </h2>
                            <p className="font-lato text-base text-gray-600 leading-relaxed mb-4 text-justify md:text-left">
                                Volunteering at Al-Asad Foundation is more than just a task; it is an act of worship (Ibadah) and service (Khidmah). By dedicating your time, you become part of a legacy that uplifts the ignorant through knowledge and feeds the hungry through charity.
                            </p>
                        </div>

                        {/* Areas of Service Cards */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-brand-sand/30 p-6 rounded-2xl border-l-4 border-brand-gold flex gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-white p-2 rounded-full h-fit text-brand-brown-dark"><BookOpen className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-agency text-xl text-brand-brown-dark mb-1">Education Unit</h3>
                                    <p className="font-lato text-sm text-gray-600">Tutoring, mentoring students, or organizing Islamic classes.</p>
                                </div>
                            </div>
                            <div className="bg-brand-sand/30 p-6 rounded-2xl border-l-4 border-brand-brown-dark flex gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-white p-2 rounded-full h-fit text-brand-brown-dark"><Truck className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-agency text-xl text-brand-brown-dark mb-1">Welfare & Aid</h3>
                                    <p className="font-lato text-sm text-gray-600">Food distribution, logistics for events, and community support.</p>
                                </div>
                            </div>
                            <div className="bg-brand-sand/30 p-6 rounded-2xl border-l-4 border-brand-gold flex gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-white p-2 rounded-full h-fit text-brand-brown-dark"><Laptop className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-agency text-xl text-brand-brown-dark mb-1">Professional Skills</h3>
                                    <p className="font-lato text-sm text-gray-600">Medical, Tech/IT, Legal, or Media support.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: THE CUSTOM APPLICATION FORM */}
                    <div className="flex-[1.5]">
                        <div className="bg-white rounded-3xl shadow-2xl border-t-8 border-brand-brown-dark p-6 md:p-12 relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sand opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <HeartHandshake className="w-8 h-8 text-brand-gold" />
                                    <h2 className="font-agency text-3xl md:text-4xl text-brand-brown-dark">
                                        Volunteer Application
                                    </h2>
                                </div>
                                <p className="font-lato text-sm md:text-base text-gray-500 mb-10 pl-1">
                                    Please fill out this form to register your interest. Our team will review your profile and contact you soon.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {/* Section A: Personal Details */}
                                    <div className="space-y-6">
                                        <h3 className="font-agency text-xl text-brand-brown-dark uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                            <User className="w-4 h-4 text-brand-gold" /> Personal Details
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Full Name</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors"
                                                        placeholder="Enter your name"
                                                    />
                                                    <User className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Phone Number</label>
                                                <div className="relative">
                                                    <input 
                                                        type="tel" 
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors"
                                                        placeholder="080..."
                                                    />
                                                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
                                                <div className="relative">
                                                    <input 
                                                        type="email" 
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors"
                                                        placeholder="you@example.com"
                                                    />
                                                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">City/Location</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors"
                                                        placeholder="e.g. Katsina GRA"
                                                    />
                                                    <MapPin className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section B: Service Interest */}
                                    <div className="space-y-6 pt-2">
                                        <h3 className="font-agency text-xl text-brand-brown-dark uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-brand-gold" /> Availability & Skills
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Department of Interest</label>
                                                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors cursor-pointer appearance-none">
                                                    <option>Teaching & Education</option>
                                                    <option>Welfare & Distribution</option>
                                                    <option>Media & Content</option>
                                                    <option>Medical Team</option>
                                                    <option>Event Logistics</option>
                                                    <option>Tech & IT Support</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Availability</label>
                                                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors cursor-pointer appearance-none">
                                                    <option>Weekends Only</option>
                                                    <option>Weekdays (Part-time)</option>
                                                    <option>Remote / Online</option>
                                                    <option>Flexible / Event based</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Skills / Experience</label>
                                            <textarea 
                                                rows="4"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors resize-none"
                                                placeholder="Briefly describe your skills, profession, or any previous volunteer experience that might be relevant..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            type="submit"
                                            className="w-full py-4 bg-brand-brown-dark text-white font-agency text-xl rounded-xl hover:bg-brand-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            Submit Application
                                        </button>
                                        <p className="text-center text-xs text-gray-400 mt-4">
                                            By submitting, you agree to be contacted by our team.
                                        </p>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
