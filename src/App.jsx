import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout       from './components/layout/AppLayout';
import ProtectedRoute  from './components/layout/ProtectedRoute';

// Auth pages (no sidebar)
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
// NOTE: No ForgotPasswordPage — backend auth/forgot-password not in MVP

// Main app pages
import DashboardPage  from './pages/dashboard/DashboardPage';
import CaseListPage   from './pages/cases/CaseListPage';
import CaseDetailPage from './pages/cases/CaseDetailPage';
import SubmitCasePage from './pages/cases/SubmitCasePage';
import TrackCasePage  from './pages/cases/TrackCasePage';
import AnalyticsPage  from './pages/analytics/AnalyticsPage';
import AdminPage      from './pages/admin/AdminPage';
import NotFoundPage   from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* ─ Public routes ─ */}
      <Route path='/login'    element={<LoginPage />}   />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/track'    element={<TrackCasePage />}/>

      {/* ─ Auth-required routes ─ */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path='/'              element={<Navigate to='/dashboard' replace />} />
          <Route path='/dashboard'     element={<DashboardPage />}  />
          <Route path='/cases'          element={<CaseListPage />}   />
          <Route path='/cases/submit'   element={<SubmitCasePage />} />
          <Route path='/cases/:id'      element={<CaseDetailPage />} />
          <Route path='/analytics'      element={<AnalyticsPage />}  />
        </Route>
      </Route>

      {/* ─ Admin-only routes ─ */}
      <Route element={<ProtectedRoute allowedRoles={['admin','super_admin']} />}>
        <Route element={<AppLayout />}>
          <Route path='/admin' element={<AdminPage />} />
        </Route>
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}