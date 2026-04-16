import { create } from 'zustand';

let id = 0;

export const useNotificationStore = create((set) => ({
  toasts: [],
  add:    (message, type = 'info') => set((s) => ({
    toasts: [...s.toasts, { id: ++id, message, type }]
  })),
  remove: (toastId) => set((s) => ({
    toasts: s.toasts.filter((t) => t.id !== toastId)
  })),
}));

export const toast = {
  success: (msg) => useNotificationStore.getState().add(msg, 'success'),
  error:   (msg) => useNotificationStore.getState().add(msg, 'error'),
  info:    (msg) => useNotificationStore.getState().add(msg, 'info'),
};
