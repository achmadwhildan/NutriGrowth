
import express from 'express';
import { getMessages, sendMessage, createConsultation, getMyConsultations, getDoctors, getDoctorById, updateConsultationStatus } from '../controllers/consultationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ambil daftar dokter (public)
router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);

// Buat konsultasi baru
router.post('/', verifyToken, createConsultation);
router.get('/my', verifyToken, getMyConsultations);

// Ambil pesan pada konsultasi tertentu
router.get('/:consultationId/messages', verifyToken, getMessages);

// Kirim pesan pada konsultasi tertentu
router.post('/:consultationId/messages', verifyToken, sendMessage);

// Update status (terima/tolak oleh dokter)
router.put('/:consultationId/status', verifyToken, updateConsultationStatus);

export default router;
