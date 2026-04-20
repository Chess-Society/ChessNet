import { writable, get } from 'svelte/store';
import { db } from '$lib/firebase';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { browser } from '$app/environment';

interface SystemConfig {
  maintenanceMode: boolean;
  [key: string]: any;
}

export const systemConfig = writable<SystemConfig>({ maintenanceMode: false });
export const globalAnnouncements = writable<any[]>([]);
export const configLoaded = writable(false);

let configUnsub: (() => void) | null = null;
let announcementsUnsub: (() => void) | null = null;

export function initGlobalConfig() {
  if (!browser || configUnsub) return;

  // 1. System Config (Public)
  configUnsub = onSnapshot(doc(db, 'system', 'config'), 
    (snap) => {
      if (snap.exists()) {
        systemConfig.set(snap.data() as SystemConfig);
      }
      configLoaded.set(true);
    },
    (error) => {
      // Quietly handle permission errors - might happen if project isn't fully ready
      console.warn('⚠️ [ConfigStore] System config read restricted:', error.message);
      configLoaded.set(true); 
    }
  );

  // 2. Global Announcements (Public)
  const q = query(
    collection(db, 'announcements'), 
    where('is_global', '==', true), 
    orderBy('created_at', 'desc'), 
    limit(1)
  );

  announcementsUnsub = onSnapshot(q, 
    (snap) => {
      const announcements = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      globalAnnouncements.set(announcements);
    },
    (error) => {
      // Often fails in local if no index or no data
    }
  );
}

export function stopGlobalConfig() {
  if (configUnsub) configUnsub();
  if (announcementsUnsub) announcementsUnsub();
  configUnsub = null;
  announcementsUnsub = null;
}
