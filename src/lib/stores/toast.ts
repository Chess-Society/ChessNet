import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

function createToastStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    return {
        subscribe,
        show: (message: string, type: ToastType = 'info', duration: number = 3000) => {
            const id = Math.random().toString(36).substr(2, 9);
            const toast: Toast = { id, type, message, duration };

            update(toasts => [...toasts, toast]);

            if (duration > 0) {
                setTimeout(() => {
                    update(toasts => toasts.filter(t => t.id !== id));
                }, duration);
            }

            return id;
        },
        dismiss: (id: string) => {
            update(toasts => toasts.filter(t => t.id !== id));
        },
        clear: () => {
            update(() => []);
        }
    };
}

export const toasts = createToastStore();

// Convenience methods
export const toast = {
    success: (message: string, duration?: number) => toasts.show(message, 'success', duration),
    error: (message: string, duration?: number) => toasts.show(message, 'error', duration),
    info: (message: string, duration?: number) => toasts.show(message, 'info', duration),
    warning: (message: string, duration?: number) => toasts.show(message, 'warning', duration),
};
