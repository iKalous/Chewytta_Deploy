// src/pages/UserFavorites.tsx
import React, { useState, useEffect } from 'react';
import { getUserFavoriteBoxes, unfavoriteBlindBox } from '../api/blindBoxApi';
import type { BlindBox } from '../types/blindBox';
import { showToast } from '../utils/globalToast';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const UserFavorites: React.FC = () => {
    const [favorites, setFavorites] = useState<BlindBox[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // 获取用户收藏列表
    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching user favorites...');
            const response = await getUserFavoriteBoxes();

            if (response.success) {
                setFavorites(response.data);
                console.log('Favorites loaded:', response.data);
            } else {
                setError(response.message || '获取收藏列表失败');
            }
        } catch (err) {
            console.error('Failed to fetch favorites:', err);
            setError('网络错误，请稍后再试');
        } finally {
            setLoading(false);
        }
    };

    // 取消收藏
    const handleUnfavorite = async (id: number) => {
        try {
            console.log('Unfavoriting box:', id);
            const response = await unfavoriteBlindBox(id);

            if (response.success) {
                // 从本地列表中移除
                setFavorites(prev => prev.filter(box => box.id !== id));
                showToast('已取消收藏', 'success');
            } else {
                showToast(response.message || '取消收藏失败', 'error');
            }
        } catch (err) {
            console.error('Failed to unfavorite:', err);
            showToast('网络错误，请稍后再试', 'error');
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-black py-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-2xl font-bold text-center mb-6">我的收藏</h1>
                    <p className="text-center text-gray-500">加载中...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white text-black py-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-2xl font-bold text-center mb-6">我的收藏</h1>
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={fetchFavorites}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            重试
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-2xl font-bold text-center mb-6">我的收藏</h1>

                {favorites.length === 0 ? (
                    <p className="text-center text-gray-500">暂无收藏</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {favorites.map((box) => (
                            <div key={box.id} className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                                <img
                                    src={box.image || box.items[0]?.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop'}
                                    alt={box.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold">{box.name}</h2>
                                    <p className="text-gray-600 mt-1">价格: ￥{Number(box.price).toFixed(2)}</p>
                                    <div className="mt-2 flex gap-2">
                                        <Link
                                            to={`/box/${box.id}`}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                        >
                                            查看详情
                                        </Link>
                                        <button
                                            onClick={() => handleUnfavorite(box.id)}
                                            className="px-3 py-1 text-red-600 hover:text-red-800 border border-red-600 rounded text-sm"
                                        >
                                            取消收藏
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 返回主页链接 */}
                <div className="mt-8 text-center">
                    <Button
                        onClick={() => navigate('/home')}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #6366f1 30%, #9333ea 90%)',
                            color: 'white',
                            fontWeight: 'medium',
                            px: 3,
                            py: 1.5,
                            '&:hover': {
                                background: 'linear-gradient(45deg, #4f46e5 30%, #7c3aed 90%)',
                            }
                        }}
                    >
                        返回首页
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserFavorites;
