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
    BoxIcon
} from '../components/Icons';

interface LoginForm {
    username?: string;
    password: string;
}

const LoginImproved: React.FC = () => {
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

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 w-full"
            style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #faf5ff 50%, #f3e8ff 75%, #ede9fe 100%)',
            }}
        >
            {/* 主容器 */}
            <div className="w-full max-w-md mx-auto text-center flex flex-col items-center justify-center">
                {/* 顶部Logo区域 */}
                <div className="text-center mb-10 w-full">
                    <div
                        className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        }}
                    >
                        <BoxIcon size={32} className="text-white" />
                    </div>
                    <h1
                        className="text-4xl font-bold mb-3"
                        style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Chewytta
                    </h1>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--on-surface)' }}>
                        欢迎回来
                    </h2>
                    <p className="text-base" style={{ color: 'var(--on-surface-variant)' }}>
                        登录您的账户，继续探索盲盒世界
                    </p>
                </div>

                {/* 登录卡片 */}
                <Card
                    variant="elevated"
                    className="p-8 backdrop-blur-lg border mx-auto w-full"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderColor: 'var(--outline)',
                        boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1), 0 4px 6px -2px rgba(139, 92, 246, 0.05)',
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full flex flex-col items-center">
                        {/* 登录类型选择器 */}
                        <div
                            className="grid grid-cols-3 gap-2 p-2 rounded-xl mx-auto w-full"
                            style={{ backgroundColor: 'var(--surface-container)' }}
                        >
                            {[
                                { key: 'username', label: '用户名', icon: <UserIcon size={18} /> },
                                { key: 'phone', label: '手机', icon: <PhoneIcon size={18} /> },
                                { key: 'email', label: '邮箱', icon: <EmailIcon size={18} /> }
                            ].map(({ key, label, icon }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => {
                                        setLoginType(key as 'username' | 'phone' | 'email');
                                        setValue('username', '');
                                    }}
                                    className={`flex flex-col items-center justify-center space-y-1 py-3 px-2 rounded-lg text-sm font-medium transition-all duration-300 ${loginType === key ? 'shadow-md' : ''
                                        }`}
                                    style={{
                                        backgroundColor: loginType === key ? 'var(--surface)' : 'transparent',
                                        color: loginType === key ? 'var(--primary)' : 'var(--on-surface-variant)',
                                    }}
                                >
                                    {icon}
                                    <span className="text-center">{label}</span>
                                </button>
                            ))}
                        </div>

                        {/* 用户名输入框 */}
                        <div>
                            <TextField
                                value={watchedUsername}
                                onChange={(value) => setValue('username', value)}
                                placeholder={getPlaceholder()}
                                fullWidth
                                variant="outlined"
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                className="text-base"
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

                        {/* 密码输入框 */}
                        <div>
                            <TextField
                                value={watchedPassword}
                                onChange={(value) => setValue('password', value)}
                                type="password"
                                placeholder="请输入密码"
                                fullWidth
                                variant="outlined"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                className="text-base"
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

                        {/* 登录按钮 */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="filled"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                className="shadow-md text-base py-3"
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                    color: 'var(--on-primary)',
                                    fontWeight: '500',
                                }}
                            >
                                {isLoading ? '登录中...' : '登录'}
                            </Button>
                        </div>

                        {/* 操作链接 */}
                        <div className="flex items-center justify-between pt-4 w-full">
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => navigate('/forgot-password')}
                                className="text-sm"
                                style={{ color: 'var(--on-surface-variant)' }}
                            >
                                忘记密码？
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate('/register')}
                                className="text-sm px-4"
                                style={{
                                    borderColor: 'var(--primary)',
                                    color: 'var(--primary)',
                                }}
                            >
                                立即注册
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginImproved;