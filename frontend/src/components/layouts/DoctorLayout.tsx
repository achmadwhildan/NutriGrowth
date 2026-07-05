import React, { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const DoctorNavbar: React.FC = () => {
    const location = useLocation();
    
    const getLinkClass = (path: string) => {
        return location.pathname === path 
            ? "border-b-2 border-nutri-primary text-nutri-primaryDark pb-1"
            : "hover:text-nutri-primary transition pb-1";
    };

    return (
        <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-xl font-bold text-nutri-primaryDark flex items-center gap-2">
                    <span className="w-8 h-8 bg-nutri-primary text-white rounded-lg flex justify-center items-center font-bold text-xs">NG</span> 
                    Doctor Portal
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
                    <Link to="/doctor" className={getLinkClass('/doctor')}>Beranda</Link>
                    <Link to="/doctor/schedule" className={getLinkClass('/doctor/schedule')}>Jadwal Praktik</Link>
                    <Link to="/doctor/consult/1" className={getLinkClass('/doctor/consult/1')}>Ruang Konsultasi</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-nutri-primary transition relative">
                        🔔 <span className="absolute top-2 right-2 w-2 h-2 bg-nutri-secondary rounded-full"></span>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200 flex items-center justify-center">
                        👨‍⚕️
                    </div>
                </div>
            </div>
        </header>
    );
};

interface DoctorLayoutProps {
    children?: ReactNode;
}

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <DoctorNavbar />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default DoctorLayout;
