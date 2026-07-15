import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, Star, Hand } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
    const navigate = useNavigate();

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
                        <p className="text-2xl font-extrabold text-gray-800">4 <span className="text-sm font-medium text-gray-400">pasien</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-nutri-secondary rounded-full flex items-center justify-center"><Bell className="w-6 h-6" /></div>
                    <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Permintaan Baru</p>
                        <p className="text-2xl font-extrabold text-gray-800">2 <span className="text-sm font-medium text-gray-400">menunggu</span></p>
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
                        
                        {[
                            { time: '10:00 - 10:30', name: 'Aiden Pratama', age: '2 Thn 4 Bln', status: 'Selesai', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=100' },
                            { time: '11:00 - 11:30', name: 'Kenzo', age: '8 Bulan', status: 'Menunggu', img: 'https://images.unsplash.com/photo-1473830394358-91588751b241?auto=format&fit=crop&q=80&w=100' },
                            { time: '14:00 - 14:30', name: 'Lala', age: '1 Thn 2 Bln', status: 'Akan Datang', img: 'https://images.unsplash.com/photo-1544281699-2a945d817441?auto=format&fit=crop&q=80&w=100' }
                        ].map((s, i) => (
                            <div key={i} className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden">
                                        <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-nutri-primaryDark bg-nutri-tertiary px-2 py-1 rounded">{s.time}</span>
                                        <h4 className="text-sm font-bold text-gray-800 mt-2">{s.name}</h4>
                                        <p className="text-[11px] text-gray-500 font-medium">{s.age}</p>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto">
                                    {s.status === 'Selesai' ? (
                                        <span className="px-4 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-xl block text-center">Selesai</span>
                                    ) : s.status === 'Menunggu' ? (
                                        <button 
                                            onClick={() => navigate('/doctor/consult/1')}
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
                        {[1, 2].map(req => (
                            <div key={req} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-gray-800">Bunda Tya (Ibu dari Arkan)</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">Meminta jadwal: Besok, 09:00</p>
                                    </div>
                                    <span className="text-[10px] font-extrabold text-nutri-secondary bg-orange-50 px-2 py-1 rounded">Baru</span>
                                </div>
                                <div className="text-[11px] text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    "Halo Dok, saya ingin konsultasi mengenai BB Arkan yang stagnan bulan ini."
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-bold rounded-lg transition">Tolak</button>
                                    <button className="flex-1 py-2 bg-nutri-primary hover:bg-nutri-primaryDark text-white text-[11px] font-bold rounded-lg transition">Terima</button>
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
