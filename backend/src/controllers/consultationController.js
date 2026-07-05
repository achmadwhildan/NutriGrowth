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

        if (!text || !text.trim()) return res.status(400).json({ message: 'Pesan tidak boleh kosong' });

        const consultation = await prisma.consultation.findUnique({ where: { id: consultationId }, include: { doctor: true } });
        if (!consultation) return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });

        const isParticipant = req.user.role === 'ADMIN' || req.user.id === consultation.userId || (req.user.role === 'DOCTOR' && consultation.doctor?.userId === req.user.id);
        if (!isParticipant) return res.status(403).json({ message: 'Akses ditolak: bukan peserta konsultasi' });

        const newMsg = await prisma.chatMessage.create({
            data: {
                consultationId,
                senderId: req.user.id,
                senderRole: req.user.role,
                text: text.trim(),
            }
        });

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

        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
        if (!doctor) return res.status(404).json({ message: 'Dokter tidak ditemukan' });

        const consult = await prisma.consultation.create({
            data: {
                userId,
                doctorId,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
                status: 'PENDING'
            }
        });

        res.status(201).json({ message: 'Konsultasi dibuat', data: consult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat konsultasi', error: error.message });
    }
};

// Ambil daftar konsultasi milik user
export const getMyConsultations = async (req, res) => {
    try {
        const userId = req.user.id;
        const consults = await prisma.consultation.findMany({ where: { userId }, include: { doctor: true }, orderBy: { createdAt: 'desc' } });
        res.status(200).json({ message: 'Berhasil mengambil konsultasi', data: consults });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil konsultasi', error: error.message });
    }
};

// Ambil daftar dokter aktif (untuk marketplace)
export const getDoctors = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({ where: { isActive: true } });
        res.status(200).json({ message: 'Berhasil mengambil daftar dokter', data: doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil dokter', error: error.message });
    }
};

export default { getMessages, sendMessage };
