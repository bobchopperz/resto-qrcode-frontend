"use client";

import { useState, useEffect } from 'react';
import styles from './StokTable.module.css';
import { Plus } from 'lucide-react';
import AddStokModal from './AddStokModal';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number || 0);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export default function StokTable() {
  const [stokHistory, setStokHistory] = useState([]);
  const [menuItems, setMenuItems] = useState([]); // Untuk dropdown di modal
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Ambil histori stok
      const stokResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/stok`);
      if (!stokResponse.ok) throw new Error('Gagal mengambil histori stok.');
      const stokData = await stokResponse.json();
      setStokHistory(stokData);

      // Ambil daftar menu untuk modal
      const menuResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/menu`);
      if (!menuResponse.ok) throw new Error('Gagal mengambil data menu.');
      const menuData = await menuResponse.json();
      setMenuItems(menuData);

    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <h1>Histori Penambahan Stok</h1>
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Tambah Stok</span>
        </button>
      </div>
      {isLoading ? (
        <p>Memuat data...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tanggal Restok</th>
                <th>Nama Menu</th>
                <th>Kuantiti</th>
                <th>Modal (saat itu)</th>
                <th>Harga Jual (saat itu)</th>
              </tr>
            </thead>
            <tbody>
              {stokHistory.length > 0 ? (
                stokHistory.map((item) => (
                  <tr key={item._id}>
                    <td data-label="Tanggal">{formatDate(item.tanggal_restok)}</td>
                    {/* Asumsi backend mengirim `menu_id` sebagai objek utuh */}
                    <td data-label="Nama Menu">{item.menu_id?.name || 'Menu Dihapus'}</td>
                    <td data-label="Kuantiti">{item.kuantiti}</td>
                    <td data-label="Modal">{formatRupiah(item.modal)}</td>
                    <td data-label="Harga Jual">{formatRupiah(item.harga_jual)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>Belum ada histori penambahan stok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddStokModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStokAdded={fetchData} // Refresh data setelah stok ditambahkan
        menuItems={menuItems}
      />
    </div>
  );
}
