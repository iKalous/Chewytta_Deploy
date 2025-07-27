// src/context/ToastContext.tsx
import { createContext } from 'react';

interface ToastContextType {
    showPermissionDeniedToast: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
