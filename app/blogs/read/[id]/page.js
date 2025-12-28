"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Loader from '@/components/Loader';
// Firebase
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

import { 
    Calendar, User, Clock, Tag, Download, 
    ArrowLeft, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon,
    Quote, FileText, Layers, Heart, ThumbsUp
} from 'lucide-react';

// --- HELPER: Date Formatter ---
const formatDate = (dateString) => {
    try {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-GB', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });
    } catch (e) { return dateString; }
};

// --- COMPONENT: Like Button ---
const LikeButton = ({ postId, initialLikes }) => {
    const [likes, setLikes] = useState(initialLikes || 0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        // Check local storage to see if user already liked this specific post
        const hasLiked = localStorage.getItem(`liked_${postId}`);
        if (hasLiked) setLiked(true);
    }, [postId]);

    const handleLike = async () => {
        if (liked) return; // Prevent double like

        // 1. Optimistic UI Update
        setLikes(prev => prev + 1);
        setLiked(true);
        localStorage.setItem(`liked_${postId}`, 'true');

        // 2. Update Firebase
        try {
            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, {
                likes: increment(1)
            });
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    return (
        <button 
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all transform active:scale-95 ${
                liked 
                ? 'bg-red-50 text-red-500 border border-red-200' 
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            }`}
        >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="font-bold text-sm">{likes} {liked ? 'Liked' : 'Like'}</span>
        </button>
    );
};

// ==========================================
// LAYOUT 1: ARTICLE (Clean, Reader-Focused)
// ==========================================
const ArticleLayout = ({ post }) => (
    <div className="bg-white">
        {/* Minimalist Header */}
        <div className="max-w-3xl mx-auto px-6 pt-8 md:pt-16 pb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
                <span className="px-3 py-1 bg-brand-gold/10 text-brand-brown-dark text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full">
                    {post.category}
                </span>
                {post.language && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full">
                        {post.language}
                    </span>
                )}
            </div>
            <h1 className="font-agency text-4xl md:text-6xl text-brand-brown-dark leading-tight mb-6">
                {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-gray-500 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden relative">
                        <Image src="/fallback.webp" alt="Author" fill className="object-cover" />
                    </div>
                    <span className="font-bold text-gray-800">{post.author || "Al-Asad Foundation"}</span>
                </div>
                <span className="hidden md:inline">•</span>
                <span>{formatDate(post.date)}</span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-6 pb-20">
            {/* Hero Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 shadow-lg bg-gray-100">
                <Image src={post.coverImage || "/fallback.webp"} alt={post.title} fill className="object-cover" />
            </div>
            
            {/* Markdown Rendered Content */}
            <article className="prose prose-lg prose-stone max-w-none font-serif leading-loose prose-headings:font-agency prose-headings:text-brand-brown-dark prose-a:text-brand-gold hover:prose-a:text-brand-brown-dark prose-img:rounded-xl">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </article>

            {/* Reactions & Tags */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <LikeButton postId={post.id} initialLikes={post.likes || 0} />
                
                <div className="flex flex-wrap gap-2 justify-center">
                    {post.tags && (typeof post.tags === 'string' ? post.tags.split(',') : post.tags).map((tag, idx) => (
                        <span key={idx} className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded text-sm hover:bg-gray-100 cursor-pointer transition-colors">
                            #{tag.trim()}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// ==========================================
// LAYOUT 2: NEWS (Magazine/Bold Style)
// ==========================================
const NewsLayout = ({ post, relatedPosts }) => (
    <div className="bg-gray-50 min-h-screen">
        {/* High Impact Header */}
        <div className="bg-brand-brown-dark text-white pt-24 pb-20 md:pb-32 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-4 text-brand-gold font-bold uppercase tracking-widest text-xs">
                    <span>News Update</span>
                    <span>/</span>
                    <span>{formatDate(post.date)}</span>
                </div>
                <h1 className="font-agency text-4xl md:text-7xl max-w-4xl leading-none mb-6">
                    {post.title}
                </h1>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-12 md:-mt-20 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative z-20">
            {/* Left: Main Content */}
            <div className="lg:col-span-8">
                <div className="bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 bg-gray-100">
                        <Image src={post.coverImage || "/fallback.webp"} alt={post.title} fill className="object-cover" />
                    </div>
                    
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                         <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User className="w-4 h-4" /> {post.author}
                         </div>
                         <LikeButton postId={post.id} initialLikes={post.likes || 0} />
                    </div>

                    <article className="prose prose-lg max-w-none font-lato prose-headings:font-bold prose-headings:text-gray-900">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </article>
                </div>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                {/* Related News */}
                <div className="bg-brand-brown-dark p-6 rounded-xl text-white">
                    <h3 className="font-agency text-xl mb-4">Latest Updates</h3>
                    <div className="space-y-4">
                        {relatedPosts.map(item => (
                            <Link key={item.id} href={`/blogs/read/${item.id}`} className="block group border-b border-white/10 pb-3 last:border-0">
                                <span className="text-xs text-brand-gold">{formatDate(item.date)}</span>
                                <h4 className="font-bold leading-tight group-hover:text-brand-gold transition-colors">{item.title}</h4>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// ==========================================
// LAYOUT 3: RESEARCH (Academic/Formal Style)
// ==========================================
const ResearchLayout = ({ post }) => (
    <div className="bg-[#f8f9fa] min-h-screen font-lato">
        {/* Academic Header */}
        <div className="bg-white border-b border-gray-200 py-12 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                    <div className="flex gap-2 mb-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-blue-100">
                            Research Paper
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-gray-200">
                            {post.language}
                        </span>
                    </div>
                    <h1 className="font-serif text-3xl md:text-5xl text-gray-900 leading-tight mb-4">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(post.date)}</span>
                    </div>
                </div>
                <div className="lg:col-span-1 flex justify-start lg:justify-end gap-3">
                    <LikeButton postId={post.id} initialLikes={post.likes || 0} />
                    {post.pdfUrl && (
                        <a href={post.pdfUrl} target="_blank" className="flex items-center gap-3 px-6 py-2 bg-blue-700 text-white rounded shadow hover:bg-blue-800 transition-colors">
                            <Download className="w-4 h-4" />
                            <span className="text-sm font-bold">PDF</span>
                        </a>
                    )}
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar (Left) */}
            <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
                <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {post.tags && (typeof post.tags === 'string' ? post.tags.split(',') : post.tags).map((tag, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-4">Cite this paper</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 font-mono break-all border border-gray-200">
                        {post.author}. ({new Date(post.date).getFullYear()}). {post.title}. Al-Asad Foundation Research.
                    </div>
                </div>
            </div>

            {/* Main Content (Right) */}
            <div className="lg:col-span-9 order-1 lg:order-2">
                {/* Abstract Box */}
                {post.excerpt && (
                    <div className="bg-white p-8 rounded-lg border-l-4 border-blue-700 shadow-sm mb-10">
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm mb-3">Abstract</h3>
                        <p className="text-gray-700 italic leading-relaxed">{post.excerpt}</p>
                    </div>
                )}

                <div className="bg-white p-6 md:p-10 rounded-lg border border-gray-200 shadow-sm">
                    {/* Featured Image inside paper */}
                    <div className="relative w-full aspect-[21/9] bg-gray-100 mb-8 rounded overflow-hidden">
                        <Image src={post.coverImage || "/fallback.webp"} alt="Figure 1" fill className="object-cover" />
                    </div>

                    <article className="prose prose-slate max-w-none prose-h2:text-blue-800 prose-a:text-blue-600">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </article>
                </div>
            </div>
        </div>
    </div>
);
// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function BlogPostPage() {
    // Safely unwrap params
    const params = useParams();
    const id = params?.id;
    const router = useRouter();
    
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostData = async () => {
            if (!id) return;
            setLoading(true);

            try {
                // A. Fetch Main Post
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const postData = { id: docSnap.id, ...docSnap.data() };
                    setPost(postData);

                    // B. Fetch Related (Based on Category)
                    if (postData.category) {
                        const qRelated = query(
                            collection(db, "posts"),
                            where("category", "==", postData.category),
                            where("status", "==", "Published"),
                            orderBy("createdAt", "desc"),
                            limit(4) 
                        );
                        const relatedSnap = await getDocs(qRelated);
                        const related = relatedSnap.docs
                            .map(doc => ({ id: doc.id, ...doc.data() }))
                            .filter(p => p.id !== id)
                            .slice(0, 3);
                        setRelatedPosts(related);
                    }
                } else {
                    setPost(null);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <Loader size="full" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-lato">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                    <h1 className="font-agency text-4xl text-brand-brown-dark mb-4">404 | Post Not Found</h1>
                    <p className="text-gray-500 mb-8">The content you requested might have been removed or is unavailable.</p>
                    <Link href="/blogs/articles" className="px-8 py-3 bg-brand-gold text-white rounded-full font-bold">
                        Back to Library
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // --- DYNAMIC LAYOUT SWITCHER ---
    return (
        <div className="min-h-screen flex flex-col font-lato">
            <Header />
            
            <main className="flex-grow">
                {post.category === 'Research' ? (
                    <ResearchLayout post={post} relatedPosts={relatedPosts} />
                ) : post.category === 'News' ? (
                    <NewsLayout post={post} relatedPosts={relatedPosts} />
                ) : (
                    // Default to Article Layout
                    <ArticleLayout post={post} relatedPosts={relatedPosts} />
                )}
            </main>

            <Footer />
        </div>
    );
}
