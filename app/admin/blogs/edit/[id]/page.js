"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
// Firebase
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// Context
import { useModal } from '@/context/ModalContext';

import { 
    ArrowLeft, Save, Loader2, UploadCloud, FileText, Bell, BookOpen, 
    Image as ImageIcon, X, AlertTriangle, CheckCircle, Calendar
} from 'lucide-react';

export default function EditContentPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { showSuccess } = useModal();

    const id = params?.id;
    const type = searchParams.get('type'); // 'articles', 'news', or 'research'

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        status: 'Draft',
        language: 'English',
        // Articles
        title: '',
        slug: '',
        author: '',
        category: 'Faith',
        body: '',
        excerpt: '',
        // News
        headline: '',
        eventDate: '',
        shortDescription: '',
        // Research
        researchTitle: '',
        authors: '',
        abstract: '',
        researchType: 'Journal Article',
        publicationStatus: 'Published',
        doi: '',
    });

    // File State
    const [file, setFile] = useState(null); // New file to upload
    const [existingFileUrl, setExistingFileUrl] = useState(null); // Current URL
    const [filePreview, setFilePreview] = useState(null); // For new image preview

    // Helper: RTL
    const getDir = (text) => {
        if (!text) return 'ltr';
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text) ? 'rtl' : 'ltr';
    };

    // 1. FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            if (!id || !type) return;
            setIsLoading(true);
            try {
                const docRef = doc(db, type, id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Populate Form
                    setFormData({
                        status: data.status || 'Draft',
                        language: data.language || 'English',
                        // Map fields based on what exists
                        title: data.title || '',
                        slug: data.slug || '',
                        author: data.author || '',
                        category: data.category || 'Faith',
                        body: data.body || '',
                        excerpt: data.excerpt || '',
                        headline: data.headline || '',
                        eventDate: data.eventDate || '',
                        shortDescription: data.shortDescription || '',
                        researchTitle: data.researchTitle || '',
                        authors: data.authors || '',
                        abstract: data.abstract || '',
                        researchType: data.researchType || 'Journal Article',
                        publicationStatus: data.publicationStatus || 'Published',
                        doi: data.doi || '',
                    });

                    // Handle File
                    if (type === 'research') {
                        setExistingFileUrl(data.pdfUrl);
                    } else {
                        setExistingFileUrl(data.featuredImage);
                    }
                } else {
                    alert("Content not found");
                    router.push('/admin/blogs');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, type, router]);

    // HANDLE CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // FILE HANDLER
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            if (type === 'research' && selected.type !== 'application/pdf') {
                alert("Please upload a PDF for research.");
                return;
            }
            if ((type !== 'research') && !selected.type.startsWith('image/')) {
                alert("Please upload an image file.");
                return;
            }
            
            setFile(selected);
            if (selected.type.startsWith('image/')) {
                setFilePreview(URL.createObjectURL(selected));
            }
        }
    };

    const removeNewFile = () => {
        setFile(null);
        setFilePreview(null);
    };

    // SUBMIT LOGIC
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let fileUrl = existingFileUrl;
            
            // Upload New File if selected
            if (file) {
                const folder = type === 'research' ? 'research_pdfs' : 'blog_images';
                const storageRef = ref(storage, `${folder}/${Date.now()}_edited_${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);
                
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });

                await uploadTask;
                fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            }

            // Construct Data Payload
            let payload = {
                updatedAt: serverTimestamp(),
                status: formData.status,
                language: formData.language,
                // Slug usually remains static or is edited manually if we added a slug field
            };

            if (type === 'articles') {
                payload = { ...payload, title: formData.title, author: formData.author, category: formData.category, body: formData.body, excerpt: formData.excerpt, featuredImage: fileUrl };
            } else if (type === 'news') {
                payload = { ...payload, headline: formData.headline, eventDate: formData.eventDate, shortDescription: formData.shortDescription, body: formData.body, featuredImage: fileUrl };
            } else if (type === 'research') {
                payload = { ...payload, researchTitle: formData.researchTitle, authors: formData.authors, abstract: formData.abstract, researchType: formData.researchType, publicationStatus: formData.publicationStatus, doi: formData.doi, pdfUrl: fileUrl };
            }

            // Update Doc
            const docRef = doc(db, type, id);
            await updateDoc(docRef, payload);

            showSuccess({
                title: "Content Updated",
                message: "Your changes have been saved successfully.",
                confirmText: "Return to List",
                onConfirm: () => router.push('/admin/blogs')
            });

        } catch (error) {
            console.error("Error updating:", error);
            alert("Failed to update content.");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>;
return (
        <div className="max-w-6xl mx-auto pb-12">
            
            {/* HEADER */}
            <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Edit Content</h1>
                        <p className="font-lato text-sm text-gray-500 capitalize">Editing {type?.slice(0, -1) || 'Item'}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: UPLOADS & META */}
                <div className="space-y-6">
                    
                    {/* Language & Status */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Language</label>
                            <select name="language" value={formData.language} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50">
                                <option>English</option>
                                <option>Hausa</option>
                                <option>Arabic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50">
                                <option>Draft</option>
                                <option>Published</option>
                                <option>Archived</option>
                            </select>
                        </div>
                    </div>

                    {/* File Replacement */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-xs font-bold text-brand-brown mb-3">
                            {type === 'research' ? 'Replace PDF' : 'Replace Featured Image'}
                        </label>

                        {/* Existing File Info */}
                        {existingFileUrl && !file && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-bold text-green-700 text-xs">Current File Active</p>
                                    {type !== 'research' && (
                                        <div className="relative w-full h-20 mt-2 rounded overflow-hidden">
                                            <Image src={existingFileUrl} alt="Current" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors min-h-[150px] ${
                            file ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-300 hover:border-brand-gold'
                        }`}>
                            {file ? (
                                <div className="w-full relative">
                                    {filePreview ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
                                            <Image src={filePreview} alt="Preview" fill className="object-cover" />
                                        </div>
                                    ) : (
                                        <FileText className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                                    )}
                                    <p className="text-xs font-bold truncate px-2">{file.name}</p>
                                    <button type="button" onClick={removeNewFile} className="text-red-500 text-xs font-bold hover:underline mt-2">
                                        Remove New File
                                    </button>
                                </div>
                            ) : (
                                <div className="relative w-full">
                                    <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-xs text-gray-500 font-bold">Upload New File</p>
                                    <input 
                                        type="file" 
                                        accept={type === 'research' ? "application/pdf" : "image/*"}
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                    />
                                </div>
                            )}
                        </div>
                        {isSubmitting && file && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-brand-gold h-full transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: CONTENT FIELDS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        
                        {/* --- ARTICLE FIELDS --- */}
                        {type === 'articles' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50" dir={getDir(formData.title)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-brand-brown mb-1">Author</label>
                                        <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-brand-brown mb-1">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                            <option>Faith</option><option>Education</option><option>Technology</option><option>Community</option><option>Reflections</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Excerpt</label>
                                    <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" dir={getDir(formData.excerpt)}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Body Content</label>
                                    <textarea name="body" value={formData.body} onChange={handleChange} rows="10" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" dir={getDir(formData.body)}></textarea>
                                </div>
                            </>
                        )}

                        {/* --- NEWS FIELDS --- */}
                        {type === 'news' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Headline</label>
                                    <input type="text" name="headline" value={formData.headline} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50" dir={getDir(formData.headline)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Event Date</label>
                                    <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Short Description</label>
                                    <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" dir={getDir(formData.shortDescription)}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Full Content (Optional)</label>
                                    <textarea name="body" value={formData.body} onChange={handleChange} rows="6" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" dir={getDir(formData.body)}></textarea>
                                </div>
                            </>
                        )}

                        {/* --- RESEARCH FIELDS --- */}
                        {type === 'research' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Research Title</label>
                                    <input type="text" name="researchTitle" value={formData.researchTitle} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50" dir={getDir(formData.researchTitle)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-brand-brown mb-1">Authors</label>
                                        <input type="text" name="authors" value={formData.authors} onChange={handleChange} placeholder="e.g. T. Salihu" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-brand-brown mb-1">Type</label>
                                        <select name="researchType" value={formData.researchType} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                            <option>Journal Article</option><option>Conference Paper</option><option>Thesis</option><option>Report</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Abstract</label>
                                    <textarea name="abstract" value={formData.abstract} onChange={handleChange} rows="6" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" dir={getDir(formData.abstract)}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">DOI / Link</label>
                                    <input type="text" name="doi" value={formData.doi} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-100">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-md disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}