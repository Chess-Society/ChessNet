/**
 * Parsea una fecha que puede ser un string ISO, un Timestamp de Firebase o un objeto con segundos.
 * Diseñada para ser ultra-defensiva contra errores de serialización en producción.
 */
export function parseDate(date: any): Date {
    if (date === null || date === undefined) return new Date();
    
    // Si ya es un objeto Date
    if (date instanceof Date) {
        return isNaN(date.getTime()) ? new Date() : date;
    }
    
    // Si es un Timestamp de Firebase (tiene toDate)
    if (date && typeof date.toDate === 'function') {
        try {
            return date.toDate();
        } catch (e) {
            console.error("Error calling toDate on object:", e);
        }
    }
    
    // Si es un objeto de segundos/nanosegundos (Firestore JSON serializado o similar)
    if (date && typeof date === 'object') {
        if (typeof date.seconds === 'number') {
            return new Date(date.seconds * 1000 + (date.nanoseconds || 0) / 1000000);
        }
        if (typeof date._seconds === 'number') {
            return new Date(date._seconds * 1000 + (date._nanoseconds || 0) / 1000000);
        }
    }
    
    // Si es un string ISO o un número (timestamp ms)
    try {
        const d = new Date(date);
        if (!isNaN(d.getTime())) return d;
    } catch (e) {
        // Fallback final
    }
    
    return new Date();
}

/**
 * Formatea una fecha de forma segura para la UI.
 */
export function formatDate(date: any, options: Intl.DateTimeFormatOptions = {}): string {
    const d = parseDate(date);
    return d.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    });
}
