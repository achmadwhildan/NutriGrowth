import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

type Product = {
  id: string;
  name: string;
  description?: string;
  price?: string | number;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

const ConsultMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'consult' | 'shop'>('consult');
  const [products, setProducts] = useState<Product[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/shop/products');
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Gagal memuat produk:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await api.get('/consultations/doctors');
        setDoctors(res?.data?.data || []);
      } catch (err) {
        console.error('Gagal memuat daftar dokter:', err);
      }
    };

    loadDoctors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 font-sans">
      
      {/* Header & Toggle */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-nutri-primaryDark">Pusat Nutrisi & Konsultasi</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">Pilih paket makanan sehat untuk tumbuh kembang si kecil melalui konsultasi atau langsung beli di marketplace.</p>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1 text-xs font-bold text-gray-500 w-fit">
          <button 
            onClick={() => setActiveTab('consult')}
            className={`px-6 py-2.5 rounded-lg transition ${activeTab === 'consult' ? 'bg-white text-nutri-primaryDark shadow-sm' : 'hover:text-nutri-primaryDark'}`}
          >
            Konsultasi
          </button>
          <button 
            onClick={() => setActiveTab('shop')}
            className={`px-6 py-2.5 rounded-lg transition ${activeTab === 'shop' ? 'bg-white text-nutri-primaryDark shadow-sm' : 'hover:text-nutri-primaryDark'}`}
          >
            Nutri-Shop
          </button>
        </div>
      </div>

      {/* Konten Konsultasi */}
      {activeTab === 'consult' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doc => (
            <div key={doc.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={doc.photoUrl || 'https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&q=80&w=150'} alt={doc.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-nutri-primaryDark text-sm leading-tight max-w-[150px]">{doc.name}</h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">{doc.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                  <span>★</span> {Number(doc.pricePerSession || 0).toFixed(0)}
                </div>
              </div>
              
              <div className="flex justify-between items-end pt-4 border-t border-gray-50 mt-2">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Mulai dari</p>
                  <p className="text-sm font-bold text-orange-700">Rp {Number(doc.pricePerSession || 0).toLocaleString('id-ID')}</p>
                </div>
                <button 
                  onClick={async () => {
                    try {
                      const res = await api.post('/consultations', { doctorId: doc.id });
                      const id = res.data?.data?.id;
                      if (id) navigate(`/chat/${id}`);
                    } catch (err) {
                      console.error('Gagal membuat konsultasi:', err);
                      alert('Gagal memulai konsultasi. Pastikan Anda sudah login.');
                    }
                  }}
                  className="px-4 py-2 bg-amber-800 hover:bg-opacity-95 text-white font-bold rounded-xl text-xs transition"
                >
                  Chat Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Konten Shop (Dummy jika dipilih) */}
      {activeTab === 'shop' && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-gray-400">Memuat produk...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Belum ada produk tersedia.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100">
                        <img src={p.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=150'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-nutri-primaryDark text-sm leading-tight max-w-[150px]">{p.name}</h3>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">{p.category || ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                      <span>★</span> {Number(p.price || 0).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-gray-50 mt-2">
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium">Mulai dari</p>
                      <p className="text-sm font-bold text-orange-700">Rp {Number(p.price || 0).toLocaleString('id-ID')}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/shop/${p.id}`)}
                      className="px-4 py-2 bg-amber-800 hover:bg-opacity-95 text-white font-bold rounded-xl text-xs transition"
                    >
                      Lihat Produk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ConsultMarketplace;
