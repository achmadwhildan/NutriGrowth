import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// Memastikan environment variable dari file .env terbaca dengan baik
dotenv.config();

// Menginisialisasi adapter PostgreSQL bawaan Prisma 7
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

// Membuat instance PrismaClient dengan menyertakan adapter di dalamnya
const prisma = new PrismaClient({ adapter });

export default prisma;