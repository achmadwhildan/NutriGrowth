
import express from 'express';
import multer from 'multer';
import path from 'path';
import { getMessages, sendMessage, createConsultation, getMyConsultations, getDoctors, getDoctorById, updateConsultationStatus } from '../controllers/consultationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

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
router.post('/:consultationId/messages', verifyToken, upload.single('attachment'), sendMessage);

// Update status (terima/tolak oleh dokter)
router.put('/:consultationId/status', verifyToken, updateConsultationStatus);

export default router;
