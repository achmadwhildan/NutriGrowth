import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const SellerOrders: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Semua');
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await api.get('/shop/orders');

                const data = res?.data?.data || [];

                // map ke bentuk UI
                const mapped = data.map((o: any) => ({
                    id: o.id,
                    date: new Date(o.createdAt).toLocaleDateString('id-ID'),
                    customer: o.user?.name || 'Pelanggan',
                    address: o.shippingAddress || '',
                    items: (o.items || []).map((it: any) => `${it.product?.name || it.productName || 'Produk'} (${it.quantity})`).join(', '),
                    total: `Rp ${Number(o.totalAmount || o.totalPrice || 0).toLocaleString('id-ID')}`,
                    status: o.status || 'PENDING'
                }));

                setOrders(mapped);
            } catch (error) {
                console.error('Gagal memuat pesanan:', error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredOrders = activeTab === 'Semua' ? orders : orders.filter(o => o.status === activeTab || (o.status === 'PENDING' && activeTab === 'Baru'));

    return (
        <div className="space-y-8 font-sans">
            
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800">Pesanan Masuk</h1>
                <p className="text-sm text-gray-500 mt-1">Kelola dan pantau status pesanan pelanggan Anda.</p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-100 p-2 gap-2">
                    {['Semua', 'Baru', 'Diproses', 'Dikirim', 'Selesai'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2.5 text-xs font-bold rounded-xl transition whitespace-nowrap ${activeTab === tab ? 'bg-nutri-primary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {tab} {tab === 'Baru' && <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white rounded-full text-[9px]">1</span>}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="p-6">
                    <div className="space-y-4">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="border border-gray-100 rounded-2xl p-5 animate-pulse" />
                            ))
                        ) : filteredOrders.map((o) => (
                            <div key={o.id} className="border border-gray-100 rounded-2xl p-5 hover:border-nutri-primary/30 transition shadow-sm flex flex-col md:flex-row gap-6">
                                
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-extrabold text-gray-800">{o.id}</span>
                                        <span className="text-[10px] text-gray-400 font-bold">{o.date}</span>
                                        {o.status === 'Baru' && <span className="px-2 py-1 bg-orange-50 text-nutri-secondary text-[10px] font-bold rounded">Baru</span>}
                                        {o.status === 'Diproses' && <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">Diproses</span>}
                                        {o.status === 'Dikirim' && <span className="px-2 py-1 bg-nutri-tertiary text-nutri-primaryDark text-[10px] font-bold rounded">Dikirim</span>}
                                        {o.status === 'Selesai' && <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">Selesai</span>}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <p className="text-gray-400 font-medium mb-0.5">Pelanggan</p>
                                            <p className="font-bold text-gray-800">{o.customer}</p>
                                            <p className="text-gray-600 mt-0.5">{o.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-medium mb-0.5">Pesanan</p>
                                            <p className="font-bold text-gray-800">{o.items}</p>
                                            <p className="text-nutri-primaryDark font-extrabold mt-1">{o.total}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-48 flex flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ubah Status</label>
                                    <select 
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 focus:border-nutri-primary rounded-xl text-xs font-bold text-gray-700 transition focus:outline-none"
                                        defaultValue={o.status}
                                        onChange={async (e) => {
                                            const newStatus = e.target.value;
                                            try {
                                                await api.put(`/shop/orders/${o.id}/status`, { status: newStatus });
                                                setOrders(prev => prev.map(p => p.id === o.id ? { ...p, status: newStatus } : p));
                                            } catch (err) {
                                                console.error('Gagal update status:', err);
                                                alert('Gagal mengubah status pesanan');
                                            }
                                        }}
                                    >
                                        <option value="PENDING">Baru</option>
                                        <option value="PROCESSING">Diproses</option>
                                        <option value="DELIVERING">Dikirim</option>
                                        <option value="COMPLETED">Selesai</option>
                                    </select>
                                    {o.status === 'Baru' && (
                                        <button className="w-full mt-1 py-2 bg-nutri-primary hover:bg-nutri-primaryDark text-white text-[11px] font-bold rounded-xl transition shadow-sm">
                                            Terima Pesanan
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}

                        {filteredOrders.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400 font-medium text-sm">Tidak ada pesanan di kategori ini.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SellerOrders;
