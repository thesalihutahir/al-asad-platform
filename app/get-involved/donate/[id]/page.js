"use client";

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';

// Dynamically import the wizard with ssr: false
const FundDonationWizard = dynamic(() => import('@/components/FundDonationWizard'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader size="lg" />
        </div>
    ),
});

export default function DonateFundPage() {
    const params = useParams();
    const id = params?.id;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-lato">
            <Header />
            <main className="flex-grow pt-24 pb-20 px-4">
                {id ? <FundDonationWizard fundId={id} /> : <Loader size="lg" />}
            </main>
            <Footer />
        </div>
    );
}
