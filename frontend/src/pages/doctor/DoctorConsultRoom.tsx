import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorConsultRoom: React.FC = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState([
        { text: "Halo Bunda, selamat pagi. Ada yang bisa saya bantu terkait tumbuh kembang Aiden?", isMe: true, time: "10:00" },
        { text: "Pagi Dok. Iya ini BB Aiden 2 bulan terakhir kok sepertinya naiknya sedikit sekali ya dok, cuma sekitar 100 gram.", isMe: false, time: "10:02" },
        { text: "Baik, mari kita lihat grafik BB-nya dulu ya Bunda.", isMe: true, time: "10:05" }
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim()) return;
        setMessages([...messages, { text: msg, isMe: true, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
        setMsg('');
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 font-sans">
            
            {/* Kiri: Rekam Medis Singkat */}
            <div className="hidden lg:flex w-[350px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex-col overflow-y-auto">
                <button onClick={() => navigate(-1)} className="text-xs font-bold text-gray-400 hover:text-nutri-primaryDark mb-6 text-left">← Kembali</button>
                
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=150" alt="Pasien" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h2 className="font-extrabold text-gray-800">Aiden Pratama</h2>
                        <p className="text-xs text-gray-500 mt-1">2 Tahun 4 Bulan</p>
                    </div>
                </div>

                <div className="py-6 space-y-4 flex-1">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Data Terakhir (Tracker)</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="text-[10px] text-gray-500 font-medium">Berat</span>
                            <p className="text-sm font-bold text-gray-800">12.5 kg</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="text-[10px] text-gray-500 font-medium">Tinggi</span>
                            <p className="text-sm font-bold text-gray-800">88.2 cm</p>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                        <span className="text-[10px] font-bold text-orange-600 block mb-1">Status Gizi (Sistem)</span>
                        <p className="text-xs font-medium text-orange-800 leading-relaxed">Berat badan hampir stagnan. Perlu evaluasi asupan kalori & protein hewani.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <button className="w-full py-2.5 bg-nutri-tertiary text-nutri-primaryDark font-bold rounded-xl text-xs hover:bg-nutri-primary hover:text-white transition border border-nutri-primary">
                        Buka Riwayat Penuh
                    </button>
                </div>
            </div>

            {/* Kanan: Chat Interface */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-nutri-primary"></div>
                        <span className="text-sm font-bold text-gray-800">Bunda Tya (Ibu Aiden)</span>
                    </div>
                    <div className="flex gap-2 text-xl text-gray-400">
                        <button className="hover:text-nutri-primaryDark transition">📞</button>
                        <button className="hover:text-nutri-primaryDark transition">📹</button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/30">
                    <div className="space-y-4 flex flex-col">
                        <div className="text-center text-[10px] font-bold text-gray-400 my-2">Sesi Konsultasi Dimulai - 10:00 AM</div>
                        
                        {messages.map((m, i) => (
                            <div key={i} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[75%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${m.isMe ? 'bg-nutri-primary text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'}`}>
                                    {m.text}
                                </div>
                                <span className="text-[9px] text-gray-400 font-bold mt-1.5 px-1">{m.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <button type="button" className="p-3 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-xl transition">📎</button>
                        <input 
                            type="text" 
                            placeholder="Ketik pesan konsultasi..." 
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-transparent focus:border-nutri-primary focus:bg-white rounded-xl text-sm transition focus:outline-none"
                        />
                        <button type="submit" className="px-6 py-3 bg-nutri-primary hover:bg-nutri-primaryDark text-white font-bold rounded-xl transition shadow-sm">
                            Kirim
                        </button>
                    </form>
                </div>

            </div>

        </div>
    );
};

export default DoctorConsultRoom;
