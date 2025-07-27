// src/components/GlobalToast.tsx
import React, { useContext, useEffect } from 'react';
import Toast from './Toast';
import { ToastContext } from '../context/ToastContext';
import { showToast } from '../utils/globalToast';

const GlobalToast: React.FC = () => {
    const { showPermissionDeniedToast } = useContext(ToastContext)!;

    // 不需要初始化，直接使用 showToast 函数

    return (
        <Toast
            message="您没有权限访问该页面"
            visible={false}
            onClose={() => { }}
        />
    );
};

export default GlobalToast;
