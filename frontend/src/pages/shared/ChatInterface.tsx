import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Message {
    id: string;
    text: string;
    isMe: boolean;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
}

interface ChatSession {
    id: string;
    participantName: string;
    participantRole: string;
    participantAvatar?: string;
    lastMessage?: string;
    unreadCount?: number;
    isOnline?: boolean;
}

// Dummy chat sessions for parent - shows list of active consultations
const DUMMY_SESSIONS: ChatSession[] = [
    {
        id: '1',
        participantName: 'Dr. Sarah Amalia, Sp.A',
        participantRole: 'Dokter Spesialis Anak',
        isOnline: true,
        lastMessage: 'Baik Bunda, saya siap membantu.',
        unreadCount: 2,
    },
    {
        id: '2',
        participantName: 'Dr. Budi Santoso, Sp.GK',
        participantRole: 'Dokter Gizi Klinik',
        isOnline: false,
        lastMessage: 'Pemberian MPASI sebaiknya dimulai setelah...',
        unreadCount: 0,
    },
];

// Dummy messages per session
const DUMMY_MESSAGES: Record<string, Message[]> = {
    '1': [
        { id: 'm1', text: 'Halo Bunda, saya Dr. Sarah. Ada yang bisa saya bantu terkait tumbuh kembang si kecil?', isMe: false, time: '10:00', status: 'read' },
        { id: 'm2', text: 'Dok, BB anak saya Aiden usia 2 tahun 4 bulan beratnya cuma 9.5kg, apakah itu normal?', isMe: true, time: '10:02', status: 'read' },
        { id: 'm3', text: 'Baik, saya perlu melihat grafik pertumbuhannya terlebih dahulu. Untuk usia 2 tahun 4 bulan, berat badan normal berkisar antara 10-14 kg. Sebaiknya kita tingkatkan asupan protein hewaninya.', isMe: false, time: '10:05', status: 'read' },
        { id: 'm4', text: 'Baik Bunda, saya siap membantu.', isMe: false, time: '10:06', status: 'read' },
    ],
    '2': [
        { id: 'm1', text: 'Selamat siang Bunda, ada yang bisa dibantu?', isMe: false, time: '09:00', status: 'read' },
        { id: 'm2', text: 'Dok, anak saya susah makan MPASI, bagaimana ya?', isMe: true, time: '09:05', status: 'read' },
        { id: 'm3', text: 'Pemberian MPASI sebaiknya dimulai setelah bayi berusia 6 bulan. Untuk anak yang susah makan, coba variasikan tekstur dan rasa secara bertahap.', isMe: false, time: '09:10', status: 'read' },
    ],
};

