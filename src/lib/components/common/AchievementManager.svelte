<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { appStore, storeActions } from "$lib/services/storage";
    import { ACHIEVEMENTS, type Achievement } from "$lib/services/achievements";
    import { fireConfetti } from "$lib/utils/confetti";
    import { notifications } from "$lib/stores/notifications";

    // Metrics calculation logic duplicated from achievements.ts for detection
    // In a larger app, this should be a shared service
    $: store = $appStore;

    $: metrics = {
        classes: store.classes.length,
        students: store.students.length,
        tournaments: store.tournaments.length,
        skills: store.skills.length,
        centers: store.centers.length,
        revenue: store.payments.reduce((sum, p) => sum + p.amount, 0),
    };

    let previousUnlockedCount = 0;
    let initialized = false;

    // Monitor for changes
    $: {
        if (store) {
            checkAchievements();
        }
    }

    function checkAchievements() {
        const unlocked = store.unlockedAchievements || [];
        const unlockedIds = new Set(unlocked.map((a) => a.id));
        const newUnlocks: Achievement[] = [];

        ACHIEVEMENTS.forEach((achievement) => {
            if (unlockedIds.has(achievement.id)) return; // Already processed

            const currentValue =
                metrics[
                    achievement.requirement.metric as keyof typeof metrics
                ] || 0;

            if (currentValue >= achievement.requirement.target) {
                newUnlocks.push(achievement as any);
                storeActions.unlockAchievement(achievement.id);
            }
        });

        if (newUnlocks.length > 0) {
            handleNewUnlocks(newUnlocks);
        }

        // Mark as initialized after first check to avoid spam on reload
        // Wait, storeActions updates the store, which triggers this again.
        // We need to be careful not to infinite loop, but strict checks prevents it.
        // The issue is: if we load the page, we might find 5 unlocks. Do we celebrate?
        // If they were NOT in store.unlockedAchievements, it means they are "new" to the persistence layer.
        // But maybe the user had them "conceptually" before.
        // Plan: If we unlock > 3 at once, we consider it a "Sync" and don't spam.
        // Unless it's the very first time? No, let's just group them.
    }

    function handleNewUnlocks(achievements: Achievement[]) {
        // If we unlock too many at once (e.g. migration), just notify summary
        if (achievements.length > 3) {
            notifications.success(
                `¡Has desbloqueado ${achievements.length} logros nuevos! Revisa tu perfil.`,
            );
            // Maybe one small confetti?
            // fireConfetti();
        } else {
            // Celebrate each one
            achievements.forEach((a, i) => {
                setTimeout(() => {
                    fireConfetti();
                    notifications.success(`🏆 ¡Logro Desbloqueado: ${a.name}!`);
                }, i * 2000); // Stagger by 2 seconds
            });
        }
    }
</script>

<!-- Headless component -->
