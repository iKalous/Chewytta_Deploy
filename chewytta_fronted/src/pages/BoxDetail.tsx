// src/pages/BoxDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buyBlindBox, favoriteBlindBox, unfavoriteBlindBox, isBlindBoxFavorited } from '../api/blindBoxApi';
import useBlindBoxContext from '../hooks/useBlindBoxContent';
import { useComments } from '../hooks/useComments';
import { getCurrentUser, getBlindBoxComments } from '../api/blindBoxApi';
import type { BlindBox, Item, ApiResponse, Comment } from '../types/blindBox';

const BoxDetail: React.FC = () => {
    const { boxes } = useBlindBoxContext();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isFavorited, setIsFavorited] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [isFavoriting, setIsFavoriting] = useState(false);
    const [buyError, setBuyError] = useState<string | null>(null);
    const [favoriteError, setFavoriteError] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: number; username: string; role: string } | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // 获取用户信息（可选，不强制登录）
    useEffect(() => {
        const fetchUser = async () => {
            setLoadingUser(true);
            try {
                const response = await getCurrentUser();
                if (response.success && response.data.id !== -1) {
                    setUser(response.data);
                } else {
                    // 用户未登录，设置为游客模式，不跳转
                    setUser(null);
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const [initialComments, setInitialComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [commentError, setCommentError] = useState<string | null>(null);

    // 获取当前盲盒
    const [box, setBox] = useState<BlindBox | null>(null);
    const [loadingBox, setLoadingBox] = useState(true);
    const [boxError, setBoxError] = useState<string | null>(null);

    // 添加整体加载状态
    const [isPageLoading, setIsPageLoading] = useState(true);

    // 获取盲盒详情和评论数据
    const fetchBoxDetails = async () => {
        if (!id) return;

        setLoadingBox(true);
        setBoxError(null);

        try {
            const token = localStorage.getItem('token');
            console.log('获取盲盒详情，token:', token ? '已存在' : '不存在');

            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // 直接从API获取完整的盲盒详情（包含款式列表）
            const response = await fetch(`/api/blind-boxes/${id}`, {
                headers
            });

            console.log('盲盒详情API响应状态:', response.status);

            if (!response.ok) {
                if (response.status === 403) {
                    console.log('盲盒详情403错误，尝试匿名访问');
                    const anonResponse = await fetch(`/api/blind-boxes/${id}`);
                    if (anonResponse.ok) {
                        const data = await anonResponse.json();
                        setBox(data);
                        return;
                    }
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('获取到盲盒详情:', data);
            if (data && data.id) {
                setBox(data);
            } else {
                setBoxError('获取盲盒详情失败');
            }
        } catch (error) {
            console.error('获取盲盒详情失败:', error);
            setBoxError(`获取盲盒详情失败: ${error instanceof Error ? error.message : '未知错误'}`);
        } finally {
            setLoadingBox(false);
            setIsPageLoading(false);
        }
    };

    const fetchComments = async () => {
        if (!id) return;

        setLoadingComments(true);
        setCommentError(null);

        try {
            const token = localStorage.getItem('token');
            console.log('获取评论，token:', token ? '已存在' : '不存在');

            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`/api/comments/box/${id}`, {
                headers
            });

            console.log('评论API响应状态:', response.status);

            if (!response.ok) {
                if (response.status === 403) {
                    console.log('403错误，尝试匿名访问');
                    const anonResponse = await fetch(`/api/comments/box/${id}`);
                    if (anonResponse.ok) {
                        const data = await anonResponse.json();
                        setInitialComments(data.data || []);
                        return;
                    }
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('获取到评论数据:', data.data?.length || 0, '条');
            setInitialComments(data.data || []);
        } catch (error) {
            console.error('获取评论失败:', error);
            setCommentError(`获取评论失败: ${error instanceof Error ? error.message : '未知错误'}`);
            setInitialComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchBoxDetails();
        fetchComments();
    }, [id]);

    // 使用更新后的useComments钩子，传入boxId
    const { comments, newComment, setNewComment, addComment, isSubmitting, setComments } = useComments(initialComments, box?.id || 0);

    // 当用户登录状态变化时重新获取评论
    useEffect(() => {
        if (box?.id) {
            fetchComments();
        }
    }, [user, box?.id]);

    // 检查盲盒是否已收藏（仅登录用户）
    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!user || !box) return;

            try {
                const response = await fetch(`/api/blind-boxes/${box.id}/favorite`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (data && data.success) {
                    setIsFavorited(data.data);
                }
            } catch (error) {
                console.error('检查收藏状态失败:', error);
            }
        };

        checkFavoriteStatus();
    }, [user, box?.id]);

    // 页面加载中状态
    if (isPageLoading || loadingBox) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                </div>
            </div>
        );
    }

    // 错误状态显示
    if (boxError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">⚠️ {boxError}</p>
                    <Link to="/home" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
                        返回首页
                    </Link>
                </div>
            </div>
        );
    }

    // 如果不存在该盲盒或未上架，显示错误信息 + 返回首页按钮
    if (!box || !box.isPublished) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black p-4">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">⚠️ {box && !box.isPublished ? '该盲盒已下架' : '盲盒不存在'}</p>
                    <Link to="/home" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
                        返回首页
                    </Link>
                </div>
            </div>
        );
    }

    const handleBuy = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsBuying(true);
        setBuyError(null);
        try {
            const response = await fetch(`/api/blind-boxes/${id}/buy`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                const result = data.data;
                navigate(`/box/${id}/result`, {
                    state: {
                        boxName: box.name,
                        item: result.item,
                        isNew: result.isNew,
                        balance: result.balance
                    }
                });
            } else {
                setBuyError(data.message || '购买失败，请稍后再试');
            }
        } catch (error) {
            console.error('购买盲盒失败:', error);
            setBuyError('网络错误，请稍后再试');
        } finally {
            setIsBuying(false);
        }
    };

    const handleFavorite = async () => {
        if (!user) {
            alert('请先登录后再收藏');
            return;
        }
        if (!box) return;
        setIsFavoriting(true);
        setFavoriteError(null);
        try {
            const response = await fetch(`/api/blind-boxes/${box.id}/favorite`, {
                method: isFavorited ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                setIsFavorited(!isFavorited);
            } else {
                setFavoriteError(data.message || '操作失败');
            }
        } catch (error) {
            console.error('收藏/取消收藏失败:', error);
            setFavoriteError('网络错误，请稍后再试');
        } finally {
            setIsFavoriting(false);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('请先登录后再评论');
            return;
        }
        if (!box) return;

        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    boxId: box.id,
                    content: newComment
                })
            });
            const data = await response.json();
            if (data && data.success) {
                setComments(prev => [data.data, ...prev]);
                setNewComment('');
                setCommentError(null);
            } else {
                setCommentError(data?.message || '评论失败');
            }
        } catch (error) {
            console.error('评论失败:', error);
            setCommentError('网络错误，请稍后再试');
        }
    };

    return (
        <div className="min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* 页面内容 */}
                <h1 className="text-3xl font-bold text-center mb-8">盲盒详情 - {box.name}</h1>

                {/* 描述与库存 */}
                <p className="text-lg">{box.description}</p>
                <p className="mt-2">价格: ￥{box.price.toFixed(2)}</p>
                <p>库存: {box.stock} 件</p>
                <p>状态: {box.isPublished ? '已上架' : '未上架'}</p>

                {/* 款式列表 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">款式列表 ({box.items?.length || 0}款)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {box.items && box.items.length > 0 ? (
                            box.items.map((item: Item) => (
                                <div key={item.id} className="text-center border rounded-lg p-3 hover:shadow-md transition-shadow">
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'}
                                        alt={item.name}
                                        className="w-full h-24 object-cover rounded-lg mb-2"
                                    />
                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{item.rarity || '普通'}</p>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-4 text-center text-gray-500 py-8">
                                暂无款式信息
                            </p>
                        )}
                    </div>
                </div>

                {/* 收藏按钮 */}
                <button
                    onClick={handleFavorite}
                    className={`mt-6 px-4 py-2 rounded ${isFavorited ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    disabled={isFavoriting}
                >
                    {isFavoriting ? '处理中...' : isFavorited ? '取消收藏 ❤️' : '收藏 ⭐'}
                </button>
                {favoriteError && <p className="mt-2 text-red-500">{favoriteError}</p>}

                {/* 购买按钮 */}
                {box.isPublished && box.stock > 0 && (
                    <div>
                        <button
                            onClick={handleBuy}
                            className="mt-4 w-full py-3 bg-green-600 text-white rounded hover:bg-green-700"
                            disabled={isBuying}
                        >
                            {isBuying ? '处理中...' : `抽一个！花费 ￥${box.price.toFixed(2)}`}
                        </button>
                        {buyError && <p className="mt-2 text-red-500">{buyError}</p>}
                    </div>
                )}

                {!box.isPublished && <p className="mt-2 text-red-500">该盲盒已下架</p>}
                {box.stock <= 0 && <p className="mt-2 text-red-500">库存不足</p>}

                {/* 评论区 */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">用户评论</h2>

                    {loadingComments ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="mt-2 text-gray-600">加载评论中...</p>
                        </div>
                    ) : commentError ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{commentError}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">暂无评论</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="bg-white p-4 rounded shadow-sm">
                                        <p>
                                            <span className="font-semibold">{comment.user}</span>: {comment.content}
                                        </p>
                                        <small className="text-gray-500">{comment.date}</small>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* 发表评论 */}
                    <form onSubmit={handleCommentSubmit} className="mt-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="发表你的看法..."
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '提交中...' : '提交评论'}
                        </button>
                    </form>
                </div>

                {/* 返回链接 */}
                <div className="mt-8 text-center">
                    <Link to="/home" className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded no-underline inline-block">
                        返回首页
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BoxDetail;
