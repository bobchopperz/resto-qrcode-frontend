"use client";

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import styles from '../../components/Sidebar.module.css'; // Kita masih pakai style dari sidebar untuk layout utama

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={styles.dashboardContainer}> {/* Wrapper untuk seluruh layout */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <main className={`${styles.mainContent} ${isCollapsed ? styles.mainCollapsed : ''}`}>
        {children}
      </main>
    </div>
  );
}
