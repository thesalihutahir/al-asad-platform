"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// Context
import { useModal } from '@/context/ModalContext';

import { 
    ArrowLeft, Save, Loader2, UploadCloud, 
    FileText, Bell, BookOpen, 
    X, AlertTriangle, Link as LinkIcon, Building, Sparkles, Globe, MapPin
} from 'lucide-react';

// --- CONSTANTS: CATEGORIES & RESEARCH TYPES ---
const ARTICLE_CATEGORIES = [
    { id: "Faith & Spirituality", en: "Faith & Spirituality", ar: "الإيمان والروحانيات", ha: "Imani da Ruhaniya" },
    { id: "Islam & Sufism", en: "Islam & Sufism", ar: "الإسلام والتصوف", ha: "Musulunci da Sufanci" },
    { id: "Education & Learning", en: "Education & Learning", ar: "التربية والتعليم", ha: "Ilimi da Tarbiyya" },
    { id: "Thoughts & Reflections", en: "Thoughts & Reflections", ar: "خواطر وتأملات", ha: "Tunani da Tsokaci" },
    { id: "History & Biographies", en: "History & Biographies", ar: "التاريخ والسير", ha: "Tarihi da Sira" }
];

const RESEARCH_TYPES = [
    { id: "Original Research", en: "Original Research", ar: "تحقيق", ha: "Bincike na Asali" },
    { id: "Textual Analysis", en: "Textual Analysis", ar: "شرح، تحليل، تفسير", ha: "Sharhi da Fashin Baki" },
    { id: "Literature Review", en: "Literature Review", ar: "دراسة نقدية", ha: "Bitaryar Ayyuka" },
    { id: "Comparative Study", en: "Comparative Study", ar: "مقارنة", ha: "Binciken Gwama" },
    { id: "Historical Research", en: "Historical Research", ar: "دراسة تاريخية", ha: "Binciken Tarihi" },
    { id: "Case Study", en: "Case Study", ar: "دراسة حالة", ha: "Nazarin Keɓaɓɓen Yanayi" },
    { id: "Theoretical / Conceptual Study", en: "Theoretical / Conceptual Study", ar: "تأصيل وتصور", ha: "Nazarin Tushe da Hasashe" },
    { id: "Applied Research", en: "Applied Research", ar: "دراسة تطبيقية", ha: "Bincike na Aiwatarwa" },
    { id: "Methodological Study", en: "Methodological Study", ar: "منهجية", ha: "Nazarin Manhaja" }
];

