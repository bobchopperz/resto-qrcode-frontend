"use client";

import { useEffect, useState } from 'react';
import styles from '../app/dashboard/whatsapp/WhatsappPage.module.css';

export default function WhatsappGateway() {
  const [whatsappGatewayUrl, setWhatsappGatewayUrl] = useState('');
  const [config, setConfig] = useState({
    'kitchen-forwarding': true,
    'waiter-forwarding': true,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      // URL diubah ke endpoint baru
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/whatsapp-config`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      } else {
        console.error("Gagal mengambil konfigurasi dari server.");
      }
    } catch (error) {
      console.error("Gagal mengambil konfigurasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig) => {
    try {
      const token = localStorage.getItem('accessToken');
      // URL diubah ke endpoint baru
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/whatsapp-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newConfig),
      });
      if (!response.ok) {
        throw new Error("Gagal menyimpan konfigurasi ke server.");
      }
    } catch (error) {
      console.error("Gagal menyimpan konfigurasi:", error);
      alert("Gagal menyimpan konfigurasi.");
    }
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_WHATSAPP_GATEWAY_URL) {
      setWhatsappGatewayUrl(process.env.NEXT_PUBLIC_WHATSAPP_GATEWAY_URL);
    }
    fetchConfig();
  }, []);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const newConfig = { ...config, [name]: checked };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  if (isLoading) {
    return <div className={styles.container}>Memuat konfigurasi...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Whatsapp Gateway</h1>

      <div className={styles.configWrapper}>
        <span className={styles.configLabel}>Konfigurasi Forwarding:</span>
        <div className={styles.switchGroup}>
          <div className={styles.switchControl}>
            <span>Kitchen Forwarding</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                name="kitchen-forwarding"
                checked={config['kitchen-forwarding']}
                onChange={handleCheckboxChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.switchControl}>
            <span>Waiter Forwarding</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                name="waiter-forwarding"
                checked={config['waiter-forwarding']}
                onChange={handleCheckboxChange}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.iframeWrapper}>
        {whatsappGatewayUrl ? (
          <iframe
            src={whatsappGatewayUrl}
            title="Whatsapp Gateway"
            className={styles.iframe}
            allowFullScreen
          ></iframe>
        ) : (
          <div className={styles.errorPlaceholder}>
            <p>URL Whatsapp Gateway tidak ditemukan.</p>
            <p>Mohon atur environment variable <code>NEXT_PUBLIC_WHATSAPP_GATEWAY_URL</code>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
