import React, { useState, useEffect } from 'react';
import { Hourglass, RefreshCw, Truck, CheckCircle2, XCircle, Check, Package, UtensilsCrossed } from 'lucide-react';
import api from '../../services/api';

interface OrderItem {
    id: string;
    productName: string;
    sellerName: string;
    quantity: number;
    totalPrice: number;
    status: 'PENDING' | 'PROCESSING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    imageUrl?: string;
}

const statusConfig: Record<OrderItem['status'], { label: string; color: string; icon: React.ReactNode }> = {
    PENDING: { label: 'Menunggu Konfirmasi', color: 'bg-yellow-100 text-yellow-700', icon: <Hourglass className="w-4 h-4" /> },
    PROCESSING: { label: 'Sedang Diproses', color: 'bg-blue-100 text-blue-700', icon: <RefreshCw className="w-4 h-4" /> },
    DELIVERING: { label: 'Dalam Pengiriman', color: 'bg-purple-100 text-purple-700', icon: <Truck className="w-4 h-4" /> },
    COMPLETED: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-4 h-4" /> },
    CANCELLED: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> },
};

// Removed DUMMY_ORDERS

const OrderHistory: React.FC = () => {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('ALL');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                // Panggilan API ke backend untuk mengambil riwayat pesanan user
                const response = await api.get('/shop/orders/my');
                const raw = response.data.data || [];

                // Pemetaan respons backend ke bentuk yang digunakan komponen
                const mapped = raw.map((o: any) => {
                    const items = o.items || [];
                    const total = o.totalAmount ?? o.totalPrice ?? items.reduce((s: number, it: any) => s + ((it.priceAtPurchase ?? it.price) * (it.quantity ?? 1)), 0);
                    const quantity = items.reduce((s: number, it: any) => s + (it.quantity ?? 0), 0) || 1;
                    const productName = items[0]?.product?.name || items[0]?.name || 'Produk';
                    const imageUrl = items[0]?.product?.imageUrl || items[0]?.imageUrl || undefined;

                    return {
                        id: o.id,
                        productName,
                        sellerName: o.user?.name || '',
                        quantity,
                        totalPrice: Number(total),
                        status: o.status,
                        createdAt: o.createdAt,
                        imageUrl,
                    };
                });

                setOrders(mapped);
            } catch (error) {
                console.error('Gagal memuat riwayat pesanan:', error);
                // no fallback, just log error
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filters = ['ALL', 'PENDING', 'PROCESSING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];
    const filteredOrders = activeFilter === 'ALL' 
        ? orders 
        : orders.filter(o => o.status === activeFilter);

    const formatPrice = (price: number) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const TrackingSteps = ({ status }: { status: OrderItem['status'] }) => {
        const steps: OrderItem['status'][] = ['PENDING', 'PROCESSING', 'DELIVERING', 'COMPLETED'];
        const currentIndex = steps.indexOf(status);
        if (status === 'CANCELLED') return null;
        return (
            <div className="flex items-center gap-1 mt-3">
                {steps.map((step, i) => (
                    <React.Fragment key={step}>
                        <div className={`flex items-center gap-1`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 transition-all ${i <= currentIndex ? 'bg-nutri-primary border-nutri-primary text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {i < currentIndex ? <Check className="w-3 h-3" /> : i + 1}
                            </div>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 ${i < currentIndex ? 'bg-nutri-primary' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
                <p className="text-gray-500 mt-1">Pantau status semua pesanan makanan bayi Anda.</p>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            activeFilter === f 
                                ? 'bg-nutri-primary text-white shadow-sm' 
                                : 'bg-white text-gray-500 border border-gray-200 hover:border-nutri-primary hover:text-nutri-primary'
                        }`}
                    >
                        {f === 'ALL' ? 'Semua' : statusConfig[f as OrderItem['status']].label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-xl bg-gray-200 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                        <div className="flex justify-center mb-4 text-gray-300">
                            <Package className="w-16 h-16" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-bold text-gray-900">Belum Ada Pesanan</h3>
                        <p className="text-gray-500 text-sm mt-2">Pesanan yang Anda buat akan muncul di sini.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => {
                        const cfg = statusConfig[order.status];
                        return (
                            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex gap-4 items-start">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        {order.imageUrl 
                                            ? <img src={order.imageUrl} alt={order.productName} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-gray-300"><UtensilsCrossed className="w-8 h-8" /></div>
                                        }
                                    </div>

                                    {/* Order Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <p className="text-[11px] font-semibold text-gray-400 mb-0.5">#{order.id} · {formatDate(order.createdAt)}</p>
                                                <h3 className="font-bold text-gray-900 text-sm leading-snug">{order.productName}</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{order.sellerName} · {order.quantity} item</p>
                                            </div>
                                            <div className={`flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                                                <span>{cfg.icon}</span>
                                                <span className="hidden sm:block">{cfg.label}</span>
                                            </div>
                                        </div>

                                        {/* Progress Tracker */}
                                        {order.status !== 'CANCELLED' && (
                                            <TrackingSteps status={order.status} />
                                        )}

                                        {/* Footer */}
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-sm font-bold text-nutri-primaryDark">{formatPrice(order.totalPrice)}</span>
                                            <div className="flex gap-2">
                                                {order.status === 'COMPLETED' && (
                                                    <button className="px-3 py-1.5 text-xs font-semibold bg-nutri-tertiary text-nutri-primaryDark rounded-lg hover:bg-nutri-primary hover:text-white transition">
                                                        Beli Lagi
                                                    </button>
                                                )}
                                                <button className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
                                                    Detail
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
