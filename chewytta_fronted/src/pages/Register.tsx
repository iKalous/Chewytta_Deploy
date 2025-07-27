// src/pages/Register.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { register as apiRegister } from '../utils/api';

interface RegisterForm {
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        if (data.password !== data.confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        try {
            // 调用注册API
            const response = await apiRegister(
                data.username,
                data.email,
                data.phone,
                data.password,
                data.confirmPassword
            );

            // 注册成功处理
            alert('注册成功，请登录');
            window.location.href = '/login';
        } catch (error) {
            // 错误处理已在API函数中完成
            console.error('注册失败:', error);
        }
    };

    const password = watch('password');

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">注册</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* 用户名 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">用户名</label>
                        <input
                            type="text"
                            {...register('username', { required: '用户名是必填项' })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.username && (
                            <p className="mt-1 text-red-500 text-sm">{errors.username.message}</p>
                        )}
                    </div>

                    {/* 邮箱 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">邮箱</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: '邮箱是必填项',
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: '请输入有效的邮箱地址',
                                },
                            })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                        )}
                    </div>

                    {/* 手机号 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">手机号</label>
                        <input
                            type="tel"
                            {...register('phone', {
                                required: '手机号是必填项',
                                pattern: {
                                    value: /^1[3-9]\d{9}$/,
                                    message: '请输入正确的手机号',
                                },
                            })}
                            placeholder="13800001111"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone && (
                            <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* 密码 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">密码</label>
                        <input
                            type="password"
                            {...register('password', {
                                required: '密码是必填项',
                                minLength: {
                                    value: 6,
                                    message: '密码至少 6 位',
                                },
                            })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
                        )}
                    </div>

                    {/* 确认密码 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">确认密码</label>
                        <input
                            type="password"
                            {...register('confirmPassword', {
                                required: '请确认密码',
                                validate: (value) => value === password || '两次输入的密码不一致',
                            })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* 注册按钮 */}
                    <button
                        type="submit"
                        className="w-full py-2 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded"
                    >
                        注册
                    </button>
                </form>

                {/* 登录链接 */}
                <div className="mt-4 text-center">
                    <a href="/login" className="text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 rounded no-underline">
                        ← 已有账号？立即登录
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Register;
