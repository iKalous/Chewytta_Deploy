import React, { useState, useContext } from 'react';
import type { BlindBox } from '../types/blindBox';
import { Link, useNavigate } from 'react-router-dom';
import { BlindBoxContext } from '../context/BlindBoxContext';
import { searchBlindBoxes } from '../api/blindBoxApi';
import { Button, Card, TextField, LoadingSpinner, Chip } from '../components/MaterialUI';

const Home: React.FC = () => {
    const { boxes, loading, refreshBoxes } = useContext(BlindBoxContext)!;
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<BlindBox[] | null>(null);
    const [showSearchHistory, setShowSearchHistory] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        const saved = localStorage.getItem('searchHistory');
        return saved ? JSON.parse(saved) : [];
    });

    // 获取显示的盲盒列表
    const displayBoxes = searchResults !== null ? searchResults : boxes;

    // 添加搜索历史
    const addToSearchHistory = (keyword: string) => {
        if (!keyword.trim()) return;
        const newHistory = [keyword, ...searchHistory.filter(item => item !== keyword)].slice(0, 5);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    };

    // 清除搜索历史
    const clearSearchHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('searchHistory');
        setShowSearchHistory(false);
    };

    // 搜索盲盒
    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchKeyword.trim()) {
            setSearchResults(null);
            return;
        }

        addToSearchHistory(searchKeyword.trim());
        setShowSearchHistory(false);
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

    // 清除搜索
    const clearSearch = () => {
        setSearchKeyword('');
        setSearchResults(null);
        setShowSearchHistory(false);
        refreshBoxes();
    };

    // 快捷搜索标签
    const popularTags = ['热门', '限定', '动漫', '手办', '潮玩'];

    // 处理标签点击
    const handleTagClick = (tag: string) => {
        setSearchKeyword(tag);
        setTimeout(() => {
            const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
            handleSearchSubmit(fakeEvent);
        }, 100);
    };

    return (
        <div className="min-h-screen bg-surface">
            {/* Hero Section with Search */}
            <div className="relative bg-gradient-to-br from-primary to-primary-dark text-white">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 font-heading">
                            Chewytta 盲盒世界
                        </h1>
                        <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                            探索惊喜，收集你喜爱的物品，每一次开盒都是全新的冒险！
                        </p>
                    </div>

                    {/* 搜索区域 */}
                    <div className="max-w-2xl mx-auto relative">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <TextField
                                value={searchKeyword}
                                onChange={setSearchKeyword}
                                placeholder="搜索你想要的盲盒..."
                                fullWidth
                                className="bg-white text-gray-900 text-lg"
                                startIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                }
                                endIcon={
                                    searchKeyword && (
                                        <button
                                            type="button"
                                            onClick={clearSearch}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )
                                }
                                onFocus={() => setShowSearchHistory(true)}
                            />

                            {/* 搜索历史下拉 */}
                            {showSearchHistory && searchHistory.length > 0 && (
                                <Card className="absolute top-full left-0 right-0 mt-2 z-10 max-h-60 overflow-y-auto">
                                    <div className="p-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">搜索历史</span>
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={clearSearchHistory}
                                                className="text-xs text-gray-500"
                                            >
                                                清除
                                            </Button>
                                        </div>
                                        {searchHistory.map((keyword, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSearchKeyword(keyword);
                                                    setShowSearchHistory(false);
                                                    setTimeout(() => {
                                                        const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
                                                        handleSearchSubmit(fakeEvent);
                                                    }, 100);
                                                }}
                                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                                            >
                                                {keyword}
                                            </button>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </form>

                        {/* 热门标签 */}
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            {popularTags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    variant="outlined"
                                    onClick={() => handleTagClick(tag)}
                                    className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-primary"
                                />
                            ))}
                        </div>
                    </div>

                    {/* 快捷导航 */}
                    <div className="flex justify-center mt-8">
                        <Button
                            variant="filled"
                            size="large"
                            className="bg-white text-primary hover:bg-gray-100 mr-4"
                        >
                            <Link to="/user/profile" className="no-underline">
                                我的主页
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 装饰性背景元素 */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white opacity-8 rounded-full"></div>
            </div>

            {/* 盲盒展示区域 */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {isSearching && (
                    <div className="text-center py-8">
                        <LoadingSpinner size="large" />
                        <p className="mt-4 text-on-surface-variant">搜索中...</p>
                    </div>
                )}

                {!isSearching && (
                    <>
                        {/* 结果标题 */}
                        <div className="mb-8">
                            {searchResults !== null ? (
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-on-surface">
                                        搜索结果："{searchKeyword}" ({searchResults.length} 个结果)
                                    </h2>
                                    <Button variant="text" onClick={clearSearch}>
                                        清除搜索
                                    </Button>
                                </div>
                            ) : (
                                <h2 className="text-3xl font-bold text-on-surface text-center">
                                    精选盲盒
                                </h2>
                            )}
                        </div>

                        {/* 盲盒网格 */}
                        {loading ? (
                            <div className="text-center py-16">
                                <LoadingSpinner size="large" />
                                <p className="mt-4 text-on-surface-variant">加载中...</p>
                            </div>
                        ) : displayBoxes.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {displayBoxes.map((box: BlindBox) => (
                                    <Card
                                        key={box.id}
                                        variant="elevated"
                                        hover={true}
                                        className="group cursor-pointer"
                                        onClick={() => navigate(`/box/${box.id}`)}
                                    >
                                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                            <img
                                                src={box.image || (box.items && box.items.length > 0 && box.items[0].image ? box.items[0].image : '/vite.svg')}
                                                alt={box.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/vite.svg';
                                                }}
                                            />
                                            <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                                                ¥{box.price?.toFixed(2) || '0.00'}
                                            </div>
                                            {box.stock !== undefined && box.stock <= 10 && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                    仅剩 {box.stock}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                {box.name}
                                            </h3>
                                            <p className="text-on-surface-variant text-sm mb-3 line-clamp-2">
                                                {box.description}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-on-surface-variant">
                                                    库存: {box.stock || 0}
                                                </span>
                                                <Button
                                                    variant="filled"
                                                    size="small"
                                                    onClick={() => {
                                                        navigate(`/box/${box.id}`);
                                                    }}
                                                >
                                                    查看详情
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : searchResults !== null ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-semibold text-on-surface mb-2">
                                    没有找到相关盲盒
                                </h3>
                                <p className="text-on-surface-variant mb-4">
                                    没有找到包含 "{searchKeyword}" 的盲盒
                                </p>
                                <Button variant="outlined" onClick={clearSearch}>
                                    查看所有盲盒
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-2xl font-semibold text-on-surface mb-2">暂无盲盒数据</h3>
                                <p className="text-on-surface-variant">敬请期待更多精彩内容</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* 底部 CTA 区域 */}
            {!searchResults && displayBoxes.length > 0 && (
                <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-3xl font-bold mb-4">发现更多惊喜</h2>
                        <p className="text-lg mb-8 opacity-90">
                            每个盲盒都有独特的收藏价值，快来探索属于你的宝藏！
                        </p>
                        <Button
                            variant="filled"
                            size="large"
                            className="bg-white text-primary hover:bg-gray-100"
                        >
                            <Link to="/boxes" className="no-underline">
                                浏览全部盲盒
                            </Link>
                        </Button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
