import prisma from '../config/prisma.js';

export const addChild = async (req, res) => {
    try {
        const { name, gender, birthDate, birthWeight, birthHeight } = req.body;

        const userId = req.user.id; // Ambil userId dari token yang sudah diverifikasi

        // 1. Validasi input sederhana
        if (!name || !gender || !birthDate || !birthWeight || !birthHeight) {
            return res.status(400).json({ message: "Semua data anak wajib diisi!" });
        }

        // 2. Simpan data anak ke PostgreSQL via Prisma
        const newChild = await prisma.child.create({
            data: {
                userId,
                name,
                gender,
                birthDate: new Date(birthDate), // Pastikan formatnya ISO Date
                birthWeight: parseFloat(birthWeight),
                birthHeight: parseFloat(birthHeight),
            },
        });

        res.status(201).json({
            message: "Data anak berhasil ditambahkan! 👶",
            data: newChild,
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan data anak", error: error.message });
    }
}

export const getChildren = async (req, res) => {
    try {
        const userId = req.user.id; 

        const children = await prisma.child.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }, //  urutkan berdasarkan tanggal pembuatan terbaru
        });

        res.status(200).json({
            message: "Berhasil mengambil data anak! 👶",
            data: children,
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data anak", error: error.message });
    }
}

export const updateChild = async (req, res) => {
    try {
        const { id } = req.params; // mengambil id anak dari url parameter
        console.log("DEBUG - ID dari params:", id); // ✅ Debug
        console.log("DEBUG - req.params:", req.params); // ✅ Debug
        console.log("DEBUG - req.body:", req.body); // ✅ Debug
        const { name, gender, birthDate, birthWeight, birthHeight } = req.body;
        const userId = req.user.id; // Ambil userId dari token yang sudah diverifikasi
        console.log("DEBUG - userId:", userId); // ✅ Debug

        const child = await prisma.child.findUnique({ where: { id } });
        if (!child || child.userId !== userId) {
            return res.status(404).json({ message: "Data anak tidak ditemukan atau Anda tidak memiliki akses!" });
        }

        const updatedChild = await prisma.child.update({
            where: { id },
            data: {
                name,
                gender,
                birthDate: birthDate ? new Date(birthDate) : undefined, // Update hanya jika ada data baru
                birthWeight: birthWeight ? parseFloat(birthWeight) : undefined,
                birthHeight: birthHeight ? parseFloat(birthHeight) : undefined,
            }
        });

        res.status(200).json({
            message: "Data anak berhasil diperbarui! 👶",
            data: updatedChild,
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui data anak", error: error.message });
    }
}

export const deletedChild = async (req, res) => {
    try {
        const { id } = req.params; // mengambil id anak dari url parameter
        const userId = req.user.id; // Ambil userId dari token yang sudah diverifikasi

        // Pastikan anak tersebut memang miliki paerent yang sedang login
        const child = await prisma.child.findUnique({ where: { id } });
        if (!child || child.userId !== userId) {
            return res.status(404).json({ message: "Data anak tidak ditemukan atau Anda tidak memiliki akses!" });
        }

        await prisma.child.delete({ where: { id } });

        res.status(200).json({
            message: "Data anak berhasil dihapus! 👶",
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus data anak", error: error.message });
    }
}