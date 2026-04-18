import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout      from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth pages (no sidebar)
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import TrackCasePage      from './pages/cases/TrackCasePage';

// Protected app pages (sidebar + topbar)
import DashboardPage  from './pages/dashboard/DashboardPage';
import AnalyticsPage  from './pages/analytics/AnalyticsPage';
import CaseListPage   from './pages/cases/CaseListPage';
import CaseDetailPage from './pages/cases/CaseDetailPage';
import SubmitCasePage from './pages/cases/SubmitCasePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage   from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/track"           element={<TrackCasePage />} />

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/"             element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"    element={<DashboardPage />} />
          <Route path="/analytics"    element={<AnalyticsPage />} />
          <Route path="/cases"        element={<CaseListPage />} />
          <Route path="/cases/submit" element={<SubmitCasePage />} />
          <Route path="/cases/:id"    element={<CaseDetailPage />} />
        </Route>
      </Route>

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
