import { db, toData } from "$lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  writeBatch, 
  collectionGroup,
  query,
  limit
} from "firebase/firestore";

/**
 * MIGRACIÓN: De Estructura Anidada a Estructura de Raíz
 * Este script busca todos los documentos en 'users/{uid}/colleges'
 * y los copia a la colección raíz 'schools', inyectando el owner_id.
 */
export async function migrateAllToRoot() {
  console.log("🚀 Iniciando migración masiva a la raíz...");
  
  const targetCollections = [
    { target: "schools", source: "colleges" },
    { target: "students", source: "students" },
    { target: "classes", source: "classes" },
    { target: "tournaments", source: "tournaments" },
    { target: "local_tournaments", source: "local_tournaments" },
    { target: "local_tournament_players", source: "local_tournament_players" },
    { target: "local_tournament_rounds", source: "local_tournament_rounds" },
    { target: "local_tournament_pairings", source: "local_tournament_pairings" },
    { target: "payments", source: "payments" },
    { target: "attendance", source: "attendance" },
    { target: "skills", source: "skills" },
    { target: "categories", source: "categories" },
    { target: "badges", source: "badges" },
    { target: "student_badges", source: "student_badges" },
    { target: "student_stats", source: "student_stats" },
    { target: "leads", source: "leads" }
  ];

  for (const { target, source } of targetCollections) {
    console.log(`Migrando subcolección '${source}' hacia la raíz '${target}'...`);
    const q = query(collectionGroup(db, source));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`✅ No se encontraron documentos para '${source}'.`);
      continue;
    }

    const batch = writeBatch(db);
    let count = 0;

    snapshot.docs.forEach((oldDoc) => {
      // Ignorar si el documento ya está en la raíz (ej: paths sin users/)
      const pathParts = oldDoc.ref.path.split('/');
      if (pathParts[0] !== 'users' || pathParts.length < 4) {
         return; // Ya está procesado o no está en users/{uid}/...
      }
      
      const ownerId = pathParts[1]; 
      const data = oldDoc.data();
      const newRef = doc(db, target, oldDoc.id);

      batch.set(newRef, {
        ...data,
        owner_id: ownerId,
        updated_at: new Date().toISOString()
      }, { merge: true });

      // Opcional: Borrar el antiguo
      // batch.delete(oldDoc.ref);
      
      count++;
    });

    if (count > 0) {
      await batch.commit();
      console.log(`✅ Migrados ${count} documentos de '${source}' a '${target}'.`);
    } else {
      console.log(`✅ Todos los documentos de '${source}' ya estaban en la raíz.`);
    }
  }
  
  console.log("🚀 Migración masiva completada.");
}
