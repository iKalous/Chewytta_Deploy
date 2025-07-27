import { useState, useEffect, useCallback, useRef } from 'react';
import { UserContext } from './UserContext.tsx';
import type { User, UserContextType } from '../types/user';
import { request } from '../utils/api';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const requestId = useRef<number>(0);

    // 删除用户
    const deleteUser = useCallback(async (userId: number) => {
        console.log(`Deleting user with id: ${userId}`);
        try {
            setLoading(true);
            setError(null);

            await request(`/users/${userId}`, 'DELETE');

            // 更新本地数据
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } catch (err) {
            setError('删除用户失败');
            console.error('Failed to delete user:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setUsers]);

    // 组件挂载时获取数据
    useEffect(() => {
        console.log('UserProvider mounted, checking user role before fetching users...');
        let isMounted = true;

        const fetchData = async () => {
            if (!isMounted) return;

            // 检查用户角色
            const userRole = localStorage.getItem('role');
            console.log('User role:', userRole);

            // 只有管理员才获取所有用户
            if (userRole?.toUpperCase() !== 'ADMIN') {
                console.log('Not an admin user, skipping fetch users');
                setUsers([]);
                setLoading(false);
                return;
            }

            const currentRequestId = ++requestId.current;
            console.log(`Starting initial fetchUsers request #${currentRequestId}`);

            try {
                setLoading(true);
                setError(null);

                console.log('About to send request to /users');
                const data = await request('/users', 'GET');
                console.log('Received response from /users:', data);

                if (!isMounted || currentRequestId !== requestId.current) {
                    setLoading(false);
                    return;
                }

                if (data && data.success === true) {
                    if (Array.isArray(data.data)) {
                        setUsers(data.data);
                        console.log('Successfully set users data from success response');
                    } else {
                        setUsers([]);
                        console.warn('API returned success but data is not an array:', data);
                        setError('数据格式不正确: 成功响应但数据不是数组');
                    }
                } else if (Array.isArray(data)) {
                    setUsers(data);
                    console.log('Successfully set users data');
                } else if (data && data.users && Array.isArray(data.users)) {
                    setUsers(data.users);
                    console.log('Successfully set users data from nested structure');
                } else {
                    setUsers([]);
                    console.warn('API returned unexpected data format:', data);
                    setError('数据格式不正确: ' + JSON.stringify(data));
                }
            } catch (err) {
                if (!isMounted || currentRequestId !== requestId.current) {
                    setLoading(false);
                    return;
                }

                setError('获取用户数据失败');
                console.error('Failed to fetch users:', err);
            } finally {
                if (isMounted && currentRequestId === requestId.current) {
                    setLoading(false);
                    console.log(`Initial fetch users request #${currentRequestId} completed, loading set to false`);
                }
            }
        };

        const timer = setTimeout(fetchData, 100);

        return () => {
            console.log('UserProvider unmounted, clearing timeout...');
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    return (
        <UserContext.Provider value={{ users, loading, error, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};