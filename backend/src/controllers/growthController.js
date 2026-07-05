import prisma from '../config/prisma.js';

export const addGrowthLog = async (req, res) => {
    try {
        const { childId, weight, height, headCircumference, note } = req.body;
        const userId = req.user.id; // Ambil userId dari token yang sudah diverifikasi

        // validasi input wajib
        if (!childId || !weight || !height) {
            return res.status(400).json({ message: "ID Anak, berat, dan tinggi wajib diisi!" });
        }

        // pastikan anak tersebut memiliki orang tua yang sedang login 
        const child = await prisma.child.findUnique({ where: { id: childId } });
        if (!child || child.userId !== userId) {
            return res.status(404).json({ message: "Data anak tidak ditemukan atau akses ditolak!" });
        }

        // logika kalkulator status gizi sederhana (contoh rasio bb/tb)
        // ditahap produksi, ini bisa dicocokan dengan table standar Z-score WHO
        const ratio = parseFloat(weight) / (parseFloat(height) / 100);
        let zScoreStatus = "NORMAL";

        if (ratio < 12) {
            zScoreStatus = "STUNTING"; //Kurang gizi / Kurus
        } else if (ratio > 22) {
            zScoreStatus = "RISK"; //Kelebihan berat badan / Gemuk
        }

        // simpan log gizi ke database
        const newLog = await prisma.growthLog.create({
            data: {
                childId,
                weight: parseFloat(weight),
                height: parseFloat(height),
                headCircumference: headCircumference ? parseFloat(headCircumference) : null,
                zScoreStatus,
                note,
            }
        });

        res.status(201).json({
            message: "Catatan perkembangan gizi berhasil disimpan! 📊",
            data: newLog
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal menyimpan log gizi", error: error.message });
    }
};

// fungsi untuk melihat riwayat perkembangan gizi si anak
export const getGrowthLogs = async (req, res) => {
    try {
        const { childId } = req.params;
        
        const history = await prisma.growthLog.findMany({
            where: { childId },
            orderBy: { createdAt: 'desc' } // menampilkan dari bulan terbaru
        });

        res.status(200).json({
            message: "Berhasil mengambil riwayat perkembangan anak",
            data: history,
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil riwayat gizi", error: error.message });
    }
}