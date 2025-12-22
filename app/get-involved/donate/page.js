"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DonatePage() {

    // Mock Bank Details
    // You will replace these with the Foundation's actual account numbers
    const accounts = [
        {
            id: 1,
            type: "General Donation & Sadaqah",
            bank: "Jaiz Bank",
            number: "0000 000 000",
            name: "Al-Asad Education Foundation",
            color: "bg-brand-brown-dark",
            textColor: "text-white"
        },
        {
            id: 2,
            type: "Zakat Fund",
            bank: "Jaiz Bank",
            number: "1111 111 111",
            name: "Al-Asad Zakat",
            color: "bg-brand-gold",
            textColor: "text-white"
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
                            src="/hero.jpg" // Placeholder: Giving hands or happy students
                            alt="Donate"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            Invest in an Eternal Legacy
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            "When a person dies, his deeds come to an end except for three: Sadaqah Jariyah..."
                        </p>
                    </div>
                </section>

                {/* 2. DIRECT BANK TRANSFER (Primary Method) */}
                <section className="px-6 mb-16 max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="font-agency text-2xl text-brand-brown-dark mb-2">
                            Direct Bank Transfer
                        </h2>
                        <p className="font-lato text-sm text-brand-brown">
                            Please use the account details below.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {accounts.map((acc) => (
                            <div key={acc.id} className={`${acc.color} ${acc.textColor} p-8 rounded-2xl shadow-xl relative overflow-hidden group`}>
                                {/* Decorative Pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                
                                <h3 className="font-agency text-xl opacity-90 mb-6 border-b border-white/20 pb-2">
                                    {acc.type}
                                </h3>

                                <div className="space-y-1 mb-6">
                                    <p className="font-lato text-xs opacity-70 uppercase tracking-widest">Bank Name</p>
                                    <p className="font-agency text-2xl tracking-wide">{acc.bank}</p>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <p className="font-lato text-xs opacity-70 uppercase tracking-widest">Account Number</p>
                                    <div className="flex items-center gap-3">
                                        <p className="font-mono text-3xl font-bold tracking-widest">{acc.number}</p>
                                        {/* Copy Icon (Visual only for now) */}
                                        <button className="opacity-50 hover:opacity-100 transition-opacity">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="font-lato text-xs opacity-70 uppercase tracking-widest">Account Name</p>
                                    <p className="font-lato text-sm font-bold">{acc.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. ONLINE PAYMENT (Placeholder for Future Integration) */}
                <section className="px-6 mb-16 max-w-lg mx-auto">
                    <div className="bg-brand-sand/40 border-2 border-dashed border-brand-brown/20 rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-brand-gold shadow-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        <h3 className="font-agency text-xl text-brand-brown-dark mb-2">
                            Pay with Card
                        </h3>
                        <p className="font-lato text-sm text-brand-brown mb-4">
                            Secure online donation via Paystack/Flutterwave is coming soon.
                        </p>
                        <button disabled className="px-6 py-2 bg-gray-200 text-gray-400 font-bold text-xs rounded-full uppercase tracking-wider cursor-not-allowed">
                            Coming Soon
                        </button>
                    </div>
                </section>

                {/* 4. IMPACT BREAKDOWN */}
                <section className="px-6">
                    <div className="bg-brand-brown-dark text-white rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="font-agency text-2xl mb-8">Where does your donation go?</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <h3 className="font-agency text-lg text-brand-gold mb-1">Scholarships</h3>
                                <p className="font-lato text-xs text-white/70">Supporting indigent students with tuition and books.</p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                                    <span className="text-2xl">🍲</span>
                                </div>
                                <h3 className="font-agency text-lg text-brand-gold mb-1">Welfare</h3>
                                <p className="font-lato text-xs text-white/70">Feeding programs and emergency relief for families.</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                                    <span className="text-2xl">💡</span>
                                </div>
                                <h3 className="font-agency text-lg text-brand-gold mb-1">Dawah</h3>
                                <p className="font-lato text-xs text-white/70">Producing educational content and organizing lectures.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
