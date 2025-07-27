// src/routes/router.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// 检查登录状态
const isAuthenticated = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

// 检查是否为管理员
const isAdmin = () => {
    return localStorage.getItem('role')?.toUpperCase() === 'ADMIN';
};

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/no-permission" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
