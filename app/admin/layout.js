"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    FileText, 
    Video, 
    Mic, 
    Users, 
    Handshake, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    BookOpen
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Skip the layout for the login page specifically
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Manage Blogs', icon: FileText, href: '/admin/blogs' },
        { name: 'Manage Programs', icon: BookOpen, href: '/admin/programs' },
        { name: 'Video Library', icon: Video, href: '/admin/videos' },
        { name: 'Audio Library', icon: Mic, href: '/admin/audios' },
        { name: 'Volunteers', icon: Users, href: '/admin/volunteers' },
        { name: 'Partnerships', icon: Handshake, href: '/admin/partners' },
        { name: 'Settings', icon: Settings, href: '/admin/settings' },
    ];

    const handleLogout = () => {
        // In real app: Clear session/cookies here
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            {/* 1. MOBILE OVERLAY */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* 2. SIDEBAR NAVIGATION */}
            <aside 
                className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-brand-brown-dark text-white z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo Area */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <Image src="/headerlogo.svg" alt="Logo" fill className="object-contain brightness-0 invert" />
                        </div>
                        <span className="font-agency text-xl tracking-wide">Admin Panel</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive 
                                    ? 'bg-brand-gold text-white font-bold shadow-md' 
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-lato">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-white/10">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold">Log Out</span>
                    </button>
                </div>
            </aside>

            {/* 3. MAIN CONTENT AREA */}
            <div className="flex-grow flex flex-col min-w-0">
                
                {/* Top Mobile Header (Only visible on small screens) */}
                <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4 sticky top-0 z-30">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-agency text-lg text-brand-brown-dark">Dashboard</span>
                </header>

                {/* Page Content Rendered Here */}
                <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
                    {children}
                </main>

            </div>

        </div>
    );
}
