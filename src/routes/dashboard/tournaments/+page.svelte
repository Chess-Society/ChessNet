<script lang="ts">
    import { onMount } from "svelte";
    import { getTournaments, type Tournament } from "$lib/services/mockData";
    import {
        Trophy,
        Calendar,
        Users,
        Swords,
        Plus,
        ChevronRight,
    } from "lucide-svelte";

    let tournaments: Tournament[] = [];
    let loading = true;

    onMount(async () => {
        tournaments = await getTournaments();
        loading = false;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Live":
                return "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse";
            case "Upcoming":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "Completed":
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";
            default:
                return "";
        }
    };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center justify-between">
        <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Trophy class="w-8 h-8 text-orange-400" /> Torneos
            </h1>
            <p class="mt-2 text-sm text-slate-400">
                Organiza y gestiona competiciones, suizos y arenas.
            </p>
        </div>
        <div class="mt-4 sm:mt-0">
            <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none transition-colors cursor-pointer"
            >
                <Plus class="w-4 h-4 mr-2" />
                Crear Torneo
            </button>
        </div>
    </div>

    <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#if loading}
            {#each Array(3) as _}
                <div
                    class="animate-pulse bg-[#1e293b] rounded-2xl h-64 border border-slate-700/50"
                ></div>
            {/each}
        {:else}
            {#each tournaments as tournament}
                <div
                    class="group relative bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-orange-500/30 transition-all duration-300"
                >
                    <div class="absolute top-0 right-0 p-4">
                        <span
                            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border {getStatusStyle(
                                tournament.status,
                            )}"
                        >
                            {tournament.status === "Live"
                                ? "🔴 EN VIVO"
                                : tournament.status}
                        </span>
                    </div>

                    <div class="p-6">
                        <div
                            class="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform"
                        >
                            {#if tournament.type === "Swiss"}
                                <Swords class="w-6 h-6" />
                            {:else}
                                <Trophy class="w-6 h-6" />
                            {/if}
                        </div>

                        <h3 class="text-xl font-bold text-white mb-2">
                            {tournament.name}
                        </h3>

                        <div class="space-y-3 mb-6">
                            <div
                                class="flex items-center text-slate-400 text-sm"
                            >
                                <Calendar class="w-4 h-4 mr-2 text-slate-500" />
                                {tournament.date}
                            </div>
                            <div
                                class="flex items-center text-slate-400 text-sm"
                            >
                                <Users class="w-4 h-4 mr-2 text-slate-500" />
                                {tournament.participants} Participantes
                            </div>
                            <div
                                class="flex items-center text-slate-400 text-sm"
                            >
                                <Swords class="w-4 h-4 mr-2 text-slate-500" />
                                Formato: {tournament.type}
                            </div>
                        </div>

                        <button
                            class="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-orange-600 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Gestionar
                            <ChevronRight class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
