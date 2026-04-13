import { auth, db } from "$lib/firebase";
import { query, collection, where } from "firebase/firestore";

export const getOwnerId = () => auth.currentUser?.uid || null;

export const getOwnedQuery = (collectionName: string) => {
  const uid = getOwnerId();
  if (!uid) throw new Error("No hay usuario autenticado");
  return query(collection(db, collectionName), where("owner_id", "==", uid));
};
