import { useState, useEffect } from 'react';
import { getCurrentUser, submitComment } from '../api/blindBoxApi';
import { showToast } from '../utils/globalToast';
import type { Comment } from '../types/blindBox';

export const useComments = (initialComments: Comment[], boxId: number) => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 监听initialComments的变化并同步到comments
    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    const addComment = async (commentData?: Comment) => {
        if (!commentData && !newComment.trim()) return;

        setIsSubmitting(true);
        try {
            if (commentData) {
                // 如果提供了评论数据，直接使用
                setComments([commentData, ...comments]);
            } else {
                // 否则提交新评论
                const userResponse = await getCurrentUser();
                const username = userResponse.success ? userResponse.data.username : '游客';

                const commentResponse = await submitComment(boxId, newComment);
                if (commentResponse.success && commentResponse.data) {
                    setComments([commentResponse.data, ...comments]);
                    setNewComment('');
                    showToast('评论成功');
                } else {
                    showToast(commentResponse.message || '评论失败，请稍后再试', 'error');
                }
            }
        } catch (error) {
            console.error('提交评论失败:', error);
            showToast('网络错误，请稍后再试', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        comments,
        newComment,
        setNewComment,
        addComment,
        isSubmitting,
        setComments,
    };
};
