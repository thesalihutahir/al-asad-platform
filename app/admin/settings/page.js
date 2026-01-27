"use client";

import React from 'react';
import Link from 'next/link';
import { 
    Users, 
    Globe, 
    ChevronRight, 
    Briefcase,
    LayoutTemplate,
    ShieldAlert,
    Link as LinkIcon
} from 'lucide-react';

export default function SettingsPage() {

    // Configuration Options
    const settingsOptions = [
        // 1. Contact Info (Existing)
        {
            title: "Contact Information",
            description: "Update office address, phone numbers, emails, and social media links.",
            icon: Globe,
            href: "/admin/settings/contact",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        // 2. Media Team (Existing)
        {
            title: "Media Team Manager",
            description: "Add, edit, or remove team members displayed on the contact page.",
            icon: Users,
            href: "/admin/settings/team",
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        // 3. Leadership Team (New)
        {
            title: "Leadership Directory",
            description: "Manage executive profiles, titles, and visibility for the 'About Us' leadership section.",
            icon: Briefcase,
            href: "/admin/settings/leadership",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        // 4. Homepage Controls (New)
        {
            title: "Homepage Editor",
            description: "Customize hero section, featured content, tickers, and section visibility.",
            icon: LayoutTemplate,
            href: "/admin/settings/homepage",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        // 5. Security & Admin (Updated to point to Admin Users)
        {
            title: "Admin Users & Roles",
            description: "Manage system administrators, assign roles, and control access levels.",
            icon: ShieldAlert,
            href: "/admin/settings/admin-users",
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
        // 6. Integrations (New)
        {
            title: "Integrations",
            description: "Connect Analytics, Meta Pixel, Email services, and Broadcast links.",
            icon: LinkIcon,
            href: "/admin/settings/integrations",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        }
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12 font-lato">

            {/* HEADER */}
            <div>
                <h1 className="font-agency text-3xl text-brand-brown-dark mb-2">Settings & Configuration</h1>
                <p className="font-lato text-sm text-gray-500">Manage global website content, structure, and system preferences.</p>
            </div>

            {/* NAVIGATION GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settingsOptions.map((option, idx) => {
                    const Icon = option.icon;
                    return (
                        <Link key={idx} href={option.href} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-gold/30 transition-all flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${option.bg} ${option.color}`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-agency text-xl text-brand-brown-dark mb-1 group-hover:text-brand-gold transition-colors">
                                    {option.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {option.description}
                                </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-gold transition-colors" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}