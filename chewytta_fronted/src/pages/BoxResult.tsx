// src/pages/BoxResult.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import useBlindBoxContext from '../hooks/useBlindBoxContent';
import type { Item } from '../types/blindBox';

const BoxResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { boxes } = useBlindBoxContext();
  const location = useLocation();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boxName, setBoxName] = useState<string>('');

  useEffect(() => {
    const state = location.state as {
      boxName?: string;
      item?: Item;
      isNew?: boolean;
      balance?: number;
    };

    if (state?.item) {
      // 优先使用state中的数据
      setItem(state.item);
      setBoxName(state.boxName || '未知盲盒');
      setLoading(false);
    } else if (id) {
      // 降级处理：如果没有state数据，尝试从URL参数获取
      const urlParams = new URLSearchParams(location.search);
      const itemId = urlParams.get('itemId');

      if (itemId) {
        const box = boxes.find((b) => b.id === Number(id));
        if (box) {
          const foundItem = box.items.find((i) => i.id === Number(itemId));
          if (foundItem) {
            setItem(foundItem);
            setBoxName(box.name);
          } else {
            setError('物品不存在');
          }
        } else {
          setError('盲盒不存在');
        }
      } else {
        setError('参数错误');
      }
      setLoading(false);
    } else {
      setError('参数错误');
      setLoading(false);
    }
  }, [id, boxes, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p>加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">⚠️ {error}</p>
          <Link to="/home" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const state = location.state as {
    boxName?: string;
    item?: Item;
    isNew?: boolean;
    balance?: number;
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h1 className="text-3xl font-bold mb-8">恭喜你！</h1>
        <p className="text-xl mb-6">你从「{boxName}」抽到了：</p>

        {item && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 inline-block">
            <img
              src={item.image || '/api/placeholder/200/200'}
              alt={item.name}
              className="w-48 h-48 object-cover mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            {item.rarity && (
              <p className="text-gray-600 capitalize">稀有度: {item.rarity}</p>
            )}
          </div>
        )}

        {state?.isNew && (
          <div className="mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              🎉 新款式！
            </span>
          </div>
        )}

        {state?.balance !== undefined && (
          <p className="text-gray-600 mb-6">当前余额: ¥{state.balance.toFixed(2)}</p>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/home"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded no-underline inline-block"
          >
            返回首页
          </Link>
          <Link
            to={`/box/${id}`}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
          >
            再抽一次
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BoxResult;