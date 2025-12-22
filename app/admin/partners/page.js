"use client";

import React, { useState } from 'react';
import { 
    Search, 
    Briefcase,
    Building2,
    Mail,
    MessageSquare,
    ExternalLink
} from 'lucide-react';

export default function ManagePartnersPage() {

    // Mock Data
    const [inquiries, setInquiries] = useState([
        { 
            id: 1, 
            org: "Dangote Foundation", 
            contactPerson: "Aliyu Bello",
            email: "contact@dangote.com",
            type: "Sponsorship", 
            message: "We are interested in sponsoring the upcoming borehole project in Katsina rural area...",
            date: "21 Dec 2024", 
            status: "New"
        },
        { 
            id: 2, 
            org: "Future Leaders Academy", 
            contactPerson: "Mrs. Sarah Johnson",
            email: "sarah@fleaders.edu.ng",
            type: "Academic Collaboration", 
            message: "Proposing a joint teacher training workshop for STEM education.",
            date: "19 Dec 2024", 
            status: "Read"
        },
    ]);

    return (
        <div className="space-y-6">
            
            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Partnership Inquiries</h1>
                    <p className="font-lato text-sm text-gray-500">Corporate proposals and collaboration requests.</p>
                </div>
            </div>

            {/* 2. SEARCH */}
            <div className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search organizations..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                    />
                </div>
            </div>

            {/* 3. INQUIRIES LIST */}
            <div className="space-y-4">
                {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row gap-6">
                            
                            {/* Icon & Basic Info */}
                            <div className="flex items-start gap-4 md:w-1/3">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-agency text-xl text-brand-brown-dark">{inq.org}</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                        <Briefcase className="w-3 h-3" />
                                        {inq.contactPerson}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                        <Mail className="w-3 h-3" />
                                        <a href={`mailto:${inq.email}`} className="hover:text-brand-gold">{inq.email}</a>
                                    </div>
                                </div>
                            </div>

                            {/* Message Preview */}
                            <div className="flex-grow md:border-l border-gray-100 md:pl-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-brand-sand/30 text-brand-brown-dark px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">
                                        {inq.type}
                                    </span>
                                    <span className="text-xs text-gray-400">{inq.date}</span>
                                </div>
                                <div className="flex gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        "{inq.message}"
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col justify-center gap-2 md:pl-4">
                                <a href={`mailto:${inq.email}`} className="px-4 py-2 bg-brand-gold text-white text-xs font-bold rounded-lg hover:bg-brand-brown-dark transition-colors text-center">
                                    Reply via Email
                                </a>
                                <button className="px-4 py-2 border border-gray-200 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                    Mark as Read
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
