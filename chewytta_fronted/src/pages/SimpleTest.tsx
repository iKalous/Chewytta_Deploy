import React, { useState } from 'react';

const SimpleTest: React.FC = () => {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testApi = async () => {
        setLoading(true);
        try {
            // 测试获取当前用户 - 使用登录API先获取token
            const loginResponse = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: 'testuser',
                    password: 'testpassword'
                })
            });

            const loginData = await loginResponse.json();
            console.log('登录响应:', loginData);

            if (loginData.success) {
                const token = loginData.data;
                localStorage.setItem('token', token);

                // 获取当前用户信息
                const userResponse = await fetch('/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userData = await userResponse.json();
                console.log('用户信息:', userData);

                if (userData.success) {
                    const userId = userData.data.id;

                    // 获取抽中记录
                    const drawnResponse = await fetch(`/api/drawn/user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const drawnData = await drawnResponse.json();
                    console.log('抽中记录:', drawnData);

                    setResult(JSON.stringify({
                        login: loginData,
                        user: userData,
                        drawn: drawnData
                    }, null, 2));
                } else {
                    setResult('获取用户信息失败: ' + userData.message);
                }
            } else {
                setResult('登录失败: ' + loginData.message);
            }
        } catch (error) {
            console.error('测试API失败:', error);
            setResult('测试失败: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>API测试页面</h1>

            <button
                onClick={testApi}
                disabled={loading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                }}
            >
                {loading ? '测试中...' : '开始测试'}
            </button>

            <div style={{ marginTop: '20px' }}>
                <h2>测试结果：</h2>
                <pre style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '500px',
                    border: '1px solid #ddd'
                }}>
                    {result || '暂无结果'}
                </pre>
            </div>
        </div>
    );
};

export default SimpleTest;
