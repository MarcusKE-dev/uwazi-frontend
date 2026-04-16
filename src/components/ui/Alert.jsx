import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { useState } from 'react';

const CONFIG = {
  success: { icon: CheckCircle, cls: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' },
  error:   { icon: XCircle,     cls: 'bg-red-50   text-red-800   border-red-200   dark:bg-red-900/20   dark:text-red-300   dark:border-red-800'   },
  warn:    { icon: AlertCircle, cls: 'bg-amber-50  text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800' },
  info:    { icon: Info,        cls: 'bg-blue-50   text-blue-800  border-blue-200  dark:bg-blue-900/20  dark:text-blue-300  dark:border-blue-800'  },
};

export default function Alert({ variant = 'info', message, dismissible = false }) {
  const [visible, setVisible] = useState(true);
  if (!visible || !message) return null;
  const { icon: Icon, cls } = CONFIG[variant] ?? CONFIG.info;
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cls} mx-6 my-4`}>
      <Icon size={16} className="shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="opacity-60 hover:opacity-100">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
