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
import { ADMIN_EMAILS } from '$lib/constants';
import { initialState, type AppState } from './types';
import type { Writable } from 'svelte/store';
import type { Query, QuerySnapshot, DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';

export function setupListeners(store: Writable<AppState>, user: any) {
  const { update, set } = store;
  const unsubscribes: (() => void)[] = [];
  const initializedCollections = new Set<string>();
  const dataCache: Record<string, string> = {};

  // Developer Bypass Notification
  if (user?.uid === 'antigravity-dev-worker') {
    console.info('🛠️ [AppStore] Developer Bypass Active: Real-time listeners enabled for development mode.');
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
            teacherEmail: userEmail,
            featuredInsignias: data.settings?.featuredInsignias || [],
            economy: data.economy || null
          };
          if (ADMIN_EMAILS.includes(userEmail)) settings.plan = 'premium';
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
    const q = queryFn || query(collRef, or(
      where("owner_id", "==", user.uid), 
      where("ownerId", "==", user.uid),
      where("sharedWith", "array-contains", user.uid)
    ));
    
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
        
        if (key === 'unlockedAchievements') {
          const notifiedIds = docs.filter((d: any) => d.notified).map((d: any) => d.id);
          const filteredPending = s.pendingAchievementIds.filter((id: string) => !notifiedIds.includes(id));
          let nextPending = filteredPending;
          
          if (!isFirstLoad) {
            const previouslyUnlocked = s.unlockedAchievements.map((a: any) => a.id);
            const newlyAdded = docs.filter((d: any) => !d.notified && !previouslyUnlocked.includes(d.id));
            if (newlyAdded.length > 0) {
              const freshIds = newlyAdded.map((a: any) => a.id).filter(id => !filteredPending.includes(id));
              nextPending = [...filteredPending, ...freshIds];
            }
          }
          newState.pendingAchievementIds = nextPending;
        }
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
    { key: 'unlockedAchievements', path: 'achievements' },
    { key: 'localTournaments', path: 'local_tournaments' },
    { key: 'localTournamentPlayers', path: 'local_tournament_players' },
    { key: 'localTournamentRounds', path: 'local_tournament_rounds' },
    { key: 'localTournamentPairings', path: 'local_tournament_pairings' },
    { key: 'attendance', path: 'attendance' },
    { key: 'payments', path: 'payments' },
    { key: 'leads', path: 'leads' }
  ];
  personalCollections.forEach(c => setupCollectionListener(c.key, c.path));

  const communityCollections = [
    { key: 'lobbyAnnouncements', path: 'lobby_announcements' },
    { key: 'lobbySuggestions', path: 'lobby_suggestions' },
    { key: 'communityGroups', path: 'community_groups' },
    { key: 'posts', path: 'faculty_stream' },
    { key: 'markets', path: 'prediction_markets' }
  ];
  communityCollections.forEach(c => {
    const collRef = collection(db, c.path);
    const q = query(collRef, orderBy('createdAt', 'desc'), limit(100));
    
    const unsub = onSnapshot(q, (snap: QuerySnapshot) => {
      const isFirstLoad = !initializedCollections.has(c.key);
      const docs = snap.docs.map((d: QueryDocumentSnapshot) => toData<any>(d));
      
      const currentDataAsString = JSON.stringify(docs);
      if (dataCache[c.key] === currentDataAsString) return;

      // Real implementation for reaction detection
      if (c.key === 'posts' && !isFirstLoad && dataCache[c.key]) {
        try {
          const previousPosts = JSON.parse(dataCache[c.key]);
          docs.forEach(post => {
            const prev = previousPosts.find((p: any) => p.id === post.id);
            if (prev && post.authorId === user.uid) {
              const currentReactions = post.reactions || {};
              const previousReactions = prev.reactions || {};

              for (const emoji in currentReactions) {
                const newUsers = currentReactions[emoji] || [];
                const oldUsers = previousReactions[emoji] || [];
                
                if (newUsers.length > oldUsers.length) {
                  // Find users that are in newUsers but not in oldUsers
                  const addedUsers = newUsers.filter((u: string) => !oldUsers.includes(u));
                  const realAddedUsers = addedUsers.filter((u: string) => u !== user.uid);
                  
                  if (realAddedUsers.length > 0) {
                    toast.info(`Alguien ha reaccionado con ${emoji} a tu publicación`);
                  }
                }
              }
            }
          });
        } catch (e) {
          console.error('Error parsing previous posts for notifications:', e);
        }
      }

      dataCache[c.key] = currentDataAsString;
      if (isFirstLoad) initializedCollections.add(c.key);

      update((s: AppState) => {
        const newState = { ...s } as any;
        newState[c.key] = docs;
        return newState as AppState;
      });
    });
    unsubscribes.push(unsub);
  });

  // 4. Reports (Admin specific)
  const userEmail = user.email?.toLowerCase() || '';
  const isAdmin = ADMIN_EMAILS.includes(userEmail);
  const reportsRef = collection(db, 'lobby_reports');
  const qReports = isAdmin 
    ? query(reportsRef, orderBy('createdAt', 'desc'))
    : query(reportsRef, where('authorId', '==', user.uid), orderBy('createdAt', 'desc'));

  unsubscribes.push(onSnapshot(qReports, (snap: QuerySnapshot) => {
    const docs = snap.docs.map(d => toData<any>(d));
    update((s: AppState) => ({ ...s, reports: docs }));
  }));

  return () => {
    unsubscribes.forEach(unsub => unsub());
  };
}
