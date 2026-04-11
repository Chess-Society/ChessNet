import { writable } from "svelte/store";

// Simple toast system compatible with Svelte 5
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration: number;
}

const toasts = writable<Toast[]>([]);

const createToast = (
  message: string,
  type: Toast["type"],
  duration: number = 3000,
) => {
  const id = Math.random().toString(36).substr(2, 9);
  const toast: Toast = { id, message, type, duration };

  toasts.update((current) => [...current, toast]);

  setTimeout(() => {
    toasts.update((current) => current.filter((t) => t.id !== id));
  }, duration);

  return id;
};

export const showToast = {
  success: (message: string) => createToast(message, "success", 3000),
  error: (message: string) => createToast(message, "error", 4000),
  info: (message: string) => createToast(message, "info", 3000),
  warning: (message: string) => createToast(message, "warning", 3000),
};

export const showError = (
  error: any,
  defaultMessage: string = "Ha ocurrido un error",
) => {
  const message = error?.message || error?.error_description || defaultMessage;
  showToast.error(message);
};

// Export toasts and removeToast for use in components
export { toasts };

export const removeToast = (id: string) => {
  toasts.update((current) => current.filter((t) => t.id !== id));
};
