import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileNav } from '@/components/dashboard/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-mesh-gradient animate-mesh opacity-10 blur-3xl" />
      
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="lg:pl-64 relative z-10">
        <main className="min-h-screen pb-20 lg:pb-0">
          {children}
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}