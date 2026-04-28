import { auth, db } from "$lib/firebase";
import { query, collection, where, or } from "firebase/firestore";
import { user as userStore } from "$lib/stores/auth";
import { get } from "svelte/store";

export const getOwnerId = () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  // Si es Admin, revisamos si está suplantando a alguien
  const $user = get(userStore);
  if ($user?.isAdmin) {
    const impersonatedId = typeof document !== 'undefined' 
        ? document.cookie.split('; ').find(row => row.startsWith('impersonate_id='))?.split('=')[1]
        : null;
    
    if (impersonatedId) return impersonatedId;
  }

  return currentUser.uid;
};

export const getOwnedQuery = (collectionName: string) => {
  const uid = getOwnerId();
  if (!uid) throw new Error("No hay usuario autenticado");
  return query(
    collection(db, collectionName), 
    or(where("ownerId", "==", uid), where("ownerId", "==", uid))
  );
};
