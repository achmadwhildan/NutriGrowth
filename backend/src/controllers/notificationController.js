import prisma from '../config/prisma.js';

// Ambil notifikasi milik user
export const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit to 50
        });
        res.json({ success: true, data: notifications });
    } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
        res.status(500).json({ success: false, message: 'Gagal memuat notifikasi' });
    }
};

// Tandai 1 notifikasi dibaca
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
        res.json({ success: true, data: notification });
    } catch (error) {
        console.error("Gagal update notifikasi:", error);
        res.status(500).json({ success: false, message: 'Gagal update notifikasi' });
    }
};

// Tandai semua notifikasi dibaca
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
        res.json({ success: true, message: 'Semua notifikasi ditandai dibaca' });
    } catch (error) {
        console.error("Gagal update semua notifikasi:", error);
        res.status(500).json({ success: false, message: 'Gagal update notifikasi' });
    }
};

// ENDPOINT PERCOBAAN: Buat notifikasi dummy untuk user yang login
export const createTestNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const notification = await prisma.notification.create({
            data: {
                userId,
                title: 'Percobaan Berhasil',
                message: 'Ini adalah notifikasi percobaan Anda!',
                type: 'success',
                link: ''
            }
        });
        res.json({ success: true, data: notification });
    } catch (error) {
        console.error("Gagal membuat notifikasi dummy:", error);
        res.status(500).json({ success: false, message: 'Gagal membuat notifikasi percobaan' });
    }
};
