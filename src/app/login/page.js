
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import soupIcon from '../soup.svg'; // Impor ikon SVG

// Ganti dengan URL base backend Anda.
const API_BASE_URL = 'http://localhost:3001';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // const response = await fetch(`${API_BASE_URL}/user/login`, { //13:36 28/10/2025 bug is found by rheza, rupanya karena pointing ke localhost
	  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Username atau password salah.');
      }

      if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
        router.push('/dashboard');
      } else {
        throw new Error('Token tidak ditemukan di dalam respons dari server.');
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Latar belakang putih
    <main className="bg-white min-h-screen flex items-center justify-center p-4">
      {/* Kartu login dengan bayangan, tanpa border merah */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl text-center">
        
        {/* Ikon kembali ke warna default (gelap) */}
        <Image src={soupIcon} alt="Ikon Bakso" width={64} height={64} className="mx-auto mb-4 text-gray-800" />

        {/* Judul dan Subjudul */}
        <h1 className="text-2xl font-bold mb-1 text-gray-900">Bakso Sedap Nikmat</h1>
        <p className="text-gray-600 mb-8">Akses Laman Khusus Staff</p>

        {/* Form Login */}
        <form onSubmit={handleLogin}>
          {/* Input Username */}
          <div className="mb-4">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Masukkan Username"
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            />
          </div>

          {/* Input Password */}
          <div className="mb-6">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan Password"
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
            />
          </div>

          {/* Pesan Error */}
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 rounded-lg px-4 py-3 text-white font-semibold transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
