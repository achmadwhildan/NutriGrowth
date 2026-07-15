import React, { useState, FormEvent, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Register: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState<string>('PARENT');
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');
        
        try {
            // siapkan data (FormData jika ada file)
            let dataToSend: any;
            
            if (role === 'DOCTOR' || role === 'SELLER') {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('role', role);
                if (documentFile) {
                    formData.append('document', documentFile);
                }
                dataToSend = formData;
            } else {
                dataToSend = { name, email, password, role };
            }

            // tembak endpoint auth register
            const response = await api.post('/auth/register', dataToSend, {
                headers: dataToSend instanceof FormData 
                    ? { 'Content-Type': 'multipart/form-data' } 
                    : undefined
            });

            if (response.data.needsVerification) {
                alert(response.data.message);
                navigate('/login');
            } else if (response.data.token && auth) {
                // simpan ke state global context 
                auth.login(response.data.token, response.data.user);

                // arahkan user masuk ke dalam dashboard utama jika sukses
                navigate('/');
                alert(`Pendaftaran berhasil! Selamat datang, ${response.data.user.name}!`);
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Pendaftaran gagal. Periksa kembali data anda atau coba lagi nanti.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-nutri-tertiary/30">
            <div className="bg-white rounded-3xl shadow-xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden">

                {/* SISI KIRI: Gambar Ilustrasi */}
                <div className="md:w-1/2 bg-nutri-primary/20 p-12 flex flex-col justify-between relative min-h-[350px] md:min-h-[500px]">
                    <div className="flex items-center gap-2 text-nutri-primaryDark font-bold text-2xl">
                        <img src="/logo.png" alt="Logo" className="h-8 w-auto" /> NutriGrow
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-nutri-primaryDark leading-tight mb-2">
                            Mulai Perjalanan Anda
                        </h2>
                        <p className="text-sm text-nutri-neutralText/80">
                            Bergabunglah bersama ribuan orang tua lainnya dalam memantau tumbuh kembang si kecil dengan lebih baik.
                        </p>
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-nutri-primary/30 rounded-full blur-xl"></div>
                </div>

                {/* SISI KANAN: Form Input Register */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex gap-6 mb-8 border-b border-gray-100 text-lg">
                        <Link to="/login" className="text-gray-400 hover:text-nutri-primary pb-2 transition">
                            Masuk
                        </Link>
                        <Link to="/register" className="border-b-2 border-nutri-primary font-semibold text-nutri-primaryDark pb-2">
                            Daftar
                        </Link>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                placeholder="Nama Anda"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-nutri-primary bg-nutri-neutralBg/50 transition text-sm"
                                required
                            />
                        </div>

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
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Kata Sandi
                            </label>
                            <input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-nutri-primary bg-nutri-neutralBg/50 transition text-sm"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Daftar Sebagai
                            </label>
                            <select
                                value={role}
                                onChange={(e) => { setRole(e.target.value); setDocumentFile(null); }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-nutri-primary bg-nutri-neutralBg/50 transition text-sm text-gray-700"
                            >
                                <option value="PARENT">Orang Tua / Pasien</option>
                                <option value="DOCTOR">Dokter Spesialis</option>
                                <option value="SELLER">Mitra Katering</option>
                            </select>
                        </div>

                        {(role === 'DOCTOR' || role === 'SELLER') && (
                            <div className="animate-fade-in">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Unggah Dokumen Pendukung (STR/SIP/Izin Usaha)
                                </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setDocumentFile(e.target.files[0]);
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-nutri-primary bg-amber-50 transition text-sm"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Unggah file berupa gambar (JPG/PNG) atau PDF. Wajib diisi.
                                </p>
                            </div>
                        )}

                        {/* Pesan Error */}
                        {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 bg-nutri-primaryDark text-white font-semibold rounded-xl shadow-md hover:bg-opacity-90 active:scale-[0.99] transition duration-150 text-sm mt-4"
                        >
                            Buat Akun Sekarang
                        </button>
                    </form>

                    <div className="relative my-6 text-center text-xs text-gray-400 uppercase tracking-wider">
                        <span className="bg-white px-3 relative z-10">Atau daftar dengan</span>
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

export default Register;
