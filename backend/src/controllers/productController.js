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
            where: { stock: { gt: 0 } } 
        });       

        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data produk", error: error.message });
    }
};