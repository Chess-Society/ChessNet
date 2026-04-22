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
    
    // UI Helpers
    notifyAchievementDisplayed: async (achievementId: string) => {
      const user = get(authStoreUser);
      if (!user) return;
      
      // Update locally first
      update((s: AppState) => ({
        ...s,
        pendingAchievementIds: s.pendingAchievementIds.filter(id => id !== achievementId),
        unlockedAchievements: s.unlockedAchievements.map(a => 
          a.id === achievementId ? { ...a, notified: true } : a
        )
      }));

      // Persist to Firebase
      try {
        await updateDoc(doc(db, 'achievements', achievementId), {
          notified: true,
          notifiedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ [AppStore] Error notifying achievement:', error);
      }
    },

    reset: () => {
      if (unsubscribeListeners) {
        unsubscribeListeners();
        unsubscribeListeners = null;
      }
      set(initialState);
    }
  };
}

export const appStore = createAppStore();
