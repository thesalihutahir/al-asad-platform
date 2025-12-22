"use client";

import React, { useState } from 'react';
import { 
    Save, 
    Globe, 
    Lock, 
    Shield, 
    ToggleLeft, 
    ToggleRight,
    Smartphone,
    Mail,
    MapPin
} from 'lucide-react';

export default function SettingsPage() {

    // Mock Settings State
    const [siteConfig, setSiteConfig] = useState({
        contactEmail: "info@alasadfoundation.org",
        contactPhone: "+234 800 000 0000",
        address: "No 12, Katsina GRA, Katsina State",
        maintenanceMode: false
    });

    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const handleConfigChange = (e) => {
        setSiteConfig({ ...siteConfig, [e.target.name]: e.target.value });
    };

    const toggleMaintenance = () => {
        setSiteConfig(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
    };

    const handleSave = () => {
        alert("Settings Updated Successfully! (Frontend Demo)");
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            
            {/* 1. HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="font-agency text-3xl text-brand-brown-dark">System Settings</h1>
                    <p className="font-lato text-sm text-gray-500">Manage global configurations and account security.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-md"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 2. LEFT COL: GENERAL CONFIGURATION */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-agency text-xl text-brand-brown-dark mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                            <Globe className="w-5 h-5 text-brand-gold" />
                            General Site Information
                        </h3>
                        <p className="text-xs text-gray-400 mb-6">
                            These details will update the Footer and Contact page dynamically.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Public Contact Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="email" 
                                        name="contactEmail"
                                        value={siteConfig.contactEmail}
                                        onChange={handleConfigChange}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Official Phone Number</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        name="contactPhone"
                                        value={siteConfig.contactPhone}
                                        onChange={handleConfigChange}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Office Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        name="address"
                                        value={siteConfig.address}
                                        onChange={handleConfigChange}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-agency text-xl text-brand-brown-dark mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                            <Shield className="w-5 h-5 text-brand-gold" />
                            System Control
                        </h3>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-brand-brown text-sm">Maintenance Mode</h4>
                                <p className="text-xs text-gray-400">Take the public website offline temporarily.</p>
                            </div>
                            <button onClick={toggleMaintenance} className={`transition-colors ${siteConfig.maintenanceMode ? 'text-brand-gold' : 'text-gray-300'}`}>
                                {siteConfig.maintenanceMode ? (
                                    <ToggleRight className="w-10 h-10" />
                                ) : (
                                    <ToggleLeft className="w-10 h-10" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT COL: SECURITY */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-agency text-xl text-brand-brown-dark mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                            <Lock className="w-5 h-5 text-brand-gold" />
                            Admin Security
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Current Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-brown mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/50"
                                />
                            </div>

                            <div className="pt-2">
                                <button className="w-full py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg hover:bg-gray-200 transition-colors">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
