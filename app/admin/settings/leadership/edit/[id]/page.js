"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useModal } from '@/context/ModalContext';
import { 
    ArrowLeft, Save, Trash2, Loader2, UploadCloud, 
    User, Briefcase, X, Camera, Eye, Check, ChevronDown, 
    FileText, ListOrdered 
} from 'lucide-react';

// --- CUSTOM SELECT COMPONENT ---
const CustomSelect = ({ options, value, onChange, placeholder, disabled, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full pl-4 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-gold/50'} ${isOpen ? 'ring-2 ring-brand-gold/20 border-brand-gold bg-white' : ''}`}
            >
                <div className="flex items-center gap-2 truncate text-brand-brown-dark">
                    {Icon && <Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />}
                    <span>{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 absolute right-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {options.map((opt) => (
                        <div 
                            key={opt.value}
                            onClick={() => { 
                                if (!opt.disabled) {
                                    onChange(opt.value); 
                                    setIsOpen(false); 
                                }
                            }}
                            className={`px-4 py-3 text-xs font-medium flex justify-between items-center cursor-pointer hover:bg-brand-sand/10 text-gray-600 ${value === opt.value ? 'bg-brand-sand/20 text-brand-brown-dark font-bold' : ''}`}
                        >
                            <span className="truncate">{opt.label}</span>
                            {value === opt.value && <Check className="w-3 h-3 text-brand-gold flex-shrink-0" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function EditLeadershipPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const { showSuccess, showConfirm } = useModal();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        bio: '',
        order: 1,
        visibility: 'Visible'
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "leadership_members", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        name: data.name || '',
                        position: data.position || '',
                        bio: data.bio || '',
                        order: data.order || 1,
                        visibility: data.visibility || 'Visible'
                    });
                    setOriginalImage(data.image);
                    setImagePreview(data.image);
                } else {
                    router.push('/admin/settings/leadership');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, router]);

    // --- HANDLERS ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.position || !formData.bio) { 
            alert("Name, Position, and Bio are required."); 
            return; 
        }

        setIsSubmitting(true);
        try {
            let imageUrl = originalImage;

            // Upload new image if selected
            if (imageFile) {
                const storageRef = ref(storage, `leadership/${Date.now()}_${imageFile.name}`);
                await uploadBytesResumable(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            const docRef = doc(db, "leadership_members", id);
            await updateDoc(docRef, {
                ...formData,
                order: Number(formData.order), // Ensure number
                image: imageUrl,
                updatedAt: serverTimestamp()
            });

            showSuccess({
                title: "Profile Updated",
                message: "Leadership details updated successfully.",
                confirmText: "Back to Directory",
                onConfirm: () => router.push('/admin/settings/leadership')
            });

        } catch (error) {
            console.error("Error updating:", error);
            alert("Failed to update profile.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        showConfirm({
            title: "Delete Profile?",
            message: "Are you sure you want to remove this leader? This cannot be undone.",
            confirmText: "Yes, Delete",
            type: "danger",
            onConfirm: async () => {
                await deleteDoc(doc(db, "leadership_members", id));
                router.push('/admin/settings/leadership');
            }
        });
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-gold" /></div>;

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-6 pt-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings/leadership" className="p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-brand-brown-dark">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-4xl text-brand-brown-dark leading-none mb-1">Edit Leadership Profile</h1>
                        <p className="font-lato text-sm text-gray-500">Update details, hierarchy order, and visibility.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/settings/leadership">
                        <button className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button onClick={handleDelete} className="px-6 py-3 rounded-xl font-bold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                {/* LEFT: FORM INPUTS */}
                <div className="lg:col-span-8 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sand/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <h2 className="font-agency text-2xl text-brand-brown-dark mb-6 relative z-10">Leader Details</h2>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        {/* 1. Photo & Basics */}
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <div className="relative group cursor-pointer flex-shrink-0 mx-auto sm:mx-0">
                                <div className={`w-28 h-28 rounded-2xl overflow-hidden border-4 transition-all shadow-sm ${imagePreview ? 'border-brand-gold' : 'border-gray-100 bg-gray-50'}`}>
                                    <Image src={imagePreview || "/fallback.webp"} alt="Preview" width={112} height={112} className="object-cover w-full h-full" />
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm">
                                    Change
                                </div>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>

                            <div className="flex-grow w-full space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Full Name <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none font-bold text-gray-700 placeholder-gray-400" 
                                            placeholder="e.g. Sheikh Ibrahim" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Title / Position <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={formData.position} 
                                            onChange={(e) => setFormData({...formData, position: e.target.value})} 
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none font-bold text-gray-700 placeholder-gray-400" 
                                            placeholder="e.g. Chairman / Founder" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Bio */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Biography <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                <textarea 
                                    rows="4"
                                    value={formData.bio} 
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none font-bold text-gray-700 placeholder-gray-400 resize-none" 
                                    placeholder="Brief introduction and background..." 
                                />
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* 3. Settings (Order & Visibility) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-2 block">Display Order</label>
                                <div className="relative">
                                    <ListOrdered className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={formData.order} 
                                        onChange={(e) => setFormData({...formData, order: e.target.value})} 
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all outline-none font-bold text-gray-700" 
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 ml-1">Lower numbers appear first.</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-2 block">Visibility</label>
                                <CustomSelect 
                                    options={[{ value: 'Visible', label: 'Visible to Public' }, { value: 'Hidden', label: 'Hidden (Draft)' }]} 
                                    value={formData.visibility} 
                                    onChange={(val) => setFormData({...formData, visibility: val})} 
                                    placeholder="Select Status" 
                                    icon={Eye} 
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="w-full py-3.5 bg-brand-gold text-white rounded-xl font-bold text-sm hover:bg-brand-brown-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isSubmitting ? 'Saving Changes...' : 'Update Leadership Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RIGHT: PREVIEW CARD */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-brand-sand/20 rounded-3xl p-6 border-2 border-dashed border-brand-gold/30 flex flex-col items-center justify-center text-center sticky top-6">
                        <h3 className="font-agency text-xl text-brand-brown-dark mb-6 flex items-center gap-2 opacity-60">
                            <Eye className="w-5 h-5" /> Live Preview
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
                            </div>
                            <div className="p-5 text-left border-t border-gray-100">
                                <h4 className="font-agency text-2xl text-brand-brown-dark leading-none mb-1">
                                    {formData.name || "Leader Name"}
                                </h4>
                                <p className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-3">
                                    {formData.position || "Position Title"}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-3 italic">
                                    {formData.bio || "Biography preview will appear here..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}