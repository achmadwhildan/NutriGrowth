import express from 'express';
import { register, login } from '../controllers/authController.js';
import multer from 'multer';
import path from 'path';

// Konfigurasi penyimpanan multer
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

// Jalur untuk register: POST http://localhost:5000/api/auth/register
router.post('/register', upload.single('document'), register);
router.post('/login', login);

export default router;