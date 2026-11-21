# Checklist informasi yang menunggu pemilik HCBTECH

Jangan mengisi field kritis dengan perkiraan agar situs tampak lengkap.

## P0 — sebelum peluncuran publik

1. **Environment WhatsApp pada host deployment** — nomor pemilik sudah diberikan (`0853-1552-7000`, dinormalisasi menjadi `6285315527000`). Pasang `VITE_WHATSAPP_NUMBER` pada host; tanpa itu alur draf + Facebook tetap berfungsi.
2. **Domain produksi** — robots/sitemap sudah menggunakan `https://hcbtech.vercel.app`; sesuaikan bersama `VITE_SITE_URL` bila domain berubah.
3. **Nama model dan SKU final tiap unit** — semua nama saat ini sementara; REF hanya ID internal.
4. **Pemetaan foto ke model** — logo dan 50 foto unik sudah diarsipkan; lima foto dipakai pada galeri referensi. Tentukan model/varian untuk setiap foto.
5. **Harga, cakupan unit, dan ketersediaan** — 14 varian sudah ditranskripsi di `assets/pricelist.json`; pemetaan ke produk dan tanggal berlaku belum pasti. Harga pada enam REF tetap null; tidak ada Offer JSON-LD.
6. **Persetujuan pengelompokan produk** — enam referensi dapat berupa varian unit yang sama; penggabungan/pemisahan perlu dikonfirmasi.

## P1 — sebelum klaim teknis

1. Fungsi mesin, bahan yang boleh/tidak boleh diproses, dan bentuk hasil.
2. Daya/tegangan motor, tipe engine, gearbox/rasio, pulley/belt, serta putaran.
3. Dimensi, berat, diameter, material/grade/ketebalan, dan bagian kontak.
4. Kapasitas berdasarkan metode uji yang dijelaskan; jangan publikasikan angka tanpa konteks bahan.
5. Video demo yang dipetakan ke unit tertentu, poster, tanggal, dan kondisi pengujian.
6. Alamat bengkel, jam operasional, email, titik peta, serta prosedur janji kunjung.
7. Foto .blend sumber, pengukuran, GLB hasil optimasi, dan persetujuan akurasi model.

## P2 — sebelum kebijakan komersial ditampilkan

1. Garansi dan pengecualiannya.
2. Pembayaran, jadwal produksi, batas revisi, dan serah terima.
3. Ongkir, jangkauan pengiriman, instalasi, dan pelatihan.
4. Prosedur perawatan, keselamatan, suku cadang, dan layanan purnajual.
5. Profil legal/tim/tahun berdiri/fasilitas bengkel yang dapat dibuktikan.

## Audit media

- [ ] Tidak ada visualisasi berlabel foto asli.
- [ ] Tidak ada tab video tanpa URL demo per produk.
- [ ] Tidak ada nama model sementara yang berubah menjadi confirmed tanpa persetujuan.
- [ ] Null price selalu menjadi Minta Penawaran.
- [ ] Spesifikasi null selalu menjadi Konfirmasi spesifikasi.
- [ ] Offer/availability structured data hanya dari nilai faktual.
- [ ] Model 3D tetap approximation sampai verifikasi geometri selesai.
