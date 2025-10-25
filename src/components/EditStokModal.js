"use client";

import { useState, useEffect } from 'react';
import styles from './StokTable.module.css';
import { X } from 'lucide-react';
import { MantineProvider } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import 'dayjs/locale/id';

const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export default function EditStokModal({ isOpen, onClose, onStokUpdated, stokItem, menuItems }) {
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [modal, setModal] = useState('');
  const [hargaJual, setHargaJual] = useState('');
  const [tanggalRestok, setTanggalRestok] = useState(null);
  const [jam, setJam] = useState('00');
  const [menit, setMenit] = useState('00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && stokItem) {
      const timezone = process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Jakarta';
      const restokDate = new Date(stokItem.tanggal_restok);

      const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone,
      });
      const [currentHour, currentMinute] = timeFormatter.format(restokDate).split(':');

      setSelectedMenuId(stokItem.menu_id?._id || '');
      setQuantity(stokItem.kuantiti || '');
      setModal(stokItem.modal || '');
      setHargaJual(stokItem.harga_jual || '');
      setTanggalRestok(restokDate);
      setJam(currentHour);
      setMenit(currentMinute);
    }
  }, [isOpen, stokItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalDateTime = new Date(tanggalRestok);
    finalDateTime.setHours(parseInt(jam, 10), parseInt(menit, 10), 0, 0);

    const stokData = {
      menu_id: selectedMenuId,
      kuantiti: parseInt(quantity, 10),
      modal: parseFloat(modal),
      harga_jual: parseFloat(hargaJual),
      tanggal_restok: finalDateTime.toISOString(),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/stok/${stokItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stokData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Gagal memperbarui stok.' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      alert('Catatan stok berhasil diperbarui!');
      onStokUpdated();
      onClose();
    } catch (err) {
      alert(`Gagal: ${err.message}`);
      console.error('Error updating stok:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <MantineProvider>
          <div className={styles.modalHeader}>
            <h2>Edit Catatan Stok</h2>
            <button className={styles.modalCloseButton} onClick={onClose}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit} className={styles.stokForm}>
            <div className={styles.formGroup}>
              <label htmlFor="menu-edit">Pilih Menu</label>
              <select id="menu-edit" value={selectedMenuId} onChange={(e) => setSelectedMenuId(e.target.value)} required>
                <option value="" disabled>-- Pilih Menu --</option>
                {menuItems.map(item => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="quantity-edit">Kuantiti</label>
              <input type="number" id="quantity-edit" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="0" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="modal-edit">Modal (per item)</label>
              <input type="number" id="modal-edit" value={modal} onChange={(e) => setModal(e.target.value)} required min="0" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hargaJual-edit">Harga Jual (per item)</label>
              <input type="number" id="hargaJual-edit" value={hargaJual} onChange={(e) => setHargaJual(e.target.value)} required min="0" />
            </div>
            <div className={styles.formGroup}>
              <label>Waktu Restok</label>
              <div className={styles.dateTimeContainer}>
                <DatePickerInput
                  locale="id"
                  value={tanggalRestok}
                  onChange={setTanggalRestok}
                  placeholder="Pilih tanggal"
                  valueFormat="DD MMMM YYYY"
                  required
                  popoverProps={{ zIndex: 2001 }}
                  style={{ flex: 1 }}
                />
                <select value={jam} onChange={(e) => setJam(e.target.value)} required>
                  {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select value={menit} onChange={(e) => setMenit(e.target.value)} required>
                  {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>Batal</button>
              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Memperbarui...' : 'Perbarui Catatan'}
              </button>
            </div>
          </form>
        </MantineProvider>
      </div>
    </div>
  );
}
