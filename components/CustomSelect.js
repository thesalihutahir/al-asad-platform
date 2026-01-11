"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ label, options, value, onChange, placeholder, icon: Icon, dir, className }) {
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

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className || ''}`} ref={dropdownRef}>
            {label && <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{label}</label>}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm flex justify-between items-center cursor-pointer transition-all hover:border-brand-gold/50 ${isOpen ? 'ring-2 ring-brand-gold/20 border-brand-gold' : ''}`}
                dir={dir}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {Icon && <Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />}
                    <span className={`truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-700 font-medium'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 min-w-[120px]">
                    {options.map((opt) => (
                        <div 
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setIsOpen(false); }}
                            className={`px-4 py-3 text-sm cursor-pointer hover:bg-brand-sand/10 flex justify-between items-center ${value === opt.value ? 'bg-brand-sand/20 text-brand-brown-dark font-bold' : 'text-gray-600'}`}
                            dir={dir}
                        >
                            {opt.label}
                            {value === opt.value && <Check className="w-3 h-3 text-brand-gold" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
