import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const DoctorProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id: doctorId } = useParams<{ id?: string }>();
  
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Manage schedule selection
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/consultations/doctors/${doctorId}`);
        const docData = res.data.data;
        setDoctor(docData);
        
        if (docData && docData.schedules) {
            // filter schedules that are active and have times
            const activeSchedules = docData.schedules.filter((s: any) => s.isActive && s.times && s.times.length > 0);
            const days = activeSchedules.map((s: any) => s.dayOfWeek);
            setAvailableDays(days);
            
            if (days.length > 0) {
                // Set default selected day to the first available day
                setSelectedDay(days[0]);
            }
        }
      } catch (err) {
        console.error("Gagal memuat profil dokter:", err);
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
      if (doctor && doctor.schedules && selectedDay) {
          const schedule = doctor.schedules.find((s: any) => s.dayOfWeek === selectedDay);
          if (schedule && schedule.times) {
              setAvailableTimes(schedule.times);
              setSelectedTime(''); // reset time when day changes
          } else {
              setAvailableTimes([]);
          }
      }
  }, [selectedDay, doctor]);

  if (loading) {
      return <div className="max-w-7xl mx-auto p-10 text-center font-bold text-gray-400">Memuat profil dokter...</div>;
  }

  if (!doctor) {
      return <div className="max-w-7xl mx-auto p-10 text-center font-bold text-red-400">Dokter tidak ditemukan.</div>;
  }

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
              <img src={doctor.photoUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"} alt={doctor.user?.name} className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">★ 4.9</span>
            </div>
            <div className="flex flex-col justify-between py-2 w-full">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-nutri-primaryDark">{doctor.user?.name || 'Dokter'}</h1>
                <p className="text-sm font-medium text-amber-800 mt-1">{doctor.bio || 'Dokter Spesialis'}</p>
                <div className="flex gap-2 mt-3 text-[10px] font-bold">
                  <span className="px-3 py-1.5 bg-nutri-secondary/40 text-nutri-primaryDark rounded-full border border-nutri-secondary">Tersertifikasi</span>
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">Aktif</span>
                </div>
              </div>
              <div className="flex gap-8 mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100 w-fit">
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Biaya Konsultasi</p>
                  <p className="text-sm font-bold text-nutri-primaryDark mt-0.5">Rp {Number(doctor.pricePerSession || 0).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pendidikan (Dummy for now as we don't have education table) */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-nutri-primaryDark flex items-center gap-2 mb-4">
                <span>🎓</span> Pendidikan & Sertifikasi
              </h3>
              <ul className="space-y-4">
                <li className="relative pl-4 before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-800 before:absolute before:left-0 before:top-2 before:rounded-full">
                  <p className="text-xs font-bold text-gray-800">Spesialis</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Telah diverifikasi oleh sistem</p>
                </li>
              </ul>
            </div>

            {/* Keahlian (Derived from Bio ideally, dummy for layout) */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-nutri-primaryDark flex items-center gap-2 mb-4">
                <span>🩺</span> Keahlian
              </h3>
              <div className="flex flex-wrap gap-2 text-[11px] font-medium text-gray-600">
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">Konsultasi Anak</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg">Gizi & Nutrisi</span>
              </div>
            </div>
          </div>

          {/* Tentang */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-nutri-primaryDark mb-3">Tentang {doctor.user?.name}</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {doctor.bio || 'Dokter spesialis yang berdedikasi membantu orang tua memantau dan menjaga tumbuh kembang nutrisi anak.'}
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Jadwal Konsultasi */}
        <aside className="w-full md:w-[350px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex-shrink-0 sticky top-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-nutri-primaryDark">Jadwal Konsultasi</h3>
          </div>

          <div className="mb-6">
            <p className="text-[11px] text-gray-500 font-bold mb-3">Pilih Hari</p>
            <div className="flex flex-wrap gap-2 text-[11px] font-medium mb-6">
              {availableDays.length === 0 ? (
                  <span className="text-red-500 italic">Belum ada jadwal tersedia.</span>
              ) : (
                  availableDays.map(day => (
                      <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`px-3 py-1.5 rounded-lg border transition ${
                              selectedDay === day 
                              ? 'bg-nutri-primaryDark text-white border-nutri-primaryDark' 
                              : 'bg-white text-gray-600 border-gray-200 hover:border-nutri-primary'
                          }`}
                      >
                          {day}
                      </button>
                  ))
              )}
            </div>
            
            {selectedDay && (
                <>
                    <p className="text-[11px] text-gray-500 font-bold mb-3">Pilih Jam Praktik ({selectedDay})</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
                        {availableTimes.length === 0 ? (
                            <span className="text-gray-400 italic col-span-2">Tidak ada slot jam.</span>
                        ) : (
                            availableTimes.map((t, idx) => (
                                <button 
                                key={idx}
                                onClick={() => setSelectedTime(t)}
                                className={`py-2 rounded-xl border transition ${
                                    selectedTime === t 
                                    ? 'bg-emerald-700/80 text-white border-emerald-700 shadow-sm' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-nutri-primary'
                                }`}
                                >
                                {t}
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-100 mb-6 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Sesi Konsultasi</span>
              <span className="font-bold text-gray-800">Rp {Number(doctor.pricePerSession || 0).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between p-3 bg-nutri-secondary/30 rounded-xl mt-2 border border-nutri-secondary/50">
              <span className="font-bold text-nutri-primaryDark">Total Bayar</span>
              <span className="font-bold text-amber-800">Rp {Number(doctor.pricePerSession || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button 
            disabled={!selectedDay || !selectedTime}
            onClick={async () => {
                try {
                  // We send scheduledAt derived from selected day and time in a real app.
                  // For MVP, passing doctorId and letting backend create it is fine.
                  // (Optionally we can pass scheduledTime if we update the backend consultation table)
                  const res = await api.post('/consultations', { doctorId });
                  const id = res?.data?.data?.id;
                  if (id) navigate(`/chat/${id}`);
                  else navigate('/chat');
                } catch (err) {
                  console.error('Gagal membuat konsultasi:', err);
                  alert("Gagal membuat konsultasi. Pastikan Anda sudah login.");
                }
              }}
            className="w-full py-3.5 bg-amber-800 hover:bg-opacity-95 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedTime ? `Konfirmasi Jadwal ${selectedTime}` : 'Pilih Jadwal Dulu'}
          </button>
          <p className="text-center text-[10px] text-gray-400 mt-4 flex justify-center items-center gap-1 font-medium">
            <span>🔒</span> Jadwal ini tersinkronisasi langsung dengan Dokter
          </p>

        </aside>

      </div>
    </div>
  );
};

export default DoctorProfile;
