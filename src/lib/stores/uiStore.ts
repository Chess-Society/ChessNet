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
    confirmDialog: ConfirmConfig | null;
  }>({
    confirmDialog: null
  });

  return {
    subscribe,
    confirm: (config: Omit<ConfirmConfig, 'onConfirm' | 'onCancel'>) => {
      return new Promise<boolean>((resolve) => {
        set({
          confirmDialog: {
            ...config,
            onConfirm: () => {
              set({ confirmDialog: null });
              resolve(true);
            },
            onCancel: () => {
              set({ confirmDialog: null });
              resolve(false);
            }
          }
        });
      });
    },
    closeConfirm: () => update(s => ({ ...s, confirmDialog: null }))
  };
}

export const uiStore = createUIStore();
