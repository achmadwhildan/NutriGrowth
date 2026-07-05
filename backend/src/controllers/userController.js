import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

// mengambil data profil user yang sedang login
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                address: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "Pengguna tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data profile berhasil diambil!",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data profile", error: error.message
        });
    }
};

// memperbarui data profile 
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phoneNumber, address } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phoneNumber,
                address
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                address: true,
                role: true,
            },
        });

        res.status(200).json({
            message: "Profile berhasil diperbarui!",
            data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal memperbarui data profile", error: error.message
        });
    }
};

// menghapus akun pengguna 
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        await prisma.user.delete({
            where: { id: userId },
        });

        res.status(200).json({
            message: "Akun Anda berhasil dihapus secara permanen dari sistem NutriGrow. 🗑️",
        });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus akun", error: error.message });
    }
};

// membuat/ menambahkan user baru secara manual
export const adminCreateUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, address, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Nama, email, dan password wajib diisi!"
            });
        }

        const emailExists = await prisma.user.findUnique({ where: { email } });
        if (emailExists) {
            return res.status(400).json({
                message: "Email sudah terdaftar!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                address,
                role: role || 'PARENT' // Jika role tidak diisi, otomatis jadi PARENT
            }
        });

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({ message: "User baru berhasil dibuat oleh Admin!", data: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan user", error: error.message })
    }
};

// mengambil data semua user (hanya admin)
export const adminGetAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        res.status(200).json({ data: users });
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user", error: error.message })
    }
};