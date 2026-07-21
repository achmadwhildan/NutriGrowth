import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bell, Check, Info, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning';
    isRead: boolean;
    link?: string;
    createdAt: string;
}

const NotificationBell: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const loadNotifications = async () => {
        try {
            if (!auth?.user) return;
            const res = await api.get('/notifications/my');
            setNotifications(res.data.data || []);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    useEffect(() => {
        loadNotifications();
        // Optional polling every 30s
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, [auth?.user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put(`/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.isRead) {
            try {
                await api.put(`/notifications/${notif.id}/read`);
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
            } catch(e) {}
        }
        setIsOpen(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    // Fungsi testing khusus (nanti bisa dihapus jika diproduksi)
    const handleTestNotification = async () => {
        await api.post('/notifications/test');
        loadNotifications();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-nutri-primary transition relative focus:outline-none"
                title="Notifikasi"
            >
                <Bell className="w-5 h-5" /> 
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-nutri-secondary border-2 border-white rounded-full"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 animate-fade-in origin-top-right overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800">Notifikasi</h3>
                        <div className="flex items-center gap-3">
                            <button onClick={handleTestNotification} className="text-[10px] text-gray-400 hover:text-nutri-primary">Buat Test</button>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-xs font-semibold text-nutri-primary hover:text-nutri-primaryDark transition">
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto max-h-[350px]">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <Bell className="w-6 h-6 text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-500">Belum ada notifikasi.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map(notif => (
                                    <div 
                                        key={notif.id} 
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-4 flex gap-3 hover:bg-gray-50 transition cursor-pointer ${notif.isRead ? 'opacity-70' : 'bg-nutri-primary/5'}`}
                                    >
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getTypeIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${notif.isRead ? 'text-gray-700 font-medium' : 'text-gray-900 font-bold'}`}>
                                                {notif.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(notif.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        {!notif.isRead && (
                                            <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
                                                <div className="w-2 h-2 bg-nutri-secondary rounded-full"></div>
                                                <button 
                                                    onClick={(e) => markAsRead(notif.id, e)}
                                                    className="p-1 text-gray-400 hover:text-nutri-primary hover:bg-nutri-primary/10 rounded transition"
                                                    title="Tandai dibaca"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
