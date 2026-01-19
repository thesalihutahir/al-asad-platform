"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
// Firebase
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

import { 
    Play, Pause, Volume2, Calendar, User, Download, Share2, Heart, 
    MessageCircle, Send, Check, ArrowLeft, ListMusic, FileText 
} from 'lucide-react';

// --- HELPER: Date Formatter ---
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

// --- COMPONENT: Social Share ---
const SocialShare = ({ title }) => {
    const [copied, setCopied] = useState(false);
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') setUrl(window.location.href);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!url) return null;

    return (
        <button 
            onClick={handleCopy} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-brand-gold hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
        >
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied' : 'Share'}
        </button>
    );
};

// --- COMPONENT: Like Button ---
const LikeButton = ({ audioId, initialLikes }) => {
    const [likes, setLikes] = useState(initialLikes || 0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const hasLiked = localStorage.getItem(`liked_audio_${audioId}`);
        if (hasLiked) setLiked(true);
    }, [audioId]);

    const handleLike = async () => {
        if (liked) return;
        setLikes(prev => prev + 1);
        setLiked(true);
        localStorage.setItem(`liked_audio_${audioId}`, 'true');
        try {
            const docRef = doc(db, "audios", audioId);
            await updateDoc(docRef, { likes: increment(1) });
        } catch (error) { console.error("Error liking:", error); }
    };

    return (
        <button 
            onClick={handleLike} 
            disabled={liked} 
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-wider ${
                liked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
        >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{likes} Likes</span>
        </button>
    );
};