// --- CONSTANTS: UI LABELS (LOCALIZATION) ---
const UI_TEXT = {
    English: {
        title: "Title", headline: "Headline", researchTitle: "Research Title",
        excerpt: "Excerpt / Summary", shortDesc: "Short Description", abstract: "Abstract",
        body: "Body Content", fullContent: "Full Narrative (Optional)",
        author: "Author", authors: "Authors / Contributors",
        category: "Category", type: "Research Type",
        tags: "Tags", institution: "Institution / Affiliation",
        date: "Date", year: "Publication Year", location: "Location",
        source: "Source", doi: "DOI / Link",
        pdfReq: "Research PDF (Required)", imgReq: "Featured Image (Recommended)",
        upload: "Click to Upload", remove: "Remove",
        phTitle: "Enter an engaging title...", phHeadline: "Breaking news headline...", phResearchTitle: "Academic paper title...",
        phName: "e.g. Salihu Tahir", phAuthors: "e.g. S. Tahir, A. Bello", 
        phTags: "faith, life, education...", phBody: "Write your content here...", 
        phSource: "e.g. Foundation Press", phLocation: "e.g. Lafia, Nigeria", phInstitution: "e.g. Islamic University"
    },
    Arabic: {
        title: "العنوان", headline: "العنوان الرئيسي", researchTitle: "عنوان البحث",
        excerpt: "مقتطف / ملخص", shortDesc: "وصف قصير", abstract: "الملخص",
        body: "المحتوى", fullContent: "التفاصيل الكاملة (اختياري)",
        author: "المؤلف", authors: "المؤلفون / المساهمون",
        category: "التصنيف", type: "نوع البحث",
        tags: "الوسوم", institution: "المؤسسة / الانتماء",
        date: "التاريخ", year: "سنة النشر", location: "الموقع",
        source: "المصدر", doi: "رابط دائم / DOI",
        pdfReq: "ملف البحث (مطلوب)", imgReq: "صورة بارزة (موصى به)",
        upload: "اضغط للرفع", remove: "حذف",
        phTitle: "أدخل العنوان...", phHeadline: "عنوان الخبر...", phResearchTitle: "عنوان الورقة البحثية...",
        phName: "مثلاً: صالح طاهر", phAuthors: "مثلاً: ص. طاهر، أ. بيلو", 
        phTags: "إيمان، حياة...", phBody: "اكتب المحتوى هنا...", 
        phSource: "مثلاً: بيان صحفي", phLocation: "مثلاً: لافيا، نيجيريا", phInstitution: "مثلاً: الجامعة الإسلامية"
    },
    Hausa: {
        title: "Taken Rubutu", headline: "Babban Labari", researchTitle: "Taken Bincike",
        excerpt: "Takaitaccen Bayani", shortDesc: "Gajeren Bayani", abstract: "Tsokaci",
        body: "Abun Ciki", fullContent: "Cikakken Bayani (Na Zabi)",
        author: "Marubuci", authors: "Marubuta / Masu Bada Gudummawa",
        category: "Rukuni", type: "Nau'in Bincike",
        tags: "Alamomi (Tags)", institution: "Cibiya / Kungiya",
        date: "Kwanan Wata", year: "Shekarar Wallafa", location: "Wuri",
        source: "Majiya", doi: "Adireshin Yanar Gizo / DOI",
        pdfReq: "Takardar Bincike (Dole)", imgReq: "Hoto (Abin So)",
        upload: "Danna don Dorawa", remove: "Cire",
        phTitle: "Shigar da take...", phHeadline: "Taken labari...", phResearchTitle: "Taken bincike...",
        phName: "Misali: Salihu Tahir", phAuthors: "Misali: S. Tahir", 
        phTags: "imani, rayuwa...", phBody: "Rubuta anan...", 
        phSource: "Misali: Ofishin Jarida", phLocation: "Misali: Lafia, Nigeria", phInstitution: "Misali: Jami'ar Musulunci"
    }
};

