import { writable, derived } from 'svelte/store';
import { translations as initialTranslations } from './locales/translations';
import { browser } from '$app/environment';

/**
 * ChessNet now exclusively supports Spanish (Spain).
 */
type Locale = 'es';
export const locale = writable<Locale>('es');

// Internal store for translations, initialized with the core bundle
const translations = writable(initialTranslations);

/**
 * Dynamically load a translation module.
 * Use this in layouts or pages to load specific translation sets.
 */
export async function loadTranslations(moduleNames: string[]) {
    if (!browser) return;
    
    for (const name of moduleNames) {
        try {
            // Using a dynamic import with a template string allows Vite to split the chunks
            const mod = await import(`./locales/modules/${name}.ts`);
            if (mod && mod.es) {
                translations.update(current => ({
                    ...current,
                    es: { ...current.es, ...mod.es }
                }));
            }
        } catch (err) {
            console.error(`[i18n] Failed to load module: ${name}`, err);
        }
    }
}

export const t = derived([locale, translations], ([$locale, $translations]) => {
    return (key: string, vars: Record<string, any> = {}) => {
        // @ts-ignore
        let text = $translations[$locale]?.[key] || key;
        
        Object.entries(vars).forEach(([k, v]) => {
            text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
        
        return text;
    };
});


