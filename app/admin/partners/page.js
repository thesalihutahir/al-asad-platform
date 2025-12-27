"use client";

import React, { useState, useEffect } from 'react';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { 
    Search, 
    Trash2, 
    Loader2,
    CheckCircle,
    MessageCircle,
    User,
    Mail,
    Building2,
    Briefcase
} from 'lucide-react';

export default function ManagePartnersPage() {

    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All'); 

    // 1. Fetch Partners (Real-time)
    useEffect(() => {
        setIsLoading(true);
        const q = query(collection(db, "partners"), orderBy("submittedAt", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Handle Status Update with "mailto" Trigger
    const handleStatusUpdate = async (partner, newStatus) => {
        try {
            // Update Firestore
            await updateDoc(doc(db, "partners", partner.id), { status: newStatus });

            // Prepare Email Draft
            let subject = "";
            let body = "";

            if (newStatus === 'Contacted') {
                subject = `Partnership Inquiry - Al-Asad Foundation`;
                body = `Dear ${partner.contactPerson},%0D%0A%0D%0AThank you for your interest in partnering with Al-Asad Foundation. We have received your inquiry regarding ${partner.type} and would like to schedule a meeting to discuss further.%0D%0A%0D%0ABest regards,`;
            } else if (newStatus === 'Partnered') {
                subject = `Welcome Aboard - Al-Asad Foundation Partnership`;
                body = `Dear ${partner.contactPerson},%0D%0A%0D%0AWe are thrilled to officially welcome ${partner.organization} as a partner. We look forward to a fruitful collaboration.%0D%0A%0D%0ABest regards,`;
            }

            // Open Email Client
            if (subject) {
                window.location.href = `mailto:${partner.email}?subject=${subject}&body=${body}`;
            }

        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    // 3. Handle Delete
    const handleDelete = async (id) => {
        if (!confirm("Delete this inquiry? This cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, "partners", id));
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete.");
        }
    };

    // Filter Logic
    const filteredPartners = statusFilter === 'All' 
        ? partners 
        : partners.filter(p => p.status === statusFilter);

    // Helper: Format Date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="space-y-6">

            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Partnership Inquiries</h1>
                    <p className="font-lato text-sm text-gray-500">Manage collaboration requests from organizations.</p>
                </div>
                
                <div className="flex gap-2">
                    <div className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-center shadow-sm">
                        <span className="block text-lg font-bold text-brand-gold">{partners.length}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
                    </div>
                    <div className="bg-white border border-gray-100 px-4 py-2 rounded-xl text-center shadow-sm">
                        <span className="block text-lg font-bold text-blue-600">
                            {partners.filter(p => p.status === 'New').length}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">New</span>
                    </div>
                </div>
            </div>

            {/* 2. FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['All', 'New', 'Contacted', 'Partnered'].map(status => (
                        <button 
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
                                statusFilter === status 
                                ? 'bg-white text-brand-brown-dark shadow-sm' 
                                : 'text-gray-500 hover:text-brand-brown-dark'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search organization..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                </div>
            </div>

            {/* 3. CONTENT LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Person</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPartners.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No inquiries found.</td></tr>
                                ) : (
                                    filteredPartners.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                                            
                                            {/* Organization */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-brand-sand/50 rounded-full flex items-center justify-center text-brand-brown-dark flex-shrink-0">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-brand-brown-dark block">{p.organization}</span>
                                                        <span className="text-xs text-gray-400 line-clamp-1 max-w-[200px]" title={p.message}>{p.message}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Person */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-600 flex items-center gap-1">
                                                        <User className="w-3 h-3" /> {p.contactPerson}
                                                    </span>
                                                    <a href={`mailto:${p.email}`} className="text-xs text-brand-gold hover:underline flex items-center gap-1 mt-1">
                                                        <Mail className="w-3 h-3" /> {p.email}
                                                    </a>
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                                    <Briefcase className="w-3 h-3" /> {p.type}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    p.status === 'Partnered' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-orange-100 text-orange-700'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        p.status === 'Partnered' ? 'bg-green-500' :
                                                        p.status === 'Contacted' ? 'bg-blue-500' :
                                                        'bg-orange-500'
                                                    }`}></span>
                                                    {p.status}
                                                </span>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-xs text-gray-400">{formatDate(p.submittedAt)}</td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {p.status === 'New' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(p, 'Contacted')} 
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Mark Contacted & Email"
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {p.status !== 'Partnered' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(p, 'Partnered')} 
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Mark as Partner"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}