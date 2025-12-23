<script lang="ts">
    import {
        achievementsStore,
        type AchievementCategory,
    } from "$lib/services/achievements";
    import AchievementBadge from "$lib/components/AchievementBadge.svelte";
    import {
        Award,
        BookOpen,
        Users,
        Trophy,
        Target,
        Filter,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";

    $: achievements = $achievementsStore;
    $: unlockedAchievements = achievements.filter((a) => a.unlockedAt);
    $: lockedAchievements = achievements.filter((a) => !a.unlockedAt);

    let selectedCategory: AchievementCategory | "all" = "all";

    $: filteredAchievements =
        selectedCategory === "all"
            ? achievements
            : achievements.filter((a) => a.category === selectedCategory);

    const categories = [
        { id: "all", name: "Todos", icon: Award },
        { id: "teaching", name: "Enseñanza", icon: BookOpen },
        { id: "students", name: "Alumnos", icon: Users },
        { id: "tournaments", name: "Torneos", icon: Trophy },
        { id: "skills", name: "Habilidades", icon: Target },
    ];
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            <Award class="w-8 h-8 text-yellow-500" />
            Logros y Medallas
        </h1>
        <p class="mt-2 text-slate-400">
            Has desbloqueado {unlockedAchievements.length} de {achievements.length}
            logros ({Math.round(
                (unlockedAchievements.length / achievements.length) * 100,
            )}%)
        </p>
    </div>

    <!-- Progress Bar -->
    <div class="mb-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold text-slate-300">Progreso Total</span>
            <span class="text-sm font-bold text-purple-400">
                {unlockedAchievements.length}/{achievements.length}
            </span>
        </div>
        <div class="relative h-4 bg-slate-700 rounded-full overflow-hidden">
            <div
                class="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all duration-1000"
                style="width: {(unlockedAchievements.length /
                    achievements.length) *
                    100}%"
            ></div>
        </div>
    </div>

    <!-- Category Filter -->
    <div class="mb-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {#each categories as category}
            <button
                type="button"
                onclick={() => (selectedCategory = category.id as any)}
                class="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap
                {selectedCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}"
            >
                <svelte:component this={category.icon} class="w-4 h-4" />
                {category.name}
            </button>
        {/each}
    </div>

    <!-- Achievements Grid -->
    <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
        {#each filteredAchievements as achievement (achievement.id)}
            <div
                class="flex flex-col items-center gap-3"
                in:fly={{ y: 20, duration: 300 }}
            >
                <AchievementBadge {achievement} size="lg" showProgress={true} />
                <div class="text-center">
                    <div
                        class="font-bold text-sm {achievement.unlockedAt
                            ? 'text-white'
                            : 'text-slate-500'}"
                    >
                        {achievement.name}
                    </div>
                    <div class="text-xs text-slate-500 mt-1">
                        {achievement.description}
                    </div>
                    {#if achievement.unlockedAt}
                        <div class="text-[10px] text-emerald-400 mt-1">
                            ✓ Desbloqueado
                        </div>
                    {:else if achievement.progress > 0}
                        <div class="text-[10px] text-purple-400 mt-1">
                            {Math.round(achievement.progress)}%
                        </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    <!-- Empty State -->
    {#if filteredAchievements.length === 0}
        <div class="text-center py-20 text-slate-500">
            <Filter class="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No hay logros en esta categoría</p>
        </div>
    {/if}
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
