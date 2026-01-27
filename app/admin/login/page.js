"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth(); 

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Sign In');
    const [error, setError] = useState('');

    // Check for previous error params
    useEffect(() => {
        if (searchParams.get('error') === 'unauthorized') {
            setError("Session expired or unauthorized access.");
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStatusMessage('Authenticating...');

        try {
            // 1. Firebase Auth Login (Checks Email/Pass)
            const userCredential = await login(email, password);
            const user = userCredential.user;

            // 2. Verification Step (Checks Firestore Permission)
            setStatusMessage('Verifying Access...');
            
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                throw new Error("NO_RECORD");
            }

            const userData = userDocSnap.data();

            if (userData.active === false) {
                throw new Error("DEACTIVATED");
            }

            if (!userData.role) {
                throw new Error("NO_ROLE");
            }

            // 3. Success - Redirect
            setStatusMessage('Access Granted');
            const nextUrl = searchParams.get('next') || '/admin/dashboard';
            router.push(nextUrl);

        } catch (err) {
            console.error("Login Error:", err);
            
            // Force logout if verification failed to prevent "half-logged-in" state
            await signOut(auth);

            if (err.message === "NO_RECORD" || err.message === "NO_ROLE") {
                setError("This account is not authorized for admin access.");
            } else if (err.message === "DEACTIVATED") {
                setError("Your admin access has been disabled. Contact support.");
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
                setError('Incorrect email or password.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Try again later.');
            } else {
                setError('Connection failed. Please try again.');
            }
            setStatusMessage('Sign In');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5f0] relative overflow-hidden px-4">

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-25">
                <Image src="/images/chairman/sheikh1.webp" alt="Pattern" fill className="object-cover" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative z-10 border border-[#d17600]/20">

                <div className="flex justify-center mb-8">
                    <div className="relative w-40 h-16">
                        <Image src="/headerlogo.svg" alt="Al-Asad Logo" fill className="object-contain" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="font-agency text-3xl text-[#432e16] mb-1">Admin Portal</h1>
                    <p className="font-lato text-sm text-gray-500">Secure access for authorized staff only.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-[#432e16] uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <input 
                                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d17600]/50 focus:bg-white transition-all text-[#432e16]"
                                placeholder="name@alasadfoundation.org"
                            />
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#432e16] uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d17600]/50 focus:bg-white transition-all text-[#432e16]"
                                placeholder="••••••••"
                            />
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d17600] transition-colors p-1" tabIndex="-1">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className={`w-full py-3 rounded-xl font-agency text-xl tracking-wide text-white transition-all shadow-lg flex justify-center items-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#432e16] hover:bg-[#d17600]'}`}
                    >
                        {loading && <Loader2 className="animate-spin h-5 w-5 text-white" />}
                        {statusMessage}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <Link href="/" className="text-xs text-gray-400 hover:text-[#d17600] transition-colors flex items-center justify-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Back to Website
                    </Link>
                </div>
            </div>

            <p className="mt-6 text-[10px] text-gray-400 font-mono z-10 opacity-60">
                System v1.0 • Protected by SecureGuard
            </p>
        </div>
    );
}