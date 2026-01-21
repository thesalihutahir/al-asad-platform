"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db, storage } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ArrowLeft, Plus, Trash2, Loader2, Upload, BadgeCheck, X, Pencil } from 'lucide-react';

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
        if (confirm("Delete this team member?")) {
            await deleteDoc(doc(db, "team_members", id));
        }
    };

    if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>;

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Media Team Manager</h1>
                        <p className="text-gray-500 text-sm">Manage the team members displayed on the contact page.</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2 bg-brand-gold text-white rounded-xl font-bold hover:bg-brand-brown-dark transition-colors shadow-md">
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? "Cancel" : "Add Member"}
                </button>
            </div>

            {/* ADD MEMBER FORM (Collapsible) */}
            {showForm && (
                <div className="bg-brand-sand/20 p-6 rounded-2xl border border-brand-gold/20 mb-8 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        
                        {/* Image Upload */}
                        <div className="flex justify-center md:justify-start">
                            <div className="relative w-20 h-20 rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-brand-gold cursor-pointer group">
                                {imagePreview ? (
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-brand-gold" />
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50" placeholder="Full Name" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                            <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold/50" placeholder="Job Title" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-brand-brown-dark cursor-pointer">
                                <input type="checkbox" checked={formData.isLead} onChange={(e) => setFormData({...formData, isLead: e.target.checked})} className="accent-brand-gold w-4 h-4" />
                                Mark as Team Lead
                            </label>
                            <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-brand-brown-dark text-white rounded-lg font-bold text-sm hover:bg-brand-gold transition-colors flex justify-center">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Member'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* MEMBERS LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                    <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 relative group hover:shadow-md transition-shadow">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image src={member.image || "/fallback.webp"} alt={member.name} fill className="object-cover" />
                        </div>
                        <div className="flex-grow min-w-0">
                            <h3 className="font-bold text-brand-brown-dark truncate">{member.name}</h3>
                            <p className="text-xs text-gray-500 truncate">{member.role}</p>
                            {member.isLead && <span className="text-[10px] text-brand-gold font-bold uppercase flex items-center gap-1 mt-1"><BadgeCheck className="w-3 h-3" /> Team Lead</span>}
                        </div>
                        
                        {/* ACTIONS */}
                        <div className="flex gap-1">
                            {/* Updated Edit Route */}
                            <Link href={`/admin/settings/team/edit/${member.id}`}>
                                <button className="p-2 text-gray-400 hover:text-brand-brown-dark hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </Link>
                            <button onClick={() => handleDelete(member.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {members.length === 0 && !showForm && (
                    <div className="col-span-full text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">No team members found. Click "Add Member" to start.</div>
                )}
            </div>
        </div>
    );
}