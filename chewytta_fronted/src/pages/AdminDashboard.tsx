// src/pages/AdminDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-10">
            {/* 退出按钮 */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => {
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('role');
                        window.location.href = '/login';
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    退出登录
                </button>
            </div>

            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8">管理员后台</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        to="/admin/boxes"
                        className="p-6 bg-white rounded shadow hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-xl font-semibold mb-2">管理盲盒</h2>
                        <p>查看、添加、编辑、删除盲盒</p>
                    </Link>

                    <Link
                        to="/admin/users"
                        className="p-6 bg-white rounded shadow hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-xl font-semibold mb-2">管理用户</h2>
                        <p>查看和删除普通用户</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
