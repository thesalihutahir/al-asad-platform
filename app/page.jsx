"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header placeholder - waiting for future redesign */}
            <Header />

            <main className="flex-grow">

                {/* 1. HERO SECTION */}
                <section className="w-full">
                    <div className="relative w-full aspect-[4/3] sm:aspect-[16/9]">
                        <Image
                            src="/hero.svg"
                            alt="Al-Asad Foundation Hero"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="text-center py-6 px-4">
                        <h1 className="font-agency text-2xl text-brand-brown-dark leading-tight">
                            Guiding through Qur'an, Empowering Communities.
                        </h1>
                    </div>
                </section>

                {/* 2. ICON NAVIGATION MENU */}
                <section className="py-6 px-8">
                    <div className="grid grid-cols-4 gap-4 justify-items-center">
                        <Link href="/programs" className="flex flex-col items-center group">
                            <div className="w-15 h-15 relative mb-2 transition-transform group-hover:scale-110 drop-shadow-md">
                                <Image src="/programsicon.svg" alt="Programs" fill className="object-contain" />
                            </div>
                            <span className="font-agency text-sm text-brand-brown-dark">Programs</span>
                        </Link>
                        <Link href="/multimedia" className="flex flex-col items-center group">
                            <div className="w-15 h-15 relative mb-2 transition-transform group-hover:scale-110 drop-shadow-md">
                                <Image src="/mediaicon.svg" alt="Media" fill className="object-contain" />
                            </div>
                            <span className="font-agency text-sm text-brand-brown-dark">Media</span>
                        </Link>
                        <Link href="/news" className="flex flex-col items-center group">
                            <div className="w-15 h-15 relative mb-2 transition-transform group-hover:scale-110 drop-shadow-md">
                                <Image src="/blogsicon.svg" alt="Blogs" fill className="object-contain" />
                            </div>
                            <span className="font-agency text-sm text-brand-brown-dark">Blogs</span>
                        </Link>
                        <Link href="/about" className="flex flex-col items-center group">
                            <div className="w-15 h-15 relative mb-2 transition-transform group-hover:scale-110 drop-shadow-md">
                                <Image src="/abouticon.svg" alt="About" fill className="object-contain" />
                            </div>
                            <span className="font-agency text-sm text-brand-brown-dark">About</span>
                        </Link>
                    </div>
                </section>

                {/* 3. ACTION BUTTONS */}
                <section className="py-6 px-10 flex justify-center gap-4">
                    <Link
                        href="/donate"
                        className="flex-1 py-1 px-2 text-center font-agency text-lg text-white bg-brand-gold rounded-md shadow-xl transition-transform hover:scale-110"
                    >
                        Donate
                    </Link>
                    <Link
                        href="/volunteer"
                        className="flex-1 py-1 px-2 text-center font-agency text-lg text-white bg-brand-gold rounded-md shadow-xl transition-transform hover:scale-110"
                    >
                        Volunteer
                    </Link>
                </section>

                {/* 4. LATEST UPDATES (Horizontal Beige Design) */}
<section className="py-12 px-6">
    {/* Section Title */}
    <h2 className="font-agency text-4xl font-bold text-brand-brown-dark mb-8 text-left">
        Latest Updates:
    </h2>

    {/* Card Container: Beige, Very Rounded Corners, Horizontal Layout */}
    <div className="bg-[#F0E4D4] rounded-[3rem] p-6 md:p-8">
        <Link href="/news" className="flex flex-col md:flex-row items-center gap-8 group">
            
            {/* 1. Image Side - Square-ish, Rounded Corners */}
            <div className="relative w-full md:w-80 h-72 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
                <Image
                    src="/hero.jpg" 
                    alt="Weekly Lecture"
                    fill
                    className="object-cover rounded-3xl shadow-sm"
                />
            </div>

            {/* 2. Content Side */}
            <div className="flex-1 text-left">
                {/* Title: Dark Brown, Bold, Large */}
                <h3 className="font-agency text-4xl md:text-5xl font-bold text-brand-brown-dark leading-tight">
                    Weekly Lecture: <br />
                    Bulugul Maram
                </h3>

                {/* The Gold Separator Line */}
                <div className="w-32 h-1 bg-[#C68E17] mt-4 mb-5"></div>

                {/* Subtitle/Description */}
                <p className="font-lato text-xl text-brand-brown-dark leading-normal">
                    Lessons on Bulugul Maram by Sheikh <br className="hidden md:block" />
                    Goni Dr. Muneer Ja'afar Katsina
                </p>
            </div>
        </Link>
    </div>
</section>


                {/* 5. VISION AND MISSION STATEMENTS */}
<section className="relative py-20 px-4 bg-brand-gold overflow-hidden">
    {/* Background Overlay Pattern */}
    <div className="absolute inset-0">
        <Image 
            src="/visionandmissionbg.svg" 
            alt="Background pattern overlay" 
            fill 
            className="object-cover opacity-20 md:opacity-30" 
        />
    </div>

    <div className="relative z-10 text-center text-white">
        {/* Vision */}
        <div className="mb-10">
            <h2 className="font-agency text-4xl font-bold text-white mb-4 text-center">
                Vision Statement
            </h2>
            <p className="font-lato text-xl leading-snug max-w-xl mx-auto">
                To be a leading force in transforming education through Qur'an values, excellence in learning, and empowerment of communities.
            </p>
        </div>

        {/* Separator & Icons */}
        <div className="mb-10 max-w-xl mx-auto">
            {/* Separator Lines */}
            <div className="flex justify-center items-center my-6">
                <hr className="w-1/4 h-0.5 bg-white opacity-50 border-0" />
                <hr className="w-1/4 h-0.5 bg-white opacity-50 border-0 ml-4" />
            </div>

            {/* Icons and Labels */}
            <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 relative mb-2">
                        <Image src="/educationalsupporticon.svg" alt="Educational Support" fill className="object-contain" />
                    </div>
                    <span className="font-lato text-sm text-white">Educational Support</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 relative mb-2">
                        <Image src="/communitydevelopmenticon.svg" alt="Community Development" fill className="object-contain" />
                    </div>
                    <span className="font-lato text-sm text-white">Community Development</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 relative mb-2">
                        <Image src="/trainingandinnovationicon.svg" alt="Training & Innovation" fill className="object-contain" />
                    </div>
                    <span className="font-lato text-sm text-white">Training and Innovation</span>
                </div>
            </div>
        </div>
        

        {/* Mission */}
        <div>
            <h2 className="font-agency text-4xl font-bold text-white mb-4 text-center">
                Mission Statement
            </h2>
            <p className="font-lato text-xl leading-snug max-w-xl mx-auto">
                Expanding access to knowledge through Qur'an-centered and community driven education.
            </p>
        </div>
    </div>
</section>


                {/* 6. ARABIC QUOTE & FINAL CTA */}
                <section className="py-12 px-4 text-center bg-brand-sand">
                    <div className="relative w-4/5 mx-auto h-24 mb-8">
                        <Image
                            src="/ilmquote.svg"
                            alt="Arabic Quote about Knowledge"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h2 className="font-agency text-2xl text-brand-brown-dark leading-snug max-w-xs mx-auto">
                        Join us in building a future shaped by knowledge and faith.
                    </h2>
                </section>

            </main>

            {/* Footer placeholder - waiting for future redesign */}
            <Footer />
        </div>
    );
}