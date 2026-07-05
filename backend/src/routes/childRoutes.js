import express from 'express';
import { addChild, getChildren, updateChild, deletedChild } from '../controllers/childController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; // Impor penjaga gerbang

const router = express.Router();

// Proteksi rute ini menggunakan verifyToken
// POST http://localhost:5000/api/children/add
router.post('/add', verifyToken, addChild);
router.get('/', verifyToken, getChildren);
router.put('/update/:id', verifyToken, updateChild);
router.delete('/delete/:id', verifyToken, deletedChild);

export default router;