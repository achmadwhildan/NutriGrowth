import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface PendingDoctor {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    documentUrl?: string;
    createdAt: string;
}

const DoctorVerification: React.FC = () => {
    const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadPendingDoctors = async () => {
            setLoading(true);
            try {
                const response = await api.get('/admin/pending/DOCTOR');
                setPendingDoctors(response.data.data);
            } catch (err) {
                console.error('Gagal memuat verifikasi dokter:', err);
                setError('Tidak dapat memuat data dokter. Silakan muat ulang halaman.');
            } finally {
                setLoading(false);
            }
        };

        loadPendingDoctors();
    }, []);

    const handleVerify = async (id: string, action: 'approved' | 'rejected') => {
        try {
            await api.put(`/admin/verify/${id}`, {
                action: action === 'approved' ? 'approve' : 'reject',
            });
            setPendingDoctors((docs) => docs.filter((d) => d.id !== id));
            toast.success(`Dokter berhasil ${action === 'approved' ? 'diterima' : 'ditolak'}.`);
        } catch (err) {
            console.error('Gagal mengubah status verifier dokter:', err);
            toast.error('Gagal memperbarui status verifikasi dokter. Silakan coba lagi.');
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
                <h1 className="text-2xl font-bold text-gray-900">Verifikasi Dokter</h1>
                <p className="text-gray-500 mt-1">Tinjau dan setujui pendaftaran dokter baru.</p>
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
                            <th className="p-4">Nama Dokter</th>
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
                                    Memuat data dokter...
                                </td>
                            </tr>
                        ) : pendingDoctors.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    Tidak ada dokter yang menunggu verifikasi.
                                </td>
                            </tr>
                        ) : (
                            pendingDoctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="font-semibold text-gray-900">{doctor.name}</div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{doctor.email}</td>
                                    <td className="p-4 text-sm text-gray-600">{doctor.phoneNumber || '-'}</td>
                                    <td className="p-4 text-sm text-gray-600">{formatDate(doctor.createdAt)}</td>
                                    <td className="p-4">
                                        {doctor.documentUrl ? (
                                            <a href={doctor.documentUrl} target="_blank" rel="noopener noreferrer" className="text-nutri-primary hover:underline text-sm font-medium">Lihat STR/SIP</a>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">Tidak ada</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleVerify(doctor.id, 'approved')}
                                            className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg hover:bg-green-200 transition"
                                        >
                                            Terima
                                        </button>
                                        <button
                                            onClick={() => handleVerify(doctor.id, 'rejected')}
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

export default DoctorVerification;
