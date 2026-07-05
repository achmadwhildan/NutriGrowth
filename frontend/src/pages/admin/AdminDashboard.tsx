import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface StatItem {
    label: string;
    value: string;
    growth: string;
    icon: string;
}

const defaultStats: StatItem[] = [
    { label: 'Total Pengguna', value: '—', growth: '—', icon: '👨‍👩‍👧' },
    { label: 'Dokter Aktif', value: '—', growth: '—', icon: '👨‍⚕️' },
    { label: 'Seller Aktif', value: '—', growth: '—', icon: '🏪' },
    { label: 'Pendapatan Platform', value: '—', growth: '—', icon: '💰' },
];

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<StatItem[]>(defaultStats);
    const [pendingDoctors, setPendingDoctors] = useState<number>(0);
    const [pendingSellers, setPendingSellers] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);
            try {
                const [statsRes, doctorPendingRes, sellerPendingRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/pending/DOCTOR'),
                    api.get('/admin/pending/SELLER'),
                ]);

                const data = statsRes.data.data;
                const formatCurrency = (value: number) =>
                    new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                    }).format(value);

                setStats([
                    { label: 'Total Pengguna', value: data.totalUsers.toLocaleString(), growth: '—', icon: '👨‍👩‍👧' },
                    { label: 'Dokter Aktif', value: data.totalDoctors.toLocaleString(), growth: '—', icon: '👨‍⚕️' },
                    { label: 'Seller Aktif', value: data.totalSellers.toLocaleString(), growth: '—', icon: '🏪' },
                    { label: 'Pendapatan Platform', value: formatCurrency(data.platformRevenue), growth: '—', icon: '💰' },
                ]);

                setPendingDoctors(doctorPendingRes.data.data.length);
                setPendingSellers(sellerPendingRes.data.data.length);
            } catch (err) {
                console.error('Gagal memuat dashboard admin:', err);
                setError('Gagal memuat data dashboard. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Super Admin</h1>
                    <p className="text-gray-500 mt-1">Ringkasan performa platform NutriGrow.</p>
                </div>
            </header>

            {error && (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="text-3xl">{stat.icon}</div>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.growth}</span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tugas Menunggu</h2>
                    {loading ? (
                        <p className="text-sm text-gray-500">Memuat data tugas...</p>
                    ) : (
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">👨‍⚕️</span>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Verifikasi Dokter Baru</p>
                                        <p className="text-xs text-gray-500">{pendingDoctors} permohonan menunggu</p>
                                    </div>
                                </div>
                                <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">Lihat</button>
                            </li>
                            <li className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🏪</span>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Verifikasi Katering/Seller Baru</p>
                                        <p className="text-xs text-gray-500">{pendingSellers} permohonan menunggu</p>
                                    </div>
                                </div>
                                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Lihat</button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
