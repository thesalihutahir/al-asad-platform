"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown, MessageCircle, HelpCircle, Search } from 'lucide-react';

export default function FAQPage() {

    const faqs = [
        {
            id: 'general',
            category: "General",
            questions: [
                { q: "What is the primary mission of Al-Asad Foundation?", a: "Our mission is to expand access to knowledge through Qur'an-centered and community-driven education, bridging the gap between traditional Islamic sciences and modern learning." },
                { q: "Where is the foundation located?", a: "Our headquarters are located in Katsina State, Nigeria. We operate various centers and outreach programs within the region." },
                { q: "Is the foundation affiliated with any political group?", a: "No, Al-Asad Education Foundation is a non-partisan, non-governmental organization focused solely on education, spiritual development, and community welfare." },
            ]
        },
        {
            id: 'donations',
            category: "Donations & Zakat",
            questions: [
                { q: "Is my donation Zakat eligible?", a: "Yes, we have a dedicated Zakat Fund. Please ensure you donate to the specific account labeled for Zakat or specify 'Zakat' in your transfer description so it is distributed strictly according to Shari'ah." },
                { q: "Can I donate anonymously?", a: "Absolutely. You can make a direct bank transfer without notifying us, or use 'Anonymous' when filling out our future online donation forms." },
                { q: "How are the funds utilized?", a: "We maintain a 100% transparency policy. Funds are allocated to scholarships, teacher salaries, facility maintenance, and welfare programs. An annual report is published for transparency." },
            ]
        },
        {
            id: 'volunteering',
            category: "Volunteering",
            questions: [
                { q: "How can I join the volunteer team?", a: "You can apply through the 'Get Involved > Volunteer' page on this website. Fill out the application form, and our team will review your skills and availability." },
                { q: "Do I need specific qualifications to volunteer?", a: "Not necessarily. While we need professionals (teachers, medics, tech), we also need general support for logistics and welfare distribution. Sincerity and dedication are the most important qualifications." },
                { q: "Can I volunteer remotely?", a: "Yes! We have roles for graphic designers, content writers, and social media managers that can be done from anywhere." },
            ]
        },
        {
            id: 'education',
            category: "Educational Programs",
            questions: [
                { q: "How do I enroll my child in the Ma'ahad?", a: "Enrollment forms are available at our administrative office. We typically admit new students at the beginning of the academic session in September." },
                { q: "Do you offer adult classes?", a: "Yes, we have weekend and evening classes tailored for adults who wish to learn Qur'an memorization, Tajweed, and Fiqh." },
            ]
        }
    ];

    // Optional: State for active category (for desktop sidebar highlighting)
    const [activeCategory, setActiveCategory] = useState('general');

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveCategory(id);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pt-16 md:pt-24 pb-20 px-6">

                {/* Page Title */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-brand-sand/50 rounded-full mb-4 text-brand-brown-dark">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <h1 className="font-agency text-4xl md:text-6xl text-brand-brown-dark mb-4">Frequently Asked Questions</h1>
                    <p className="font-lato text-brand-brown text-base md:text-xl max-w-2xl mx-auto">
                        Everything you need to know about our mission, programs, and how you can be part of the change.
                    </p>
                </div>

                {/* Search Bar (Visual Only) */}
                <div className="max-w-xl mx-auto mb-16 relative">
                    <input 
                        type="text" 
                        placeholder="Search for answers..." 
                        className="w-full py-4 pl-12 pr-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                </div>

                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
                    
                    {/* LEFT COLUMN: Sidebar Navigation (Desktop) */}
                    <div className="hidden lg:block lg:w-1/4">
                        <div className="sticky top-32 space-y-2">
                            <h3 className="font-agency text-xl text-gray-400 mb-4 pl-4 uppercase tracking-widest">Categories</h3>
                            {faqs.map((section) => (
                                <button 
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeCategory === section.id ? 'bg-brand-brown-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {section.category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FAQ Accordions */}
                    <div className="lg:w-3/4 space-y-12">
                        {faqs.map((section) => (
                            <div key={section.id} id={section.id} className="scroll-mt-32">
                                <h2 className="font-agency text-2xl md:text-3xl text-brand-gold uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                                    {section.category}
                                </h2>
                                <div className="space-y-4">
                                    {section.questions.map((item, qIdx) => (
                                        <details key={qIdx} className="group bg-white rounded-2xl border border-gray-100 open:border-brand-gold/30 open:shadow-lg open:bg-brand-sand/10 transition-all duration-300">
                                            <summary className="flex justify-between items-center font-agency text-lg md:text-xl text-brand-brown-dark p-6 cursor-pointer list-none hover:text-brand-gold transition-colors">
                                                <span>{item.q}</span>
                                                <span className="bg-gray-100 rounded-full p-1 text-gray-400 group-open:bg-brand-gold group-open:text-white transition-all transform group-open:rotate-180">
                                                    <ChevronDown className="w-5 h-5" />
                                                </span>
                                            </summary>
                                            <div className="px-6 pb-6 pt-0 font-lato text-base text-gray-600 leading-relaxed text-justify md:text-left animate-fadeIn">
                                                <div className="h-px w-full bg-gray-100 mb-4"></div>
                                                {item.a}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Still have questions? */}
                <div className="text-center mt-20 md:mt-32 bg-brand-sand/30 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
                    <MessageCircle className="w-10 h-10 text-brand-brown-dark mx-auto mb-4" />
                    <h3 className="font-agency text-2xl md:text-3xl text-brand-brown-dark mb-2">Still have questions?</h3>
                    <p className="font-lato text-sm md:text-base text-brand-brown mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <a href="/contact" className="inline-block px-8 py-3 bg-brand-brown-dark text-white font-agency text-lg rounded-full hover:bg-brand-gold transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Contact Support
                    </a>
                </div>

            </main>

            <Footer />
        </div>
    );
}
