"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// Utilities
import { useModal } from '@/context/ModalContext'; // Using Global Modal now

import { 
    ArrowLeft, Save, X, FileText, LayoutList, Image as ImageIcon, 
    UploadCloud, Globe, Bell, BookOpen, AlertTriangle, MapPin, Link as LinkIcon
} from 'lucide-react';

export default function CreateBlogPage() {
    const router = useRouter();
    const { showSuccess } = useModal();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [duplicateWarning, setDuplicateWarning] = useState(null);

    // --- MODE STATE ---
    const [contentType, setContentType] = useState('articles'); // 'articles', 'news', 'research'

    // --- FORM DATA ---
    const [formData, setFormData] = useState({
        // Common
        title: '',
        slug: '',
        language: 'English',
        status: 'Draft',
        
        // Article Specific
        author: 'Sheikh Dr. Muneer Ja\'afar',
        category: 'Reflections',
        content: '', 
        excerpt: '',
        tags: '',
        readTime: '', // Number

        // News Specific
        headline: '',
        eventDate: new Date().toISOString().split('T')[0],
        location: '',
        source: '',
        shortDescription: '',

        // Research Specific
        researchTitle: '',
        authors: '', // e.g. T. Salihu
        institution: '',
        researchType: 'Journal Article',
        abstract: '',
        publicationYear: new Date().getFullYear(),
        doi: '',
    });

    // --- FILES ---
    const [coverFile, setCoverFile] = useState(null); // Featured Image
    const [coverPreview, setCoverPreview] = useState(null);
    const [pdfFile, setPdfFile] = useState(null); // Research PDF

    // --- HELPER: Slugify ---
    const generateSlug = (text) => {
        return text.toString().toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    // --- HELPER: RTL ---
    const getDir = (text) => {
        if (!text) return 'ltr';
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text) ? 'rtl' : 'ltr';
    };

    // --- DUPLICATE CHECK ---
    const checkDuplicate = async (val, fieldName) => {
        if (!val.trim()) { setDuplicateWarning(null); return; }
        try {
            const q = query(collection(db, contentType), where(fieldName, "==", val.trim()));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                setDuplicateWarning(`A record with this title already exists in ${contentType}.`);
            } else {
                setDuplicateWarning(null);
            }
        } catch (error) {
            console.error("Duplicate check error", error);
        }
    };

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-Slug & Duplicate Check
        if (name === 'title' || name === 'headline' || name === 'researchTitle') {
            const slug = generateSlug(value);
            setFormData(prev => ({ ...prev, [name]: value, slug }));
            checkDuplicate(value, name);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

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

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert("Please upload a PDF file.");
                return;
            }
            setPdfFile(file);
        }
    };

    const removeCover = () => { setCoverFile(null); setCoverPreview(null); };
    const removePdf = () => { setPdfFile(null); };

    // --- SUBMIT LOGIC ---
    const handleSubmit = async (e, status = 'Published') => {
        if(e) e.preventDefault();
        if (duplicateWarning) return;
        
        if (status === 'Published') setIsSubmitting(true);
        else setIsSavingDraft(true);

        try {
            let coverUrl = ""; 
            let pdfUrl = "";

            // 1. Upload Cover (if applicable)
            if (coverFile) {
                const coverRef = ref(storage, `blog_covers/${Date.now()}_${coverFile.name}`);
                const coverTask = uploadBytesResumable(coverRef, coverFile);
                coverTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });
                await coverTask;
                coverUrl = await getDownloadURL(coverTask.snapshot.ref);
            }

            // 2. Upload PDF (if research)
            if (pdfFile && contentType === 'research') {
                const pdfRef = ref(storage, `research_pdfs/${Date.now()}_${pdfFile.name}`);
                const pdfTask = uploadBytesResumable(pdfRef, pdfFile);
                // We track PDF progress if it exists, overriding image progress
                pdfTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });
                await pdfTask;
                pdfUrl = await getDownloadURL(pdfRef);
            }

            // 3. Prepare Payload
            let payload = {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: status,
                language: formData.language,
                slug: formData.slug
            };

            if (contentType === 'articles') {
                payload = {
                    ...payload,
                    title: formData.title,
                    author: formData.author,
                    category: formData.category,
                    content: formData.content, // Body
                    excerpt: formData.excerpt,
                    tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t !== ''),
                    featuredImage: coverUrl,
                    readTime: formData.readTime || Math.ceil(formData.content.split(' ').length / 200)
                };
            } else if (contentType === 'news') {
                payload = {
                    ...payload,
                    headline: formData.headline,
                    eventDate: formData.eventDate,
                    location: formData.location,
                    source: formData.source,
                    shortDescription: formData.shortDescription,
                    content: formData.content, // Optional Full Content
                    featuredImage: coverUrl
                };
            } else if (contentType === 'research') {
                payload = {
                    ...payload,
                    researchTitle: formData.researchTitle,
                    authors: formData.authors,
                    institution: formData.institution,
                    researchType: formData.researchType,
                    abstract: formData.abstract,
                    publicationYear: formData.publicationYear,
                    doi: formData.doi,
                    pdfUrl: pdfUrl
                };
            }

            // 4. Save to Specific Collection
            await addDoc(collection(db, contentType), payload);

            showSuccess({
                title: "Content Saved!",
                message: `${contentType === 'news' ? 'News' : contentType} ${status === 'Draft' ? 'saved to drafts' : 'published'} successfully.`,
                confirmText: "Back to Dashboard",
                onConfirm: () => router.push('/admin/blogs')
            });

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed. Check console.");
        } finally {
            setIsSubmitting(false);
            setIsSavingDraft(false);
        }
    };

    return (
        <form className="space-y-6 max-w-6xl mx-auto pb-12">
            
            {/* HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">New Content</h1>
                        <p className="font-lato text-sm text-gray-500">Create content for the foundation.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} disabled={isSavingDraft || isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50">
                        {isSavingDraft && <Loader2 className="w-4 h-4 animate-spin" />} Save Draft
                    </button>
                    <button type="button" onClick={(e) => handleSubmit(e, 'Published')} disabled={isSubmitting || isSavingDraft} className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-md disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? `Publishing ${Math.round(uploadProgress)}%` : 'Publish'}
                    </button>
                </div>
            </div>

            {/* CONTENT TYPE TOGGLE */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex gap-2 w-fit mx-auto md:mx-0">
                {['articles', 'news', 'research'].map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => { setContentType(type); setDuplicateWarning(null); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors uppercase tracking-wider ${
                            contentType === type 
                            ? 'bg-brand-brown-dark text-white' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        {type === 'articles' && <FileText className="w-4 h-4" />}
                        {type === 'news' && <Bell className="w-4 h-4" />}
                        {type === 'research' && <BookOpen className="w-4 h-4" />}
                        {type}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- LEFT COLUMN (Main Content) --- */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* TITLE & SLUG */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            {contentType === 'news' ? 'Headline' : contentType === 'research' ? 'Research Title' : 'Article Title'}
                        </label>
                        <input 
                            type="text" 
                            name={contentType === 'news' ? 'headline' : contentType === 'research' ? 'researchTitle' : 'title'}
                            value={contentType === 'news' ? formData.headline : contentType === 'research' ? formData.researchTitle : formData.title} 
                            onChange={handleChange} 
                            placeholder="Enter title..." 
                            className="w-full text-2xl font-agency font-bold text-brand-brown-dark placeholder-gray-300 border-none focus:ring-0 p-0 focus:outline-none" 
                            dir={getDir(formData.title || formData.headline || formData.researchTitle)}
                        />
                        {duplicateWarning && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {duplicateWarning}</p>}
                        
                        <div className="mt-4 pt-4 border-t border-gray-50 flex gap-2 items-center text-xs text-gray-400">
                            <span className="font-bold">Slug:</span>
                            <span className="bg-gray-50 px-2 py-1 rounded text-gray-500 font-mono">{formData.slug || 'auto-generated'}</span>
                        </div>
                    </div>

                    {/* SUMMARY / ABSTRACT */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            {contentType === 'research' ? 'Abstract' : contentType === 'news' ? 'Short Description' : 'Excerpt'}
                        </label>
                        <textarea 
                            name={contentType === 'research' ? 'abstract' : contentType === 'news' ? 'shortDescription' : 'excerpt'}
                            value={contentType === 'research' ? formData.abstract : contentType === 'news' ? formData.shortDescription : formData.excerpt} 
                            onChange={handleChange} 
                            rows="4" 
                            placeholder="Summary or abstract..." 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            dir={getDir(formData.excerpt || formData.shortDescription || formData.abstract)}
                        ></textarea>
                    </div>

                    {/* MAIN CONTENT / BODY (Hidden for Research if PDF provided) */}
                    {contentType !== 'research' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                {contentType === 'news' ? 'Full Content (Optional)' : 'Body Content'}
                            </label>
                            <div className="border-b border-gray-100 pb-2 mb-4 flex gap-2 text-gray-400 text-sm"><span>Markdown Supported</span></div>
                            <textarea 
                                name="content" 
                                value={formData.content} 
                                onChange={handleChange} 
                                className="flex-grow w-full resize-none border-none focus:ring-0 p-0 focus:outline-none text-base leading-relaxed text-gray-700" 
                                placeholder="Write here..."
                                dir={getDir(formData.content)}
                            ></textarea>
                        </div>
                    )}

                    {/* PDF UPLOAD (Research Only) */}
                    {contentType === 'research' && (
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 border-dashed">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600"><FileText className="w-6 h-6" /></div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-blue-800 text-sm">Research Document (PDF)</h3>
                                    <p className="text-xs text-blue-600">Max 20MB. Required.</p>
                                </div>
                                <div className="relative">
                                    {pdfFile ? (
                                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                                            <span className="text-xs font-bold text-blue-800 truncate max-w-[150px]">{pdfFile.name}</span>
                                            <button type="button" onClick={removePdf} className="text-red-500 hover:bg-red-50 p-1 rounded"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <label htmlFor="pdf-upload" className="cursor-pointer bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Select PDF</label>
                                            <input id="pdf-upload" type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- RIGHT COLUMN (Sidebar) --- */}
                <div className="space-y-6">
                    
                    {/* SETTINGS CARD */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Settings</h3>
                        
                        {/* Language */}
                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Language</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select name="language" value={formData.language} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 cursor-pointer">
                                    <option value="English">English</option>
                                    <option value="Hausa">Hausa</option>
                                    <option value="Arabic">Arabic</option>
                                </select>
                            </div>
                        </div>

                        {/* === ARTICLE SPECIFIC === */}
                        {contentType === 'articles' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Author</label>
                                    <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50">
                                        <option>Reflections</option>
                                        <option>Faith</option>
                                        <option>Education</option>
                                        <option>Technology</option>
                                        <option>Community</option>
                                        <option>History</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Tags (Comma Sep)</label>
                                    <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="faith, quran, life..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Read Time (Mins)</label>
                                    <input type="number" min="1" name="readTime" value={formData.readTime} onChange={handleChange} placeholder="e.g. 5" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                            </>
                        )}

                        {/* === NEWS SPECIFIC === */}
                        {contentType === 'news' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Event Date</label>
                                    <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Lafia, Nigeria" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Source</label>
                                    <input type="text" name="source" value={formData.source} onChange={handleChange} placeholder="Foundation Press" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                            </>
                        )}

                        {/* === RESEARCH SPECIFIC === */}
                        {contentType === 'research' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Authors</label>
                                    <input type="text" name="authors" value={formData.authors} onChange={handleChange} placeholder="T. Salihu, et al." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Institution</label>
                                    <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="Islamic University" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Type</label>
                                    <select name="researchType" value={formData.researchType} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50">
                                        <option>Journal Article</option><option>Conference Paper</option><option>Thesis</option><option>Report</option><option>Working Paper</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">Year</label>
                                    <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-brown mb-1">DOI / Link</label>
                                    <input type="text" name="doi" value={formData.doi} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                                </div>
                            </>
                        )}
                    </div>

                    {/* FEATURED IMAGE (Hidden for Research) */}
                    {contentType !== 'research' && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Featured Image</h3>
                            <div className="relative w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
                                {coverPreview ? (
                                    <><Image src={coverPreview} alt="Preview" fill className="object-cover" /><button type="button" onClick={removeCover} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X className="w-4 h-4" /></button></>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4 w-full h-full relative"><UploadCloud className="w-8 h-8 text-gray-400 mb-2" /><p className="text-xs text-gray-500 font-bold mb-1">Upload Cover</p><input type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
