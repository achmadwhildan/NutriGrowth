import React, { useState, FormEvent, useEffect } from "react";
import { Scale, RefreshCw, ScrollText } from 'lucide-react';
import api from "../../services/api";
import { Child } from '../../types';

const Tracker: React.FC = () => {
    // state untuk alur input data gizi
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [children, setChildren] = useState<Child[]>([]);
    const [activeChildId, setActiveChildId] = useState<string | null>(null);
    const [growthHistory, setGrowthHistory] = useState<any[]>([]);

    // state aktif untuk menu sidebar tracker kecil (default: timbang)
    const [activeSubMenu, setActiveSubMenu] = useState<'timbang' | 'switcher' | 'riwayat'>('timbang');

    const handleCalculateGizi = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!activeChildId) {
                alert('Pilih profil anak terlebih dahulu.');
                return;
            }

            // mengirim data ke backend (endpoint: /api/growth/add)
            const response = await api.post('/growth/add', {
                childId: activeChildId,
                weight: parseFloat(weight),
                height: parseFloat(height)
            });

            alert(`Berhasil! Status Pertumbuhan: ${response.data.data?.zScoreStatus || response.data.data?.status || 'NORMAL'} 🎉`);
            fetchHistory();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal menghitung data gizi si Kecil.');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        if (!activeChildId) return;
        try {
            const res = await api.get(`/growth/history/${activeChildId}`);
            setGrowthHistory(res.data.data || []);
        } catch (err) {
            console.error('Gagal mengambil riwayat:', err);
        }
    };

    useEffect(() => {
        const loadChildren = async () => {
            try {
                const res = await api.get('/children');
                const list: Child[] = res.data.data || [];
                setChildren(list);
                if (list.length > 0) setActiveChildId(list[0].id);
            } catch (err) {
                console.error('Gagal mengambil data anak:', err);
            }
        };

        loadChildren();
    }, []);

    useEffect(() => {
        if (activeChildId) fetchHistory();
    }, [activeChildId]);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6 items-start font-sans">

            {/* ================= SISI KIRI: SIDEBAR TRACKER SPECIALIST ================= */}
            <aside className="w-full md:w-64 bg-white rounded-3xl border border-gray-100 p-4 flex flex-col justify-between min-h-[500px] shadow-sm">
                <div className="space-y-6">
                    {/* Info Ringkas Anak Aktif */}
                    <div className="bg-nutri-secondary/40 rounded-2xl p-4 flex items-center gap-3 border border-nutri-secondary/20">
                        <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex-shrink-0">
                            <img src={children.find(c => c.id === activeChildId)?.imageUrl || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=100'} alt="Anak" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-nutri-primaryDark">{children.find(c => c.id === activeChildId)?.name || 'Pilih Anak'}</h4>
                            <p className="text-[11px] text-gray-500 font-medium">{children.find(c => c.id === activeChildId) ? new Date().toLocaleDateString() : ''}</p>
                        </div>
                    </div>

                    {/* Pilih Anak (jika ada lebih dari 1) */}
                    {children.length > 0 && (
                        <select value={activeChildId || ''} onChange={(e) => setActiveChildId(e.target.value)} className="w-full mt-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                            {children.map(c => (
                                <option key={c.id} value={c.id}>{c.name} · {new Date(c.birthDate).toLocaleDateString()}</option>
                            ))}
                        </select>
                    )}

                    {/* Menu Navigasi Fitur Tracker */}
                    <nav className="flex flex-col gap-1.5 text-xs font-bold text-gray-500">
                        <button
                            onClick={() => setActiveSubMenu('timbang')}
                            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl transition ${activeSubMenu === 'timbang' ? 'bg-nutri-secondary text-nutri-primaryDark' : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                            <Scale className="w-4 h-4" /> Timbang Sekarang
                        </button>
                        <button
                            onClick={() => setActiveSubMenu('switcher')}
                            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl transition ${activeSubMenu === 'switcher' ? 'bg-nutri-secondary text-nutri-primaryDark' : 'hover:bg-gray-50'}`}
                        >
                            <RefreshCw className="w-4 h-4" /> Profile Switcher
                        </button>
                        <button
                            onClick={() => setActiveSubMenu('riwayat')}
                            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl transition ${activeSubMenu === 'riwayat' ? 'bg-nutri-secondary text-nutri-primaryDark' : 'hover:bg-gray-50'}`}
                        >
                            <ScrollText className="w-4 h-4" /> Riwayat
                        </button>
                    </nav>
                </div>

                {/* Widget Imunisasi Bawah */}
                <div className="bg-nutri-primary/20 rounded-2xl p-4 border border-nutri-primary/10 text-center space-y-3 mt-8">
                    <p className="text-[11px] font-semibold text-nutri-primaryDark leading-relaxed">
                        Lengkapi data imunisasi bulan ini!
                    </p>
                    <button className="w-full py-2 bg-white text-nutri-primaryDark font-bold rounded-xl text-[10px] shadow-sm hover:bg-gray-50 transition">
                        Update Data
                    </button>
                </div>
            </aside>

            {/* ================= SISI KANAN: KONTEN SELECTION INPUT DATA ================= */}
            <section className="flex-1 bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm min-h-[500px] w-full">

                {activeSubMenu === 'timbang' && (
                    <>
                        <div className="text-center space-y-1 mb-8">
                            <h2 className="text-2xl font-extrabold text-nutri-primaryDark">Timbang Sekarang</h2>
                            <p className="text-xs text-gray-400">Mari pantau tumbuh kembang si kecil hari ini.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-10 items-center max-w-3xl mx-auto w-full">
                            <form onSubmit={handleCalculateGizi} className="space-y-5 w-full">
                                <div className="relative">
                                    <input
                                        type="number" step="0.1" required placeholder="Berat Badan"
                                        value={weight} onChange={(e) => setWeight(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-nutri-primary rounded-xl text-sm font-medium focus:outline-none transition pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">kg</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="number" step="0.1" required placeholder="Tinggi Badan"
                                        value={height} onChange={(e) => setHeight(e.target.value)}
                                        className="w-full px-5 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-nutri-primary rounded-xl text-sm font-medium focus:outline-none transition pr-12"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">cm</span>
                                </div>
                                <button type="submit" disabled={loading} className="w-full py-3.5 bg-amber-800 text-white font-bold rounded-xl text-sm shadow-md hover:bg-opacity-95 transition">
                                    {loading ? 'Menghitung...' : 'Cek Hasil'}
                                </button>
                            </form>
                            <div className="flex justify-center w-full">
                                <div className="w-64 h-64 bg-nutri-primary/10 rounded-full flex items-center justify-center p-6 relative overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300" className="w-full h-full object-cover rounded-2xl shadow-md mix-blend-multiply opacity-85" alt="Scale" />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeSubMenu === 'riwayat' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-nutri-primaryDark mb-4">Riwayat Pertumbuhan</h2>
                        {growthHistory.length > 0 ? growthHistory.map((item: any, i: number) => (
                            <div key={i} className="p-4 border rounded-xl flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-bold">{new Date(item.createdAt).toLocaleDateString()}</p>
                                    <p className="text-gray-500">{item.weight} kg, {item.height} cm</p>
                                </div>
                                <span className="font-semibold text-nutri-primary">{item.zScoreStatus || 'Normal'}</span>
                            </div>
                        )) : <p className="text-sm text-gray-400">Belum ada riwayat data.</p>}
                    </div>
                )}

                {activeSubMenu === 'switcher' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="text-center space-y-1 mb-8">
                            <h2 className="text-2xl font-extrabold text-nutri-primaryDark">Profile Switcher</h2>
                            <p className="text-xs text-gray-400">Pilih profil anak yang ingin Anda pantau pertumbuhannya.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {children.map(c => (
                                <div 
                                    key={c.id} 
                                    onClick={() => {
                                        setActiveChildId(c.id);
                                        setActiveSubMenu('timbang');
                                    }}
                                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${activeChildId === c.id ? 'border-nutri-primary bg-nutri-primary/5 shadow-md' : 'border-gray-100 bg-white hover:border-nutri-primary/30 hover:bg-gray-50'}`}
                                >
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img src={c.imageUrl || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=150'} alt={c.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-nutri-primaryDark text-lg">{c.name}</h3>
                                        <p className="text-xs text-gray-500 font-medium">Lahir: {new Date(c.birthDate).toLocaleDateString('id-ID')}</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{c.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Tracker;
