"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db, storage } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
    ArrowLeft, Plus, Trash2, Loader2, UploadCloud, 
    User, BadgeCheck, X, Pencil, Camera, Users, Check, ChevronDown, Eye 
} from 'lucide-react';

export default function TeamSettingsPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // NEW DATA STRUCTURE
    const [formData, setFormData] = useState({
        name: '',
        primaryRole: 'Esteemed Member',
        responsibilities: [] // Array of strings
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // --- CONSTANTS ---
    const PRIMARY_ROLES = [
        "Media Team Lead",
        "Operations Coordinator",
        "Content Manager",
        "Public Relations Officer",
        "Livestream Lead",
        "Creative Director",
        "Esteemed Member" // Default fallback
    ];

    const OPERATIONAL_RESPONSIBILITIES = [
        "Livestream Operator", "Photographer", "Videographer", "Video Editor",
        "Audio & Sound Manager", "Graphic Designer", "Content Writer",
        "Translator / Language Editor", "Equipment & Assets Officer",
        "Media Quality Reviewer", "Media Archivist", "Web Content Admin",
        "Web Platform Manager"
    ];

    // --- FETCH MEMBERS ---
    useEffect(() => {
        const q = query(collection(db, "team_members"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- HANDLERS ---

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const toggleResponsibility = (role) => {
        setFormData(prev => {
            const exists = prev.responsibilities.includes(role);
            if (exists) {
                return { ...prev, responsibilities: prev.responsibilities.filter(r => r !== role) };
            } else {
                return { ...prev, responsibilities: [...prev.responsibilities, role] };
            }
        });
    };

    // Check if role is taken (excluding "Esteemed Member")
    const isRoleTaken = (role) => {
        if (role === "Esteemed Member") return false;
        const takenBy = members.find(m => m.primaryRole === role);
        return takenBy ? takenBy.name : false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert("Name is required.");
            return;
        }
        if (formData.responsibilities.length === 0) {
            alert("Please select at least one operational responsibility.");
            return;
        }

        setIsSubmitting(true);
        try {
            let imageUrl = "/fallback.webp"; // Default Fallback

            if (imageFile) {
                const storageRef = ref(storage, `team/${Date.now()}_${imageFile.name}`);
                await uploadBytesResumable(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            await addDoc(collection(db, "team_members"), {
                ...formData,
                image: imageUrl,
                createdAt: serverTimestamp()
            });

            // Reset
            setShowForm(false);
            setFormData({ name: '', primaryRole: 'Esteemed Member', responsibilities: [] });
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
        <div className="max-w-7xl mx-auto pb-20 px-4">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings" className="p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-brand-brown-dark">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-4xl text-brand-brown-dark leading-none mb-1">Team Directory</h1>
                        <p className="font-lato text-sm text-gray-500">Manage structure, roles, and responsibilities.</p>
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

            {/* --- ADD MEMBER FORM --- */}
            {showForm && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
                    
                    {/* LEFT: FORM INPUTS */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sand/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <h2 className="font-agency text-2xl text-brand-brown-dark mb-6 relative z-10">New Team Member Profile</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            
                            {/* 1. Name & Photo */}
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <div className="relative group cursor-pointer flex-shrink-0 mx-auto sm:mx-0">
                                    <div className={`w-28 h-28 rounded-2xl overflow-hidden border-4 transition-all shadow-sm ${imagePreview ? 'border-brand-gold' : 'border-gray-100 bg-gray-50'}`}>
                                        {imagePreview ? (
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                <Camera className="w-6 h-6 mb-1 opacity-50" />
                                                <span className="text-[9px] font-bold uppercase tracking-wider">Photo</span>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>

                                <div className="flex-grow w-full">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Full Name <span className="text-red-500">*</span></label>
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
                                    <p className="text-[10px] text-gray-400 mt-2 ml-1">If no photo is uploaded, a default avatar will be used.</p>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* 2. Primary Role (Dropdown) */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-2 block">Primary Role (Optional)</label>
                                <div className="relative">
                                    <select 
                                        value={formData.primaryRole}
                                        onChange={(e) => setFormData({...formData, primaryRole: e.target.value})}
                                        className="w-full appearance-none bg-gray-50 border border-transparent rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-brand-brown-dark focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none cursor-pointer"
                                    >
                                        {PRIMARY_ROLES.map(role => {
                                            const takenBy = isRoleTaken(role);
                                            return (
                                                <option key={role} value={role} disabled={!!takenBy}>
                                                    {role} {takenBy ? `(Assigned to ${takenBy})` : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* 3. Operational Responsibilities (Multi-select) */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-3 block">Operational Responsibilities <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {OPERATIONAL_RESPONSIBILITIES.map((resp) => {
                                        const isSelected = formData.responsibilities.includes(resp);
                                        return (
                                            <div 
                                                key={resp}
                                                onClick={() => toggleResponsibility(resp)}
                                                className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 select-none ${
                                                    isSelected 
                                                    ? 'bg-brand-brown-dark text-white border-brand-brown-dark shadow-md' 
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-gold hover:text-brand-brown-dark'
                                                }`}
                                            >
                                                <div className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-white border-white' : 'border-gray-300'}`}>
                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brand-brown-dark"></div>}
                                                </div>
                                                {resp}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="w-full py-3.5 bg-brand-gold text-white rounded-xl font-bold text-sm hover:bg-brand-brown-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                                    {isSubmitting ? 'Saving Profile...' : 'Create Team Member'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: PREVIEW CARD */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-brand-sand/20 rounded-3xl p-6 border-2 border-dashed border-brand-gold/30 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <h3 className="font-agency text-xl text-brand-brown-dark mb-6 flex items-center gap-2 opacity-60">
                                <Eye className="w-5 h-5" /> Public Preview
                            </h3>

                            {/* THE CARD */}
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-[280px] transform hover:scale-105 transition-transform duration-300">
                                <div className="relative w-full aspect-[4/5] bg-gray-200">
                                    <Image 
                                        src={imagePreview || "/fallback.webp"} 
                                        alt="Preview" 
                                        fill 
                                        className="object-cover" 
                                    />
                                    {/* Role Badge */}
                                    {formData.primaryRole !== 'Esteemed Member' && (
                                        <div className="absolute top-3 left-3 bg-brand-gold text-white text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">
                                            {formData.primaryRole}
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 text-left">
                                    <h4 className="font-agency text-2xl text-brand-brown-dark leading-none mb-2">
                                        {formData.name || "Member Name"}
                                    </h4>
                                    
                                    {/* Responsibilities Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {formData.responsibilities.length > 0 ? (
                                            formData.responsibilities.slice(0, 3).map((r, i) => (
                                                <span key={i} className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                                    {r}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic">Responsibilities...</span>
                                        )}
                                        {formData.responsibilities.length > 3 && (
                                            <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                                                +{formData.responsibilities.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-[10px] text-gray-400 mt-6 max-w-[200px]">
                                This is how the card will appear on the public "Our Team" page.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MEMBERS GRID LIST --- */}
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
                            <p className="text-xs font-bold text-brand-gold uppercase tracking-wide truncate mb-2">
                                {member.primaryRole}
                            </p>
                            
                            {/* Mini Tags for Responsibilities */}
                            <div className="flex flex-wrap gap-1">
                                {member.responsibilities?.slice(0, 2).map((res, idx) => (
                                    <span key={idx} className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 truncate max-w-[80px]">
                                        {res}
                                    </span>
                                ))}
                                {member.responsibilities?.length > 2 && (
                                    <span className="text-[9px] text-gray-400 px-1 py-0.5">+{member.responsibilities.length - 2}</span>
                                )}
                            </div>
                        </div>

                        {/* Floating Actions */}
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

            {/* Empty State */}
            {members.length === 0 && !showForm && (
                <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-brand-sand/20 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-brand-gold opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No Team Members Yet</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">Start building your team by adding profiles.</p>
                    <button onClick={() => setShowForm(true)} className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors">
                        Add First Member
                    </button>
                </div>
            )}
        </div>
    );
}