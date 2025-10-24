"use client";

import { useState, useEffect } from 'react';
import styles from './MenuTable.module.css';
import { Plus, Edit, Trash2, Camera, X } from 'lucide-react';
import AddMenuModal from './AddMenuModal';
import EditMenuModal from './EditMenuModal';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number || 0);
};

export default function MenuTable() {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageToShow, setImageToShow] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuItemToEdit, setMenuItemToEdit] = useState(null);

  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/menu`);
      if (!response.ok) {
        throw new Error(`Gagal mengambil data menu. Status: ${response.status}`);
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleEditClick = (menuItem) => {
    setMenuItemToEdit(menuItem);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (menuId) => {
    if (window.confirm('Apakah Kakak yakin ingin menghapus menu ini?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/menu/${menuId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal menghapus menu.' }));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        alert('Menu berhasil dihapus!');
        fetchMenu(); // Refresh daftar menu
      } catch (err) {
        alert(`Gagal menghapus menu: ${err.message}`);
        console.error('Error deleting menu:', err);
      }
    }
  };

  const getFilename = (path) => {
    if (!path) return 'Tidak ada gambar';
    return path.split('/').pop();
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <h1>Daftar Menu</h1>
        <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Tambah Menu</span>
        </button>
      </div>
      {isLoading ? (
        <p>Memuat data menu...</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama Menu</th>
                <th>Deskripsi</th>
                <th>Modal</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Image</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <tr key={item._id}>
                    <td data-label="Nama">{item.name}</td>
                    <td data-label="Deskripsi">{item.description}</td>
                    <td data-label="Modal">{formatRupiah(item.modal)}</td>
                    <td data-label="Harga">{formatRupiah(item.price)}</td>
                    <td data-label="Stok">{item.stok}</td>
                    <td data-label="Image">
                      <div className={styles.imageCell}>
                        <button
                          className={`${styles.actionButton} ${styles.showButton}`}
                          onClick={() => setImageToShow(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}${item.imageUrl}`)}
                        >
                          <Camera size={16} />
                        </button>
                      </div>
                    </td>
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
                          onClick={() => handleDelete(item._id)} // Panggil fungsi handleDelete
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>Belum ada menu.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal untuk menampilkan gambar */}
      {imageToShow && (
        <div className={styles.imageModalBackdrop} onClick={() => setImageToShow(null)}>
          <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.imageModalCloseButton} onClick={() => setImageToShow(null)}><X size={20} /></button>
            <img src={imageToShow} alt="Pratinjau Menu" className={styles.imageModalPreview} />
          </div>
        </div>
      )}

      {/* Modal Tambah Menu */}
      <AddMenuModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onMenuAdded={fetchMenu}
      />

      {/* Modal Edit Menu */}
      <EditMenuModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onMenuUpdated={fetchMenu}
        menuItem={menuItemToEdit}
      />
    </div>
  );
}
