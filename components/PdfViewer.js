"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Loader2, AlertTriangle } from 'lucide-react';

// Configure PDF Worker (Crucial for Next.js)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// 'react-pdf' css (Optional: standard text layer styles)
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PdfViewer({ url, onClose }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Responsive Width Logic
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        const resizeObserver = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width;
            setContainerWidth(width);
            
            // Auto-scale on mobile
            if (width < 600) setScale(0.8); 
            else setScale(1.0);
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    function onDocumentLoadError(err) {
        console.error("PDF Load Error:", err);
        setError("Failed to load document.");
        setLoading(false);
    }

    const changePage = (offset) => {
        setPageNumber(prev => Math.min(Math.max(1, prev + offset), numPages));
    };

    const zoom = (factor) => {
        setScale(prev => Math.min(Math.max(0.5, prev + factor), 2.5));
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col h-screen">
            
            {/* 1. TOP TOOLBAR */}
            <div className="bg-brand-brown-dark text-white p-4 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <span className="font-agency text-xl tracking-wide hidden md:block">Document Reader</span>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4 bg-black/20 rounded-full px-4 py-1.5">
                    <button 
                        disabled={pageNumber <= 1} 
                        onClick={() => changePage(-1)}
                        className="disabled:opacity-30 hover:text-brand-gold transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-mono w-20 text-center">
                        {pageNumber} / {numPages || '--'}
                    </span>
                    <button 
                        disabled={pageNumber >= numPages} 
                        onClick={() => changePage(1)}
                        className="disabled:opacity-30 hover:text-brand-gold transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <button onClick={() => zoom(-0.2)} className="p-2 hover:bg-white/10 rounded-full hidden md:block">
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <button onClick={() => zoom(0.2)} className="p-2 hover:bg-white/10 rounded-full hidden md:block">
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 2. DOCUMENT CANVAS */}
            <div className="flex-grow overflow-auto bg-gray-800 flex justify-center p-4 md:p-8" ref={containerRef}>
                
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p>Loading Document...</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400">
                        <AlertTriangle className="w-12 h-12 mb-4" />
                        <p>{error}</p>
                        <button onClick={onClose} className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-bold">
                            Close Reader
                        </button>
                    </div>
                )}

                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null} // We handle custom loader above
                    className="shadow-2xl"
                >
                    <Page 
                        pageNumber={pageNumber} 
                        scale={scale}
                        width={containerWidth ? Math.min(containerWidth - 40, 800) : 600} // Responsive width
                        className="shadow-xl"
                        renderAnnotationLayer={false} // Performance optimization
                        renderTextLayer={false} // Performance optimization
                    />
                </Document>
            </div>
        </div>
    );
}