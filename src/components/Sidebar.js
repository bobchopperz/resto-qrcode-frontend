"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { ChevronLeft, LayoutDashboard, ClipboardList, BarChart2, Salad, LogOut, Users, MessageCircleReply, Menu as MenuIcon, CookingPot, SquareCheck } from 'lucide-react'; // Ganti ke SquareCheck

// Daftar menu untuk sidebar
const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/dashboard/menu', label: 'Menu', icon: <ClipboardList size={20} /> },
  { href: '/dashboard/opsi-menu', label: 'Opsi Menu', icon: <SquareCheck size={20} /> }, // Ganti ikon di sini
  { href: '/dashboard/stok', label: 'Stok', icon: <CookingPot size={20} /> },
  { href: '/dashboard/sales', label: 'Penjualan', icon: <BarChart2 size={20} /> },
  { href: '/dashboard/whatsapp', label: 'Whatsapp', icon: <MessageCircleReply size={20} /> },
  { href: '/dashboard/users', label: 'User', icon: <Users size={20} /> },
];

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Hapus token dari localStorage untuk "logout"
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
      <div className={styles.sidebarMain}>
        <div className={styles.sidebarHeader}>
          <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
            <MenuIcon size={25} />
          </button>

          <div className={styles.logoContainer}>
            <Salad size={30} className={styles.logoIcon} />
            {!isCollapsed && <span className={styles.logoText}>Resto Admin</span>}
          </div>

          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className={styles.navWrapper}>
          <nav className={styles.sidebarNav}>
            <ul>
              {menuItems.map((item) => (
                <li key={item.href} onClick={handleMobileLinkClick}>
                  <Link href={item.href} className={styles.menuLink}>
                    {item.icon}
                    {!isCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.menuLink}>
              <LogOut size={20} />
              {!isCollapsed && <span className={styles.menuLabel}>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
