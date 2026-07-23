import React, { ReactNode, useState, useContext, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Store, Menu, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';

const SellerNavbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    const getMobileLinkClass = (path: string) => {
        return location.pathname === path
            ? "block px-4 py-2 bg-nutri-primary/10 text-nutri-primaryDark rounded-xl font-bold"
            : "block px-4 py-2 text-gray-500 hover:bg-gray-50 hover:text-nutri-primary rounded-xl transition";
    }

    return (
        <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                <div className="text-xl font-bold text-nutri-primaryDark flex items-center gap-2">
                    <button 
                        className="md:hidden p-1 mr-2 text-gray-500 hover:bg-gray-100 rounded"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <span className="w-8 h-8 bg-nutri-secondary text-white rounded-lg flex justify-center items-center font-bold text-xs">SP</span> 
                    <span className="hidden sm:inline">Seller Portal</span>
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-semibold text-gray-500">
                    <Link to="/seller" className={getLinkClass('/seller')}>Dashboard</Link>
                    <Link to="/seller/products" className={getLinkClass('/seller/products')}>Produk</Link>
                    <Link to="/seller/orders" className={getLinkClass('/seller/orders')}>Pesanan Masuk</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <NotificationBell />
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200 flex items-center justify-center hover:ring-2 hover:ring-nutri-primary/50 transition focus:outline-none"
                        >
                            <Store className="w-5 h-5 text-gray-600" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in origin-top-right">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-xs font-semibold text-gray-800 truncate">{auth?.user?.name || 'Seller'}</p>
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

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white absolute w-full left-0 shadow-lg">
                    <nav className="px-4 py-4 space-y-2 text-sm font-semibold">
                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/seller" className={getMobileLinkClass('/seller')}>Dashboard</Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/seller/products" className={getMobileLinkClass('/seller/products')}>Produk</Link>
                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/seller/orders" className={getMobileLinkClass('/seller/orders')}>Pesanan Masuk</Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

interface SellerLayoutProps {
    children?: ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
            <SellerNavbar />
            
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 md:py-8">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default SellerLayout;
