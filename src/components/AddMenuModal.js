"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './MenuTable.module.css';
import { X, Camera } from 'lucide-react';
import axios from 'axios';

export default function AddMenuModal({ isOpen, onClose, onMenuAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modal, setModal] = useState('');
  const [price, setPrice] = useState('');
  const [stok, setStok] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [opsiMenuList, setOpsiMenuList] = useState([]);
  const [selectedOpsi, setSelectedOpsi] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch opsi menu when modal opens
      const fetchOpsiMenu = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/opsi-menu`);
          setOpsiMenuList(response.data);
        } catch (error) {
          console.error("Error fetching opsi menu:", error);
        }
      };
      fetchOpsiMenu();

      // Reset form fields
      setName('');
      setDescription('');
      setModal('');
      setPrice('');
      setStok('');
      setImageFile(null);
      setSelectedOpsi([]);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpsiChange = (opsiId) => {
    setSelectedOpsi(prev => 
      prev.includes(opsiId) 
        ? prev.filter(id => id !== opsiId) 
        : [...prev, opsiId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('modal', modal);
    formData.append('price', price);
    formData.append('stok', stok);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    // Append selected opsi IDs
    selectedOpsi.forEach(opsiId => {
      formData.append('opsi[]', opsiId);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/menu`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Gagal menambahkan menu.' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      alert('Menu berhasil ditambahkan!');
      onMenuAdded();
      onClose();
    } catch (err) {
      setError(err.message);
      alert(`Gagal menambahkan menu: ${err.message}`);
      console.error('Error adding menu:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Tambah Menu Baru</h2>
          <button className={styles.modalCloseButton} onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.menuForm}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {/* Form fields for menu details */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Nama Menu</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Deskripsi</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="modal">Modal (Rp)</label>
            <input type="number" id="modal" value={modal} onChange={(e) => setModal(e.target.value)} required min="0" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="price">Harga Jual (Rp)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="stok">Stok</label>
            <input type="number" id="stok" value={stok} onChange={(e) => setStok(e.target.value)} required min="0" />
          </div>

          {/* Opsi Menu Checklist */}
          <div className={styles.formGroup}>
            <label>Opsi Menu (Opsional)</label>
            <div className={styles.checkboxContainer}>
              {opsiMenuList.map(opsi => (
                <div key={opsi._id} className={styles.checkboxItem}>
                  <input 
                    type="checkbox" 
                    id={`opsi-${opsi._id}`}
                    value={opsi._id}
                    checked={selectedOpsi.includes(opsi._id)}
                    onChange={() => handleOpsiChange(opsi._id)}
                  />
                  <label htmlFor={`opsi-${opsi._id}`}>{opsi.nama_opsi}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className={styles.formGroup}>
            <label>Gambar Menu</label>
            <div className={styles.imageUploadContainer}>
              <input
                type="file"
                ref={fileInputRef}
                className={styles.hiddenFileInput}
                accept="image/jpeg,image/png"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <button type="button" className={styles.cameraButton} onClick={() => fileInputRef.current.click()}>
                <Camera size={20} />
              </button>
              <span className={styles.fileName}>
                {imageFile ? imageFile.name : "Pilih gambar..."}
              </span>
            </div>
            <p className={styles.imageHint}>Gambar landscape ratio 4:3 (jpg, jpeg, png), maksimal 10 MB.</p>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>Batal</button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
