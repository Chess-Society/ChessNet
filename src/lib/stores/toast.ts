import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function add(message: string, type: ToastType = 'success', duration = 3000) {
    const id = crypto.randomUUID();
    update(all => [{ id, message, type, duration }, ...all]);

    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
  }

  function remove(id: string) {
    update(all => all.filter(t => t.id !== id));
  }

  return {
    subscribe,
    success: (m: string) => add(m, 'success'),
    error: (m: string) => add(m, 'error'),
    info: (m: string) => add(m, 'info'),
    warning: (m: string) => add(m, 'warning'),
    remove
  };
}

export const toast = createToastStore();

// Compatibility layer for legacy utils/toast.ts imports
export const toasts = toast;
export const showToast = toast;
export const removeToast = toast.remove;
export const showError = (
  error: any,
  defaultMessage: string = "Ha ocurrido un error",
) => {
  const message = error?.message || error?.error_description || defaultMessage;
  toast.error(typeof error === 'string' ? error : message);
};
