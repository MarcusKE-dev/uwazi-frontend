import { Search, Moon, Sun, Bell, LogOut } from 'lucide-react';
import { useUIStore }  from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { authService }  from '../../api/auth.service';
import { useNavigate }  from 'react-router-dom';

export default function TopBar() {
  const { darkMode, toggleDarkMode } = useUIStore();
  const { user, clearAuth }          = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authService.logout(); } catch {}
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="h-14 flex items-center px-5 gap-3 shrink-0
      bg-white dark:bg-uwazi-navy border-b border-slate-200 dark:border-blue-900/50">
      <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-uwazi-dark
        rounded-lg px-3 py-2 border border-slate-200 dark:border-blue-900/50">
        <Search size={15} className="text-slate-400" />
        <input placeholder="Search cases, counties..."
          className="bg-transparent text-sm text-slate-600 dark:text-blue-200 outline-none flex-1" />
      </div>
      <button onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/30 text-slate-500 dark:text-blue-300">
        {darkMode ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/30 text-slate-500 dark:text-blue-300">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>
      {user && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-uwazi-blue text-white text-sm
            flex items-center justify-center font-bold shrink-0">
            {user.full_name?.[0] ?? 'U'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-tight">{user.full_name}</p>
            <p className="text-xs text-slate-400 dark:text-blue-400 capitalize">{user.role}</p>
          </div>
        </div>
      )}
      <button onClick={handleLogout}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-900/30 text-slate-400 dark:text-blue-400"
        title="Log out">
        <LogOut size={16} />
      </button>
    </header>
  );
}
