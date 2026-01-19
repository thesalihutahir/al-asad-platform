"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
// Firebase
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// Global Modal
import { useModal } from '@/context/ModalContext';

import { 
    ArrowLeft, 
    Save, 
    FileText, 
    CheckCircle, 
    Loader2, 
    X,
    Library,
    ImageIcon,
    Globe,
    Lock,
    Calendar
} from 'lucide-react';

export default function EditBookPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const { showSuccess } = useModal();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Data State
    const [allCollections, setAllCollections] = useState([]);
    const [filteredCollections, setFilteredCollections] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        collection: '',
        language: 'English', 
        publisher: 'Al-Asad Foundation', 
        access: 'Free',
        year: '',
        description: '',
    });

    // File States
    const [docFile, setDocFile] = useState(null); // New PDF/EPUB to upload
    const [coverFile, setCoverFile] = useState(null); // New Cover to upload
    
    // Existing Data for Preview
    const [existingFileUrl, setExistingFileUrl] = useState(null);
    const [existingFileName, setExistingFileName] = useState('');
    const [existingCoverUrl, setExistingCoverUrl] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // Helper: Auto-Detect Arabic
    const getDir = (text) => {
        if (!text) return 'ltr';
        const arabicPattern = /[\u0600-\u06FF]/;
        return arabicPattern.test(text) ? 'rtl' : 'ltr';
    };

    // 1. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // A. Fetch Collections
                const qColl = query(collection(db, "ebook_collections"), orderBy("createdAt", "desc"));
                const collSnap = await getDocs(qColl);
                const collData = collSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setAllCollections(collData);

                // B. Fetch Book Document
                const docRef = doc(db, "ebooks", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFormData({
                        title: data.title || '',
                        author: data.author || '',
                        collection: data.collection || '',
                        language: data.language || 'English',
                        publisher: data.publisher || 'Al-Asad Foundation',
                        access: data.access || 'Free',
                        year: data.year || new Date().getFullYear().toString(),
                        description: data.description || '',
                    });

                    // Set initial filter
                    const initialFiltered = collData.filter(c => c.category === (data.language || 'English'));
                    setFilteredCollections(initialFiltered);

                    // Set Existing Files
                    if (data.fileUrl) {
                        setExistingFileUrl(data.fileUrl);
                        setExistingFileName(data.fileName || "Current File");
                    }
                    if (data.coverUrl) {
                        setExistingCoverUrl(data.coverUrl);
                        setCoverPreview(data.coverUrl);
                    }
                } else {
                    alert("Book not found");
                    router.push('/admin/ebooks');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, router]);

    // 2. Filter Collections when Language Changes
    useEffect(() => {
        if (allCollections.length > 0) {
            const filtered = allCollections.filter(c => c.category === formData.language);
            setFilteredCollections(filtered);
        }
    }, [formData.language, allCollections]);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'language') {
            setFormData(prev => ({ ...prev, collection: '' }));
        }
    };

    // Handle File Changes
    const handleDocChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDocFile(file);
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };
const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            alert("Please enter a title.");
            return;
        }

        setIsSubmitting(true);

        try {
            let finalDocUrl = existingFileUrl;
            let finalFileName = existingFileName;
            let finalFileSize = null;
            let finalFileFormat = null;
            let finalCoverUrl = existingCoverUrl;

            // 1. Upload New Document (if selected)
            if (docFile) {
                const docRef = ref(storage, `ebooks/docs/${Date.now()}_${docFile.name}`);
                const uploadTask = uploadBytesResumable(docRef, docFile);

                // Track upload for feedback
                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });

                await uploadTask;
                finalDocUrl = await getDownloadURL(uploadTask.snapshot.ref);
                finalFileName = docFile.name;
                finalFileSize = (docFile.size / (1024 * 1024)).toFixed(2) + " MB";
                finalFileFormat = docFile.name.split('.').pop().toUpperCase();
            }

            // 2. Upload New Cover (if selected)
            if (coverFile) {
                const coverRef = ref(storage, `ebooks/covers/${Date.now()}_${coverFile.name}`);
                const uploadTask = uploadBytesResumable(coverRef, coverFile);
                await uploadTask;
                finalCoverUrl = await getDownloadURL(uploadTask.snapshot.ref);
            }

            // 3. Prepare Update Data
            const updateData = {
                ...formData,
                title: formData.title.trim(),
                fileUrl: finalDocUrl,
                coverUrl: finalCoverUrl,
                fileName: finalFileName,
                updatedAt: new Date().toISOString()
            };

            if (finalFileSize) {
                updateData.fileSize = finalFileSize;
                updateData.fileFormat = finalFileFormat;
            }

            // 4. Update Firestore
            const docRef = doc(db, "ebooks", id);
            await updateDoc(docRef, updateData);

            showSuccess({
                title: "Book Updated!",
                message: "Your changes have been saved successfully.",
                confirmText: "Return to Library",
                onConfirm: () => router.push('/admin/ebooks')
            });

        } catch (error) {
            console.error("Error updating book:", error);
            alert("Failed to update book.");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-12">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-gray-50 z-20 py-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Link href="/admin/ebooks" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-3xl text-brand-brown-dark">Edit eBook</h1>
                        <p className="font-lato text-sm text-gray-500">Update publication details and files.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/ebooks">
                        <button type="button" className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
                            Cancel
                        </button>
                    </Link>
                    <button 
                        type="submit"
                        disabled={isSubmitting} 
                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-md disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Files */}
                <div className="space-y-6">

                    {/* Document Box */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="flex items-center gap-2 text-xs font-bold text-brand-brown-dark uppercase tracking-wider mb-3">
                            <FileText className="w-4 h-4" /> Book File (PDF/EPUB)
                        </label>

                        {existingFileUrl && !docFile && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-bold text-green-700 text-xs">Current File Active</p>
                                    <p className="text-green-600 text-[10px] truncate">{existingFileName}</p>
                                </div>
                            </div>
                        )}

                        <div className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors ${
                            docFile ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:border-brand-gold'
                        }`}>
                            {docFile ? (
                                <div className="text-left w-full flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 line-clamp-1">{docFile.name}</p>
                                        <button type="button" onClick={() => setDocFile(null)} className="text-xs text-red-500 hover:underline">Remove</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full py-4">
                                    <p className="text-xs text-gray-500 font-bold mb-1">Replace File</p>
                                    <input type="file" accept=".pdf,.epub" onChange={handleDocChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                            )}
                        </div>
                        {isSubmitting && docFile && (
                            <p className="text-xs text-center mt-2 text-brand-gold font-bold">Uploading... {Math.round(uploadProgress)}%</p>
                        )}
                    </div>

                    {/* Cover Box */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="flex items-center gap-2 text-xs font-bold text-brand-brown-dark uppercase tracking-wider mb-3">
                            <ImageIcon className="w-4 h-4" /> Book Cover
                        </label>
                        <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
                            {coverPreview ? (
                                <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-300" />
                            )}
                            <input type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-2">Click image to replace</p>
                    </div>

                </div>

                {/* RIGHT: Metadata Inputs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="font-agency text-xl text-brand-brown-dark border-b border-gray-100 pb-2">Publication Details</h3>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                dir={getDir(formData.title)}
                            />
                        </div>

                        {/* Filters Row 1 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Language</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select 
                                        name="language" 
                                        value={formData.language} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50"
                                    >
                                        <option>English</option>
                                        <option>Hausa</option>
                                        <option>Arabic</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Access Type</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select 
                                        name="access" 
                                        value={formData.access} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50"
                                    >
                                        <option>Free</option>
                                        <option>Members Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Filters Row 2 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Publisher</label>
                                <select 
                                    name="publisher" 
                                    value={formData.publisher} 
                                    onChange={handleChange} 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50"
                                >
                                    <option>Al-Asad Foundation</option>
                                    <option>External Publisher</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Publication Year</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="number" 
                                        name="year" 
                                        value={formData.year} 
                                        onChange={handleChange} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Collection Selector */}
                        <div className="bg-brand-sand/20 p-4 rounded-xl border border-brand-gold/20">
                            <label className="flex items-center gap-2 text-xs font-bold text-brand-brown-dark uppercase tracking-wider mb-2">
                                <Library className="w-4 h-4" /> Add to Collection (Series)
                            </label>
                            <select 
                                name="collection" 
                                value={formData.collection} 
                                onChange={handleChange} 
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50 cursor-pointer"
                            >
                                <option value="">Select a Collection (Optional)</option>
                                {filteredCollections.length > 0 ? (
                                    filteredCollections.map(col => <option key={col.id} value={col.title}>{col.title}</option>)
                                ) : (
                                    <option disabled>No collections found for {formData.language}</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-brand-brown mb-1">Description</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows="4" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-gold/50"
                                dir={getDir(formData.description)}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}