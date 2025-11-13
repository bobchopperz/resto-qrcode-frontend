"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './OpsiMenuPage.module.css';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Komponen Modal untuk Tambah/Edit
const OpsiMenuModal = ({ isOpen, onClose, onSave, currentOpsi }) => {
  const [namaOpsi, setNamaOpsi] = useState('');
  const [listOpsi, setListOpsi] = useState([{ pilihan: '', modal: '0', harga_jual: '0' }]);

  useEffect(() => {
    if (isOpen) {
      if (currentOpsi) {
        setNamaOpsi(currentOpsi.nama_opsi);
        // Pastikan list_opsi tidak kosong, jika kosong beri satu baris default
        setListOpsi(currentOpsi.list_opsi.length > 0 ? currentOpsi.list_opsi : [{ pilihan: '', modal: '0', harga_jual: '0' }]);
      } else {
        // Reset form untuk 'Tambah Baru'
        setNamaOpsi('');
        setListOpsi([{ pilihan: '', modal: '0', harga_jual: '0' }]);
      }
    }
  }, [currentOpsi, isOpen]);

  if (!isOpen) return null;

  const handleListOpsiChange = (index, field, value) => {
    const newList = [...listOpsi];
    newList[index][field] = value;
    setListOpsi(newList);
  };

  const handleAddRow = () => {
    setListOpsi([...listOpsi, { pilihan: '', modal: '0', harga_jual: '0' }]);
  };

  const handleRemoveRow = (index) => {
    // Hanya hapus jika baris lebih dari satu
    if (listOpsi.length > 1) {
      const newList = listOpsi.filter((_, i) => i !== index);
      setListOpsi(newList);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter baris yang pilihan-nya tidak kosong
    const filteredListOpsi = listOpsi.filter(item => item.pilihan.trim() !== '');
    if (filteredListOpsi.length === 0) {
      alert("Mohon isi setidaknya satu pilihan.");
      return;
    }
    const opsiData = {
      nama_opsi: namaOpsi,
      list_opsi: filteredListOpsi,
    };
    onSave(opsiData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{currentOpsi ? 'Edit Opsi Menu' : 'Tambah Opsi Menu'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nama Opsi</label>
            <input 
              type="text" 
              value={namaOpsi}
              onChange={(e) => setNamaOpsi(e.target.value)}
              placeholder="Contoh: Pilihan Kuah"
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Daftar Pilihan</label>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pilihan</th>
                  <th>Modal</th>
                  <th>Harga Jual</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {listOpsi.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={item.pilihan}
                        onChange={(e) => handleListOpsiChange(index, 'pilihan', e.target.value)}
                        placeholder="Cth: Kuah Pedas"
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.modal}
                        onChange={(e) => handleListOpsiChange(index, 'modal', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={item.harga_jual}
                        onChange={(e) => handleListOpsiChange(index, 'harga_jual', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <button type="button" onClick={() => handleRemoveRow(index)} className={styles.deleteButton} disabled={listOpsi.length <= 1}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={handleAddRow} className={styles.addRowButton}>
              <Plus size={16} /> Tambah Baris
            </button>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>Batal</button>
            <button type="submit" className={styles.btnPrimary}>Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Komponen Utama Halaman
export default function OpsiMenuPage() {
  const [opsiMenuList, setOpsiMenuList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentOpsi, setCurrentOpsi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

  // Fungsi Fetch Data
  const fetchOpsiMenu = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/opsi-menu`);
      setOpsiMenuList(response.data);
    } catch (error) {
      console.error("Error fetching opsi menu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpsiMenu();
  }, []);

  // Fungsi Handler untuk Simpan (Create/Update)
  const handleSave = async (opsiData) => {
    try {
      if (currentOpsi) {
        // Update
        await axios.put(`${API_URL}/opsi-menu/${currentOpsi._id}`, opsiData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
      } else {
        // Create
        await axios.post(`${API_URL}/opsi-menu`, opsiData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
      }
      fetchOpsiMenu(); // Refresh data
      closeModal();
    } catch (error) {
      console.error("Error saving opsi menu:", error);
    }
  };

  // Fungsi Handler untuk Hapus
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus opsi ini?')) {
      try {
        await axios.delete(`${API_URL}/opsi-menu/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        fetchOpsiMenu(); // Refresh data
      } catch (error) {
        console.error("Error deleting opsi menu:", error);
      }
    }
  };

  // Fungsi untuk membuka/menutup modal
  const openModal = (opsi = null) => {
    setCurrentOpsi(opsi);
    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentOpsi(null);
    setModalOpen(false);
  };

  // Fungsi untuk format tampilan list opsi di tabel utama
  const formatListOpsi = (list) => {
    if (!list || list.length === 0) return '-';
    return list.map(item => item.pilihan).join(', ');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manajemen Opsi Menu</h1>
        <button onClick={() => openModal()} className={styles.addButton}>
          <Plus size={20} />
          <span>Tambah Opsi</span>
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama Opsi</th>
                <th>Daftar Pilihan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {opsiMenuList.map((opsi) => (
                <tr key={opsi._id}>
                  <td>{opsi.nama_opsi}</td>
                  <td>{formatListOpsi(opsi.list_opsi)}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button onClick={() => openModal(opsi)} className={styles.editButton}><Edit size={18} /></button>
                      <button onClick={() => handleDelete(opsi._id)} className={styles.deleteButton}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <OpsiMenuModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSave} 
        currentOpsi={currentOpsi} 
      />
    </div>
  );
}
