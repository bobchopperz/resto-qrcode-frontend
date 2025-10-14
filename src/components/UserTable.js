"use client";

import { useState, useEffect } from 'react';
import styles from './UserTable.module.css';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken'); // Diubah dari 'token' menjadi 'accessToken'
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Gagal mengambil data pengguna. Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Apakah Kakak yakin ingin menghapus pengguna ini?')) {
      try {
        const token = localStorage.getItem('accessToken'); // Diubah dari 'token' menjadi 'accessToken'
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Gagal menghapus pengguna.' }));
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        alert('Pengguna berhasil dihapus!');
        fetchUsers(); // Refresh daftar pengguna
      } catch (err) {
        alert(`Gagal menghapus pengguna: ${err.message}`);
        console.error('Error deleting user:', err);
      }
    }
  };

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <h1>Daftar Pengguna</h1>
        <button className={styles.addButton} onClick={handleAddClick}>
          <Plus size={18} />
          <span>Tambah Pengguna</span>
        </button>
      </div>
      {isLoading ? (
        <p>Memuat data pengguna...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Nama</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td data-label="Username">{user.username}</td>
                  <td data-label="Nama">{user.name}</td>
                  <td data-label="Role">{user.role}</td>
                  <td data-label="Aksi">
                    <div className={styles.actionButtons}>
                      <button 
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDelete(user._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>Belum ada pengguna.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modals untuk Tambah dan Edit Pengguna */}
      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onUserAdded={fetchUsers} 
      />
      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUserUpdated={fetchUsers} 
        user={userToEdit} 
      />
    </div>
  );
}
