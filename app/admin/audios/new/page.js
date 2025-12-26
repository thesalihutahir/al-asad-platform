"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
    Music, 
    CheckCircle, 
    X,
    ListMusic,
    Loader2,
    Trash2
} from 'lucide-react';

export default function UploadAudioPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Series (You can fetch this from Firebase later)
    const availableSeries = [
        { id: 1, title: "Tafsir Surah Yasin (Complete)" },
        { id: 2, title: "Ramadan Daily Reminders" },
        { id: 3, title: "Kitab At-Taharah (Purification)" }
    ];

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        speaker: 'Sheikh Goni Dr. Muneer Ja\'afar',
        category: 'Friday Sermon',
        series: '', 
        date: new Date().toISOString().split('T')[0],
        description: '',
        audioUrl: '',    // From UploadThing
        fileName: '',    // Original filename
        fileSize: ''     // Size string
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Remove file to allow re-upload
    const removeFile = () => {
        if(confirm("Are you sure you want to remove this audio?")) {
            setFormData(prev => ({ ...prev, audioUrl: '', fileName: '', fileSize: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validation
            if (!formData.audioUrl) {
                alert("Please upload an audio file first.");
                setIsSubmitting(false);
                return;
            }
            if (!formData.title) {
                alert("Please enter a title.");
                setIsSubmitting(false);
                return;
            }

            // Prepare Data
            const audioData = {
                ...formData,
                createdAt: serverTimestamp(),
                plays: 0,
                downloads: 0
            };

            // Save to Firestore
            await addDoc(collection(db, "audios"), audioData);

            alert("Audio published successfully!");
            router.push('/admin/audios');

        } catch (error) {
            console.error("Error saving audio:", error);
            alert("Failed to save audio. Check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">

            {/* 1. HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/audios" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Upload Audio</h1>
                        <p className="font-lato text-sm text-gray-500">Add a new lecture or sermon to the library.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/audios">
                        <button type="button" className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button 
                        type="submit"
                        disabled={isSubmitting || !formData.audioUrl} 
                        className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl transition-colors shadow-md ${
                            formData.audioUrl 
                            ? 'bg-brand-gold text-white hover:bg-brand-brown-dark' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? 'Publishing...' : 'Upload & Publish'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 2. LEFT COLUMN: FILE UPLOAD ZONE */}
                <div className="space-y-6">

                    <div className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors min-h-[320px] ${
                        formData.audioUrl ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300 hover:border-brand-gold hover:bg-brand-sand/10'
                    }`}>

                        {formData.audioUrl ? (
                            // File Selected State
                            <div className="w-full">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h3 className="font-bold text-brand-brown-dark text-lg truncate px-4">{formData.fileName}</h3>
                                <p className="text-sm text-gray-500 mb-6">{formData.fileSize}</p>

                                <button 
                                    type="button" 
                                    onClick={removeFile}
                                    className="flex items-center justify-center gap-2 text-red-500 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-lg mx-auto transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Remove File
                                </button>
                            </div>
                        ) : (
                            // Empty State (UploadThing Button)
                            <div className="flex flex-col items-center w-full">
                                <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                                    <Music className="w-10 h-10" />
                                </div>
                                <h3 className="font-bold text-gray-700 text-lg mb-1">Click to Upload MP3</h3>
                                <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">
                                    Supported formats: MP3, WAV, AAC. <br/> Max size: 32MB.
                                </p>
                                
                                <UploadButton
                                    endpoint="mediaUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res && res[0]) {
                                            setFormData(prev => ({
                                                ...prev,
                                                audioUrl: res[0].url,
                                                fileName: res[0].name,
                                                fileSize: (res[0].size / (1024 * 1024)).toFixed(2) + " MB"
                                            }));
                                            // Auto-fill title if empty
                                            if (!formData.title) {
                                                setFormData(prev => ({ ...prev, title: res[0].name.replace(/\.[^/.]+$/, "") }));
                                            }
                                            alert("Audio uploaded successfully!");
                                        }
                                    }}
                                    onUploadError={(error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                    appearance={{
                                        button: "bg-brand-brown-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-gold transition-colors ut-uploading:cursor-not-allowed"
                                    }}
                                    content={{
                                        button({ ready }) {
                                            if (ready) return 'Select Audio File';
                                            return 'Loading Uploader...';
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Audio Player Preview */}
                    {formData.audioUrl && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-agency text-xl text-brand-brown-dark mb-4 flex items-center gap-2">
                                <Music className="w-5 h-5 text-brand-gold" />
                                File Preview
                            </h3>
                            <audio controls className="w-full rounded-lg" key={formData.audioUrl}>
                                <source src={formData.audioUrl} />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}

                </div>

                {/* 3. RIGHT COLUMN: METADATA */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Audio Details</h3>

                        {/* Series Selection */}
                        <div className="bg-brand-sand/20 p-4 rounded-xl border border-brand-gold/20">
                            <label className="flex items-center gap-2 text-xs font-bold text-brand-brown-dark uppercase tracking-wider mb-2">
                                <ListMusic className="w-4 h-4" /> Add to Series (Playlist)
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
                            <p className="text-[10px] text-gray-500 mt-1">
                                Group this track with others (e.g., "Tafsir Part 1" goes into "Tafsir Series").
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Title</label>
                            <input 
                                type="text" 
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. The Importance of Zakat" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Speaker / Author</label>
                            <input 
                                type="text" 
                                name="speaker"
                                value={formData.speaker}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Category</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                >
                                    <option>Friday Sermon</option>
                                    <option>Tafsir Series</option>
                                    <option>Fiqh Class</option>
                                    <option>General Lecture</option>
                                    <option>Seerah</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Date Recorded</label>
                                <input 
                                    type="date" 
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Description (Optional)</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Brief context about the lecture..." 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                            ></textarea>
                        </div>
                    </div>
                </div>

            </div>

        </form>
    );
}
