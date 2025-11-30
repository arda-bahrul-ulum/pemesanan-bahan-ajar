# Aplikasi Pemesanan Bahan Ajar UT - Tugas Praktik 2 Vue.js

Aplikasi website sederhana untuk pemesanan Bahan Ajar di Universitas Terbuka menggunakan Vue.js framework.

## Struktur Proyek

```
/tugas2-vue-ut/
├─ index.html          ← Halaman navigasi menu utama
├─ stok.html           ← Halaman 1: Stok Bahan Ajar
├─ tracking.html       ← Halaman 2: Tracking Delivery Order
├─ css/
│  └─ style.css        ← Styling aplikasi
└─ js/
   ├─ stok-app.js      ← Logika Vue untuk stok.html
   └─ tracking-app.js  ← Logika Vue untuk tracking.html
```

## Fitur Aplikasi

### 1. Halaman Stok Bahan Ajar (stok.html)

#### Menampilkan Data Stok

- Daftar stok bahan ajar dengan kolom:
  - Kode Mata Kuliah / Nama Mata Kuliah
  - Kategori Mata Kuliah
  - UT-Daerah
  - Lokasi Rak
  - Jumlah Stok Bahan Ajar
  - Jumlah Stok Safety Bahan Ajar
  - Status (Aman/Menipis/Kosong)
  - Catatan (HTML)

#### Fitur Filter

- Filter berdasarkan UT-Daerah
- Filter berdasarkan Kategori Mata Kuliah (dependent - muncul setelah pilih UT-Daerah)
- Filter stok rendah (qty < safety atau qty = 0)
- Reset filter

#### Fitur Sort

- Sort berdasarkan Judul (A-Z / Z-A)
- Sort berdasarkan Stok (0-9 / 9-0)
- Sort berdasarkan Harga (rendah-tinggi / tinggi-rendah)

#### Status Stok

- **Aman** (hijau) - stok >= safety stock
- **Menipis** (orange) - stok < safety stock
- **Kosong** (merah) - stok = 0

#### Fitur Edit

- Edit data stok bahan ajar melalui modal
- Validasi input saat edit

#### Form Tambah Data

- Form untuk menambahkan data bahan ajar baru
- Validasi untuk semua field:
  - Kode (wajib, unik)
  - Judul (wajib)
  - Kategori (wajib)
  - UT-Daerah (wajib)
  - Lokasi Rak (wajib)
  - Harga (wajib, > 0)
  - Stok (wajib, >= 0)
  - Safety Stock (wajib, >= 0)
  - Catatan (opsional, HTML)

#### Implementasi Vue.js

- **Computed Properties**:
  - `filteredKategoriList` - dependent options
  - `filteredAndSortedStok` - filter dan sort tanpa recompute berulang
- **Watchers**:
  - Reset filter kategori ketika UT-Daerah diubah
  - Monitor perubahan stok untuk logging
  - Validasi kode saat form diisi
- **Directives**:
  - `v-for` - list rendering
  - `v-if`, `v-show` - conditional rendering
  - `v-model` - two-way data binding
  - `v-bind` - one-way data binding
  - `v-html` - render HTML
  - `v-text` - render text

### 2. Halaman Tracking Delivery Order (tracking.html)

#### Menampilkan Tracking DO

- Daftar semua Delivery Order
- Informasi lengkap setiap DO:
  - Nomor DO
  - NIM
  - Nama
  - Status
  - Ekspedisi
  - Tanggal Kirim
  - Paket Bahan Ajar
  - Total Harga
  - Riwayat Perjalanan

#### Fitur Pencarian

- Search DO berdasarkan nomor DO

#### Form Tambah DO Baru

- **Nomor DO**: Auto-generate (format: DO2025-001, DO2025-002, dst)
- **NIM**: Input manual (validasi: wajib, angka)
- **Nama**: Input manual (wajib)
- **Ekspedisi**: Select (JNE Regular / JNE Express)
- **Paket Bahan Ajar**:
  - Select dari daftar paket
  - Menampilkan detail paket setelah dipilih (kode, nama, isi, harga)
- **Tanggal Kirim**: Input date (default: tanggal hari ini)
- **Total Harga**: Auto dari paket yang dipilih

#### Implementasi Vue.js

- **Computed Properties**:
  - `nextDONumber` - generate nomor DO berikutnya
  - `totalHarga` - harga dari paket yang dipilih
  - `filteredTracking` - filter berdasarkan search
  - `trackingList` - list tracking untuk ditampilkan
- **Watchers**:
  - Update detail paket ketika paket dipilih
  - Auto-set tanggal kirim jika kosong
  - Monitor perubahan tracking untuk logging
- **Directives**:
  - `v-for` - list rendering
  - `v-if`, `v-show` - conditional rendering
  - `v-model` - two-way data binding
  - `v-bind` - one-way data binding

## Cara Menggunakan

1. Buka `index.html` di browser untuk melihat menu utama
2. Klik "Stok Bahan Ajar" untuk mengelola stok
3. Klik "Tracking Delivery Order" untuk mengelola DO

## Teknologi yang Digunakan

- Vue.js 2.6.14 (CDN)
- HTML5
- CSS3
- JavaScript (ES6+)

## Catatan

- Data disimpan di memory (tidak menggunakan database)
- Refresh halaman akan mengembalikan data ke default
- Semua validasi dilakukan di client-side

## Kriteria Penilaian

1. ✅ Arsitektur dan Struktur Proyek Vue.js
2. ✅ Penggunaan Data Binding & Directive untuk List Rendering
3. ✅ Penggunaan Conditional (v-if, v-else, v-show)
4. ✅ Penggunaan Property (Computed & Methods)
5. ✅ Watchers (minimal 2 watcher per halaman)
6. ✅ Formulir input dan Validasi input sederhana
7. ✅ Kreativitas dalam interface dan UX
8. ✅ Penjelasan penerapan fungsi fungsi dengan sistematika dan alur berpikir

---

**Dibuat untuk Tugas Praktik 2 - Pemrograman Berbasis Web**
**Universitas Terbuka - 2025**
