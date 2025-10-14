"use client";

import { useEffect, useState } from 'react';
import styles from '../app/dashboard/whatsapp/WhatsappPage.module.css'; // Mengimpor CSS dari lokasi aslinya

export default function WhatsappGateway() {
  const [whatsappGatewayUrl, setWhatsappGatewayUrl] = useState('');

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_WHATSAPP_GATEWAY_URL) {
      setWhatsappGatewayUrl(process.env.NEXT_PUBLIC_WHATSAPP_GATEWAY_URL);
    } else {
      console.error("Environment variable NEXT_PUBLIC_WHATSAPP_GATEWAY_URL is not set.");
    }
  }, []);

  if (!whatsappGatewayUrl) {
    return <div className={styles.container}>Memuat URL Whatsapp Gateway...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Whatsapp Gateway</h1>
      <div className={styles.iframeWrapper}>
        <iframe
          src={whatsappGatewayUrl}
          title="Whatsapp Gateway"
          className={styles.iframe}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
