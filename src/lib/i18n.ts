import { writable, derived } from 'svelte/store';
import { translations } from './locales/translations';
import { browser } from '$app/environment';

type Locale = 'en' | 'es';

export const locale = writable<Locale>('es');

export function toggleLocale() {
    locale.update(l => {
        const next = l === 'en' ? 'es' : 'en';
        if (browser) {
            localStorage.setItem('locale', next);
            document.documentElement.lang = next;
        }
        return next;
    });
}

if (browser) {
    const saved = localStorage.getItem('locale') as Locale;
    const initial = saved || (navigator.language.split('-')[0] as Locale) || 'es';
    const supported: Locale[] = ['en', 'es'];
    locale.set(supported.includes(initial) ? initial : 'es');
}

locale.subscribe((value) => {
    if (browser) {
        localStorage.setItem('locale', value);
        document.documentElement.lang = value;
    }
});

export const t = derived(locale, ($locale) => {
    return (key: string, vars: Record<string, any> = {}) => {
        const lang = (['en', 'es'].includes($locale) ? $locale : 'es') as Locale;
        // @ts-ignore
        let text = translations[lang]?.[key] || translations['en']?.[key] || key;
        
        Object.entries(vars).forEach(([k, v]) => {
            text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
        });
        
        return text;
    };
});
