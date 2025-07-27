// src/components/RootRedirect.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RootRedirect: React.FC = () => {
    // 无论是否登录，都重定向到登录页
    return <Navigate to="/login" replace />;
};

export default RootRedirect;
