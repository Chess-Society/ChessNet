import { writable } from 'svelte/store';

export interface ConfirmConfig {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface PromptConfig {
  title: string;
  message?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

function createUIStore() {
  const { subscribe, set, update } = writable<{
    confirmDialog: ConfirmConfig | null,
    promptDialog: PromptConfig | null,
    isLoading: boolean
  }>({
    confirmDialog: null,
    promptDialog: null,
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
            message: config.message || '',
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
    prompt: (config: { title: string, message?: string, placeholder?: string, confirmText?: string, cancelText?: string }) => {
      return new Promise<string | null>((resolve) => {
        update(s => ({
          ...s,
          promptDialog: {
            ...config,
            confirmText: config.confirmText || 'Confirmar',
            cancelText: config.cancelText || 'Cancelar',
            onConfirm: (val: string) => {
              update(s2 => ({ ...s2, promptDialog: null }));
              resolve(val);
            },
            onCancel: () => {
              update(s2 => ({ ...s2, promptDialog: null }));
              resolve(null);
            }
          }
        }));
      });
    },
    setLoading: (loading: boolean) => update(s => ({ ...s, isLoading: loading })),
    closeConfirm: () => update(s => ({ ...s, confirmDialog: null })),
    closePrompt: () => update(s => ({ ...s, promptDialog: null })),
    closeAllModals: () => update(s => ({ ...s, confirmDialog: null, promptDialog: null, isLoading: false }))
  };
}

export const uiStore = createUIStore();
