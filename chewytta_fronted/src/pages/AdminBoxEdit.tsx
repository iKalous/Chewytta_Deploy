import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useBlindBoxContext from '../hooks/useBlindBoxContent';
import { showToast } from '../utils/globalToast';
import { request } from '../utils/api';
import { ImageUpload } from '../components/ImageUpload';

const AdminBoxEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { boxes, updateBox, getBoxById, loading: contextLoading } = useBlindBoxContext();

    // 状态定义
    const [currentBox, setCurrentBox] = useState<any>(null);
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [isPublished, setIsPublished] = useState<boolean>(false);
    const [image, setImage] = useState<string>('');
    const [items, setItems] = useState<Array<{ id: number; name: string; image: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 根据id查找当前盲盒
    useEffect(() => {
        if (!id) return;

        const fetchBoxDetails = async () => {
            try {
                setLoading(true);
                const mappedData = await getBoxById(Number(id));
                console.log('Fetched box details:', mappedData);
                
                setCurrentBox(mappedData);
                setName(mappedData.name);
                setDescription(mappedData.description);
                setPrice(mappedData.price);
                setStock(mappedData.stock);
                setIsPublished(mappedData.isPublished);
                setImage(mappedData.image || '');
                setItems(mappedData.items);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch box details:', err);
                setError('获取盲盒详情失败');
            } finally {
                setLoading(false);
            }
        };

        fetchBoxDetails();
    }, [id, getBoxById]);

    // 状态已在上方定义，通过useEffect更新



    // 错误处理
    if (error) {
        return (
            <div className="min-h-screen bg-white text-black py-10">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mt-10 text-red-600">{error}</div>
                    <div className="text-center mt-4">
                        <Link to="/admin/boxes" className="text-blue-600 hover:underline">
                            返回盲盒列表
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // 加载状态处理
    if (contextLoading || !currentBox) {
        return (
            <div className="min-h-screen bg-white text-black py-10">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mt-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
                        <p className="mt-2 text-gray-600">加载中...</p>
                    </div>
                </div>
            </div>
        );
    }

    // 表单提交逻辑
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 构建请求数据（包含盲盒信息和款式）
            const requestData = {
                name,
                description,
                image,
                price,
                stock,
                isPublished,
                items: items.map(item => ({
                    id: item.id && item.id > 0 ? item.id : null, // 新款式ID设为null，已有款式保留原ID
                    name: item.name || '',
                    image: item.image || ''
                }))
            };

            console.log('Submitting request with all data in body:', requestData);
            console.log('Items count:', requestData.items.length);
            if (requestData.items.length > 0) {
                console.log('First item:', requestData.items[0]);
            }

            // 设置请求超时（5秒）
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            // 发送请求，明确设置Content-Type为application/json
            console.log('Preparing to send request:');
            console.log('URL:', `/admin/boxes/${currentBox.id}`);
            console.log('Method:', 'PUT');
            console.log('Request body:', requestData);

            try {
                const response = await request(`/admin/boxes/${currentBox.id}`, 'PUT', requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                console.log('Request succeeded:', response);
                showToast('保存成功', 'success');
                navigate('/admin/boxes');
            } catch (error) {
                clearTimeout(timeoutId);
                console.error('Request failed:', error);
                console.error('Error details:', error instanceof Error ? error.stack : error);
                showToast('保存失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error');
            }
        } catch (error) {
            showToast('保存失败: ' + (error instanceof Error ? error.message : '未知错误'), 'error');
            console.error('更新盲盒失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleItemChange = (itemId: number, field: 'name' | 'image', value: string) => {
        const updated = items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item
        );
        setItems(updated);
    };

    const handleAddItem = () => {
        // 为新款式生成一个负数的临时ID，这样可以与数据库ID区分
        const newItem = { id: -Date.now(), name: '', image: '' };
        setItems([...items, newItem]);
    };

    const handleRemoveItem = (itemId: number) => {
        if (items.length <= 1) return;
        const updated = items.filter((item) => item.id !== itemId);
        setItems(updated);
    };

    return (
        <div className="min-h-screen bg-white text-black py-10">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/admin/boxes" className="text-blue-600 hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        返回盲盒列表
                    </Link>
                    <h1 className="text-2xl font-bold text-center">编辑盲盒</h1>
                    <div></div> {/* 占位元素保持标题居中 */}
                </div>

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

                    {/* 盲盒封面图片 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">盲盒封面图片</label>
                        <ImageUpload
                            value={image}
                            onChange={setImage}
                            category="box"
                            placeholder="点击上传盲盒封面"
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
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
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
                                onChange={(e) => setStock(parseInt(e.target.value))}
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
                                <div className="grid grid-cols-1 gap-4">
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
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? '保存中...' : '保存修改'}
                        </button>
                        <Link to="/admin/boxes" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                            取消
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminBoxEdit;
