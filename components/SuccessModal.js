"use client";

import React from 'react';
import { Check, AlertTriangle, Trash2, X } from 'lucide-react';

export default function SuccessModal({ 
    isOpen, 
    onClose, 
    type = 'success', 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "Continue", 
    cancelText
}) {
    if (!isOpen) return null;

    const isDanger = type === 'danger';

    return (
        // 1. BACKDROP: Slightly darker, stronger blur for focus
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-brown-dark/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            
            {/* 2. MODAL BOX: Compact, Rounded, clean white */}
            <div className="bg-white w-[90%] max-w-[340px] rounded-3xl shadow-2xl shadow-brand-brown-dark/20 transform animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 overflow-hidden">
                
                <div className="p-6 text-center">
                    
                    {/* 3. ICON: Minimalist with a soft ring effect */}
                    <div className={`mx-auto flex items-center justify-center w-14 h-14 rounded-full mb-5 transition-transform duration-500 hover:scale-110 ${
                        isDanger 
                        ? 'bg-red-50 text-red-500 ring-4 ring-red-50' 
                        : 'bg-green-50 text-green-600 ring-4 ring-green-50'
                    }`}>
                        {isDanger ? (
                            <Trash2 className="w-6 h-6" strokeWidth={2.5} />
                        ) : (
                            <Check className="w-7 h-7" strokeWidth={3} />
                        )}
                    </div>

                    {/* 4. CONTENT: Tight typography */}
                    <h3 className="font-agency text-2xl text-brand-brown-dark mb-2">
                        {title || "Success!"}
                    </h3>
                    <p className="font-lato text-sm text-gray-500 leading-relaxed px-2 mb-6">
                        {message || "Action completed successfully."}
                    </p>

                    {/* 5. ACTIONS: Stacked on mobile if needed, but side-by-side here for compactness */}
                    <div className="flex gap-3">
                        {cancelText && (
                            <button 
                                onClick={onCancel || onClose}
                                className="flex-1 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors text-xs tracking-wide"
                            >
                                {cancelText}
                            </button>
                        )}

                        <button 
                            onClick={onConfirm || onClose}
                            className={`flex-1 py-2.5 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-xs tracking-wide ${
                                isDanger 
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                                : 'bg-brand-gold hover:bg-brand-brown-dark shadow-brand-gold/20'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}