"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { 
    Plus, 
    Trash2, 
    Loader2, 
    Target,
    CreditCard,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';

export default function ManageDonationsPage() {

    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        bankName: '',
        accountNumber: '',
        status: 'Active'
    });

    // 1. Fetch Projects
    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "donation_projects"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Create Project
    const handleCreate = async (e) => {
        e.preventDefault();
        if(!formData.title) return alert("Title is required");

        setIsCreating(true);
        try {
            await addDoc(collection(db, "donation_projects"), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setFormData({ title: '', description: '', bankName: '', accountNumber: '', status: 'Active' });
            alert("Project added successfully!");
        } catch (error) {
            console.error("Error adding project:", error);
        } finally {
            setIsCreating(false);
        }
    };

    // 3. Toggle Status
    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        await updateDoc(doc(db, "donation_projects", id), { status: newStatus });
    };

    // 4. Delete Project
    const handleDelete = async (id) => {
        if (!confirm("Delete this donation project?")) return;
        await deleteDoc(doc(db, "donation_projects", id));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: Project List */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Donation Projects</h1>
                        <p className="font-lato text-sm text-gray-500">Manage active causes and bank details.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Project Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Bank Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {projects.map((p) => (
                                    <tr key={p.id} className="group hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-brand-brown-dark block">{p.title}</span>
                                            <span className="text-xs text-gray-400 line-clamp-1">{p.description}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {p.accountNumber ? (
                                                <div className="flex flex-col text-gray-600">
                                                    <span className="font-bold">{p.bankName}</span>
                                                    <span className="font-mono">{p.accountNumber}</span>
                                                </div>
                                            ) : <span className="text-gray-300 italic">None</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleStatus(p.id, p.status)} className="flex items-center gap-1">
                                                {p.status === 'Active' ? (
                                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Active</span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Inactive</span>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {projects.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-12 text-gray-400">No projects added yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* RIGHT: Add New Form */}
            <div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                    <h2 className="font-agency text-xl text-brand-brown-dark mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-brand-gold" /> Add New Project
                    </h2>
                    
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Project Title</label>
                            <input 
                                type="text" 
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50 outline-none"
                                placeholder="e.g. Orphan Support"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                            <textarea 
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50 outline-none resize-none"
                                placeholder="Short description..."
                            ></textarea>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-100">
                            <label className="text-xs font-bold text-brand-brown uppercase mb-2 block flex items-center gap-1">
                                <CreditCard className="w-3 h-3" /> Account Details (Optional)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Bank Name"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Account Number"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isCreating}
                            className="w-full py-3 bg-brand-brown-dark text-white font-bold rounded-xl hover:bg-brand-gold transition-colors flex justify-center items-center gap-2"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Project'}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}