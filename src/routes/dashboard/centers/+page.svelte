<script lang="ts">
    import { onMount } from "svelte";
    import { getCenters, type Center } from "$lib/services/mockData";
    import { School, MapPin, Users, Activity, Plus } from "lucide-svelte";

    let centers: Center[] = [];
    let loading = true;

    onMount(async () => {
        centers = await getCenters();
        loading = false;
    });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <School class="w-8 h-8 text-blue-400" /> Centros Educativos
            </h1>
            <p class="mt-2 text-sm text-slate-400">
                Lista de todas las academias y colegios asociados a tu cuenta.
            </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                type="button"
                class="inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors cursor-pointer"
            >
                <Plus class="w-4 h-4 mr-2" />
                Nuevo Centro
            </button>
        </div>
    </div>

    <!-- Stats Overview -->
    <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
            class="overflow-hidden rounded-2xl bg-[#1e293b] border border-slate-700/50 p-5 shadow"
        >
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <School class="h-6 w-6 text-slate-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                    <dl>
                        <dt class="truncate text-sm font-medium text-slate-400">
                            Total Centros
                        </dt>
                        <dd>
                            <div class="text-lg font-medium text-white">
                                {centers.length}
                            </div>
                        </dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>

    <!-- Content Grid -->
    <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#if loading}
            {#each Array(3) as _}
                <div
                    class="animate-pulse bg-[#1e293b] rounded-2xl h-48 border border-slate-700/50"
                ></div>
            {/each}
        {:else}
            {#each centers as center}
                <div
                    class="relative flex flex-col overflow-hidden rounded-2xl bg-[#1e293b] border border-slate-700/50 transition duration-300 hover:shadow-xl hover:border-slate-600 group"
                >
                    <div class="p-6 flex-1">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="rounded-lg bg-blue-900/30 p-2">
                                    <School class="h-6 w-6 text-blue-400" />
                                </div>
                                <h3
                                    class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors"
                                >
                                    {center.name}
                                </h3>
                            </div>
                            <span
                                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {center.status ===
                                'active'
                                    ? 'bg-green-400/10 text-green-400'
                                    : 'bg-red-400/10 text-red-400'}"
                            >
                                {center.status === "active"
                                    ? "Activo"
                                    : "Inactivo"}
                            </span>
                        </div>

                        <div class="mt-6 space-y-3">
                            <div
                                class="flex items-center text-sm text-slate-400"
                            >
                                <MapPin class="mr-2 h-4 w-4 text-slate-500" />
                                {center.location}
                            </div>
                            <div
                                class="flex items-center text-sm text-slate-400"
                            >
                                <Users class="mr-2 h-4 w-4 text-slate-500" />
                                {center.studentCount} Alumnos
                            </div>
                            <div
                                class="flex items-center text-sm text-slate-400"
                            >
                                <Activity class="mr-2 h-4 w-4 text-slate-500" />
                                {center.activeGroups} Grupos Activos
                            </div>
                        </div>
                    </div>
                    <div
                        class="bg-slate-800/50 px-6 py-4 flex justify-between items-center"
                    >
                        <button
                            class="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                        >
                            Administrar
                        </button>
                        <button
                            class="text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                            Ver Detalles
                        </button>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
