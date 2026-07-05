import React from "react";

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-nutri-neutralBg flex flex-col font-sans">

            {/* 1. NAVBAR / HEADER */}
            <header className="w-full max-w-7xl mx-auto px-6 py-5 flex justify-between items-center bg-white md:bg-transparent">
                <div className="text-2xl font-bold text-nutri-primaryDark flex items-center gap-2">
                    <img src="/src/assets/images/logo.png" alt="Logo" className="h-8 w-auto" /> NutriGrow
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-medium text-nutri-neutralText/80">
                    <a href="#" className="border-b-2 border-nutri-primary text-nutri-primaryDark pb-1">Dashboard</a>
                    <a href="#" className="hover:text-nutri-primary transition pb-1">Tracker</a>
                    <a href="#" className="hover:text-nutri-primary transition pb-1">Shop</a>
                    <a href="#" className="hover:text-nutri-primary transition pb-1">Consult</a>
                </nav>
                <div className="flex items-center gap-4">
                    <a href="/login" className="text-sm font-bold text-nutri-primaryDark hover:text-nutri-primary transition">Masuk</a>
                    <a href="/login" className="px-4 py-2 bg-nutri-primaryDark text-white text-sm font-bold rounded-xl shadow-sm hover:bg-opacity-90 transition">Daftar</a>
                </div>
            </header>

            {/* 2. HERO SECTION */}
            <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 flex flex-col items-center text-center relative w-full">
                <h1 className="text-4xl md:text-5xl font-extrabold text-nutri-primaryDark tracking-tight max-w-3xl leading-tight mb-4">
                    Tumbuh Sehat, Ibu Tenang.
                </h1>
                <p className="text-sm md:text-base text-gray-500 max-w-2xl mb-8 leading-relaxed">
                    Pendamping resmi perjalanan tumbuh kembang si Kecil. Dan pelacakan nutrisi cerdas hingga rekomendasi MPASI terbaik untuk setiap tahap usianya.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mb-16">
                    <button className="px-6 py-3 bg-nutri-primaryDark text-white font-semibold rounded-xl shadow-md hover:bg-opacity-90 transition text-sm">
                        Mulai Tracking Gratis
                    </button>
                    <button className="px-6 py-3 border border-gray-200 bg-white text-nutri-primaryDark font-semibold rounded-xl hover:bg-gray-50 transition text-sm">
                        Jelajahi Marketplace
                    </button>
                </div>

                {/* Gambar Ilustrasi Besar Utama */}
                <div className="w-full max-w-4xl bg-gradient-to-tr from-nutri-tertiary via-nutri-primary/20 to-nutri-secondary/10 rounded-3xl h-[300px] md:h-[450px] shadow-inner relative overflow-hidden flex items-center justify-center p-8">
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-md flex items-center gap-3 border border-white/40 max-w-xs text-left">
                        <span className="text-2xl">📈</span>
                        <div>
                            <h4 className="text-xs font-bold text-nutri-primaryDark">Growth Insight</h4>
                            <p className="text-[11px] text-gray-500">Tinggi badan Anak di atas rata-rata! ✨</p>
                        </div>
                    </div>
                    <div className="text-nutri-primaryDark/40 font-bold text-xl tracking-widest">
                        [ Tempat Ilustrasi Grafik / Gambar ]
                    </div>
                </div>
            </section>

            {/* 3. SOLUSI LENGKAP UNTUK BUNDA (Fitur) */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-nutri-primaryDark mb-2">
                        Solusi Lengkap untuk Bunda
                    </h2>
                    <p className="text-sm text-gray-400 mb-12">Segala yang Bunda butuhkan dalam satu genggaman digital</p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Fitur 1 */}
                        <div className="border border-gray-100 rounded-3xl p-8 text-left bg-nutri-neutralBg/30 flex flex-col justify-between min-h-[380px]">
                            <div>
                                <div className="w-10 h-10 bg-nutri-primary/20 rounded-xl flex items-center justify-center text-nutri-primaryDark font-bold mb-4">
                                    📊
                                </div>
                                <h3 className="text-lg font-bold text-nutri-primaryDark mb-2">Pelacakan Tumbuh Kembang Presisi</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Catat berat badan, tinggi dan lingkar kepala si Kecil. Dapatkan grafik standar WHO secara otomatis untuk memantau milestones-nya.
                                </p>
                            </div>
                            <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-2 shadow-sm flex items-center justify-center h-80 overflow-hidden">
                                <img src="/src/assets/images/Tracking-Interface.png" alt="Tracking" className="w-full h-full object-cover object-top rounded-xl" />
                            </div>
                        </div>

                        {/* Fitur 2 */}
                        <div className="border border-gray-100 rounded-3xl p-8 text-left bg-nutri-tertiary/80 flex flex-col justify-between min-h-[380px]">
                            <div>
                                <div className="w-10 h-10 bg-nutri-primary/20 rounded-xl flex items-center justify-center text-nutri-primaryDark font-bold mb-4">
                                    🏥
                                </div>
                                <h3 className="text-lg font-bold text-nutri-primaryDark mb-2">Konsultasi Ahli</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Tanya jawab langsung dengan dokter anak dan ahli gizi MPASI bersertifikat kapan saja.
                                </p>
                            </div>
                            <div className="h-40"></div> {/* Spacer visual */}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CERITA SUKSES BUNDA (Testimoni) */}
            <section className="py-20 bg-nutri-neutralBg">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-nutri-primaryDark mb-2">Cerita Sukses Bunda</h2>
                    <p className="text-sm text-gray-400 mb-12">Bergabunglah dengan 50.000+ orang tua yang telah bertumbuh bersama kami</p>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Card Testi 1 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-left border border-gray-50 flex flex-col justify-between">
                            <p className="text-xs text-gray-500 italic leading-relaxed mb-6">
                                "Sangat terbantu dengan fitur trackingnya. Jadi langsung tahu apakah berat badan anak normal atau tidak, sekarang tinggal lihat grafik di NutriGrow!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div>
                                    <h5 className="text-xs font-bold text-nutri-primaryDark">Bunda Sarah</h5>
                                    <p className="text-[10px] text-gray-400">Bunda Puteri (18 Bulan)</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Testi 2 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-left border border-gray-50 flex flex-col justify-between">
                            <p className="text-xs text-gray-500 italic leading-relaxed mb-6">
                                "Marketplace MPASI-nya juara h. Bahannya terkurasi, tidak perlu pusing pilih merk lagi, konsultasi dokternya juga responsif banget."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div>
                                    <h5 className="text-xs font-bold text-nutri-primaryDark">Ayah Budi</h5>
                                    <p className="text-[10px] text-gray-400">Ayah dari Arkan (7 Bulan)</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Testi 3 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm text-left border border-gray-50 flex flex-col justify-between">
                            <p className="text-xs text-gray-500 italic leading-relaxed mb-6">
                                "Resep MPASI di rekomendasinya sangat membantu saat saya kehabisan ide memasak. Anak saya jadi lebih lahap makan!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div>
                                    <h5 className="text-xs font-bold text-nutri-primaryDark">Bunda Mia</h5>
                                    <p className="text-[10px] text-gray-400">Bunda Rafif (12 Bulan)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CALL TO ACTION (CTA) BAR */}
            <section className="max-w-4xl mx-auto w-full px-6 mb-20">
                <div className="bg-nutri-primaryDark rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Daftar Sekarang untuk Si Kecil</h2>
                    <p className="text-xs md:text-sm text-white/80 max-w-md mx-auto mb-6">
                        Berikan yang terbaik untuk masa depan emas buah hati Anda. Mulai pelacakan kesehatan dan nutrisi pertama Anda hari ini.
                    </p>
                    <button className="px-6 py-3 bg-nutri-secondary text-nutri-primaryDark font-bold rounded-xl text-xs shadow-md hover:bg-opacity-90 transition">
                        Buat Akun Gratis
                    </button>
                </div>
            </section>

            {/* 6. FOOTER */}
            <footer className="w-full bg-white border-t border-gray-100 py-8 text-xs text-gray-400">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <span className="font-bold text-nutri-primaryDark">NutriGrow</span>
                        <p className="mt-1">© 2026 NutriGrow. Supportive Nurturing for every child.</p>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Support</a>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;