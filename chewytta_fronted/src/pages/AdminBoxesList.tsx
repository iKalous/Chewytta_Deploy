// src/pages/AdminBoxesList.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useBlindBoxContext from '../hooks/useBlindBoxContent';
import { showToast } from '../utils/globalToast';

const AdminBoxesList: React.FC = () => {
    const navigate = useNavigate();
    const { boxes, loading, error, fetchAllBoxes, deleteBox } = useBlindBoxContext();

    // 组件挂载时获取所有盲盒数据
    React.useEffect(() => {
        console.log('AdminBoxesList mounted, fetching all boxes...');
        fetchAllBoxes();
    }, [fetchAllBoxes]);

    // 添加调试信息，查看boxes状态更新
    React.useEffect(() => {
        console.log('Boxes updated in AdminBoxesList:', boxes);
    }, [boxes]);

    const handleDeleteBox = async (boxId: number) => {
        if (window.confirm('确定要删除这个盲盒吗？')) {
            try {
                await deleteBox(boxId);
                showToast('删除成功', 'success');
            } catch (error) {
                console.error('删除盲盒失败:', error);
                // Since error is of type string | null, we need to handle it appropriately
                showToast('删除失败: ' + (error || '未知错误'), 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-white text-black py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/admin" className="text-blue-600 hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        返回管理员首页
                    </Link>
                    <h1 className="text-2xl font-bold text-center">管理盲盒</h1>
                    <div></div> {/* 占位元素保持标题居中 */}
                </div>

                {/* 新增按钮 */}
                <div className="flex justify-end mb-4">
                    <Link
                        to="/admin/boxes/new"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        + 新增盲盒
                    </Link>
                </div>

                {/* 加载状态 */}
                {loading && (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                        <p className="mt-2 text-gray-600">加载中...</p>
                    </div>
                )}

                {/* 错误提示 */}
                {error && (
                    <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchAllBoxes}
                            className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            重试
                        </button>
                    </div>
                )}

                {/* 数据列表 */}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2 text-left">ID</th>
                                <th className="border px-4 py-2 text-left">名称</th>
                                <th className="border px-4 py-2 text-left">描述</th>
                                <th className="border px-4 py-2 text-left">价格</th>
                                <th className="border px-4 py-2 text-left">库存</th>
                                <th className="border px-4 py-2 text-left">状态</th>
                                <th className="border px-4 py-2 text-left">操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* 显示所有盲盒 */}
                            {(() => {
                                console.log('All boxes:', boxes);
                                
                                return boxes.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="border px-4 py-4 text-center text-gray-500">
                                            暂无盲盒数据
                                        </td>
                                    </tr>
                                ) : (
                                    boxes.map((box) => {
                                        console.log('Rendering box:', box);
                                        return (
                                            <tr key={box.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="py-3 px-4">{box.id}</td>
                                                <td className="py-3 px-4">{box.name}</td>
                                                <td className="py-3 px-4">{box.description}</td>
                                                <td className="py-3 px-4">¥{box.price}</td>
                                                <td className="py-3 px-4">{box.stock}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${box.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {box.isPublished ? '已上架' : '未上架'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => navigate(`/admin/boxes/edit/${box.id}`)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        编辑
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBox(box.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        删除
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                );
                            })()}</tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>)}
export default AdminBoxesList;
