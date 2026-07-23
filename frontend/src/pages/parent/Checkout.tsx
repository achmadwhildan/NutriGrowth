import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Truck, CreditCard, CircleDollarSign, Landmark, Lock } from 'lucide-react';
import api from '../../services/api';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [shippingMethod, setShippingMethod] = useState('Reguler');
  const [paymentMethod, setPaymentMethod] = useState('GoPay');
  
  // Extract product from location state
  const { product, quantity } = location.state || {};

  useEffect(() => {
    if (!product) {
      toast.error("Tidak ada produk yang dipilih untuk checkout");
      navigate(-1);
    }
  }, [product, navigate]);

  if (!product) return null;

  const orderItems = [
    { 
      id: product.id, 
      name: product.name, 
      variant: product.category, 
      qty: quantity || 1, 
      price: parseFloat(product.price || 0), 
      img: product.imageUrl || 'https://images.unsplash.com/photo-1621084556058-297d26eb4227?auto=format&fit=crop&q=80&w=150', 
      isService: false 
    }
  ];

  const subtotal = orderItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const shippingCost = shippingMethod === 'Reguler' ? 15000 : 35000;
  const tax = subtotal * 0.11;
  const total = subtotal + shippingCost + tax;

  const handleCheckout = async () => {
    try {
      const response = await api.post('/shop/checkout', {
        productId: product.id,
        quantity: quantity || 1
      });

      toast.success(response.data?.message || 'Pesanan berhasil dibuat!');
      navigate('/orders');
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err?.response?.data?.message || "Gagal memproses checkout.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 font-sans">
      
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-nutri-primaryDark">Checkout</h1>
        <p className="text-xs text-gray-500 mt-1">Selesaikan pesanan untuk nutrisi terbaik si Kecil.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sisi Kiri: Form Detail */}
        <div className="flex-1 space-y-6 w-full">
          
          {/* Alamat Pengiriman */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-nutri-primaryDark flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Alamat Pengiriman
              </h3>
              <button className="text-[10px] font-bold text-gray-400 hover:text-nutri-primary transition">Ubah Alamat</button>
            </div>
            <div className="p-4 border border-gray-200 rounded-xl relative">
              <span className="absolute top-4 right-4 text-xs font-bold text-gray-800">Alamat Utama</span>
              <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded mb-2">Rumah</span>
              <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-[80%]">
                Silakan perbarui alamat Anda di pengaturan profil.
              </p>
            </div>
          </div>

          {/* Metode Pengiriman */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-nutri-primaryDark flex items-center gap-2 mb-4">
              <Truck className="w-4 h-4" /> Metode Pengiriman
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Reguler', est: 'Estimasi 2-3 hari kerja', price: 15000 },
                { name: 'Express', est: 'Estimasi 1 hari (Besok sampai)', price: 35000 }
              ].map((m, i) => (
                <div 
                  key={i} 
                  onClick={() => setShippingMethod(m.name)}
                  className={`p-4 border rounded-xl cursor-pointer transition relative flex items-start gap-3 ${shippingMethod === m.name ? 'border-emerald-600 bg-emerald-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full mt-0.5 border-2 flex items-center justify-center ${shippingMethod === m.name ? 'border-emerald-600' : 'border-gray-300'}`}>
                    {shippingMethod === m.name && <div className="w-2 h-2 rounded-full bg-emerald-600"></div>}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{m.name}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{m.est}</p>
                    <p className="text-xs font-bold text-emerald-700 mt-2">Rp {m.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-nutri-primaryDark flex items-center gap-2 mb-6">
              <CreditCard className="w-4 h-4" /> Metode Pembayaran
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">E-Wallet</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {['GoPay', 'OVO'].map((m) => (
                    <div 
                      key={m} onClick={() => setPaymentMethod(m)}
                      className={`p-4 border rounded-xl cursor-pointer transition flex items-center justify-center gap-2 ${paymentMethod === m ? 'border-emerald-600 bg-emerald-50/30' : 'border-gray-200'}`}
                    >
                      <CircleDollarSign className="w-6 h-6 text-gray-500" />
                      <span className="text-xs font-bold text-gray-800">{m}</span>
                      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border ${paymentMethod === m ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}></div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Virtual Account / Transfer</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {['BCA VA', 'Mandiri VA'].map((m) => (
                    <div 
                      key={m} onClick={() => setPaymentMethod(m)}
                      className={`p-4 border rounded-xl cursor-pointer transition flex items-center justify-center gap-2 ${paymentMethod === m ? 'border-emerald-600 bg-emerald-50/30' : 'border-gray-200'}`}
                    >
                      <Landmark className="w-6 h-6 text-gray-500" />
                      <span className="text-xs font-bold text-gray-800">{m}</span>
                      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full border ${paymentMethod === m ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Sisi Kanan: Ringkasan Pesanan */}
        <aside className="w-full lg:w-[380px] bg-gray-50 rounded-3xl border border-gray-200 p-6 flex-shrink-0 sticky top-6">
          <h3 className="text-sm font-bold text-nutri-primaryDark mb-6">Ringkasan Pesanan</h3>
          
          <div className="space-y-4 mb-6">
            {orderItems.map(item => (
              <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${item.isService ? 'p-2 bg-white border border-gray-100' : ''}`}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-[11px] font-bold text-gray-800 leading-tight">{item.name}</h4>
                  <p className="text-[9px] text-gray-500 mt-0.5">{item.variant}</p>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <p className="text-[9px] font-bold text-gray-400 mb-0.5">{item.qty}x</p>
                  <p className="text-[11px] font-bold text-gray-800">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-200 text-xs font-medium text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Pengiriman</span>
              <span className="text-gray-800">Rp {shippingCost.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (11%)</span>
              <span className="text-gray-800">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 mt-4 border-t border-gray-200 mb-6">
            <span className="text-xs font-bold text-nutri-primaryDark">Total Tagihan</span>
            <span className="text-lg font-extrabold text-amber-800">Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full py-4 bg-amber-800 hover:bg-opacity-95 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Bayar Sekarang
          </button>
          
          <p className="text-center text-[10px] text-gray-400 mt-4 flex justify-center items-center gap-1 font-medium">
            <Lock className="w-3 h-3" /> Pembayaran Aman & Terenkripsi
          </p>

        </aside>

      </div>
    </div>
  );
};

export default Checkout;
