import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Phone, Video, Paperclip, MessageCircle, Check, CheckCheck, FileText, X } from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

interface Message {
    id: string;
    text?: string;
    isMe: boolean;
    time: string;
    status?: 'sent' | 'delivered' | 'read';
    attachmentUrl?: string;
    attachmentType?: string;
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

const ChatInterface: React.FC = () => {
    const { sessionId } = useParams<{ sessionId?: string }>();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string>(sessionId || '');
    const [messagesBySession, setMessagesBySession] = useState<Record<string, Message[]>>({});
    const [loadingSessions, setLoadingSessions] = useState<boolean>(true);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [callType, setCallType] = useState<'video' | 'audio'>('video');

    const startCall = (type: 'video' | 'audio') => {
        setCallType(type);
        setIsCalling(true);
    };

    const endCall = () => {
        setIsCalling(false);
    };
    const auth = useContext(AuthContext);
    const currentUserId = auth?.user?.id;

    const activeSession = sessions.find(s => s.id === activeSessionId);
    const messages = messagesBySession[activeSessionId] || [];

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load sessions from backend
    useEffect(() => {
        const loadSessions = async () => {
            setLoadingSessions(true);
            try {
                // Ensure auth context is loaded
                if (!currentUserId) return;
                
                const res = await api.get('/consultations/my');
                if (res?.data?.data && Array.isArray(res.data.data)) {
                    const list = res.data.data.map((c: any) => ({
                        id: c.id,
                        participantName: c.doctor?.name || 'Dokter',
                        participantRole: c.doctor?.specialization || 'Dokter Spesialis',
                        participantAvatar: c.doctor?.photoUrl,
                        lastMessage: 'Ketuk untuk melihat pesan',
                        unreadCount: 0,
                        isOnline: false
                    }));
                    setSessions(list);

                    if (list.length > 0 && !activeSessionId) {
                        setActiveSessionId(list[0].id);
                    }
                }
            } catch (err) {
                console.error('Gagal memuat sesi konsultasi:', err);
            } finally {
                setLoadingSessions(false);
            }
        };

        loadSessions();
    }, [currentUserId, activeSessionId]);

    // Load messages when active session changes + polling
    useEffect(() => {
        const fetchMessages = async () => {
            if (!activeSessionId) return;
            try {
                const res = await api.get(`/consultations/${activeSessionId}/messages`);
                if (res?.data?.data) {
                    const msgs = res.data.data.map((m: any) => ({
                        id: m.id,
                        text: m.text,
                        isMe: m.senderId === currentUserId,
                        time: new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                        status: m.isRead ? 'read' : 'sent',
                        attachmentUrl: m.attachmentUrl,
                        attachmentType: m.attachmentType
                    })) as Message[];
                    
                    setMessagesBySession(prev => ({ ...prev, [activeSessionId]: msgs }));
                }
            } catch (err) {
                console.error('Gagal memuat pesan konsultasi:', err);
            } finally {
                setLoadingMessages(false);
            }
        };

        if (activeSessionId) {
            setLoadingMessages(true);
            fetchMessages();

            // polling every 5 seconds
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [activeSessionId, currentUserId]);

    // Update URL when active session changes
    useEffect(() => {
        if (activeSessionId && activeSessionId !== sessionId) {
            navigate(`/chat/${activeSessionId}`, { replace: true });
        }
    }, [activeSessionId, navigate, sessionId]);


    // Send message to backend
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !attachment) || !activeSessionId) return;

        let payload: any;
        let headers = {};
        
        if (attachment) {
            payload = new FormData();
            if (newMessage.trim()) payload.append('text', newMessage.trim());
            payload.append('attachment', attachment);
            headers = { 'Content-Type': 'multipart/form-data' };
        } else {
            payload = { text: newMessage.trim() };
        }

        setNewMessage(''); // optimistic clear
        setAttachment(null);
        
        try {
            const res = await api.post(`/consultations/${activeSessionId}/messages`, payload, { headers });
            if (res?.data?.data) {
                const m = res.data.data;
                const msg: Message = {
                    id: m.id,
                    text: m.text,
                    isMe: m.senderId === currentUserId,
                    time: new Date(m.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    status: m.isRead ? 'read' : 'sent',
                    attachmentUrl: m.attachmentUrl,
                    attachmentType: m.attachmentType
                };

                setMessagesBySession(prev => ({ 
                    ...prev, 
                    [activeSessionId]: [...(prev[activeSessionId] || []), msg] 
                }));
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
                    {loadingSessions ? (
                        <div className="p-4 text-center text-sm text-gray-400">Memuat sesi...</div>
                    ) : sessions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-400">Belum ada konsultasi.</div>
                    ) : (
                        sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => setActiveSessionId(session.id)}
                                className={`w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition ${activeSessionId === session.id ? 'bg-nutri-tertiary/40' : ''}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-nutri-primary/20 flex items-center justify-center text-nutri-primaryDark">
                                        <User className="w-6 h-6" />
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
                        ))
                    )}
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
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-nutri-primary/20 flex items-center justify-center text-nutri-primaryDark">
                                    <User className="w-5 h-5" />
                                </div>
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
                        <div className="flex gap-4 text-gray-400">
                            <button 
                                onClick={() => startCall('audio')}
                                title="Panggilan Suara" 
                                className="hover:text-nutri-primaryDark transition"
                            >
                                <Phone className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => startCall('video')}
                                title="Panggilan Video" 
                                className="hover:text-nutri-primaryDark transition"
                            >
                                <Video className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50/30">
                        <div className="space-y-3 flex flex-col">
                            <div className="text-center text-[10px] font-bold text-gray-400 my-2 py-1 px-3 bg-gray-100 rounded-full w-fit mx-auto">
                                Sesi Konsultasi
                            </div>
                            
                            {loadingMessages && messages.length === 0 ? (
                                <div className="text-center text-sm text-gray-400 mt-4">Memuat pesan...</div>
                            ) : messages.length === 0 ? (
                                <div className="text-center text-sm text-gray-400 mt-4">Belum ada pesan, mulai percakapan.</div>
                            ) : (
                                messages.map(m => (
                                    <div key={m.id} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[78%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                                            m.isMe 
                                                ? 'bg-nutri-primary text-white rounded-br-sm' 
                                                : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                                        }`}>
                                            {m.attachmentUrl && (
                                                <div className={`mb-1 ${m.text ? 'pb-2 border-b' : ''} ${m.isMe ? 'border-white/20' : 'border-gray-100'}`}>
                                                    {m.attachmentType === 'image' ? (
                                                        <a href={`http://localhost:5000${m.attachmentUrl}`} target="_blank" rel="noreferrer">
                                                            <img src={`http://localhost:5000${m.attachmentUrl}`} alt="Attachment" className="max-w-[220px] max-h-[220px] rounded object-cover cursor-pointer hover:opacity-90 transition" />
                                                        </a>
                                                    ) : (
                                                        <a href={`http://localhost:5000${m.attachmentUrl}`} target="_blank" rel="noreferrer" className={`flex items-center gap-2 p-2 rounded ${m.isMe ? 'bg-white/20' : 'bg-gray-100'}`}>
                                                            <FileText className="w-5 h-5 flex-shrink-0" />
                                                            <span className="text-sm underline truncate max-w-[150px]">Lihat Dokumen</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                            {m.text && <div className="break-words">{m.text}</div>}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1 px-1">
                                            <span className="text-[10px] text-gray-400">{m.time}</span>
                                            {m.isMe && (
                                                <span className="text-gray-400">
                                                    {m.status === 'read' ? <CheckCheck className="w-3 h-3 text-blue-500 inline" /> : <Check className="w-3 h-3 inline" />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
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
                    <div className="p-4 border-t border-gray-100 bg-white relative">
                        {attachment && (
                            <div className="absolute bottom-full mb-2 left-4 bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-3 shadow-lg z-10">
                                {attachment.type.startsWith('image/') ? (
                                    <img src={URL.createObjectURL(attachment)} alt="preview" className="w-12 h-12 object-cover rounded" />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-gray-500" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{attachment.name}</p>
                                </div>
                                <button type="button" onClick={() => setAttachment(null)} className="text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 rounded-full p-1 transition">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <form onSubmit={sendMessage} className="flex gap-2 items-end relative">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                hidden 
                                accept="image/jpeg,image/png,image/webp,application/pdf" 
                                onChange={(e) => setAttachment(e.target.files?.[0] || null)} 
                            />
                            <button type="button" onClick={() => fileInputRef.current?.click()} title="Lampirkan file" className={`p-3 rounded-xl transition flex-shrink-0 ${attachment ? 'bg-nutri-primary/10 text-nutri-primary' : 'text-gray-400 hover:text-gray-600 bg-gray-50'}`}>
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <textarea
                                rows={1}
                                placeholder="Ketik pesan..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e as any); } }}
                                className="flex-1 px-4 py-3 bg-gray-50 border border-transparent focus:border-nutri-primary focus:bg-white rounded-xl text-sm transition focus:outline-none resize-none"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() && !attachment}
                                className="px-5 py-3 bg-nutri-primary hover:bg-nutri-primaryDark disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition shadow-sm flex-shrink-0"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="hidden md:flex flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm items-center justify-center">
                    <div className="text-center flex flex-col items-center">
                        <div className="mb-4 text-nutri-primary/40">
                            <MessageCircle className="w-16 h-16" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-bold text-gray-700">Pilih percakapan</h3>
                        <p className="text-sm text-gray-400 mt-1">Pilih dokter di sebelah kiri untuk mulai berkonsultasi.</p>
                    </div>
                </div>
            )}

            {/* Call Overlay Modal */}
            {isCalling && (
                <div className="fixed inset-0 z-[100] bg-black animate-fade-in flex flex-col">
                    <div className="p-4 flex justify-between items-center bg-gray-900 text-white">
                        <div>
                            <h3 className="font-bold">{activeSession?.participantName}</h3>
                            <p className="text-xs text-gray-400">NutriGrow Telemedicine</p>
                        </div>
                        <button 
                            onClick={endCall}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition"
                        >
                            Tutup
                        </button>
                    </div>
                    <div className="flex-1">
                        <JitsiMeeting
                            domain="meet.jit.si"
                            roomName={`NutriGrow-Consult-${activeSessionId}`}
                            configOverwrite={{
                                startWithAudioMuted: false,
                                startWithVideoMuted: callType === 'audio',
                                prejoinPageEnabled: false,
                                disableDeepLinking: true,
                            }}
                            interfaceConfigOverwrite={{
                                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                            }}
                            userInfo={{
                                displayName: auth?.user?.name || 'Pasien',
                            }}
                            onApiReady={(externalApi) => {
                                // Event listener if the user clicks "Hangup" inside Jitsi
                                externalApi.addListener('videoConferenceLeft', () => {
                                    endCall();
                                });
                            }}
                            getIFrameRef={(iframeRef) => {
                                iframeRef.style.height = '100%';
                                iframeRef.style.width = '100%';
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
