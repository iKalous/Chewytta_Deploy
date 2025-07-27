// src/components/ImageUpload.tsx
import React, { useRef, useState } from 'react';
import { showToast } from '../utils/globalToast';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    category: string;
    placeholder?: string;
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    category,
    placeholder = "点击上传图片",
    className = ""
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            showToast('请选择图片文件', 'error');
            return;
        }

        // 验证文件大小（5MB）
        if (file.size > 5 * 1024 * 1024) {
            showToast('图片大小不能超过5MB', 'error');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('category', category);

            const token = localStorage.getItem('token');
            const response = await fetch('/api/files/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success && data.data) {
                onChange(data.data);
                showToast('图片上传成功', 'success');
            } else {
                showToast(data.message || '图片上传失败', 'error');
            }
        } catch (error) {
            console.error('上传失败:', error);
            showToast('网络错误，上传失败', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {value ? (
                <div className="relative group">
                    <img
                        src={value}
                        alt="预览图"
                        className="w-full h-32 object-cover border-2 border-gray-300 rounded cursor-pointer"
                        onClick={handleClick}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded">
                        <button
                            type="button"
                            onClick={handleClick}
                            disabled={uploading}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2 hover:bg-blue-700"
                        >
                            {uploading ? '上传中...' : '更换'}
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                            删除
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                    <div className="text-center text-gray-500">
                        {uploading ? (
                            <div>
                                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <span>上传中...</span>
                            </div>
                        ) : (
                            <div>
                                <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>{placeholder}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
