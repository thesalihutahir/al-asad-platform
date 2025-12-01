// app/donate/page.jsx
"use client";

import React, { useState } from 'react';
import { Heart, DollarSign, Banknote, Users, CheckCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define the available donation options and amounts
const DONATION_OPTIONS = [
    { title: "Sponsor a Student", amount: 15000, description: "Covers one student's annual tuition and supplies." },
    { title: "Monthly Sustainer", amount: 5000, description: "Provides reliable monthly support for operational costs." },
    { title: "Qur'an Project", amount: 10000, description: "Contributes to the printing and distribution of Islamic literature." },
    { title: "General Fund", amount: 2500, description: "Allocated where the need is greatest for emergency aid." },
];

export default function DonatePage() {
    const [selectedAmount, setSelectedAmount] = useState(15000);
    const [isRecurring, setIsRecurring] = useState(false);
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Handles the amount change, preferring a preset amount
    const handleAmountChange = (amount) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    // Handles custom amount input
    const handleCustomChange = (e) => {
        const value = e.target.value;
        setCustomAmount(value);
        setSelectedAmount(parseInt(value) || 0);
    };

    // Simulates payment processing
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setIsSuccess(false);

        const finalAmount = selectedAmount;

        // --- Simulated Payment Gateway Interaction ---
        setTimeout(() => {
            console.log(`Processing donation of ₦${finalAmount.toLocaleString()} (${isRecurring ? 'Recurring' : 'One-time'})`);
            setLoading(false);
            setIsSuccess(true);
            // In a real app, this would involve integrating with Paystack, Flutterwave, etc.
        }, 2000);
    };

    const currencyCode = '₦'; // Nigerian Naira (Naira symbol)

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow pt-10 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-brown-dark mb-3">
                            Invest in a Life. Donate Now.
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Your contribution directly funds education, essential resources, and community resilience.
                        </p>
                    </div>

                    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-100">
                        
                        {isSuccess ? (
                            <div className="text-center py-12">
                                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6 animate-pulse" />
                                <h2 className="text-3xl font-bold text-gray-800">Success! Thank You!</h2>
                                <p className="text-lg text-gray-600 mt-3">
                                    May Allah reward your generosity. Your donation of {currencyCode}{selectedAmount.toLocaleString()} has been processed and will immediately go to work.
                                </p>
                                <Link href="/" className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition">
                                    Return to Homepage
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                
                                {/* 1. Donation Frequency */}
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Donation Type
                                    </h2>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsRecurring(false)}
                                            className={`flex-1 py-3 px-6 rounded-xl text-lg font-bold transition-all border-2 ${
                                                !isRecurring 
                                                ? 'bg-brand-gold text-white border-brand-gold shadow-md' 
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-brand-gold/50'
                                            }`}
                                        >
                                            One-Time
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsRecurring(true)}
                                            className={`flex-1 py-3 px-6 rounded-xl text-lg font-bold transition-all border-2 ${
                                                isRecurring 
                                                ? 'bg-brand-gold text-white border-brand-gold shadow-md' 
                                                : 'bg-white text-gray-600 border-gray-300 hover:border-brand-gold/50'
                                            }`}
                                        >
                                            Monthly Recurring
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Preset Amounts */}
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Banknote className="w-5 h-5 text-green-600" /> Choose Amount
                                    </h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {DONATION_OPTIONS.map((option) => (
                                            <button
                                                key={option.amount}
                                                type="button"
                                                onClick={() => handleAmountChange(option.amount)}
                                                className={`p-4 rounded-xl text-center border-2 transition-all shadow-sm ${
                                                    selectedAmount === option.amount && customAmount === ''
                                                    ? 'bg-green-100 border-green-600 ring-4 ring-green-200'
                                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                }`}
                                            >
                                                <div className="text-sm font-semibold text-gray-700 mb-1">{option.title}</div>
                                                <div className="text-xl font-bold text-green-700">{currencyCode}{option.amount.toLocaleString()}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. Custom Amount Input */}
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-brand-gold" /> Or Enter Custom Amount
                                    </h2>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-500">{currencyCode}</span>
                                        <input
                                            type="number"
                                            placeholder="5000"
                                            value={customAmount}
                                            onChange={handleCustomChange}
                                            onFocus={() => setSelectedAmount(0)} // Clear selected preset on focus
                                            min="100"
                                            className={`w-full py-4 pl-12 pr-6 text-2xl font-bold rounded-xl border-2 transition ${
                                                customAmount !== '' 
                                                ? 'border-brand-gold ring-4 ring-brand-gold/20' 
                                                : 'border-gray-300 focus:border-indigo-500'
                                            } focus:outline-none`}
                                            aria-label="Custom Donation Amount"
                                        />
                                    </div>
                                </div>

                                {/* 4. Donor Information (Simplified) */}
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-indigo-600" /> Your Details
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Full Name (Optional)" className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                        <input type="email" placeholder="Email Address (Required for Receipt)" required className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>

                                {/* 5. Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || selectedAmount < 100}
                                    className={`w-full flex items-center justify-center px-6 py-4 text-2xl font-bold rounded-xl text-white transition-all shadow-xl disabled:bg-gray-400 ${
                                        (loading || selectedAmount < 100) ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700 transform hover:scale-[1.01]'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Heart className="w-6 h-6 mr-3 fill-white" /> 
                                            Donate {currencyCode}{selectedAmount.toLocaleString()} {isRecurring && 'Monthly'}
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-sm text-gray-500 mt-4">
                                    All transactions are secured via a third-party payment processor.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}