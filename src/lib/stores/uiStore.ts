import { writable } from 'svelte/store';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

function createUIStore() {
  const { subscribe, set, update } = writable<{
    confirmDialog: ConfirmConfig | null,
    isLoading: boolean
  }>({
    confirmDialog: null,
    isLoading: false
  });

  return {
    subscribe,
    confirm: (config: Omit<ConfirmConfig, 'onConfirm' | 'onCancel'>) => {
      return new Promise<boolean>((resolve) => {
        update(s => ({
          ...s,
          confirmDialog: {
            ...config,
            onConfirm: () => {
              update(s2 => ({ ...s2, confirmDialog: null }));
              resolve(true);
            },
            onCancel: () => {
              update(s2 => ({ ...s2, confirmDialog: null }));
              resolve(false);
            }
          }
        }));
      });
    },
    setLoading: (loading: boolean) => update(s => ({ ...s, isLoading: loading })),
    closeConfirm: () => update(s => ({ ...s, confirmDialog: null }))
  };
}

export const uiStore = createUIStore();
