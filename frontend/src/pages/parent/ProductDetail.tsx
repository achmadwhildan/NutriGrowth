import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

// Helper component: fetch products and find by id, then call onLoad
const ProductLoader: React.FC<{ idParam?: string; onLoad: (p: any | null) => void; setLoading?: (v: boolean) => void }> = ({ idParam, onLoad, setLoading }) => {
  useEffect(() => {
    const load = async () => {
      try {
        setLoading?.(true);
        const res = await api.get('/shop/products');
        const list = res.data.data || [];
        if (idParam) {
          const found = list.find((x: any) => String(x.id) === String(idParam));
          onLoad(found || null);
        } else {
          onLoad(list[0] || null);
        }
      } catch (err) {
        console.error('Gagal memuat produk:', err);
        onLoad(null);
      } finally {
        setLoading?.(false);
      }
    };

    load();
  }, [idParam]);

  return null;
};

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'detail' | 'kandungan' | 'penyajian'>('detail');

  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans space-y-8">
      
      {/* Breadcrumb */}
      <div className="text-[10px] font-bold text-gray-400 flex gap-2 mb-4">
        <span className="hover:text-nutri-primary cursor-pointer" onClick={() => navigate('/consult')}>Marketplace</span>
        <span>&gt;</span>
        <span className="hover:text-nutri-primary cursor-pointer">Makanan Bayi</span>
        <span>&gt;</span>
        <span className="text-nutri-primaryDark">Paket MPASI Organik</span>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sisi Kiri: Galeri Produk */}
        <div className="w-full md:w-5/12 space-y-4">
            <div className="bg-emerald-800/10 rounded-3xl overflow-hidden aspect-square relative border border-gray-100">
            <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold text-nutri-primaryDark shadow-sm flex items-center gap-1.5 z-10">
              <span className="text-nutri-primary">★</span> Recommended
            </span>
            {loading ? (
              <div className="w-full h-64 flex items-center justify-center text-gray-400">Memuat produk...</div>
            ) : (
              <img src={product?.imageUrl || 'https://images.unsplash.com/photo-1621084556058-297d26eb4227?auto=format&fit=crop&q=80&w=800'} alt={product?.name || 'Produk'} className="w-full h-full object-cover mix-blend-multiply" />
            )}
          </div>
          <div className="flex gap-4">
            {product && product.imageUrl ? (
              <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer border-nutri-primary`}>
                <img src={product.imageUrl} alt={`Thumb`} className="w-full h-full object-cover" />
              </div>
            ) : (
              []
            )}
          </div>
        </div>

        {/* Sisi Kanan: Info & Beli */}
        <div className="flex-1 flex flex-col pt-2">

          {/* Load product data when component mounts */}
          {/** Fetch product list and find by id **/}
          <ProductLoader idParam={id} onLoad={(p) => setProduct(p)} setLoading={setLoading} />
          
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">{product?.category || 'Produk'}</span>
              <span className="text-orange-400 text-xs">★★★★★</span>
              <span className="text-[10px] text-gray-400 font-medium">{product?._reviewsCount || '(belum ada ulasan)'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-nutri-primaryDark leading-tight">{product?.name || 'Produk Tidak Ditemukan'}</h1>
            <p className="text-xs text-gray-500 leading-relaxed max-w-lg">{product?.description || 'Deskripsi produk tidak tersedia.'}</p>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-extrabold text-amber-800">Rp {product?.price ? Number(product.price).toLocaleString('id-ID') : '0'}</span>
            {product?.oldPrice && <span className="text-sm font-bold text-gray-400 line-through mb-1">Rp {Number(product.oldPrice).toLocaleString('id-ID')}</span>}
            {product?.oldPrice && (
              <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-1 rounded mb-1">Hemat {Math.round(((Number(product.oldPrice) - Number(product.price)) / Number(product.oldPrice)) * 100)}%</span>
            )}
          </div>

          <div className="bg-emerald-50 border border-emerald-100/50 rounded-2xl p-5 mb-8">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex justify-center items-center text-[10px]">?</span>
              Kenapa ini cocok untuk Aiden?
            </h4>
            <p className="text-[11px] text-emerald-700/80 leading-relaxed font-medium pl-7">
              Berdasarkan data timbang terakhir, Aiden membutuhkan asupan Zat Besi & Omega-3 lebih tinggi. Paket ini mengandung Puree Hati Ayam & Bayam Organik.
            </p>
          </div>

          {/* Tab Konten Info */}
          <div className="mb-8">
            <div className="flex gap-6 border-b border-gray-100 mb-4 text-xs font-bold text-gray-400">
              <button onClick={() => setActiveTab('detail')} className={`pb-2 transition ${activeTab === 'detail' ? 'text-nutri-primaryDark border-b-2 border-nutri-primaryDark' : 'hover:text-gray-600'}`}>Detail Produk</button>
              <button onClick={() => setActiveTab('kandungan')} className={`pb-2 transition ${activeTab === 'kandungan' ? 'text-nutri-primaryDark border-b-2 border-nutri-primaryDark' : 'hover:text-gray-600'}`}>Kandungan Gizi</button>
              <button onClick={() => setActiveTab('penyajian')} className={`pb-2 transition ${activeTab === 'penyajian' ? 'text-nutri-primaryDark border-b-2 border-nutri-primaryDark' : 'hover:text-gray-600'}`}>Cara Penyajian</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100/50">
                <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Komposisi</p>
                <p className="text-xs font-medium text-gray-700">Beras Merah, Hati Ayam, Bayam, Wortel, Minyak Zaitun.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100/50">
                <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Tekstur</p>
                <p className="text-xs font-medium text-gray-700">Bubur Halus (Stage 1)</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-4">
              Diproduksi secara higienis tanpa tambahan garam, gula, atau pengawet. Setiap kemasan berisi 6 porsi siap saji yang telah melewati uji lab keamanan pangan bayi.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-auto">
            <button className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <span>🛒</span> Tambah ke Keranjang
            </button>
            <button 
              onClick={() => navigate('/checkout')}
              className="flex-1 py-3.5 bg-amber-800 hover:bg-opacity-95 text-white font-bold rounded-xl text-sm shadow-sm transition"
            >
              Beli Sekarang
            </button>
          </div>

        </div>
      </div>

      {/* Ulasan */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-nutri-primaryDark">Ulasan Pilihan</h3>
          <a href="#" className="text-xs font-bold text-nutri-primary hover:underline">Lihat Semua</a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: 'Mama Kenzo', r: 'Anakku suka banget, teksturnya pas buat pemula MPASI. Wanginya natural, nggak amis sama sekali.' },
            { n: 'Bunda Tya', r: 'Pengiriman cepet banget, packaging rapi. Sangat membantu buat working mom kayak aku!' },
            { n: 'Dina Putri', r: 'Recommended! Bahan-bahannya keliatan seger banget diprosesnya. Baby lahap makannya.' }
          ].map((u, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <h4 className="text-[11px] font-bold text-gray-800">{u.n}</h4>
                  <div className="text-orange-400 text-[10px]">★★★★★</div>
                </div>
              </div>
              <p className="text-[11px] text-gray-600 italic">"{u.r}"</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
