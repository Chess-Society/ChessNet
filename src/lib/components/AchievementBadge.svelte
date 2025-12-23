<script lang="ts">
    import type {
        Achievement,
        AchievementTier,
    } from "$lib/services/achievements";
    import { getTierColor, getTierGlow } from "$lib/services/achievements";
    import {
        BookOpen,
        Users,
        Trophy,
        Target,
        School,
        Lock,
    } from "lucide-svelte";
    import { scale, fade } from "svelte/transition";

    export let achievement: Achievement;
    export let size: "sm" | "md" | "lg" = "md";
    export let showProgress = false;

    const iconMap: Record<string, any> = {
        BookOpen,
        Users,
        Trophy,
        Target,
        School,
    };

    const Icon = iconMap[achievement.icon] || Target;

    const isUnlocked = achievement.unlockedAt !== undefined;

    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
    };

    const iconSizes = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-14 h-14",
    };
</script>

<div
    class="relative group {sizeClasses[size]} cursor-pointer"
    title={achievement.description}
    transition:scale={{ duration: 300 }}
>
    <!-- Badge Container -->
    <div
        class="w-full h-full rounded-2xl border-2 transition-all duration-300 flex items-center justify-center relative overflow-hidden
        {isUnlocked
            ? `bg-gradient-to-br ${getTierColor(achievement.tier)} border-white/20 ${getTierGlow(achievement.tier)} shadow-xl group-hover:scale-110`
            : 'bg-slate-800/50 border-slate-700 grayscale opacity-60 group-hover:opacity-80'}"
    >
        <!-- Shine Effect for Unlocked -->
        {#if isUnlocked}
            <div
                class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            ></div>
        {/if}

        <!-- Icon -->
        <div class="relative z-10">
            {#if isUnlocked}
                <svelte:component
                    this={Icon}
                    class="{iconSizes[size]} text-white drop-shadow-lg"
                />
            {:else}
                <Lock class="{iconSizes[size]} text-slate-500" />
            {/if}
        </div>

        <!-- Tier Indicator (small corner badge) -->
        {#if isUnlocked && size !== "sm"}
            <div
                class="absolute top-1 right-1 w-3 h-3 rounded-full bg-white/30 border border-white/50"
            ></div>
        {/if}
    </div>

    <!-- Progress Bar (if locked and showProgress) -->
    {#if !isUnlocked && showProgress && achievement.progress > 0}
        <div
            class="absolute -bottom-2 left-0 right-0 h-1 bg-slate-700 rounded-full overflow-hidden"
            transition:fade
        >
            <div
                class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style="width: {achievement.progress}%"
            ></div>
        </div>
    {/if}
</div>

<!-- Tooltip on hover (optional, for larger sizes) -->
{#if size !== "sm"}
    <div
        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl"
    >
        <div class="font-bold">{achievement.name}</div>
        <div class="text-slate-400 text-[10px]">{achievement.description}</div>
        {#if !isUnlocked}
            <div class="text-purple-400 text-[10px] mt-1">
                Progreso: {Math.round(achievement.progress)}%
            </div>
        {/if}
    </div>
{/if}
