import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, Video, Paperclip, Baby, MicOff, PhoneOff, VideoOff, User } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Message {
    id: string;
    text: string;
    isMe: boolean;
    time: string;
}

const DoctorConsultRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [patientInfo, setPatientInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCalling, setIsCalling] = useState(false);
    const [callType, setCallType] = useState<'video' | 'audio'>('video');
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const startCall = async (type: 'video' | 'audio') => {
        setCallType(type);
        setIsCalling(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
            setMediaStream(stream);
            setTimeout(() => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (err) {
            console.error("Gagal mengakses kamera/mic:", err);
        }
    };

    const endCall = () => {
        setIsCalling(false);
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    };
    const auth = useContext(AuthContext);
    const currentUserId = auth?.user?.id;

    // Fetch Consultation info & Messages
    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                // Get patient info from my consultations
                const consultsRes = await api.get('/consultations/my');
                if (consultsRes?.data?.data) {
                    const consult = consultsRes.data.data.find((c: any) => c.id === id);
                    if (consult) {
                        setPatientInfo(consult.user);
                    }
                }

                // Get messages
                const msgRes = await api.get(`/consultations/${id}/messages`);
                if (msgRes?.data?.data) {
                    const formattedMsgs = msgRes.data.data.map((m: any) => ({
                        id: m.id,
                        text: m.text,
                        isMe: m.senderId === currentUserId,
                        time: new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                    }));
                    setMessages(formattedMsgs);
                }
            } catch (err) {
                console.error('Error fetching chat room data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        
        // Simple polling for new messages every 5 seconds
        const interval = setInterval(() => {
            if (id) {
                api.get(`/consultations/${id}/messages`).then(res => {
                    if (res?.data?.data) {
                        const formattedMsgs = res.data.data.map((m: any) => ({
                            id: m.id,
                            text: m.text,
                            isMe: m.senderId === currentUserId,
                            time: new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                        }));
                        setMessages(formattedMsgs);
                    }
                }).catch(e => console.error(e));
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [id, currentUserId]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!msg.trim() || !id) return;
        
        const text = msg.trim();
        setMsg(''); // clear input early for UX

        try {
            const res = await api.post(`/consultations/${id}/messages`, { text });
            if (res?.data?.data) {
                const m = res.data.data;
                const newMsg: Message = {
                    id: m.id,
                    text: m.text,
                    isMe: m.senderId === currentUserId,
                    time: new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, newMsg]);
            }
        } catch (err) {
            console.error('Gagal mengirim pesan:', err);
            alert('Gagal mengirim pesan.');
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 font-sans">
            
            {/* Kiri: Rekam Medis Singkat */}
            <div className="hidden lg:flex w-[350px] bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex-col overflow-y-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-xs font-bold text-gray-400 hover:text-nutri-primaryDark mb-6 text-left">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                </button>
                
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
                        <Baby className="w-8 h-8 text-nutri-primary" />
                    </div>
                    <div>
                        <h2 className="font-extrabold text-gray-800">{patientInfo?.name || 'Nama Pasien'}</h2>
                        <p className="text-xs text-gray-500 mt-1">Data Profil Anak</p>
                    </div>
                </div>

                <div className="py-6 space-y-4 flex-1">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Data Terakhir (Tracker)</h3>
                    
                    {patientInfo?.children && patientInfo.children.length > 0 ? (
                        patientInfo.children.map((child: any) => {
                            const latestLog = child.growthLogs && child.growthLogs.length > 0 ? child.growthLogs[0] : null;
                            return (
                                <div key={child.id} className="mb-4">
                                    <h4 className="text-xs font-bold text-gray-700 mb-2">Anak: {child.name}</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-[10px] text-gray-500 font-medium">Berat</span>
                                            <p className="text-sm font-bold text-gray-800">{latestLog ? `${latestLog.weight} kg` : '-'}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-[10px] text-gray-500 font-medium">Tinggi</span>
                                            <p className="text-sm font-bold text-gray-800">{latestLog ? `${latestLog.height} cm` : '-'}</p>
                                        </div>
                                    </div>
                                    {!latestLog && (
                                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl mt-3">
                                            <p className="text-xs text-gray-500">Belum ada data pertumbuhan untuk anak ini.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                            <p className="text-xs text-gray-500">Belum ada data anak yang terdaftar.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Kanan: Chat Interface */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-sm font-bold text-gray-800">{patientInfo?.name || 'Pasien'}</span>
                    </div>
                    <div className="flex gap-4 text-gray-400">
                        <button onClick={() => startCall('audio')} title="Panggilan Suara" className="hover:text-nutri-primaryDark transition">
                            <Phone className="w-5 h-5" />
                        </button>
                        <button onClick={() => startCall('video')} title="Panggilan Video" className="hover:text-nutri-primaryDark transition">
                            <Video className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/30">
                    <div className="space-y-4 flex flex-col">
                        <div className="text-center text-[10px] font-bold text-gray-400 my-2">Sesi Konsultasi Aktif</div>
                        
                        {loading ? (
                            <div className="text-center text-sm text-gray-400">Memuat pesan...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-sm text-gray-400">Belum ada pesan. Mulai sapa pasien Anda.</div>
                        ) : (
                            messages.map((m) => (
                                <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[75%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${m.isMe ? 'bg-nutri-primary text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'}`}>
                                        {m.text}
                                    </div>
                                    <span className="text-[9px] text-gray-400 font-bold mt-1.5 px-1">{m.time}</span>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <form onSubmit={handleSend} className="flex gap-2 items-end">
                        <button type="button" className="p-3 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-xl transition flex-shrink-0">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <textarea 
                            rows={1}
                            placeholder="Ketik pesan..." 
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any); } }}
                            className="flex-1 px-4 py-3 bg-gray-50 border border-transparent focus:border-nutri-primary focus:bg-white rounded-xl text-sm transition focus:outline-none resize-none"
                        />
                        <button type="submit" disabled={!msg.trim()} className="px-6 py-3 bg-nutri-primary hover:bg-nutri-primaryDark disabled:opacity-50 text-white font-bold rounded-xl transition shadow-sm flex-shrink-0">
                            Kirim
                        </button>
                    </form>
                </div>

            </div>

            {/* Call Overlay Modal */}
            {isCalling && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative flex flex-col min-h-[500px] border border-gray-800">
                        
                        {/* Mock Video Background */}
                        {callType === 'video' && (
                            <div className="absolute inset-0 z-0">
                                <img 
                                    src={"https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600"} 
                                    alt="Patient" 
                                    className="w-full h-full object-cover opacity-60" 
                                />
                                <div className="absolute bottom-4 right-4 w-28 h-36 bg-gray-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg">
                                    {/* Mock self video */}
                                    {mediaStream && callType === 'video' ? (
                                        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white/50">
                                            <User className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Audio Background */}
                        {callType === 'audio' && (
                             <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-gray-800">
                                <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center shadow-2xl relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-nutri-primary animate-ping opacity-20"></div>
                                    <User className="w-16 h-16 text-gray-400" />
                                </div>
                             </div>
                        )}

                        {/* Top Bar */}
                        <div className="relative z-10 p-6 flex flex-col items-center justify-center flex-1">
                            <h3 className="text-white font-bold text-xl drop-shadow-md">{patientInfo?.name || 'Pasien'}</h3>
                            <p className="text-white/70 text-sm font-medium mt-1 mb-8 drop-shadow-md">
                                {callType === 'video' ? 'Video Call...' : 'Panggilan Suara...'}
                            </p>
                            <div className="text-white/60 text-sm bg-black/30 px-4 py-1.5 rounded-full backdrop-blur-md">
                                Menghubungkan
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="relative z-10 p-8 flex justify-center items-center gap-6 bg-gradient-to-t from-black/80 to-transparent pt-12">
                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition">
                                <MicOff className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={endCall}
                                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition shadow-lg shadow-red-500/30"
                            >
                                <PhoneOff className="w-7 h-7" />
                            </button>
                            {callType === 'video' && (
                                <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition">
                                    <VideoOff className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DoctorConsultRoom;
