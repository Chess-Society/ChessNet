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
  if (typeof window === 'undefined' || configUnsub) return;

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
    orderBy('createdAt', 'desc'), 
    limit(50) // Increased limit to ensure we catch global ones
  );

  announcementsUnsub = onSnapshot(q, 
    (snap) => {
      const announcements = snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          isGlobal: data.isGlobal === true || data.is_global === true,
          isPublished: data.isPublished !== false, // Default to true if missing
          createdAt: data.createdAt ?? data.createdAt,
          content: data.content ?? data.message ?? '',
          linkText: data.linkText ?? data.link_text ?? 'VER MÁS'
        };
      }).filter(a => a.isGlobal && a.isPublished);
      
      globalAnnouncements.set(announcements);
    },
    (error) => {
      console.warn('⚠️ [ConfigStore] Announcements read error:', error.message);
    }
  );
}

export function stopGlobalConfig() {
  if (configUnsub) configUnsub();
  if (announcementsUnsub) announcementsUnsub();
  configUnsub = null;
  announcementsUnsub = null;
}
