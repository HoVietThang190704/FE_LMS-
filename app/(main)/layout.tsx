import Navbar from '@/components/header/Navbar';
import SupportChatWidget from '@/components/support/SupportChatWidget';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <SupportChatWidget />
    </div>
  );
}
