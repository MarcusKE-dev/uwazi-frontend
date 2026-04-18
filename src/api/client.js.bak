import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const client = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  headers:         { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout:         15000,
});

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — auto-refresh token
let refreshing = false;
let queue       = [];

client.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      if (refreshing) {
        return new Promise((res, rej) =>
          queue.push({ resolve: res, reject: rej })
        ).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return client(original);
        });
      }
      original._retry = true;
      refreshing      = true;
      try {
        const res      = await client.post('/auth/refresh');
        const newToken = res.data.accessToken;  // camelCase — matches backend
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
    return Promise.reject(err.response?.data?.error || err.message);
  }
);

export default client;
