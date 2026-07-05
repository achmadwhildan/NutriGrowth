import React from 'react';

const DoctorSchedule: React.FC = () => {
    const schedule = [
        { day: 'Senin', times: ['09:00', '10:00', '14:00', '15:00'], active: true },
        { day: 'Selasa', times: ['09:00', '10:00', '11:00'], active: true },
        { day: 'Rabu', times: [], active: false },
        { day: 'Kamis', times: ['14:00', '15:00', '16:00'], active: true },
        { day: 'Jumat', times: ['09:00', '10:00', '14:00'], active: true },
        { day: 'Sabtu', times: ['09:00', '10:00', '11:00', '13:00', '14:00'], active: true },
        { day: 'Minggu', times: [], active: false },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 font-sans">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">Jadwal Praktik</h1>
                    <p className="text-sm text-gray-500 mt-1">Atur ketersediaan waktu Anda untuk konsultasi online.</p>
                </div>
                <button className="px-5 py-2.5 bg-nutri-primary hover:bg-nutri-primaryDark text-white font-bold rounded-xl text-xs transition shadow-sm">
                    Simpan Perubahan
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="space-y-6">
                    {schedule.map((s, i) => (
                        <div key={i} className={`flex flex-col md:flex-row gap-4 p-4 border rounded-2xl ${s.active ? 'border-gray-200' : 'border-gray-100 bg-gray-50/50 opacity-60'}`}>
                            
                            <div className="w-full md:w-32 flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={s.active} />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-nutri-primary"></div>
                                </label>
                                <span className="text-sm font-bold text-gray-800">{s.day}</span>
                            </div>

                            <div className="flex-1">
                                {s.active ? (
                                    <div className="flex flex-wrap gap-2">
                                        {s.times.map((t, idx) => (
                                            <div key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-nutri-tertiary text-nutri-primaryDark text-xs font-bold rounded-lg border border-nutri-primary">
                                                {t}
                                                <button className="ml-1 text-nutri-primaryDark hover:text-red-500 transition text-[10px]">✕</button>
                                            </div>
                                        ))}
                                        <button className="px-3 py-1.5 bg-gray-50 text-gray-400 hover:text-gray-600 border border-gray-200 text-xs font-bold rounded-lg transition border-dashed">
                                            + Tambah Slot
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400 font-medium italic">Tidak ada jadwal praktik</span>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-xs text-orange-800/90 leading-relaxed font-medium">
                <span className="font-bold">Info:</span> Jadwal yang Anda atur di sini akan langsung terlihat oleh pasien di halaman Marketplace Konsultasi. Slot yang sudah dibooking tidak akan terhapus meskipun Anda menonaktifkan hari tersebut.
            </div>

        </div>
    );
};

export default DoctorSchedule;
