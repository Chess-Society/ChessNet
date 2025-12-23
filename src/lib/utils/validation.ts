/**
 * Form validation utilities for ChessNet
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
    if (!email || email.trim() === '') {
        return { valid: false, error: 'El email es requerido' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'El formato del email no es válido' };
    }

    return { valid: true };
}

/**
 * Validate required field
 */
export function validateRequired(value: string, fieldName: string = 'Este campo'): ValidationResult {
    if (!value || value.trim() === '') {
        return { valid: false, error: `${fieldName} es requerido` };
    }
    return { valid: true };
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: number | string, fieldName: string = 'Este valor'): ValidationResult {
    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
        return { valid: false, error: `${fieldName} debe ser un número` };
    }

    if (num < 0) {
        return { valid: false, error: `${fieldName} debe ser positivo` };
    }

    return { valid: true };
}

/**
 * Validate date
 */
export function validateDate(date: string, fieldName: string = 'La fecha'): ValidationResult {
    if (!date || date.trim() === '') {
        return { valid: false, error: `${fieldName} es requerida` };
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return { valid: false, error: `${fieldName} no es válida` };
    }

    return { valid: true };
}

/**
 * Validate string length
 */
export function validateLength(
    value: string,
    min: number,
    max: number,
    fieldName: string = 'Este campo'
): ValidationResult {
    if (value.length < min) {
        return { valid: false, error: `${fieldName} debe tener al menos ${min} caracteres` };
    }

    if (value.length > max) {
        return { valid: false, error: `${fieldName} no puede tener más de ${max} caracteres` };
    }

    return { valid: true };
}

/**
 * Validate phone number (Spanish format)
 */
export function validatePhone(phone: string): ValidationResult {
    if (!phone || phone.trim() === '') {
        return { valid: true }; // Phone is optional
    }

    // Remove spaces and common separators
    const cleaned = phone.replace(/[\s\-()]/g, '');

    // Spanish phone: 9 digits starting with 6, 7, 8, or 9
    const phoneRegex = /^[6-9]\d{8}$/;
    if (!phoneRegex.test(cleaned)) {
        return { valid: false, error: 'El formato del teléfono no es válido (ej: 612345678)' };
    }

    return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
    if (!password || password.trim() === '') {
        return { valid: false, error: 'La contraseña es requerida' };
    }

    if (password.length < 8) {
        return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        return { valid: false, error: 'La contraseña debe contener al menos un número' };
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, error: 'La contraseña debe contener al menos una letra' };
    }

    return { valid: true };
}

/**
 * Validate that two values match (e.g., password confirmation)
 */
export function validateMatch(
    value1: string,
    value2: string,
    fieldName: string = 'Los valores'
): ValidationResult {
    if (value1 !== value2) {
        return { valid: false, error: `${fieldName} no coinciden` };
    }
    return { valid: true };
}

/**
 * Validate URL format
 */
export function validateURL(url: string): ValidationResult {
    if (!url || url.trim() === '') {
        return { valid: true }; // URL is optional
    }

    try {
        new URL(url);
        return { valid: true };
    } catch {
        return { valid: false, error: 'El formato de la URL no es válido' };
    }
}
