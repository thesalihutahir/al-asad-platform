"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Firebase
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
// UploadThing
import { UploadDropzone } from '@/lib/uploadthing';

import { 
    ArrowLeft, 
    Save, 
    Folder, 
    X, 
    Image as ImageIcon,
    Loader2,
    CheckCircle
} from 'lucide-react';

export default function UploadPhotosPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingAlbums, setIsLoadingAlbums] = useState(true);

    // Data State
    const [availableAlbums, setAvailableAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState("");
    
    // This holds the successful uploads from UploadThing before we save to DB
    // Structure: { url: string, key: string, name: string }
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // 1. Fetch Albums on Mount
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const q = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const albums = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAvailableAlbums(albums);
            } catch (error) {
                console.error("Error fetching albums:", error);
            } finally {
                setIsLoadingAlbums(false);
            }
        };

        fetchAlbums();
    }, []);

    // Remove file from the "To Be Published" list
    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    // 2. Handle Final Save to Firebase
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (uploadedFiles.length === 0) {
            alert("Please upload at least one photo first.");
            return;
        }

        setIsSubmitting(true);

        try {
            // We save each photo as a separate document
            const uploadPromises = uploadedFiles.map(file => {
                return addDoc(collection(db, "gallery_photos"), {
                    url: file.url,
                    fileKey: file.key, // Good for future deletion via API
                    name: file.name,
                    albumId: selectedAlbum || "uncategorized",
                    createdAt: serverTimestamp()
                });
            });

            await Promise.all(uploadPromises);

            alert(`Successfully published ${uploadedFiles.length} photos!`);
            router.push('/admin/gallery');

        } catch (error) {
            console.error("Error saving photos:", error);
            alert("Failed to save photos to database.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/gallery" className="p-2 hover:bg-gray-200 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Upload Photos</h1>
                        <p className="font-lato text-sm text-gray-500">Add memories to the gallery.</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Link href="/admin/gallery" className="flex-1 md:flex-none">
                        <button type="button" className="w-full px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 text-center justify-center">
                            Cancel
                        </button>
                    </Link>
                    <button 
                        type="submit" 
                        disabled={uploadedFiles.length === 0 || isSubmitting} 
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 font-bold rounded-xl shadow-md text-white transition-colors ${
                            uploadedFiles.length > 0 
                            ? 'bg-brand-gold hover:bg-brand-brown-dark' 
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? 'Saving...' : `Publish (${uploadedFiles.length})`}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Upload & Album Settings */}
                <div className="space-y-6">

                    {/* Album Selector */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            <Folder className="w-4 h-4 text-brand-gold" /> Assign to Album
                        </label>
                        <select 
                            value={selectedAlbum} 
                            onChange={(e) => setSelectedAlbum(e.target.value)} 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 cursor-pointer"
                        >
                            <option value="">-- No Album (Stream Only) --</option>
                            {isLoadingAlbums ? (
                                <option disabled>Loading albums...</option>
                            ) : (
                                availableAlbums.map(alb => (
                                    <option key={alb.id} value={alb.id}>{alb.title}</option>
                                ))
                            )}
                        </select>
                        <p className="text-[10px] text-gray-400 mt-2">
                            Photos not assigned to an album will appear in the general "Recent Moments" stream.
                        </p>
                    </div>

                    {/* UploadThing Dropzone */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-brand-brown-dark text-sm mb-3 px-2">Add Photos</h3>
                        
                        <UploadDropzone
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                if (res) {
                                    // Append new files to existing state
                                    const newFiles = res.map(file => ({
                                        url: file.url,
                                        key: file.key,
                                        name: file.name
                                    }));
                                    setUploadedFiles(prev => [...prev, ...newFiles]);
                                    alert(`${res.length} photo(s) uploaded! Review them on the right.`);
                                }
                            }}
                            onUploadError={(error) => {
                                alert(`Error: ${error.message}`);
                            }}
                            appearance={{
                                container: "border-2 border-dashed border-brand-gold/30 bg-brand-sand/10 rounded-xl h-64 hover:bg-brand-sand/20 transition-colors",
                                label: "text-brand-brown-dark hover:text-brand-gold",
                                button: "bg-brand-brown-dark text-white text-xs px-4 py-2 rounded-lg font-bold"
                            }}
                        />
                        <p className="text-[10px] text-gray-400 text-center mt-2">
                            Max 4MB per file. You can upload multiple files at once.
                        </p>
                    </div>
                </div>

                {/* RIGHT: Preview Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                        <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2 mb-4 flex justify-between items-center">
                            <span>Ready to Publish</span>
                            <span className="text-xs font-lato text-gray-400">{uploadedFiles.length} items</span>
                        </h3>

                        {uploadedFiles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-300">
                                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                <p className="text-sm">No photos uploaded yet</p>
                                <p className="text-xs mt-1">Use the box on the left to add photos</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {uploadedFiles.map((file, index) => (
                                    <div key={file.key || index} className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100 shadow-sm border border-gray-200">
                                        <Image 
                                            src={file.url} 
                                            alt="Preview" 
                                            fill 
                                            className="object-cover" 
                                        />
                                        
                                        {/* Success Checkmark overlay */}
                                        <div className="absolute top-2 left-2 bg-white rounded-full text-green-500 p-0.5 shadow-sm">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>

                                        {/* Remove Button */}
                                        <button 
                                            type="button" 
                                            onClick={() => removeFile(index)} 
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            title="Remove from list"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>

                                        {/* Filename caption */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 backdrop-blur-sm">
                                            <p className="text-[10px] text-white truncate text-center">{file.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </form>
    );
}
