"use client";

import { useState, useEffect } from 'react';
import styles from './StokTable.module.css';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddStokModal from './AddStokModal';
import EditStokModal from './EditStokModal'; // Impor modal edit

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
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stokToEdit, setStokToEdit] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const stokResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/stok`);
      if (!stokResponse.ok) throw new Error('Gagal mengambil histori stok.');
      const stokData = await stokResponse.json();
      setStokHistory(stokData);

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

  const handleEditClick = (stokItem) => {
    setStokToEdit(stokItem);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (stokId) => {
    if (window.confirm('Apakah Kakak yakin ingin menghapus catatan stok ini? Ini akan mempengaruhi total stok menu terkait.')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/stok/${stokId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal menghapus catatan.' }));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        alert('Catatan stok berhasil dihapus!');
        fetchData(); // Refresh data
      } catch (err) {
        alert(`Gagal menghapus: ${err.message}`);
        console.error('Error deleting stok record:', err);
      }
    }
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <h1>Histori Penambahan Stok</h1>
        <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
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
                <th>Modal</th>
                <th>Harga Jual</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {stokHistory.length > 0 ? (
                stokHistory.map((item) => (
                  <tr key={item._id}>
                    <td data-label="Tanggal">{formatDate(item.tanggal_restok)}</td>
                    <td data-label="Nama Menu">{item.menu_id?.name || 'Menu Dihapus'}</td>
                    <td data-label="Kuantiti">{item.kuantiti}</td>
                    <td data-label="Modal">{formatRupiah(item.modal)}</td>
                    <td data-label="Harga Jual">{formatRupiah(item.harga_jual)}</td>
                    <td data-label="Aksi">
                      <div className={styles.actionButtons}>
                        <button 
                          className={`${styles.actionButton} ${styles.editButton}`}
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Belum ada histori penambahan stok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddStokModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStokAdded={fetchData}
        menuItems={menuItems}
      />

      <EditStokModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onStokUpdated={fetchData}
        stokItem={stokToEdit}
        menuItems={menuItems}
      />
    </div>
  );
}
