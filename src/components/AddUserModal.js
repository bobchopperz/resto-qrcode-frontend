"use client";

import { useState } from 'react';
import styles from './UserTable.module.css';
import { X } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const userData = {
      username,
      password,
      name,
      role,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Gagal menambahkan pengguna.' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      alert('Pengguna berhasil ditambahkan!');
      onUserAdded(); // Beri tahu parent untuk refresh data
      onClose(); // Tutup modal
      // Reset form
      setUsername('');
      setPassword('');
      setName('');
      setRole('user');
    } catch (err) {
      setError(err.message);
      alert(`Gagal menambahkan pengguna: ${err.message}`);
      console.error('Error adding user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Tambah Pengguna Baru</h2>
          <button className={styles.modalCloseButton} onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.userForm}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>Batal</button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
