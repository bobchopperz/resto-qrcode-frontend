"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { ChevronLeft, LayoutDashboard, ClipboardList, BarChart2, Salad, LogOut, Users, MessageCircleReply } from 'lucide-react';

// Daftar menu untuk sidebar
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/dashboard/menu', label: 'Menu', icon: <ClipboardList size={20} /> },
  { href: '/dashboard/sales', label: 'Penjualan', icon: <BarChart2 size={20} /> },
  { href: '/dashboard/whatsapp', label: 'Whatsapp', icon: <MessageCircleReply size={20} /> },
  { href: '/dashboard/users', label: 'User', icon: <Users size={20} /> }, // Label diubah menjadi 'User'
];

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const router = useRouter();

  const handleLogout = () => {
    // Di sini nanti bisa ditambahkan logika untuk hapus token/session
    router.push('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarMain}> {/* Wrapper baru untuk konten utama sidebar */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <Salad size={30} className={styles.logoIcon} />
            {!isCollapsed && <span className={styles.logoText}>Resto Admin</span>}
          </div>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <ChevronLeft size={20} />
          </button>
        </div>
        <nav className={styles.sidebarNav}>
          <ul>
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.menuLink}>
                  {item.icon}
                  {!isCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Tombol Logout di bagian bawah */}
      <div className={styles.sidebarFooter}>
        <button onClick={handleLogout} className={styles.menuLink}>
          <LogOut size={20} />
          {!isCollapsed && <span className={styles.menuLabel}>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
