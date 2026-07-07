import prisma from "../config/prisma.js";

// Statistik platform untuk admin dashboard
export const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalDoctors, totalSellers, totalParents, orders] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'DOCTOR' } }),
            prisma.user.count({ where: { role: 'SELLER' } }),
            prisma.user.count({ where: { role: 'PARENT' } }),
            prisma.order.findMany({ where: { status: 'COMPLETED' } }),
        ]);

        // Hitung total pendapatan platform (asumsi komisi 10% dari setiap pesanan selesai)
        const COMMISSION_RATE = 0.1;
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
        const platformRevenue = totalRevenue * COMMISSION_RATE;

        res.status(200).json({
            message: "Statistik admin berhasil dimuat.",
            data: {
                totalUsers,
                totalDoctors,
                totalSellers,
                totalParents,
                totalCompletedOrders: orders.length,
                totalRevenue,
                platformRevenue,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal memuat statistik admin", error: error.message });
    }
};

// Ambil user yang menunggu verifikasi berdasarkan role (DOCTOR atau SELLER)
export const getPendingVerifications = async (req, res) => {
    try {
        const { role } = req.params;
        const validRoles = ['DOCTOR', 'SELLER'];
        
        if (!validRoles.includes(role.toUpperCase())) {
            return res.status(400).json({ message: "Role tidak valid. Pilih DOCTOR atau SELLER." });
        }

        const pendingUsers = await prisma.user.findMany({
            where: {
                role: role.toUpperCase(),
                isVerified: false, // Asumsi ada field isVerified di model User
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                documentUrl: true,
                createdAt: true,
                role: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        res.status(200).json({ message: "Data verifikasi berhasil dimuat.", data: pendingUsers });
    } catch (error) {
        res.status(500).json({ message: "Gagal memuat data verifikasi", error: error.message });
    }
};

// Update status verifikasi user (approve atau reject)
export const updateUserVerification = async (req, res) => {
    try {
        const { userId } = req.params;
        const { action } = req.body; // 'approve' atau 'reject'

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ message: "Aksi tidak valid. Gunakan 'approve' atau 'reject'." });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                isVerified: action === 'approve',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isVerified: true,
            }
        });

        const actionText = action === 'approve' ? 'disetujui' : 'ditolak';
        res.status(200).json({ 
            message: `User ${updatedUser.name} berhasil ${actionText}.`,
            data: updatedUser 
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui status verifikasi", error: error.message });
    }
};
