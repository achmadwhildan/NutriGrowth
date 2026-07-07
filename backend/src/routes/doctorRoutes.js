import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getMySchedule, updateMySchedule } from '../controllers/doctorController.js';

const router = express.Router();

// Middleware verifikasi khusus dokter (optional, verifyToken minimal memastikannya login)
const verifyDoctor = (req, res, next) => {
    if (req.user.role !== 'DOCTOR') {
        return res.status(403).json({ message: "Akses ditolak. Hanya untuk Dokter." });
    }
    next();
};

// Mendapatkan jadwal dokter yang sedang login
router.get('/schedule', verifyToken, verifyDoctor, getMySchedule);

// Memperbarui jadwal dokter yang sedang login
router.put('/schedule', verifyToken, verifyDoctor, updateMySchedule);

export default router;
