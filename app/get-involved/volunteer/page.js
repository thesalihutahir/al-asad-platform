"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomSelect from '@/components/CustomSelect'; // Using Custom Component
import { useModal } from '@/context/ModalContext'; // Using Custom Modal
// Firebase
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { BookOpen, Truck, Laptop, HeartHandshake, Calendar, User, Phone, Mail, MapPin, Loader2, Globe } from 'lucide-react';

export default function VolunteerPage() {
    const { showSuccess } = useModal();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        nationality: 'Nigeria',
        state: '',
        department: 'Teaching & Education',
        availability: 'Weekends Only',
        experience: ''
    });

    // --- DYNAMIC LOCATION DATA ---
    const countryData = {
        "Nigeria": [
            "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
        ],
        "Ghana": ["Greater Accra", "Ashanti", "Northern", "Western", "Eastern", "Volta", "Central", "Upper East", "Upper West", "Brong-Ahafo"],
        "Niger": ["Agadez", "Diffa", "Dosso", "Maradi", "Niamey", "Tahoua", "Tillabéri", "Zinder"],
        "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
        "United States": ["California", "Texas", "Florida", "New York", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina", "Michigan", "Other"],
        "Saudi Arabia": ["Riyadh", "Makkah", "Madinah", "Eastern Province", "Asir", "Tabuk", "Hail", "Northern Borders", "Jizan", "Najran", "Al Bahah", "Al Jawf", "Al Qassim"],
        "Cameroon": ["Centre", "Littoral", "Adamawa", "Far North", "North", "Northwest", "South", "Southwest", "East", "West"],
        "Other": ["Other / International"]
    };

    const countries = Object.keys(countryData);
    const [availableStates, setAvailableStates] = useState(countryData["Nigeria"]);

    // Update states when nationality changes
    useEffect(() => {
        setAvailableStates(countryData[formData.nationality] || []);
        // Reset state selection if the new country doesn't contain the current state
        if (!countryData[formData.nationality]?.includes(formData.state)) {
            setFormData(prev => ({ ...prev, state: '' }));
        }
    }, [formData.nationality]);

    // Handle Standard Inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Custom Selects
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phone || !formData.state) {
            alert("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "volunteers"), {
                ...formData,
                status: "Pending",
                submittedAt: serverTimestamp()
            });

            // Trigger Custom Success Modal
            showSuccess({
                title: "Application Received!",
                message: "Jazakumullahu Khairan for your interest. We will review your profile and contact you shortly.",
                confirmText: "Close",
                onConfirm: () => {
                    setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        nationality: 'Nigeria',
                        state: '',
                        department: 'Teaching & Education',
                        availability: 'Weekends Only',
                        experience: ''
                    });
                }
            });

        } catch (error) {
            console.error("Error submitting application:", error);
            alert("Failed to submit application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-lato">
            <Header />

            <main className="flex-grow pb-16">

                {/* 1. HERO SECTION */}
                <section className="w-full relative bg-white mb-10 md:mb-16">
                    <div className="relative w-full aspect-[2.5/1] md:aspect-[3.5/1] lg:aspect-[4/1]">
                        <Image
                            src="/images/heroes/get-involved-volunteer-hero.webp" 
                            alt="Volunteer with Us"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-brand-gold/40 to-transparent "></div>
                    </div>

                    <div className="relative -mt-16 md:-mt-32 text-center px-6 z-10 max-w-4xl mx-auto">
                        <h1 className="font-agency text-4xl md:text-6xl lg:text-7xl text-brand-brown-dark mb-4 drop-shadow-md">
                            Join the Khidmah
                        </h1>
                        <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
                        <p className="font-lato text-brand-brown text-sm md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                            "The most beloved people to Allah are those who are most beneficial to people."
                        </p>
                    </div>
                </section>

                {/* 2. MAIN CONTENT SPLIT */}
                <div className="px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-7xl mx-auto">

                    {/* LEFT: INFO */}
                    <div className="flex-1 lg:sticky lg:top-32 lg:self-start space-y-8">
                        <div>
                            <h2 className="font-agency text-3xl text-brand-brown-dark mb-4 relative inline-block">
                                Why Volunteer?
                                <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-brand-gold rounded-full"></span>
                            </h2>
                            <p className="font-lato text-base text-gray-600 leading-relaxed mb-4 text-justify md:text-left">
                                Volunteering at Al-Asad Foundation is more than just a task; it is an act of worship (Ibadah) and service (Khidmah). By dedicating your time, you become part of a legacy that uplifts the ignorant through knowledge and feeds the hungry through charity.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-brand-sand/30 p-6 rounded-2xl border-l-4 border-brand-gold flex gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-white p-2 rounded-full h-fit text-brand-brown-dark"><BookOpen className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-agency text-xl text-brand-brown-dark mb-1">Education Unit</h3>
                                    <p className="font-lato text-sm text-gray-600">Tutoring, mentoring students, or organizing Islamic classes.</p>
                                </div>
                            </div>
                            <div className="bg-brand-sand/30 p-6 rounded-2xl border-l-4 border-brand-brown-dark flex gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-white p-2 rounded-full h-fit text-brand-brown-dark"><Truck className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-agency text-xl text-brand-brown-dark mb-1">Welfare & Aid</h3>
                                    <p className="font-lato text-sm text-gray-600">Food distribution, logistics for events, and community support.</p>
                                </div>
                            </div>
                            <div className="bg-brand-sand/30 p-6 rounded-2xl border-l-4 border-brand-gold flex gap-4 hover:shadow-md transition-shadow">
                                <div className="bg-white p-2 rounded-full h-fit text-brand-brown-dark"><Laptop className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="font-agency text-xl text-brand-brown-dark mb-1">Professional Skills</h3>
                                    <p className="font-lato text-sm text-gray-600">Medical, Tech/IT, Legal, or Media support.</p>
                                </div>
                            </div>
                        </div>
                    </div>
{/* RIGHT: APPLICATION FORM */}
                    <div className="flex-[1.5]">
                        <div className="bg-white rounded-3xl shadow-2xl border-t-8 border-brand-brown-dark p-6 md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-sand opacity-20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <HeartHandshake className="w-8 h-8 text-brand-gold" />
                                    <h2 className="font-agency text-3xl md:text-4xl text-brand-brown-dark">
                                        Volunteer Application
                                    </h2>
                                </div>
                                <p className="font-lato text-sm md:text-base text-gray-500 mb-10 pl-1">
                                    Please fill out this form to register your interest. Our team will review your profile and contact you soon.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {/* Personal Details */}
                                    <div className="space-y-6">
                                        <h3 className="font-agency text-xl text-brand-brown-dark uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                            <User className="w-4 h-4 text-brand-gold" /> Personal Details
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Full Name *</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors"
                                                        placeholder="Enter your name"
                                                    />
                                                    <User className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Phone Number *</label>
                                                <div className="relative">
                                                    <input 
                                                        type="tel" 
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors"
                                                        placeholder="080..."
                                                    />
                                                    <Phone className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
                                                <div className="relative">
                                                    <input 
                                                        type="email" 
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors"
                                                        placeholder="you@example.com"
                                                    />
                                                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                                </div>
                                            </div>
                                            
                                            {/* NATIONALITY DROPDOWN (CUSTOM) */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Nationality</label>
                                                <CustomSelect 
                                                    name="nationality"
                                                    value={formData.nationality}
                                                    options={countries}
                                                    onChange={(val) => handleSelectChange('nationality', val)}
                                                    icon={Globe}
                                                />
                                            </div>
                                        </div>

                                        {/* STATE DROPDOWN (DYNAMIC) */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">State / Region *</label>
                                            <CustomSelect 
                                                name="state"
                                                value={formData.state}
                                                options={availableStates}
                                                onChange={(val) => handleSelectChange('state', val)}
                                                icon={MapPin}
                                                placeholder={availableStates.length > 0 ? "Select State" : "No states available"}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Service Interest */}
                                    <div className="space-y-6 pt-2">
                                        <h3 className="font-agency text-xl text-brand-brown-dark uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-brand-gold" /> Availability & Skills
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Department of Interest</label>
                                                <CustomSelect 
                                                    name="department"
                                                    value={formData.department}
                                                    options={[
                                                        "Teaching & Education",
                                                        "Welfare & Distribution",
                                                        "Media & Content",
                                                        "Medical Team",
                                                        "Event Logistics",
                                                        "Tech & IT Support"
                                                    ]}
                                                    onChange={(val) => handleSelectChange('department', val)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Availability</label>
                                                <CustomSelect 
                                                    name="availability"
                                                    value={formData.availability}
                                                    options={[
                                                        "Weekends Only",
                                                        "Weekdays (Part-time)",
                                                        "Remote / Online",
                                                        "Flexible / Event based"
                                                    ]}
                                                    onChange={(val) => handleSelectChange('availability', val)}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Skills / Experience</label>
                                            <textarea 
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-brand-brown-dark focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-white transition-colors resize-none"
                                                placeholder="Briefly describe your skills, profession, or any previous volunteer experience that might be relevant..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-brand-brown-dark text-white font-agency text-xl rounded-xl hover:bg-brand-gold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Submit Application'}
                                        </button>
                                        <p className="text-center text-xs text-gray-400 mt-4">
                                            By submitting, you agree to be contacted by our team.
                                        </p>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}