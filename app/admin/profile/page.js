"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';
import { storage, db, auth } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { sendPasswordResetEmail } from 'firebase/auth';
import { User, Mail, Camera, Save, Loader2, Lock, Shield } from 'lucide-react';
import { logAudit } from '@/lib/audit';

export default function AdminProfilePage() {
    const { user, updateUserProfile } = useAuth();
    const { showSuccess } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        displayName: user?.displayName || '',
        photoURL: user?.photoURL || ''
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.photoURL || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let photoURL = formData.photoURL;

            // Upload Image if changed
            if (imageFile) {
                const storageRef = ref(storage, `admins/${user.uid}_${Date.now()}`);
                await uploadBytesResumable(storageRef, imageFile);
                photoURL = await getDownloadURL(storageRef);
            }

            // Update Firestore
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                displayName: formData.displayName,
                photoURL: photoURL
            });

            // Update Auth Context
            await updateUserProfile({
                displayName: formData.displayName,
                photoURL: photoURL
            });

            await logAudit({
                action: 'PROFILE_UPDATED',
                entityType: 'admin',
                entityId: user.uid,
                summary: 'Admin updated their profile details',
                actor: user
            });

            showSuccess({ title: 'Profile Updated', message: 'Your details have been saved successfully.' });

        } catch (error) {
            console.error(error);
            alert("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, user.email);
            showSuccess({ title: 'Email Sent', message: `Password reset link sent to ${user.email}` });
        } catch (error) {
            alert("Failed to send reset email.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 p-4 sm:p-6 font-lato">
            <h1 className="text-3xl font-agency font-bold text-brand-brown-dark mb-2">My Profile</h1>
            <p className="text-gray-500 text-sm mb-8">Manage your admin account settings</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 mb-6 group cursor-pointer">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-100 relative">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Profile" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400"><User className="w-12 h-12" /></div>
                            )}
                        </div>
                        <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs">
                            <Camera className="w-6 h-6 mb-1" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800">{user?.displayName}</h2>
                    <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-sand/20 rounded-full text-brand-brown-dark text-xs font-bold uppercase tracking-wider">
                        <Shield className="w-3 h-3" />
                        {user?.role?.replace('_', ' ')}
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><User className="w-5 h-5 text-brand-gold" /> Personal Details</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Display Name</label>
                                <input 
                                    type="text" 
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all font-bold text-gray-800"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    value={user?.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-sm text-gray-500 font-medium cursor-not-allowed"
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed directly.</p>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="px-8 py-3 bg-brand-brown-dark text-white rounded-xl font-bold text-sm hover:bg-brand-gold transition-colors flex items-center gap-2 shadow-lg"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    </form>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2"><Lock className="w-4 h-4 text-brand-gold" /> Security</h3>
                            <p className="text-xs text-gray-500">Update your password to keep your account secure.</p>
                        </div>
                        <button 
                            type="button"
                            onClick={handlePasswordReset}
                            className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                        >
                            Reset Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
