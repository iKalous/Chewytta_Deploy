// src/components/ErrorBoundary.tsx
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('捕获到错误:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
                    <h1 className="text-2xl font-bold mb-4">出错了！</h1>
                    <p className="mb-4 text-center">{this.state.error?.message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        刷新页面
                    </button>
                    <div className="mt-6">
                        <Navigate to="/error" replace />
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
