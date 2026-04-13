import type { PageServerLoad } from './$types';
import { checkPlanGating } from '$lib/server/plans';

export const load: PageServerLoad = async (event) => {
    // Solo accesible para usuarios Premium
    await checkPlanGating(event, 'premium');
    
    return {
        title: 'Agenda y Planificador'
    };
};
