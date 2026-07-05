import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import childRoutes from './routes/childRoutes.js';
import growthRoutes from './routes/growthRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Supaya server bisa membaca data JSON yang dikirim React

// sambungkan api routes
app.use('/api/auth', authRoutes); 
app.use('/api/children', childRoutes);
app.use('/api/growth', growthRoutes); // Rute untuk log perkembangan gizi
app.use('/api/shop', shopRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/consultations', consultationRoutes);

// Cek rute utama (Test Endpoint)
app.get('/', (req, res) => {
    res.json({ message: "Server NutriGrow siap mengudara! 🚀" });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan mulus di http://localhost:${PORT}`);
});