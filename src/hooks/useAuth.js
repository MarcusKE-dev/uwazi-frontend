import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const hasRole = (...roles) => roles.includes(user?.role);
  const isAdmin      = hasRole('admin', 'super_admin');
  const isReviewer   = hasRole('reviewer', 'admin', 'super_admin');
  const isSuperAdmin = hasRole('super_admin');

  return { user, isAuthenticated, isAdmin, isReviewer, isSuperAdmin, clearAuth };
}