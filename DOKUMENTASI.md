# Dokumentasi Aplikasi Resto QR Code

Selamat datang di dokumentasi resmi Aplikasi Resto QR Code. Dokumen ini akan memandu Anda dalam menggunakan aplikasi, baik dari sisi admin maupun dari sisi pelanggan.

---

## I. Untuk Admin / Pemilik Resto

Bagian ini menjelaskan cara mengelola menu, stok, dan melihat penjualan melalui dashboard admin.

### Alur Kerja Utama

Aplikasi ini dirancang dengan alur kerja sebagai berikut:
1.  **Buat Menu**: Anda mendaftarkan semua menu yang akan dijual.
2.  **Tambah Stok**: Anda mencatat setiap kali ada penambahan stok untuk menu tertentu. **Sebuah menu tidak akan muncul di halaman pelanggan jika belum pernah ditambahkan stoknya.**
3.  **Penjualan**: Saat pelanggan memesan, stok menu akan otomatis berkurang.

### Langkah-langkah Penggunaan

#### 1. Menambahkan Menu Baru

Sebelum bisa mencatat stok, Anda harus mendaftarkan menunya terlebih dahulu.

1.  Login ke dashboard.
2.  Masuk ke modul **Menu** di sidebar.
3.  Klik tombol **"Tambah Menu"**.
4.  Isi semua data yang diperlukan:
    *   **Nama Menu**: Nama yang akan dilihat pelanggan.
    *   **Deskripsi**: Penjelasan singkat tentang menu.
    *   **Modal (Rp)**: Harga modal awal per porsi.
    *   **Harga Jual (Rp)**: Harga yang akan dibayar pelanggan.
    *   **Camera**: Unggah foto terbaik dari menu Anda.
5.  Klik **"Simpan Menu"**.

> **Penting**: Pada tahap ini, menu hanya terdaftar di sistem. Stoknya masih `0` dan belum akan muncul di halaman pelanggan.

#### 2. Mengelola Stok (Fitur Utama)

Modul ini adalah jantung dari manajemen inventori Anda. Halaman ini berisi **histori** atau **catatan** setiap kali Anda melakukan restok.

1.  Masuk ke modul **Stok** di sidebar (ikon panci `CookingPot`).
2.  Anda akan melihat tabel riwayat penambahan stok.

##### Menambah Catatan Stok Baru

Ini adalah langkah paling penting agar menu bisa dijual.

1.  Klik tombol **"Tambah Stok"**.
2.  Akan muncul modal **"Tambah Catatan Stok"**. Isi form berikut:
    *   **Pilih Menu**: Pilih dari dropdown menu mana yang stoknya ingin Anda tambah.
    *   **Kuantiti Ditambah**: Jumlah porsi yang baru saja Anda siapkan/restok.
    *   **Modal & Harga Jual**: Field ini akan otomatis terisi sesuai data dari modul **Menu**. Anda bisa mengubahnya jika ada perubahan harga modal atau jual pada saat restok kali ini.
    *   **Waktu Restok**: Tanggal dan waktu akan otomatis terisi dengan waktu saat ini. Anda bisa mengubahnya jika pencatatan dilakukan di waktu yang berbeda.
3.  Klik **"Simpan Catatan"**.

> **Setelah disimpan, sistem akan:**
> 1. Mencatat histori ini.
> 2. Menambahkan `kuantiti` ke total stok menu yang bersangkutan.
> 3. Memperbarui harga modal dan jual menu tersebut jika Anda mengubahnya.
> 4. **Menu sekarang akan muncul di halaman pelanggan dengan jumlah stok yang tersedia.**

##### Mengedit & Menghapus Catatan Stok

Jika terjadi kesalahan pencatatan, Anda bisa memperbaikinya.

1.  Di tabel histori stok, cari catatan yang ingin diubah.
2.  Klik tombol **Edit** (ikon pensil) atau **Hapus** (ikon tong sampah).
3.  **Jika Edit**: Modal akan muncul dengan data yang sudah terisi. Ubah data yang perlu diperbaiki, lalu klik **"Perbarui Catatan"**.
4.  **Jika Hapus**: Akan muncul konfirmasi.

> **Penting**: Mengedit atau menghapus catatan ini akan secara otomatis menyesuaikan kembali jumlah total stok pada menu terkait. Lakukan dengan hati-hati.

---

## II. Untuk Pelanggan

Bagian ini menjelaskan cara pelanggan memesan makanan melalui halaman utama.

### Langkah-langkah Memesan

1.  **Buka Halaman Utama**
    Pelanggan membuka link atau memindai QR Code untuk masuk ke halaman daftar menu.

2.  **Pilih Menu**
    *   Pelanggan akan melihat daftar menu yang tersedia, lengkap dengan gambar, deskripsi, dan harga.
    *   Jika sebuah menu stoknya habis, tombol "Tambah" akan diganti dengan label **"Stok Habis"** dan tidak bisa diklik.
    *   Untuk memesan, pelanggan cukup menekan tombol **"Tambah"**.

3.  **Atur Jumlah Pesanan**
    *   Setelah menu ditambahkan, tombol "Tambah" akan berubah menjadi panel jumlah (`-` `1` `+`).
    *   Pelanggan bisa menambah atau mengurangi jumlah pesanan dengan menekan tombol `+` atau `-`.
    *   Jika pelanggan mencoba menambah pesanan melebihi stok yang ada, akan muncul notifikasi di atas layar yang memberitahukan sisa stok.

4.  **Lihat Keranjang & Total**
    *   Setiap kali menu ditambahkan, sebuah bar akan muncul di bagian bawah layar.
    *   Bar ini menampilkan total item dan total harga dari semua pesanan di keranjang.

5.  **Isi Data Diri & Konfirmasi**
    *   Klik tombol **"Rincian Pesanan"** pada bar di bawah.
    *   Sebuah modal akan muncul berisi ringkasan pesanan.
    *   Pelanggan harus mengisi **Nama** dan **Nomor WhatsApp** mereka.

6.  **Kirim Pesanan**
    *   Setelah semua data terisi, pelanggan menekan tombol **"Kirim Pesanan"**.
    *   Akan muncul notifikasi bahwa pesanan telah diterima.
    *   Selanjutnya, admin akan menerima notifikasi dan memproses pesanan tersebut.