// --- COMPONENT: Comments ---
const CommentsSection = ({ audioId, isArabic }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "audios", audioId, "comments"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [audioId]);

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !authorName.trim()) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "audios", audioId, "comments"), { 
                text: newComment, 
                author: authorName, 
                createdAt: serverTimestamp() 
            });
            setNewComment('');
        } catch (error) { console.error("Error posting comment:", error); } 
        finally { setIsSubmitting(false); }
    };

    return (
        <div className="mt-12 border-t border-gray-100 pt-8" dir={isArabic ? 'rtl' : 'ltr'}>
            <h3 className={`font-agency text-2xl text-brand-brown-dark mb-6 flex items-center gap-2 ${isArabic ? 'font-tajawal' : ''}`}>
                <MessageCircle className="w-5 h-5" /> {isArabic ? 'التعليقات' : 'Discussion'}
            </h3>
            
            <form onSubmit={handlePostComment} className="mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-1">
                        <input 
                            type="text" 
                            value={authorName} 
                            onChange={(e) => setAuthorName(e.target.value)} 
                            placeholder={isArabic ? "الاسم" : "Your Name"} 
                            className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${isArabic ? 'font-arabic' : ''}`} 
                            required 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <input 
                            type="text"
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder={isArabic ? "شارك برأيك..." : "Join the conversation..."} 
                            className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${isArabic ? 'font-arabic' : ''}`} 
                            required
                        />
                    </div>
                </div>
                <div className={`flex ${isArabic ? 'justify-start' : 'justify-end'}`}>
                    <button type="submit" disabled={isSubmitting} className="bg-brand-brown-dark text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-brand-gold transition-colors flex items-center gap-2 disabled:opacity-50">
                        {isSubmitting ? 'Posting...' : <>{isArabic ? 'إرسال' : 'Post Comment'} <Send className={`w-3 h-3 ${isArabic ? 'rotate-180' : ''}`} /></>}
                    </button>
                </div>
            </form>

            <div className="space-y-6">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-brand-sand flex items-center justify-center text-brand-brown-dark font-bold text-xs flex-shrink-0">
                                {comment.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-brand-brown-dark text-sm">{comment.author}</span>
                                    <span className="text-xs text-gray-400 opacity-60">• Just now</span>
                                </div>
                                <p className={`text-gray-600 text-sm leading-relaxed ${isArabic ? 'font-arabic' : ''}`}>{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm italic">{isArabic ? "كن أول من يعلق!" : "Be the first to share your thoughts."}</p>
                )}
            </div>
        </div>
    );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function AudioPlayPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    // Data State
    const [audio, setAudio] = useState(null);
    const [relatedAudios, setRelatedAudios] = useState([]);
    const [seriesImage, setSeriesImage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchAudioData = async () => {
            if (!id) return;
            try {
                // 1. Get Audio Data
                const docRef = doc(db, "audios", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setAudio({ id: docSnap.id, ...data });

                    // Increment Plays
                    updateDoc(docRef, { plays: increment(1) });

                    // 2. Fetch Series Image (if part of a series)
                    if (data.series) {
                        const qSeries = query(collection(db, "audio_series"), where("title", "==", data.series));
                        const seriesSnap = await getDocs(qSeries);
                        if (!seriesSnap.empty) {
                            setSeriesImage(seriesSnap.docs[0].data().cover);
                        }

                        // 3. Fetch Related (Same Series)
                        const qRelated = query(
                            collection(db, "audios"), 
                            where("series", "==", data.series),
                            orderBy("date", "desc"),
                            limit(5)
                        );
                        const relatedSnap = await getDocs(qRelated);
                        const related = relatedSnap.docs
                            .map(d => ({ id: d.id, ...d.data() }))
                            .filter(a => a.id !== id);
                        setRelatedAudios(related);
                    } else {
                        // 3B. If no series, fetch SAME CATEGORY (Language) instead of Genre
                        const qRelated = query(
                            collection(db, "audios"), 
                            where("category", "==", data.category),
                            orderBy("date", "desc"),
                            limit(5)
                        );
                        const relatedSnap = await getDocs(qRelated);
                        const related = relatedSnap.docs
                            .map(d => ({ id: d.id, ...d.data() }))
                            .filter(a => a.id !== id);
                        setRelatedAudios(related);
                    }
                } else {
                    router.push('/media/audios');
                }
            } catch (error) {
                console.error("Error fetching audio:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAudioData();
    }, [id, router]);

    // --- PLAYER CONTROLS ---
    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (loading) return <Loader size="lg" className="h-screen bg-brand-sand" />;
    if (!audio) return null;

    const isArabic = audio.category === 'Arabic';
    const coverImage = seriesImage || "/images/heroes/media-audios-hero.webp"; // Fallback to hero if no series cover

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow">
                {/* 1. PLAYER SECTION */}
                <div className="bg-brand-brown-dark text-white py-12 md:py-16 px-6">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        
                        {/* Cover Art */}
                        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black">
                            <Image 
                                src={coverImage} 
                                alt={audio.title} 
                                fill 
                                className={`object-cover ${isPlaying ? 'scale-105' : 'scale-100'} transition-transform duration-700`} 
                            />
                            {/* Spinning Disc Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                        </div>

                        {/* Controls */}
                        <div className="flex-grow w-full text-center md:text-left">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-brand-gold text-white text-[10px] font-bold uppercase rounded mb-2 tracking-widest">
                                    {audio.category}
                                </span>
                                <h1 className={`text-2xl md:text-4xl font-bold leading-tight mb-2 ${isArabic ? 'font-tajawal' : 'font-agency'}`} dir={isArabic ? 'rtl' : 'ltr'}>
                                    {audio.title}
                                </h1>
                                <p className="text-white/60 font-bold text-sm uppercase tracking-wide flex items-center justify-center md:justify-start gap-2">
                                    <User className="w-4 h-4 text-brand-gold" /> {audio.speaker}
                                </p>
                            </div>

                            {/* Audio Element (Hidden) */}
                            <audio 
                                ref={audioRef} 
                                src={audio.audioUrl} 
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onEnded={() => setIsPlaying(false)}
                            />

                            {/* Progress Bar */}
                            <div className="mb-6">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max={duration} 
                                    value={progress} 
                                    onChange={handleSeek}
                                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-gold hover:accent-white transition-all"
                                />
                                <div className="flex justify-between text-xs font-mono text-white/50 mt-2">
                                    <span>{formatTime(progress)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-center md:justify-start gap-6">
                                <button 
                                    onClick={togglePlay}
                                    className="w-16 h-16 bg-white text-brand-brown-dark rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg hover:shadow-brand-gold/20"
                                >
                                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                                </button>
                                
                                <div className="flex gap-3">
                                    <a 
                                        href={audio.audioUrl} 
                                        download 
                                        target="_blank"
                                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-brown-dark transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. DETAILS & SIDEBAR GRID */}
                <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* LEFT: INFO & COMMENTS */}
                    <div className="lg:col-span-8">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-8" dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="flex gap-6 text-sm text-gray-500 font-bold uppercase tracking-wider">
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-gold" /> {formatDate(audio.date)}</div>
                                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-brand-gold" /> {audio.fileSize}</div>
                            </div>
                            <div className="flex gap-3">
                                <LikeButton audioId={audio.id} initialLikes={audio.likes || 0} />
                                <SocialShare title={audio.title} />
                            </div>
                        </div>

                        <div className="prose prose-stone max-w-none text-gray-600 leading-loose font-lato" dir={isArabic ? 'rtl' : 'ltr'}>
                            <h3 className={`text-xl font-bold text-brand-brown-dark mb-4 ${isArabic ? 'font-tajawal' : 'font-agency'}`}>
                                {isArabic ? 'حول هذا المقطع' : 'About this Audio'}
                            </h3>
                            <p className={isArabic ? 'font-arabic text-lg' : ''}>
                                {audio.description || "No description provided for this audio track."}
                            </p>
                        </div>

                        <CommentsSection audioId={audio.id} isArabic={isArabic} />
                    </div>

                    {/* RIGHT: UP NEXT */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-brand-sand/30 p-6 rounded-2xl border border-brand-sand">
                            <h3 className="font-agency text-xl text-brand-brown-dark mb-6 flex items-center gap-2">
                                <ListMusic className="w-5 h-5 text-brand-gold" /> 
                                {audio.series ? 'More in Series' : 'Similar Audios'}
                            </h3>
                            
                            <div className="space-y-3">
                                {relatedAudios.length > 0 ? (
                                    relatedAudios.map((item) => (
                                        <Link key={item.id} href={`/media/audios/play/${item.id}`} className="group flex gap-3 items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all">
                                            <div className="w-10 h-10 rounded-full bg-brand-sand text-brand-gold flex-shrink-0 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-colors">
                                                <Play className="w-4 h-4 fill-current ml-0.5" />
                                            </div>
                                            <div className="min-w-0 flex-grow" dir={getDir(item.title)}>
                                                <h4 className={`text-sm font-bold text-brand-brown-dark leading-tight truncate group-hover:text-brand-gold transition-colors ${getDir(item.title) === 'rtl' ? 'font-tajawal' : ''}`}>
                                                    {item.title}
                                                </h4>
                                                <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide">
                                                    {item.duration || item.fileSize}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        <ListMusic className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        No related tracks found.
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-brand-brown/10 text-center">
                                <Link href="/media/audios" className="inline-block text-xs font-bold text-brand-brown-dark uppercase tracking-widest hover:text-brand-gold transition-colors">
                                    Browse Library
                                </Link>
                            </div>
                        </div>
                    </aside>

                </div>
            </main>

            <Footer />
        </div>
    );
}
