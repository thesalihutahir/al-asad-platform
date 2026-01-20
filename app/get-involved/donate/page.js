"use client";

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

// Load the form ONLY on the client to avoid "window is not defined" error
const DonationForm = dynamic(() => import('@/components/DonationForm'), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
        </div>
    ),
});

export default function DonatePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-lato">
            <Header />
            <main className="flex-grow pt-10 pb-20">
                <DonationForm />
            </main>
            <Footer />
        </div>
    );
}