// ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { showToast } from '../utils/globalToast';
import NoPermission from '../pages/NoPermission'; // 引入新页面

const isAuthenticated = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

const isAdmin = () => {
        return localStorage.getItem('role')?.toUpperCase() === 'ADMIN';
    };

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
    const [redirect, setRedirect] = useState(false);
    const [noPermission, setNoPermission] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            setRedirect(true);
            return;
        }

        if (requireAdmin && !isAdmin()) {
            setNoPermission(true); // 直接进入无权限状态
            showToast('您没有管理员权限', 'error');
        }
    }, [requireAdmin]);

    if (redirect) {
        return <Navigate to="/login" replace />;
    }

    if (noPermission) {
        return <NoPermission />; // 直接返回无权限页面
    }

    return <>{children}</>;
};

export default ProtectedRoute;
