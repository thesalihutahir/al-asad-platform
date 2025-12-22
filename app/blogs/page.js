"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BlogsPage() {
    
    // Blog Categories
    const categories = [
        {
            id: 'articles',
            title: 'Articles',
            description: 'Reflections on faith, society, and personal growth.',
            link: '/blogs/articles',
            icon: '/blogsicon.svg' 
        },
        {
            id: 'updates',
            title: 'News & Updates',
            description: 'Latest happenings, events, and foundation announcements.',
            link: '/blogs/updates',
            icon: '/blogsicon.svg'
        },
        {
            id: 'research',
            title: 'Research & Papers',
            description: 'Scholarly publications and academic discourses.',
            link: '/blogs/research-and-publications',
            icon: '/blogsicon.svg'
        }
    ];

    // Mock "Featured" Article
    const featured = {
        title: "The Role of the Youth in Nation Building",
        excerpt: "An exploration of how young Muslims can contribute to national development while upholding their Islamic identity.",
        date: "22 Dec 2024",
        category: "Article",
        image: "/hero.jpg", 
        link: "/blogs/articles" // In real app, links to specific slug
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-8">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
                        <Image
                            src="/hero.jpg" // Placeholder: Writing desk or library
                            alt="Blogs Hero"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
                    </div>

                    <div className="relative -mt-12 md:-mt-20 text-center px-6 z-10">
                        <h1 className="font-agency text-4xl text-brand-brown-dark mb-3 drop-shadow-sm">
                            Insights & Updates
                        </h1>
                        <div className="w-16 h-1 bg-brand-gold mx-auto rounded-full mb-4"></div>
                        <p className="font-lato text-brand-brown text-sm max-w-md mx-auto leading-relaxed">
                            Read our latest thoughts, foundation news, and scholarly research.
                        </p>
                    </div>
                </section>

                {/* 2. CATEGORY NAV CARDS */}
                <section className="px-6 mb-12">
                    <div className="grid grid-cols-1 gap-4">
                        {categories.map((cat) => (
                            <Link 
                                key={cat.id} 
                                href={cat.link}
                                className="flex items-center p-4 bg-brand-sand/40 rounded-xl border border-transparent hover:border-brand-gold/30 hover:bg-brand-sand transition-colors group"
                            >
                                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-gold group-hover:scale-110 transition-transform">
                                    {/* Using SVG Icon placeholder */}
                                    <Image src={cat.icon} alt="icon" width={24} height={24} className="opacity-80" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-agency text-xl text-brand-brown-dark leading-none mb-1 group-hover:text-brand-gold transition-colors">
                                        {cat.title}
                                    </h3>
                                    <p className="font-lato text-xs text-brand-brown leading-tight">
                                        {cat.description}
                                    </p>
                                </div>
                                <div className="ml-auto text-brand-brown-dark/30 group-hover:text-brand-gold transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 3. FEATURED STORY */}
                <section className="px-6 mb-8">
                    <h2 className="font-agency text-2xl text-brand-brown-dark mb-4 border-l-4 border-brand-gold pl-3">
                        Featured Read
                    </h2>
                    
                    <Link href={featured.link} className="block group">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg mb-4">
                            <Image
                                src={featured.image}
                                alt={featured.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-3 left-3 bg-brand-gold text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                {featured.category}
                            </div>
                        </div>
                        
                        <h3 className="font-agency text-2xl text-brand-brown-dark leading-tight mb-2 group-hover:text-brand-gold transition-colors">
                            {featured.title}
                        </h3>
                        <p className="font-lato text-sm text-brand-brown line-clamp-2 mb-2">
                            {featured.excerpt}
                        </p>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Read More →
                        </span>
                    </Link>
                </section>

                {/* 4. RECENT POSTS LIST (Generic Mix) */}
                <section className="px-6 space-y-6">
                    <h3 className="font-agency text-xl text-brand-brown-dark mb-2 opacity-80">
                        Recent Posts
                    </h3>
                    
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0">
                            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-brand-sand">
                                <Image src="/hero.jpg" alt="Post thumbnail" fill className="object-cover" />
                            </div>
                            <div>
                                <span className="text-[10px] text-brand-gold font-bold uppercase">News</span>
                                <h4 className="font-agency text-lg text-brand-brown-dark leading-tight mb-1 line-clamp-2">
                                    Community outreach program reaches 500 families
                                </h4>
                                <span className="text-[10px] text-gray-400">20 Dec 2024</span>
                            </div>
                        </div>
                    ))}
                </section>

            </main>

            <Footer />
        </div>
    );
}
