import express from 'express';
import { createProduct, getAllProducts } from '../controllers/productController.js';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// route produk 
router.post('/products', verifyToken, verifyAdmin, createProduct);
router.get('/products', verifyToken, getAllProducts);

// route transaksi belanja
router.post('/checkout', verifyToken, createOrder);

// route riwayat pesanan parent
router.get('/orders/my', verifyToken, getMyOrders);

// route admin/seller: lihat semua pesanan dan update status
router.get('/orders', verifyToken, verifyAdmin, getAllOrders);
router.put('/orders/:orderId/status', verifyToken, updateOrderStatus);

export default router;