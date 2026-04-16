import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-uwazi-navy flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-7xl font-black text-blue-900 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-blue-400 mb-8">This page does not exist or has been moved.</p>
        <Link to={ROUTES.DASHBOARD}
          className="bg-uwazi-sky hover:bg-uwazi-blue text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
