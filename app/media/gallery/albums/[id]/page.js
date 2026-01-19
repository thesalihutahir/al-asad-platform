"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
// Firebase Imports
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { 
    ArrowLeft, Search, ImageIcon, Calendar, X, 
    Download, Share2, MapPin, Grid 
} from 'lucide-react';

export default function ViewAlbumPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    // --- STATE ---
    const [album, setAlbum] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [filteredPhotos, setFilteredPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Lightbox State
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // Aspect ratios for Masonry
    const aspectRatios = ["aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[3/5]"];

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // 1. Fetch Album Details
                const docRef = doc(db, "gallery_albums", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const albumData = { id: docSnap.id, ...docSnap.data() };
                    setAlbum(albumData);

                    // 2. Fetch Photos in this Album
                    const qPhotos = query(
                        collection(db, "gallery_photos"),
                        where("albumId", "==", id),
                        orderBy("createdAt", "desc")
                    );
                    
                    const photoSnap = await getDocs(qPhotos);
                    const fetchedPhotos = photoSnap.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setPhotos(fetchedPhotos);
                    setFilteredPhotos(fetchedPhotos);
                } else {
                    console.error("Album not found");
                    router.push('/media/gallery/albums');
                }
            } catch (error) {
                console.error("Error fetching album data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    // --- FILTER LOGIC ---
    useEffect(() => {
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const results = photos.filter(photo => 
                photo.name.toLowerCase().includes(term)
            );
            setFilteredPhotos(results);
        } else {
            setFilteredPhotos(photos);
        }
    }, [searchTerm, photos]);

    // --- HELPER: Lightbox Actions ---
    const openLightbox = (photo) => setSelectedPhoto(photo);
    const closeLightbox = () => setSelectedPhoto(null);

    const handleDownload = async (url, name) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = name || 'gallery-photo.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(url, '_blank');
        }
    };

    const handleShare = (url) => {
        if (navigator.share) {
            navigator.share({
                title: 'Al-Asad Gallery',
                text: 'Check out this photo from Al-Asad Foundation',
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    // --- HELPER: Format Date ---
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) return <Loader size="lg" className="h-screen bg-brand-sand" />;
    if (!album) return null;

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-20">
                
                {/* 1. IMMERSIVE HEADER SECTION */}
                <div className="relative w-full bg-brand-brown-dark overflow-hidden">
                    {/* Blurred Backdrop */}
                    <div className="absolute inset-0">
                        <Image 
                            src={album.cover || "/fallback.webp"} 
                            alt="Backdrop" 
                            fill 
                            className="object-cover opacity-20 blur-3xl scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-brand-brown-dark/80 to-brand-brown-dark"></div>
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24">
                        {/* Back Link */}
                        <Link href="/media/gallery/albums" className="inline-flex items-center text-white/60 hover:text-brand-gold mb-8 text-xs font-bold uppercase tracking-widest transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Collections
                        </Link>

                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left">
                            
                            {/* Cover Art (Folder Style) */}
                            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                                {/* Stack Cards */}
                                <div className="absolute top-0 left-3 right-3 bottom-3 bg-white/10 rounded-3xl transform rotate-3"></div>
                                <div className="absolute top-1 left-1 right-1 bottom-1 bg-white/20 rounded-3xl transform -rotate-2"></div>
                                
                                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-gray-800">
                                    <Image 
                                        src={album.cover || "/fallback.webp"} 
                                        alt={album.title} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-grow flex flex-col justify-center h-full pt-2 text-white">
                                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                                    <span className="px-3 py-1 bg-brand-gold text-white rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
                                        <Grid className="w-3 h-3" /> {photos.length} Photos
                                    </span>
                                </div>

                                <h1 className="font-agency text-4xl md:text-6xl font-bold mb-4 leading-tight">
                                    {album.title}
                                </h1>

                                <div className="flex items-center gap-2 text-white/70 font-bold uppercase tracking-wide text-xs md:text-sm mb-6 justify-center md:justify-start">
                                    <Calendar className="w-4 h-4 text-brand-gold" />
                                    <span>Created: {formatDate(album.createdAt)}</span>
                                </div>

                                <p className="font-lato text-white/80 text-sm md:text-lg leading-relaxed max-w-2xl">
                                    {album.description || "A collection of moments from this event."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PHOTOS GRID SECTION */}
                <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 md:p-10 min-h-[400px]">
                        
                        {/* Header & Search */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                            <h2 className="font-agency text-3xl text-brand-brown-dark">
                                Album Photos
                            </h2>
                            <div className="relative w-full md:w-72">
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search in this album..."
                                    className="w-full pl-10 pr-4 py-3 bg-brand-sand/30 border border-transparent focus:bg-white focus:border-brand-gold rounded-xl text-sm focus:outline-none transition-all"
                                />
                                <Search className="absolute w-4 h-4 text-gray-400 top-1/2 -translate-y-1/2 left-3" />
                            </div>
                        </div>

                        {/* Masonry Grid */}
                        {filteredPhotos.length > 0 ? (
                            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                                {filteredPhotos.map((photo, index) => {
                                    // Assign a cyclical aspect ratio for the masonry look
                                    const aspectRatio = aspectRatios[index % aspectRatios.length];

                                    return (
                                        <div 
                                            key={photo.id} 
                                            onClick={() => openLightbox(photo)}
                                            className="relative w-full break-inside-avoid rounded-2xl overflow-hidden shadow-md group cursor-zoom-in bg-gray-200"
                                        >
                                            <div className={`relative w-full ${aspectRatio}`}>
                                                <Image
                                                    src={photo.url}
                                                    alt={photo.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-brand-brown-dark/0 group-hover:bg-brand-brown-dark/60 transition-colors duration-300"></div>

                                                {/* Icon on Hover */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                                        <Search className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-bold">No photos found.</p>
                                <p className="text-xs">This album might be empty.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. LIGHTBOX MODAL (Shared) */}
                {selectedPhoto && (
                    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                        {/* Close Button */}
                        <button 
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Image Container */}
                        <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center">
                            <Image 
                                src={selectedPhoto.url} 
                                alt="Gallery View" 
                                fill 
                                className="object-contain"
                            />
                        </div>

                        {/* Bottom Bar (Actions) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 md:p-8 flex justify-between items-end">
                            <div className="text-white">
                                <h3 className="font-agency text-xl md:text-2xl mb-1">{album.title}</h3>
                                <div className="flex items-center gap-1 text-white/70 text-[10px]">
                                    <MapPin className="w-3 h-3" /> 
                                    <span className="uppercase tracking-wider">Katsina</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleDownload(selectedPhoto.url, selectedPhoto.name)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold text-xs uppercase tracking-wider hover:bg-brand-gold hover:text-white transition-colors"
                                >
                                    <Download className="w-4 h-4" /> <span className="hidden md:inline">Download</span>
                                </button>
                                <button 
                                    onClick={() => handleShare(selectedPhoto.url)}
                                    className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    );
}
