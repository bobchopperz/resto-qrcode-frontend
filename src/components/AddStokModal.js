"use client";

import { useState, useEffect } from 'react';
import styles from './StokTable.module.css'; // Kita bisa pakai ulang beberapa style
import { X } from 'lucide-react';

export default function AddStokModal({ isOpen, onClose, onStokAdded, menuItems }) {
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [modal, setModal] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Otomatis isi harga modal & jual saat menu dipilih
  useEffect(() => {
    if (selectedMenuId) {
      const selectedMenu = menuItems.find(item => item._id === selectedMenuId);
      if (selectedMenu) {
        setModal(selectedMenu.modal || '');
        setHargaJual(selectedMenu.price || '');
      }
    } else {
      setModal('');
      setHargaJual('');
    }
  }, [selectedMenuId, menuItems]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMenuId || !quantity) {
      alert('Mohon pilih menu dan isi kuantitas.');
      return;
    }
    setIsSubmitting(true);

    const stokData = {
      menu_id: selectedMenuId,
      kuantiti: parseInt(quantity, 10),
      modal: parseFloat(modal),
      harga_jual: parseFloat(hargaJual),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/stok`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stokData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Gagal menambah stok.' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      alert('Stok baru berhasil ditambahkan!');
      onStokAdded(); // Beri tahu parent untuk refresh data
      onClose(); // Tutup modal
      // Reset form
      setSelectedMenuId('');
      setQuantity('');
    } catch (err) {
      alert(`Gagal: ${err.message}`);
      console.error('Error adding stok:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Tambah Catatan Stok</h2>
          <button className={styles.modalCloseButton} onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.stokForm}>
          <div className={styles.formGroup}>
            <label htmlFor="menu">Pilih Menu</label>
            <select
              id="menu"
              value={selectedMenuId}
              onChange={(e) => setSelectedMenuId(e.target.value)}
              required
            >
              <option value="" disabled>-- Pilih Menu --</option>
              {menuItems.map(item => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Kuantiti Ditambah</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="modal">Modal Saat Ini (per item)</label>
            <input
              type="number"
              id="modal"
              value={modal}
              onChange={(e) => setModal(e.target.value)}
              required
              min="0"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="hargaJual">Harga Jual Saat Ini (per item)</label>
            <input
              type="number"
              id="hargaJual"
              value={hargaJual}
              onChange={(e) => setHargaJual(e.target.value)}
              required
              min="0"
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>Batal</button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Catatan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
