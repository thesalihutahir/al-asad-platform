"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useModal } from '@/context/ModalContext';
import { 
    ArrowLeft, Save, Loader2, ShieldAlert, Lock, 
    Construction, EyeOff, FileText, ToggleLeft, ToggleRight,
    AlertTriangle, CheckCircle, Fingerprint
} from 'lucide-react';

export default function SecuritySettingsPage() {
    const { showSuccess, showConfirm } = useModal();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // --- CONFIGURATION STATE ---
    const [config, setConfig] = useState({
        maintenance: {
            enabled: false,
            message: "We are currently performing scheduled maintenance. Please check back soon."
        },
        preLaunch: {
            enabled: false,
            hideDonations: true,
            hidePages: false // Generalized toggle for now
        },
        security: {
            auditLogging: true,
            restrictSettings: false, // Only Super Admin can edit settings
            requireTwoFactor: false
        }
    });

    // --- FETCH SETTINGS ---
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "security");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setConfig(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error loading security settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // --- HANDLERS ---
    
    // Generic Nested Update
    const updateConfig = (section, key, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, "settings", "security"), {
                ...config,
                updatedAt: serverTimestamp()
            });
            
            showSuccess({
                title: "Security Settings Updated",
                message: "Your platform access rules have been successfully applied."
            });
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save security settings.");
        } finally {
            setSaving(false);
        }
    };

    const confirmMaintenanceToggle = () => {
        if (!config.maintenance.enabled) {
            showConfirm({
                title: "Enable Maintenance Mode?",
                message: "This will make the public site inaccessible to visitors. Only admins will be able to access the dashboard.",
                confirmText: "Yes, Activate",
                type: "danger",
                onConfirm: () => updateConfig('maintenance', 'enabled', true)
            });
        } else {
            updateConfig('maintenance', 'enabled', false);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-gold" /></div>;

    return (
        <div className="max-w-5xl mx-auto pb-20 px-4">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-gray-100 pb-6 pt-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/settings" className="p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-brand-brown-dark">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-agency text-4xl text-brand-brown-dark leading-none mb-1">Security & Access</h1>
                        <p className="font-lato text-sm text-gray-500">Manage site availability and admin privileges.</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-brand-gold text-white rounded-xl font-bold text-sm hover:bg-brand-brown-dark transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? "Saving..." : "Save Configuration"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. MAINTENANCE MODE */}
                <div className={`rounded-3xl shadow-sm border p-6 sm:p-8 transition-all ${config.maintenance.enabled ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`font-agency text-xl flex items-center gap-2 ${config.maintenance.enabled ? 'text-red-700' : 'text-brand-brown-dark'}`}>
                            <Construction className="w-5 h-5" /> Maintenance Mode
                        </h2>
                        <button 
                            onClick={confirmMaintenanceToggle}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${config.maintenance.enabled ? 'bg-red-200 text-red-800' : 'bg-gray-100 text-gray-500'}`}
                        >
                            {config.maintenance.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                            {config.maintenance.enabled ? 'Active' : 'Inactive'}
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            When active, public visitors will see a maintenance screen. You can still access the admin dashboard.
                        </p>
                        
                        <div className={`transition-opacity duration-300 ${!config.maintenance.enabled && 'opacity-50 pointer-events-none'}`}>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Visitor Message</label>
                            <textarea 
                                rows="3"
                                value={config.maintenance.message} 
                                onChange={(e) => updateConfig('maintenance', 'message', e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all resize-none font-medium text-gray-700" 
                                placeholder="We will be back shortly..." 
                            />
                        </div>
                    </div>
                </div>

                {/* 2. PRE-LAUNCH CONTROL */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-agency text-xl text-brand-brown-dark flex items-center gap-2">
                            <Lock className="w-5 h-5 text-brand-gold" /> Pre-Launch Mode
                        </h2>
                        <button 
                            onClick={() => updateConfig('preLaunch', 'enabled', !config.preLaunch.enabled)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${config.preLaunch.enabled ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}
                        >
                            {config.preLaunch.enabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                            {config.preLaunch.enabled ? 'Active' : 'Inactive'}
                        </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                        Restrict specific features while preparing for launch. Useful for soft launches.
                    </p>

                    <div className={`space-y-4 transition-opacity duration-300 ${!config.preLaunch.enabled && 'opacity-50 pointer-events-none'}`}>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <EyeOff className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-bold text-gray-700">Hide Donation Buttons</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={config.preLaunch.hideDonations} 
                                onChange={(e) => updateConfig('preLaunch', 'hideDonations', e.target.checked)}
                                className="w-5 h-5 accent-brand-gold rounded cursor-pointer" 
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <EyeOff className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-bold text-gray-700">Hide "Get Involved" Pages</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={config.preLaunch.hidePages} 
                                onChange={(e) => updateConfig('preLaunch', 'hidePages', e.target.checked)}
                                className="w-5 h-5 accent-brand-gold rounded cursor-pointer" 
                            />
                        </div>
                    </div>
                </div>

                {/* 3. ADMIN ACCESS & LOGGING */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:col-span-2">
                    <h2 className="font-agency text-xl text-brand-brown-dark mb-6 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-brand-gold" /> Security Policies
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Audit Logging */}
                        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:border-brand-gold/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-brand-brown-dark text-sm">Audit Logging</h4>
                                    <button onClick={() => updateConfig('security', 'auditLogging', !config.security.auditLogging)}>
                                        {config.security.auditLogging ? <ToggleRight className="w-6 h-6 text-green-600" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">Track all changes made to site settings and content.</p>
                            </div>
                        </div>

                        {/* Restricted Settings */}
                        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl hover:border-brand-gold/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-brand-brown-dark text-sm">Lock Site Settings</h4>
                                    <button onClick={() => updateConfig('security', 'restrictSettings', !config.security.restrictSettings)}>
                                        {config.security.restrictSettings ? <ToggleRight className="w-6 h-6 text-green-600" /> : <ToggleLeft className="w-6 h-6 text-gray-300" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">Only Super Admins can modify global configuration.</p>
                            </div>
                        </div>

                        {/* 2FA (Mock/Future) */}
                        <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-2xl opacity-60">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                                <Fingerprint className="w-5 h-5" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-brand-brown-dark text-sm">Require 2FA</h4>
                                    <Lock className="w-3 h-3 text-gray-400" />
                                </div>
                                <p className="text-xs text-gray-500">Enforce two-factor authentication for all staff (Premium feature).</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
