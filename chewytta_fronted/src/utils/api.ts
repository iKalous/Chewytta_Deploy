// src/utils/api.ts

import { getLocalStorage } from './localStorage';
import { showToast } from './globalToast';
import type { BlindBox } from '../types';

// 基础URL
const BASE_URL = '/api';

/**
 * 基础请求函数
 * @param url 请求URL
 * @param method 请求方法
 * @param data 请求数据
 * @param options 额外选项（包括headers和signal）
 * @returns Promise<any>
 */
export const request = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  options: { headers?: Record<string, string>, signal?: AbortSignal } = {}
): Promise<any> => {
  try {
    // 构建完整URL
    const fullUrl = `${BASE_URL}${url}`;
    console.log('API Request - Full URL:', fullUrl);
    console.log('API Request - Method:', method);
    console.log('API Request - Is login URL:', url === '/users/login');

    // 提取headers
    const headers = options.headers || {};

    // 构建请求头
    const requestHeaders: Record<string, string> = {
      ...headers,
    };

    // 如果数据不是FormData且没有指定Content-Type，则设置默认值
    if (!(data instanceof FormData) && !headers['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    // 打印Content-Type设置
    console.log('API Request - Content-Type:', requestHeaders['Content-Type']);

    // 处理认证头
    if (url !== '/users/login') {
      // 对于非登录请求，添加Authorization头
      const token = getLocalStorage('token');
      console.log('API Request - Token:', token);

      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
        console.log('API Request - Added Authorization header:', requestHeaders['Authorization']);
      } else {
        console.log('API Request - No token available');
      }
    } else {
      // 对于登录请求，不添加Authorization头
      console.log('API Request - Login request detected, no Authorization header added');
    }

    // 构建请求选项
    // 尝试将credentials设置为omit以避免浏览器自动处理认证
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'omit',
      // 添加signal参数
      signal: options.signal
    };

    // 如果有数据，添加到请求体
        if (data) {
          if (data instanceof FormData) {
            // 对于FormData，直接传递，不进行JSON序列化
            fetchOptions.body = data;
          } else {
            // 其他类型数据，转换为JSON字符串
            fetchOptions.body = JSON.stringify(data);
            // 添加调试信息，查看序列化后的JSON
            console.log('API Request - Serialized JSON Body:', fetchOptions.body);
          }
        }

    // 打印请求信息
    console.log('API Request - Headers:', requestHeaders);
    console.log('API Request - Raw Body:', data);
    // 特别打印items数组信息
    if (data && data.items) {
      console.log('API Request - Items Count:', data.items.length);
      console.log('API Request - First Item:', data.items[0]);
    }
    console.log('API Request - Options:', fetchOptions);

    // 发送请求
    console.log('API Request - Sending to:', fullUrl);
    const response = await fetch(fullUrl, fetchOptions);
    console.log('API Response - Received from:', fullUrl);
    console.log('API Response - Status:', response.status);
    console.log('API Response - Status Text:', response.statusText);
    console.log('API Response - Headers:', Object.fromEntries(response.headers.entries()));

    // 尝试解析响应体为JSON
    let result;
    try {
      // 先检查响应体是否为空
      const text = await response.text();
      console.log('API Response - Text:', text);
      if (!text.trim()) {
        // 处理空响应体
        result = { success: response.ok };
      } else {
        // 尝试解析JSON
        result = JSON.parse(text);
      }
    } catch (jsonError: any) {
      console.error('API Response - JSON Parsing Error:', jsonError);
      throw new Error(`响应解析错误: ${jsonError.message || '未知错误'}`);
    }
    console.log('API Response - Parsed Body:', result);

    // 处理响应
    if (!response.ok) {
      // 处理401未授权
      if (response.status === 401) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        showToast('登录已过期，请重新登录');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
      throw new Error(result.message || `请求失败: ${response.status}`);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '网络错误，无法连接服务器';
    showToast(errorMessage);
    throw error;
  }
};

/**
 * 登录请求
 * @param username 用户名
 * @param password 密码
 * @returns Promise<any>
 */
export const login = async (username: string, password: string) => {
  try {
    console.log('登录请求开始，credentials设置为omit');
    const response = await request('/users/login', 'POST', { username, password });
    console.log('登录请求成功，响应数据:', response);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', response.userId || '');
      localStorage.setItem('role', response.role || '');
    }
    return response;
  } catch (error) {
    // 增强错误信息捕获
    console.error('登录请求失败:', error);
    if (error instanceof Error) {
      console.error('登录请求失败，错误信息:', error.message);
    }
    // 显示错误提示
    showToast('登录失败，请检查用户名和密码');
    throw error;
  }
};

