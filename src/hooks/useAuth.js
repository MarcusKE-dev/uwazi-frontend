import { useAuthStore } from '../store/authStore';
import { ROLES } from '../constants/roles';

export function useAuth() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const isAdmin      = ['admin', 'super_admin'].includes(user?.role);
  const isReviewer   = ['reviewer', 'admin', 'super_admin'].includes(user?.role);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  return { user, isAuthenticated, isAdmin, isReviewer, isSuperAdmin, clearAuth };
}
