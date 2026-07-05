export const getRecommendation = async (req, res) => {
    try {
        const { status } = req.query;

        if (!status) {
            return res.status(400).json({ message: "Parameter status gizi wajib disertakan!" });
        }

        let recommendation = {};

        switch (status.toUpperCase()) {
            case 'WASTING':
                recommendation = {
                    condition: "Wasting (Kekurangan Gizi Akut / Kurus)",
                    description: "Anak membutuhkan asupan kalori dan protein tinggi segera untuk mengejar ketertinggalan berat badannya.",
                    foodSuggestions: [
                        "Bubur saring daging sapi dengan mentega/minyak ayam tambahan.",
                        "Pure alpukat dicampur dengan susu formula tinggi kalori.",
                        "Telur rebus matang (bagian kuning dan putih) sebagai camilan."
                    ],
                    supplement: "Berikan vitamin penambah nafsu makan dan konsultasikan ke faskes terdekat untuk PMT (Pemberian Makanan Tambahan)."
                };
                break;

            case 'STUNTING':
                recommendation = {
                    condition: "Potensi Stunting (Pendek / Kurang Tinggi Badan)",
                    description: "Fokus utama adalah stimulasi pertumbuhan tulang dan otot melalui asupan protein hewani dan kalsium yang konsisten.",
                    foodSuggestions: [
                        "Ikan kembung atau salmon kukus (sangat tinggi omega-3 dan protein).",
                        "Susu formula khusus pertumbuhan anak atau produk turunan susu seperti keju.",
                        "Sup kaldu tulang murni yang dimasak perlahan bersama potongan daging ayam."
                    ],
                    supplement: "Pastikan suplemen Vitamin D3 dan Zinc terpenuhi sesuai anjuran bidan/dokter."
                };
                break;

            case 'NORMAL':
                recommendation = {
                    condition: "Normal (Gizi Baik)",
                    description: "Pertumbuhan anak sudah sesuai dengan grafik WHO. Pertahankan pola makan gizi seimbang ini.",
                    foodSuggestions: [
                        "Menu 4 bintang harian: Karbohidrat, Protein Hewani/Nabati, Lemak Sehat, dan Sayur/Buah.",
                        "Variasikan menu harian agar anak tidak bosan dan mendapatkan profil nutrisi yang lengkap."
                    ],
                    supplement: "Cukup berikan ASI eksklusif atau susu pertumbuhan biasa dan menjaga kebersihan lingkungan."
                };
                break;

            default:
                return res.status(404).json({ message: "Status gizi tidak dikenali oleh sistem." });
        }

        res.status(200).json({
            message: "Rekomendasi nutrisari berhasil diracik otomatis",
            data: recommendation,
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Gagal memproses rekomendasi",
            error: error.message 
        }); 
    }
};
