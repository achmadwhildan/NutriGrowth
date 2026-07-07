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