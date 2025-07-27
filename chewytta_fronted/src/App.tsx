// src/App.tsx
import React from 'react';
import { type RouterProviderProps, RouterProvider } from 'react-router-dom';

interface AppProps {
    router: RouterProviderProps['router'];
}

const App: React.FC<AppProps> = ({ router }) => {
    return (
        <React.Suspense fallback="Loading...">
            <RouterProvider router={router} />
        </React.Suspense>
    );
};

export default App;
