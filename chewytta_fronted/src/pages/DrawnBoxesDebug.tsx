// 完整的API测试页面
import React, { useState } from 'react';
import { getCurrentUser, getUserDrawnBoxes } from '../api/blindBoxApi';

interface TestResult {
    step: string;
    success: boolean;
    data?: any;
    error?: string;
}

const DrawnBoxesDebug: React.FC = () => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(false);

    const addResult = (result: TestResult) => {
        setResults(prev => [...prev, result]);
    };

    const clearResults = () => {
        setResults([]);
    };

    const runFullTest = async () => {
        setLoading(true);
        clearResults();

        try {
            // 步骤1: 检查本地存储
            addResult({
                step: '1. 检查本地存储',
                success: true,
                data: {
                    token: localStorage.getItem('token')?.substring(0, 20) + '...',
                    userId: localStorage.getItem('userId'),
                    role: localStorage.getItem('role'),
                    isLoggedIn: localStorage.getItem('isLoggedIn')
                }
            });

            // 步骤2: 获取当前用户
            try {
                const userResponse = await getCurrentUser();
                addResult({
                    step: '2. 获取当前用户',
                    success: userResponse.success,
                    data: userResponse.data,
                    error: userResponse.success ? undefined : userResponse.message
                });

                if (userResponse.success && userResponse.data.id !== -1) {
                    const userId = userResponse.data.id;

                    // 步骤2.5: 测试认证端点
                    try {
                        const token = localStorage.getItem('token');
                        const authTestResponse = await fetch(`/api/drawn/test`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        const authTestData = await authTestResponse.text();
                        addResult({
                            step: '2.5. 测试认证',
                            success: authTestResponse.ok,
                            data: {
                                status: authTestResponse.status,
                                statusText: authTestResponse.statusText,
                                response: authTestData
                            },
                            error: authTestResponse.ok ? undefined : `HTTP ${authTestResponse.status}`
                        });
                    } catch (error) {
                        addResult({
                            step: '2.5. 测试认证',
                            success: false,
                            error: error instanceof Error ? error.message : '未知错误'
                        });
                    }

                    // 步骤3: 获取抽中记录
                    try {
                        const drawnResponse = await getUserDrawnBoxes(userId);
                        addResult({
                            step: '3. 获取抽中记录',
                            success: drawnResponse.success,
                            data: drawnResponse.data,
                            error: drawnResponse.success ? undefined : drawnResponse.message
                        });

                        // 步骤4: 直接测试API端点
                        try {
                            const token = localStorage.getItem('token');
                            const directResponse = await fetch(`/api/drawn/user/${userId}`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            });

                            const directData = await directResponse.json();
                            addResult({
                                step: '4. 直接API调用',
                                success: directResponse.ok,
                                data: {
                                    status: directResponse.status,
                                    statusText: directResponse.statusText,
                                    data: directData
                                },
                                error: directResponse.ok ? undefined : `HTTP ${directResponse.status}`
                            });
                        } catch (error) {
                            addResult({
                                step: '4. 直接API调用',
                                success: false,
                                error: error instanceof Error ? error.message : '未知错误'
                            });
                        }
                    } catch (error) {
                        addResult({
                            step: '3. 获取抽中记录',
                            success: false,
                            error: error instanceof Error ? error.message : '未知错误'
                        });
                    }
                }
            } catch (error) {
                addResult({
                    step: '2. 获取当前用户',
                    success: false,
                    error: error instanceof Error ? error.message : '未知错误'
                });
            }
        } catch (error) {
            addResult({
                step: '测试失败',
                success: false,
                error: error instanceof Error ? error.message : '未知错误'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>抽中记录API调试工具</h1>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={runFullTest}
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
                    {loading ? '测试中...' : '开始完整测试'}
                </button>

                <button
                    onClick={clearResults}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        marginLeft: '10px',
                        cursor: 'pointer'
                    }}
                >
                    清除结果
                </button>
            </div>

            <div>
                <h2>测试结果：</h2>
                {results.length === 0 ? (
                    <p>暂无测试结果</p>
                ) : (
                    results.map((result, index) => (
                        <div
                            key={index}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                padding: '15px',
                                marginBottom: '10px',
                                backgroundColor: result.success ? '#d4edda' : '#f8d7da'
                            }}
                        >
                            <h3 style={{
                                color: result.success ? '#155724' : '#721c24',
                                margin: '0 0 10px 0'
                            }}>
                                {result.step} - {result.success ? '成功' : '失败'}
                            </h3>

                            {result.error && (
                                <div style={{
                                    color: '#721c24',
                                    backgroundColor: '#f5c6cb',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    marginBottom: '10px'
                                }}>
                                    <strong>错误：</strong> {result.error}
                                </div>
                            )}

                            {result.data && (
                                <div>
                                    <strong>数据：</strong>
                                    <pre style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        overflow: 'auto',
                                        maxHeight: '300px',
                                        fontSize: '12px'
                                    }}>
                                        {JSON.stringify(result.data, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h3>调试说明：</h3>
                <ul>
                    <li>步骤1检查本地存储中的认证信息</li>
                    <li>步骤2验证当前用户信息获取</li>
                    <li>步骤3通过封装的API获取抽中记录</li>
                    <li>步骤4直接调用后端API端点</li>
                </ul>
                <p><strong>注意：</strong>请在浏览器F12控制台中查看详细的错误日志。</p>
            </div>
        </div>
    );
};

export default DrawnBoxesDebug;
