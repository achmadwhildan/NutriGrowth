import React, { useState, useEffect } from 'react';

import { CircleDollarSign, Package, Truck, Utensils } from 'lucide-react';
import api from '../../services/api';

const SellerDashboard: React.FC = () => {
    
    
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        totalProducts: 0
    });
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statRes, orderRes, prodRes] = await Promise.all([
                api.get('/dashboard'),
                api.get('/shop/orders'),
                api.get('/shop/products')
            ]);
            
            if (statRes.data.stats) setStats(statRes.data.stats);
            if (orderRes.data.data) setOrders(orderRes.data.data.slice(0, 5)); // max 5 for dashboard
            if (prodRes.data.data) setProducts(prodRes.data.data.slice(0, 5)); // assume top 5
        } catch (error) {
            console.error("Gagal memuat data seller:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            await api.put(`/shop/orders/${id}/status`, { status: newStatus });
            fetchData();
        } catch (error) {
            alert('Gagal memperbarui status');
        }
    };

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    return (
        <div className="space-y-8 font-sans">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800">Toko Sehat MPASI</h1>
                <p className="text-sm text-gray-500 mt-1">Ringkasan toko dan penjualan Anda hari ini.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-nutri-tertiary text-nutri-primaryDark rounded-full flex items-center justify-center">
                        <CircleDollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pendapatan Total</p>
                        <p className="text-xl font-extrabold text-gray-800">{formatRupiah(stats.totalRevenue)}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-nutri-secondary rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pesanan Baru</p>
                        <p className="text-2xl font-extrabold text-gray-800">{stats.pendingOrders}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Truck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Diproses</p>
                        <p className="text-2xl font-extrabold text-gray-800">{stats.processingOrders}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                        <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Produk Aktif</p>
                        <p className="text-2xl font-extrabold text-gray-800">{stats.totalProducts}</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Main: Pesanan Terkini */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Pesanan Terkini</h2>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="p-4">Pembeli</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                                    {loading ? (
                                        <tr><td colSpan={4} className="p-4 text-center text-gray-500">Memuat...</td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr><td colSpan={4} className="p-4 text-center text-gray-500">Belum ada pesanan.</td></tr>
                                    ) : (
                                        orders.map((o) => (
                                            <tr key={o.id} className="hover:bg-gray-50/50 transition">
                                                <td className="p-4 font-bold text-gray-800">{o.user?.name || 'User'}</td>
                                                <td className="p-4 font-bold text-nutri-primaryDark">{formatRupiah(Number(o.totalAmount))}</td>
                                                <td className="p-4">
                                                    {o.status === 'PENDING' && <span className="px-2 py-1 bg-orange-50 text-nutri-secondary text-[10px] font-bold rounded">Baru</span>}
                                                    {o.status === 'PROCESSING' && <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">Diproses</span>}
                                                    {o.status === 'DELIVERING' && <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded">Dikirim</span>}
                                                    {o.status === 'COMPLETED' && <span className="px-2 py-1 bg-nutri-tertiary text-nutri-primaryDark text-[10px] font-bold rounded">Selesai</span>}
                                                    {o.status === 'CANCELLED' && <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">Batal</span>}
                                                </td>
                                                <td className="p-4 flex gap-2">
                                                    {o.status === 'PENDING' && (
                                                        <button onClick={() => updateStatus(o.id, 'PROCESSING')} className="text-[11px] font-bold text-white bg-nutri-primary px-3 py-1 rounded hover:bg-nutri-primaryDark transition">Proses</button>
                                                    )}
                                                    {o.status === 'PROCESSING' && (
                                                        <button onClick={() => updateStatus(o.id, 'DELIVERING')} className="text-[11px] font-bold text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition">Kirim</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                {/* Sidebar: Produk Tersedia */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Produk Toko</h2>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-sm text-gray-500">Memuat...</p>
                        ) : products.length === 0 ? (
                            <p className="text-sm text-gray-500">Belum ada produk.</p>
                        ) : (
                            products.map((p) => (
                                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                        <img src={p.imageUrl || 'https://via.placeholder.com/150'} alt={p.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-gray-800 truncate">{p.name}</h4>
                                        <p className="text-[10px] text-gray-500 mt-1">Stok: {p.stock}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default SellerDashboard;
