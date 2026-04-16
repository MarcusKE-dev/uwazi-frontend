import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar  from './TopBar';
import { useUIStore } from '../../store/uiStore';

export default function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  useEffect(() => {
    const check = () => { if (window.innerWidth < 768 && sidebarOpen) toggleSidebar(); };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-uwazi-navy">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
