"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
    label, 
    options = [], 
    value, 
    onChange, 
    placeholder = "Select option", 
    icon: Icon, 
    dir, 
    className,
    disabled = false // Added support for disabled state
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- SMART FIX: Handle both simple strings ["A", "B"] and objects [{label:"A", value:"a"}] ---
    const normalizedOptions = options.map(opt => {
        if (typeof opt === 'object' && opt !== null) return opt;
        return { label: opt, value: opt };
    });

    const selectedOption = normalizedOptions.find(opt => opt.value === value);

    return (
        <div className={`relative ${className || ''}`} ref={dropdownRef}>
            {label && <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{label}</label>}
            
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full px-3 py-3 bg-white border rounded-xl text-sm flex justify-between items-center transition-all 
                ${disabled ? 'bg-gray-100 cursor-not-allowed border-gray-200 opacity-60' : 'cursor-pointer border-gray-200 hover:border-brand-gold/50'}
                ${isOpen && !disabled ? 'ring-2 ring-brand-gold/20 border-brand-gold' : ''}`}
                dir={dir}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {Icon && <Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />}
                    
                    {/* Explicit Text Colors to prevent "Invisible" text */}
                    <span className={`truncate ${selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 min-w-[120px]">
                    {normalizedOptions.length > 0 ? (
                        normalizedOptions.map((opt) => (
                            <div 
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-4 py-3 text-sm cursor-pointer hover:bg-brand-sand/10 flex justify-between items-center border-b border-gray-50 last:border-0 
                                ${value === opt.value ? 'bg-brand-sand/20 text-brand-brown-dark font-bold' : 'text-gray-600'}`}
                                dir={dir}
                            >
                                <span className="truncate">{opt.label}</span>
                                {value === opt.value && <Check className="w-3 h-3 text-brand-gold flex-shrink-0" />}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-xs text-gray-400 text-center">No options available</div>
                    )}
                </div>
            )}
        </div>
    );
}