import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface ScheduleSlot {
    day: string;
    times: string[];
    active: boolean;
}

const defaultSchedule: ScheduleSlot[] = [
    { day: 'Senin', times: [], active: false },
    { day: 'Selasa', times: [], active: false },
    { day: 'Rabu', times: [], active: false },
    { day: 'Kamis', times: [], active: false },
    { day: 'Jumat', times: [], active: false },
    { day: 'Sabtu', times: [], active: false },
    { day: 'Minggu', times: [], active: false },
];

const DoctorSchedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleSlot[]>(defaultSchedule);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const response = await api.get('/doctor/schedule');
                const data = response.data.data;
                
                // Map the backend data to our state structure
                if (data && data.length > 0) {
                    const newSchedule = defaultSchedule.map(ds => {
                        const existing = data.find((d: any) => d.dayOfWeek === ds.day);
                        if (existing) {
                            return {
                                day: ds.day,
                                times: existing.times || [],
                                active: existing.isActive
                            };
                        }
                        return ds;
                    });
                    setSchedule(newSchedule);
                }
            } catch (error) {
                console.error("Gagal memuat jadwal:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const handleToggleDay = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule[index].active = !newSchedule[index].active;
        setSchedule(newSchedule);
    };

    const handleRemoveTime = (dayIndex: number, timeIndex: number) => {
        const newSchedule = [...schedule];
        newSchedule[dayIndex].times.splice(timeIndex, 1);
        setSchedule(newSchedule);
    };

    const handleAddTime = (dayIndex: number) => {
        const timeStr = prompt("Masukkan waktu (contoh: 09:00):");
        if (timeStr && timeStr.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
            const newSchedule = [...schedule];
            if (!newSchedule[dayIndex].times.includes(timeStr)) {
                newSchedule[dayIndex].times.push(timeStr);
                // Sort times
                newSchedule[dayIndex].times.sort();
                setSchedule(newSchedule);
            } else {
                toast.error("Waktu tersebut sudah ada di jadwal.");
            }
        } else if (timeStr) {
            toast.error("Format waktu tidak valid. Gunakan format HH:MM (contoh 09:00);.");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = schedule.map(s => ({
                dayOfWeek: s.day,
                times: s.times,
                isActive: s.active
            }));
            
            await api.put('/doctor/schedule', { schedules: payload });
            toast.success("Jadwal berhasil disimpan!");
        } catch (error) {
            console.error("Gagal menyimpan jadwal:", error);
            toast.error("Terjadi kesalahan saat menyimpan jadwal.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 font-sans">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">Jadwal Praktik</h1>
                    <p className="text-sm text-gray-500 mt-1">Atur ketersediaan waktu Anda untuk konsultasi online.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={loading || saving}
                    className="px-5 py-2.5 bg-nutri-primary hover:bg-nutri-primaryDark text-white font-bold rounded-xl text-xs transition shadow-sm disabled:opacity-50"
                >
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                {loading ? (
                    <div className="text-center py-10 text-gray-400">Memuat jadwal...</div>
                ) : (
                    <div className="space-y-6">
                        {schedule.map((s, i) => (
                            <div key={i} className={`flex flex-col md:flex-row gap-4 p-4 border rounded-2xl transition-all ${s.active ? 'border-gray-200' : 'border-gray-100 bg-gray-50/50 opacity-60'}`}>
                                
                                <div className="w-full md:w-32 flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={s.active} 
                                            onChange={() => handleToggleDay(i)}
                                        />
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
                                                    <button 
                                                        onClick={() => handleRemoveTime(i, idx)}
                                                        className="ml-1 text-nutri-primaryDark hover:text-red-500 transition text-[10px]"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => handleAddTime(i)}
                                                className="px-3 py-1.5 bg-gray-50 text-gray-400 hover:text-gray-600 border border-gray-200 text-xs font-bold rounded-lg transition border-dashed"
                                            >
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
                )}
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-xs text-orange-800/90 leading-relaxed font-medium">
                <span className="font-bold">Info:</span> Jadwal yang Anda atur di sini akan langsung terlihat oleh pasien di halaman Marketplace Konsultasi. Slot yang sudah dibooking tidak akan terhapus meskipun Anda menonaktifkan hari tersebut.
            </div>

        </div>
    );
};

export default DoctorSchedule;
