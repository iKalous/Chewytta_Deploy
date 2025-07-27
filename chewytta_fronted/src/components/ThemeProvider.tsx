import React from 'react';
import type { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-violet-100 text-gray-800 font-sans">
      {children}
    </div>
  );
};

export default ThemeProvider;