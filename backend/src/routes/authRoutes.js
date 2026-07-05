import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Jalur untuk register: POST http://localhost:5000/api/auth/register
router.post('/register', register);
router.post('/login', login);

export default router;