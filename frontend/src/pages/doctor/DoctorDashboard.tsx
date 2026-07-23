import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Star, Hand } from 'lucide-react';
import api from '../../services/api';

const DoctorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const loadConsultations = async () => {
        try {
            setLoading(true);
            const res = await api.get('/consultations/my');
            setConsultations(res.data.data || []);
        } catch (err) {
            console.error('Gagal mengambil konsultasi:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConsultations();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/consultations/${id}/status`, { status });
            toast.success(`Berhasil update status menjadi ${status}`);
            loadConsultations();
        } catch (err) {
            console.error('Gagal update status:', err);
            toast.error('Gagal update status');
        }
    };

    const pendingRequests = consultations.filter(c => c.status === 'PENDING');
    const upcomingSchedules = consultations.filter(c => c.status === 'ONGOING' || c.status === 'COMPLETED');

    return (
        <div className="space-y-8 font-sans">
            
            {/* Header / Welcome */}
            <div>
                <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">Selamat datang, Dr. Maya! <Hand className="w-6 h-6 text-yellow-500" /></h1>
                <p className="text-sm text-gray-500 mt-1">Berikut adalah ringkasan jadwal dan permintaan konsultasi Anda hari ini.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-nutri-tertiary text-nutri-primaryDark rounded-full flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Konsultasi Hari Ini</p>
                        <p className="text-2xl font-extrabold text-gray-800">{upcomingSchedules.length} <span className="text-sm font-medium text-gray-400">pasien</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-nutri-secondary rounded-full flex items-center justify-center"><Bell className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Permintaan Baru</p>
                        <p className="text-2xl font-extrabold text-gray-800">{pendingRequests.length} <span className="text-sm font-medium text-gray-400">menunggu</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><Star className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rating Rata-rata</p>
                        <p className="text-2xl font-extrabold text-gray-800">4.9 <span className="text-sm font-medium text-gray-400">/ 5.0</span></p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Kolom Kiri: Jadwal Hari Ini */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Jadwal Praktik Hari Ini</h2>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        
                        {upcomingSchedules.length === 0 && !loading && (
                            <p className="p-6 text-sm text-gray-500 text-center">Tidak ada jadwal hari ini.</p>
                        )}
                        {upcomingSchedules.map((c) => (
                            <div key={c.id} className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center font-bold text-gray-400">
                                        {c.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-nutri-primaryDark bg-nutri-tertiary px-2 py-1 rounded">{new Date(c.scheduledAt).toLocaleString('id-ID')}</span>
                                        <h4 className="text-sm font-bold text-gray-800 mt-2">{c.user?.name || 'Pasien'}</h4>
                                        <p className="text-[11px] text-gray-500 font-medium">Pasien Terjadwal</p>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto">
                                    {c.status === 'COMPLETED' ? (
                                        <span className="px-4 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-xl block text-center">Selesai</span>
                                    ) : c.status === 'ONGOING' ? (
                                        <button 
                                            onClick={() => navigate(`/doctor/consult/${c.id}`)}
                                            className="w-full px-5 py-2 bg-nutri-primary hover:bg-nutri-primaryDark text-white text-xs font-bold rounded-xl transition shadow-sm"
                                        >
                                            Mulai Konsultasi
                                        </button>
                                    ) : (
                                        <span className="px-4 py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-xl block text-center border border-orange-100">Akan Datang</span>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                {/* Kolom Kanan: Permintaan Baru */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Permintaan Baru</h2>
                    <div className="space-y-4">
                        {pendingRequests.length === 0 && !loading && (
                            <p className="text-sm text-gray-500 text-center p-4">Tidak ada permintaan baru.</p>
                        )}
                        {pendingRequests.map(req => (
                            <div key={req.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">{req.user?.name || 'Pasien'}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Meminta jadwal: {new Date(req.scheduledAt).toLocaleString('id-ID')}</p>
                                    </div>
                                    <span className="text-[10px] font-extrabold text-nutri-secondary bg-orange-50 px-2 py-1 rounded">Baru</span>
                                </div>
                                <div className="text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    "Menunggu konfirmasi jadwal konsultasi Anda."
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => updateStatus(req.id, 'CANCELLED')}
                                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-bold rounded-lg transition"
                                    >Tolak</button>
                                    <button 
                                        onClick={() => updateStatus(req.id, 'ONGOING')}
                                        className="flex-1 py-2 bg-nutri-primary hover:bg-nutri-primaryDark text-white text-[11px] font-bold rounded-lg transition"
                                    >Terima</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default DoctorDashboard;
