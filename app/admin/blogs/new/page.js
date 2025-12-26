"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// UploadThing
import { UploadButton } from '@/lib/uploadthing';

import { 
    ArrowLeft, 
    Save, 
    UploadCloud, 
    X, 
    FileText,
    LayoutList,
    Loader2
} from 'lucide-react';

export default function CreateBlogPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Series (You can fetch this from Firebase later)
    const availableSeries = [
        { id: 1, title: "Ramadan Preparation Guide" },
        { id: 2, title: "The Fiqh of Prayer (Salat)" }
    ];

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '', 
        category: 'Article',
        series: '', 
        author: 'Sheikh Goni Dr. Muneer Ja\'afar', 
        readTime: '',
        date: new Date().toISOString().split('T')[0], 
        tags: '',
        pdfUrl: '',      // Stores the UploadThing URL
        pdfName: '',     // Stores the original filename
        coverImage: ''   // Stores the UploadThing URL
    });

    // Handle Text Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Validation
            if (!formData.title || !formData.content) {
                alert("Please fill in the title and content.");
                setIsSubmitting(false);
                return;
            }

            // 2. Prepare Data for Firestore
            const postData = {
                ...formData,
                createdAt: serverTimestamp(),
                // Convert tags string to array
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') 
            };

            // 3. Save to Firebase
            await addDoc(collection(db, "posts"), postData);

            alert("Post published successfully!");
            router.push('/admin/blogs');

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-12">
            
            {/* 1. HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blogs" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">New Post</h1>
                        <p className="font-lato text-sm text-gray-500">Add a new article, update, or research paper.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="button" className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                        Save Draft
                    </button>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 2. LEFT COLUMN: MAIN CONTENT */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Title */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Post Title
                        </label>
                        <input 
                            type="text" 
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter a catchy title..." 
                            className="w-full text-2xl font-agency font-bold text-brand-brown-dark placeholder-gray-300 border-none focus:ring-0 p-0 focus:outline-none"
                        />
                    </div>

                    {/* Excerpt */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Short Excerpt (For Cards)
                        </label>
                        <textarea 
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows="2"
                            placeholder="A brief summary that appears on the blog card..." 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                        ></textarea>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Main Content
                        </label>
                        <div className="border-b border-gray-100 pb-2 mb-4 flex gap-2 text-gray-400 text-sm">
                            <span>Markdown Supported</span>
                        </div>
                        <textarea 
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            className="flex-grow w-full resize-none border-none focus:ring-0 p-0 focus:outline-none text-base leading-relaxed text-gray-700"
                            placeholder="Start writing your amazing story here..."
                        ></textarea>
                    </div>

                    {/* PDF UPLOAD (Conditional) */}
                    {formData.category === 'Research' && (
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 border-dashed">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-blue-800 text-sm">Upload Research PDF</h3>
                                    <p className="text-xs text-blue-600">Max size 16MB. This file will be downloadable.</p>
                                </div>
                                <div className="relative">
                                    {/* UPLOADTHING BUTTON FOR PDF */}
                                    <UploadButton
                                        endpoint="pdfUploader"
                                        onClientUploadComplete={(res) => {
                                            if(res && res[0]) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    pdfUrl: res[0].url,
                                                    pdfName: res[0].name
                                                }));
                                                alert("PDF Uploaded Successfully");
                                            }
                                        }}
                                        onUploadError={(error) => {
                                            alert(`ERROR! ${error.message}`);
                                        }}
                                        appearance={{
                                            button: "bg-blue-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors ut-uploading:cursor-not-allowed"
                                        }}
                                        content={{
                                            button({ ready }) {
                                                if (ready) return 'Select PDF';
                                                return 'Loading...';
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            {formData.pdfName && (
                                <p className="mt-4 text-xs font-bold text-green-700 text-center bg-green-100 py-2 rounded-lg border border-green-200">
                                    ✓ Attached: {formData.pdfName}
                                </p>
                            )}
                        </div>
                    )}

                </div>

                {/* 3. RIGHT COLUMN: METADATA */}
                <div className="space-y-6">
                    
                    {/* Publishing Details */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Publishing</h3>
                        
                        {/* Series Selection */}
                        <div className="bg-brand-sand/20 p-4 rounded-xl border border-brand-gold/20 mb-4">
                            <label className="flex items-center gap-2 text-xs font-bold text-brand-brown-dark uppercase tracking-wider mb-2">
                                <LayoutList className="w-4 h-4" /> Add to Series
                            </label>
                            <select 
                                name="series"
                                value={formData.series}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 cursor-pointer"
                            >
                                <option value="">Select a Series (Optional)</option>
                                {availableSeries.map(s => (
                                    <option key={s.id} value={s.title}>{s.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Category</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            >
                                <option value="Article">Article</option>
                                <option value="News">News & Updates</option>
                                <option value="Research">Research & Publications</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Publish Date</label>
                            <input 
                                type="date" 
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Read Time</label>
                            <input 
                                type="text" 
                                name="readTime"
                                value={formData.readTime}
                                onChange={handleChange}
                                placeholder="e.g. 5 min read"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            />
                        </div>

                         <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Author</label>
                            <input 
                                type="text" 
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            />
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Featured Image</h3>
                        
                        <div className="relative w-full aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group hover:border-brand-gold transition-colors">
                            {formData.coverImage ? (
                                <>
                                    <Image src={formData.coverImage} alt="Preview" fill className="object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-4 w-full h-full">
                                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                    {/* UPLOADTHING BUTTON FOR IMAGE */}
                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            if(res && res[0]) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    coverImage: res[0].url
                                                }));
                                            }
                                        }}
                                        onUploadError={(error) => {
                                            alert(`ERROR! ${error.message}`);
                                        }}
                                        appearance={{
                                            button: "bg-transparent text-gray-500 text-xs hover:text-brand-gold ut-uploading:text-brand-gold font-bold",
                                            allowedContent: "hidden" // Hide the "Image (4MB)" text to keep UI clean
                                        }}
                                        content={{
                                            button({ ready }) {
                                                if (ready) return 'Click to Upload Cover';
                                                return 'Loading Uploader...';
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Tags</h3>
                        
                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Comma Separated</label>
                            <input 
                                type="text" 
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="Education, Ramadan, Youth..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            />
                        </div>
                    </div>

                </div>

            </div>

        </form>
    );
}
