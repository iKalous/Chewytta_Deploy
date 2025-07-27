// src/pages/AdminBoxNew.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../utils/api';
import { showToast } from '../utils/globalToast';
import { ImageUpload } from '../components/ImageUpload';
import type { BlindBox, Item } from '../types';
import useBlindBoxContent from '../hooks/useBlindBoxContent';

const AdminBoxNew: React.FC = () => {
    const navigate = useNavigate();
    const { refreshBoxes } = useBlindBoxContent();

    // 表单状态
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(''); // 盲盒封面图片
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [isPublished, setIsPublished] = useState(false);
    const [items, setItems] = useState<Item[]>([
        { id: Date.now(), name: '', image: '' },
        { id: Date.now() + 1, name: '', image: '' },
        { id: Date.now() + 2, name: '', image: '' },
        { id: Date.now() + 3, name: '', image: '' },
    ]);
    const [loading, setLoading] = useState(false);

    // 处理款式输入变化
    const handleItemChange = (id: number, field: 'name' | 'image', value: string) => {
        const updated = items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setItems(updated);
    };

    // 添加新款式
    const handleAddItem = () => {
        const newItem = { id: Date.now(), name: '', image: '' };
        setItems([...items, newItem]);
    };

    // 删除款式
    const handleRemoveItem = (id: number) => {
        if (items.length <= 1) return;
        const updated = items.filter((item) => item.id !== id);
        setItems(updated);
    };

    // 表单提交处理
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newBox = {
            id: Date.now(), // 模拟唯一 ID
            name,
            description,
            image, // 盲盒封面图片
            price,
            stock,
            isPublished,
            items,
        };

        try {
            await createBox(newBox);
            showToast('新增成功', 'success');
            refreshBoxes(); // 刷新盲盒列表
            navigate('/admin/boxes');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '保存失败，请重试';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };
    // 调用 API 创建盲盒
    const createBox = async (newBox: BlindBox) => {
        const items = newBox.items || [];
        console.log('Items to create:', items);

        // 验证并准备盲盒数据（包含items）
        const requestData = {
            name: name,
            description: description,
            image: image, // 盲盒封面图片
            price: price,
            stock: stock,
            isPublished: isPublished,
            items: items.map(item => ({
                id: item.id !== undefined ? item.id : 0,
                name: item.name || '',
                image: item.image || ''
            }))
        };
        console.log('Create box request data:', requestData);

        // 设置请求超时（5秒）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const data = await request('/admin/boxes', 'POST', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('创建盲盒失败:', error);

            let errorMessage = '创建盲盒失败: ';
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    errorMessage += '请求超时，请重试';
                } else {
                    errorMessage += error.message;
                }
            } else {
                errorMessage += '未知错误';
            }

            throw new Error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black py-10">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-2xl font-bold text-center mb-6">新增盲盒</h1>

                <form onSubmit={handleSubmit}>
                    {/* 名称 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">名称</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    {/* 描述 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">描述</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows={3}
                            required
                        ></textarea>
                    </div>

                    {/* 封面图片 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">封面图片</label>
                        <ImageUpload
                            value={image}
                            onChange={setImage}
                            category="box"
                            placeholder="点击上传盲盒封面图片"
                            className="w-full"
                        />
                    </div>

                    {/* 价格 & 库存 */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">价格（元）</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : 0)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">库存</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value ? parseInt(e.target.value) : 0)}
                                className="w-full p-2 border border-gray-300 rounded"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    {/* 是否上架 */}
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="mr-2"
                        />
                        <label>是否上架</label>
                    </div>

                    {/* 款式列表 */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">款式列表</h3>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                + 添加款式
                            </button>
                        </div>

                        {items.map((item) => (
                            <div key={item.id} className="border p-3 rounded mb-2 relative">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                >
                                    ✕
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">款式名称</label>
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">款式图片</label>
                                        <ImageUpload
                                            value={item.image}
                                            onChange={(url) => handleItemChange(item.id, 'image', url)}
                                            category="item"
                                            placeholder="点击上传款式图片"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 按钮 */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? '保存中...' : '保存盲盒'}
                        </button>
                        <Link to="/admin/boxes" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                            取消
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
};


export default AdminBoxNew;
