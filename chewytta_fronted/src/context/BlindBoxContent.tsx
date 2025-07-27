// src/context/BlindBoxContent.tsx
import { useState, useEffect, useRef, useCallback } from 'react';

import { BlindBoxContext } from './BlindBoxContext.tsx';
import type { BlindBox } from '../types/blindBox';
import { request } from '../utils/api';

export const BlindBoxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [boxes, setBoxes] = useState<BlindBox[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const requestId = useRef<number>(0);

    // 使用useCallback缓存fetchBoxes函数
    const fetchBoxes = useCallback(async () => {
        // 生成新的请求ID
        const currentRequestId = ++requestId.current;
        console.log(`Starting fetchBoxes request #${currentRequestId}`);

        // 如果已经有请求在进行中，取消当前请求
        if (loading) {
            console.log(`Request #${currentRequestId} skipped, another request is already in progress`);
            return;
        }

        // 增加防抖延迟，避免快速重复请求
        await new Promise(resolve => setTimeout(resolve, 200));

        try {
            setLoading(true);
            setError(null);

            // 添加调试信息，查看当前token和登录状态
            const token = localStorage.getItem('token');
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            console.log('Fetching boxes with token:', token);
            console.log('Is logged in:', isLoggedIn);

            console.log('Sending request to /blind-boxes');
            const data = await request('/blind-boxes', 'GET');

            // 检查是否是最新的请求
            if (currentRequestId !== requestId.current) {
                console.log(`Request #${currentRequestId} ignored, newer request #${requestId.current} is in progress`);
                setLoading(false);
                return;
            }

            // 添加调试信息，查看API返回的具体数据
            console.log('API response data:', data);
            console.log('Is data an array?', Array.isArray(data));

            // 确保data是一个数组
            let boxesData = [];
            if (Array.isArray(data)) {
                boxesData = data;
            } else if (data && data.data && Array.isArray(data.data)) {
                boxesData = data.data;
            } else if (data && data.boxes && Array.isArray(data.boxes)) {
                boxesData = data.boxes;
            } else {
                console.warn('API returned unexpected data format');
                setError('数据格式不正确');
                setBoxes([]);
                return;
            }

            // 处理字段映射：将后端的isListed映射为前端的isPublished
            const mappedData = boxesData.map((box: any) => ({
                ...box,
                isPublished: box.isListed !== undefined ? box.isListed : box.isPublished,
                items: box.items || []
            }));
            
            // 只显示已上架的盲盒
            const publishedBoxes = mappedData.filter((box: BlindBox) => box.isPublished === true);
            setBoxes(publishedBoxes);
            console.log('Successfully set boxes data with field mapping');
        } catch (err) {
            // 检查是否是最新的请求
            if (currentRequestId !== requestId.current) {
                console.log(`Error from request #${currentRequestId} ignored, newer request #${requestId.current} is in progress`);
                setLoading(false);
                return;
            }

            setError('获取盲盒数据失败');
            console.error('Failed to fetch boxes:', err);
            // 显示更详细的错误信息
            if (err instanceof Error) {
                console.error('Error message:', err.message);
            }
        } finally {
            // 只有当是最新请求时才更新loading状态
            if (currentRequestId === requestId.current) {
                setLoading(false);
                console.log(`Fetch boxes request #${currentRequestId} completed, loading set to false`);
            }
        }
    }, [setBoxes, setLoading, setError]);

    // 使用useCallback缓存refreshBoxes函数
    // 更新盲盒函数
    const updateBox = useCallback(async (boxId: number, updatedData: Partial<BlindBox>) => {
        console.log(`Updating box with id: ${boxId}`, updatedData);
        try {
            // 不再设置全局loading状态，让调用方处理局部状态
            setError(null);

            // 确保items是一个数组
            const items = updatedData.items || [];
            console.log('Items to update:', items);

            // 构建请求数据对象，确保items被正确格式化
            const formattedItems = items.map(item => ({
                id: item.id,
                name: item.name || '',
                image: item.image || ''
            }));

            // 处理字段映射：将前端的isPublished映射为后端的isListed
            const requestData = {
                ...updatedData,
                items: formattedItems,
                isListed: updatedData.isPublished !== undefined ? updatedData.isPublished : undefined
            };
            // 删除isPublished字段，避免后端混淆
            delete requestData.isPublished;

            console.log('Update box request data:', requestData);

            // 使用JSON格式发送数据
            const response = await request(`/admin/boxes/${boxId}`, 'PUT', requestData);
            console.log('Update box response:', response);

            // 使用服务器返回的完整数据更新本地状态，并处理字段映射
            let updatedBox: any = response.box || response;
            // 将后端的isListed映射回前端的isPublished
            updatedBox = {
                ...updatedBox,
                isPublished: updatedBox.isListed !== undefined ? updatedBox.isListed : updatedBox.isPublished
            };
            setBoxes(prevBoxes => prevBoxes.map(box => 
                box.id === boxId ? { ...box, ...updatedBox } : box
            ));

            return response;
        } catch (err) {
            setError('更新盲盒失败');
            console.error('Failed to update box:', err);
            throw err;
        }
    }, [setBoxes, setError]);

    // 删除盲盒函数
    const deleteBox = useCallback(async (boxId: number) => {
        console.log(`Deleting box with id: ${boxId}`);
        try {
            // 不再设置全局loading状态，让调用方处理局部状态
            setError(null);

            const response = await request(`/admin/boxes/${boxId}`, 'DELETE');
            console.log('Delete box response:', response);

            // 更新本地数据
            setBoxes(prevBoxes => prevBoxes.filter(box => box.id !== boxId));

            return response;
        } catch (err) {
            setError('删除盲盒失败');
            console.error('Failed to delete box:', err);
            throw err;
        }
    }, [setBoxes, setError]);

    // 刷新盲盒数据函数
    const refreshBoxes = useCallback(async () => {
        console.log('refreshBoxes called, fetching boxes...');
        return fetchBoxes();
    }, [fetchBoxes]);

    // 获取所有盲盒数据（包括未上架的）
    const fetchAllBoxes = useCallback(async () => {
        console.log('fetchAllBoxes called in BlindBoxProvider');
        // 生成新的请求ID
        const currentRequestId = ++requestId.current;
        console.log(`Starting fetchAllBoxes request #${currentRequestId}`);

        // 如果已经有请求在进行中，取消当前请求
        if (loading) {
            console.log(`Request #${currentRequestId} skipped, another request is already in progress`);
            return;
        }

        // 增加防抖延迟，避免快速重复请求
        await new Promise(resolve => setTimeout(resolve, 200));

        try {
            setLoading(true);
            setError(null);

            // 添加调试信息，查看当前token和登录状态
            const token = localStorage.getItem('token');
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            console.log('Fetching all boxes with token:', token);
            console.log('Is logged in:', isLoggedIn);

            console.log('Sending request to /admin/boxes');
            const response = await request('/admin/boxes', 'GET');
            console.log('Raw API response for /admin/boxes:', response);

            // 检查是否是最新的请求
            if (currentRequestId !== requestId.current) {
                console.log(`Request #${currentRequestId} ignored, newer request #${requestId.current} is in progress`);
                setLoading(false);
                return;
            }

            // 添加调试信息，查看API返回的具体数据
            console.log('API response data for all boxes:', response);
            console.log('Is data an array?', Array.isArray(response));

            // 确保data是一个数组
            let boxesData = [];
            if (Array.isArray(response)) {
                boxesData = response;
            } else if (response && response.data && Array.isArray(response.data)) {
                boxesData = response.data;
            } else if (response && response.boxes && Array.isArray(response.boxes)) {
                boxesData = response.boxes;
            } else {
                console.warn('API returned unexpected data format');
                setError('数据格式不正确');
                setBoxes([]);
                return;
            }

            // 处理字段映射：将后端的isListed映射为前端的isPublished
            const mappedData = boxesData.map((box: any) => ({
                ...box,
                isPublished: box.isListed !== undefined ? box.isListed : box.isPublished,
                items: box.items || []
            }));
            
            // 显示所有盲盒
            console.log('Setting boxes data in fetchAllBoxes:', mappedData);
            console.log('Current boxes state before update:', boxes);
            setBoxes(mappedData);
            console.log('Successfully set all boxes data with field mapping');
            console.log('Current boxes state after update:', mappedData);

            // 添加调试信息，查看boxes状态更新前后的值
            console.log('Boxes data in BlindBoxProvider after render:', mappedData);
        } catch (err) {
            // 检查是否是最新的请求
            if (currentRequestId !== requestId.current) {
                console.log(`Error from request #${currentRequestId} ignored, newer request #${requestId.current} is in progress`);
                setLoading(false);
                return;
            }

            setError('获取盲盒数据失败');
            console.error('Failed to fetch all boxes:', err);
            // 显示更详细的错误信息
            if (err instanceof Error) {
                console.error('Error message:', err.message);
            }
        } finally {
            // 只有当是最新请求时才更新loading状态
            if (currentRequestId === requestId.current) {
                setLoading(false);
                console.log(`Fetch all boxes request #${currentRequestId} completed, loading set to false`);
            }
        }
    }, [setBoxes, setLoading, setError]);

    // 根据ID获取盲盒详情（包括其款式）
    const getBoxById = useCallback(async (boxId: number) => {
        console.log(`Fetching box details with id: ${boxId}`);
        try {
            const data = await request(`/admin/boxes/${boxId}`, 'GET');
            console.log('Fetched box details:', data);
            
            // 处理字段映射：将后端的isListed映射为前端的isPublished
            const mappedData = {
                ...data,
                isPublished: data.isListed !== undefined ? data.isListed : data.isPublished,
                items: data.items || []
            };
            
            return mappedData;
        } catch (err) {
            console.error('Failed to fetch box details:', err);
            throw err;
        }
    }, []);

    // 组件挂载时获取数据
    useEffect(() => {
        console.log('BlindBoxProvider mounted');
        // 不在挂载时自动获取数据，由子组件决定何时获取
        return () => {
            console.log('BlindBoxProvider unmounted');
        };
    }, []); // 空依赖数组，只在挂载时执行一次

    // 添加组件卸载时的调试信息
    useEffect(() => {
        return () => {
            console.log('BlindBoxProvider cleanup');
        };
    }, []);

    // 监听登录状态变化
    useEffect(() => {
        // 存储当前登录状态
        let currentIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        let isRefreshing = false;

        const handleStorageChange = () => {
            console.log('Storage changed, checking login status...');
            const newIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            // 只有当登录状态实际变化时才刷新数据
            if (newIsLoggedIn !== currentIsLoggedIn && !isRefreshing) {
                currentIsLoggedIn = newIsLoggedIn;
                console.log('Login status changed, refreshing boxes...');
                if (newIsLoggedIn) {
                    isRefreshing = true;
                    refreshBoxes().finally(() => {
                        isRefreshing = false;
                    });
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refreshBoxes]);

    // 添加调试信息，查看boxes状态
    console.log('Current boxes state in BlindBoxProvider:', boxes);

    return (
        <BlindBoxContext.Provider value={{ boxes, setBoxes, loading, error, refreshBoxes, updateBox, deleteBox, getBoxById, fetchAllBoxes }}>
            {children}
        </BlindBoxContext.Provider>
    );
};
