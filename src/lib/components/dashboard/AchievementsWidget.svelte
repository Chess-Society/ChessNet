<script lang="ts">
    import { achievementsStore } from "$lib/services/achievements";
    import AchievementBadge from "$lib/components/AchievementBadge.svelte";
    import { Award, ChevronRight } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    $: achievements = $achievementsStore;
    $: unlockedAchievements = achievements.filter((a) => a.unlockedAt);
    $: recentAchievements = unlockedAchievements.slice(-3).reverse();

    // Find next achievement to unlock (highest progress among locked)
    $: lockedAchievements = achievements.filter((a) => !a.unlockedAt);
    $: nextAchievement = lockedAchievements.sort(
        (a, b) => b.progress - a.progress,
    )[0];

    function viewAll() {
        goto(`${base}/dashboard/achievements`);
    }
</script>

<div
    class="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl"
    transition:fade
>
    <!-- Header -->
    <div
        class="p-6 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-purple-900/20 to-pink-900/20"
    >
        <div>
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <Award class="w-6 h-6 text-yellow-500" />
                Logros
            </h3>
            <p class="text-sm text-slate-400 mt-1">
                {unlockedAchievements.length} de {achievements.length} desbloqueados
            </p>
        </div>
        <button
            type="button"
            onclick={viewAll}
            class="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors"
        >
            Ver todos
            <ChevronRight class="w-4 h-4" />
        </button>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-6">
        <!-- Recent Achievements -->
        {#if recentAchievements.length > 0}
            <div>
                <h4 class="text-sm font-bold text-slate-400 uppercase mb-3">
                    Recientes
                </h4>
                <div class="flex gap-4 justify-center">
                    {#each recentAchievements as achievement (achievement.id)}
                        <div in:fly={{ y: 20, duration: 300, delay: 100 }}>
                            <AchievementBadge {achievement} size="md" />
                        </div>
                    {/each}
                </div>
            </div>
        {:else}
            <div class="text-center py-8 text-slate-500">
                <Award class="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p class="text-sm">Aún no has desbloqueado ningún logro</p>
                <p class="text-xs mt-1">¡Sigue trabajando!</p>
            </div>
        {/if}

        <!-- Next Achievement Progress -->
        {#if nextAchievement && nextAchievement.progress > 0}
            <div class="border-t border-slate-700/50 pt-4">
                <h4 class="text-sm font-bold text-slate-400 uppercase mb-3">
                    Próximo Logro
                </h4>
                <div
                    class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
                >
                    <div class="flex items-center gap-4">
                        <AchievementBadge
                            achievement={nextAchievement}
                            size="sm"
                            showProgress={false}
                        />
                        <div class="flex-1">
                            <div class="font-bold text-white text-sm">
                                {nextAchievement.name}
                            </div>
                            <div class="text-xs text-slate-400 mb-2">
                                {nextAchievement.description}
                            </div>
                            <div
                                class="relative h-2 bg-slate-700 rounded-full overflow-hidden"
                            >
                                <div
                                    class="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                    style="width: {nextAchievement.progress}%"
                                ></div>
                            </div>
                            <div class="text-xs text-purple-400 mt-1">
                                {Math.round(nextAchievement.progress)}%
                                completado
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
