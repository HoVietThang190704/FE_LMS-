import Navbar from '@/components/header/Navbar';

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
