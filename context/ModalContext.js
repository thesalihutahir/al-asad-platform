"use client";

import React, { createContext, useContext, useState } from 'react';
import SuccessModal from '@/components/SuccessModal';

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Continue',
        onConfirm: null,
    });

    // The function you will call from your pages
    const showSuccess = ({ title, message, confirmText, onConfirm }) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            confirmText: confirmText || "Continue",
            onConfirm: () => {
                if (onConfirm) onConfirm();
                closeModal();
            }
        });
    };

    const closeModal = () => {
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <ModalContext.Provider value={{ showSuccess }}>
            {children}
            {/* The Modal actually lives here, at the top level of your app */}
            <SuccessModal 
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
            />
        </ModalContext.Provider>
    );
}

// Custom Hook for easy access
export function useModal() {
    return useContext(ModalContext);
}
