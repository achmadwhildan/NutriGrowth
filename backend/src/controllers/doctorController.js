import prisma from "../config/prisma.js";

// Ambil jadwal dokter yang sedang login
export const getMySchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const doctor = await prisma.doctor.findUnique({
            where: { userId }
        });

        if (!doctor) {
            return res.status(404).json({ message: "Profil dokter tidak ditemukan." });
        }

        const schedules = await prisma.doctorSchedule.findMany({
            where: { doctorId: doctor.id }
        });

        res.status(200).json({ message: "Jadwal berhasil dimuat.", data: schedules });
    } catch (error) {
        console.error("Error getting schedule:", error);
        res.status(500).json({ message: "Gagal memuat jadwal dokter", error: error.message });
    }
};

// Simpan atau update jadwal
export const updateMySchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        const { schedules } = req.body; // array dari { dayOfWeek, times, isActive }

        const doctor = await prisma.doctor.findUnique({
            where: { userId }
        });

        if (!doctor) {
            return res.status(404).json({ message: "Profil dokter tidak ditemukan." });
        }

        // Gunakan transaksi untuk menyimpan jadwal secara aman
        await prisma.$transaction(async (tx) => {
            // Kita bisa delete semua jadwal lama, lalu insert yang baru
            // atau menggunakan upsert. Untuk kesederhanaan, kita hapus lalu insert.
            await tx.doctorSchedule.deleteMany({
                where: { doctorId: doctor.id }
            });

            const scheduleData = schedules.map(s => ({
                doctorId: doctor.id,
                dayOfWeek: s.dayOfWeek,
                times: s.times || [],
                isActive: s.isActive ?? true
            }));

            if (scheduleData.length > 0) {
                await tx.doctorSchedule.createMany({
                    data: scheduleData
                });
            }
        });

        // Ambil data terbaru untuk dikirim kembali
        const newSchedules = await prisma.doctorSchedule.findMany({
            where: { doctorId: doctor.id }
        });

        res.status(200).json({ message: "Jadwal berhasil diperbarui.", data: newSchedules });
    } catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).json({ message: "Gagal memperbarui jadwal dokter", error: error.message });
    }
};
