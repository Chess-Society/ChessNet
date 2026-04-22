import { get } from 'svelte/store';
import { db, auth, toData } from '$lib/firebase';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  addDoc, 
  writeBatch
} from 'firebase/firestore';
import { t } from '$lib/i18n';
import { toast } from '../toast';
import { user as authStoreUser } from '../auth';
import { apiFetch } from './api';
import type { CreateSkillForm } from '$lib/types';
import type { AppState } from './types';
import type { Writable } from 'svelte/store';

export function createActions(store: Writable<AppState>) {
  const { update } = store;

  return {
    // SCHOOLS
    addSchool: async (school: any) => {
      const state = get(store) as AppState;
      const isPremium = state.settings?.plan === 'premium';
      
      if (!isPremium && state.schools.length >= 1) {
        toast.error(get(t)('pricing.limits.school_reached'));
        throw new Error('Limit reached');
      }

      const result = await apiFetch('/api/schools', {
        method: 'POST',
        body: JSON.stringify(school)
      }, 'Error adding school');
      return result.school;
    },
    removeSchool: async (id: string) => {
      await apiFetch('/api/schools', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      }, 'Error removing school');
    },
    updateSchool: async (school: any) => {
      const result = await apiFetch('/api/schools', {
        method: 'PUT',
        body: JSON.stringify(school)
      }, 'Error updating school');
      return result.school;
    },
    
    // STUDENTS
    addStudent: async (student: any) => {
      const state = get(store) as AppState;
      const isPremium = state.settings?.plan === 'premium';

      if (!isPremium && state.students.length >= 10) {
        toast.error(get(t)('pricing.limits.student_reached'));
        throw new Error('Limit reached');
      }

      const result = await apiFetch('/api/students', {
        method: 'POST',
        body: JSON.stringify(student)
      }, 'Error adding student');
      return result.student;
    },
    updateStudent: async (student: any) => {
      const result = await apiFetch('/api/students', {
        method: 'PUT',
        body: JSON.stringify(student)
      }, 'Error updating student');
      return result.student;
    },
    removeStudent: async (id: string) => {
      await apiFetch('/api/students', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      }, 'Error removing student');
    },
    
    // CLASSES
    addClass: async (cls: any) => {
      const state = get(store) as AppState;
      const isPremium = state.settings?.plan === 'premium';

      if (!isPremium && state.classes.length >= 1) {
        toast.error(get(t)('pricing.limits.class_reached'));
        throw new Error('Limit reached');
      }

      const result = await apiFetch('/api/classes', {
        method: 'POST',
        body: JSON.stringify(cls)
      }, 'Error adding class');
      return result.class;
    },
    updateClass: async (cls: any) => {
      const result = await apiFetch('/api/classes', {
        method: 'PUT',
        body: JSON.stringify(cls)
      }, 'Error updating class');
      return result.class;
    },
    removeClass: async (id: string) => {
      await apiFetch('/api/classes', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      }, 'Error removing class');
    },
    
    // ENROLLMENT
    enrollStudent: async (classId: string, studentId: string) => {
      await apiFetch('/api/class-students', {
        method: 'POST',
        body: JSON.stringify({ classId, studentId })
      }, 'Error enrolling student');
    },
    unenrollStudent: async (classId: string, studentId: string) => {
      await apiFetch(`/api/class-students?class_id=${classId}&student_id=${studentId}`, {
        method: 'DELETE'
      }, 'Error unenrolling student');
    },
    
    // TOURNAMENTS (Global)
    addTournament: async (tournament: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'tournaments');
      await addDoc(collRef, { 
        ...tournament, 
        owner_id: user.uid,
        createdAt: new Date().toISOString() 
      });
    },
    updateTournament: async (tournament: any) => {
      const { id, ...data } = tournament;
      await setDoc(doc(db, 'tournaments', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeTournament: async (id: string) => {
      await deleteDoc(doc(db, 'tournaments', id));
    },

    // LOCAL TOURNAMENTS
    addLocalTournament: async (tournament: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      const collRef = collection(db, 'local_tournaments');
      const docRef = await addDoc(collRef, { 
        ...tournament, 
        ownerId: user.uid,
        schoolId: tournament.schoolId,
        createdAt: new Date().toISOString() 
      });
      return docRef.id;
    },
    updateLocalTournament: async (id: string, updates: any) => {
      await setDoc(doc(db, 'local_tournaments', id), { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeLocalTournament: async (id: string) => {
      await deleteDoc(doc(db, 'local_tournaments', id));
    },

    // TOURNAMENT PLAYERS/ROUNDS/PAIRINGS
    addLocalTournamentPlayer: async (player: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      const docId = `${player.tournamentId}_${player.studentId}`;
      await setDoc(doc(db, 'local_tournament_players', docId), { 
        ...player, 
        ownerId: user.uid,
        createdAt: new Date().toISOString() 
      }, { merge: true });
    },
    removeLocalTournamentPlayer: async (tournamentId: string, studentId: string) => {
      await deleteDoc(doc(db, 'local_tournament_players', `${tournamentId}_${studentId}`));
    },
    updateLocalTournamentPlayer: async (tournamentId: string, studentId: string, updates: any) => {
      const docId = `${tournamentId}_${studentId}`;
      await setDoc(doc(db, 'local_tournament_players', docId), { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    addLocalTournamentPairing: async (pairing: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      await addDoc(collection(db, 'local_tournament_pairings'), { 
        ...pairing, 
        ownerId: user.uid,
        createdAt: new Date().toISOString() 
      });
    },
    updateLocalTournamentPairing: async (id: string, updates: any) => {
      await setDoc(doc(db, 'local_tournament_pairings', id), { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    addLocalTournamentRound: async (round: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      const docId = `${round.tournamentId}_${round.roundNo}`;
      await setDoc(doc(db, 'local_tournament_rounds', docId), { 
        ...round, 
        ownerId: user.uid,
        createdAt: new Date().toISOString() 
      }, { merge: true });
    },
    updateLocalTournamentRound: async (id: string, updates: any) => {
      await setDoc(doc(db, 'local_tournament_rounds', id), { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeLocalTournamentRound: async (tournamentId: string, roundNo: number) => {
      await deleteDoc(doc(db, 'local_tournament_rounds', `${tournamentId}_${roundNo}`));
    },
    
    // ATTENDANCE
    saveAttendance: async (record: any) => {
      const user = get(authStoreUser);
      if (!user) throw new Error("No authenticated user");
      const { id, ...data } = record;
      if (id) {
        await setDoc(doc(db, 'attendance', id), data, { merge: true });
      } else {
        const attendanceId = `${record.studentId}_${record.classId}_${record.date}`;
        await setDoc(doc(db, 'attendance', attendanceId), { 
          ...data,
          id: attendanceId,
          owner_id: user.uid,
          createdAt: new Date().toISOString() 
        }, { merge: true });
      }
    },
    
    // PAYMENTS
    addPayment: async (payment: any) => {
      const result = await apiFetch('/api/payments', {
        method: 'POST',
        body: JSON.stringify(payment)
      }, 'Error creating payment');
      return result.data;
    },
    updatePayment: async (payment: any) => {
      const result = await apiFetch(`/api/payments?id=${encodeURIComponent(payment.id)}`, {
        method: 'PUT',
        body: JSON.stringify(payment)
      }, 'Error updating payment');
      return result.data;
    },
    removePayment: async (id: string) => {
      update((s: AppState) => ({ ...s, payments: s.payments.filter((p: any) => p.id !== id) }));
      await apiFetch(`/api/payments?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, 'Error removing payment');
    },

    // SKILLS & CURRICULUM
    addSkill: async (skill: any) => {
      const result = await apiFetch('/api/skills', {
        method: 'POST',
        body: JSON.stringify(skill)
      }, 'Error adding skill');
      return result.skill;
    },
    updateSkill: async (skill: any) => {
      const result = await apiFetch('/api/skills', {
        method: 'PUT',
        body: JSON.stringify(skill)
      }, 'Error updating skill');
      return result.skill;
    },
    removeSkill: async (id: string) => {
      await apiFetch('/api/skills', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      }, 'Error removing skill');
    },
    removeMultipleSkills: async (ids: string[]) => {
      const batch = writeBatch(db);
      ids.forEach(id => batch.delete(doc(db, 'skills', id)));
      await batch.commit();
    },
    clearSyllabus: async () => {
      const skills = (get(store) as AppState).skills;
      if (skills.length === 0) return;
      const batch = writeBatch(db);
      skills.forEach((sk: any) => batch.delete(doc(db, 'skills', sk.id)));
      await batch.commit();
    },
    reorderSkills: async (reorderings: { id: string, order: number }[]) => {
      const batch = writeBatch(db);
      reorderings.forEach(({ id, order }) => {
        batch.update(doc(db, 'skills', id), { 
          order, 
          updatedAt: new Date().toISOString() 
        });
      });
      await batch.commit();
    },
    importCurriculum: async (skills: CreateSkillForm[]) => {
      const user = get(authStoreUser);
      if (!user) return;
      await apiFetch('/api/skills', {
        method: 'POST',
        body: JSON.stringify(skills.map(s => ({ ...s, active: true })))
      }, 'Error importing curriculum');
      toast.success(get(t)('skills.import_success') || 'Curriculum importado con éxito');
    },

    importTournamentTemplates: async (templates: any[]) => {
      const user = get(authStoreUser);
      if (!user) return;
      const batch = writeBatch(db);
      templates.forEach(t => {
        const docRef = doc(collection(db, 'tournaments'));
        batch.set(docRef, { 
          ...t, 
          owner_id: user.uid,
          createdAt: new Date().toISOString() 
        });
      });
      await batch.commit();
      toast.success('Plantillas de torneo importadas');
    },

    // CATEGORIES
    addCategory: async (category: any) => {
      const user = get(authStoreUser);
      if (!user) return;
      await addDoc(collection(db, 'categories'), {
        ...category,
        owner_id: user.uid,
        createdAt: new Date().toISOString()
      });
    },
    updateCategory: async (category: any) => {
      const { id, ...data } = category;
      await setDoc(doc(db, 'categories', id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    },
    removeCategory: async (id: string) => {
      await deleteDoc(doc(db, 'categories', id));
    },
    reorderCategories: async (reorderings: { id: string, order: number }[]) => {
      const batch = writeBatch(db);
      reorderings.forEach(({ id, order }) => {
        batch.update(doc(db, 'categories', id), { order, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
    },
    clearCategories: async () => {
      const categories = (get(store) as AppState).categories;
      if (categories.length === 0) return;
      const batch = writeBatch(db);
      categories.forEach((cat: any) => batch.delete(doc(db, 'categories', cat.id)));
      await batch.commit();
    },
    importCategories: async (categories: any[]) => {
      const user = get(authStoreUser);
      if (!user) return;
      const batch = writeBatch(db);
      categories.forEach(c => {
        const docRef = doc(collection(db, 'categories'));
        batch.set(docRef, { ...c, owner_id: user.uid, createdAt: new Date().toISOString() });
      });
      await batch.commit();
    },

    // SETTINGS & LAYOUT
    updateSettings: async (settings: any) => {
      const user = get(authStoreUser);
      if (!user) return;
      await setDoc(doc(db, 'users', user.uid), { settings, updatedAt: new Date().toISOString() }, { merge: true });
    },
    updateDashboardLayout: async (layout: string[]) => {
      const user = get(authStoreUser);
      if (!user) return;
      await setDoc(doc(db, 'users', user.uid), { dashboardLayout: layout, updatedAt: new Date().toISOString() }, { merge: true });
    }
  };
}
