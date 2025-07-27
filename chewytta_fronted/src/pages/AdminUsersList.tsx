// src/pages/AdminUsersList.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useUserContent from '../hooks/useUserContent';
import { showToast } from '../utils/globalToast';

const AdminUsersList: React.FC = () => {
    const { users, loading, error, deleteUser } = useUserContent();

    const handleDelete = async (id: number, username: string) => {
        if (window.confirm(`确定要删除用户 ${username} 吗？`)) {
            try {
                await deleteUser(id);
                showToast('用户删除成功', 'success');
            } catch (err) {
                showToast('用户删除失败: ' + (err instanceof Error ? err.message : '未知错误'), 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-white text-black py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-2xl font-bold text-center mb-6">用户管理</h1>

                {/* 错误处理 */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* 加载状态 */}
                {loading ? (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                        <p className="mt-2 text-gray-600">加载中...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2 text-left">ID</th>
                                <th className="border px-4 py-2 text-left">用户名</th>
                                <th className="border px-4 py-2 text-left">昵称</th>
                                <th className="border px-4 py-2 text-left">邮箱</th>
                                <th className="border px-4 py-2 text-left">手机号</th>
                                <th className="border px-4 py-2 text-left">余额</th>
                                <th className="border px-4 py-2 text-left">角色</th>
                                <th className="border px-4 py-2 text-left">注册时间</th>
                                <th className="border px-4 py-2 text-left">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{user.id}</td>
                                    <td className="border px-4 py-2 font-medium">{user.username}</td>
                                    <td className="border px-4 py-2">{user.nickname || '-'}</td>
                                    <td className="border px-4 py-2">{user.email}</td>
                                    <td className="border px-4 py-2">{user.phone || '-'}</td>
                                    <td className="border px-4 py-2">¥{(user.balance || 0).toFixed(2)}</td>
                                    <td className="border px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role === 'ADMIN' ? '管理员' : '普通用户'}
                                        </span>
                                    </td>
                                    <td className="border px-4 py-2 text-sm">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="border px-4 py-2 space-x-1">
                                        <button
                                            onClick={() => handleDelete(user.id, user.username)}
                                            className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                                            title="删除用户"
                                        >
                                            删除
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link to="/admin" className="text-blue-600 hover:underline">
                        ← 返回管理员主页
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersList;
