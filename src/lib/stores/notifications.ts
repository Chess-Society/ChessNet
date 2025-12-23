import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

function createNotificationStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    function add(type: ToastType, message: string, duration = 3000) {
        const id = crypto.randomUUID();
        const toast: Toast = { id, type, message, duration };

        update((toasts) => [...toasts, toast]);

        if (duration > 0) {
            setTimeout(() => {
                remove(id);
            }, duration);
        }
    }

    function remove(id: string) {
        update((toasts) => toasts.filter((t) => t.id !== id));
    }

    return {
        subscribe,
        info: (msg: string, duration?: number) => add('info', msg, duration),
        success: (msg: string, duration?: number) => add('success', msg, duration),
        warning: (msg: string, duration?: number) => add('warning', msg, duration),
        error: (msg: string, duration?: number) => add('error', msg, duration),
        remove
    };
}

export const notifications = createNotificationStore();
