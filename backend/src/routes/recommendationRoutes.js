import express from 'express';
import { getRecommendation } from '../controllers/recommendationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Endpoint: GET http://localhost:5000/api/recommendation?status=STUNTING
router.get('/', verifyToken, getRecommendation);

export default router;