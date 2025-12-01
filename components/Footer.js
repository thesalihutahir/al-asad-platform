"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-brown-dark text-white font-body">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* 1. Logo */}
        <div className="mb-6">
          <Link href="/">
              <img 
                  src="/footerlogo.png" 
                  alt="Al-Asad Education Foundation Logo" 
                  className="h-16 w-auto" 
              />
          </Link>
        </div>
        
        {/* 2. Social Media Icons */}
        <div className="flex space-x-6 mb-8">
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-300 hover:text-brand-gold transition-colors">
            <Facebook size={24} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-300 hover:text-brand-gold transition-colors">
            <Twitter size={24} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-300 hover:text-brand-gold transition-colors">
            <Instagram size={24} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-300 hover:text-brand-gold transition-colors">
            <Youtube size={24} />
          </a>
        </div>
      
        {/* 3. Copyright (Full Width Separator) */}
        <div className="pt-8 border-t border-gray-700 w-full text-center">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Al-Asad Education Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
