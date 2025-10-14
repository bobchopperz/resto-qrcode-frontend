import type { Metadata } from "next";
// Hapus impor font khusus
// import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

// Hapus deklarasi font
// const geistSans = Geist(...);
// const geistMono = Geist_Mono(...);

export const metadata: Metadata = {
  title: "Bakso Sedap Nikmat",
  description: "Bakso pedas, sedap, nikmat yang siap disantap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Hapus kelas font dari body */}
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
