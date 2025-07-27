// src/pages/ErrorPage.tsx
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
            <h1 className="text-3xl font-bold mb-4">发生错误</h1>
            <p className="mb-6 text-center">页面加载时发生了意外错误，请尝试刷新或返回首页。</p>

            <div className="space-x-4">
                <Button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded"
                >
                    刷新页面
                </Button>
                <Button
                    onClick={() => navigate('/home')}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded"
                >
                    返回首页
                </Button>
            </div>
        </div>
    );
};

export default ErrorPage;
