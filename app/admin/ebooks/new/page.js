"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { 
    ArrowLeft, 
    Save, 
    UploadCloud, 
    FileText, 
    Library,
    Loader2,
    X,
    CheckCircle,
    Image as ImageIcon
} from 'lucide-react';

export default function UploadBookPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoadingCollections, setIsLoadingCollections] = useState(true);

    // Dynamic Collections State
    const [availableCollections, setAvailableCollections] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        author: 'Sheikh Goni Dr. Muneer Ja\'afar',
        collection: '',
        category: 'Tafsir',
        language: 'English',
        description: ''
    });

    // File States
    const [pdfFile, setPdfFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // 1. Fetch Collections on Mount
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const q = query(collection(db, "ebook_collections"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const collections = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAvailableCollections(collections);
            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setIsLoadingCollections(false);
            }
        };

        fetchCollections();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle PDF Selection
    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert("Please upload a PDF file.");
                return;
            }
            if (file.size > 50 * 1024 * 1024) { // 50MB Limit
                alert("PDF size exceeds 50MB limit.");
                return;
            }
            setPdfFile(file);
            // Auto-fill title if empty
            if (!formData.title) {
                setFormData(prev => ({ ...prev, title: file.name.replace(".pdf", "") }));
            }
        }
    };

    // Handle Cover Selection
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert("Please upload a valid image file.");
                return;
            }
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const removePdf = () => setPdfFile(null);
    const removeCover = () => {
        setCoverFile(null);
        setCoverPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!pdfFile || !coverFile) {
            alert("Please upload both a PDF file and a Cover Image.");
            return;
        }
        if (!formData.title) {
            alert("Please enter a book title.");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload PDF
            const pdfRef = ref(storage, `ebooks/pdfs/${Date.now()}_${pdfFile.name}`);
            const pdfUploadTask = uploadBytesResumable(pdfRef, pdfFile);
            
            // 2. Upload Cover
            const coverRef = ref(storage, `ebooks/covers/${Date.now()}_${coverFile.name}`);
            const coverUploadTask = uploadBytesResumable(coverRef, coverFile);

            // Wait for both uploads
            // (We track progress of PDF since it's likely larger)
            pdfUploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            });

            await Promise.all([pdfUploadTask, coverUploadTask]);

            const pdfUrl = await getDownloadURL(pdfUploadTask.snapshot.ref);
            const coverUrl = await getDownloadURL(coverUploadTask.snapshot.ref);

            // 3. Save Metadata
            await addDoc(collection(db, "ebooks"), {
                ...formData,
                pdfUrl: pdfUrl,
                coverUrl: coverUrl,
                fileName: pdfFile.name,
                fileSize: (pdfFile.size / (1024 * 1024)).toFixed(2) + " MB",
                createdAt: serverTimestamp(),
                downloads: 0,
                reads: 0
            });

            alert("eBook published successfully!");
            router.push('/admin/ebooks');

        } catch (error) {
            console.error("Error saving ebook:", error);
            alert("Failed to save book. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/ebooks" className="p-2 hover:bg-gray-200 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Upload eBook</h1>
                        <p className="font-lato text-sm text-gray-500">Add a new book or paper to the library.</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Link href="/admin/ebooks" className="flex-1 md:flex-none">
                        <button type="button" className="w-full px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 text-center justify-center">
                            Cancel
                        </button>
                    </Link>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !pdfFile || !coverFile} 
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 font-bold rounded-xl shadow-md text-white transition-colors ${
                            (pdfFile && coverFile) 
                            ? 'bg-brand-gold hover:bg-brand-brown-dark' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? `Uploading ${Math.round(uploadProgress)}%` : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Upload Zones */}
                <div className="space-y-6">

                    {/* PDF Upload */}
                    <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors h-48 flex flex-col items-center justify-center ${
                        pdfFile ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300 hover:border-brand-gold'
                    }`}>
                        {pdfFile ? (
                            <div>
                                <FileText className="w-10 h-10 text-green-600 mx-auto mb-2" />
                                <p className="font-bold text-brand-brown-dark text-sm truncate w-48">{pdfFile.name}</p>
                                <p className="text-xs text-gray-500 mb-2">{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                {!isSubmitting && (
                                    <button type="button" onClick={removePdf} className="text-red-500 text-xs font-bold hover:underline mt-2">
                                        Change PDF
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full relative">
                                <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                                <h3 className="font-bold text-gray-700 text-sm mb-2">Upload Book PDF</h3>
                                <p className="text-xs text-gray-400">Max 50MB</p>
                                <input 
                                    type="file" 
                                    accept="application/pdf"
                                    onChange={handlePdfChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        )}
                    </div>

                    {/* Cover Image Upload */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-agency text-xl text-brand-brown-dark mb-4">Book Cover</h3>
                        <div className={`relative w-full aspect-[2/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group hover:border-brand-gold ${coverPreview ? 'border-none' : ''}`}>
                            {coverPreview ? (
                                <>
                                    <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                                    {!isSubmitting && (
                                        <button 
                                            type="button" 
                                            onClick={removeCover} 
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 z-10"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full p-4 relative">
                                    <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                                    <p className="text-xs text-gray-500 text-center px-4">Click to Upload Cover</p>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleCoverChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Metadata */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Book Details</h3>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Book Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50" 
                            />
                        </div>

                        {/* Collection Selector */}
                        <div className="bg-brand-sand/20 p-4 rounded-xl border border-brand-gold/20">
                            <label className="flex items-center gap-2 text-xs font-bold text-brand-brown-dark uppercase tracking-wider mb-2">
                                <Library className="w-4 h-4" /> Add to Collection
                            </label>
                            <select 
                                name="collection" 
                                value={formData.collection} 
                                onChange={handleChange} 
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50 cursor-pointer"
                            >
                                <option value="">Select a Collection (Optional)</option>
                                {isLoadingCollections ? (
                                    <option disabled>Loading collections...</option>
                                ) : (
                                    availableCollections.map(col => <option key={col.id} value={col.title}>{col.title}</option>)
                                )}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Category</label>
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50"
                                >
                                    <option>Tafsir</option>
                                    <option>Fiqh</option>
                                    <option>Aqeedah</option>
                                    <option>History</option>
                                    <option>General</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Language</label>
                                <select 
                                    name="language" 
                                    value={formData.language} 
                                    onChange={handleChange} 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50"
                                >
                                    <option>English</option>
                                    <option>Hausa</option>
                                    <option>Arabic</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Description</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows="4" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}