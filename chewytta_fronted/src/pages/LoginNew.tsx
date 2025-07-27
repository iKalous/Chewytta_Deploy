import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { post } from '../utils/api';
import { setLocalStorage, getLocalStorage } from '../utils/localStorage';
import { showToast } from '../utils/globalToast';
import { Button, Card, TextField } from '../components/MaterialUI';

interface LoginForm {
    username?: string;
    password: string;
}

const Login: React.FC = () => {
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
            console.log('Login form submitted with data:', data);
            const requestData = {
                username: data.username,
                password: data.password
            };
            console.log('Login request data:', requestData);

            console.log('Sending login request to /users/login');
            const result = await post('/users/login', requestData);

            console.log('Login result:', result);
            if (result && result.success) {
                console.log('Login successful, result data:', result.data);
                if (result.data && result.data.token) {
                    console.log('Login successful, token:', result.data.token);

                    setLocalStorage('isLoggedIn', 'true');
                    setLocalStorage('token', result.data.token);
                    setLocalStorage('userId', result.data.user?.id || '');
                    const userRole = result.data.user?.role || 'USER';
                    const normalizedRole = userRole.toUpperCase();
                    setLocalStorage('role', normalizedRole);

                    console.log('Stored token:', getLocalStorage('token'));
                    console.log('Stored isLoggedIn:', getLocalStorage('isLoggedIn'));
                    console.log('Stored userId:', getLocalStorage('userId'));
                    console.log('Stored role:', getLocalStorage('role'));

                    showToast('登录成功！', 'success');

                    setTimeout(() => {
                        console.log('Redirecting to:', normalizedRole === 'ADMIN' ? '/admin' : '/home');
                        window.location.href = normalizedRole === 'ADMIN' ? '/admin' : '/home';
                    }, 1000);
                } else {
                    console.error('Login successful but no token in response');
                    showToast('登录成功但未获取到token', 'error');
                }
            } else {
                console.error('Login failed:', result?.message || 'Unknown error');
                showToast(result?.message || '登录失败，请检查用户名和密码', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('登录出错，请重试', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginTypeChange = (type: 'username' | 'phone' | 'email') => {
        setLoginType(type);
        setValue('username', '');
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
            case 'username':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'phone':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                );
            case 'email':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-on-surface mb-2">
                        欢迎回来
                    </h1>
                    <p className="text-on-surface-variant">
                        登录到您的 Chewytta 账户
                    </p>
                </div>

                {/* Login Card */}
                <Card variant="elevated" className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Login Type Selector */}
                        <div className="flex space-x-1 bg-surface-variant rounded-lg p-1">
                            {[
                                { key: 'username', label: '用户名' },
                                { key: 'phone', label: '手机号' },
                                { key: 'email', label: '邮箱' }
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleLoginTypeChange(key as 'username' | 'phone' | 'email')}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${loginType === key
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-on-surface-variant hover:bg-surface hover:text-on-surface'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Username/Phone/Email Field */}
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
                                startIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
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

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-primary hover:text-primary-dark text-sm font-medium no-underline"
                            >
                                忘记密码？
                            </Link>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            variant="filled"
                            size="large"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    登录中...
                                </>
                            ) : (
                                '登录'
                            )}
                        </Button>

                        {/* Register Link */}
                        <div className="text-center">
                            <span className="text-on-surface-variant text-sm">
                                还没有账户？
                            </span>
                            <Link
                                to="/register"
                                className="text-primary hover:text-primary-dark font-medium ml-1 no-underline"
                            >
                                立即注册
                            </Link>
                        </div>
                    </form>
                </Card>

                {/* Additional Info */}
                <div className="text-center">
                    <p className="text-xs text-on-surface-variant">
                        登录即表示您同意我们的
                        <Link to="/terms" className="text-primary hover:text-primary-dark no-underline mx-1">
                            服务条款
                        </Link>
                        和
                        <Link to="/privacy" className="text-primary hover:text-primary-dark no-underline mx-1">
                            隐私政策
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
