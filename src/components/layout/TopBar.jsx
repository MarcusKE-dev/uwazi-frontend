import { Search, Moon, Sun } from 'lucide-react';
import { useUIStore }  from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

export default function TopBar() {
  const { darkMode, toggleDarkMode } = useUIStore();
  const { user } = useAuthStore();

  return (
    <header className="h-14 flex items-center px-4 gap-4
      bg-white dark:bg-uwazi-navy border-b border-gray-200 dark:border-blue-900/50">

      <div className="flex-1 flex items-center gap-2
        bg-gray-50 dark:bg-uwazi-dark rounded-lg px-3 py-2
        border border-gray-200 dark:border-blue-900/50">
        <Search size={15} className="text-gray-400" />
        <input
          placeholder="Search cases, tracking codes..."
          className="bg-transparent text-sm text-gray-600 dark:text-blue-200 outline-none flex-1"
        />
      </div>

      <button onClick={toggleDarkMode}
        className="p-2 rounded-lg text-gray-500 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-blue-900/20">
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-uwazi-blue flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {user?.full_name?.[0] || user?.email?.[0] || 'U'}
          </span>
        </div>
        {user && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full
            bg-uwazi-pale text-uwazi-blue dark:bg-blue-900/30 dark:text-blue-300 capitalize">
            {user.role}
          </span>
        )}
      </div>
    </header>
  );
}