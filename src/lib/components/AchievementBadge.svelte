<script lang="ts">
    import type {
        Achievement,
        AchievementTier,
    } from "$lib/services/achievements";
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

    // Premium Gradients for CSS Badges
    const tierStyles = {
        bronze: {
            bg: "bg-gradient-to-br from-[#CD7F32] via-[#B87333] to-[#8C5A2B]",
            border: "border-[#ECD5C5]/30",
            shadow: "shadow-orange-900/50",
            icon: "text-orange-100",
            glow: "bg-orange-500",
        },
        silver: {
            bg: "bg-gradient-to-br from-[#E0E0E0] via-[#C0C0C0] to-[#A0A0A0]",
            border: "border-white/40",
            shadow: "shadow-slate-600/50",
            icon: "text-white",
            glow: "bg-blue-400",
        },
        gold: {
            bg: "bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#C49302]",
            border: "border-yellow-200/40",
            shadow: "shadow-yellow-700/50",
            icon: "text-yellow-50",
            glow: "bg-yellow-400",
        },
        platinum: {
            bg: "bg-gradient-to-br from-[#00ced1] via-[#4682b4] to-[#8a2be2]", // Cyan to Purple
            border: "border-cyan-200/40",
            shadow: "shadow-purple-900/50",
            icon: "text-cyan-50",
            glow: "bg-cyan-400",
        },
    };

    const style = tierStyles[achievement.tier];

    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
    };

    const iconSizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };
</script>

<div
    class="relative group {sizeClasses[
        size
    ]} flex items-center justify-center select-none"
    title={achievement.description}
    transition:scale={{ duration: 300 }}
>
    <!-- Badge Background (CSS Hexagon/Shield) -->
    <div
        class="absolute inset-0 transition-transform duration-300 group-hover:scale-105 {isUnlocked
            ? 'drop-shadow-lg'
            : 'grayscale opacity-40'}"
    >
        {#if isUnlocked}
            <!-- Main Body -->
            <div
                class="absolute inset-0 rounded-[22%] rotate-3 shadow-inner {style.bg}"
            ></div>
            <div
                class="absolute inset-0 rounded-[22%] -rotate-3 opacity-80 {style.bg}"
            ></div>
            <!-- Glassy Overlay -->
            <div
                class="absolute inset-1 rounded-[20%] bg-gradient-to-b from-white/20 to-transparent border-t border-white/40"
            ></div>
            <!-- Inner Ring -->
            <div
                class="absolute inset-2 rounded-full border-4 {style.border} shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] bg-black/10 flex items-center justify-center"
            ></div>
        {:else}
            <!-- Locked State -->
            <div
                class="absolute inset-0 rounded-[22%] bg-slate-800 border-2 border-slate-700"
            ></div>
            <div
                class="absolute inset-2 rounded-full bg-slate-900/50 border border-slate-700/50"
            ></div>
        {/if}
    </div>

    <!-- Icon (Centered) -->
    <div
        class="relative z-10 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
    >
        {#if isUnlocked}
            <div class="relative filter drop-shadow-md">
                <svelte:component
                    this={Icon}
                    class="{iconSizes[size]} {style.icon}"
                />
            </div>
            <!-- Corner Sparkle -->
            <div
                class="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full blur-[1px] animate-pulse"
            ></div>
        {:else}
            <Lock class="{iconSizes[size]} text-slate-500/50" />
        {/if}
    </div>

    <!-- Progress Bar (below badge) -->
    {#if !isUnlocked && showProgress && achievement.progress > 0}
        <div
            class="absolute -bottom-3 left-0 right-0 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-sm"
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
