"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './DashboardPage.module.css'; // Import CSS Module

export default function DashboardPage() {
  const [userName, setUserName] = useState('Kakak'); // Default value
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {

    // Fungsi untuk mendekode JWT dan mendapatkan nama pengguna
    const decodeJwt = (token) => {
      try {
        // JWT terdiri dari 3 bagian: header.payload.signature
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
      }
    };

    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = decodeJwt(token);

      // console.log("Decoded JWT Token:", decodedToken); // whitebox isi JWT token

      if (decodedToken && decodedToken.username) { // ini untuk naman panggilan username di dashboard

        // setUserName(decodedToken.username);
        setUserName(decodedToken.name);
        setIsAuthorized(true);
      }
    } else {
        router.push('/login');
    }
  }, [router]);

  if(!isAuthorized){
      return null; // jangan render apapun sebelum authorized
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Selamat Datang, {userName}</h1>
      <p className={styles.content}>Ini adalah halaman utama dashboard. Silakan pilih menu di sidebar untuk navigasi.</p>
    </div>
  );
}
