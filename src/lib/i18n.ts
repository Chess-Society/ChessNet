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
    
    // Use import.meta.glob to ensure Vite detects and bundles all locale modules
    const modules = import.meta.glob('./locales/modules/*.ts');
    
    for (const name of moduleNames) {
        try {
            const path = `./locales/modules/${name}.ts`;
            if (modules[path]) {
                const mod: any = await modules[path]();
                if (mod && mod.es) {
                    translations.update(current => ({
                        ...current,
                        es: { ...current.es, ...mod.es }
                    }));
                }
            } else {
                console.warn(`[i18n] Module not found: ${name}`);
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


