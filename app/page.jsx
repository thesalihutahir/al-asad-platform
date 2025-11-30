// app/page.jsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Newspaper, Heart, TrendingUp, ChevronRight, Menu, X, DollarSign, Users } from 'lucide-react';
import { getNewsArticles, getPrograms } from '@/lib/firestore-utils';

// --- Shared Data Structure (For type inference and placeholders) ---
const initialDataState = {
  loading: true,
  news: [],
  programs: [],
  error: null,
};

// --- Helper Components ---

// Simple Header/Navbar (Client-side for interaction)
const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { name: 'Programs', href: '/programs' },
        { name: 'Multimedia', href: '/multimedia' },
        { name: 'News & Events', href: '/news' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link href="/" className="text-2xl font-extrabold text-indigo-700">
                        Al Asad Foundation
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6 items-center">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href} className="text-gray-600 hover:text-indigo-600 font-medium transition">
                                {item.name}
                            </Link>
                        ))}
                        <Link href="/donate" className="flex items-center px-4 py-2 text-sm font-semibold rounded-full text-white bg-green-600 hover:bg-green-700 transition shadow-lg">
                            <Heart className="w-4 h-4 mr-1 fill-white" /> Donate Now
                        </Link>
                        <Link href="/admin" className="text-gray-500 hover:text-indigo-600 text-sm ml-4">
                            Admin
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-gray-700 rounded-lg hover:bg-gray-100" 
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle navigation"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute w-full bg-white shadow-xl py-2 transition-all duration-300 ease-in-out">
                    <nav className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                                {item.name}
                            </Link>
                        ))}
                        <Link href="/donate" onClick={() => setIsOpen(false)} className="block w-full text-center mt-2 px-3 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition">
                            Donate Now
                        </Link>
                         <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-indigo-50 hover:text-indigo-600">
                            Admin Login
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

