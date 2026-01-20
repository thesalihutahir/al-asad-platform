"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomSelect from '@/components/CustomSelect'; 
import { useModal } from '@/context/ModalContext'; 
// Firebase
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { MapPin, Phone, Mail, Globe, Facebook, Youtube, Instagram, Twitter, MessageCircle, Loader2, Send, Clock, SendHorizonal } from 'lucide-react';

export default function ContactPage() {
    const { showSuccess } = useModal();
    
    // --- STATE ---
    const [loading, setLoading] = useState(true);
    
    // Dynamic Data
    const [teamLead, setTeamLead] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [contactInfo, setContactInfo] = useState({
        address: 'Loading address...',
        email: 'Loading email...',
        phone: 'Loading phone...',
        facebook: '', twitter: '', instagram: '', youtube: '', whatsapp: '', telegram: ''
    });

    // Form State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const subjects = ["General Inquiry", "Media & Press", "Volunteering", "Donation Support", "Other"];

    // --- 1. FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // A. Fetch Contact Settings
                const infoSnap = await getDoc(doc(db, "general_settings", "contact_info"));
                if (infoSnap.exists()) {
                    setContactInfo(infoSnap.data());
                }

                // B. Fetch Team Members
                const teamQ = query(collection(db, "team_members"), orderBy("createdAt", "desc"));
                const teamSnap = await getDocs(teamQ);
                const allMembers = teamSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Separate Lead
                const lead = allMembers.find(m => m.isLead);
                const rest = allMembers.filter(m => m.id !== lead?.id);

                setTeamLead(lead || null);
                setTeamMembers(rest);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- 2. HANDLE FORM ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.email || !formData.message || !formData.subject) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "contact_messages"), {
                ...formData,
                status: "New",
                createdAt: serverTimestamp()
            });

            setFormData({ fullName: '', email: '', subject: '', message: '' });
            showSuccess({
                title: "Message Sent!",
                message: "Thank you for reaching out. Our team will get back to you shortly.",
                confirmText: "Close"
            });

        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper: Social Icons
    const socialLinks = [
        { icon: Facebook, href: contactInfo.facebook, color: "hover:bg-blue-600" },
        { icon: Twitter, href: contactInfo.twitter, color: "hover:bg-black" },
        { icon: Instagram, href: contactInfo.instagram, color: "hover:bg-pink-600" },
        { icon: Youtube, href: contactInfo.youtube, color: "hover:bg-red-600" },
        { icon: MessageCircle, href: contactInfo.whatsapp, color: "hover:bg-green-500" },
        { icon: SendHorizonal, href: contactInfo.telegram, color: "hover:bg-blue-400" }, // Telegram icon
    ].filter(link => link.href && link.href.length > 5);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-lato">
            <Header />

            <main className="flex-grow pb-0">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-brand-brown-dark mb-12 md:mb-20">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[3.5/1] lg:aspect-[4/1]">
                        <Image
                            src="/images/heroes/contact-hero.webp"
                            alt="Contact Us"
                            fill
                            className="object-cover object-center opacity-40"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-brown-dark via-transparent to-transparent"></div>
                    </div>

                    <div className="relative -mt-20 md:-mt-32 text-center px-6 z-10 max-w-4xl mx-auto pb-16">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-white mb-4 drop-shadow-lg">
                            Contact Us
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
                        <p className="font-lato text-white/80 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            Have questions, want to get involved, or need media resources? We are here to listen and assist you.
                        </p>
                    </div>
                </section>

                {/* 2. CONTACT GRID */}
                <section className="px-6 md:px-12 lg:px-24 mb-16 md:mb-24 max-w-7xl mx-auto -mt-10 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT: Info Cards */}
                        <div className="space-y-6 lg:col-span-1">
                            
                            {/* Main Contact Card */}
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold group-hover:w-2 transition-all"></div>
                                <h2 className="font-agency text-2xl text-brand-brown-dark mb-6 flex items-center gap-2">
                                    Get in Touch
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-sand/30 flex items-center justify-center text-brand-brown-dark flex-shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-gray-400 uppercase mb-1">Visit Us</p>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {contactInfo.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-sand/30 flex items-center justify-center text-brand-brown-dark flex-shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs text-gray-400 uppercase mb-1">Call Us</p>
                                            <a href={`tel:${contactInfo.phone}`} className="block text-sm text-brand-brown hover:text-brand-gold font-bold transition-colors">
                                                {contactInfo.phone}
                                            </a>
                                            <a href={`mailto:${contactInfo.email}`} className="block text-sm text-gray-600 hover:text-brand-gold mt-1 break-all">
                                                {contactInfo.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Working Hours / Visit Card */}
                            <div className="bg-brand-brown-dark p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
                                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                                <h3 className="font-agency text-2xl mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-brand-gold" /> Opening Hours
                                </h3>
                                <div className="space-y-3 text-sm text-white/80 font-lato">
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span>Mon - Fri</span>
                                        <span className="font-bold text-white">9:00 AM - 5:00 PM</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-2">
                                        <span>Saturday</span>
                                        <span className="font-bold text-white">10:00 AM - 2:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Sunday</span>
                                        <span className="text-brand-gold">Closed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Socials Grid */}
                            {socialLinks.length > 0 && (
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="font-bold text-xs text-gray-400 uppercase mb-4 text-center">Connect With Us</p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {socialLinks.map((social, idx) => {
                                            const Icon = social.icon;
                                            return (
                                                <Link 
                                                    key={idx} 
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center transition-all transform hover:scale-110 hover:text-white shadow-sm ${social.color}`}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 h-full">
                                <h2 className="font-agency text-3xl md:text-4xl text-brand-brown-dark mb-2">
                                    Send a Message
                                </h2>
                                <p className="text-gray-500 text-sm mb-8">We usually respond within 24 hours.</p>

                                <form onSubmit={handleFormSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all focus:bg-white" 
                                                placeholder="John Doe" 
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Address</label>
                                            <input 
                                                type="email" 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all focus:bg-white" 
                                                placeholder="you@example.com" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <CustomSelect 
                                                label="Subject"
                                                options={subjects}
                                                value={formData.subject}
                                                onChange={(val) => setFormData({...formData, subject: val})}
                                                placeholder="Select Subject"
                                            />
                                        </div>
                                        {/* Empty div for layout balance or maybe phone number later */}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Message</label>
                                        <textarea 
                                            rows="5" 
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-all focus:bg-white resize-none" 
                                            placeholder="How can we help you?"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                            required
                                        ></textarea>
                                    </div>
                                    
                                    <div className="pt-2">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full md:w-auto px-8 py-3.5 bg-brand-gold text-white font-agency text-lg rounded-xl hover:bg-brand-brown-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Message <Send className="w-4 h-4" /></>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. LIVE MAP SECTION */}
                <section className="w-full h-[450px] relative bg-gray-200 border-t border-gray-200">
                    {/* Google Maps Embed - Pointing to Katsina (Generic or Specific) */}
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.675402360416!2d7.592535374953923!3d12.997232987317765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11b03cb067570e31%3A0x7704870f70676239!2sKatsina!5e0!3m2!1sen!2sng!4v1709228812345!5m2!1sen!2sng"
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, filter: 'grayscale(100%)' }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="hover:filter-none transition-all duration-700"
                    ></iframe>

                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 pointer-events-none">
                        <MapPin className="w-4 h-4 text-red-500 animate-bounce" />
                        <span className="font-agency text-brand-brown-dark text-lg">Locate Us in Katsina</span>
                    </div>
                </section>

                {/* 4. DYNAMIC MEDIA TEAM */}
                <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="font-agency text-3xl md:text-5xl text-brand-brown-dark mb-3">
                                Meet Our Team
                            </h2>
                            <div className="w-20 h-1.5 bg-brand-gold mx-auto rounded-full mb-6"></div>
                            <p className="font-lato text-brand-brown text-base md:text-xl max-w-2xl mx-auto">
                                The dedicated faces behind our mission, working tirelessly to serve the community.
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-12"><Loader2 className="w-10 h-10 animate-spin text-brand-gold" /></div>
                        ) : (
                            <>
                                {/* 3a. TEAM LEAD */}
                                {teamLead && (
                                    <div className="flex justify-center mb-16">
                                        <div className="group flex flex-col items-center w-full max-w-[280px]">
                                            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-2xl border-4 border-brand-gold bg-brand-sand transform group-hover:scale-105 transition-transform duration-500">
                                                <Image 
                                                    src={teamLead.image || "/fallback.webp"} 
                                                    alt={teamLead.name} 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                                    <span className="text-white font-agency text-lg tracking-wider">Team Lead</span>
                                                </div>
                                            </div>
                                            <h3 className="font-agency text-3xl text-brand-brown-dark leading-none mb-2">
                                                {teamLead.name}
                                            </h3>
                                            <p className="font-lato text-xs font-bold text-white bg-brand-brown-dark px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                                                {teamLead.role}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* 3b. REST OF THE TEAM */}
                                {teamMembers.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
                                        {teamMembers.map((member) => (
                                            <div key={member.id} className="group flex flex-col items-center">
                                                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-md bg-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                                                    <Image 
                                                        src={member.image || "/fallback.webp"} 
                                                        alt={member.name} 
                                                        fill 
                                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                                                    />
                                                </div>
                                                <h3 className="font-agency text-lg md:text-xl text-brand-brown-dark leading-none text-center mb-1 group-hover:text-brand-gold transition-colors">
                                                    {member.name}
                                                </h3>
                                                <p className="font-lato text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider text-center">
                                                    {member.role}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    !teamLead && <p className="text-center text-gray-400 italic">Team members will be listed here.</p>
                                )}
                            </>
                        )}
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
