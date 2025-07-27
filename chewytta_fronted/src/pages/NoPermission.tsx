// src/pages/NoPermission.tsx
import React, { useEffect } from 'react';

const NoPermission: React.FC = () => {
    useEffect(() => {
        // 设置 2 秒后跳转并刷新页面
        const timer = setTimeout(() => {
            window.location.href = '/home';
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black">
            <div className="text-center p-8 border rounded shadow-md animate-pulse">
                <h1 className="text-2xl font-bold mb-4">无权限访问</h1>
                <p className="mb-6 text-gray-700">您没有访问该页面的权限。</p>
                <p className="text-sm text-gray-500">2 秒后将自动返回首页...</p>
            </div>
        </div>
    );
};

export default NoPermission;
