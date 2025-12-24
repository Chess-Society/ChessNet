<script lang="ts">
    import {
        achievementsStore,
        type AchievementCategory,
        type Achievement,
    } from "$lib/services/achievements";
    import AchievementBadge from "$lib/components/AchievementBadge.svelte";
    import {
        Award,
        BookOpen,
        Users,
        Trophy,
        Target,
        Crown,
        Star,
        Zap,
        Lock,
    } from "lucide-svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { flip } from "svelte/animate";

    $: achievements = $achievementsStore;
    $: unlockedAchievements = achievements.filter((a) => a.unlockedAt);

    // --- Gamification Logic ---
    const XP_TABLE = {
        bronze: 100,
        silver: 250,
        gold: 500,
        platinum: 1000,
    };

    $: totalXP = unlockedAchievements.reduce(
        (acc, a) => acc + (XP_TABLE[a.tier] || 0),
        0,
    );

    // Level thresholds
    const LEVEL_THRESHOLDS = [
        { level: 1, xp: 0, title: "Novato", icon: "♟️" },
        { level: 2, xp: 500, title: "Aficionado", icon: "♞" },
        { level: 3, xp: 1500, title: "Promesa", icon: "♝" },
        { level: 4, xp: 3000, title: "Experto", icon: "♜" },
        { level: 5, xp: 5000, title: "Maestro Nacional", icon: "♛" },
        { level: 6, xp: 8000, title: "Gran Maestro", icon: "👑" },
        { level: 7, xp: 12000, title: "Leyenda", icon: "🌍" },
    ];

    $: currentLevelInfo =
        [...LEVEL_THRESHOLDS].reverse().find((l) => totalXP >= l.xp) ||
        LEVEL_THRESHOLDS[0];

    $: nextLevelInfo = LEVEL_THRESHOLDS.find(
        (l) => l.level === currentLevelInfo.level + 1,
    );

    $: progressToNext = nextLevelInfo
        ? ((totalXP - currentLevelInfo.xp) /
              (nextLevelInfo.xp - currentLevelInfo.xp)) *
          100
        : 100;

    // Categories View
    const categoryConfig: Record<
        AchievementCategory,
        { label: string; icon: any; color: string }
    > = {
        teaching: {
            label: "Enseñanza",
            icon: BookOpen,
            color: "text-blue-400",
        },
        students: { label: "Alumnos", icon: Users, color: "text-green-400" },
        tournaments: {
            label: "Competición",
            icon: Trophy,
            color: "text-amber-400",
        },
        skills: { label: "Habilidades", icon: Target, color: "text-red-400" },
        engagement: {
            label: "Constancia",
            icon: Zap,
            color: "text-purple-400",
        },
    };

    // Grouping
    $: groupedAchievements = achievements.reduce(
        (acc, a) => {
            if (!acc[a.category]) acc[a.category] = [];
            acc[a.category].push(a);
            return acc;
        },
        {} as Record<AchievementCategory, Achievement[]>,
    );

    $: categoriesList = Object.keys(
        groupedAchievements,
    ) as AchievementCategory[];

    function getCategoryProgress(cat: AchievementCategory) {
        const total = groupedAchievements[cat]?.length || 0;
        const unlocked =
            groupedAchievements[cat]?.filter((a) => a.unlockedAt).length || 0;
        return total > 0 ? (unlocked / total) * 100 : 0;
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
    <!-- Hero / Profile Section -->
    <div
        class="relative bg-slate-900 border border-slate-700 rounded-3xl p-8 mb-12 overflow-hidden shadow-2xl"
    >
        <!-- Background Effects -->
        <div
            class="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"
        ></div>
        <div
            class="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-20 -mb-20"
        ></div>

        <div
            class="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12"
        >
            <!-- Level Circle -->
            <div class="relative">
                <div
                    class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-500"
                >
                    <span
                        class="text-6xl md:text-7xl filter drop-shadow-md cursor-default"
                    >
                        {currentLevelInfo.icon}
                    </span>
                    <!-- Level Badge -->
                    <div
                        class="absolute -bottom-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg border border-yellow-400/50"
                    >
                        Nivel {currentLevelInfo.level}
                    </div>
                </div>
            </div>

            <!-- Stats & Progress -->
            <div class="flex-1 w-full text-center md:text-left">
                <h2
                    class="text-sm font-bold text-blue-400 uppercase tracking-wider mb-1"
                >
                    Perfil de Entrenador
                </h2>
                <h1 class="text-3xl md:text-5xl font-extrabold text-white mb-2">
                    {currentLevelInfo.title}
                </h1>
                <div
                    class="text-slate-400 mb-6 flex items-center justify-center md:justify-start gap-2"
                >
                    <Star class="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span class="text-yellow-100 font-bold">{totalXP} XP</span>
                    <span class="text-slate-600 mx-2">•</span>
                    <span
                        >{unlockedAchievements.length} Logros desbloqueados</span
                    >
                </div>

                <!-- XP Bar -->
                <div
                    class="relative w-full max-w-2xl bg-slate-800 rounded-full h-4 mb-2 overflow-hidden border border-slate-700/50"
                >
                    <div
                        class="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out"
                        style="width: {progressToNext}%"
                    ></div>
                </div>
                <div
                    class="flex justify-between max-w-2xl text-xs font-mono text-slate-500"
                >
                    <span>{totalXP} XP</span>
                    {#if nextLevelInfo}
                        <span
                            >Siguiente: {nextLevelInfo.title} ({nextLevelInfo.xp}
                            XP)</span
                        >
                    {:else}
                        <span>¡Nivel Máximo!</span>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <!-- Achievements by Category -->
    <div class="space-y-12">
        {#each categoriesList as category}
            {@const config = categoryConfig[category] || {
                label: category,
                icon: Target,
                color: "text-white",
            }}
            {@const progress = getCategoryProgress(category)}
            {@const catAchievements = groupedAchievements[category]}

            <section in:fade={{ duration: 500 }}>
                <!-- Category Header -->
                <div
                    class="flex items-end gap-4 mb-6 border-b border-slate-800 pb-4"
                >
                    <div class="p-3 bg-slate-800/50 rounded-2xl">
                        <svelte:component
                            this={config.icon}
                            class="w-8 h-8 {config.color}"
                        />
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center mb-2">
                            <h3
                                class="text-2xl font-bold text-white tracking-tight"
                            >
                                {config.label}
                            </h3>
                            <span
                                class="text-sm font-mono {config.color} bg-slate-900 px-2 py-1 rounded-lg border border-slate-700"
                            >
                                {Math.round(progress)}% Completado
                            </span>
                        </div>
                        <!-- Micro progress line -->
                        <div
                            class="h-1 bg-slate-800 rounded-full overflow-hidden w-full"
                        >
                            <div
                                class="h-full {config.color.replace(
                                    'text-',
                                    'bg-',
                                )}"
                                style="width: {progress}%"
                            ></div>
                        </div>
                    </div>
                </div>

                <!-- Grid -->
                <div
                    class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                    {#each catAchievements as achievement (achievement.id)}
                        <div class="group relative perspective">
                            <div
                                class="relative bg-slate-800/30 border border-slate-700/50 hover:border-slate-500/50 rounded-2xl p-4 flex flex-col items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl duration-300 min-h-[220px]"
                            >
                                <!-- Badge -->
                                <AchievementBadge
                                    {achievement}
                                    size="md"
                                    showProgress={true}
                                />

                                <!-- Info -->
                                <div
                                    class="text-center w-full z-10 flex-1 flex flex-col justify-between"
                                >
                                    <div>
                                        <h4
                                            class="font-bold text-sm text-slate-200 leading-tight mb-1 group-hover:text-white transition-colors"
                                        >
                                            {achievement.name}
                                        </h4>
                                        <p
                                            class="text-[10px] text-slate-500 line-clamp-2 leading-relaxed"
                                        >
                                            {achievement.description}
                                        </p>
                                    </div>

                                    <!-- Footer (XP or Lock) -->
                                    <div
                                        class="mt-3 pt-3 border-t border-slate-700/30 w-full flex justify-center"
                                    >
                                        {#if achievement.unlockedAt}
                                            <div
                                                class="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-0.5 rounded-full"
                                            >
                                                <Trophy class="w-3 h-3" />
                                                <span
                                                    >+{XP_TABLE[
                                                        achievement.tier
                                                    ]} XP</span
                                                >
                                            </div>
                                        {:else}
                                            <div
                                                class="text-xs font-semibold text-slate-600 flex items-center gap-1"
                                            >
                                                <Lock class="w-3 h-3" />
                                                <span
                                                    >{XP_TABLE[
                                                        achievement.tier
                                                    ]} XP</span
                                                >
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </section>
        {/each}
    </div>
</div>

<style>
    /* Custom utility for perspective if needed, but Tailwind usually handles it via standard classes or we keep it simple */
    .perspective {
        perspective: 1000px;
    }
</style>
