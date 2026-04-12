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
