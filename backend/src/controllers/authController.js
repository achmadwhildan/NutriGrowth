import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, address } = req.body;

        // Validasi input sederhana
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Nama, email, dan password wajib diisi!" });
        }

        //Cek apakah email sudah terdaftar
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan!" });
        }

        // Enkripsi password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan user baru ke PostgreSQL via Prisma
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                address,
                role: 'PARENT' // Default role untuk pendaftaran umum
            }
        });

        // Berikan respon sukses (tanpa menyertakan password)
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json({
            message: "Registrasi berhasil! 🎉",
            data: userWithoutPassword
        });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing. Set 'Content-Type: application/json' and send a JSON body." });
        }

        // validasi input sederhana
        if (!email || !password) {
            return res.status(400).json({ message: "Email dan password wajib diisi!" });
        } 

        // cari user berdasrkan email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Email atau Password Salah!" });
        }

        // cocokan password yang diinput dengan yang ada di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Email atau Password Salah!" });
        }

        // membuat token JWT berlaku selama 1 hari
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // kirim respon sukses beserta tokennya
        const {password: _, ...userWithoutPassword} = user;
        res.status(200).json({
            message: "Login berhasil! 🎉",
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
}