// Reusable News/Program Card
const ContentCard = ({ title, summary, href, type, imageUrl = "https://placehold.co/600x400/374151/ffffff?text=Al+Asad" }) => {
    const Icon = type === 'News' ? Newspaper : BookOpen;
    const color = type === 'News' ? 'text-blue-600' : 'text-purple-600';

    return (
        <Link href={href} className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group">
            <div className="h-48 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    onError={(e) => e.target.src = "https://placehold.co/600x400/374151/ffffff?text=Al+Asad"}
                />
            </div>
            <div className="p-5">
                <span className={`text-xs font-semibold uppercase tracking-wider ${color} flex items-center mb-1`}>
                    <Icon className="w-3 h-3 mr-1" /> {type}
                </span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition duration-300 line-clamp-2">
                    {title}
                </h3>
                <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                    {summary}
                </p>
                <div className="mt-4 flex items-center text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
};

// Section Title component
const SectionTitle = ({ children, color = 'text-gray-900' }) => (
    <h2 className={`text-3xl sm:text-4xl font-extrabold text-center mb-10 ${color}`}>
        {children}
    </h2>
);

// --- Main Page Component ---
export default function HomePage() {
  const [data, setData] = useState(initialDataState);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [newsResult, programsResult] = await Promise.all([
          getNewsArticles(),
          getPrograms()
        ]);

        setData({
          loading: false,
          news: newsResult.slice(0, 3).sort((a, b) => (new Date(b.date) - new Date(a.date))), // Get top 3, sort by date
          programs: programsResult.slice(0, 3), // Get top 3
          error: null
        });
      } catch (e) {
        console.error("Failed to fetch homepage data:", e);
        setData(prev => ({ ...prev, loading: false, error: "Failed to load content." }));
      }
    }
    fetchData();
  }, []);

  const { loading, news, programs, error } = data;
  const featuredContent = [...news.map(n => ({...n, type: 'News', href: `/news/${n.id}`})), 
                           ...programs.map(p => ({...p, type: 'Program', href: `/programs/${p.id}`}))]
                           .slice(0, 3); // Combine and limit to 3 featured items

  return (
    <div>
      <Header />
      <main className="pt-0">
        
        {/* 1. HERO SECTION */}
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center bg-gray-900 overflow-hidden">
            {/* Background Image/Overlay */}
            <img 
                src="https://placehold.co/1920x1080/1f2937/ffffff?text=Inspiring+Al+Asad+Hero+Image" 
                alt="Al Asad Foundation Community" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                onError={(e) => e.target.src = "https://placehold.co/1920x1080/1f2937/ffffff?text=Inspiring+Al+Asad+Hero+Image"}
            />
            
            <div className="relative z-10 p-6 max-w-4xl">
                <p className="text-xl text-indigo-300 font-semibold mb-3 tracking-widest uppercase">Empowering Futures</p>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                    Education is the Foundation of Hope.
                </h1>
                <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
                    The Al Asad Foundation is dedicated to providing quality education and essential resources to underprivileged communities across the region.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/programs" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-xl transform hover:scale-[1.02]">
                        Explore Our Programs
                    </Link>
                    <Link href="/donate" className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-full text-white bg-transparent hover:bg-white hover:text-indigo-600 transition duration-300">
                        <Heart className="w-4 h-4 mr-2 fill-white hover:fill-indigo-600 transition" /> Support Our Mission
                    </Link>
                </div>
            </div>
        </section>

        {/* 2. IMPACT STATS / MISSION STATEMENT */}
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-indigo-600 text-sm font-semibold uppercase tracking-wider">Our Core Belief</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mt-2">
                        Driving Change Through Education
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 bg-indigo-50 rounded-xl shadow-lg border border-indigo-200">
                        <DollarSign className="w-10 h-10 mx-auto text-indigo-600 mb-4 bg-white p-2 rounded-full shadow-md" />
                        <h3 className="text-xl font-bold text-gray-900">Empowering Students</h3>
                        <p className="mt-2 text-gray-600">Funding scholarships and infrastructure for over 1,500 students annually.</p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-xl shadow-lg border border-indigo-200">
                        <Users className="w-10 h-10 mx-auto text-indigo-600 mb-4 bg-white p-2 rounded-full shadow-md" />
                        <h3 className="text-xl font-bold text-gray-900">Community Outreach</h3>
                        <p className="mt-2 text-gray-600">Engaging local leaders and families to ensure long-term program sustainability.</p>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-xl shadow-lg border border-indigo-200">
                        <TrendingUp className="w-10 h-10 mx-auto text-indigo-600 mb-4 bg-white p-2 rounded-full shadow-md" />
                        <h3 className="text-xl font-bold text-gray-900">Proven Impact</h3>
                        <p className="mt-2 text-gray-600">95% of our graduates proceed to higher education or vocational training.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* 3. FEATURED CONTENT (News & Programs) */}
        <section className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle color="text-indigo-800">Latest Updates & Featured Work</SectionTitle>
                
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Fetching content highlights...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600 font-medium">{error}</div>
                ) : featuredContent.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No featured content available yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredContent.map((item, index) => (
                            <ContentCard
                                key={item.id || index}
                                title={item.title || "Untitled Content"}
                                summary={item.summary || item.description || "Click to see more details about this featured item from the foundation."}
                                href={item.href}
                                type={item.type}
                                imageUrl={item.imageUrl}
                            />
                        ))}
                    </div>
                )}
                
                <div className="mt-12 text-center">
                    <Link href="/news" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-lg">
                        View All News & Programs
                    </Link>
                </div>
            </div>
        </section>

        {/* 4. DONATION CALL TO ACTION */}
        <section className="py-20 bg-indigo-700">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-extrabold text-white mb-4">
                    Your Generosity Fuels Our Mission
                </h2>
                <p className="text-xl text-indigo-200 mb-8">
                    Every donation goes directly to securing education, providing meals, and building future leaders. Join us today.
                </p>
                <Link href="/donate" className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-bold rounded-full text-indigo-700 bg-yellow-400 hover:bg-yellow-300 transition duration-300 shadow-2xl transform hover:scale-105">
                    <DollarSign className="w-5 h-5 mr-2" /> Make a Donation
                </Link>
            </div>
        </section>

      </main>

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}

// Simple Footer Component
const Footer = () => (
    <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
                <h4 className="text-xl font-bold text-indigo-400 mb-4">Al Asad</h4>
                <p className="text-sm text-gray-400">
                    Empowering communities through education and humanitarian aid.
                </p>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                    <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                    <li><Link href="/admin" className="hover:text-white transition">Staff Login</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Get Involved</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link href="/programs" className="hover:text-white transition">Our Programs</Link></li>
                    <li><Link href="/volunteer" className="hover:text-white transition">Volunteer</Link></li>
                    <li><Link href="/donate" className="hover:text-white transition">Sponsor a Child</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <p className="text-sm text-gray-400">Email: info@alasadeducation.org</p>
                <div className="flex space-x-4 mt-3">
                    {/* Placeholder for social media icons */}
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">F</div>
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">T</div>
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">I</div>
                </div>
            </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Al Asad Foundation. All rights reserved.
        </div>
    </footer>
);