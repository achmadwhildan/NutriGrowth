import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
    children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-nutri-neutralBg flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 space-y-8">
                {children || <Outlet />}
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
