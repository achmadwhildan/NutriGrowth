import express from 'express';
import { addGrowthLog, getGrowthLogs } from '../controllers/growthController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Semua rute wajib menggunakan token login parent
// POST http://localhost:5000/api/growth/add
router.post('/add', verifyToken, addGrowthLog);

// GET http://localhost:5000/api/growth/history/ID_ANAK
router.get('/history/:childId', verifyToken, getGrowthLogs);

export default router;