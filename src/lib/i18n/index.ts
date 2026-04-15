import { writable, derived } from 'svelte/store';
import { translations } from './translations';
import { browser } from '$app/environment';

type Locale = 'en' | 'es';

const initialLocale: Locale = (browser && localStorage.getItem('locale') as Locale) || 'es';

export const locale = writable<Locale>(initialLocale);

locale.subscribe((value) => {
    if (browser) {
        localStorage.setItem('locale', value);
        document.documentElement.lang = value;
    }
});

export const t = derived(locale, ($locale) => {
    return (key: keyof typeof translations['en'] | string) => {
        // @ts-ignore
        return translations[$locale][key] || key;
    };
});
