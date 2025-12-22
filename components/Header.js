"use client";

import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react'; 
import { useState } from 'react';
import Image from 'next/image'; 

// Updated Navigation to match the new Sitemap
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Media', href: '/media' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white font-lato shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LEFT SIDE: Menu Icon and Logo */}
          <div className="flex items-center space-x-4"> 

            {/* Menu Icon - Using Brand Brown */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 rounded-full bg-brand-brown-dark text-white focus:outline-none hover:bg-brand-gold transition-colors"
              aria-expanded={isSidebarOpen}
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center relative h-16 w-40">
              <Image 
                src="/headerlogo.svg" 
                alt="Al-Asad Education Foundation Logo" 
                fill
                className="object-contain object-left"
                priority 
              />
            </Link>
          </div>

          {/* RIGHT SIDE: Placeholder (Empty for now, but ready for desktop nav in future) */}
          <div className="flex-shrink-0">
             {/* Future Desktop Nav or Donate Button can go here */}
          </div>

        </div>
      </div>

      {/* Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-brand-brown-dark/60 z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      />

      {/* Sidebar Panel - BRAND GOLD */}
      <div 
        className={`fixed top-0 left-0 w-72 max-w-full h-full bg-brand-gold text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">

          {/* Header Bar with Close Button */}
          <div className="p-4 flex justify-between items-center border-b border-white/20">
             <span className="font-agency text-xl tracking-wide">Menu</span>
            <button 
              onClick={closeSidebar} 
              className="p-2 rounded-full text-white hover:text-brand-brown-dark hover:bg-white transition-colors focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-4 flex-grow overflow-y-auto">

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-3 border-none rounded-xl bg-white/90 text-brand-brown-dark placeholder-brand-brown/50 focus:ring-2 focus:ring-brand-brown-dark outline-none text-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-brand-brown/50" />
            </div>

            {/* Main Navigation Links */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeSidebar}
                  className="block px-4 py-3 rounded-lg text-lg font-agency tracking-wide text-white hover:bg-brand-brown-dark transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

          </div>

          {/* Footer of Sidebar */}
          <Link href="/admin/login" onClick={closeSidebar}>
            <div className="p-6 border-t border-white/20 text-xs text-white/80 font-lato text-center hover:text-white transition-colors">
              © Al-Asad Education Foundation
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
