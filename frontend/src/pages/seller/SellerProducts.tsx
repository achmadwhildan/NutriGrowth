import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

const SellerProducts: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [stock, setStock] = useState<number | ''>('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await api.get('/shop/products');
                setProducts(res.data.data || []);
            } catch (err) {
                console.error('Gagal memuat produk seller:', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
        try {
            await api.delete(`/shop/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
            alert('Produk berhasil dihapus');
        } catch (error) {
            console.error('Gagal hapus produk', error);
            alert('Gagal menghapus produk');
        }
    };

    const handleEditClick = (product: any) => {
        setEditingProductId(product.id);
        setName(product.name);
        setPrice(product.price);
        setStock(product.stock);
        setCategory(product.category || '');
        setDescription(product.description || '');
        setImageUrl(product.imageUrl || '');
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProductId(null);
        setName('');
        setPrice('');
        setStock('');
        setCategory('');
        setDescription('');
        setImageUrl('');
    };

    return (
        <div className="space-y-8 font-sans">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">Manajemen Produk</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola daftar menu MPASI yang Anda jual.</p>
                </div>
                <button 
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-5 py-2.5 bg-nutri-primary hover:bg-nutri-primaryDark text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                    + Tambah Produk Baru
                </button>
            </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <input type="text" placeholder="Cari produk..." className="flex-1 px-4 py-2 bg-gray-50 border border-transparent focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none" />
                    <select className="px-4 py-2 bg-gray-50 border border-transparent focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none font-medium text-gray-600">
                        <option>Semua Status</option>
                        <option>Aktif</option>
                        <option>Habis</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="p-4 w-16">Foto</th>
                                <th className="p-4">Nama Produk</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4">Stok</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={6} className="p-6 text-center text-gray-400">Memuat produk...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={6} className="p-6 text-center text-gray-400">Belum ada produk</td></tr>
                            ) : (
                                products.map((p: any) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                            <img src={p.imageUrl || 'https://images.unsplash.com/photo-1548943487-a2e4d43b4852?auto=format&fit=crop&q=80&w=150'} alt={p.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">{p.name}</td>
                                    <td className="p-4 font-bold text-nutri-primaryDark">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                                    <td className="p-4 font-medium text-gray-600">{p.stock} porsi</td>
                                    <td className="p-4">
                                        {p.stock > 0 ? (
                                            <span className="px-2 py-1 bg-nutri-tertiary text-nutri-primaryDark text-[10px] font-bold rounded">Aktif</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded">Habis</span>
                                        )}
                                    </td>
                                    <td className="p-4 flex gap-3 mt-2">
                                        <button onClick={() => handleEditClick(p)} className="text-[11px] font-bold text-nutri-primary hover:text-nutri-primaryDark transition">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="text-[11px] font-bold text-red-500 hover:text-red-700 transition">Hapus</button>
                                    </td>
                                </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Produk */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800">{editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 font-bold"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Produk</label>
                                <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none" placeholder="Cth: Bubur Bayi Organik" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Harga (Rp)</label>
                                    <input value={price} onChange={e => setPrice(Number(e.target.value))} type="number" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Stok Awal</label>
                                    <input value={stock} onChange={e => setStock(Number(e.target.value))} type="number" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none" placeholder="0" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Deskripsi Singkat</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none" placeholder="Bahan-bahan dan kandungan gizi..."></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">URL Gambar</label>
                                <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">Kategori</label>
                                <input value={category} onChange={e => setCategory(e.target.value)} type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none" placeholder="Contoh: MPASI" />
                            </div>
                            <button 
                                onClick={async () => {
                                    try {
                                        const payload = { name, description, price, stock, category, imageUrl };
                                        if (editingProductId) {
                                            const res = await api.put(`/shop/products/${editingProductId}`, payload);
                                            setProducts(prev => prev.map(p => p.id === editingProductId ? res.data.data : p));
                                        } else {
                                            const res = await api.post('/shop/products', payload);
                                            setProducts(prev => [res.data.data, ...prev]);
                                        }
                                        setShowModal(false);
                                        resetForm();
                                    } catch (err: any) {
                                        console.error('Gagal menyimpan produk:', err);
                                        alert(err?.response?.data?.message || 'Gagal menyimpan produk');
                                    }
                                }}
                                className="w-full py-3 bg-nutri-primary hover:bg-nutri-primaryDark text-white font-bold rounded-xl transition shadow-sm mt-2"
                            >
                                {editingProductId ? 'Update Produk' : 'Simpan Produk'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SellerProducts;
