import { FileSearch } from 'lucide-react';
export default function EmptyState({ message = 'No data found', sub = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FileSearch size={40} className="text-slate-300 dark:text-blue-900 mb-3" />
      <p className="text-slate-500 dark:text-blue-400 font-medium">{message}</p>
      {sub && <p className="text-slate-400 dark:text-blue-600 text-sm mt-1">{sub}</p>}
    </div>
  );
}
