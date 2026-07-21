import express from 'express';
import multer from 'multer';
import path from 'path';
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getOrderTracking, uploadPaymentProof } from '../controllers/orderController.js';
import { verifyToken, verifyAdmin, verifyAdminOrSeller } from '../middlewares/authMiddleware.js';

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

// route produk 
router.post('/products', verifyToken, verifyAdminOrSeller, createProduct);
router.get('/products', verifyToken, getAllProducts);
router.put('/products/:id', verifyToken, verifyAdminOrSeller, updateProduct);
router.delete('/products/:id', verifyToken, verifyAdminOrSeller, deleteProduct);

// route transaksi belanja
router.post('/checkout', verifyToken, createOrder);

// route riwayat pesanan parent
router.get('/orders/my', verifyToken, getMyOrders);
router.get('/orders/:orderId/tracking', verifyToken, getOrderTracking);
router.post('/orders/:orderId/payment', verifyToken, upload.single('paymentProof'), uploadPaymentProof);

// route admin/seller: lihat semua pesanan dan update status
router.get('/orders', verifyToken, verifyAdminOrSeller, getAllOrders);
router.put('/orders/:orderId/status', verifyToken, verifyAdminOrSeller, updateOrderStatus);

export default router;