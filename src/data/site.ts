export const services = [
  {
    number: "01",
    title: "Fabrikasi rangka & housing",
    description: "Pembahasan bentuk rangka, dudukan penggerak, housing, corong, dan saluran keluar berdasarkan kebutuhan kerja serta ruang pemasangan.",
    scope: "Gambar dan material disepakati sebelum pengerjaan.",
  },
  {
    number: "02",
    title: "Perakitan konfigurasi penggerak",
    description: "Diskusi tata letak motor listrik atau engine, gearbox, poros, bearing, pulley, dan belt agar akses perawatan dapat direncanakan.",
    scope: "Daya dan rasio tidak diasumsikan tanpa data.",
  },
  {
    number: "03",
    title: "Pengerjaan sheet metal",
    description: "Pembentukan cover, hopper, chute, dan panel berdasarkan bentuk yang disetujui. Pilihan material kontak dibahas sesuai bahan yang diproses.",
    scope: "Grade material dicantumkan pada penawaran final.",
  },
  {
    number: "04",
    title: "Penyesuaian & perbaikan",
    description: "Pemeriksaan unit existing untuk membahas perbaikan dudukan, transmisi, saluran, atau fabrikasi ulang komponen yang dapat dikerjakan bengkel.",
    scope: "Lingkup ditentukan setelah pemeriksaan unit.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Ceritakan pekerjaannya",
    description: "Kirim bahan yang akan diproses, bentuk hasil yang diharapkan, foto ruang kerja, dan pilihan penggerak. Jangan hanya menyebut nama mesin.",
    output: "Kebutuhan awal",
  },
  {
    number: "02",
    title: "Cocokkan referensi",
    description: "Pilih konfigurasi yang paling mendekati dari katalog. Nama sementara dan visualisasi membantu percakapan, bukan menggantikan gambar teknik.",
    output: "Referensi unit",
  },
  {
    number: "03",
    title: "Kunci spesifikasi",
    description: "Bengkel mengonfirmasi dimensi, material, penggerak, komponen, cakupan pelindung, serta hal-hal yang tidak termasuk dalam pengerjaan.",
    output: "Spesifikasi tertulis",
  },
  {
    number: "04",
    title: "Terima penawaran",
    description: "Harga, ketersediaan, jadwal, pengiriman, dan ketentuan lain hanya berlaku setelah tercantum dalam penawaran resmi dari HCBTECH.",
    output: "Penawaran resmi",
  },
  {
    number: "05",
    title: "Produksi & serah terima",
    description: "Tahapan pengerjaan dan bentuk serah terima disepakati untuk setiap pesanan. Dokumentasi uji hanya dibagikan bila memang dilakukan.",
    output: "Sesuai kesepakatan",
  },
];

export const principles = [
  {
    title: "Tidak mengarang angka",
    description: "Kapasitas, daya, dimensi, dan harga yang belum dikonfirmasi tetap ditulis sebagai permintaan konfirmasi—bukan dilengkapi dengan angka yang terlihat meyakinkan.",
  },
  {
    title: "Foto dan model dibedakan",
    description: "Foto asli, visualisasi, dan model 3D memiliki label berbeda. Model proksimatif tidak disebut akurat sebelum geometri diperiksa terhadap unit dan ukuran.",
  },
  {
    title: "Penawaran mengikuti kebutuhan",
    description: "Konfigurasi penggerak, material, aksesori, dan cakupan kerja dirangkum dalam pesan agar diskusi dimulai dari informasi yang sama.",
  },
];

export const generalFaq = [
  {
    question: "Apakah semua mesin di katalog ready stock?",
    answer: "Belum ada status stok yang diverifikasi. Setiap kartu menampilkan ‘Konfirmasi ketersediaan’. Kirim konfigurasi yang diminati untuk menanyakan unit existing atau kemungkinan pengerjaan.",
  },
  {
    question: "Apakah harga daftar sudah final?",
    answer: "Harga mengikuti sumber yang ditautkan pada halaman produk. Harga akhir, komponen yang termasuk, ketersediaan, dan pengiriman dikonfirmasi sebelum pemesanan.",
  },
  {
    question: "Apakah visualisasi 3D merupakan gambar teknik?",
    answer: "Bukan. Model interaktif saat ini adalah aproksimasi bentuk luar untuk memahami tata letak komponen. Model tidak menggambarkan dimensi, toleransi, mekanisme internal, atau sertifikasi rekayasa.",
  },
  {
    question: "Bisakah meminta motor listrik atau engine?",
    answer: "Keduanya dapat dipilih sebagai konfigurasi yang diminati dalam formulir. Kesesuaian, merek, daya, dan ketersediaannya tetap harus dikonfirmasi sebelum penawaran.",
  },
  {
    question: "Bagaimana dengan garansi dan pengiriman?",
    answer: "Belum ada ketentuan garansi, ongkir, jangkauan pengiriman, atau jadwal yang dapat dipublikasikan. Semua harus tertulis dalam penawaran resmi untuk pesanan Anda.",
  },
  {
    question: "Apa yang perlu disiapkan sebelum konsultasi?",
    answer: "Siapkan jenis bahan, kondisi awal dan hasil yang diinginkan, perkiraan kebutuhan kerja harian, sumber listrik bila ada, ukuran ruang, kota pemasangan, serta foto atau video referensi.",
  },
];

export const confirmationChecklist = [
  { priority: "P0", item: "Environment WhatsApp pada host deployment", reason: "Nomor pemilik sudah diterima dan dinormalisasi ke 6285315527000. Pastikan variabel yang sama dipasang pada host; fallback draf tetap tersedia." },
  { priority: "P0", item: "Nama model dan SKU final setiap unit", reason: "Tiga keluarga dan 14 pilihan bersumber dari daftar pemilik. SKU serta identitas unit pada foto masih perlu dicocokkan." },
  { priority: "P0", item: "Foto asli multi-sudut dan logo pemilik", reason: "Logo dan 50 foto unik sudah diarsipkan. Galeri katalog memakai foto asli dengan label referensi keluarga." },
  { priority: "P0", item: "Harga, cakupan unit, dan ketersediaan", reason: "Harga daftar ditampilkan sebagai referensi. Stok belum dikonfirmasi dan tidak ada Offer pada structured data." },
  { priority: "P1", item: "Fungsi mesin dan bahan yang boleh diproses", reason: "Deskripsi saat ini hanya observasi bentuk luar." },
  { priority: "P1", item: "Daya, dimensi, kapasitas, material, dan berat", reason: "Dibutuhkan untuk tabel spesifikasi faktual dan rekonstruksi model 3D." },
  { priority: "P1", item: "Alamat bengkel, jam operasional, email, dan peta", reason: "Kontak tidak diisi dengan alamat atau jam buka rekaan." },
  { priority: "P1", item: "Video demonstrasi per produk", reason: "Tab Video Demo hanya muncul setelah URL video produk tersedia." },
  { priority: "P2", item: "Ketentuan garansi, pembayaran, produksi, dan kirim", reason: "Akan ditampilkan hanya setelah kebijakan resmi diberikan." },
  { priority: "P2", item: "File .blend dan GLB hasil verifikasi", reason: "Pipeline dan lokasi aset sudah disiapkan; model akurat belum diklaim." },
];
