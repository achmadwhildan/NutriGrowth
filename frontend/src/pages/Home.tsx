import React, { useState } from "react";
import { Link } from "react-router-dom";

// ── Sub-komponen FAQ Accordion ──────────────────────────────────────────────
const faqs = [
    {
        q: "Apakah NutriGrow gratis digunakan?",
        a: "Ya! Fitur pelacakan tumbuh kembang dasar dan rekomendasi MPASI tersedia sepenuhnya gratis. Fitur premium seperti konsultasi langsung dengan dokter memerlukan paket berlangganan.",
    },
    {
        q: "Apakah data anak saya aman?",
        a: "Keamanan data adalah prioritas utama kami. Semua data dienkripsi dengan standar AES-256 dan tersimpan di server yang tersertifikasi ISO 27001. Kami tidak pernah menjual data Anda ke pihak ketiga.",
    },
    {
        q: "Berapa usia anak yang didukung oleh NutriGrow?",
        a: "NutriGrow mendukung pemantauan anak dari usia 0 bulan hingga 5 tahun, mengacu pada standar grafik pertumbuhan WHO yang telah tervalidasi secara klinis.",
    },
    {
        q: "Bagaimana cara berkonsultasi dengan dokter?",
        a: "Setelah mendaftar, buka menu 'Konsultasi', pilih dokter anak atau ahli gizi yang tersedia, dan mulai sesi chat atau video call langsung dari aplikasi.",
    },
];

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-6 py-5 text-left text-sm font-semibold text-nutri-primaryDark hover:bg-nutri-neutralBg/60 transition"
            >
                <span>{q}</span>
                <span
                    className={`ml-4 flex-shrink-0 text-nutri-primary transition-transform duration-300 ${open ? "rotate-45" : "rotate-0"}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
            >
                <p className="px-6 pb-5 text-xs text-gray-500 leading-relaxed">{a}</p>
            </div>
        </div>
    );
};

// ── Komponen Utama Home ─────────────────────────────────────────────────────
const Home: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: "Dashboard", to: "/parent-dashboard" },
        { label: "Tracker", to: "/tracker" },
        { label: "Marketplace", to: "/consult" },
        { label: "Konsultasi", to: "/consult" },
    ];

    return (
        <div className="min-h-screen bg-nutri-neutralBg flex flex-col font-sans overflow-x-hidden">

            {/* ════════════════════════════════════════════════════════════════
                1. NAVBAR / HEADER
            ════════════════════════════════════════════════════════════════ */}
            <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-extrabold text-nutri-primaryDark flex items-center gap-2 flex-shrink-0">
                        <img src="/src/assets/images/logo.png" alt="Logo NutriGrow" className="h-8 w-auto" />
                        NutriGrow
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-nutri-neutralText/70">
                        <Link to="/parent-dashboard" className="hover:text-nutri-primaryDark transition-colors pb-1">Dashboard</Link>
                        <Link to="/tracker"          className="hover:text-nutri-primaryDark transition-colors pb-1">Tracker</Link>
                        <Link to="/consult"          className="hover:text-nutri-primaryDark transition-colors pb-1">Marketplace</Link>
                        <Link to="/consult"          className="hover:text-nutri-primaryDark transition-colors pb-1">Konsultasi</Link>
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="text-sm font-semibold text-nutri-primaryDark hover:text-nutri-primary transition-colors px-3 py-2"
                        >
                            Masuk
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 bg-nutri-primaryDark text-white text-sm font-bold rounded-xl shadow hover:bg-opacity-85 transition-all active:scale-95"
                        >
                            Daftar Gratis
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        id="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-nutri-primaryDark hover:bg-nutri-tertiary/40 transition"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <div
                    className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
                >
                    <nav className="flex flex-col px-6 py-4 gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-3 text-sm font-medium text-nutri-neutralText hover:text-nutri-primaryDark border-b border-gray-50 last:border-0 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex gap-3 pt-4">
                            <Link to="/login"    className="flex-1 text-center py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-nutri-primaryDark hover:bg-gray-50 transition">Masuk</Link>
                            <Link to="/register" className="flex-1 text-center py-2.5 bg-nutri-primaryDark text-white rounded-xl text-sm font-bold hover:bg-opacity-85 transition">Daftar</Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* ════════════════════════════════════════════════════════════════
                2. HERO SECTION
            ════════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center relative w-full">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-nutri-tertiary text-nutri-primaryDark text-xs font-semibold rounded-full mb-6 border border-nutri-primary/20">
                    <span className="w-2 h-2 rounded-full bg-nutri-primary animate-pulse"></span>
                    Dipercaya 50.000+ Orang Tua di Indonesia
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold text-nutri-primaryDark tracking-tight max-w-3xl leading-tight mb-5">
                    Tumbuh Sehat,{" "}
                    <span className="relative inline-block">
                        Ibu Tenang
                        <span className="absolute bottom-0 left-0 right-0 h-[6px] bg-nutri-secondary/60 rounded-full -z-10"></span>
                    </span>
                    .
                </h1>

                <p className="text-sm md:text-base text-gray-500 max-w-2xl mb-10 leading-relaxed">
                    Pendamping resmi perjalanan tumbuh kembang si Kecil. Pelacakan nutrisi cerdas hingga rekomendasi MPASI terbaik untuk setiap tahap usianya.
                </p>

                <div className="flex flex-wrap gap-4 justify-center mb-14">
                    <Link
                        to="/register"
                        className="px-7 py-3.5 bg-nutri-primaryDark text-white font-bold rounded-xl shadow-lg hover:bg-opacity-85 hover:shadow-xl transition-all active:scale-95 text-sm"
                    >
                        Mulai Tracking Gratis →
                    </Link>
                    <Link
                        to="/consult"
                        className="px-7 py-3.5 border border-gray-200 bg-white text-nutri-primaryDark font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
                    >
                        Jelajahi Marketplace
                    </Link>
                </div>

                {/* Hero Visual */}
                <div className="w-full max-w-4xl h-[320px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl relative bg-nutri-tertiary/50 border border-nutri-primary/10">
                    {/* Floating Insight Card — Top Left */}
                    <div className="absolute top-5 left-5 z-10 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-lg flex items-center gap-3 border border-white/60 max-w-[200px] text-left">
                        <div className="w-9 h-9 rounded-xl bg-nutri-tertiary flex items-center justify-center text-lg flex-shrink-0">📈</div>
                        <div>
                            <h4 className="text-[11px] font-bold text-nutri-primaryDark leading-tight">Growth Insight</h4>
                            <p className="text-[10px] text-gray-500 leading-snug mt-0.5">Tinggi badan di atas rata-rata! ✨</p>
                        </div>
                    </div>

                    {/* Floating Next Meal Card — Top Right */}
                    <div className="absolute top-5 right-5 z-10 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-lg flex items-center gap-3 border border-white/60 max-w-[200px] text-left">
                        <div className="w-9 h-9 rounded-xl bg-nutri-secondary/30 flex items-center justify-center text-lg flex-shrink-0">🍚</div>
                        <div>
                            <h4 className="text-[11px] font-bold text-nutri-primaryDark leading-tight">Menu Hari Ini</h4>
                            <p className="text-[10px] text-gray-500 leading-snug mt-0.5">Bubur Ayam + Sayur Bayam</p>
                        </div>
                    </div>

                    {/* Main Hero Image */}
                    <img
                        src="/src/assets/hero.png"
                        alt="Ilustrasi Dashboard NutriGrow"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                            // fallback jika hero.png belum ada
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                        }}
                    />
                    {/* Fallback visual jika gambar tidak ada */}
                    <div
                        style={{ display: "none" }}
                        className="w-full h-full items-center justify-center flex-col gap-4 bg-gradient-to-br from-nutri-tertiary via-nutri-primary/20 to-nutri-secondary/10"
                    >
                        <img
                            src="/src/assets/images/Tracking-Interface.png"
                            alt="Tracking Interface"
                            className="max-h-[280px] md:max-h-[400px] w-auto rounded-2xl shadow-xl object-contain"
                        />
                    </div>

                    {/* Bottom gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-nutri-neutralBg/30 to-transparent pointer-events-none"></div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                3. STATS BAR
            ════════════════════════════════════════════════════════════════ */}
            <section className="bg-nutri-primaryDark py-10">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { icon: "👨‍👩‍👧", value: "50.000+", label: "Keluarga Aktif" },
                        { icon: "👨‍⚕️", value: "200+",    label: "Dokter & Ahli Gizi" },
                        { icon: "🍽️",   value: "1 Juta+", label: "Resep MPASI" },
                        { icon: "⭐",   value: "4.9 / 5",  label: "Rating Pengguna" },
                    ].map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center gap-1">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-2xl font-extrabold text-white">{stat.value}</span>
                            <span className="text-xs text-white/60 font-medium">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                4. SOLUSI LENGKAP (FITUR) — 2x2 Grid
            ════════════════════════════════════════════════════════════════ */}
            <section className="bg-white py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-xs font-bold text-nutri-primary uppercase tracking-widest">Fitur Unggulan</span>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-nutri-primaryDark mt-2 mb-3">
                        Solusi Lengkap untuk Bunda
                    </h2>
                    <p className="text-sm text-gray-400 mb-14 max-w-xl mx-auto">
                        Segala yang Bunda butuhkan dalam satu genggaman digital
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

                        {/* ── Fitur 1: Tracking ── */}
                        <div className="group border border-gray-100 rounded-3xl p-8 text-left bg-nutri-neutralBg/30 hover:bg-nutri-neutralBg/70 hover:border-nutri-primary/20 transition-all duration-300 flex flex-col justify-between min-h-[400px]">
                            <div>
                                <div className="w-11 h-11 bg-nutri-primary/20 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:bg-nutri-primary/30 transition">📊</div>
                                <h3 className="text-xl font-bold text-nutri-primaryDark mb-2">Pelacakan Tumbuh Kembang</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Catat berat badan, tinggi, dan lingkar kepala si Kecil. Dapatkan grafik standar WHO otomatis untuk memantau setiap milestone-nya.
                                </p>
                            </div>
                            <div className="mt-6 bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm h-60">
                                <img
                                    src="/src/assets/images/Tracking-Interface.png"
                                    alt="Tracking Interface"
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>

                        {/* ── Fitur 2: Konsultasi Ahli ── */}
                        <div className="group border border-gray-100 rounded-3xl p-8 text-left bg-nutri-tertiary/60 hover:bg-nutri-tertiary/90 hover:border-nutri-primary/30 transition-all duration-300 flex flex-col justify-between min-h-[400px]">
                            <div>
                                <div className="w-11 h-11 bg-white/60 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:bg-white/80 transition">🏥</div>
                                <h3 className="text-xl font-bold text-nutri-primaryDark mb-2">Konsultasi Ahli Kapan Saja</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Tanya jawab langsung dengan dokter anak dan ahli gizi MPASI bersertifikat. Respons cepat, jadwal fleksibel.
                                </p>
                            </div>
                            {/* Mockup Chat */}
                            <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-nutri-primary/30 flex items-center justify-center text-sm flex-shrink-0">👨‍⚕️</div>
                                    <div className="bg-nutri-tertiary/50 rounded-2xl rounded-tl-none px-3 py-2.5 text-[11px] text-nutri-primaryDark max-w-[80%]">
                                        Selamat siang Bunda! Ada yang bisa saya bantu mengenai nutrisi Rafif?
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-nutri-secondary/40 flex items-center justify-center text-sm flex-shrink-0">👩</div>
                                    <div className="bg-nutri-primaryDark/10 rounded-2xl rounded-tr-none px-3 py-2.5 text-[11px] text-nutri-primaryDark max-w-[80%]">
                                        Dok, anak saya 7 bulan belum mau makan sayur, normal kah?
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-nutri-primary/30 flex items-center justify-center text-sm flex-shrink-0">👨‍⚕️</div>
                                    <div className="bg-nutri-tertiary/50 rounded-2xl rounded-tl-none px-3 py-2.5 text-[11px] text-nutri-primaryDark max-w-[80%]">
                                        Normal Bunda 😊 Coba variasikan tekstur & warna sayurnya...
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Fitur 3: Marketplace MPASI ── */}
                        <div className="group border border-gray-100 rounded-3xl p-8 text-left bg-nutri-secondary/10 hover:bg-nutri-secondary/20 hover:border-nutri-secondary/40 transition-all duration-300 flex flex-col justify-between min-h-[340px]">
                            <div>
                                <div className="w-11 h-11 bg-nutri-secondary/30 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:bg-nutri-secondary/50 transition">🛒</div>
                                <h3 className="text-xl font-bold text-nutri-primaryDark mb-2">Marketplace MPASI Terkurasi</h3>
                                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                                    Belanja produk MPASI premium yang sudah diseleksi oleh tim ahli gizi kami. Aman, bergizi, langsung ke pintu rumah Bunda.
                                </p>
                            </div>
                            {/* Mini product cards */}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { emoji: "🥕", name: "Puree Wortel", price: "Rp 25k" },
                                    { emoji: "🐟", name: "Ikan Salmon", price: "Rp 45k" },
                                    { emoji: "🥦", name: "Brokoli Beku", price: "Rp 30k" },
                                ].map((p) => (
                                    <div key={p.name} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100 hover:shadow-md transition">
                                        <div className="text-2xl mb-1">{p.emoji}</div>
                                        <p className="text-[10px] font-semibold text-nutri-primaryDark leading-tight">{p.name}</p>
                                        <p className="text-[10px] text-nutri-secondary font-bold mt-1">{p.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Fitur 4: Resep AI ── */}
                        <div className="group border border-gray-100 rounded-3xl p-8 text-left bg-nutri-neutralBg/50 hover:bg-nutri-neutralBg/80 hover:border-nutri-primary/20 transition-all duration-300 flex flex-col justify-between min-h-[340px]">
                            <div>
                                <div className="w-11 h-11 bg-nutri-primary/15 rounded-2xl flex items-center justify-center text-xl mb-5 group-hover:bg-nutri-primary/25 transition">🤖</div>
                                <h3 className="text-xl font-bold text-nutri-primaryDark mb-2">Resep Cerdas berbasis AI</h3>
                                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                                    AI kami merekomendasikan resep MPASI yang disesuaikan dengan usia, riwayat alergi, dan preferensi si Kecil. Tidak pernah kehabisan ide!
                                </p>
                            </div>
                            {/* Recipe chips */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "🍌 Puree Pisang",
                                    "🥣 Bubur Ayam Sayur",
                                    "🐄 Sup Krim Sapi",
                                    "🥑 Alpukat Lembut",
                                    "🐟 Tim Ikan Bayam",
                                    "+ 99 Lainnya",
                                ].map((tag) => (
                                    <span key={tag} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[11px] font-medium text-nutri-primaryDark shadow-sm hover:border-nutri-primary/30 hover:bg-nutri-tertiary/30 transition cursor-pointer">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                5. CERITA SUKSES BUNDA (Testimoni)
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-nutri-neutralBg">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <span className="text-xs font-bold text-nutri-primary uppercase tracking-widest">Testimoni</span>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-nutri-primaryDark mt-2 mb-3">Cerita Sukses Bunda</h2>
                    <p className="text-sm text-gray-400 mb-14">
                        Bergabunglah dengan 50.000+ orang tua yang telah bertumbuh bersama kami
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {[
                            {
                                text: "Sangat terbantu dengan fitur trackingnya. Jadi langsung tahu apakah berat badan anak normal atau tidak, sekarang tinggal lihat grafik di NutriGrow!",
                                name: "Bunda Sarah",
                                role: "Bunda Puteri (18 Bulan)",
                                initials: "BS",
                                color: "bg-nutri-primary/30",
                            },
                            {
                                text: "Marketplace MPASI-nya juara! Bahannya terkurasi, tidak perlu pusing pilih merk lagi. Konsultasi dokternya juga responsif banget.",
                                name: "Ayah Budi",
                                role: "Ayah dari Arkan (7 Bulan)",
                                initials: "AB",
                                color: "bg-nutri-secondary/40",
                            },
                            {
                                text: "Resep MPASI di rekomendasinya sangat membantu saat saya kehabisan ide memasak. Anak saya jadi lebih lahap makan setiap hari!",
                                name: "Bunda Mia",
                                role: "Bunda Rafif (12 Bulan)",
                                initials: "BM",
                                color: "bg-nutri-tertiary",
                            },
                        ].map((t) => (
                            <div
                                key={t.name}
                                className="bg-white p-6 rounded-2xl shadow-sm text-left border border-gray-50 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                            >
                                {/* Stars */}
                                <div>
                                    <div className="flex gap-0.5 mb-4">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <svg key={s} xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-nutri-secondary" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 italic leading-relaxed mb-6">"{t.text}"</p>
                                </div>
                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-xs font-bold text-nutri-primaryDark flex-shrink-0`}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-nutri-primaryDark">{t.name}</h5>
                                        <p className="text-[10px] text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                6. FAQ SECTION
            ════════════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold text-nutri-primary uppercase tracking-widest">FAQ</span>
                        <h2 className="text-2xl md:text-4xl font-extrabold text-nutri-primaryDark mt-2 mb-3">
                            Pertanyaan yang Sering Diajukan
                        </h2>
                        <p className="text-sm text-gray-400">Tidak menemukan jawaban? <Link to="/consult" className="text-nutri-primary font-semibold hover:underline">Hubungi kami</Link></p>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                7. CALL TO ACTION BAR
            ════════════════════════════════════════════════════════════════ */}
            <section className="max-w-5xl mx-auto w-full px-6 mb-24">
                <div className="bg-nutri-primaryDark rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
                    {/* Decorative blobs */}
                    <div className="absolute -top-12 -left-12 w-44 h-44 bg-nutri-primary/30 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-nutri-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

                    <span className="inline-block px-4 py-1 bg-white/10 text-white text-xs font-bold rounded-full mb-5 border border-white/20">
                        🎁 Mulai GRATIS, Upgrade Kapan Saja
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight relative">
                        Daftar Sekarang untuk Si Kecil
                    </h2>
                    <p className="text-sm text-white/70 max-w-md mx-auto mb-8 leading-relaxed">
                        Berikan yang terbaik untuk masa depan emas buah hati Anda. Mulai pelacakan kesehatan dan nutrisi pertama Anda hari ini, sepenuhnya gratis.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-3.5 bg-nutri-secondary text-nutri-primaryDark font-extrabold rounded-xl text-sm shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all active:scale-95"
                        >
                            Buat Akun Gratis →
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl text-sm border border-white/20 hover:bg-white/20 transition-all"
                        >
                            Sudah punya akun? Masuk
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                8. FOOTER MULTI-KOLOM
            ════════════════════════════════════════════════════════════════ */}
            <footer className="w-full bg-nutri-primaryDark text-white">
                <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-2 text-lg font-extrabold mb-3">
                                <img src="/src/assets/images/logo.png" alt="Logo" className="h-7 w-auto opacity-90 brightness-0 invert" />
                                NutriGrow
                            </div>
                            <p className="text-xs text-white/50 leading-relaxed mb-5">
                                Supportive Nurturing for every child. Pendamping tumbuh kembang si Kecil yang cerdas dan terpercaya.
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-3">
                                {[
                                    { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                                    { label: "Facebook",  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                                    { label: "TikTok",   path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
                                ].map((s) => (
                                    <a
                                        key={s.label}
                                        href="#"
                                        aria-label={s.label}
                                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                                            <path d={s.path} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Produk */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Produk</h4>
                            <ul className="space-y-2.5 text-sm text-white/70">
                                {["Tracker Tumbuh Kembang", "Marketplace MPASI", "Konsultasi Dokter", "Resep AI", "Grafik WHO"].map((item) => (
                                    <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Perusahaan */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Perusahaan</h4>
                            <ul className="space-y-2.5 text-sm text-white/70">
                                {["Tentang Kami", "Blog & Artikel", "Karir", "Press Kit", "Partner"].map((item) => (
                                    <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* Bantuan */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Bantuan</h4>
                            <ul className="space-y-2.5 text-sm text-white/70">
                                {["Pusat Bantuan", "Kebijakan Privasi", "Syarat & Ketentuan", "Hubungi Kami", "Status Layanan"].map((item) => (
                                    <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/40">
                        <p>© 2026 NutriGrow. All rights reserved. Made with ❤️ for Indonesian families.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
                            <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white/70 transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;