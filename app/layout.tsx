import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
