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

            <Plus class="w-5 h-5" />
            Nuevo Centro
        </button>
    </div>

    {#if showForm}
        <div transition:slide class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 max-w-2xl">
            <h3 class="text-lg font-bold text-white mb-4">Añadir Nuevo Centro</h3>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-1">Nombre del Centro</label>
                    <input bind:value={newCenter.name} type="text" placeholder="Ej: Colegio San José" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-400 mb-1">Ubicación</label>
                    <div class="relative">
                        <MapPin class="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                        <input bind:value={newCenter.location} type="text" placeholder="Ciudad, Barrio o Dirección" class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <button onclick={() => showForm = false} class="text-slate-400 hover:text-white px-4 py-2">Cancelar</button>
                    <button onclick={handleSubmit} class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium">Guardar Centro</button>
                </div>
            </div>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if store.centers.length === 0}
            <div class="col-span-full py-12 text-center bg-[#1e293b]/50 rounded-3xl border border-dashed border-slate-700">
                <School class="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-white mb-2">No hay centros registrados</h3>
                <p class="text-slate-400 mb-6">Añade tu primer centro educativo para empezar.</p>
                <button
                    onclick={() => showForm = true}
                    class="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-xl font-medium transition-all"
                >
                    Añadir Centro
                </button>
            </div>
        {:else}
            {#each store.centers as center}
                 <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500/30 transition-all group relative">
                    <button onclick={() => deleteCenter(center.id)} class="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 class="w-4 h-4" />
                    </button>
                    
                    <div class="flex items-start justify-between mb-4">
                        <div class="bg-blue-500/10 p-3 rounded-xl">
                            <Building class="w-6 h-6 text-blue-500" />
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-bold text-white mb-2">{center.name}</h3>
                    
                    <div class="space-y-2 mb-6">
                        <div class="flex items-center text-slate-400 text-sm">
                            <MapPin class="w-4 h-4 mr-2" />
                            {center.location}
                        </div>
                         <!-- Mocked counts for now as we don't assume data consistency yet -->
                         <div class="flex items-center text-slate-400 text-sm">
                            <Users class="w-4 h-4 mr-2" />
                            0 Alumnos
                        </div>
                    </div>

                    <button class="w-full bg-slate-800 text-slate-300 py-2 rounded-xl text-sm font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        Ver Detalles
                    </button>
                </div>
            {/each}
        {/if}
    </div>
</div>
