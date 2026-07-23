import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface PendingSeller {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    documentUrl?: string;
    createdAt: string;
}

const SellerVerification: React.FC = () => {
    const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadPendingSellers = async () => {
            setLoading(true);
            try {
                const response = await api.get('/admin/pending/SELLER');
                setPendingSellers(response.data.data);
            } catch (err) {
                console.error('Gagal memuat verifikasi seller:', err);
                setError('Tidak dapat memuat data seller. Silakan muat ulang halaman.');
            } finally {
                setLoading(false);
            }
        };

        loadPendingSellers();
    }, []);

    const handleVerify = async (id: string, action: 'approved' | 'rejected') => {
        try {
            await api.put(`/admin/verify/${id}`, {
                action: action === 'approved' ? 'approve' : 'reject',
            });
            setPendingSellers((sellers) => sellers.filter((s) => s.id !== id));
            toast.success(`Seller berhasil ${action === 'approved' ? 'diterima' : 'ditolak'}.`);
        } catch (err) {
            console.error('Gagal mengubah status verifikasi seller:', err);
            toast.error('Gagal memperbarui status verifikasi seller. Silakan coba lagi.');
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    return (
        <div className="space-y-6 animate-fade-in">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Verifikasi Seller</h1>
                <p className="text-gray-500 mt-1">Tinjau dan setujui pendaftaran toko atau katering baru.</p>
            </header>

            {error && (
                <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                            <th className="p-4">Nama Seller</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Telepon</th>
                            <th className="p-4">Tanggal Daftar</th>
                            <th className="p-4">Dokumen</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    Memuat data seller...
                                </td>
                            </tr>
                        ) : pendingSellers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    Tidak ada seller yang menunggu verifikasi.
                                </td>
                            </tr>
                        ) : (
                            pendingSellers.map((seller) => (
                                <tr key={seller.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">{seller.name}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{seller.email}</td>
                                    <td className="p-4 text-sm text-gray-600">{seller.phoneNumber || '-'}</td>
                                    <td className="p-4 text-sm text-gray-600">{formatDate(seller.createdAt)}</td>
                                    <td className="p-4">
                                        {seller.documentUrl ? (
                                            <a href={seller.documentUrl} target="_blank" rel="noopener noreferrer" className="text-nutri-primary hover:underline text-sm font-medium">Lihat Izin Usaha</a>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">Tidak ada</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleVerify(seller.id, 'approved')}
                                            className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 transition"
                                        >
                                            Terima
                                        </button>
                                        <button
                                            onClick={() => handleVerify(seller.id, 'rejected')}
                                            className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition"
                                        >
                                            Tolak
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerVerification;
