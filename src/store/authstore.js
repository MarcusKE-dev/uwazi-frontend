import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user:            null,   // { id, email, full_name, role }
  accessToken:     null,   // 15-min JWT — in memory only, never persisted
  isAuthenticated: false,

  // Called after successful login or register
  // data payload from backend: { user, accessToken } (both camelCase)
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),

  // Called on logout or failed refresh
  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),

  // Called by the Axios interceptor after a successful token refresh
  setAccessToken: (token) => set({ accessToken: token }),
}));