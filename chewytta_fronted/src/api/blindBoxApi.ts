// src/api/blindBoxApi.ts
import axios from 'axios';
import type { BlindBox, ApiResponse, Item, Comment } from '../types/blindBox';

// 获取当前登录用户信息
export const getCurrentUser = async (): Promise<ApiResponse<{ id: number; username: string; role: string }>> => {
  try {
    const response = await api.get<ApiResponse<{ id: number; username: string; role: string }>>('/users/me');
    return response.data;
  } catch (error) {
    console.error('获取当前用户信息API调用失败:', error);
    return {
      success: false,
      message: '用户未登录',
      data: { id: -1, username: '游客', role: 'user' },
    };
  }
};

// 获取盲盒评论
export const getBlindBoxComments = async (boxId: number): Promise<ApiResponse<Comment[]>> => {
  try {
    const response = await api.get<ApiResponse<Comment[]>>(`/comments/box/${boxId}`);
    return response.data;
  } catch (error) {
    console.error('获取盲盒评论API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: [],
    };
  }
};

// 提交评论
export const submitComment = async (boxId: number, content: string): Promise<ApiResponse<Comment>> => {
  try {
    const response = await api.post<ApiResponse<Comment>>(`/comments`, {
      boxId,
      content
    });
    return response.data;
  } catch (error) {
    console.error('提交评论API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: {
        id: -1,
        user: '系统',
        content: '评论提交失败',
        date: new Date().toISOString(),
      },
    };
  }
};

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 假设API基础路径是/api
  timeout: 15000, // 增加超时时间到15秒
});

// 添加请求拦截器，自动携带Authorization头
api.interceptors.request.use(
  (config) => {
    // 获取本地存储中的token
    const token = localStorage.getItem('token');
    // 如果token存在，则添加到请求头
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 收藏盲盒
 * @param boxId 盲盒ID
 * @returns 收藏结果
 */
export const favoriteBlindBox = async (boxId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post<ApiResponse<boolean>>(`/blind-boxes/${boxId}/favorite`);
    return response.data;
  } catch (error) {
    console.error('收藏盲盒API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: false,
    };
  }
};

/**
 * 取消收藏盲盒
 * @param boxId 盲盒ID
 * @returns 取消收藏结果
 */
export const unfavoriteBlindBox = async (boxId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.delete<ApiResponse<boolean>>(`/blind-boxes/${boxId}/favorite`);
    return response.data;
  } catch (error) {
    console.error('取消收藏盲盒API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: false,
    };
  }
};

/**
 * 检查盲盒是否已收藏
 * @param boxId 盲盒ID
 * @returns 是否收藏
 */
export const isBlindBoxFavorited = async (boxId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.get<ApiResponse<boolean>>(`/blind-boxes/${boxId}/favorite`);
    return response.data;
  } catch (error) {
    console.error('检查盲盒收藏状态API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: false,
    };
  }
};

/**
 * 获取用户收藏的盲盒列表
 * @returns 收藏的盲盒列表
 */
export const getUserFavoriteBoxes = async (): Promise<ApiResponse<BlindBox[]>> => {
  try {
    const response = await api.get<ApiResponse<BlindBox[]>>(`/blind-boxes/favorites`);
    return response.data;
  } catch (error) {
    console.error('获取用户收藏列表API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: [],
    };
  }
};

/**
 * 购买盲盒
 * @param boxId 盲盒ID
 * @returns 购买结果
 */
export const buyBlindBox = async (boxId: number): Promise<ApiResponse<{ itemId: number }>> => {
  try {
    const response = await api.post<ApiResponse<{ itemId: number }>>(`/blind-boxes/${boxId}/buy`);
    return response.data;
  } catch (error) {
    console.error('购买盲盒API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: { itemId: -1 },
    };
  }
};

/**
 * 搜索盲盒
 * @param keyword 搜索关键词
 * @returns 搜索结果
 */
export const searchBlindBoxes = async (keyword: string): Promise<ApiResponse<BlindBox[]>> => {
  try {
    const response = await api.get<ApiResponse<BlindBox[]>>('/blind-boxes/search', {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error('搜索盲盒API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: [],
    };
  }
};

/**
 * 获取所有盲盒
 * @returns 盲盒列表
 */
export const getAllBlindBoxes = async (): Promise<ApiResponse<BlindBox[]>> => {
  try {
    const response = await api.get<ApiResponse<BlindBox[]>>('/blind-boxes');
    return response.data;
  } catch (error) {
    console.error('获取盲盒列表API调用失败:', error);
    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: [],
    };
  }
};

/**
 * 获取用户抽中的盲盒记录
 * @param userId 用户ID
 * @returns 用户抽中的盲盒列表
 */
export const getUserDrawnBoxes = async (userId: number): Promise<ApiResponse<any[]>> => {
  try {
    console.log('开始获取用户抽中记录，用户ID:', userId);

    // 检查token
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('获取用户抽中记录失败: 没有token');
      return {
        success: false,
        message: '请先登录',
        data: [],
      };
    }
    console.log('Token存在:', token.substring(0, 20) + '...');

    const response = await api.get<ApiResponse<any[]>>(`/drawn/user/${userId}`);
    console.log('获取用户抽中记录API响应:', response);

    if (response.data) {
      return response.data;
    } else {
      console.error('API响应数据为空');
      return {
        success: false,
        message: '服务器响应异常',
        data: [],
      };
    }
  } catch (error: any) {
    console.error('获取用户抽中记录API调用失败:', error);

    // 详细的错误处理
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);

      if (error.response.status === 401) {
        return {
          success: false,
          message: '登录已过期，请重新登录',
          data: [],
        };
      } else if (error.response.status === 403) {
        return {
          success: false,
          message: '没有权限访问此资源',
          data: [],
        };
      } else if (error.response.status === 500) {
        return {
          success: false,
          message: '服务器内部错误，请稍后重试',
          data: [],
        };
      }
    } else if (error.request) {
      console.error('请求未收到响应:', error.request);
      return {
        success: false,
        message: '网络连接失败，请检查网络',
        data: [],
      };
    }

    return {
      success: false,
      message: error.message || '未知错误',
      data: [],
    };
  }
};

/**
 * 修改用户密码
 * @param userId 用户ID
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 * @returns 修改结果
 */
export const updateUserPassword = async (userId: number, oldPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
  try {
    console.log('开始修改用户密码，用户ID:', userId);

    const response = await api.put<ApiResponse<void>>('/users/password', {
      id: userId,
      oldPassword,
      newPassword
    });

    console.log('修改密码API响应:', response);
    return response.data;
  } catch (error: any) {
    console.error('修改密码API调用失败:', error);

    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);

      if (error.response.status === 400) {
        return {
          success: false,
          message: error.response.data?.message || '旧密码不正确',
          data: undefined,
        };
      } else if (error.response.status === 401) {
        return {
          success: false,
          message: '登录已过期，请重新登录',
          data: undefined,
        };
      }
    }

    return {
      success: false,
      message: '网络错误，请稍后再试',
      data: undefined,
    };
  }
};