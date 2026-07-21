import prisma from "../config/prisma.js";

// tambah produk (biasanya di akses oleh Admin)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, imageUrl } = req.body;

        if (!name || !price || stock === undefined || !category) {
            return res.status(400).json({ message: "Nama, harga, stok, dan kategori wajib diisi!" });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                category,
                imageUrl
            }
        });

        res.status(201).json({ message: "Produk berhasil ditambahkan! 🍏", data: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambah produk", error: error.message });
    }
};

// menemapilkan semua produk (biasanya diakses oleh semua user yang login)
export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });       

        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data produk", error: error.message });
    }
};

// update produk
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category, imageUrl } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                stock: stock !== undefined ? parseInt(stock) : undefined,
                category,
                imageUrl
            }
        });

        res.status(200).json({ message: "Produk berhasil diubah!", data: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengubah produk", error: error.message });
    }
};

// hapus produk
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id }
        });

        res.status(200).json({ message: "Produk berhasil dihapus!" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus produk", error: error.message });
    }
};