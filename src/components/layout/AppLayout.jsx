import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar  from './TopBar';
import { useUIStore } from '../../store/uiStore';

export default function AppLayout() {
  const { sidebarOpen } = useUIStore();
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-uwazi-navy overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}