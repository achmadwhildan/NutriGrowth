import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        if (auth) {
            auth.logout();
            navigate('/login');
        }
    };
    
    const getLinkClass = (path: string) => {
        return location.pathname === path 
            ? "border-b-2 border-nutri-primary text-nutri-primaryDark pb-1"
            : "hover:text-nutri-primary transition pb-1";
    };

    return (
        <header className="w-full bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-nutri-primaryDark flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="h-8 w-auto" /> NutriGrow
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
                    <Link to="/parent-dashboard" className={getLinkClass('/parent-dashboard')}>Dashboard</Link>
                    <Link to="/tracker" className={getLinkClass('/tracker')}>Tracker</Link>
                    <Link to="/child-development" className={getLinkClass('/child-development')}>Tumbuh Kembang</Link>
                    <Link to="/consult" className={getLinkClass('/consult')}>Konsultasi</Link>
                    <Link to="/orders" className={getLinkClass('/orders')}>Pesanan</Link>
                    <Link to="/chat" className={getLinkClass('/chat')}>Chat</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200 hover:ring-2 hover:ring-nutri-primary/50 transition focus:outline-none"
                        >
                            <img src={(auth?.user as any)?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"} alt="Profile" className="w-full h-full object-cover" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in origin-top-right">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-xs font-semibold text-gray-800 truncate">{auth?.user?.name || 'User'}</p>
                                    <p className="text-[10px] text-gray-500 truncate">{auth?.user?.email}</p>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition"
                                >
                                    Keluar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
