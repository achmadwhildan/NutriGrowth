import prisma from "../config/prisma.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        // jika yang login adalah admin
        if (userRole === 'ADMIN'){
            const totalUsers = await prisma.user.count();
            const totalChildren = await prisma.child.count();
            const totalProducts = await prisma.product.count();
            
            // menghitung total pendapatan dari pesanan toko yang sukses (Asumsi)
            const orders = await prisma.order.findMany();
            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);  

            res.status(200).json({
                stats: {
                    totalUsers,
                    totalChildren,
                    totalProducts,
                    totalOrders,
                    totalRevenue,
                }, 
            });
        }

        // jika yang login adalah parent/user biasa
        if (userRole === 'PARENT') {
            const myChildrenCount = await prisma.child.count({
                where: { userId }
            });

            return res.status(200).json({
                message: "Statistik Dashboard Parent Berhasil Dimuat",
                data: {
                    role: userRole,
                    totalMyChildren: myChildrenCount,
                    note: "Selamat datang kembali! jangan lupa catat gizi buah hati Anda bulan ini."
                }
            });
        }

        // jika yang login adalah seller
        if (userRole === 'SELLER') {
            const totalProducts = await prisma.product.count();
            const orders = await prisma.order.findMany();
            
            // asumsi pendapatan seller sama dengan admin (jika single vendor)
            const totalRevenue = orders
                .filter(o => o.status !== 'CANCELLED')
                .reduce((sum, order) => sum + Number(order.totalAmount), 0);
            
            const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
            const processingOrders = orders.filter(o => o.status === 'PROCESSING').length;

            return res.status(200).json({
                stats: {
                    totalRevenue,
                    pendingOrders,
                    processingOrders,
                    totalProducts,
                }
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Gagal memuat statistik dashboard", error: error.message });
    }
}