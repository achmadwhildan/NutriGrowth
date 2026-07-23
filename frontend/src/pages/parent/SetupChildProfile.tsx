import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ArrowRight } from 'lucide-react';

const SetupChildProfile: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Laki-laki');
  const [birthWeight, setBirthWeight] = useState('');
  const [birthHeight, setBirthHeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save and redirect to dashboard
    toast.success('Profil anak berhasil disimpan!');
    navigate('/parent-dashboard');
  };

  return (
    <div className="min-h-screen bg-nutri-neutralBg flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-[2rem] shadow-sm max-w-5xl w-full flex flex-col md:flex-row overflow-hidden border border-gray-100 min-h-[500px]">
        
        {/* Sisi Kiri (Gambar & Info) */}
        <div className="w-full md:w-5/12 bg-emerald-700/80 p-8 flex flex-col relative text-white">
          <div className="flex items-center gap-2 mb-8 z-10">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-emerald-800 text-xs">
              n
            </div>
            <span className="font-bold text-lg">NutriGrow</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-end z-10 space-y-3 pb-4">
            <h2 className="text-3xl font-bold leading-tight">Mari kenali buah<br/>hati Anda</h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed max-w-xs">
              Data ini membantu NutriGrow memberikan panduan nutrisi dan stimulasi yang tepat sasaran.
            </p>
          </div>
          
          {/* Gambar Background (Layer bawah) */}
          <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center pointer-events-none"></div>
        </div>

        {/* Sisi Kanan (Form) */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-nutri-neutralBg/30">
          
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-8 pb-4 border-b border-gray-200">
            <span>Langkah 1 dari 1</span>
            <span>Setup Profil</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 block">Nama Lengkap Anak</label>
              <input 
                type="text" required placeholder="Contoh: Aiden Pratama"
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 block">Tanggal Lahir</label>
                <input 
                  type="date" required
                  value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 block">Jenis Kelamin</label>
                <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1 gap-1">
                  <button type="button" onClick={() => setGender('Laki-laki')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${gender === 'Laki-laki' ? 'bg-white shadow-sm text-nutri-primaryDark' : 'text-gray-400'}`}>Laki-laki</button>
                  <button type="button" onClick={() => setGender('Perempuan')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${gender === 'Perempuan' ? 'bg-white shadow-sm text-nutri-primaryDark' : 'text-gray-400'}`}>Perempuan</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-gray-600 block">Berat Lahir (kg)</label>
                <input 
                  type="number" step="0.1" required placeholder="3.2"
                  value={birthWeight} onChange={(e) => setBirthWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none pr-10"
                />
                <span className="absolute right-4 bottom-3.5 text-xs font-bold text-gray-400">kg</span>
              </div>
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-gray-600 block">Tinggi Lahir (cm)</label>
                <input 
                  type="number" step="0.1" required placeholder="50"
                  value={birthHeight} onChange={(e) => setBirthHeight(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-nutri-primary rounded-xl text-sm transition focus:outline-none pr-10"
                />
                <span className="absolute right-4 bottom-3.5 text-xs font-bold text-gray-400">cm</span>
              </div>
            </div>

            <div className="bg-nutri-secondary/20 border border-nutri-secondary/30 rounded-xl p-4 text-[11px] text-nutri-primaryDark font-medium flex gap-3">
              <Info className="w-5 h-5 flex-shrink-0" />
              <p>Jangan khawatir, Bunda! Anda dapat memperbarui informasi ini kapan saja di menu Pengaturan.</p>
            </div>

            <button type="submit" className="w-full py-4 bg-amber-800 hover:bg-opacity-95 text-white font-bold rounded-xl text-sm shadow-sm transition mt-4 flex justify-center items-center gap-2">
              Simpan & Mulai Pantau <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SetupChildProfile;
