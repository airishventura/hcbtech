# Pipeline Blender → GLB HCBTECH

Status saat ini: **belum ada .blend atau GLB pemilik di proyek**. Viewer memakai aproksimasi komponen dan tidak mengklaim akurasi.

## 1. Kumpulkan bukti sebelum modeling

- Tetapkan `product.id` dan unit fisik yang sama untuk seluruh referensi.
- Foto depan, belakang, kiri, kanan, atas, bawah bila aman, serta close-up sambungan.
- Satu foto dengan objek skala atau pengukuran yang terlihat; jangan menebak piksel menjadi milimeter.
- Ukur panjang/lebar/tinggi, diameter poros/piringan/drum, posisi dudukan, tinggi chute, dan envelope motor.
- Catat bagian yang tidak terlihat sebagai `unknown`. Jangan mengarang mekanisme internal dari housing tertutup.

## 2. Siapkan scene Blender

1. Gunakan satuan Metric, scale 1.0, 1 unit = 1 meter.
2. Simpan sumber sebagai `models/source/<product-id>.blend` dan foto referensi tanpa mengubah file asli.
3. Letakkan unit di atas lantai Y-up pada ekspor glTF; gunakan titik origin yang konsisten di tengah alas.
4. Jangan tambahkan animasi piringan, aliran bahan, atau pengujian yang tidak pernah dilakukan.

## 3. Buat komponen bermakna

Gunakan koleksi/objek terpisah dan nama berikut bila komponen memang ada:

- `frame_main`, `frame_mount_motor`
- `guard_left`, `guard_right`, `guard_belt`
- `motor_electric` atau `engine_petrol`
- `gearbox`, `shaft_main`, `bearing_left`, `bearing_right`
- `disc_working`, `drum_housing`
- `hopper_inlet`, `chute_outlet`, `fasteners_visible`

Model hanya struktur yang didukung foto/ukuran. Bedakan komponen observed dan inferred dalam custom property `verification = observed | inferred | measured`. Bagian inferred tidak boleh membuat seluruh model disebut terverifikasi.

## 4. Material dan geometri efisien

- Principled BSDF/PBR; hindari texture bake besar jika warna dan roughness cukup.
- Target awal 50–150 ribu triangle per unit mobile, kurangi bolt tersembunyi dan detail yang tidak terlihat.
- Apply transform, normals, dan modifier yang diperlukan. Hapus mesh duplikat dan bagian dalam yang tidak terlihat.
- Tekstur 1K untuk keseluruhan unit biasanya cukup; 2K hanya bila close-up membutuhkannya. Gunakan WebP pada optimasi, jangan KTX2 kecuali loader dikonfigurasi.
- Tidak perlu lampu/kamera Blender pada GLB; viewer menyediakan pencahayaan studio sendiri.

## 5. Ekspor dari Blender

File → Export → glTF 2.0:

- Format: **glTF Binary (.glb)**.
- Selected Objects hanya bila koleksi unit sudah dipilih.
- Apply Modifiers: aktif setelah sumber diamankan.
- +Y Up: aktif.
- Materials dan normals: aktif; tangents hanya bila normal map membutuhkan.
- Animation: nonaktif kecuali memang ada dokumentasi gerak yang sah (tidak digunakan untuk katalog saat ini).

Nama awal: `public/models/<product-id>.glb`. Simpan ekspor mentah sebelum kompresi.

## 6. Optimasi glTF

Contoh dengan glTF Transform (jalankan di salinan file):

```bash
npx @gltf-transform/cli inspect models/export/REF-D01-raw.glb
npx @gltf-transform/cli optimize models/export/REF-D01-raw.glb public/models/REF-D01.glb --compress draco --texture-compress webp
npx @gltf-transform/cli inspect public/models/REF-D01.glb
```

Periksa kompatibilitas Draco pada loader yang digunakan dan sediakan decoder bila deployment tidak mengizinkan CDN. Jangan mengompres berulang kali. Target awal GLB < 3–5 MB per produk bila kualitas memungkinkan; ukuran bukan alasan menghapus struktur penting.

## 7. Integrasi

Pada record produk:

- `modelGLB: "/models/REF-D01.glb"`
- `posterImage`: poster ringan dengan rasio yang sama dengan viewer.
- `hotspots`: posisi dalam koordinat model setelah normalisasi diverifikasi; label tidak boleh menamai fungsi yang belum dikonfirmasi.
- Pertahankan `modelAccuracy: "approximation"` selama pemeriksaan belum selesai.

## 8. Gerbang verifikasi geometri

- [ ] Unit pada GLB sama dengan unit foto dan ID data.
- [ ] Skala dibandingkan dengan minimal tiga ukuran aktual.
- [ ] Depan/belakang/kiri/kanan di-overlay dengan referensi.
- [ ] Rangka, guard, penggerak, shaft, gearbox, chute, housing diperiksa terpisah.
- [ ] Tidak ada komponen inferred yang dipresentasikan sebagai fakta.
- [ ] Pemilik/teknisi memberi persetujuan tertulis dengan tanggal dan revisi.
- [ ] Poster, alt text, dan hotspot diperiksa di desktop serta Android.

Hanya setelah seluruh butir relevan selesai ubah `modelAccuracy` menjadi `"geometry-verified"`. Persetujuan visual bukan sertifikasi engineering, keselamatan, atau performa.
