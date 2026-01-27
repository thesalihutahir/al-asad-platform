"use client";

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AccessRestricted({ role, message = "You do not have permission to view this page." }) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-agency text-brand-brown-dark mb-2">Access Restricted</h1>
            <p className="text-gray-500 max-w-md mb-8">{message}</p>
            
            {role && (
                <div className="bg-gray-100 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-500 mb-8">
                    Your Role: {role.replace('_', ' ')}
                </div>
            )}

            <Link href="/admin/dashboard" className="flex items-center gap-2 px-6 py-3 bg-brand-brown-dark text-white rounded-xl font-bold hover:bg-brand-gold transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
        </div>
    );
}
