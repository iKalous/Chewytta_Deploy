// src/pages/AdminUserPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AdminUserPage: React.FC = () => {
    const navigate = useNavigate();

    // 模拟统计数据
    const totalBoxes = 120; // 总出售数量
    const totalUsers = 35;  // 总用户数
    const totalRevenue = 3600.00; // 收入总额

    return (
        <div className="min-h-screen bg-white text-black py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold text-center mb-8">管理员控制台</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-100 p-6 rounded shadow text-center">
                        <h2 className="text-xl font-semibold mb-2">总盲盒销售量</h2>
                        <p className="text-3xl font-bold">{totalBoxes}</p>
                    </div>
                    <div className="bg-blue-100 p-6 rounded shadow text-center">
                        <h2 className="text-xl font-semibold mb-2">总用户数</h2>
                        <p className="text-3xl font-bold">{totalUsers}</p>
                    </div>
                    <div className="bg-yellow-100 p-6 rounded shadow text-center">
                        <h2 className="text-xl font-semibold mb-2">总收入</h2>
                        <p className="text-3xl font-bold">￥{totalRevenue.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">管理功能</h2>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/admin/boxes" className="text-blue-600 hover:underline">
                                编辑/管理盲盒
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/users" className="text-blue-600 hover:underline">
                                管理普通用户
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/home')}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        返回首页
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminUserPage;
