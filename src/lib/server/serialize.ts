
/**
 * Normaliza los datos de Firestore para que sean serializables por SvelteKit.
 * Convierte Timestamps a ISO strings y maneja objetos anidados de forma segura.
 */
export function serializeRecord<T>(data: any): T {
  if (data === null || data === undefined) return data;

  // Firestore Timestamp (Server-side admin SDK)
  if (typeof data.toDate === 'function') {
    try {
      return data.toDate().toISOString() as any;
    } catch (e) {
      console.error('Error serializing Timestamp:', e);
      return new Date().toISOString() as any;
    }
  }

  // Native Date
  if (data instanceof Date) {
    try {
      if (isNaN(data.getTime())) return new Date().toISOString() as any;
      return data.toISOString() as any;
    } catch (e) {
      return new Date().toISOString() as any;
    }
  }

  // Handle strings that might be ISO dates but are actually objects in some contexts
  // (though usually we just return them)

  // Array
  if (Array.isArray(data)) {
    return data.map(item => serializeRecord(item)) as any;
  }

  // Object - be careful with typical JS objects
  if (typeof data === 'object' && data.constructor === Object) {
    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        let newKey = key;
        
        // Auto-mapping legacy snake_case keys to camelCase
        if (key === 'owner_id') newKey = 'ownerId';
        else if (key === 'student_id') newKey = 'studentId';
        else if (key === 'round_no') newKey = 'roundNo';
        else if (key === 'tournament_id') newKey = 'tournamentId';
        else if (key === 'school_id') newKey = 'schoolId';
        else if (key === 'class_id') newKey = 'classId';
        else if (key === 'first_name') newKey = 'firstName';
        else if (key === 'last_name') newKey = 'lastName';

        serialized[newKey] = serializeRecord(data[key]);
      }
    }
    return serialized as T;
  }

  return data;
}
