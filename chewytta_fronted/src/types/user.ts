export interface User {
    id: number;
    username: string;
    email: string;
    phone?: string;
    nickname?: string;
    avatar?: string;
    balance?: number;
    role: 'user' | 'admin' | 'USER' | 'ADMIN';
    createdAt?: string;
}

export interface UserContextType {
    users: User[];
    loading: boolean;
    error: string | null;
    deleteUser: (userId: number) => Promise<void>;
}