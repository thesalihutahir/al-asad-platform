"use client";

import React from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, title, message, onConfirm, confirmText = "Continue" }) {
    if (!isOpen) return null;

    return (
        // 1. BACKDROP (Darkens the background)
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-brown-dark/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            
            {/* 2. MODAL BOX */}
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border-2 border-brand-gold overflow-hidden transform animate-in zoom-in-95 duration-200">
                
                {/* Decoration Header */}
                <div className="h-2 bg-brand-gold w-full"></div>

                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    {/* Content */}
                    <h3 className="font-agency text-3xl text-brand-brown-dark mb-2">
                        {title || "Success!"}
                    </h3>
                    <p className="font-lato text-gray-500 mb-8 leading-relaxed">
                        {message || "Action completed successfully."}
                    </p>

                    {/* Action Button */}
                    <button 
                        onClick={onConfirm || onClose}
                        className="w-full py-3.5 bg-brand-gold text-white font-bold rounded-xl hover:bg-brand-brown-dark transition-colors shadow-lg shadow-brand-gold/20 tracking-wide uppercase text-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
