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
        CreditCard,
        TrendingUp,
        Crown,
        MapPin,
    } from "lucide-svelte";
    import { scale, fade } from "svelte/transition";
    import { base } from "$app/paths";

    export let achievement: Achievement;
    export let size: "sm" | "md" | "lg" = "md";
    export let showProgress = false;

    const iconMap: Record<string, any> = {
        BookOpen,
        Users,
        Trophy,
        Target,
        School,
        CreditCard,
        TrendingUp,
        Crown,
        MapPin,
    };

    const Icon = iconMap[achievement.icon] || Target;

    const isUnlocked = achievement.unlockedAt !== undefined;

    const sizeClasses = {
        sm: "w-20 h-20", // Slightly larger to accommodate intricate badges
        md: "w-32 h-32",
        lg: "w-40 h-40",
    };

    const iconSizes = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    };
</script>

<div
    class="relative group {sizeClasses[
        size
    ]} flex items-center justify-center select-none"
    title={achievement.description}
    transition:scale={{ duration: 300 }}
>
    <!-- Badge Background (Image) -->
    <div
        class="absolute inset-0 transition-transform duration-300 group-hover:scale-110 {isUnlocked
            ? 'drop-shadow-2xl'
            : 'grayscale opacity-50 contrast-125'}"
    >
        <img
            src="{base}/badges/{achievement.tier}.png"
            alt="{achievement.tier} badge"
            class="w-full h-full object-contain"
        />
    </div>

    <!-- Icon (Centered) -->
    <div
        class="relative z-10 -mt-1 transition-transform duration-300 group-hover:scale-110"
    >
        {#if isUnlocked}
            <div class="relative">
                <!-- Outer Glow for Icon -->
                <div
                    class="absolute inset-0 bg-{getTierColor(
                        achievement.tier,
                    ).split('-')[1]}-500 blur-md opacity-50"
                ></div>
                <svelte:component
                    this={Icon}
                    class="{iconSizes[
                        size
                    ]} text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                />
            </div>
        {:else}
            <Lock class="{iconSizes[size]} text-slate-400/80 drop-shadow-md" />
        {/if}
    </div>

    <!-- Progress Bar (below badge) -->
    {#if !isUnlocked && showProgress && achievement.progress > 0}
        <div
            class="absolute -bottom-2 left-1/4 right-1/4 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50"
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
