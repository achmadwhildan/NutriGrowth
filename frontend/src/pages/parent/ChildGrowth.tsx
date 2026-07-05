import React, { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// data dummy riwayat pertumbuhan untuk grafik (Bulan 12 s/d bulan 27)
const growthData = [
    { name: '12 Bln', Aiden: 8.5, WHOIdeal: 9.2 },
    { name: '15 Bln', Aiden: 9.1, WHOIdeal: 9.8 },
    { name: '18 Bln', Aiden: 9.5, WHOIdeal: 10.5 },
    { name: '21 Bln', Aiden: 10.2, WHOIdeal: 11.2 },
    { name: '24 Bln', Aiden: 11.8, WHOIdeal: 12.0 },
    { name: '27 Bln', Aiden: 12.5, WHOIdeal: 12.7 },
];

// data dummy untuk list riwayat input di bawah grafik
const historyLogs = [
    { id: 1, date: '24 Mei 2024', weight: '12.5 kg', height: '88.2 cm', status: 'Bulan ini naik 0.5kg!', statusColor: 'bg-green-50 text-green-700' },
  { id: 2, date: '24 April 2024', weight: '12.0 kg', height: '87.5 cm', status: 'Pertumbuhan Stabil', statusColor: 'bg-nutri-tertiary text-nutri-primaryDark' },
  { id: 3, date: '24 Maret 2024', weight: '11.8 kg', height: '87.0 cm', status: 'Hampir Ideal! Tetap semangat', statusColor: 'bg-orange-50 text-orange-600' },
];

const ChildGrowth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'berat' | 'tinggi'>('berat');

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
            <h4 className="text-sm font-bold text-nutri-primaryDark">Aiden</h4>
            <p className="text-[11px] text-gray-400 font-medium">2 Tahun 4 Bulan</p>
          </div>
        </div>

        {/* Menu Navigasi Mini */}
        <div className="space-y-1 text-xs font-bold">
          <button className="w-full flex items-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 rounded-xl">
            <span>🔄</span> Profile Switcher
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition">
            <span>➕</span> Add Entry
          </button>
        </div>

        <button className="w-full py-3 bg-amber-800 hover:bg-opacity-95 text-white text-xs font-bold rounded-xl shadow-sm transition">
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
              <h2 className="text-xl font-extrabold text-nutri-primaryDark">Perkembangan Aiden</h2>
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
                <Line type="monotone" dataKey="Aiden" stroke="#374151" strokeWidth={3} dot={{ r: 4, fill: '#374151' }} activeDot={{ r: 6 }} name="Aiden" />
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
            <a href="#" className="text-xs font-bold text-gray-400 hover:text-nutri-primary transition">Lihat Semua →</a>
          </div>

          {/* List Kartu Riwayat */}
          <div className="space-y-3">
            {historyLogs.map((log) => (
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

    </div>
  );
};

export default ChildGrowth;