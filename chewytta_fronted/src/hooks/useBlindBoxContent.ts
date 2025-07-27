// src/hooks/useBlindBoxContent.ts
import { useContext } from 'react';
import { BlindBoxContext } from '../context/BlindBoxContext'; // ✅ 这里要确保路径正确

const useBlindBoxContext = () => {
    const context = useContext(BlindBoxContext);
    if (!context) {
        throw new Error('useBlindBoxContext must be used within a BlindBoxProvider');
    }
    return context;
};

export default useBlindBoxContext;
