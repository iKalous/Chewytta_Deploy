import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { addBoxToUserBoxes } from '../utils/localStorage';

// 模拟数据
const mockBoxes = [
    {
        id: 1,
        name: '神秘盲盒A',
        price: 29.9,
        items: [
            { id: 1, name: '隐藏款 - 小熊猫', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop' },
  { id: 2, name: '稀有款 - 飞天猫', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop' },
  { id: 3, name: '普通款 - 蓝精灵', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop' },
        ],
    },
];

const BoxResultPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const numericId = Number(id);

    // 先查找当前盲盒
    const box = mockBoxes.find((b) => b.id === numericId);

    // 在 useEffect 中处理抽奖逻辑
    useEffect(() => {
        if (!box) return;

        const randomItem = box.items[Math.floor(Math.random() * box.items.length)];

        const drawnBox = {
            id: box.id,
            name: box.name,
            image: randomItem.image,
            price: box.price,
            date: new Date().toLocaleDateString(),
        };

        addBoxToUserBoxes(drawnBox);
    }, [box]);

    // 提前返回错误信息
    if (!box) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-red-600 text-lg">⚠️ 盲盒不存在</p>
            </div>
        );
    }

    // 永远保证 randomItem 存在
    const randomItem = box.items[Math.floor(Math.random() * box.items.length)];

    return (
        <div className="min-h-screen bg-gray-100 py-10 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
                <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 恭喜你抽中了！</h1>
                <img
                    src={randomItem.image}
                    alt={randomItem.name}
                    className="w-40 h-40 object-cover mx-auto mb-4"
                />
                <p className="text-xl font-medium">{randomItem.name}</p>
                <p className="text-gray-600 mt-2">属于盲盒：{box.name}</p>

                <Link
                    to={`/box/${id}`}
                    className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    返回详情页
                </Link>
            </div>
        </div>
    );
};

export default BoxResultPage;
