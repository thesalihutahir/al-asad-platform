"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, UploadCloud, Mic, CheckCircle } from 'lucide-react';

export default function AddPodcastPage() {

    const availableShows = [
        { id: 1, title: "The Young Believer" },
        { id: 2, title: "Faith & Finance" },
        { id: 3, title: "Family Matters" }
    ];

    const [formData, setFormData] = useState({
        title: '',
        show: '',
        episodeNumber: '',
        season: '1',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [audioFile, setAudioFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setAudioFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!audioFile) {
            alert("Please upload an audio file.");
            return;
        }
        alert(`Podcast "${formData.title}" ready! \nShow: ${formData.show}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto pb-12">
            
            {/* Header */}
            <div className="flex justify-between items-center gap-4 sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/podcasts" className="p-2 hover:bg-gray-200 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Upload Episode</h1>
                        <p className="font-lato text-sm text-gray-500">Add a new episode to a podcast show.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="button" className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={!audioFile} className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl shadow-md text-white ${audioFile ? 'bg-brand-gold hover:bg-brand-brown-dark' : 'bg-gray-300 cursor-not-allowed'}`}>
                        <Save className="w-4 h-4" /> Publish
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* File Upload */}
                <div className="space-y-6">
                    <div className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center h-64 ${audioFile ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300 hover:border-brand-gold'}`}>
                        {audioFile ? (
                            <div>
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8" /></div>
                                <h3 className="font-bold text-brand-brown-dark text-lg truncate px-4">{audioFile.name}</h3>
                                <button type="button" onClick={() => setAudioFile(null)} className="text-red-500 text-sm font-bold hover:underline mt-2">Change File</button>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4"><UploadCloud className="w-8 h-8" /></div>
                                <h3 className="font-bold text-gray-700 text-lg">Upload Podcast Audio</h3>
                                <p className="text-xs text-gray-400 mt-1">MP3, AAC, WAV (Max 100MB)</p>
                                <input type="file" accept="audio/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Episode Details</h3>
                    
                    {/* Show Selector */}
                    <div className="bg-brand-sand/20 p-4 rounded-xl border border-brand-gold/20">
                        <label className="flex items-center gap-2 text-xs font-bold text-brand-brown-dark uppercase tracking-wider mb-2">
                            <Mic className="w-4 h-4" /> Select Show
                        </label>
                        <select name="show" value={formData.show} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50 cursor-pointer">
                            <option value="">Select a Podcast Show...</option>
                            {availableShows.map(show => <option key={show.id} value={show.title}>{show.title}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-brown mb-1">Episode Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Episode No.</label>
                            <input type="number" name="episodeNumber" value={formData.episodeNumber} onChange={handleChange} placeholder="e.g. 05" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Publish Date</label>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-brown mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50"></textarea>
                    </div>
                </div>
            </div>
        </form>
    );
}
