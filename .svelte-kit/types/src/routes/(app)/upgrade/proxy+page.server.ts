// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getUpgradeData } from '$lib/api/subscriptions';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  console.log('✅ Upgrade page server - Loading upgrade data');
  
  try {
    // Obtener datos de upgrade
    const upgradeData = await getUpgradeData();
    
    console.log('📊 Upgrade data loaded:', {
      current_plan: upgradeData.current_plan.display_name,
      available_plans: upgradeData.available_plans.length,
      usage_stats: upgradeData.usage_stats
    });
    
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
