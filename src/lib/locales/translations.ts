import * as common from './modules/common';
import * as errors from './modules/errors';
import * as landing from './modules/landing';

/**
 * Initial translations bundle.
 * Only include modules needed for the initial render (landing page, common UI).
 * Other modules should be loaded dynamically using loadTranslations() from $lib/i18n.
 */
export const translations = {
    es: {
        ...common.es,
        ...errors.es,
        ...landing.es,
    }
};


