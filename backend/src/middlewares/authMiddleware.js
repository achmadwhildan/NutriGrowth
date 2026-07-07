import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Ambil token dari header Authorization (Format: Bearer KODE_TOKEN)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Akses ditolak! Anda belum login." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Simpan data user yang terverifikasi ke req.user
        next(); // Lanjut ke middleware atau route handler berikutnya
    } catch (error) {
        res.status(403).json({ message: "Token tidak valid atau sudah kadaluwarsa!" });
    }
}

export const verifyAdmin = (req, res, next) => {
    // Pastikan middleware verifyToken sudah dijalankan sebelumnya
    if (!req.user) {
        return res.status(401).json({ message: "Akses ditolak! Autentikasi diperlukan."})
    }

    // cek apakah rolenya admin 
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Akses ditolak! Fitur ini hanya untuk Admin. ⛔" });
    }

    next();
}

export const verifyAdminOrSeller = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Akses ditolak! Autentikasi diperlukan."})
    }

    if (req.user.role !== 'ADMIN' && req.user.role !== 'SELLER') {
        return res.status(403).json({ message: "Akses ditolak! Fitur ini hanya untuk Admin atau Seller. ⛔" });
    }

    next();
}