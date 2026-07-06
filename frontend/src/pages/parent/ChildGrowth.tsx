import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../../services/api';
import { Child } from '../../types';

interface GrowthLog {
    id: string;
    weight: number;
    height: number;
    zScoreStatus: string;
    createdAt: string;
}

const ChildGrowth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'berat' | 'tinggi'>('berat');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [logs, setLogs] = useState<GrowthLog[]>([]);
  
  const [heightInput, setHeightInput] = useState('');
  const [weightInput, setWeightInput] = useState('');

  // Fetch data anak
  useEffect(() => {
    const loadChildren = async () => {
        try {
            const res = await api.get('/children');
            const list: Child[] = res.data.data || [];
            if (list.length > 0) {
                setActiveChild(list[0]);
            }
        } catch (err) {
            console.error('Gagal memuat profil anak:', err);
        }
    };
    loadChildren();
  }, []);

  // Fetch riwayat gizi jika ada activeChild
  useEffect(() => {
    const loadGrowth = async () => {
        if (!activeChild) return;
        try {
            const res = await api.get(`/growth/history/${activeChild.id}`);
            setLogs(res.data.data || []);
        } catch (err) {
            console.error('Gagal memuat riwayat gizi:', err);
        }
    };
    loadGrowth();
  }, [activeChild]);

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
          // Reload the page to refetch everything
          window.location.reload();
      } catch (error) {
          console.error('Gagal menyimpan data:', error);
          alert('Terjadi kesalahan saat menyimpan data.');
      }
  };

  const getStatusDisplay = (status: string) => {
      switch (status) {
          case 'STUNTING': return { text: 'Perlu Optimasi / Kurang Gizi', color: 'bg-red-50 text-red-600' };
          case 'RISK': return { text: 'Beresiko Obesitas', color: 'bg-orange-50 text-orange-600' };
          default: return { text: 'Pertumbuhan Normal', color: 'bg-green-50 text-green-700' };
      }
  };

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const formatMonth = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
  };

  // Convert logs to chart format (oldest first)
  const growthData = [...logs].reverse().map(log => ({
      name: formatMonth(log.createdAt),
      Aiden: activeTab === 'berat' ? log.weight : log.height,
      WHOIdeal: activeTab === 'berat' ? (log.weight * 1.1).toFixed(1) : (log.height * 1.05).toFixed(1) // dummy WHO ideal line based on value
  }));

  const historyLogs = logs.map(log => {
      const statusDisplay = getStatusDisplay(log.zScoreStatus);
      return {
          id: log.id,
          date: formatDate(log.createdAt),
          weight: `${log.weight} kg`,
          height: `${log.height} cm`,
          status: statusDisplay.text,
          statusColor: statusDisplay.color
      };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6 items-start font-sans">
      
      {/* ================= SIDEBAR KIRI ================= */}
      <aside className="w-full md:w-64 bg-white rounded-3xl border border-gray-100 p-4 flex flex-col gap-4 shadow-sm">
        {/* Info Anak */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=100" alt="Avatar Aiden" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-nutri-primaryDark">{activeChild?.name || 'Anak'}</h4>
            <p className="text-[11px] text-gray-400 font-medium">{activeChild?.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
          </div>
        </div>

        {/* Menu Navigasi Mini */}
        <div className="space-y-1 text-xs font-bold">
          <button 
            onClick={() => alert("Fitur Profile Switcher untuk banyak anak sedang dalam pengembangan 🚀")}
            className="w-full flex items-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 rounded-xl"
          >
            <span>🔄</span> Profile Switcher
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition"
          >
            <span>➕</span> Add Entry
          </button>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 bg-amber-800 hover:bg-opacity-95 text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          Timbang Sekarang
        </button>

        {/* Kotak Quotes Edukasi Hijau */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50 text-[11px] text-emerald-800 leading-relaxed font-medium mt-4">
          "Nutrisi yang cukup di masa emas membantu perkembangan otak Aiden menjadi lebih optimal."
        </div>
      </aside>

      {/* ================= KONTEN UTAMA KANAN ================= */}
      <main className="flex-1 w-full space-y-6">
        
        {/* CARD UTAMA GRAFIK */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
          
          {/* Header Grafik & Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-nutri-primaryDark">Perkembangan {activeChild?.name || 'Anak'}</h2>
              <p className="text-xs text-gray-400">Grafik Tinggi & Berat Badan (WHO Standard)</p>
            </div>
            
            {/* Toggle Berat / Tinggi */}
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1 text-[11px] font-bold text-gray-500">
              <button 
                onClick={() => setActiveTab('berat')}
                className={`px-4 py-2 rounded-lg transition ${activeTab === 'berat' ? 'bg-white text-nutri-primaryDark shadow-sm' : 'hover:text-nutri-primaryDark'}`}
              >
                Berat
              </button>
              <button 
                onClick={() => setActiveTab('tinggi')}
                className={`px-4 py-2 rounded-lg transition ${activeTab === 'tinggi' ? 'bg-white text-nutri-primaryDark shadow-sm' : 'hover:text-nutri-primaryDark'}`}
              >
                Tinggi
              </button>
            </div>
          </div>

          {/* Area Chart Recharts */}
          <div className="w-full h-72 md:h-80 relative">
            {/* Badge Trend Positif */}
            <span className="absolute top-0 right-0 bg-orange-50 text-orange-600 font-extrabold text-[10px] px-3 py-1 rounded-full border border-orange-100/40 z-10">
              Trend Positif
            </span>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#4B5563', paddingTop: '15px' }} />
                
                {/* Garis Data Aiden */}
                <Line type="monotone" dataKey="Aiden" stroke="#374151" strokeWidth={3} dot={{ r: 4, fill: '#374151' }} activeDot={{ r: 6 }} name={activeChild?.name || "Anak"} />
                {/* Garis Putus-putus Standar WHO */}
                <Line type="monotone" dataKey="WHOIdeal" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} name="WHO Ideal" />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* SECTION RIWAYAT INPUT */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-nutri-primaryDark">Riwayat Input</h3>
            <button 
                onClick={() => alert("Seluruh riwayat sudah ditampilkan di daftar bagian bawah ini 📜")}
                className="text-xs font-bold text-gray-400 hover:text-nutri-primary transition"
            >
                Lihat Semua →
            </button>
          </div>

          {/* List Kartu Riwayat */}
          <div className="space-y-3">
            {historyLogs.length === 0 ? (
                <div className="text-sm text-gray-500 py-4">Belum ada riwayat pengukuran. Silakan timbang sekarang.</div>
            ) : historyLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:border-gray-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-sm border border-gray-100">
                    📉
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-nutri-primaryDark">{log.date}</h4>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {log.weight} &bull; {log.height}
                    </p>
                  </div>
                </div>
                
                <span className={`w-fit text-[10px] font-extrabold px-3 py-1.5 rounded-full ${log.statusColor}`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* MODAL TAMBAH DATA / TIMBANG */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl relative animate-fade-in">
                  <button 
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition"
                  >
                      ✕
                  </button>
                  <h3 className="text-xl font-bold text-nutri-primaryDark mb-1">Timbang Sekarang</h3>
                  <p className="text-xs text-gray-500 mb-6">Masukkan data tinggi dan berat badan terbaru {activeChild?.name || 'anak'}.</p>
                  
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
    </div>
  );
};

export default ChildGrowth;