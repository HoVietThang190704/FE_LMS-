import type { Metadata } from 'next';
import './globals.css';
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
          {children}
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
