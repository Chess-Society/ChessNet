import { g as getUpgradeData } from "../../../../chunks/subscriptions.js";
const load = async ({ locals }) => {
  console.log("✅ Upgrade page server - Loading upgrade data");
  try {
    const upgradeData = await getUpgradeData();
    console.log("📊 Upgrade data loaded:", {
      current_plan: upgradeData.current_plan.display_name,
      available_plans: upgradeData.available_plans.length,
      usage_stats: upgradeData.usage_stats
    });
    return {
      user: locals.user,
      upgradeData
    };
  } catch (error) {
    console.error("❌ Error loading upgrade data:", error);
    return {
      user: locals.user,
      upgradeData: null
    };
  }
};
export {
  load
};
