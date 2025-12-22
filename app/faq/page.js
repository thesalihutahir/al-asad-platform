"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function FAQPage() {
    
    const faqs = [
        {
            category: "General",
            questions: [
                { q: "What is the primary mission of Al-Asad Foundation?", a: "Our mission is to expand access to knowledge through Qur'an-centered and community-driven education, bridging the gap between traditional Islamic sciences and modern learning." },
                { q: "Where is the foundation located?", a: "Our headquarters are located in Katsina State, Nigeria. We operate various centers and outreach programs within the region." },
            ]
        },
        {
            category: "Donations & Zakat",
            questions: [
                { q: "Is my donation Zakat eligible?", a: "Yes, we have a dedicated Zakat Fund. Please ensure you donate to the specific account labeled for Zakat or specify 'Zakat' in your transfer description so it is distributed strictly according to Shari'ah." },
                { q: "Can I donate anonymously?", a: "Absolutely. You can make a direct bank transfer without notifying us, or use 'Anonymous' when filling out our future online donation forms." },
            ]
        },
        {
            category: "Volunteering",
            questions: [
                { q: "How can I join the volunteer team?", a: "You can apply through the 'Get Involved > Volunteer' page on this website. Fill out the application form, and our team will review your skills and availability." },
                { q: "Do I need specific qualifications to volunteer?", a: "Not necessarily. While we need professionals (teachers, medics, tech), we also need general support for logistics and welfare distribution. Sincerity and dedication are the most important qualifications." },
            ]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pt-10 pb-16 px-6">
                
                {/* Page Title */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="font-agency text-4xl text-brand-brown-dark mb-2">Frequently Asked Questions</h1>
                    <p className="font-lato text-brand-brown text-sm">
                        Common questions about our mission, programs, and how you can help.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="max-w-2xl mx-auto space-y-8">
                    {faqs.map((section, idx) => (
                        <div key={idx}>
                            <h2 className="font-agency text-xl text-brand-gold uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
                                {section.category}
                            </h2>
                            <div className="space-y-4">
                                {section.questions.map((item, qIdx) => (
                                    <details key={qIdx} className="group bg-brand-sand/30 rounded-xl overflow-hidden border border-transparent open:border-brand-gold/20 transition-all">
                                        <summary className="flex justify-between items-center font-agency text-lg text-brand-brown-dark p-5 cursor-pointer list-none hover:bg-brand-sand/50 transition-colors">
                                            <span>{item.q}</span>
                                            <span className="transition-transform group-open:rotate-180">
                                                <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </span>
                                        </summary>
                                        <div className="px-5 pb-5 pt-0 font-lato text-sm text-brand-brown leading-relaxed text-justify">
                                            {item.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still have questions? */}
                <div className="text-center mt-12">
                    <p className="font-lato text-sm text-brand-brown mb-2">Can't find what you're looking for?</p>
                    <a href="/contact" className="font-agency text-lg text-brand-brown-dark underline decoration-brand-gold hover:text-brand-gold transition-colors">
                        Contact our Support Team
                    </a>
                </div>

            </main>

            <Footer />
        </div>
    );
}
