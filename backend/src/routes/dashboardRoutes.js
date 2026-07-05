import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Endpoint: GET http://localhost:5000/api/dashboard
router.get('/', verifyToken, getDashboardStats);

export default router;