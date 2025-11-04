"use client";

import { useState, useEffect } from 'react';
import styles from './UserTable.module.css';
import { X } from 'lucide-react';

export default function EditUserModal({ isOpen, onClose, onUserUpdated, user }) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [handphone, setHandphone] = useState('');
  const [role, setRole] = useState('staff');
  const [password, setPassword] = useState(''); // Password opsional untuk update
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username || '');
      setName(user.name || '');
      setHandphone(user.handphone || '');
      setRole(user.role || 'staff');
      setPassword(''); // Reset password field saat modal dibuka
      setError(null);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const userData = {
      username,
      name,
      handphone,
      role,
    };

    // Hanya tambahkan password jika diisi
    if (password) {
      userData.password = password;
    }

    try {
      const token = localStorage.getItem('accessToken'); // Ambil token dari localStorage
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/user/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Tambahkan header Authorization
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Gagal memperbarui user.' }));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      alert('User berhasil diperbarui!');
      onUserUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
      alert(`Gagal memperbarui user: ${err.message}`);
      console.error('Error updating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit User</h2>
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
            <label htmlFor="handphone">No. Handphone dimulai pake 62 ya</label>
            <input
              type="text"
              id="handphone"
              value={handphone}
              onChange={(e) => setHandphone(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
                <option value="staff">Staff</option>
                <option value="kitchen">Kitchen</option>
                <option value="waiter">Waiter</option>
                <option value="admin">Admin</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password Baru (kosongkan jika tidak ingin mengubah)</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>Batal</button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Memperbarui...' : 'Perbarui User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
