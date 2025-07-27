import React, { useState, useContext, useEffect } from 'react';
import type { BlindBox } from '../types/blindBox';
import { useNavigate } from 'react-router-dom';
import { BlindBoxContext } from '../context/BlindBoxContext';
import { searchBlindBoxes } from '../api/blindBoxApi';
import { Button, Card, TextField, LoadingSpinner, Chip } from '../components/MaterialUI';
import {
    SearchIcon,
    CloseIcon,
    HomeIcon,
    UserIcon,
    BoxIcon,
    StarIcon,
    GiftIcon,
    TrendingIcon,
    ArrowRightIcon
} from '../components/Icons';

const Home: React.FC = () => {
    const { boxes, refreshBoxes } = useContext(BlindBoxContext)!;

    // 组件挂载时获取盲盒数据
    useEffect(() => {
        refreshBoxes();
    }, [refreshBoxes]);
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<BlindBox[] | null>(null);

    // 获取显示的盲盒列表
    const displayBoxes = searchResults !== null ? searchResults : boxes;

    // 搜索功能
    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKeyword.trim()) {
            setSearchResults(null);
            return;
        }

        setIsSearching(true);
        try {
            const response = await searchBlindBoxes(searchKeyword);
            setSearchResults(response.data || []);
        } catch (error) {
            console.error('搜索失败:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setSearchKeyword('');
        setSearchResults(null);
        refreshBoxes();
    };

    const quickActions = [
        {
            label: '我的主页',
            icon: <HomeIcon size={18} />,
            path: '/user/profile',
            color: 'bg-blue-500'
        },
        {
            label: '抽中的盲盒',
            icon: <UserIcon size={18} />,
            path: '/user/boxes',
            color: 'bg-green-500'
        },
        {
            label: '充值中心',
            icon: <GiftIcon size={18} />,
            path: '/recharge',
            color: 'bg-purple-500'
        },
        {
            label: '热门盲盒',
            icon: <TrendingIcon size={18} />,
            action: () => setSearchKeyword('热门'),
            color: 'bg-red-500'
        }
    ];

    const popularTags = [
        { label: '🔥 热门', value: '热门' },
        { label: '⭐ 限定', value: '限定' },
        { label: '🎌 动漫', value: '动漫' },
        { label: '🎭 手办', value: '手办' },
        { label: '🎨 潮玩', value: '潮玩' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-violet-100">
            {/* 美观的顶部导航 */}
            <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo 区域 - 居中对齐 */}
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                                <BoxIcon size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    Chewytta
                                </h1>
                                <p className="text-xs text-gray-500">盲盒收藏平台</p>
                            </div>
                        </div>

                        {/* 快捷操作按钮组 - 居中排列 */}
                        <div className="flex items-center space-x-3">
                            {quickActions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant="outlined"
                                    size="medium"
                                    onClick={() => action.path ? navigate(action.path) : action.action?.()}
                                    startIcon={action.icon}
                                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 主内容区域 - 更宽的居中布局 */}
            <div className="max-w-6xl mx-auto px-8 py-12">
                {/* 搜索区域 - 完全居中，增大尺寸 */}
                <div className="mb-16">
                    <Card variant="elevated" className="p-12 bg-white/90 backdrop-blur-sm shadow-xl border border-purple-100">
                        <div className="text-center mb-10">
                            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                                探索精彩盲盒世界
                            </h2>
                            <p className="text-xl text-gray-600">发现你喜爱的收藏品，每一次开箱都是惊喜</p>
                        </div>

                        {/* 搜索表单 - 居中，增大尺寸 */}
                        <form onSubmit={handleSearchSubmit} className="relative max-w-3xl mx-auto mb-10">
                            <TextField
                                value={searchKeyword}
                                onChange={setSearchKeyword}
                                placeholder="搜索你想要的盲盒..."
                                fullWidth
                                variant="outlined"
                                className="text-xl shadow-lg"
                                style={{
                                    fontSize: '18px',
                                }}
                                startIcon={<SearchIcon size={24} className="text-purple-500" />}
                                endIcon={
                                    searchKeyword && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="text-gray-400 hover:text-purple-500 transition-colors p-2 rounded-full hover:bg-purple-50"
                                        >
                                            <CloseIcon size={22} />
                                        </button>
                                    )
                                }
                            />
                        </form>

                        {/* 热门标签 - 居中排列，增大尺寸 */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {popularTags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag.label}
                                    variant="outlined"
                                    onClick={() => {
                                        setSearchKeyword(tag.value);
                                        setTimeout(() => {
                                            const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
                                            handleSearchSubmit(fakeEvent);
                                        }, 100);
                                    }}
                                    className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200 text-purple-700 hover:from-purple-500 hover:to-blue-500 hover:text-white hover:border-purple-400 cursor-pointer transition-all duration-300 transform hover:scale-105 text-base px-6 py-3"
                                />
                            ))}
                        </div>
                    </Card>
                </div>

                {/* 结果区域 */}
                {isSearching ? (
                    <div className="text-center py-12">
                        <LoadingSpinner size="large" />
                        <p className="mt-4 text-gray-600">搜索中...</p>
                    </div>
                ) : (
                    <>
                        {/* 结果标题 */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                {searchResults !== null ? (
                                    <>搜索结果："{searchKeyword}" ({searchResults.length} 个)</>
                                ) : (
                                    '精选盲盒'
                                )}
                            </h3>
                            {searchResults !== null && (
                                <Button
                                    variant="outlined"
                                    onClick={clearSearch}
                                    size="small"
                                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                                >
                                    清除搜索
                                </Button>
                            )}
                        </div>

                        {/* 盲盒网格 */}
                        {displayBoxes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {displayBoxes.map((box: BlindBox) => (
                                    <Card
                                        key={box.id}
                                        variant="elevated"
                                        hover={true}
                                        className="group overflow-hidden bg-white/95 backdrop-blur-sm border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {/* 图片区域 */}
                                        <div className="aspect-square bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
                                            <img
                                                src={box.image || (box.items && box.items.length > 0 && box.items[0].image ? box.items[0].image : '/vite.svg')}
                                                alt={box.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/vite.svg';
                                                }}
                                            />
                                            {/* 价格标签 */}
                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                                                ¥{box.price?.toFixed(2) || '0.00'}
                                            </div>
                                            {/* 库存警告 */}
                                            {box.stock !== undefined && box.stock <= 10 && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    仅剩 {box.stock}
                                                </div>
                                            )}
                                        </div>

                                        {/* 内容区域 */}
                                        <div className="p-5">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                                                {box.name}
                                            </h4>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                                {box.description || '暂无描述'}
                                            </p>

                                            {/* 底部信息 */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <StarIcon size={14} className="mr-1" />
                                                    库存: {box.stock || 0}
                                                </div>
                                                <Button
                                                    variant="filled"
                                                    size="small"
                                                    onClick={() => navigate(`/box/${box.id}`)}
                                                    endIcon={<ArrowRightIcon size={14} />}
                                                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-xs"
                                                >
                                                    立即抽取
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : searchResults !== null ? (
                            <Card className="p-16 text-center bg-white/90 backdrop-blur-sm border border-purple-100 shadow-lg">
                                <div className="max-w-md mx-auto">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                                            <SearchIcon size={32} className="text-purple-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                                        没有找到相关盲盒
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        没有找到包含 "{searchKeyword}" 的盲盒，试试其他关键词吧
                                    </p>
                                    <Button
                                        variant="outlined"
                                        onClick={clearSearch}
                                        className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                                    >
                                        查看所有盲盒
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-16 text-center bg-white/90 backdrop-blur-sm border border-purple-100 shadow-lg">
                                <div className="max-w-md mx-auto">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                                            <BoxIcon size={32} className="text-purple-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-gray-700 mb-3">暂无盲盒数据</h3>
                                    <p className="text-gray-500">敬请期待更多精彩内容</p>
                                </div>
                            </Card>
                        )}

                        {/* 快速导航卡片 - 居中排列 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border border-purple-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="mb-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <UserIcon size={28} className="text-white" />
                                    </div>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">个人中心</h4>
                                <p className="text-gray-600 mb-6">管理你的账户信息和设置</p>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate('/user/profile')}
                                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                                >
                                    立即前往
                                </Button>
                            </Card>

                            <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border border-blue-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="mb-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <BoxIcon size={28} className="text-white" />
                                    </div>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">我的收藏</h4>
                                <p className="text-gray-600 mb-6">查看已购买的盲盒收藏</p>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate('/user/favorites')}
                                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                                >
                                    立即前往
                                </Button>
                            </Card>

                            <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border border-indigo-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="mb-6">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <div className="text-white font-bold text-lg">¥</div>
                                    </div>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-3">账户充值</h4>
                                <p className="text-gray-600 mb-6">为你的账户充值余额</p>
                                <Button
                                    variant="filled"
                                    fullWidth
                                    onClick={() => navigate('/recharge')}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                                >
                                    立即充值
                                </Button>
                            </Card>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
