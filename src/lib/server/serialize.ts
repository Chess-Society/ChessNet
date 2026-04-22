
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
        if (key === 'owner_id' || key === 'userId') newKey = 'ownerId';
        else if (key === 'student_id') newKey = 'studentId';
        else if (key === 'school_id') newKey = 'schoolId';
        else if (key === 'class_id') newKey = 'classId';
        else if (key === 'tournament_id') newKey = 'tournamentId';
        else if (key === 'round_no') newKey = 'roundNo';
        else if (key === 'first_name') newKey = 'firstName';
        else if (key === 'last_name') newKey = 'lastName';
        else if (key === 'parent_email') newKey = 'parentEmail';
        else if (key === 'parent_phone') newKey = 'parentPhone';
        else if (key === 'date_of_birth') newKey = 'dateOfBirth';
        else if (key === 'lichess_username') newKey = 'lichessUsername';
        else if (key === 'payment_type') newKey = 'paymentType';
        else if (key === 'due_date') newKey = 'dueDate';
        else if (key === 'paid_date') newKey = 'paidDate';
        else if (key === 'period_start') newKey = 'periodStart';
        else if (key === 'period_end') newKey = 'periodEnd';
        else if (key === 'created_at') newKey = 'createdAt';
        else if (key === 'updated_at') newKey = 'updatedAt';
        else if (key === 'started_at' || key === 'start_date') newKey = 'startAt';
        else if (key === 'finished_at' || key === 'end_date') newKey = 'endAt';

        serialized[newKey] = serializeRecord(data[key]);
      }
    }
    return serialized as T;
  }

  return data;
}
