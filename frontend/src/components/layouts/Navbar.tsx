import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = useLocation();
    
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
                    <button className="p-2 text-gray-400 hover:text-nutri-primary transition relative">
                        🔔 <span className="absolute top-2 right-2 w-2 h-2 bg-nutri-secondary rounded-full"></span>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Profile" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
