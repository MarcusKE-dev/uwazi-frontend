import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart2, FileText, ShieldCheck, PlusCircle, Menu, X } from 'lucide-react';
import { useUIStore }  from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

const MAIN_NAV = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/cases',         icon: FileText,        label: 'Cases'        },
  { to: '/analytics',     icon: BarChart2,        label: 'Analytics'   },
  { to: '/cases/submit',  icon: PlusCircle,      label: 'Report Case'  },
];

const ADMIN_NAV = [
  { to: '/admin', icon: ShieldCheck, label: 'Admin Panel' },
];

const linkCls = ({ isActive }) => cn(
  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
  isActive
    ? 'bg-blue-600 text-white font-semibold shadow-sm'
    : 'text-blue-200 hover:bg-white/10 hover:text-white'
);

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const isAdmin = ['admin', 'super_admin'].includes(user?.role);

  return (
    <aside className={cn(
      'h-screen flex flex-col border-r border-blue-900/50 bg-uwazi-navy transition-all duration-200 shrink-0',
      sidebarOpen ? 'w-60' : 'w-16'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-blue-900/50 flex items-center justify-between">
        {sidebarOpen && (
          <div>
            <span className="text-lg font-black text-white tracking-wide">UWAZI</span>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest">Finance Intelligence</p>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-white/10 text-blue-300">
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarOpen && <p className="text-[10px] text-blue-700 uppercase tracking-widest px-2 py-1 font-bold">Main</p>}
        {MAIN_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkCls}>
            <Icon size={18} />
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        ))}
        {isAdmin && (
          <>
            {sidebarOpen && <p className="text-[10px] text-blue-700 uppercase tracking-widest px-2 pt-4 pb-1 font-bold">Admin</p>}
            {ADMIN_NAV.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={linkCls}>
                <Icon size={18} />
                {sidebarOpen && <span>{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      {sidebarOpen && user && (
        <div className="p-4 border-t border-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold shrink-0">
              {user.full_name?.[0] ?? 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
              <p className="text-xs text-blue-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
