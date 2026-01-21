"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db, storage } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
    ArrowLeft, Plus, Trash2, Loader2, UploadCloud, 
    User, BadgeCheck, X, Pencil, Camera, Users 
} from 'lucide-react';

export default function TeamSettingsPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Add New Form State
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', role: '', isLead: false });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch Members
    useEffect(() => {
        const q = query(collection(db, "team_members"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Form Handlers
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role || !imageFile) {
            alert("Name, Role, and Image are required.");
            return;
        }
        setIsSubmitting(true);
        try {
            // Upload Image
            const storageRef = ref(storage, `team/${Date.now()}_${imageFile.name}`);
            await uploadBytesResumable(storageRef, imageFile);
            const imageUrl = await getDownloadURL(storageRef);

            await addDoc(collection(db, "team_members"), {
                ...formData,
                image: imageUrl,
                createdAt: serverTimestamp()
            });

            // Reset Form
            setShowForm(false);
            setFormData({ name: '', role: '', isLead: false });
            setImageFile(null);
            setImagePreview(null);
        } catch (error) {
            console.error("Error adding member:", error);
            alert("Failed to add member.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this team member? This action cannot be undone.")) {
            await deleteDoc(doc(db, "team_members", id));
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-gold" /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings" className="p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-brand-brown-dark">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-4xl text-brand-brown-dark leading-none mb-1">Team Directory</h1>
                        <p className="font-lato text-sm text-gray-500">Manage profiles displayed on the public "Our Team" page.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${showForm ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-brand-gold text-white hover:bg-brand-brown-dark'}`}
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? "Cancel Adding" : "Add New Member"}
                </button>
            </div>

            {/* --- ADD MEMBER FORM (MODERN CARD) --- */}
            {showForm && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-300 relative overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sand/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <h2 className="font-agency text-2xl text-brand-brown-dark mb-6 relative z-10">New Team Member Profile</h2>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                        
                        {/* Left: Image Upload */}
                        <div className="lg:col-span-3 flex flex-col items-center">
                            <div className="relative group cursor-pointer">
                                <div className={`w-32 h-32 rounded-2xl overflow-hidden border-4 transition-all shadow-sm ${imagePreview ? 'border-brand-gold' : 'border-gray-100 bg-gray-50'}`}>
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <Camera className="w-8 h-8 mb-2 opacity-50" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Upload Photo</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm">
                                    Change Image
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-3 text-center px-4">Recommended: Square JPG/PNG, Max 2MB.</p>
                        </div>

                        {/* Right: Inputs */}
                        <div className="lg:col-span-9 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none font-bold text-gray-700 placeholder-gray-400" 
                                            placeholder="e.g. Dr. Amina Yusuf" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Job Title / Role</label>
                                    <input 
                                        type="text" 
                                        value={formData.role} 
                                        onChange={(e) => setFormData({...formData, role: e.target.value})} 
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none font-bold text-gray-700 placeholder-gray-400" 
                                        placeholder="e.g. Head of Operations" 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-brand-sand/20 transition-colors border border-transparent hover:border-brand-gold/30">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isLead ? 'bg-brand-gold border-brand-gold' : 'bg-white border-gray-300'}`}>
                                        {formData.isLead && <BadgeCheck className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input type="checkbox" checked={formData.isLead} onChange={(e) => setFormData({...formData, isLead: e.target.checked})} className="hidden" />
                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Mark as Team Lead</span>
                                </label>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="px-8 py-3 bg-brand-brown-dark text-white rounded-xl font-bold text-sm hover:bg-brand-gold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* --- MEMBERS GRID --- */}
            {members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <div key={member.id} className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300 flex items-start gap-5 relative">
                            
                            {/* Avatar */}
                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                <Image src={member.image || "/fallback.webp"} alt={member.name} fill className="object-cover" />
                            </div>

                            {/* Info */}
                            <div className="flex-grow min-w-0 pt-1">
                                <h3 className="font-agency text-xl text-brand-brown-dark truncate leading-tight mb-1 group-hover:text-brand-gold transition-colors">{member.name}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide truncate">{member.role}</p>
                                
                                {member.isLead && (
                                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-brand-sand/40 text-brand-brown-dark text-[9px] font-bold uppercase tracking-wider rounded-md">
                                        <BadgeCheck className="w-3 h-3 text-brand-gold" /> Team Lead
                                    </span>
                                )}
                            </div>

                            {/* Floating Actions (Visible on Hover/Focus) */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                                <Link href={`/admin/settings/team/edit/${member.id}`}>
                                    <button className="p-1.5 text-gray-400 hover:text-brand-brown-dark hover:bg-gray-100 rounded-md transition-colors" title="Edit Profile">
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                </Link>
                                <button onClick={() => handleDelete(member.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete Profile">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !showForm && (
                    <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl text-center">
                        <div className="w-16 h-16 bg-brand-sand/20 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-brand-gold opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400 mb-2">No Team Members Yet</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">Start building your team by adding profiles. They will appear on the public "About Us" page.</p>
                        <button onClick={() => setShowForm(true)} className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors">
                            Add First Member
                        </button>
                    </div>
                )
            )}
        </div>
    );
}