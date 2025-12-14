import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/header/Navbar';
import { ToastProvider } from '@/app/context/ToastContext';
import ToastContainer from '@/components/toast/ToastContainer';

export const metadata: Metadata = {
  title: 'EduVN - Hệ thống quản lý học tập',
  description: 'Hệ thống quản lý học tập trực tuyến',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <ToastProvider>
          <Navbar />
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
