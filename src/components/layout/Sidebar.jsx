import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, BarChart2,
  ShieldCheck, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/auth.service';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

const NAV = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cases',        icon: FolderOpen,      label: 'Cases' },
  { to: '/analytics',    icon: BarChart2,       label: 'Analytics' },
];
const ADMIN_NAV = [
  { to: '/admin',       icon: ShieldCheck,     label: 'Admin' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, isAdmin, clearAuth }   = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authService.logout(); } catch {}
    clearAuth();
    navigate('/login');
  };

  const linkClass = ({ isActive }) => cn(
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150',
    isActive
      ? 'bg-uwazi-blue text-white font-semibold shadow-sm'
      : 'text-blue-200 hover:bg-white/10 hover:text-white'
  );

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-uwazi-navy border-r border-blue-900/50',
      'transition-all duration-200',
      sidebarOpen ? 'w-60' : 'w-16'
    )}>

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-900/50">
        {sidebarOpen && (
          <div>
            <span className="text-xl font-black text-white tracking-tight">UWAZI</span>
            <p className="text-xs text-blue-400 font-medium">FINANCIAL INTELLIGENCE</p>
          </div>
        )}
        <button onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-white/10">
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon size={18} className="flex-shrink-0" />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            {sidebarOpen && (
              <p className="text-xs font-bold text-blue-600 px-3 pt-4 pb-1 uppercase tracking-wider">
                Admin
              </p>
            )}
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-blue-900/50">
        {sidebarOpen && (
          <div className="mb-2 px-3 py-2 rounded-lg bg-white/5">
            <p className="text-sm font-semibold text-white truncate">{user?.full_name || user?.email}</p>
            <p className="text-xs text-blue-400 capitalize">{user?.role}</p>
          </div>
        )}
        <button onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400',
            'hover:bg-red-500/10 hover:text-red-300 w-full transition-colors'
          )}>
          <LogOut size={18} className="flex-shrink-0" />
          {sidebarOpen && 'Logout'}
        </button>
      </div>
    </aside>
  );
}