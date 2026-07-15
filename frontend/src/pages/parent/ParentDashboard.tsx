import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Plus, CheckCircle, TrendingUp, ArrowRight, ShoppingCart, UtensilsCrossed, X } from 'lucide-react';
import api from '../../services/api';
import { Child } from '../../types';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category: string;
}

const ParentDashboard: React.FC = () => {
    // state anak aktif dan daftar anak
    const [, setChildren] = useState<Child[]>([]);
    const [activeChild, setActiveChild] = useState<Child | null>(null);
    const [insight, setInsight] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);

    // State untuk mengontrol buka/tutup modal popup
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [heightInput, setHeightInput] = useState('');
    const [weightInput, setWeightInput] = useState('');

    // State untuk modal Buat Profil Anak
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState<boolean>(false);
    const [childName, setChildName] = useState('');
    const [childGender, setChildGender] = useState('L');
    const [childBirthDate, setChildBirthDate] = useState('');
    const [childBirthWeight, setChildBirthWeight] = useState('');
    const [childBirthHeight, setChildBirthHeight] = useState('');

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

        // Fetch produk rekomendasi
        api.get('/shop/products').then(res => {
            setProducts(res.data.data || []);
        }).catch(err => console.error('Gagal mengambil produk:', err));
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

    const handleSaveGrowth = async () => {
        if (!activeChild || !activeChild.id) {
            alert('Tidak ada data profil anak. Silakan buat profil anak terlebih dahulu.');
            return;
        }
        if (!heightInput || !weightInput) {
            alert('Tinggi dan berat badan wajib diisi!');
            return;
        }

        try {
            await api.post('/growth/add', {
                childId: activeChild.id,
                height: parseFloat(heightInput),
                weight: parseFloat(weightInput),
            });
            alert('Data pertumbuhan berhasil disimpan!');
            setIsModalOpen(false);
            setHeightInput('');
            setWeightInput('');
            // reload to fetch updated data (or we could extract loadChildren and call it here)
            window.location.reload();
        } catch (error) {
            console.error('Gagal menyimpan data:', error);
            alert('Terjadi kesalahan saat menyimpan data.');
        }
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
                    onClick={() => activeChild ? setIsModalOpen(true) : setIsAddChildModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-nutri-secondary hover:bg-opacity-90 text-nutri-primaryDark font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                >
                    {activeChild ? (
                        <><Scale className="w-4 h-4" /> Timbang Sekarang</>
                    ) : (
                        <><Plus className="w-4 h-4" /> Buat Profil Anak</>
                    )}
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
                            <span className="px-3 py-1.5 bg-nutri-tertiary text-nutri-primaryDark rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Tinggi Normal</span>
                            <span className="px-3 py-1.5 bg-nutri-secondary/20 text-orange-600 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Perlu Optimasi Berat</span>
                        </div>
                        <Link to="/child-development" className="inline-flex items-center text-xs font-bold text-nutri-primaryDark hover:underline pt-2 gap-1">
                            Lihat Grafik Lengkap <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </section>

            {/* 4. SECTION REKOMENDASI BERBELANJA */}
            <section className="space-y-4">
                <h3 className="text-sm font-bold text-nutri-primaryDark uppercase tracking-wider">Rekomendasi Berbelanja</h3>
                {products.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
                        <div className="flex justify-center mb-4 text-gray-300">
                            <ShoppingCart className="w-12 h-12" />
                        </div>
                        <p className="text-sm text-gray-500">Belum ada produk tersedia.</p>
                        <p className="text-xs text-gray-400 mt-1">Admin dapat menambahkan produk melalui halaman Admin Panel.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col group cursor-pointer hover:shadow-md transition">
                                <div className="h-40 bg-gray-100 overflow-hidden relative">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-nutri-tertiary/30 text-nutri-primaryDark">
                                            <UtensilsCrossed className="w-8 h-8" />
                                        </div>
                                    )}
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-extrabold text-nutri-primaryDark px-2 py-1 rounded-md uppercase tracking-wider">
                                        {product.category}
                                    </span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-nutri-primaryDark text-sm mb-1">{product.name}</h4>
                                        {product.description && (
                                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{product.description}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-50">
                                        <span className="text-sm font-extrabold text-nutri-primaryDark">
                                            Rp {product.price.toLocaleString('id-ID')}
                                        </span>
                                        <Link 
                                            to={`/products/${product.id}`}
                                            className="text-[11px] font-bold text-nutri-primary hover:underline"
                                        >
                                            Lihat Detail <ArrowRight className="w-3 h-3 inline ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 5. MODAL TAMBAH DATA / TIMBANG */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl relative animate-fade-in">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-nutri-primaryDark mb-1">Timbang Sekarang</h3>
                        <p className="text-xs text-gray-500 mb-6">Masukkan data tinggi dan berat badan terbaru {childData.name !== 'Belum ada profil anak' ? childData.name : 'anak'}.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Tinggi Badan (cm)</label>
                                <input 
                                    type="number" 
                                    placeholder="Contoh: 85" 
                                    value={heightInput}
                                    onChange={(e) => setHeightInput(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nutri-primary/50 text-sm font-medium" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Berat Badan (kg)</label>
                                <input 
                                    type="number" 
                                    step="0.1" 
                                    placeholder="Contoh: 11.5" 
                                    value={weightInput}
                                    onChange={(e) => setWeightInput(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nutri-primary/50 text-sm font-medium" 
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleSaveGrowth}
                                    className="flex-1 py-3 bg-nutri-primary hover:bg-opacity-90 text-white font-bold rounded-xl text-sm shadow-sm transition"
                                >
                                    Simpan Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 6. MODAL BUAT PROFIL ANAK */}
            {isAddChildModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl relative animate-fade-in">
                        <button 
                            onClick={() => setIsAddChildModalOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-nutri-primaryDark mb-1">Buat Profil Anak</h3>
                        <p className="text-xs text-gray-500 mb-6">Masukkan data diri anak Anda untuk memulai.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Anak</label>
                                <input 
                                    type="text" 
                                    placeholder="Contoh: Aiden" 
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nutri-primary/50 text-sm font-medium" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Jenis Kelamin</label>
                                    <select 
                                        value={childGender}
                                        onChange={(e) => setChildGender(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nutri-primary/50 text-sm font-medium bg-white"
                                    >
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Tanggal Lahir</label>
                                    <input 
                                        type="date" 
                                        value={childBirthDate}
                                        onChange={(e) => setChildBirthDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nutri-primary/50 text-sm font-medium" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Berat Lahir (kg)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        placeholder="Misal: 3.2" 
                                        value={childBirthWeight}
                                        onChange={(e) => setChildBirthWeight(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nutri-primary/50 text-sm font-medium" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Tinggi Lahir (cm)</label>
                                    <input 
                                        type="number" 
                                        placeholder="Misal: 50" 
                                        value={childBirthHeight}
                                        onChange={(e) => setChildBirthHeight(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-nutri-primary/50 text-sm font-medium" 
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button 
                                    onClick={() => setIsAddChildModalOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={async () => {
                                        if (!childName || !childBirthDate || !childBirthWeight || !childBirthHeight) {
                                            alert("Mohon lengkapi semua data anak.");
                                            return;
                                        }
                                        try {
                                            await api.post('/children/add', {
                                                name: childName,
                                                gender: childGender,
                                                birthDate: childBirthDate,
                                                birthWeight: parseFloat(childBirthWeight),
                                                birthHeight: parseFloat(childBirthHeight)
                                            });
                                            alert("Profil anak berhasil dibuat!");
                                            setIsAddChildModalOpen(false);
                                            window.location.reload();
                                        } catch (err) {
                                            alert("Gagal membuat profil anak");
                                            console.error(err);
                                        }
                                    }}
                                    className="flex-1 py-3 bg-nutri-primary hover:bg-opacity-90 text-white font-bold rounded-xl text-sm shadow-sm transition"
                                >
                                    Buat Profil
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ParentDashboard;