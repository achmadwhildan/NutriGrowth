import prisma from "../config/prisma.js";

export const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Produk Id dan jumlah beli wajib diisi!" });
        }

        // mengecek ketrsediaan produk 
        const product = await prisma.product.findUnique({ where: {id: productId} });
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan!" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Stok produk tidak mencukupi!" });
        }

        // menghitung total harga
        const totalPrice = product.price * parseInt(quantity);

        // Gunakan prisma transaction untuk membuat order sekaligus memotong stok secara aman
        const result = await prisma.$transaction([
            // simpan data transaksi
            prisma.order.create({
                data: {
                    userId,
                    totalAmount: totalPrice,
                    status: "PENDING",
                    items: {
                        create: [
                            {
                                productId,
                                quantity: parseInt(quantity),
                                priceAtPurchase: product.price
                            }
                        ]
                    }
                }
            }),
            // kurangi stok produk 
            prisma.product.update({
                where: { id: productId },
                data: {stock: product.stock - parseInt(quantity)}
            })
        ]);

        res.status(201).json({ 
            message: "Checkout berhasil! silahkan lakukan pembayaran.",
            data: result[0] // mengambil data order yang di buat
        });
    } catch ( error) {
        res.status(500).json({ message: "Gagal memproses checkout", error: error.message })
    }
}

// Mengambil riwayat pesanan milik user yang login
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: {
                            select: { name: true, imageUrl: true }
                        }
                    }
                }
            }
        });

        res.status(200).json({ message: "Riwayat pesanan berhasil diambil.", data: orders });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil riwayat pesanan", error: error.message });
    }
};

// Mengambil semua pesanan (hanya Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: {
                    include: {
                        product: { select: { name: true, imageUrl: true } }
                    }
                }
            }
        });

        res.status(200).json({ message: "Semua pesanan berhasil diambil.", data: orders });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil semua pesanan", error: error.message });
    }
};

// Update status pesanan (Admin atau Seller)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'PROCESSING', 'DELIVERING', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Status tidak valid. Pilih salah satu: ${validStatuses.join(', ')}` });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        res.status(200).json({ message: `Status pesanan berhasil diubah ke ${status}.`, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Gagal memperbarui status pesanan", error: error.message });
    }
};

// Simulasi real-time tracking resi
export const getOrderTracking = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: "Pesanan tidak ditemukan!" });
        }

        // Mock tracking data based on order status
        const trackingHistory = [];
        const baseDate = order.createdAt.getTime();
        
        trackingHistory.push({
            time: new Date(baseDate).toISOString(),
            description: "Pesanan dibuat",
            status: "PENDING"
        });

        if (order.status !== 'PENDING' && order.status !== 'CANCELLED') {
            trackingHistory.push({
                time: new Date(baseDate + 1000 * 60 * 30).toISOString(), // +30 mins
                description: "Pesanan sedang diproses penjual",
                status: "PROCESSING"
            });
        }

        if (order.status === 'DELIVERING' || order.status === 'COMPLETED') {
            trackingHistory.push({
                time: new Date(baseDate + 1000 * 60 * 60 * 2).toISOString(), // +2 hours
                description: "Paket telah diserahkan ke kurir",
                status: "DELIVERING"
            });
            trackingHistory.push({
                time: new Date(baseDate + 1000 * 60 * 60 * 4).toISOString(), // +4 hours
                description: "Paket sedang dalam perjalanan ke alamat tujuan",
                status: "DELIVERING"
            });
        }

        if (order.status === 'COMPLETED') {
            trackingHistory.push({
                time: new Date(baseDate + 1000 * 60 * 60 * 24).toISOString(), // +1 day
                description: "Paket telah diterima dengan baik",
                status: "COMPLETED"
            });
        }

        // Reverse to show latest first
        trackingHistory.reverse();

        res.status(200).json({
            message: "Berhasil mendapatkan riwayat pelacakan",
            data: trackingHistory
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal mendapatkan pelacakan", error: error.message });
    }
};

// Upload bukti pembayaran
export const uploadPaymentProof = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ message: "Pesanan tidak ditemukan!" });
        }

        if (order.userId !== userId) {
            return res.status(403).json({ message: "Tidak memiliki akses ke pesanan ini" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "File bukti pembayaran wajib diunggah" });
        }

        const paymentProofUrl = `/uploads/${req.file.filename}`;

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { 
                paymentProofUrl,
            }
        });

        res.status(200).json({
            message: "Bukti pembayaran berhasil diunggah",
            data: updatedOrder
        });

    } catch (error) {
        res.status(500).json({ message: "Gagal mengunggah bukti pembayaran", error: error.message });
    }
};