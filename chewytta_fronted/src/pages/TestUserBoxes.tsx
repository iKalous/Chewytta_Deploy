// 测试抽中记录API的简单页面
import React, { useState } from 'react';
import { getCurrentUser, getUserDrawnBoxes } from '../api/blindBoxApi';

const TestUserBoxes: React.FC = () => {
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const testGetCurrentUser = async () => {
        try {
            const response = await getCurrentUser();
            console.log('getCurrentUser response:', response);
            setResult(response);
            setError(null);
        } catch (err) {
            console.error('getCurrentUser error:', err);
            setError('获取当前用户失败: ' + err);
        }
    };

    const testGetUserDrawnBoxes = async () => {
        try {
            // 先获取用户信息
            const userResponse = await getCurrentUser();
            console.log('User response:', userResponse);

            if (userResponse.success && userResponse.data.id !== -1) {
                const userId = userResponse.data.id;
                console.log('Using userId:', userId);

                const response = await getUserDrawnBoxes(userId);
                console.log('getUserDrawnBoxes response:', response);
                setResult(response);
                setError(null);
            } else {
                setError('用户未登录');
            }
        } catch (err) {
            console.error('getUserDrawnBoxes error:', err);
            setError('获取抽中记录失败: ' + err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>测试用户抽中记录API</h1>

            <div style={{ marginBottom: '10px' }}>
                <button onClick={testGetCurrentUser}>测试获取当前用户</button>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <button onClick={testGetUserDrawnBoxes}>测试获取抽中记录</button>
            </div>

            {error && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    <strong>错误:</strong> {error}
                </div>
            )}

            {result && (
                <div style={{ marginTop: '10px' }}>
                    <strong>结果:</strong>
                    <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}

            <div style={{ marginTop: '20px' }}>
                <strong>当前token:</strong> {localStorage.getItem('token') || '未设置'}
            </div>
        </div>
    );
};

export default TestUserBoxes;
