import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const DoctorProfile: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState<string>('11:00-11:30');
  const { id: doctorId } = useParams<{ id?: string }>();

  const times = [
    { time: '09:00-09:30', status: 'available' },
    { time: '10:00-10:30', status: 'booked' },
    { time: '11:00-11:30', status: 'available' },
    { time: '14:00-14:30', status: 'available' },
    { time: '15:30-16:00', status: 'available' },
    { time: '19:00-19:30', status: 'available' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 font-sans">
      
      {/* Tombol Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-nutri-primaryDark hover:text-nutri-primary transition mb-6">
        <span>←</span> Kembali
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Sisi Kiri: Profil Dokter */}
        <div className="flex-1 space-y-6 w-full">
          {/* Card Info Utama */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 shadow-sm">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden relative flex-shrink-0 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" alt="Dr. Maya Putri" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">★ 4.9</span>
            </div>
            <div className="flex flex-col justify-between py-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-nutri-primaryDark">Dr. Maya Putri, Sp.A</h1>
                <p className="text-sm font-medium text-amber-800 mt-1">Spesialis Nutrisi & Tumbuh Kembang Anak</p>
                <div className="flex gap-2 mt-3 text-[10px] font-bold">
                  <span className="px-3 py-1.5 bg-nutri-secondary/40 text-nutri-primaryDark rounded-full border border-nutri-secondary">15 Tahun Pengalaman</span>
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">IDI Member</span>
                </div>
              </div>
              <div className="flex gap-8 mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Biaya Konsultasi</p>
                  <p className="text-sm font-bold text-nutri-primaryDark mt-0.5">Rp 150.000</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Pasien Puas</p>
                  <p className="text-sm font-bold text-nutri-primaryDark mt-0.5">2.4k+</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pendidikan */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-nutri-primaryDark flex items-center gap-2 mb-4">
                <span>🎓</span> Pendidikan
              </h3>
              <ul className="space-y-4">
                <li className="relative pl-4 before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-800 before:absolute before:left-0 before:top-2 before:rounded-full">
                  <p className="text-xs font-bold text-gray-800">Spesialis Anak</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Universitas Indonesia, 2012</p>
                </li>
                <li className="relative pl-4 before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-800 before:absolute before:left-0 before:top-2 before:rounded-full">
                  <p className="text-xs font-bold text-gray-800">Fellowship Nutrisi Pediatrik</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">National University Hospital, Singapore</p>
                </li>
              </ul>
            </div>

            {/* Keahlian */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-nutri-primaryDark flex items-center gap-2 mb-4">
                <span>🩺</span> Keahlian
              </h3>
              <div className="flex flex-wrap gap-2 text-[11px] font-medium text-gray-600">
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">Gizi Buruk</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">Stunting Prevention</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">Alergi Makanan</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">Pola Makan Bayi</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">GDD Screening</span>
              </div>
            </div>
          </div>

          {/* Tentang */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-nutri-primaryDark mb-3">Tentang Dr. Maya</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              "Kesehatan anak dimulai dari nutrisi yang tepat sejak dini. Saya percaya setiap orang tua memiliki peran kunci dalam mendukung tumbuh kembang optimal si kecil. Melalui NutriGrow, saya ingin membantu Anda menavigasi perjalanan ini dengan data dan pendekatan medis yang ramah."
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Jadwal Konsultasi */}
        <aside className="w-full md:w-[350px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex-shrink-0 sticky top-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-nutri-primaryDark">Jadwal Konsultasi</h3>
            <div className="flex gap-2">
              <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400 hover:border-gray-400">&lt;</button>
              <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400 hover:border-gray-400">&gt;</button>
            </div>
          </div>

          {/* Kalender Mini Dummy */}
          <div className="grid grid-cols-7 gap-1 text-center mb-6">
            {['S','M','T','W','T','F','S'].map((day, i) => <div key={i} className="text-[10px] font-bold text-gray-400 pb-2">{day}</div>)}
            <div className="text-xs text-gray-300 py-1">28</div>
            <div className="text-xs text-gray-300 py-1">29</div>
            <div className="text-xs text-gray-300 py-1">30</div>
            <div className="text-xs font-bold text-white bg-amber-800 rounded-full w-7 h-7 flex items-center justify-center mx-auto shadow-sm">1</div>
            <div className="text-xs font-medium text-gray-800 py-1">2</div>
            <div className="text-xs font-medium text-gray-800 py-1">3</div>
            <div className="text-xs font-medium text-gray-800 py-1">4</div>
          </div>

          <div className="mb-6">
            <p className="text-[11px] text-gray-500 font-bold mb-3">Waktu yang tersedia - Kamis, 1 Nov</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
              {times.map((t, idx) => (
                <button 
                  key={idx}
                  disabled={t.status === 'booked'}
                  onClick={() => setSelectedTime(t.time)}
                  className={`py-2 rounded-xl border transition ${
                    t.status === 'booked' ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' :
                    selectedTime === t.time ? 'bg-emerald-700/80 text-white border-emerald-700 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-nutri-primary'
                  }`}
                >
                  {t.time}
                  {t.status === 'booked' && <span className="block text-[9px] mt-0.5">(Booked)</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-100 mb-6 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Sesi Konsultasi (30m)</span>
              <span className="font-bold text-gray-800">Rp 150.000</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Biaya Layanan</span>
              <span className="font-bold text-gray-800">Rp 5.000</span>
            </div>
            <div className="flex justify-between p-3 bg-nutri-secondary/30 rounded-xl mt-2 border border-nutri-secondary/50">
              <span className="font-bold text-nutri-primaryDark">Total Bayar</span>
              <span className="font-bold text-amber-800">Rp 155.000</span>
            </div>
          </div>

          <button 
            onClick={async () => {
                try {
                  const res = await api.post('/consultations', { doctorId });
                  const id = res?.data?.data?.id;
                  if (id) navigate(`/chat/${id}`);
                  else navigate('/chat');
                } catch (err) {
                  console.error('Gagal membuat konsultasi:', err);
                  navigate('/checkout');
                }
              }}
            className="w-full py-3.5 bg-amber-800 hover:bg-opacity-95 text-white font-bold rounded-xl text-xs shadow-md transition"
          >
            Konfirmasi & Bayar Konsultasi
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4 flex justify-center items-center gap-1 font-medium">
            <span>🔒</span> Pembayaran aman & terenkripsi
          </p>

        </aside>

      </div>
    </div>
  );
};

export default DoctorProfile;
