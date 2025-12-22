<script lang="ts">
    import { onMount } from "svelte";
    import { getStudents, type Student } from "$lib/services/mockData";
    import {
        Users,
        Search,
        Filter,
        Crown,
        TrendingUp,
        Clock,
    } from "lucide-svelte";

    let students: Student[] = [];
    let loading = true;

    onMount(async () => {
        students = await getStudents();
        loading = false;
    });

    const getLevelColor = (level: string) => {
        switch (level) {
            case "King":
                return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "Queen":
                return "text-purple-400 bg-purple-400/10 border-purple-400/20";
            case "Rook":
                return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            case "Bishop":
                return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            case "Knight":
                return "text-orange-400 bg-orange-400/10 border-orange-400/20";
            default:
                return "text-slate-400 bg-slate-400/10 border-slate-400/20";
        }
    };
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <Users class="w-8 h-8 text-emerald-400" /> Estudiantes
            </h1>
            <p class="mt-2 text-sm text-slate-400">
                Gestión de alumnos, progreso y estadísticas.
            </p>
        </div>
        <div class="flex gap-2">
            <div class="relative">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                />
                <input
                    type="text"
                    placeholder="Buscar alumno..."
                    class="bg-[#1e293b] border border-slate-700 text-white text-sm rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none w-64"
                />
            </div>
            <button
                class="bg-[#1e293b] border border-slate-700 text-slate-300 p-2 rounded-xl hover:text-white hover:border-slate-500 transition-colors"
            >
                <Filter class="w-5 h-5" />
            </button>
        </div>
    </div>

    <!-- Students Table/Grid -->
    <div
        class="mt-8 bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl"
    >
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-400">
                <thead
                    class="bg-slate-800/50 text-xs uppercase font-semibold text-slate-300"
                >
                    <tr>
                        <th class="px-6 py-4">Estudiante</th>
                        <th class="px-6 py-4">Nivel / Elo</th>
                        <th class="px-6 py-4">Asistencia</th>
                        <th class="px-6 py-4">Racha</th>
                        <th class="px-6 py-4">Última Actividad</th>
                        <th class="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                    {#if loading}
                        {#each Array(5) as _}
                            <tr>
                                <td colspan="6" class="px-6 py-4">
                                    <div
                                        class="h-4 bg-slate-700/50 rounded animate-pulse w-full"
                                    ></div>
                                </td>
                            </tr>
                        {/each}
                    {:else}
                        {#each students as student}
                            <tr
                                class="hover:bg-slate-800/30 transition-colors group"
                            >
                                <td class="px-6 py-4 flex items-center gap-4">
                                    <img
                                        src={student.avatar}
                                        alt={student.name}
                                        class="w-10 h-10 rounded-full bg-slate-700"
                                    />
                                    <div>
                                        <div class="font-semibold text-white">
                                            {student.name}
                                        </div>
                                        <div class="text-xs">
                                            ID: #{student.id}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="px-2 py-1 rounded-md text-xs font-bold border {getLevelColor(
                                                student.level,
                                            )}"
                                        >
                                            {student.level}
                                        </span>
                                        <span class="text-white font-mono"
                                            >{student.elo}</span
                                        >
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="w-16 h-2 bg-slate-700 rounded-full overflow-hidden"
                                        >
                                            <div
                                                class="h-full bg-emerald-500"
                                                style="width: {student.attendance}%"
                                            ></div>
                                        </div>
                                        <span class="text-xs"
                                            >{student.attendance}%</span
                                        >
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div
                                        class="flex items-center gap-1 text-orange-400"
                                    >
                                        <TrendingUp class="w-4 h-4" />
                                        <span>{student.streak} días</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-1">
                                        <Clock class="w-4 h-4" />
                                        <span>{student.lastActive}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <button
                                        class="text-blue-400 hover:text-blue-300 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        Ver Perfil
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>
