"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Firebase
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
// UploadThing
import { UploadButton } from '@/lib/uploadthing';

import { 
    PlusCircle, 
    Search, 
    Trash2, 
    Image as ImageIcon, 
    Folder, 
    MoreVertical, 
    Edit,
    FolderPlus,
    Loader2,
    X,
    Calendar
} from 'lucide-react';

export default function ManageGalleryPage() {

    const [activeTab, setActiveTab] = useState('photos'); // 'photos' or 'albums'
    const [isLoading, setIsLoading] = useState(true);

    // Data State
    const [photos, setPhotos] = useState([]);
    const [albums, setAlbums] = useState([]);

    // --- CREATE ALBUM MODAL STATE ---
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
    const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
    const [newAlbum, setNewAlbum] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        cover: ''
    });

    // 1. FETCH DATA (Real-time)
    useEffect(() => {
        setIsLoading(true);

        // Fetch Photos
        const qPhotos = query(collection(db, "gallery_photos"), orderBy("createdAt", "desc"));
        const unsubPhotos = onSnapshot(qPhotos, (snapshot) => {
            setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch Albums
        const qAlbums = query(collection(db, "gallery_albums"), orderBy("createdAt", "desc"));
        const unsubAlbums = onSnapshot(qAlbums, (snapshot) => {
            setAlbums(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setIsLoading(false);
        });

        return () => {
            unsubPhotos();
            unsubAlbums();
        };
    }, []);

    // 2. HANDLE CREATE ALBUM
    const handleSaveAlbum = async (e) => {
        e.preventDefault();
        setIsCreatingAlbum(true);

        try {
            if (!newAlbum.title) {
                alert("Please enter an album title.");
                setIsCreatingAlbum(false);
                return;
            }

            await addDoc(collection(db, "gallery_albums"), {
                ...newAlbum,
                cover: newAlbum.cover || "/hero.jpg",
                createdAt: serverTimestamp()
            });

            alert("Album created successfully!");
            setIsAlbumModalOpen(false);
            setNewAlbum({ title: '', date: new Date().toISOString().split('T')[0], cover: '' });

        } catch (error) {
            console.error("Error creating album:", error);
            alert("Failed to create album.");
        } finally {
            setIsCreatingAlbum(false);
        }
    };

    // 3. HANDLE DELETE
    const handleDelete = async (id, type) => {
        if (!confirm(`Are you sure you want to delete this ${type}? This cannot be undone.`)) return;

        try {
            if (type === 'photo') {
                await deleteDoc(doc(db, "gallery_photos", id));
            } else {
                await deleteDoc(doc(db, "gallery_albums", id));
            }
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete.");
        }
    };

    // Helper: Count photos in an album
    const getPhotoCount = (albumId) => {
        return photos.filter(p => p.albumId === albumId).length;
    };

    // Helper: Get Album Name by ID
    const getAlbumName = (albumId) => {
        const album = albums.find(a => a.id === albumId);
        return album ? album.title : "Uncategorized";
    };

    return (
        <div className="space-y-6 relative">

            {/* 1. HEADER & ACTIONS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">Gallery Manager</h1>
                    <p className="font-lato text-sm text-gray-500">Organize event photos, manage albums, and highlights.</p>
                </div>
                <div className="flex gap-3">
                    {activeTab === 'photos' ? (
                        <Link 
                            href="/admin/gallery/new" 
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-bold hover:bg-brand-brown-dark transition-colors shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Upload Photos
                        </Link>
                    ) : (
                        <button 
                            onClick={() => setIsAlbumModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-brown-dark text-white rounded-xl text-sm font-bold hover:bg-brand-gold transition-colors shadow-md"
                        >
                            <FolderPlus className="w-4 h-4" />
                            Create Album
                        </button>
                    )}
                </div>
            </div>

            {/* 2. TABS & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('photos')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'photos' 
                            ? 'bg-white text-brand-brown-dark shadow-sm' 
                            : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <ImageIcon className="w-4 h-4" /> All Photos
                    </button>
                    <button 
                        onClick={() => setActiveTab('albums')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'albums' 
                            ? 'bg-white text-brand-brown-dark shadow-sm' 
                            : 'text-gray-500 hover:text-brand-brown-dark'
                        }`}
                    >
                        <Folder className="w-4 h-4" /> Event Albums
                    </button>
                </div>
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder={`Search ${activeTab}...`} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50" />
                </div>
            </div>

            {/* 3. CONTENT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
                
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* --- PHOTOS GRID VIEW --- */}
                        {activeTab === 'photos' && (
                            <div className="p-6">
                                {photos.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No photos uploaded yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {photos.map((photo) => (
                                            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer border border-gray-200">
                                                <Image src={photo.url} alt={photo.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                                    <p className="text-white text-xs font-bold truncate">{getAlbumName(photo.albumId)}</p>
                                                    <p className="text-white/70 text-[10px] truncate">{photo.name}</p>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(photo.id, 'photo'); }}
                                                        className="absolute top-2 right-2 bg-white/20 backdrop-blur p-1.5 rounded-full hover:bg-red-500 text-white transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* --- ALBUMS VIEW --- */}
                        {activeTab === 'albums' && (
                            <div className="p-6">
                                {albums.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <Folder className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No albums created yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {albums.map((album) => (
                                            <div key={album.id} className="group cursor-pointer">
                                                {/* Folder Visual */}
                                                <div className="relative w-full aspect-[4/3] mb-3">
                                                    {/* Stack Effect */}
                                                    <div className="absolute top-0 left-2 right-2 bottom-2 bg-gray-200 rounded-xl transform translate-y-2 group-hover:translate-y-3 transition-transform"></div>
                                                    <div className="absolute top-1 left-1 right-1 bottom-1 bg-gray-300 rounded-xl transform translate-y-1 group-hover:translate-y-1.5 transition-transform"></div>
                                                    
                                                    {/* Cover */}
                                                    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white group-hover:border-brand-gold/50 transition-colors">
                                                        <Image src={album.cover} alt={album.title} fill className="object-cover" />
                                                        
                                                        {/* Actions Overlay */}
                                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={(e) => {e.stopPropagation(); handleDelete(album.id, 'album')}} className="bg-white p-1.5 rounded-lg shadow text-gray-500 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                                                        </div>
                                                        
                                                        {/* Count Badge */}
                                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                                                            <ImageIcon className="w-3 h-3" /> {getPhotoCount(album.id)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Info */}
                                                <h3 className="font-agency text-lg text-brand-brown-dark leading-tight group-hover:text-brand-gold transition-colors truncate">
                                                    {album.title}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {album.date}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* --- CREATE ALBUM MODAL --- */}
            {isAlbumModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-agency text-xl text-brand-brown-dark">Create New Album</h3>
                            <button onClick={() => setIsAlbumModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveAlbum} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Album Title</label>
                                <input 
                                    type="text" 
                                    value={newAlbum.title}
                                    onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                                    placeholder="e.g. Ramadan Feeding 2024" 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Event Date</label>
                                <input 
                                    type="date" 
                                    value={newAlbum.date}
                                    onChange={(e) => setNewAlbum({...newAlbum, date: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-2">Cover Photo</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-white hover:border-brand-gold transition-colors">
                                    {newAlbum.cover ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                            <Image src={newAlbum.cover} alt="Cover" fill className="object-cover" />
                                            <button type="button" onClick={() => setNewAlbum({...newAlbum, cover: ''})} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X className="w-3 h-3" /></button>
                                        </div>
                                    ) : (
                                        <UploadButton
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                if (res && res[0]) setNewAlbum(prev => ({ ...prev, cover: res[0].url }));
                                            }}
                                            onUploadError={(error) => alert(`Error! ${error.message}`)}
                                            appearance={{ button: "bg-brand-brown-dark text-white text-xs px-3 py-2 rounded-lg" }}
                                            content={{ button({ ready }) { return ready ? 'Upload Cover' : '...' } }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={isCreatingAlbum}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-md disabled:opacity-50"
                                >
                                    {isCreatingAlbum ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
                                    {isCreatingAlbum ? 'Creating...' : 'Create Album'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
