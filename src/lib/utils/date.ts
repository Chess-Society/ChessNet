/**
 * Parsea una fecha que puede ser un string ISO, un Timestamp de Firebase o un objeto con segundos.
 */
export function parseDate(date: any): Date {
    if (!date) return new Date();
    
    // Si ya es un objeto Date
    if (date instanceof Date) return date;
    
    // Si es un Timestamp de Firebase (tiene toDate)
    if (typeof date.toDate === 'function') return date.toDate();
    
    // Si es un objeto de segundos/nanosegundos (Firestore JSON)
    if (typeof date.seconds === 'number') {
        return new Date(date.seconds * 1000 + (date.nanoseconds || 0) / 1000000);
    }
    
    // Si es un string ISO o un número (timestamp ms)
    const d = new Date(date);
    if (!isNaN(d.getTime())) return d;
    
    return new Date();
}
