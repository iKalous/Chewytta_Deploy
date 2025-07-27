// main.tsx
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 导入ThemeProvider
import ThemeProvider from './components/ThemeProvider';

// 页面组件
import Login from './pages/LoginImproved';
import Home from './pages/Home';
import BoxDetail from './pages/BoxDetail';
import BoxResult from './pages/BoxResult';
import AdminDashboard from './pages/AdminDashboard';
import AdminBoxesList from './pages/AdminBoxesList';
import AdminBoxNew from './pages/AdminBoxNew';
import AdminBoxEdit from './pages/AdminBoxEdit';
import UserProfile from './pages/UserProfile';
import UserFavorites from './pages/UserFavorites';
import UserBoxes from './pages/UserBoxes';
import TestUserBoxes from './pages/TestUserBoxes';
import DrawnBoxesDebug from './pages/DrawnBoxesDebug';
import SimpleTest from './pages/SimpleTest';
import AdminUserPage from './pages/AdminUserPage';
import AdminUsersList from './pages/AdminUsersList';
import Register from './pages/Register';
import ErrorPage from './pages/ErrorPage';
import RechargePage from './pages/RechargePage';

// 组件
import ProtectedRoute from './components/ProtectedRoute';
import RootRedirect from './components/RootRedirect';
import { ToastProvider } from './components/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { BlindBoxProvider } from './context';
import { UserProvider } from './context/UserContent';

// 创建路由
const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <ErrorBoundary>
                <Login />
            </ErrorBoundary>
        ),
    },
    {
        path: '/',
        element: (
            <ErrorBoundary>
                <RootRedirect />
            </ErrorBoundary>
        ),
    },
    {
        path: '/home',
        element: (
            <ErrorBoundary>

                <BlindBoxProvider>
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                </BlindBoxProvider>

            </ErrorBoundary>
        ),
    },
    {
        path: '/box/:id', element: (
            <ErrorBoundary>
                <ThemeProvider>
                    <BlindBoxProvider>
                        <ProtectedRoute>
                            <BoxDetail />
                        </ProtectedRoute>
                    </BlindBoxProvider>
                </ThemeProvider>
            </ErrorBoundary>
        ),
    }, {
        path: '/box/:id/result', element: (
            <ErrorBoundary>
                <ThemeProvider>
                    <BlindBoxProvider>
                        <ProtectedRoute>
                            <BoxResult />
                        </ProtectedRoute>
                    </BlindBoxProvider>
                </ThemeProvider>
            </ErrorBoundary>
        ),
    },
    {
        path: '/admin',
        element: (
            <ErrorBoundary>

                <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                </ProtectedRoute>

            </ErrorBoundary>
        ),
    },
    {
        path: '/admin/boxes',
        element: (
            <ErrorBoundary>

                <BlindBoxProvider>
                    <ProtectedRoute requireAdmin={true}>
                        <AdminBoxesList />
                    </ProtectedRoute>
                </BlindBoxProvider>

            </ErrorBoundary>
        ),
    },
    {
        path: '/admin/boxes/new',
        element: (
            <ErrorBoundary>

                <BlindBoxProvider>
                    <ProtectedRoute requireAdmin={true}>
                        <AdminBoxNew />
                    </ProtectedRoute>
                </BlindBoxProvider>

            </ErrorBoundary>
        ),
    },
    {
        path: '/admin/boxes/edit/:id',
        element: (
            <ErrorBoundary>

                <BlindBoxProvider>
                    <ProtectedRoute requireAdmin={true}>
                        <AdminBoxEdit />
                    </ProtectedRoute>
                </BlindBoxProvider>

            </ErrorBoundary>
        ),
    },
    {
        path: '/admin/user',
        element: (
            <ErrorBoundary>
                <ProtectedRoute requireAdmin={true}>
                    <AdminUserPage />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
    },
    {
        path: '/admin/users',
        element: (
            <ErrorBoundary>
                <ProtectedRoute requireAdmin={true}>
                    <AdminUsersList />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
    },
    // 删除重复路由配置 - 已在上方正确配置,
    {
        path: '/user/profile',
        element: (
            <ErrorBoundary>
                <ProtectedRoute>
                    <UserProfile />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
    },
    {
        path: '/user/favorites',
        element: (
            <ErrorBoundary>
                <ProtectedRoute>
                    <UserFavorites />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
    },
    {
        path: '/user/boxes',
        element: (
            <ErrorBoundary>
                <ProtectedRoute>
                    <UserBoxes />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
    },
    {
        path: '/register',
        element: (
            <ErrorBoundary>
                <Register />
            </ErrorBoundary>
        ),
    },
    {
        path: '/test',
        element: (
            <ErrorBoundary>
                <TestUserBoxes />
            </ErrorBoundary>
        ),
    },
    {
        path: '/debug-drawn',
        element: (
            <ErrorBoundary>
                <DrawnBoxesDebug />
            </ErrorBoundary>
        ),
    },
    {
        path: '/simple-test',
        element: (
            <ErrorBoundary>
                <SimpleTest />
            </ErrorBoundary>
        ),
    },
    {
        path: '/error',
        element: (
            <ErrorBoundary>
                <ErrorPage />
            </ErrorBoundary>
        ),
    },
    {
        path: '/recharge',
        element: (
            <ErrorBoundary>
                <ProtectedRoute>
                    <RechargePage />
                </ProtectedRoute>
            </ErrorBoundary>
        ),
    },

]);

// App 根组件
import App from './App';

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ToastProvider>
            <UserProvider>
                <ThemeProvider>
                    <App router={router} />
                </ThemeProvider>
            </UserProvider>
        </ToastProvider>
    </React.StrictMode>
);

// 渲染入口 - 已合并到上方的渲染代码中