export default function CreateBlogPage() {
    const router = useRouter();
    const { showSuccess } = useModal();

    // --- UI STATE ---
    const [contentType, setContentType] = useState('articles'); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [duplicateWarning, setDuplicateWarning] = useState(null);

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        // Common
        status: 'Draft',
        language: 'English',
        slug: '',
        
        // Articles
        title: '',
        author: 'Salihu Tahir',
        category: 'Faith & Spirituality',
        body: '',
        excerpt: '',
        tags: '', 
        readTime: 0, 

        // News
        headline: '',
        eventDate: new Date().toISOString().split('T')[0],
        source: '',
        // Location removed for News as requested previously, but added back if you want standard location? 
        // NOTE: You asked to REMOVE location under news in previous prompt, but specifications in last prompt said "Optional: Location".
        // I will include it as Optional since your spec list mentioned it.
        location: '', 
        shortDescription: '',
        
        // Research
        researchTitle: '',
        authors: 'S. Tahir', 
        institution: '', 
        publicationYear: new Date().getFullYear(),
        abstract: '',
        researchType: 'Original Research',
        doi: '',
    });

    // --- FILES STATE ---
    const [mainFile, setMainFile] = useState(null); 
    const [filePreview, setFilePreview] = useState(null); 

    // --- HELPERS ---
    const t = UI_TEXT[formData.language] || UI_TEXT.English;
    const isRTL = formData.language === 'Arabic';

    const generateSlug = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

    // --- AUTO-FORMATTING (Smart Casing) ---
    const toTitleCase = (str) => {
        // Arabic doesn't have casing, skip
        if (formData.language === 'Arabic' || !str) return str;
        
        return str.toLowerCase().split(' ').map(word => {
            // Small words to keep lowercase unless they are the first word
            const smallWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'of', 'on', 'or', 'the', 'to', 'via', 'vs'];
            if (smallWords.includes(word)) return word;
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        // Note: Ideally first word should always be capitalized, but this is a simple robust version.
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        // Fields to auto-capitalize
        const fieldsToFormat = ['title', 'headline', 'researchTitle', 'author', 'authors', 'institution', 'location', 'source'];
        
        if (fieldsToFormat.includes(name)) {
            const formatted = toTitleCase(value);
            // Ensure first character is always upper even if it was a small word logic above
            const final = formatted.charAt(0).toUpperCase() + formatted.slice(1);
            setFormData(prev => ({ ...prev, [name]: final }));
        }
    };

    // --- AUTOMATION EFFECTS ---
    useEffect(() => {
        if (contentType === 'articles' && formData.body) {
            const words = formData.body.trim().split(/\s+/).length;
            const time = Math.ceil(words / 200); 
            setFormData(prev => ({ ...prev, readTime: time }));
        }
    }, [formData.body, contentType]);

    // --- VALIDATION LOGIC ---
    const isFormValid = () => {
        if (duplicateWarning) return false;
        if (!formData.language) return false;

        if (contentType === 'articles') {
            return formData.title && formData.author && formData.body && formData.excerpt;
        }
        if (contentType === 'news') {
            return formData.headline && formData.eventDate && formData.shortDescription;
        }
        if (contentType === 'research') {
            return formData.researchTitle && formData.authors && formData.abstract && formData.publicationYear && mainFile; 
        }
        return false;
    };

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'title' || name === 'headline' || name === 'researchTitle') {
            const slug = generateSlug(value);
            setFormData(prev => ({ ...prev, [name]: value, slug }));
            checkDuplicate(value, name);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const checkDuplicate = async (val, fieldName) => {
        if (!val.trim()) { setDuplicateWarning(null); return; }
        try {
            const q = query(collection(db, contentType), where(fieldName, "==", val.trim()));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) setDuplicateWarning("Duplicate found.");
            else setDuplicateWarning(null);
        } catch (error) { console.error(error); }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (contentType === 'research' && selected.type !== 'application/pdf') {
            alert("Research requires a PDF document.");
            return;
        }
        if (contentType !== 'research' && !selected.type.startsWith('image/')) {
            alert("Please upload a valid image (JPG, PNG, WEBP, SVG).");
            return;
        }

        setMainFile(selected);
        if (selected.type.startsWith('image/')) setFilePreview(URL.createObjectURL(selected));
        else setFilePreview(null);
    };

    const handleSubmit = async (e, status = 'Published') => {
        if(e) e.preventDefault();
        
        if (status === 'Published') setIsSubmitting(true);
        else setIsSavingDraft(true);

        try {
            let fileUrl = "";
            if (mainFile) {
                const folder = contentType === 'research' ? 'research_pdfs' : 'blog_images';
                const storageRef = ref(storage, `${folder}/${Date.now()}_${mainFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, mainFile);
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });
                await uploadTask;
                fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            }

            let payload = {
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: status,
                language: formData.language,
                slug: formData.slug
            };

            if (contentType === 'articles') {
                payload = { ...payload, title: formData.title, author: formData.author, category: formData.category, body: formData.body, excerpt: formData.excerpt, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean), featuredImage: fileUrl, readTime: formData.readTime };
            } else if (contentType === 'news') {
                payload = { ...payload, headline: formData.headline, eventDate: formData.eventDate, source: formData.source, location: formData.location, shortDescription: formData.shortDescription, body: formData.body, featuredImage: fileUrl };
            } else if (contentType === 'research') {
                payload = { ...payload, researchTitle: formData.researchTitle, authors: formData.authors, institution: formData.institution, publicationYear: formData.publicationYear, researchType: formData.researchType, abstract: formData.abstract, doi: formData.doi, pdfUrl: fileUrl };
            }

            await addDoc(collection(db, contentType), payload);

            showSuccess({
                title: status === 'Draft' ? "Draft Saved" : "Published Successfully",
                message: `${contentType.toUpperCase()} has been saved.`,
                onConfirm: () => router.push('/admin/blogs')
            });

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to save.");
        } finally {
            setIsSubmitting(false);
            setIsSavingDraft(false);
        }
    };
    return (
        <div className="max-w-6xl mx-auto pb-20 font-lato">
            
            {/* HEADER & TOP CONTROLS */}
            <div className="sticky top-0 bg-gray-50 z-20 pb-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-6 h-6 text-gray-600" /></Link>
                        <div>
                            <h1 className="font-agency text-3xl text-brand-brown-dark">New Content</h1>
                            <p className="font-lato text-sm text-gray-500">Create content for the foundation.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} disabled={isSavingDraft || isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50">
                            {isSavingDraft && <Loader2 className="w-4 h-4 animate-spin" />} Save Draft
                        </button>
                        <button 
                            type="button" 
                            onClick={(e) => handleSubmit(e, 'Published')} 
                            disabled={isSubmitting || isSavingDraft || !isFormValid()} 
                            className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl shadow-md transition-colors ${!isFormValid() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-brand-gold text-white hover:bg-brand-brown-dark'}`}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSubmitting ? `Publishing ${Math.round(uploadProgress)}%` : 'Publish'}
                        </button>
                    </div>
                </div>

                {/* LANGUAGE & TYPE BAR */}
                <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm mt-2">
                    {/* Language Selector (Required) */}
                    <div className="relative w-full md:w-48 border-r border-gray-100 pr-4 mr-2">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold" />
                        <select 
                            name="language" 
                            value={formData.language} 
                            onChange={handleChange} 
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold cursor-pointer"
                        >
                            <option value="English">English</option>
                            <option value="Hausa">Hausa</option>
                            <option value="Arabic">Arabic</option>
                        </select>
                    </div>

                    {/* Mode Switcher */}
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide">
                        {['articles', 'news', 'research'].map((type) => (
                            <button key={type} onClick={() => { setContentType(type); setDuplicateWarning(null); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors uppercase tracking-wider whitespace-nowrap ${contentType === type ? 'bg-brand-brown-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                {type === 'articles' && <FileText className="w-4 h-4" />}
                                {type === 'news' && <Bell className="w-4 h-4" />}
                                {type === 'research' && <BookOpen className="w-4 h-4" />}
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                
                {/* --- LEFT COLUMN: INPUTS --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        
                        {/* ================= ARTICLES ================= */}
                        {contentType === 'articles' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.title} <span className="text-red-500">*</span></label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} onBlur={handleBlur} placeholder={t.phTitle} className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${isRTL ? 'text-right font-tajawal' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                    {duplicateWarning && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {duplicateWarning}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.excerpt} <span className="text-red-500">*</span></label>
                                    <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="3" placeholder={t.excerpt} className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${isRTL ? 'text-right font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.body} <span className="text-red-500">*</span></label>
                                    <textarea name="body" value={formData.body} onChange={handleChange} rows="15" placeholder={t.phBody} className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${isRTL ? 'text-right font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}></textarea>
                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                        <span>Markdown Supported</span>
                                        <span className="flex items-center gap-1 text-brand-gold"><Sparkles className="w-3 h-3"/> {formData.readTime} min read (Auto)</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ================= NEWS ================= */}
                        {contentType === 'news' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-orange-600 uppercase mb-2">{t.headline} <span className="text-red-500">*</span></label>
                                    <input type="text" name="headline" value={formData.headline} onChange={handleChange} onBlur={handleBlur} placeholder={t.phHeadline} className={`w-full p-4 bg-orange-50/50 border border-orange-100 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${isRTL ? 'text-right font-tajawal' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                    {duplicateWarning && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {duplicateWarning}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.location}</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} onBlur={handleBlur} placeholder={t.phLocation} className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.source}</label>
                                        <input type="text" name="source" value={formData.source} onChange={handleChange} onBlur={handleBlur} placeholder={t.phSource} className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.shortDesc} <span className="text-red-500">*</span></label>
                                    <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="3" className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${isRTL ? 'text-right font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.fullContent}</label>
                                    <textarea name="body" value={formData.body} onChange={handleChange} rows="10" className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${isRTL ? 'text-right font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}></textarea>
                                </div>
                            </>
                        )}

                        {/* ================= RESEARCH ================= */}
                        {contentType === 'research' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-blue-700 uppercase mb-2">{t.researchTitle} <span className="text-red-500">*</span></label>
                                    <input type="text" name="researchTitle" value={formData.researchTitle} onChange={handleChange} onBlur={handleBlur} placeholder={t.phResearchTitle} className={`w-full p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isRTL ? 'text-right font-tajawal' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                    {duplicateWarning && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {duplicateWarning}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.authors} <span className="text-red-500">*</span></label>
                                        <input type="text" name="authors" value={formData.authors} onChange={handleChange} onBlur={handleBlur} placeholder={t.phAuthors} className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.institution}</label>
                                        <input type="text" name="institution" value={formData.institution} onChange={handleChange} onBlur={handleBlur} placeholder={t.phInstitution} className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.abstract} <span className="text-red-500">*</span></label>
                                    <textarea name="abstract" value={formData.abstract} onChange={handleChange} rows="6" className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isRTL ? 'text-right font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.doi}</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input type="text" name="doi" value={formData.doi} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: META --- */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
                        <h4 className="font-bold text-brand-brown-dark text-sm border-b border-gray-100 pb-2">Publishing Meta</h4>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none">
                                <option>Draft</option>
                                <option>Published</option>
                                <option>Archived</option>
                            </select>
                        </div>

                        {contentType === 'articles' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.author} <span className="text-red-500">*</span></label>
                                    <input type="text" name="author" value={formData.author} onChange={handleChange} onBlur={handleBlur} placeholder={t.phName} className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.category} <span className="text-red-500">*</span></label>
                                    <select name="category" value={formData.category} onChange={handleChange} className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm ${isRTL ? 'text-right font-arabic' : ''}`}>
                                        {ARTICLE_CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {formData.language === 'English' ? cat.en : formData.language === 'Arabic' ? cat.ar : cat.ha}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.tags}</label>
                                    <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder={t.phTags} className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm ${isRTL ? 'text-right' : ''}`} dir={isRTL ? 'rtl' : 'ltr'} />
                                </div>
                            </>
                        )}

                        {contentType === 'news' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.date} <span className="text-red-500">*</span></label>
                                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            </div>
                        )}

                        {contentType === 'research' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.year} <span className="text-red-500">*</span></label>
                                    <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.type} <span className="text-red-500">*</span></label>
                                    <select name="researchType" value={formData.researchType} onChange={handleChange} className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm ${isRTL ? 'text-right font-arabic' : ''}`}>
                                        {RESEARCH_TYPES.map(type => (
                                            <option key={type.id} value={type.id}>
                                                {formData.language === 'English' ? type.en : formData.language === 'Arabic' ? type.ar : type.ha}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>

                    {/* File Upload */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <label className="block text-xs font-bold text-brand-brown mb-3 uppercase">
                            {contentType === 'research' ? t.pdfReq : t.imgReq}
                        </label>
                        
                        <div className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-colors min-h-[180px] ${mainFile ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200 hover:border-brand-gold'}`}>
                            {mainFile ? (
                                <div className="w-full relative">
                                    {filePreview ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2 shadow-sm"><Image src={filePreview} alt="Preview" fill className="object-cover" /></div>
                                    ) : (
                                        <FileText className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                    )}
                                    <p className="text-xs font-bold truncate px-2 text-brand-brown-dark">{mainFile.name}</p>
                                    <button type="button" onClick={() => { setMainFile(null); setFilePreview(null); }} className="mt-3 text-red-500 text-xs font-bold hover:underline">{t.remove}</button>
                                </div>
                            ) : (
                                <div className="relative w-full">
                                    <UploadCloud className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-500 font-bold">{t.upload}</p>
                                    <p className="text-xs text-gray-400 mt-1">{contentType === 'research' ? 'PDF only' : 'JPG, PNG, WEBP, SVG'}</p>
                                    <input type="file" accept={contentType === 'research' ? "application/pdf" : "image/png, image/jpeg, image/webp, image/svg+xml"} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                            )}
                        </div>
                        {isSubmitting && mainFile && (
                            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden"><div className="bg-brand-gold h-full transition-all duration-300" style={{width: `${uploadProgress}%`}}></div></div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
