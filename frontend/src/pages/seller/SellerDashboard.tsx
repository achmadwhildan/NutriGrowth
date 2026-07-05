import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard: React.FC = () => {
    const navigate = useNavigate();

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
                    <div className="w-12 h-12 bg-nutri-tertiary text-nutri-primaryDark rounded-full flex items-center justify-center text-xl">💰</div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pendapatan Bulan Ini</p>
                        <p className="text-xl font-extrabold text-gray-800">Rp 4.5M</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-nutri-secondary rounded-full flex items-center justify-center text-xl">📦</div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pesanan Baru</p>
                        <p className="text-2xl font-extrabold text-gray-800">12</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl">🚚</div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Perlu Dikirim</p>
                        <p className="text-2xl font-extrabold text-gray-800">5</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl">🍲</div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Produk Aktif</p>
                        <p className="text-2xl font-extrabold text-gray-800">8</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Main: Pesanan Terkini */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-end">
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Pesanan Terkini</h2>
                        <button onClick={() => navigate('/seller/orders')} className="text-xs font-bold text-nutri-primary hover:text-nutri-primaryDark transition">Lihat Semua</button>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="p-4">ID Pesanan</th>
                                        <th className="p-4">Produk</th>
                                        <th className="p-4">Total</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                                    {[
                                        { id: '#ORD-001', product: 'Bubur Tim Hati Ayam (2x)', total: 'Rp 50.000', status: 'Baru' },
                                        { id: '#ORD-002', product: 'Puree Pisang Alpukat (1x)', total: 'Rp 20.000', status: 'Diproses' },
                                        { id: '#ORD-003', product: 'Nasi Tim Salmon Brokoli (3x)', total: 'Rp 105.000', status: 'Dikirim' },
                                    ].map((o, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition">
                                            <td className="p-4 font-bold text-gray-800">{o.id}</td>
                                            <td className="p-4 truncate max-w-[150px]">{o.product}</td>
                                            <td className="p-4 font-bold text-nutri-primaryDark">{o.total}</td>
                                            <td className="p-4">
                                                {o.status === 'Baru' && <span className="px-2 py-1 bg-orange-50 text-nutri-secondary text-[10px] font-bold rounded">Baru</span>}
                                                {o.status === 'Diproses' && <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">Diproses</span>}
                                                {o.status === 'Dikirim' && <span className="px-2 py-1 bg-nutri-tertiary text-nutri-primaryDark text-[10px] font-bold rounded">Dikirim</span>}
                                            </td>
                                            <td className="p-4">
                                                <button className="text-[11px] font-bold text-nutri-primary hover:text-nutri-primaryDark transition">Detail</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

                {/* Sidebar: Produk Terlaris */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Produk Terlaris</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Nasi Tim Salmon Brokoli', sold: 145, img: 'https://images.unsplash.com/photo-1548943487-a2e4d43b4852?auto=format&fit=crop&q=80&w=150' },
                            { name: 'Bubur Tim Hati Ayam', sold: 120, img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=150' },
                            { name: 'Puree Pisang Alpukat', sold: 98, img: 'https://images.unsplash.com/photo-1511690656956-5f283401dfb8?auto=format&fit=crop&q=80&w=150' },
                        ].map((p, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-xs font-bold text-gray-800 truncate">{p.name}</h4>
                                    <p className="text-[10px] text-gray-500 mt-1">{p.sold} terjual bulan ini</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default SellerDashboard;
