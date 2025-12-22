"use client";

import Link from 'next/link';
import { Menu, Search, X, ChevronDown, ChevronUp } from 'lucide-react'; 
import { useState } from 'react';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';

const ICON_BG_COLOR = 'bg-[#432e16]'; 
const BRAND_GOLD = '#d17600'; 

// Updated Sitemap with Sub-pages
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { 
    name: 'Programs', 
    href: '/programs',
    children: [
      { name: 'Educational Support', href: '/programs/educational-support' },
      { name: 'Community Development', href: '/programs/community-development' },
      { name: 'Training & Innovation', href: '/programs/training-and-innovation' },
    ]
  },
  { 
    name: 'Multimedia', 
    href: '/media',
    children: [
      { name: 'Videos', href: '/media/videos' },
      { name: 'Audios', href: '/media/audios' },
      { name: 'Podcasts', href: '/media/podcasts' },
      { name: 'eBooks', href: '/media/ebooks' },
      { name: 'Photo Gallery', href: '/media/gallery' },
    ]
  },
  { 
    name: 'Blogs', 
    href: '/blogs',
    children: [
      { name: 'Articles', href: '/blogs/articles' },
      { name: 'News & Updates', href: '/blogs/updates' },
      { name: 'Research', href: '/blogs/research-and-publications' },
    ]
  },
  { 
    name: 'Get Involved', 
    href: '/get-involved',
    children: [
      { name: 'Donate', href: '/get-involved/donate' },
      { name: 'Volunteer', href: '/get-involved/volunteer' },
      { name: 'Partner With Us', href: '/get-involved/partner-with-us' },
    ]
  },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State to track which menu item is currently expanded
  const [expandedItem, setExpandedItem] = useState(null);
  const pathname = usePathname();

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setExpandedItem(null); // Reset expansions when closing
  };

  const toggleExpand = (name) => {
    if (expandedItem === name) {
      setExpandedItem(null);
    } else {
      setExpandedItem(name);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white font-lato shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LEFT SIDE: Menu Icon and Logo Container - PRESERVED EXACTLY */}
          <div className="flex items-center space-x-3 sm:space-x-4"> 

            {/* Menu Icon */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-3 rounded-full ${ICON_BG_COLOR} text-white focus:outline-none`}
              aria-expanded={isSidebarOpen}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Logo - PRESERVED EXACTLY */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/headerlogo.svg" 
                alt="Al-Asad Education Foundation Logo" 
                className="h-16 w-auto object-contain max-h-full" 
                sizes="(max-width: 640px) 70vw, 30vw"
                priority 
              />
            </Link>
          </div>

          <div className="flex-shrink-0">
             {/* Empty Placeholder */}
          </div>

        </div>
      </div>

      {/* Overlay Backdrop */}
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      />

      {/* Sidebar Panel - BRAND GOLD WITH OPACITY */}
      <div 
        style={{ backgroundColor: BRAND_GOLD, '--tw-bg-opacity': isSidebarOpen ? '0.95' : '0' }}
        className={`fixed top-0 left-0 w-72 max-w-full h-full text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full">

          {/* Header Bar with Close Button */}
          <div className="p-4 flex justify-between items-center border-b border-gray-100 border-opacity-30">
            <span className="font-agency text-lg tracking-wide opacity-80 pl-2">Menu</span>
            <button 
              onClick={closeSidebar} 
              className={`p-2 rounded-full text-white hover:text-[#432e16] hover:bg-white focus:outline-none transition-colors`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="p-4 flex-grow overflow-y-auto space-y-4">

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-3 border-none rounded-xl focus:ring-2 focus:ring-white outline-none text-base text-black"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9a9a9a]" />
            </div>

            {/* Integrated Navigation Links */}
            <nav className="space-y-2 border-t border-gray-100 border-opacity-30 pt-4">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    {/* Main Link */}
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex-grow px-3 py-2 rounded-md text-base font-lato font-medium text-white hover:bg-[#432e16] transition ${pathname === item.href ? 'bg-[#432e16]' : ''}`}
                    >
                      {item.name}
                    </Link>

                    {/* Expand Toggle Button (Only if children exist) */}
                    {item.children && (
                      <button 
                        onClick={() => toggleExpand(item.name)}
                        className="p-2 ml-1 rounded-md hover:bg-[#432e16] transition focus:outline-none"
                      >
                        {expandedItem === item.name ? (
                          <ChevronUp className="w-5 h-5 text-white" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white opacity-70" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Sub-menu (Conditional Render) */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedItem === item.name ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    {item.children?.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={closeSidebar}
                        className="block pl-8 pr-3 py-2 text-sm text-white/90 hover:text-white hover:bg-[#432e16]/50 rounded-md border-l-2 border-white/20 ml-3 transition"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

          </div>

          {/* Footer of Sidebar (Admin Login Hidden Here) */}
          <Link href="/admin/login" onClick={closeSidebar}>
            <div className="p-4 border-t border-gray-100 border-opacity-30 text-xs text-white opacity-60 hover:opacity-100 font-lato text-center transition-opacity">
              Al-Asad Education Foundation
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
