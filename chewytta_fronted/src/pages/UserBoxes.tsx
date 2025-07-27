// src/pages/UserBoxes.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, getUserDrawnBoxes } from '../api/blindBoxApi';

interface DrawnBox {
    id: number;
    blindBox: {
        id: number;
        name: string;
        image: string;
        price: number;
    };
    item: {
        id: number;
        name: string;
        image: string;
    };
    drawnAt: string;
}

const UserBoxes: React.FC = () => {
    const [drawnBoxes, setDrawnBoxes] = useState<DrawnBox[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDrawnBoxes = async () => {
            try {
                setLoading(true);

                // 检查是否已登录
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('请先登录查看您的抽中记录');
                    setLoading(false);
                    return;
                }

                // 获取当前用户信息
                const userResponse = await getCurrentUser();
                if (!userResponse.success || userResponse.data.id === -1) {
                    setError('请先登录查看您的抽中记录');
                    localStorage.removeItem('token');
                    return;
                }

                const userId = userResponse.data.id;

                // 获取用户抽中的盲盒记录
                const response = await getUserDrawnBoxes(userId);
                if (response.success) {
                    setDrawnBoxes(response.data || []);
                } else {
                    setError(response.message || '获取抽中记录失败');
                }
            } catch (err) {
                setError('网络错误，请稍后重试');
                console.error('获取用户抽中记录失败:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDrawnBoxes();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-violet-100 py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-2xl font-bold text-center mb-6">抽中的盲盒</h1>

                {/* 加载状态 */}
                {loading && (
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <p className="mt-2 text-gray-500">加载中...</p>
                    </div>
                )}

                {/* 错误状态 */}
                {error && !loading && (
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        {error.includes('登录') ? (
                            <>
                                <Link
                                    to="/login"
                                    className="mt-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded inline-block no-underline"
                                >
                                    前往登录
                                </Link>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-2 ml-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded"
                                >
                                    重新加载
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                重新加载
                            </button>
                        )}
                    </div>
                )}

                {/* 展示抽中记录 */}
                {!loading && !error && (
                    <>
                        {drawnBoxes.length === 0 ? (
                            <p className="text-center text-gray-500">暂无抽中记录</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {drawnBoxes.map((drawnBox) => (
                                    <div key={drawnBox.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                                        <img
                                            src={drawnBox.item?.image || drawnBox.blindBox?.image || 'https://images.unsplash.com/photo-1609205635993-75ed5de683ee?w=150&h=150&fit=crop&crop=center'}
                                            alt={drawnBox.item?.name || drawnBox.blindBox?.name || '未知盲盒'}
                                            className="w-full h-40 object-cover"
                                        />
                                        <div className="p-4">
                                            <h2 className="text-xl font-semibold">
                                                {drawnBox.item?.name || drawnBox.blindBox?.name || '未知盲盒'}
                                            </h2>
                                            <p className="text-gray-600 mt-1">
                                                价格: ￥{drawnBox.blindBox?.price?.toFixed(2) || '0.00'}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                抽取时间: {new Date(drawnBox.drawnAt).toLocaleDateString('zh-CN')}
                                            </p>
                                            <p className="text-sm text-blue-600 mt-1">
                                                抽中款式: {drawnBox.item?.name || '未知'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* 返回主页链接 */}
                <div className="mt-8 text-center">
                    <Link to="/home" className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded no-underline inline-block">
                        返回首页
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserBoxes;
