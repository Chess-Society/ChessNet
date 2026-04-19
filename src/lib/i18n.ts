import { writable, derived } from 'svelte/store';
import { translations } from './locales/translations';
import { browser } from '$app/environment';

/**
 * ChessNet now exclusively supports Spanish (Spain).
 * Localized language preference is locked to 'es'.
 */
type Locale = 'es';

export const locale = writable<Locale>('es');

// Language toggle is deprecated as the platform is now Spanish-only
export function toggleLocale() {
    console.warn('Language toggling is disabled. ChessNet is now Spanish-only.');
}

if (browser) {
    // Force Spanish regardless of previous settings
    localStorage.setItem('locale', 'es');
    document.documentElement.lang = 'es';
}

export const t = derived(locale, ($locale) => {
    return (key: string, vars: Record<string, any> = {}) => {
        const lang = 'es';
        // @ts-ignore
        let text = translations[lang]?.[key] || key;
        
        Object.entries(vars).forEach(([k, v]) => {
            text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
        
        return text;
    };
});

