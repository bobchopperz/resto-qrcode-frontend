"use client";

import { useState, useEffect, useRef } from 'react'; // Impor useRef
import styles from './MenuTable.module.css';
import { X, Camera } from 'lucide-react'; // Impor Camera

export default function EditMenuModal({ isOpen, onClose, onMenuUpdated, menuItem }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modal, setModal] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Ref untuk input file

  useEffect(() => {
    if (isOpen && menuItem) {
      setName(menuItem.name || '');
      setDescription(menuItem.description || '');
      setModal(menuItem.modal || '');
      setPrice(menuItem.price || '');
      setImageFile(null);
      setError(null);
    }
  }, [isOpen, menuItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('modal', modal);
    formData.append('price', price);
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/menu/${menuItem._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Gagal memperbarui menu.' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      alert('Menu berhasil diperbarui!');
      onMenuUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
      alert(`Gagal memperbarui menu: ${err.message}`);
      console.error('Error updating menu:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit Menu</h2>
          <button className={styles.modalCloseButton} onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.menuForm}>
          {error && <p className={styles.errorMessage}>{error}</p>}
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
                {imageFile ? imageFile.name : "Pilih gambar baru..."}
              </span>
            </div>
            <p className={styles.imageHint}>Kosongkan jika tidak ingin mengubah. Gambar landscape ratio 4:3 (jpg, jpeg, png), maksimal 10 MB.</p>
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>Batal</button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Memperbarui...' : 'Perbarui Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
