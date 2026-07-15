import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead, createTestNotification } from '../controllers/notificationController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Semua route di bawah ini butuh login
router.use(verifyToken);

router.get('/my', getMyNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.post('/test', createTestNotification); // Untuk ngetest gampang

export default router;