const ChatInterface: React.FC = () => {
    const { sessionId } = useParams<{ sessionId?: string }>();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const [sessions, setSessions] = useState<ChatSession[]>(DUMMY_SESSIONS);
    const [activeSessionId, setActiveSessionId] = useState<string>(sessionId || DUMMY_SESSIONS[0]?.id);
    const [messagesBySession, setMessagesBySession] = useState<Record<string, Message[]>>(DUMMY_MESSAGES);
    const [loadingSessions, setLoadingSessions] = useState<boolean>(false);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const auth = useContext(AuthContext);
    const currentUserId = auth?.user?.id;

    const activeSession = sessions.find(s => s.id === activeSessionId);
    const messages = messagesBySession[activeSessionId] || [];

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Try to load consultations/sessions from backend; fallback to dummy if not available
    useEffect(() => {
        const loadSessions = async () => {
            setLoadingSessions(true);
            try {
                let res = null;
                try {
                    res = await api.get('/consultations/my');
                } catch (err) {
                    try { res = await api.get('/consultations'); } catch (e) { res = null; }
                }

                if (res && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
                    const list = res.data.data.map((c: any) => ({
                        id: c.id,
                        participantName: c.doctor?.name || c.participantName || 'Dokter',
                        participantRole: c.doctor?.specialization || 'Dokter',
                        participantAvatar: c.doctor?.photoUrl,
                        lastMessage: c.lastMessage || '',
                        unreadCount: c.unreadCount || 0,
                        isOnline: false
                    }));
                    setSessions(list);

                    // initialize empty message arrays for each session (backend chat not implemented yet)
                    const msgs: Record<string, Message[]> = {};
                    list.forEach((s: any) => { msgs[s.id] = msgs[s.id] || []; });
                    setMessagesBySession(prev => ({ ...prev, ...msgs }));
                    setActiveSessionId(sessionId || list[0]?.id);
                }
            } catch (err) {
                console.error('Gagal memuat sesi konsultasi:', err);
            } finally {
                setLoadingSessions(false);
            }
        };

        loadSessions();
    }, []);

    // Load messages when active session changes
    useEffect(() => {
        const loadMessages = async () => {
            if (!activeSessionId) return;
            setLoadingMessages(true);
            try {
                const res = await api.get(`/consultations/${activeSessionId}/messages`);
                if (res?.data?.data) {
                    const msgs = res.data.data.map((m: any) => ({
                        id: m.id,
                        text: m.text,
                        isMe: m.senderId === currentUserId,
                        time: new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        status: m.isRead ? 'read' : 'sent'
                    })) as Message[];
                    setMessagesBySession(prev => ({ ...prev, [activeSessionId]: msgs }));
                }
            } catch (err) {
                console.error('Gagal memuat pesan konsultasi:', err);
            } finally {
                setLoadingMessages(false);
            }
        };

        loadMessages();
    }, [activeSessionId, currentUserId]);

    // Send message to backend
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeSessionId) return;

        const payload = { text: newMessage.trim() };
        try {
            const res = await api.post(`/consultations/${activeSessionId}/messages`, payload);
            if (res?.data?.data) {
                const m = res.data.data;
                const msg: Message = {
                    id: m.id,
                    text: m.text,
                    isMe: m.senderId === currentUserId,
                    time: new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    status: m.isRead ? 'read' : 'sent'
                };

                setMessagesBySession(prev => ({ ...prev, [activeSessionId]: [...(prev[activeSessionId] || []), msg] }));
                setNewMessage('');
            }
        } catch (err) {
            console.error('Gagal mengirim pesan:', err);
            alert('Gagal mengirim pesan. Coba lagi.');
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-0 md:gap-4 font-sans">
            
            {/* Left: Session List */}
            <div className={`w-full md:w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden ${activeSessionId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">Konsultasi Aktif</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Percakapan dengan dokter Anda</p>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {sessions.map(session => (
                        <button
                            key={session.id}
                            onClick={() => setActiveSessionId(session.id)}
                            className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition ${activeSessionId === session.id ? 'bg-nutri-tertiary/40' : ''}`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-nutri-primary/20 flex items-center justify-center text-lg">
                                    👨‍⚕️
                                </div>
                                {session.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-gray-900 truncate">{session.participantName}</span>
                                    {session.unreadCount ? (
                                        <span className="w-5 h-5 bg-nutri-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                            {session.unreadCount}
                                        </span>
                                    ) : null}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">{session.participantRole}</p>
                                {session.lastMessage && (
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{session.lastMessage}</p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Chat Window */}
            {activeSession ? (
                <div className={`flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden ${activeSessionId ? 'flex' : 'hidden md:flex'}`}>
                    
                    {/* Chat Header */}
                    <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <button 
                                className="md:hidden p-1 text-gray-400 hover:text-gray-700 mr-1"
                                onClick={() => setActiveSessionId('')}
                            >
                                ←
                            </button>
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-nutri-primary/20 flex items-center justify-center">👨‍⚕️</div>
                                {activeSession.isOnline && (
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{activeSession.participantName}</p>
                                <p className="text-xs text-gray-400">
                                    {isTyping ? (
                                        <span className="text-nutri-primary animate-pulse">Sedang mengetik...</span>
                                    ) : activeSession.isOnline ? (
                                        <span className="text-green-500">Online</span>
                                    ) : (
                                        'Offline'
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 text-gray-400">
                            <button title="Panggilan Suara" className="p-2 hover:text-nutri-primaryDark hover:bg-gray-100 rounded-lg transition text-lg">📞</button>
                            <button title="Panggilan Video" className="p-2 hover:text-nutri-primaryDark hover:bg-gray-100 rounded-lg transition text-lg">📹</button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50/30">
                        <div className="space-y-3 flex flex-col">
                            <div className="text-center text-[10px] font-bold text-gray-400 my-2 py-1 px-3 bg-gray-100 rounded-full w-fit mx-auto">
                                Hari ini
                            </div>
                            {messages.map(m => (
                                <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[78%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                                        m.isMe 
                                            ? 'bg-nutri-primary text-white rounded-br-sm' 
                                            : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                                    }`}>
                                        {m.text}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[10px] text-gray-400">{m.time}</span>
                                        {m.isMe && (
                                            <span className="text-[10px] text-gray-400">
                                                {m.status === 'read' ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start">
                                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-3.5 shadow-sm">
                                        <div className="flex gap-1 items-center">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-100 bg-white">
                        <form onSubmit={sendMessage} className="flex gap-2 items-end">
                            <button type="button" title="Lampirkan file" className="p-3 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-xl transition flex-shrink-0">📎</button>
                            <textarea
                                rows={1}
                                placeholder="Ketik pesan konsultasi..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e as any); } }}
                                className="flex-1 px-4 py-3 bg-gray-50 border border-transparent focus:border-nutri-primary focus:bg-white rounded-xl text-sm transition focus:outline-none resize-none"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="px-5 py-3 bg-nutri-primary hover:bg-nutri-primaryDark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-sm flex-shrink-0"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm items-center justify-center">
                    <div className="text-center">
                        <div className="text-5xl mb-3">💬</div>
                        <h3 className="font-bold text-gray-700">Pilih percakapan</h3>
                        <p className="text-sm text-gray-400 mt-1">Pilih dokter di sebelah kiri untuk mulai berkonsultasi.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
