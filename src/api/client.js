import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // http://localhost:3000/api/v1
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // REQUIRED: sends the httpOnly refreshToken cookie
  timeout: 15000,
});

// ── REQUEST INTERCEPTOR — attach JWT to every request ──
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── RESPONSE INTERCEPTOR — unwrap envelope, auto-refresh on 401 ──
let refreshing = false;
let queue = [];

client.interceptors.response.use(
  // Success: unwrap { success: true, data: payload } → return payload directly
  (res) => res.data.data,

  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((resolve, reject) =>
          queue.push({ resolve, reject })
        ).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return client(original);
        });
      }

      original._retry = true;
      refreshing = true;

      try {
        // POST /auth/refresh — backend reads refreshToken from httpOnly cookie
        // Response payload (after interceptor): { accessToken: "eyJ..." }
        const payload = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = payload.data.data.accessToken;  // ← camelCase from backend

        useAuthStore.getState().setAccessToken(newToken);
        queue.forEach((p) => p.resolve(newToken));
        queue = [];

        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      } catch {
        queue.forEach((p) => p.reject());
        queue = [];
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      } finally {
        refreshing = false;
      }
    }

    // Return the structured error for components to handle
    return Promise.reject(err.response?.data?.error || err.message);
  }
);

export default client;