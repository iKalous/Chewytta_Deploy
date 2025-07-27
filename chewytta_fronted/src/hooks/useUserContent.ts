import { useContext } from 'react';
import { UserContext } from '../context/UserContext.tsx';
import type { UserContextType } from '../types/user';

const useUserContent = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContent must be used within a UserProvider');
    }
    return context;
};

export default useUserContent;