
"use client";

import { useState, useEffect } from 'react';
import styles from './DailySales.module.css';
import DateID from '@/lib/dateId';
import { MantineProvider } from '@mantine/core';
import MonthPickerDropdown from './MonthPickerDropdown';

// --- Helper & Utility Functions ---
const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number || 0);
};

// --- Child Component (Modal dengan Accordion) ---
function DailyDetailModal({ dayData, onClose }) {
  const [openAccordionId, setOpenAccordionId] = useState(null);

  if (!dayData) return null;

  const handleToggleAccordion = (transactionId) => {
    setOpenAccordionId(currentId => (currentId === transactionId ? null : transactionId));
  };

  return (
    <div className={styles.dailyModalBackdrop} onClick={onClose}>
      <div className={styles.dailyModalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Rincian Transaksi Harian</h2>
          <h2>{dayData.formattedDate}</h2>
          <button className={styles.closeButton} onClick={onClose}>X</button>
        </div>

        <div>
          {dayData.transactions.map(transaction => (
            <div key={transaction._id} className={styles.transactionItem}>
              <p className={styles.transactionHeader}>Pelanggan : {transaction.nama_pelanggan || 'N/A'}</p>
              <div className={styles.transactionDetails}>
                <span><strong>No. WA :</strong> {transaction.no_wa_pelanggan || '-'}</span>
                <span><strong>Total :</strong> {formatRupiah(transaction.total_kesuluruhan)}</span>
                <span><strong>Modal :</strong> {formatRupiah(transaction.total_modal_keseluruhan)}</span>
                <span><strong>Margin :</strong> {formatRupiah(transaction.total_margin_keseluruhan)}</span>
              </div>
              <div className={styles.transactionActions}>
                <button className={styles.button} onClick={() => handleToggleAccordion(transaction._id)}>
                  {openAccordionId === transaction._id ? 'Tutup Detail' : 'Lihat Detail Order'}
                </button>
              </div>

              {openAccordionId === transaction._id && (
                <div className={styles.accordionContent}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.th}>Menu</th>
                        <th className={styles.th}>Kuantiti</th>
                        <th className={styles.th}>Sub-Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaction.orders.map((order, index) => (
                        <tr key={index}>
                          <td className={styles.td}>{order.name}</td>
                          <td className={styles.td}>{order.kuantiti}</td>
                          <td className={styles.td}>{formatRupiah(order.sub_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.modalFooter}>
          <strong>Total Penjualan Hari Ini: {formatRupiah(dayData.totalSales)}</strong>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
function DailySalesContent() {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setAggregatedData([]);

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/order/${year}/${month}`;

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          console.error(`HTTP error! Status: ${response.status}, dari ${endpoint}.`);
          return;
        }

        const data = await response.json();
        processAndSetData(data);

      } catch (error) {
        console.error(`Gagal fetch. Error: ${error.message}`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const processAndSetData = (transactions) => {
    if (!transactions || transactions.length === 0) {
      setAggregatedData([]);
      return;
    }
    const dailyGroups = transactions.reduce((acc, transaction) => {
      if (!transaction.timestamp) {
        console.warn('Transaksi dilewati karena tidak ada timestamp:', transaction);
        return acc;
      }

      const dateObj = new Date(transaction.timestamp);
      if (isNaN(dateObj.getTime())) {
        console.warn('Transaksi dilewati karena timestamp tidak valid:', transaction.timestamp, transaction);
        return acc;
      }

      const dateKey = dateObj.toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateObj, formattedDate: new DateID(dateObj).format('d-MMM-yyyy'), totalSales: 0, totalMargin: 0, totalModal: 0, transactions: [] };
      }
      acc[dateKey].totalSales += transaction.total_kesuluruhan;
      acc[dateKey].totalMargin += transaction.total_margin_keseluruhan;
      acc[dateKey].totalModal += transaction.total_modal_keseluruhan;
      acc[dateKey].transactions.push(transaction);
      return acc;
    }, {});
    const sortedData = Object.values(dailyGroups).sort((a, b) => b.date - a.date);
    setAggregatedData(sortedData);
  };

  return (
    <div className={styles.container}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 className={styles.title}>Ringkasan Penjualan Bulanan</h1>
        <div className={styles.controlsContainer}>
          <MonthPickerDropdown
            value={selectedDate}
            onChange={setSelectedDate}
          />
        </div>
      </div>

      {isLoading ? (
        <p style={{textAlign: 'center', margin: '2rem'}}>Memuat data ...</p>
      ) : (
        <ul className={styles.list}>
            <li className={`${styles.listItem} ${styles.dateText} ${styles.liHeader}`}>
                <span>Tanggal</span>
                <span>Total Margin</span>
                <span>Total Penjualan</span>
                <span></span>
            </li>
            {aggregatedData.length > 0 ? (
                aggregatedData.map((day) => (
                <li key={day.date} className={styles.listItem}>
                    <span className={styles.dateText}>{day.formattedDate}</span>
                    <span className={styles.marginText}>{formatRupiah(day.totalMargin)}</span>
                    <span className={styles.totalText}>{formatRupiah(day.totalSales)}</span>
                    <button className={styles.button} onClick={() => setSelectedDay(day)}>
                    Rincian
                    </button>
                </li>
                ))
            ) : (
                <p style={{textAlign: 'center', margin: '2rem'}}>Tidak ada data untuk periode ini.</p>
            )}
        </ul>
      )}

      <DailyDetailModal 
        dayData={selectedDay} 
        onClose={() => setSelectedDay(null)} 
      />
    </div>
  );
}

export default function DailySales() {
  return (
    <MantineProvider>
      <DailySalesContent />
    </MantineProvider>
  );
}
