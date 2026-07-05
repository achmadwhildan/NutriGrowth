import React, { useState, FormEvent, useEffect } from 'react';
import api from '../../services/api';
import { Child } from '../../types';

const ParentDashboard: React.FC = () => {
    // state anak aktif dan daftar anak
    const [children, setChildren] = useState<Child[]>([]);
    const [activeChild, setActiveChild] = useState<Child | null>(null);
    const [insight, setInsight] = useState<string>('');

    // State untuk mengontrol buka/tutup modal popup
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // state form input timbang anak 
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [headCircumference, setHeadCircumference] = useState<string>('');
    const [note, setNote] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const handleWeightSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!activeChild) {
                alert('Pilih profil anak terlebih dahulu.');
                return;
            }

            // Panggil endpoint growth add
            await api.post('/growth/add', {
                childId: activeChild.id,
                weight: parseFloat(weight),
                height: parseFloat(height),
                headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
                note
            });

            alert("Data tumbuh kembang berhasil dicatat! 🎉");
            setIsModalOpen(false);

            // Kosongkan form kembali
            setWeight('');
            setHeight('');
            setHeadCircumference('');
            setNote('');
        } catch (error: any) {
            alert(error.response?.data?.message || "Gagal mencatat data gizi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadChildren = async () => {
            try {
                const res = await api.get('/children');
                const list: Child[] = res.data.data || [];
                setChildren(list);
                if (list.length > 0) {
                    setActiveChild(list[0]);
                    setInsight((list[0]?.name ? `Data ${list[0].name} siap dipantau.` : '') as string);
                }
            } catch (err) {
                console.error('Gagal memuat data anak:', err);
            }
        };

        loadChildren();
    }, []);

    const formatAge = (birthDate?: string) => {
        if (!birthDate) return '';
        const b = new Date(birthDate);
        const diff = Date.now() - b.getTime();
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.4375));
        const years = Math.floor(months / 12);
        const remMonths = months % 12;
        return `${years > 0 ? `${years} Thn ` : ''}${remMonths} Bln`;
    };

    // Compute display data for the active child to avoid undefined errors
    const childData = {
        name: activeChild?.name || 'Belum ada profil anak',
        age: formatAge(activeChild?.birthDate),
        gender: activeChild?.gender === 'L' ? 'Laki-laki' : activeChild?.gender === 'P' ? 'Perempuan' : '-',
        status: insight || '-',
        height: activeChild?.birthHeight ? String(activeChild.birthHeight) : '-',
        weight: activeChild?.birthWeight ? String(activeChild.birthWeight) : '-',
        insight: insight || ''
    };

    return (
        <>
            {/* 2. BANNER PROFIL ANAK */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-nutri-tertiary/40 flex-shrink-0 relative">
                        <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=150" alt="Avatar Anak" className="object-cover w-full h-full" />
                        <span className="absolute bottom-1 right-1 bg-nutri-secondary text-nutri-primaryDark text-[9px] font-bold px-1 rounded">14m</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-nutri-primaryDark">{childData.name}</h2>
                        <p className="text-xs text-gray-400 font-medium">{childData.age} • {childData.gender}</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-nutri-secondary hover:bg-opacity-90 text-nutri-primaryDark font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                >
                    <span>⚖️</span> Timbang Sekarang
                </button>
            </div>

            {/* 3. SECTION STATUS & INSIGHT */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold text-nutri-primaryDark uppercase tracking-wider">Status & Insight</h3>
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm grid md:grid-cols-3 gap-8 items-center">

                    {/* Gauge Grafik Status Gizi */}
                    <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                        <div className="relative w-40 h-24 flex flex-col justify-end items-center overflow-hidden">
                            {/* Lengkungan Setengah Lingkaran */}
                            <div className="absolute top-0 w-36 h-36 border-[12px] border-nutri-primaryDark/20 rounded-full"></div>
                            <div className="absolute top-0 w-36 h-36 border-[12px] border-nutri-primaryDark rounded-full clip-half"></div>

                            <span className="text-xl font-extrabold text-nutri-primaryDark z-10">{childData.status}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1 z-10">Growth Status</span>
                        </div>
                        <div className="flex gap-6 mt-4 text-center">
                            <div>
                                <p className="text-[10px] text-gray-400 font-medium">Height</p>
                                <p className="text-sm font-bold text-nutri-primaryDark">{childData.height} cm</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-medium">Weight</p>
                                <p className="text-sm font-bold text-nutri-primaryDark">{childData.weight} kg</p>
                            </div>
                        </div>
                    </div>

                    {/* Kotak Pesan Teks Insight */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-nutri-neutralBg border border-gray-100 p-5 rounded-2xl text-xs md:text-sm text-nutri-neutralText/90 leading-relaxed font-medium">
                            "{childData.insight}"
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                            <span className="px-3 py-1.5 bg-nutri-tertiary text-nutri-primaryDark rounded-full">✓ Tinggi Normal</span>
                            <span className="px-3 py-1.5 bg-nutri-secondary/20 text-orange-600 rounded-full">📈 Perlu Optimasi Berat</span>
                        </div>
                        <a href="#" className="inline-flex items-center text-xs font-bold text-nutri-primaryDark hover:underline pt-2 gap-1">
                            Lihat Grafik Lengkap <span className="text-sm">→</span>
                        </a>
                    </div>

                </div>
            </section>

            {/* 4. SECTION REKOMENDASI BERBELANJA */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold text-nutri-primaryDark uppercase tracking-wider">Rekomendasi Berbelanja</h3>
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Card Kiri: Resep Harian */}
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group cursor-pointer">
                        <div className="h-44 bg-gray-100 overflow-hidden relative">
                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400" alt="Resep" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[9px] font-extrabold text-nutri-primaryDark px-2 py-1 rounded-md uppercase tracking-wider">Daily Recipe</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-nutri-primaryDark text-base mb-1.5">Resep MPASI 12–18 Bulan</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">Menu kaya zat besi untuk mendukung perkembangan kognitif Aiden hari ini.</p>
                            </div>
                            <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
                                <span>8 Menit Membaca</span>
                                <span className="text-sm text-nutri-primary font-bold">→</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Kanan: Promo Banner Katering */}
                    <div className="bg-nutri-secondary/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm border border-nutri-secondary/20 min-h-[260px]">
                        <div className="max-w-[65%] space-y-2">
                            <span className="text-[9px] font-extrabold text-orange-700/80 uppercase tracking-widest block">Promo Terdekat</span>
                            <h4 className="text-lg md:text-xl font-extrabold text-nutri-primaryDark leading-tight">Katering MPASI Lokal Terdekat</h4>
                            <p className="text-xs text-gray-600/90 leading-relaxed">Diskon 20% untuk langganan paket 'Tumbuh Sehat' minggu ini.</p>
                        </div>
                        <button className="w-fit mt-6 px-4 py-2 bg-nutri-secondary hover:bg-opacity-90 text-nutri-primaryDark font-bold rounded-xl text-xs shadow-sm transition">
                            Cek Katering
                        </button>
                        {/* Gambar makanan mengambang dekoratif di kanan */}
                        <div className="absolute right-[-20px] bottom-[-10px] w-40 h-40 bg-contain bg-no-repeat opacity-90 pointer-events-none bg-[url('https://www.svgrepo.com/show/275323/salad-bowl.svg')]"></div>
                    </div>

                </div>
            </section>
        </>
    );
};

export default ParentDashboard;