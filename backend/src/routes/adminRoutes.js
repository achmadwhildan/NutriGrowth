import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';
import { getAdminStats, getPendingVerifications, updateUserVerification } from '../controllers/adminController.js';

const router = express.Router();

// Statistik platform untuk admin dashboard
router.get('/stats', verifyToken, verifyAdmin, getAdminStats);

// Daftar user yang menunggu verifikasi (berdasarkan role)
router.get('/pending/:role', verifyToken, verifyAdmin, getPendingVerifications);

// Approve atau Reject user (dokter / seller)
router.put('/verify/:userId', verifyToken, verifyAdmin, updateUserVerification);

export default router;
