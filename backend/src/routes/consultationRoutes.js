
import express from 'express';
import { getMessages, sendMessage, createConsultation, getMyConsultations, getDoctors } from '../controllers/consultationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ambil daftar dokter (public)
router.get('/doctors', getDoctors);

// Buat konsultasi baru
router.post('/', verifyToken, createConsultation);
router.get('/my', verifyToken, getMyConsultations);

// Ambil pesan pada konsultasi tertentu
router.get('/:consultationId/messages', verifyToken, getMessages);

// Kirim pesan pada konsultasi tertentu
router.post('/:consultationId/messages', verifyToken, sendMessage);

export default router;
