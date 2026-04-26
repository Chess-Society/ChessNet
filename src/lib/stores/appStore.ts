import { writable, get } from 'svelte/store';
import { user as authStoreUser } from './auth';
import { initialState, type AppState } from './app/types';
import { setupListeners } from './app/listeners';
import { createActions } from './app/actions';
import { db } from '$lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

function createAppStore() {
  const store = writable(initialState);
  const { subscribe, set, update } = store;

  let unsubscribeListeners: (() => void) | null = null;

  // Listen to auth changes to setup/teardown listeners
  authStoreUser.subscribe(user => {
    if (unsubscribeListeners) {
      unsubscribeListeners();
      unsubscribeListeners = null;
    }

    if (user) {
      unsubscribeListeners = setupListeners(store, user);
    } else {
      set(initialState);
    }
  });

  const actions = createActions(store);
  
  return {
    subscribe,
    ...actions,
    
    reset: () => {
      if (unsubscribeListeners) {
        unsubscribeListeners();
        unsubscribeListeners = null;
      }
      set(initialState);
    },

    // Getters helpers
    get school() {
      const state = get(store);
      return state.schools[0] || null;
    },
    get settings() {
      return get(store).settings;
    }
  };
}

export const appStore = createAppStore();
