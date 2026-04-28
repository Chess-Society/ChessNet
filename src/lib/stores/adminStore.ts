import { writable, derived } from 'svelte/store';
import { db } from '$lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { adminApi } from '$lib/api/admin';

// Tipos
export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalSchools: number;
  totalClasses: number;
  premiumUsers: number;
  recentUsers: number;
  totalMissions: number;
  totalAssignments: number;
  totalRevenue: number;
  activeSessions: number;
  serverLoad: number;
}

export interface AdminActivity {
  id: string;
  type: 'user_joined' | 'system_log' | 'report' | 'insignia_unlocked';
  title: string;
  subtitle: string;
  timestamp: string;
  status?: 'info' | 'warning' | 'error' | 'success' | 'premium';
  meta?: any;
}

// Stores de estado base
export const adminUsers = writable<any[]>([]);
export const adminLogs = writable<any[]>([]);
export const adminStats = writable<AdminStats>({
  totalUsers: 0,
  totalStudents: 0,
  totalSchools: 0,
  totalClasses: 0,
  premiumUsers: 0,
  recentUsers: 0,
  totalMissions: 0,
  totalAssignments: 0,
  totalRevenue: 0,
  activeSessions: 0,
  serverLoad: 0
});
export const isAdminLoading = writable(true);

// Derivado: Actividades recientes (combinando logs y usuarios)
export const adminActivities = derived(
  [adminLogs, adminUsers],
  ([$logs, $users]) => {
    const rawLogs: AdminActivity[] = $logs.map(l => ({
      id: l.id,
      type: 'system_log' as const,
      title: l.type || l.action,
      subtitle: typeof l.details === 'string' ? l.details : JSON.stringify(l.details || l.message),
      timestamp: l.timestamp,
      status: (l.status || 'info') as any
    }));

    const rawUsers: AdminActivity[] = $users.slice(0, 5).map(u => ({
      id: u.id,
      type: 'user_joined' as const,
      title: 'Nuevo Registro',
      subtitle: `${u.displayName || 'Usuario'} (${u.email})`,
      timestamp: u.createdAt,
      status: (u.settings?.plan === 'premium' ? 'premium' : 'info') as any
    }));

    return [...rawLogs, ...rawUsers]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  }
);

// Gestión de suscripciones en tiempo real
let unsubscribes: (() => void)[] = [];

export const adminStore = {
  async init() {
    isAdminLoading.set(true);
    
    // 1. Snapshot de Usuarios
    const usersUnsub = onSnapshot(
      query(collection(db, "users"), orderBy("createdAt", "desc"), limit(100)),
      (snap) => {
        adminUsers.set(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      },
      (err) => console.error("Admin Store Users Error:", err)
    );

    // 2. Snapshot de Logs
    const logsUnsub = onSnapshot(
      query(collection(db, "system_logs"), orderBy("timestamp", "desc"), limit(50)),
      (snap) => {
        adminLogs.set(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      },
      (err) => console.error("Admin Store Logs Error:", err)
    );

    unsubscribes.push(usersUnsub, logsUnsub);

    // 3. Carga inicial de Stats
    await this.refreshStats();
    
    // Intervalo de stats (cada 2 minutos para ahorrar cuota)
    const statsInterval = setInterval(() => this.refreshStats(), 120000);
    unsubscribes.push(() => clearInterval(statsInterval));

    isAdminLoading.set(false);
  },

  async refreshStats() {
    try {
      const s = await adminApi.getGlobalStats();
      adminStats.set(s as AdminStats);
    } catch (err) {
      console.error("Error refreshing admin stats:", err);
    }
  },

  destroy() {
    unsubscribes.forEach(unsub => unsub());
    unsubscribes = [];
  }
};
