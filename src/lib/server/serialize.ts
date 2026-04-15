import { Timestamp } from 'firebase-admin/firestore';

/**
 * Normaliza los datos de Firestore para que sean serializables por SvelteKit.
 * Convierte Timestamps a ISO strings y maneja objetos anidados.
 */
export function serializeRecord<T>(data: any): T {
  if (data === null || data === undefined) return data;

  // Firestore Timestamp (Server-side admin SDK)
  if (typeof data.toDate === 'function') {
    return data.toDate().toISOString() as any;
  }

  // Native Date
  if (data instanceof Date) {
    return data.toISOString() as any;
  }

  // Array
  if (Array.isArray(data)) {
    return data.map(item => serializeRecord(item)) as any;
  }

  // Object
  if (typeof data === 'object') {
    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        serialized[key] = serializeRecord(data[key]);
      }
    }
    return serialized as T;
  }

  return data;
}
