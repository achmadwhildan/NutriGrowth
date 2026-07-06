import React, { useState, FormEvent, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User } from '../types';

const getDashboardPath = (role: User['role']) => {
    switch (role) {
        case 'ADMIN':
            return '/admin';
        case 'DOCTOR':
            return '/doctor';
        case 'SELLER':
            return '/seller';
        case 'PARENT':
        default:
            return '/parent-dashboard';
    }
};

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string>('');

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.token && auth.user) {
            navigate(getDashboardPath(auth.user.role), { replace: true });
        }
    }, [auth?.token, auth?.user, navigate]);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');
        
        try {
            // tembak endpoint auth login
            const response = await api.post('/auth/login', { email, password });

            if (response.data.token && auth) {
                auth.login(response.data.token, response.data.user);
                navigate(getDashboardPath(response.data.user.role));
                alert(`Selamat datang kembali, ${response.data.user.name}!`);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Gagal terhubung ke server. Periksa kembali akun anda');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-nutri-tertiary/30">
            <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">

                {/* SISI KIRI: Gambar Ilustrasi (Sesuai mockup Screenshot 2026-06-17 183257.png) */}
                <div className="md:w-1/2 bg-nutri-primary/20 p-12 flex flex-col justify-between relative min-h-[350px] md:min-h-[500px]">
                    <div className="flex items-center gap-2 text-nutri-primaryDark font-bold text-2xl">
                        <img src="/src/assets/images/logo.png" alt="Logo" className="h-8 w-auto" /> NutriGrow
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-nutri-primaryDark leading-tight mb-2">
                            Supportive Nurturing
                        </h2>
                        <p className="text-sm text-nutri-neutralText/80">
                            Pendampingan tumbuh kembang anak untuk setiap langkah pertumbuhan buah hati Anda.
                        </p>
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-nutri-primary/30 rounded-full blur-xl"></div>
                </div>

                {/* SISI KANAN: Form Input Login */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex gap-6 mb-8 border-b border-gray-100 text-lg">
                        <Link to="/login" className="border-b-2 border-nutri-primary font-semibold text-nutri-primaryDark pb-2">
                            Masuk
                        </Link>
                        <Link to="/register" className="text-gray-400 hover:text-nutri-primary pb-2 transition">
                            Daftar
                        </Link>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                placeholder="nama@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-nutri-primary bg-nutri-neutralBg/50 transition text-sm"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Kata Sandi
                                </label>
                                <a href="#" className="text-xs text-nutri-secondary font-medium hover:underline">
                                    Lupa Kata Sandi?
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-nutri-primary bg-nutri-neutralBg/50 transition text-sm"
                                required
                            />
                        </div>

                        {/* Pesan Error */}
                        {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-nutri-primaryDark text-white font-semibold rounded-xl shadow-md hover:bg-opacity-90 active:scale-[0.99] transition duration-150 text-sm mt-2"
                        >
                            Masuk Sekarang
                        </button>
                    </form>

                    <div className="relative my-6 text-center text-xs text-gray-400 uppercase tracking-wider">
                        <span className="bg-white px-3 relative z-10">Atau masuk dengan</span>
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-100 -z-0"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-xs font-medium hover:bg-gray-50 transition">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-xs font-medium hover:bg-gray-50 transition">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4" alt="Facebook" />
                            Facebook
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;