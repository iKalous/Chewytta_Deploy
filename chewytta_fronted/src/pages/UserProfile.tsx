// src/pages/UserProfile.tsx
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { updateUserPassword } from '../api/blindBoxApi';
import { showToast } from '../utils/globalToast';
import { ImageUpload } from '../components/ImageUpload';
import type { User } from '../types/user';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserProfile: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updatingNickname, setUpdatingNickname] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [showRechargeModal, setShowRechargeModal] = useState(false);

    // 获取当前用户信息
    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success && data.data) {
                const userData = data.data;
                setUser({
                    id: userData.id,
                    username: userData.username,
                    email: userData.email || '',
                    phone: userData.phone || '',
                    nickname: userData.nickname || userData.username,
                    avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
                    balance: userData.balance || 0,
                    role: userData.role as 'user' | 'admin',
                });
                setNickname(userData.nickname || userData.username);
            } else {
                showToast('请先登录', 'error');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            showToast('获取用户信息失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleSaveNickname = async () => {
        if (!user) {
            showToast('请先登录', 'error');
            return;
        }
        if (!nickname.trim()) {
            showToast('昵称不能为空', 'error');
            return;
        }

        setUpdatingNickname(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/nickname', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ id: user?.id, nickname }),
            });

            const data = await response.json();
            if (data.success) {
                setUser(prev => prev ? { ...prev, nickname } : null);
                showToast('昵称修改成功', 'success');
            } else {
                showToast(data.message || '昵称修改失败', 'error');
            }
        } catch (error) {
            console.error('修改昵称失败:', error);
            showToast('网络错误，请稍后再试', 'error');
        } finally {
            setUpdatingNickname(false);
        }
    };

    const handleSavePassword = async () => {
        if (!user) {
            showToast('请先登录', 'error');
            return;
        }
        if (!password) {
            showToast('请输入旧密码', 'error');
            return;
        }
        if (newPassword.length < 6) {
            showToast('新密码长度不能小于6位', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast('两次输入的密码不一致', 'error');
            return;
        }

        setUpdatingPassword(true);
        try {
            const result = await updateUserPassword(user.id, password, newPassword);

            if (result.success) {
                showToast('密码修改成功', 'success');
                setPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                showToast(result.message || '密码修改失败', 'error');
            }
        } catch (error) {
            console.error('修改密码失败:', error);
            showToast('网络错误，请稍后再试', 'error');
        } finally {
            setUpdatingPassword(false);
        }
    };

    // 充值余额
    const handleRecharge = async () => {
        const amount = parseFloat(rechargeAmount);
        if (!user || isNaN(amount) || amount <= 0) {
            showToast('请输入有效的充值金额', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/recharge', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user?.id,
                    amount: amount,
                }),
            });

            const data = await response.json();
            if (data.success) {
                const newBalance = data.data;
                setUser(prev => prev ? { ...prev, balance: newBalance } : null);
                showToast(`充值成功！当前余额：¥${newBalance}`, 'success');
                setShowRechargeModal(false);
                setRechargeAmount('');
            } else {
                showToast(data.message || '充值失败', 'error');
            }
        } catch (error) {
            console.error('充值失败:', error);
            showToast('充值失败', 'error');
        }
    };

    // 处理头像上传（使用通用上传组件）
    const handleAvatarUpload = async (avatarUrl: string) => {
        if (!user?.id) return;

        try {
            // 调用后端API更新用户头像
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${user.id}/avatar/url`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ avatarUrl }),
            });

            const data = await response.json();
            if (data.success && data.data) {
                // 使用后端返回的完整用户信息更新本地状态
                setUser(prev => prev ? {
                    ...prev,
                    avatar: data.data.avatar || avatarUrl
                } : null);
                showToast('头像更新成功', 'success');
            } else {
                showToast(data.message || '头像更新失败', 'error');
            }
        } catch (error) {
            console.error('头像更新失败:', error);
            showToast('头像更新失败', 'error');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-white text-black py-10">
                <div className="container mx-auto px-4 max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">我的主页</h1>
                    <div className="text-center">
                        <p className="text-gray-500">正在加载用户信息...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-violet-100 py-10 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-violet-100 py-10">
            <div className="container mx-auto px-4 max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">我的主页</h1>

                {/* 头像上传 */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-4">
                        <img
                            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                            alt="头像"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="w-full max-w-sm">
                        <ImageUpload
                            value={user?.avatar || ''}
                            onChange={handleAvatarUpload}
                            category="avatar"
                            placeholder="点击上传头像"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* 昵称修改 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">昵称</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSaveNickname}
                        disabled={updatingNickname}
                        className={`mt-2 px-4 py-1 rounded ${updatingNickname
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            } text-white`}
                    >
                        {updatingNickname ? '保存中...' : '保存昵称'}
                    </button>
                </div>

                {/* 手机号 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">手机号</label>
                    <p className="p-2 bg-gray-100 border border-gray-300 rounded">{user?.phone || '未设置'}</p>
                </div>

                {/* 账户余额 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">账户余额</label>
                    <p className="p-2 bg-gray-100 border border-gray-300 rounded">￥{user?.balance?.toFixed(2) || '0.00'}</p>
                </div>

                {/* 修改密码 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">旧密码</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="block text-sm font-medium mb-1 mt-2">新密码</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <label className="block text-sm font-medium mb-1 mt-2">确认新密码</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={handleSavePassword}
                        disabled={updatingPassword}
                        className={`mt-2 px-4 py-1 rounded ${updatingPassword
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                    >
                        {updatingPassword ? '修改中...' : '修改密码'}
                    </button>
                </div>
                {/* 跳转到抽中记录 */}
                <div className="mt-6 text-center">
                    <Link to="/user/boxes" className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded no-underline">
                        查看我抽中的盲盒
                    </Link>
                </div>
                {/* 跳转到收藏页 */}
                <div className="mt-6 text-center">
                    <Link to="/user/favorites" className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded no-underline">
                        查看我的收藏
                    </Link>
                </div>

                {/* 跳转到充值页 */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowRechargeModal(true)}
                        className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded no-underline"
                    >
                        点击充值余额
                    </button>
                </div>

                {/* 充值模态框 */}
                {showRechargeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4">余额充值</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    充值金额
                                </label>
                                <input
                                    type="number"
                                    value={rechargeAmount}
                                    onChange={(e) => setRechargeAmount(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="请输入充值金额"
                                    min="0.01"
                                    step="0.01"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowRechargeModal(false);
                                        setRechargeAmount('');
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleRecharge}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    确认充值
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 返回首页 */}
                <div className="mt-4 text-center">
                    <Button
                        onClick={() => navigate('/home')}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                        style={{ color: 'white' }}
                    >
                        返回首页
                    </Button>
                </div>
                {/* 退出登录 */}
                <div className="mt-6">
                    <button
                        onClick={() => {
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('role');
                            window.location.href = '/login';
                        }}
                        className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        退出登录
                    </button>
                </div>


            </div>
        </div>
    );
};

export default UserProfile;
