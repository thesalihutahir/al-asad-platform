"use client";

import Link from 'next/link';
import { Menu, X, DollarSign, Search } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Programs', href: '/programs' },
  { name: 'Multimedia', href: '/multimedia' },
  { name: 'News', href: '/news' },
  { name: 'About Us', href: '/about' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-brown-dark shadow-xl font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src="/headerlogo.png" 
                alt="Al-Asad Education Foundation Logo" 
                className="h-14 w-auto" 
                onError={(e) => { e.target.onerror = null; e.target.src="/placeholder.png" }} 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-brand-gold text-lg font-bold transition duration-150 ease-in-out font-heading tracking-wider uppercase"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Donate Button & Search/Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button className="hidden sm:block p-2 text-white hover:text-brand-gold">
                <Search className="w-5 h-5" />
            </button>
            <Link
              href="/donate"
              className="inline-flex items-center px-4 py-2 border-2 border-brand-gold text-base font-bold rounded-full shadow-lg text-brand-gold bg-white hover:bg-brand-gold hover:text-brand-brown-dark transition duration-200 ease-in-out transform hover:scale-105"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              DONATE NOW
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-white hover:text-brand-gold hover:bg-brand-brown-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-gold"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} bg-brand-brown-dark`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-brand-gold hover:bg-brand-brown-light transition font-heading"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}