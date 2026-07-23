import prisma from '../config/prisma.js';

// Ambil semua pesan untuk satu konsultasi
export const getMessages = async (req, res) => {
    try {
        const { consultationId } = req.params;

        const consultation = await prisma.consultation.findUnique({ where: { id: consultationId }, include: { doctor: true } });
        if (!consultation) return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });

        const isParticipant = req.user.role === 'ADMIN' || req.user.id === consultation.userId || (req.user.role === 'DOCTOR' && consultation.doctor?.userId === req.user.id);
        if (!isParticipant) return res.status(403).json({ message: 'Akses ditolak: bukan peserta konsultasi' });

        const messages = await prisma.chatMessage.findMany({ where: { consultationId }, orderBy: { createdAt: 'asc' } });

        res.status(200).json({ message: 'Berhasil mengambil pesan', data: messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil pesan konsultasi', error: error.message });
    }
};

// Kirim pesan pada konsultasi
export const sendMessage = async (req, res) => {
    try {
        const { consultationId } = req.params;
        const { text } = req.body || {};

        let attachmentUrl = null;
        let attachmentType = null;
        
        if (req.file) {
            attachmentUrl = `/uploads/${req.file.filename}`;
            const mimetype = req.file.mimetype;
            attachmentType = mimetype.startsWith('image/') ? 'image' : 'document';
        }

        if ((!text || !text.trim()) && !attachmentUrl) {
            return res.status(400).json({ message: 'Pesan atau lampiran tidak boleh kosong' });
        }

        const consultation = await prisma.consultation.findUnique({ where: { id: consultationId }, include: { doctor: true } });
        if (!consultation) return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });

        const isParticipant = req.user.role === 'ADMIN' || req.user.id === consultation.userId || (req.user.role === 'DOCTOR' && consultation.doctor?.userId === req.user.id);
        if (!isParticipant) return res.status(403).json({ message: 'Akses ditolak: bukan peserta konsultasi' });

        const newMsg = await prisma.chatMessage.create({
            data: {
                consultationId,
                senderId: req.user.id,
                senderRole: req.user.role,
                text: text ? text.trim() : null,
                attachmentUrl,
                attachmentType
            }
        });

        // Tentukan penerima pesan untuk notifikasi
        const recipientId = req.user.id === consultation.userId ? consultation.doctor?.userId : consultation.userId;
        
        if (recipientId) {
            await prisma.notification.create({
                data: {
                    userId: recipientId,
                    title: 'Pesan Baru',
                    message: 'Anda menerima pesan baru pada sesi konsultasi.',
                    type: 'info',
                    link: req.user.id === consultation.userId ? `/doctor/consult/${consultationId}` : `/chat/${consultationId}`
                }
            });
        }

        res.status(201).json({ message: 'Pesan terkirim', data: newMsg });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
    }
};

// Buat konsultasi baru (parent membuat permintaan ke dokter)
export const createConsultation = async (req, res) => {
    try {
        const { doctorId, scheduledAt } = req.body || {};
        const userId = req.user.id;

        if (!doctorId) return res.status(400).json({ message: 'doctorId diperlukan' });
        if (!scheduledAt) return res.status(400).json({ message: 'scheduledAt diperlukan untuk mencegah jadwal bentrok' });

        const parsedDate = new Date(scheduledAt);
        const existingConsultation = await prisma.consultation.findFirst({
            where: {
                doctorId: doctorId,
                scheduledAt: parsedDate,
                status: { not: 'CANCELLED' }
            }
        });

        if (existingConsultation) {
            return res.status(409).json({ message: 'Maaf, jadwal pada jam tersebut sudah dibooking. Silakan pilih jam lain.' });
        }

        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) return res.status(404).json({ message: 'Dokter tidak ditemukan' });

        const consult = await prisma.consultation.create({
            data: {
                userId,
                doctorId,
                scheduledAt: parsedDate,
                status: 'PENDING'
            }
        });

        res.status(201).json({ message: 'Konsultasi dibuat', data: consult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat konsultasi', error: error.message });
    }
};

// Ambil daftar konsultasi milik user atau dokter
export const getMyConsultations = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        
        let consults = [];
        if (role === 'DOCTOR') {
            const doctor = await prisma.doctor.findUnique({ where: { userId } });
            if (!doctor) return res.status(404).json({ message: 'Profil dokter tidak ditemukan' });
            
            consults = await prisma.consultation.findMany({ 
                where: { doctorId: doctor.id }, 
                include: { 
                    user: {
                        include: {
                            children: {
                                include: {
                                    growthLogs: { orderBy: { measurementDate: 'desc' } }
                                }
                            }
                        }
                    }, 
                    doctor: true 
                }, 
                orderBy: { createdAt: 'desc' } 
            });
        } else {
            consults = await prisma.consultation.findMany({ 
                where: { userId }, 
                include: { doctor: true }, 
                orderBy: { createdAt: 'desc' } 
            });
        }
        
        res.status(200).json({ message: 'Berhasil mengambil konsultasi', data: consults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil konsultasi', error: error.message });
    }
};

// Ambil daftar dokter aktif (untuk marketplace)
export const getDoctors = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({ 
            where: { isActive: true },
            include: { user: true }
        });
        
        // Map data agar nama dan email ter-include
        const mappedDoctors = doctors.map(d => ({
            id: d.id,
            userId: d.userId,
            name: d.user?.name || 'Dokter',
            specialization: d.bio || 'Dokter Spesialis',
            pricePerSession: d.pricePerSession,
            photoUrl: d.photoUrl,
            isActive: d.isActive
        }));

        res.status(200).json({ message: 'Berhasil mengambil daftar dokter', data: mappedDoctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil dokter', error: error.message });
    }
};

// Ambil detail dokter berdasarkan ID
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await prisma.doctor.findUnique({
            where: { id },
            include: { 
                user: { select: { name: true, email: true } },
                schedules: true,
                consultations: {
                    select: { scheduledAt: true, status: true },
                    where: { status: { not: 'CANCELLED' } }
                }
            }
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Dokter tidak ditemukan' });
        }

        res.status(200).json({ message: 'Berhasil mengambil detail dokter', data: doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil detail dokter', error: error.message });
    }
};

// Update status konsultasi (oleh dokter)
export const updateConsultationStatus = async (req, res) => {
    try {
        const { consultationId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        
        if (req.user.role !== 'DOCTOR') {
            return res.status(403).json({ message: 'Akses ditolak: hanya dokter' });
        }

        const doctor = await prisma.doctor.findUnique({ where: { userId } });
        const consult = await prisma.consultation.findUnique({ where: { id: consultationId } });
        
        if (!doctor || !consult || consult.doctorId !== doctor.id) {
            return res.status(404).json({ message: 'Konsultasi tidak ditemukan / bukan hak Anda' });
        }

        const updated = await prisma.consultation.update({
            where: { id: consultationId },
            data: { status }
        });

        res.status(200).json({ message: 'Status berhasil diperbarui', data: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui status', error: error.message });
    }
};

export default { getMessages, sendMessage, createConsultation, getMyConsultations, getDoctors, getDoctorById, updateConsultationStatus };
