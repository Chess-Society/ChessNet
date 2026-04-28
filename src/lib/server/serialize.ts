
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
        if (key === 'ownerId' || key === 'ownerId' || key === 'userId') newKey = 'ownerId';

        else if (key === 'studentId') newKey = 'studentId';
        else if (key === 'schoolId') newKey = 'schoolId';
        else if (key === 'classId') newKey = 'classId';
        else if (key === 'tournamentId') newKey = 'tournamentId';
        else if (key === 'roundNo') newKey = 'roundNo';
        else if (key === 'firstName') newKey = 'firstName';
        else if (key === 'lastName') newKey = 'lastName';
        else if (key === 'parentEmail') newKey = 'parentEmail';
        else if (key === 'parentPhone') newKey = 'parentPhone';
        else if (key === 'dateOfBirth') newKey = 'dateOfBirth';
        else if (key === 'lichessUsername') newKey = 'lichessUsername';
        else if (key === 'paymentType') newKey = 'paymentType';
        else if (key === 'dueDate') newKey = 'dueDate';
        else if (key === 'paidDate') newKey = 'paidDate';
        else if (key === 'periodStart') newKey = 'periodStart';
        else if (key === 'periodEnd') newKey = 'periodEnd';
        else if (key === 'createdAt') newKey = 'createdAt';
        else if (key === 'updatedAt') newKey = 'updatedAt';
        else if (key === 'startedAt' || key === 'start_date') newKey = 'startAt';
        else if (key === 'finishedAt' || key === 'end_date') newKey = 'endAt';

        serialized[newKey] = serializeRecord(data[key]);
      }
    }
    return serialized as T;
  }

  return data;
}
