import express from 'express';
import { 
    getProfile, 
    updateProfile, 
    deleteAccount, 
    adminCreateUser,  
    adminGetAllUsers 
} from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// rute untuk profile parent/ user biasa
router.get('/profile', verifyToken, getProfile);       
router.put('/profile', verifyToken, updateProfile);    
router.delete('/profile', verifyToken, deleteAccount);

// rute khusus admin
router.post('/admin/add-users', verifyToken, verifyAdmin, adminCreateUser);
router.get('/admin/all-users', verifyToken, verifyAdmin, adminGetAllUsers);

export default router;