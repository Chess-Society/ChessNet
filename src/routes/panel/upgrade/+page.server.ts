import type { PageServerLoad } from './$types';
import { getUpgradeData } from '$lib/api/subscriptions';

export const load: PageServerLoad = async ({ locals }) => {
  
  try {
    // Obtener datos de upgrade
    const upgradeData = await getUpgradeData();
    

    
    return {
      user: locals.user,
      upgradeData
    };
  } catch (error) {
    console.error('❌ Error loading upgrade data:', error);
    
    // Fallback con datos básicos
    return {
      user: locals.user,
      upgradeData: null
    };
  }
};
