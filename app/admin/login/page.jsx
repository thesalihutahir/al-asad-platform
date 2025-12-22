"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Import the real Auth hook we just created
import { useAuth } from '@/context/AuthContext'; 

export default function AdminLoginPage() {
    const router = useRouter();
    // Get the real login function from our AuthContext
    const { login } = useAuth(); 
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // REAL FIREBASE LOGIN
            // This attempts to sign in with the email/password you created in the Console
            await login(email, password);
            
            // If successful, redirect to dashboard
            router.push('/admin/dashboard');
        } catch (err) {
            console.error(err);
            // Specific Error Handling
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Incorrect email or password.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Try again later.');
            } else {
                setError('Failed to login. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f0] relative overflow-hidden px-4">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10">
                <Image src="/overlay.jpg" alt="Pattern" fill className="object-cover" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative z-10 border border-[#d17600]/20">
                
                {/* Logo Area */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-32 h-12">
                        <Image src="/headerlogo.svg" alt="Al-Asad Logo" fill className="object-contain" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="font-agency text-3xl text-[#432e16] mb-1">
                        Admin Portal
                    </h1>
                    <p className="font-lato text-sm text-gray-500">
                        Secure access for foundation staff only.
                    </p>
                </div>

                {/* Error Message Display */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-[#432e16] uppercase tracking-wider mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d17600]/50 focus:bg-white transition-all text-[#432e16]"
                                placeholder="name@alasadfoundation.org"
                            />
                            {/* Icon */}
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-[#432e16] uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d17600]/50 focus:bg-white transition-all text-[#432e16]"
                                placeholder="••••••••"
                            />
                            {/* Icon */}
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-agency text-xl tracking-wide text-white transition-all shadow-lg flex justify-center items-center ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#432e16] hover:bg-[#d17600]'}`}
                    >
                        {loading ? (
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <Link href="/" className="text-xs text-gray-400 hover:text-[#d17600] transition-colors flex items-center justify-center gap-1">
                        ← Back to Website
                    </Link>
                </div>

            </div>
            
            <p className="mt-6 text-[10px] text-gray-400 font-mono z-10">
                Al-Asad Education Foundation • Admin System v1.0
            </p>

        </div>
    );
}
