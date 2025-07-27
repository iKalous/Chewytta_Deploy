import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { post } from '../utils/api';
import { setLocalStorage } from '../utils/localStorage';
import { showToast } from '../utils/globalToast';
import { Button, Card, TextField } from '../components/MaterialUI';
import {
    UserIcon,
    PhoneIcon,
    EmailIcon,
    LockIcon,
    BoxIcon
} from '../components/Icons';

interface LoginForm {
    username?: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loginType, setLoginType] = useState<'username' | 'phone' | 'email'>('username');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<LoginForm>();

    const watchedUsername = watch('username', '') || '';
    const watchedPassword = watch('password', '') || '';

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const requestData = {
                username: data.username,
                password: data.password
            };

            const result = await post('/users/login', requestData);

            if (result && result.success) {
                if (result.data && result.data.token) {
                    setLocalStorage('isLoggedIn', 'true');
                    setLocalStorage('token', result.data.token);
                    setLocalStorage('userId', result.data.user?.id || '');
                    const userRole = result.data.user?.role || 'USER';
                    const normalizedRole = userRole.toUpperCase();
                    setLocalStorage('role', normalizedRole);

                    showToast('登录成功！', 'success');

                    setTimeout(() => {
                        window.location.href = normalizedRole === 'ADMIN' ? '/admin' : '/home';
                    }, 1000);
                } else {
                    showToast('登录成功但未获取到token', 'error');
                }
            } else {
                showToast(result?.message || '登录失败，请检查用户名和密码', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('登录出错，请重试', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const getPlaceholder = () => {
        switch (loginType) {
            case 'username': return '请输入用户名';
            case 'phone': return '请输入手机号';
            case 'email': return '请输入邮箱';
            default: return '请输入用户名';
        }
    };

    const getInputIcon = () => {
        switch (loginType) {
            case 'username': return <UserIcon size={18} />;
            case 'phone': return <PhoneIcon size={18} />;
            case 'email': return <EmailIcon size={18} />;
            default: return <UserIcon size={18} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-violet-100 flex items-center justify-center py-8 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <BoxIcon size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Chewytta
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">欢迎回来</h2>
                    <p className="text-gray-600">登录您的账户，继续探索盲盒世界</p>
                </div>

                {/* Login Card */}
                <Card variant="elevated" className="p-8 bg-white/95 backdrop-blur-lg shadow-2xl border border-purple-100">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Login Type Selector */}
                        <div className="grid grid-cols-3 gap-1 p-1 bg-purple-50 rounded-xl">
                            {[
                                { key: 'username', label: '用户名', icon: <UserIcon size={16} /> },
                                { key: 'phone', label: '手机', icon: <PhoneIcon size={16} /> },
                                { key: 'email', label: '邮箱', icon: <EmailIcon size={16} /> }
                            ].map(({ key, label, icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        setLoginType(key as 'username' | 'phone' | 'email');
                                        setValue('username', '');
                                    }}
                                    className={`flex items-center justify-center space-x-1 py-3 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${loginType === key
                                        ? 'bg-white text-purple-700 shadow-md'
                                        : 'text-purple-600 hover:text-purple-700 hover:bg-purple-100'
                                        }`}
                                >
                                    {icon}
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Username Field */}
                        <div>
                            <TextField
                                value={watchedUsername}
                                onChange={(value) => setValue('username', value)}
                                placeholder={getPlaceholder()}
                                fullWidth
                                variant="outlined"
                                startIcon={getInputIcon()}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                className="focus-within:border-purple-500"
                            />
                            <input
                                type="hidden"
                                {...register('username', {
                                    required: '请输入登录信息',
                                    validate: (value) => {
                                        if (!value) return '请输入登录信息';
                                        if (loginType === 'email' && !/\S+@\S+\.\S+/.test(value)) {
                                            return '请输入有效的邮箱地址';
                                        }
                                        if (loginType === 'phone' && !/^1[3-9]\d{9}$/.test(value)) {
                                            return '请输入有效的手机号';
                                        }
                                        return true;
                                    }
                                })}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <TextField
                                value={watchedPassword}
                                onChange={(value) => setValue('password', value)}
                                type="password"
                                placeholder="请输入密码"
                                fullWidth
                                variant="outlined"
                                startIcon={<LockIcon size={18} />}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                className="focus-within:border-purple-500"
                            />
                            <input
                                type="hidden"
                                {...register('password', {
                                    required: '请输入密码',
                                    minLength: {
                                        value: 6,
                                        message: '密码长度至少6位'
                                    }
                                })}
                            />
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            variant="filled"
                            size="large"
                            fullWidth
                            disabled={isLoading}
                            className="mt-6"
                            style={{
                                backgroundColor: 'var(--primary)',
                                color: 'var(--on-primary)',
                            }}
                        >
                            {isLoading ? '登录中...' : '登录'}
                        </Button>

                        {/* Action Links */}
                        <div className="flex items-center justify-between text-sm pt-4">
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => navigate('/forgot-password')}
                                className="text-gray-600 hover:text-purple-600 transition-colors"
                            >
                                忘记密码？
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate('/register')}
                                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                            >
                                立即注册
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <div className="inline-flex items-center space-x-1 text-xs text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span>登录即表示您同意我们的</span>
                        <Button
                            variant="text"
                            size="small"
                            className="text-xs p-0 text-purple-600 hover:text-purple-700 underline"
                        >
                            服务条款
                        </Button>
                        <span>和</span>
                        <Button
                            variant="text"
                            size="small"
                            className="text-xs p-0 text-purple-600 hover:text-purple-700 underline"
                        >
                            隐私政策
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