// 封装常用请求方法

/**
 * 注册请求
 * @param username 用户名
 * @param email 邮箱
 * @param phone 手机号
 * @param password 密码
 * @param confirmPassword 确认密码
 * @returns Promise<any>
 */
export const register = async (username: string, email: string, phone: string, password: string, confirmPassword: string) => {
  try {
    console.log('注册请求开始');
    const response = await request('/users/register', 'POST', {
      username,
      email,
      phone,
      password,
      confirmPassword
    });
    console.log('注册请求成功，响应数据:', response);
    return response;
  } catch (error) {
    console.error('注册请求失败:', error);
    if (error instanceof Error) {
      console.error('注册请求失败，错误信息:', error.message);
    }
    showToast('注册失败，请检查信息后重试');
    throw error;
  }
};

/**
 * 获取所有盲盒
 * @returns Promise<{ success: boolean; data: BlindBox[] }>
 */
export const getBlindBoxes = async (): Promise<{ success: boolean; data: BlindBox[] }> => {
  try {
    console.log('获取所有盲盒请求开始');
    const response = await request('/blind-boxes', 'GET');
    console.log('获取所有盲盒请求成功，响应数据:', response);
    return response;
  } catch (error) {
    console.error('获取所有盲盒请求失败:', error);
    showToast('获取盲盒数据失败');
    throw error;
  }
};

/**
 * 搜索盲盒
 * @param keyword 搜索关键词
 * @returns Promise<{ success: boolean; data: BlindBox[] }>
 */
export const searchBlindBoxes = async (keyword: string): Promise<{ success: boolean; data: BlindBox[] }> => {
  try {
    console.log('搜索盲盒请求开始，关键词:', keyword);
    const response = await request(`/blind-boxes/search?keyword=${encodeURIComponent(keyword)}`, 'GET');
    console.log('搜索盲盒请求成功，响应数据:', response);
    return response;
  } catch (error) {
    console.error('搜索盲盒请求失败:', error);
    showToast('搜索盲盒数据失败');
    throw error;
  }
};

/**
 * GET请求
 * @param url 请求URL
 * @param params 查询参数
 * @param headers 额外请求头
 * @returns Promise<any>
 */
export const get = async (
  url: string,
  params?: Record<string, any>,
  headers: Record<string, string> = {}
): Promise<any> => {
  // 处理查询参数
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url = `${url}${queryString ? '?' : ''}${queryString}`;
  }

  return request(url, 'GET', undefined, headers);
};

/**
 * POST请求
 * @param url 请求URL
 * @param data 请求数据
 * @param headers 额外请求头
 * @returns Promise<any>
 */
export const post = async (
  url: string,
  data?: any,
  headers: Record<string, string> = {}
): Promise<any> => {
  return request(url, 'POST', data, headers);
};

/**
 * PUT请求
 * @param url 请求URL
 * @param data 请求数据
 * @param headers 额外请求头
 * @returns Promise<any>
 */
export const put = async (
  url: string,
  data?: any,
  headers: Record<string, string> = {}
): Promise<any> => {
  return request(url, 'PUT', data, headers);
};

/**
 * DELETE请求
 * @param url 请求URL
 * @param headers 额外请求头
 * @returns Promise<any>
 */
export const del = async (
  url: string,
  headers: Record<string, string> = {}
): Promise<any> => {
  return request(url, 'DELETE', undefined, headers);
};