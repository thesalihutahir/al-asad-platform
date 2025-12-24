"use client";

import Link from 'next/link';
import { 
  Menu, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  Home,
  Info,
  BookOpen,
  PlayCircle,
  FileText,
  Heart,
  Mail,
  LogIn
} from 'lucide-react'; 
import { useState } from 'react';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation';

const SIDEBAR_BG = 'bg-[#432e16]'; // Brand Brown
const ACCENT_COLOR = 'text-[#d17600]'; // Brand Gold

// Sitemap
const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About Us', href: '/about', icon: Info },
  { 
    name: 'Programs', 
    href: '/programs',
    icon: BookOpen,
    children: [
      { name: 'Educational Support', href: '/programs/educational-support' },
      { name: 'Community Development', href: '/programs/community-development' },
      { name: 'Training & Innovation', href: '/programs/training-and-innovation' },
    ]
  },
  { 
    name: 'Multimedia', 
    href: '/media',
    icon: PlayCircle,
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
    icon: FileText,
    children: [
      { name: 'Articles', href: '/blogs/articles' },
      { name: 'News & Updates', href: '/blogs/updates' },
      { name: 'Research', href: '/blogs/research-and-publications' },
    ]
  },
  { 
    name: 'Get Involved', 
    href: '/get-involved',
    icon: Heart,
    children: [
      { name: 'Donate', href: '/get-involved/donate' },
      { name: 'Volunteer', href: '/get-involved/volunteer' },
      { name: 'Partner With Us', href: '/get-involved/partner-with-us' },
    ]
  },
  { name: 'Contact', href: '/contact', icon: Mail },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const pathname = usePathname();

  const toggleExpand = (name) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  return (
    <>
      {/* ==================================================================
          1. DESKTOP VIEW (Hidden on Mobile)
          - Fixed Left Sidebar
          - Fixed Top Right Logo
      ================================================================== */}
      
      {/* A. Fixed Logo (Top Right) */}
      <div className="hidden lg:block fixed top-6 right-8 z-50">
        <Link href="/" className="block relative w-24 h-24 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border-4 border-[#d17600] hover:scale-105 transition-transform duration-300">
           <Image 
             src="/headerlogo.svg" 
             alt="Logo" 
             fill 
             className="object-contain p-1" 
             priority 
           />
        </Link>
      </div>

      {/* B. Fixed Left Sidebar Navigation */}
      <aside className={`hidden lg:flex fixed top-0 left-0 h-screen w-72 ${SIDEBAR_BG} text-white z-40 flex-col shadow-2xl overflow-y-auto font-lato`}>
        
        {/* Sidebar Header */}
        <div className="p-8 border-b border-white/10">
            <h1 className="font-agency text-2xl tracking-widest text-[#d17600] uppercase mb-1">Al-Asad</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Education Foundation</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.children && pathname.startsWith(item.href));
            const isExpanded = expandedItem === item.name;

            return (
              <div key={item.name} className="flex flex-col">
                {/* Main Link Item */}
                <div 
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    isActive 
                    ? 'bg-[#d17600] text-white font-bold shadow-lg transform translate-x-1' 
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => item.children ? toggleExpand(item.name) : null}
                >
                  <Link 
                    href={item.children ? '#' : item.href} 
                    className="flex items-center gap-3 flex-grow"
                    onClick={(e) => item.children && e.preventDefault()}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-[#d17600] transition-colors'}`} />
                    <span className="text-sm tracking-wide">{item.name}</span>
                  </Link>
                  
                  {/* Dropdown Arrow for Parents */}
                  {item.children && (
                    <ChevronRight 
                      className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-white' : 'text-white/30'}`} 
                    />
                  )}
                </div>

                {/* Sub-menu (Accordion Style) */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded ? 'max-h-96 opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-4 pl-4 border-l border-white/10 space-y-1">
                    {item.children?.map((child) => (
                      <Link 
                        key={child.name} 
                        href={child.href}
                        className={`block px-4 py-2 text-xs rounded-lg transition-colors ${
                          pathname === child.href 
                          ? 'text-[#d17600] font-bold bg-white/5' 
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-white/10">
            <Link href="/admin/login" className="flex items-center gap-3 text-xs text-white/30 hover:text-[#d17600] transition-colors">
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
            </Link>
            <div className="mt-4 text-[10px] text-white/20">
                © {new Date().getFullYear()} Al-Asad Foundation.
            </div>
        </div>
      </aside>


      {/* ==================================================================
          2. MOBILE VIEW (Original Layout - Unchanged)
      ================================================================== */}
      
      <header className="sticky top-0 z-50 bg-white font-lato shadow-sm lg:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-20">
            
            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 rounded-full bg-[#432e16] text-white focus:outline-none hover:bg-[#d17600] transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo (Center/Right on Mobile) */}
            <Link href="/" className="flex items-center">
              <Image 
                src="/headerlogo.svg" 
                alt="Logo" 
                width={160} 
                height={60} 
                className="h-12 w-auto object-contain"
                priority 
              />
            </Link>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <div className="relative w-80 max-w-[85%] bg-[#432e16] text-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#3a2813]">
                <span className="font-agency text-2xl tracking-wide">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white/70 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex-grow overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.name} className="flex flex-col">
                      <div 
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 cursor-pointer"
                        onClick={() => toggleExpand(item.name)}
                      >
                        <Link 
                          href={item.href} 
                          onClick={() => !item.children && setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 flex-grow"
                        >
                          <Icon className="w-5 h-5 opacity-70" />
                          <span className="text-sm font-bold">{item.name}</span>
                        </Link>
                        {item.children && (
                          <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${expandedItem === item.name ? 'rotate-180' : ''}`} />
                        )}
                      </div>

                      {/* Mobile Submenu */}
                      {item.children && expandedItem === item.name && (
                        <div className="bg-black/20 rounded-xl mt-1 mb-2 py-2">
                          {item.children.map((child) => (
                            <Link 
                              key={child.name} 
                              href={child.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block px-12 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
