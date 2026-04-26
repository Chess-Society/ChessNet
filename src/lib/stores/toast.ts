import { toast as sonnerToast } from 'svelte-sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType | 'insignia';
  insigniaId?: string;
  duration?: number;
}

function createToastStore() {
  return {
    // Sonner doesn't need a manual subscribe/store for our use case anymore
    // but we keep the structure for compatibility
    subscribe: (fn: (v: any[]) => void) => {
        fn([]); // Return empty list to prevent crashes in legacy components
        return () => {};
    },
    success: (m: string) => sonnerToast.success(m),
    error: (m: string) => sonnerToast.error(m),
    info: (m: string) => sonnerToast.info(m),
    warning: (m: string) => sonnerToast.warning(m),
    achievement: (insigniaId: string, customMessage?: string) => {
        sonnerToast(customMessage || '¡Nueva insignia desbloqueada!', {
            description: 'Has ganado un nuevo reconocimiento en ChessNet.',
            duration: 6000,
            duration: 6000
        });
    },
    remove: (id: string) => sonnerToast.dismiss(id)
  };
}

export const toast = createToastStore();
