import { auth, db } from "$lib/firebase";
import { query, collection, where } from "firebase/firestore";
import { ADMIN_EMAILS } from "$lib/constants";

export const getOwnerId = () => {
  // Check for mock session first if in browser
  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('chessnet_mock_session') === 'true') {
    return 'chessnet-dev-uid';
  }

  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  // Si es Admin, revisamos si está suplantando a alguien
  if (ADMIN_EMAILS.includes(currentUser.email || '')) {
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
  return query(collection(db, collectionName), where("owner_id", "==", uid));
};
