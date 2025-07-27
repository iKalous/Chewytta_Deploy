// src/components/Toast.tsx
import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    visible: boolean;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, visible, onClose }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg transition-opacity duration-300 ease-in-out opacity-100"
            style={{ zIndex: 9999 }}
        >
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-white font-bold">
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Toast;
