import { get } from 'svelte/store';
import { toast } from '$lib/stores/toast';
import { db, toData } from '$lib/firebase';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where,
  limit,
  orderBy,
  setDoc,
  updateDoc,
  or
} from 'firebase/firestore';

import { initialState, type AppState } from './types';
import type { Writable } from 'svelte/store';
import type { Query, QuerySnapshot, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

export function setupListeners(store: Writable<AppState>, user: any) {
  const { update, set } = store;
  const unsubscribes: (() => void)[] = [];
  const initializedCollections = new Set<string>();
  const dataCache: Record<string, string> = {};

  // Developer Bypass Handling — full premium access, no Firestore needed
  if (user?.uid === 'antigravity-dev-worker') {
    console.info('🛠️ [AppStore] Developer Bypass Active: Premium plan granted, real-time listeners disabled.');
    update(s => ({
      ...s,
      initialized: true,
      settings: {
        ...s.settings,
        plan: 'premium',
        teacherName: 'Antigravity (Dev)',
        teacherEmail: 'tomih@chess-society.com',
        teacherAvatar: '',
        role: 'admin' as const
      }
    }));
    return () => {}; // No-op cleanup
  }

  const userRef = doc(db, 'users', user.uid);
  let isSyncingSettings = false;

  // 1. Settings Listener
  const unsubSettings = onSnapshot(userRef, 
    async (snap: DocumentSnapshot) => {
      if (isSyncingSettings) return;
      isSyncingSettings = true;
      try {
        const userEmail = (user.email || '').toLowerCase();
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: userEmail,
            createdAt: new Date().toISOString(),
            settings: {
              plan: 'free',
              teacherName: user.displayName || '',
              teacherAvatar: user.photoURL || '',
              teacherEmail: userEmail
            }
          });
          return;
        }
        const data = snap.data() as any;
        if (!data.createdAt) await updateDoc(userRef, { createdAt: new Date().toISOString() });

        update((currentState: AppState) => {
          const settings = { 
            ...currentState.settings, 
            ...(data.settings || {}),
            teacherEmail: userEmail
          };
          
          // Local expiration check
          if (settings.plan === 'premium' && settings.planExpiresAt) {
            const expiresAt = new Date(settings.planExpiresAt);
            if (expiresAt < new Date()) {
              settings.plan = 'free';
            }
          }

          if (user.isAdmin) settings.plan = 'premium';
          return { ...currentState, settings, dashboardLayout: data.dashboardLayout || [], initialized: true };
        });
      } catch (err) {
        console.error('❌ [AppStore] Error processing settings:', err);
      } finally {
        isSyncingSettings = false;
      }
    },
    (error) => {
      isSyncingSettings = false;
      console.error('❌ [AppStore] Settings error:', error);
    }
  );
  unsubscribes.push(unsubSettings);

  // 2. Collection Listener Helper
  const setupCollectionListener = (key: string, path: string, queryFn?: Query) => {
    const collRef = collection(db, path);
    // For admins, some collections should show everything (e.g., reports)
    let q;
    if (user.isAdmin && path === 'lobby_reports') {
      q = query(collRef, orderBy('createdAt', 'desc'));
    } else {
      q = queryFn || query(collRef, or(
        where("owner_id", "==", user.uid), 
        where("ownerId", "==", user.uid),
        where("authorId", "==", user.uid),
        where("sharedWith", "array-contains", user.uid)
      ));
    }
    
    const unsub = onSnapshot(q, (snap: QuerySnapshot) => {
      const docs = snap.docs.map((d: QueryDocumentSnapshot) => toData<any>(d));
      const currentDataAsString = JSON.stringify(docs);
      
      if (dataCache[key] === currentDataAsString) return;
      dataCache[key] = currentDataAsString;

      const isFirstLoad = !initializedCollections.has(key);
      if (isFirstLoad) initializedCollections.add(key);

      update((s: AppState) => {
        const newState = { ...s } as any;
        newState[key] = docs;
        return newState as AppState;
      });
    }, (error: any) => {
      if (error.code !== 'permission-denied') console.error(`❌ [AppStore] Error in ${key}:`, error);
    });
    unsubscribes.push(unsub);
  };

  // 3. Initialize Collections
  const personalCollections = [
    { key: 'schools', path: 'schools' },
    { key: 'students', path: 'students' },
    { key: 'classes', path: 'classes' },
    { key: 'skills', path: 'skills' },
    { key: 'localTournaments', path: 'local_tournaments' },
    { key: 'localTournamentPlayers', path: 'local_tournament_players' },
    { key: 'localTournamentRounds', path: 'local_tournament_rounds' },
    { key: 'localTournamentPairings', path: 'local_tournament_pairings' },
    { key: 'attendance', path: 'attendance' },
    { key: 'payments', path: 'payments' },
    { key: 'leads', path: 'leads' },
    { key: 'reports', path: 'lobby_reports' }
  ];
  personalCollections.forEach(c => setupCollectionListener(c.key, c.path));

  return () => {
    unsubscribes.forEach(unsub => unsub());
  };
}
