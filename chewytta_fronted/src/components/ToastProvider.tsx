// src/components/ToastProvider.tsx
import React, { useState } from 'react';
import { ToastContext } from '../context/ToastContext';
import Toast from './Toast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showToast, setShowToast] = useState(false);

    const showPermissionDeniedToast = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // 不需要额外的初始化逻辑
    // 通过Context提供showPermissionDeniedToast方法供子组件使用

    return (
        <ToastContext.Provider value={{ showPermissionDeniedToast }}>
            {children}
            <Toast message="您没有权限访问该页面" visible={showToast} onClose={() => setShowToast(false)} />
        </ToastContext.Provider>
    );
};
