<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import {
        Trophy,
        Star,
        TrendingUp,
        Calendar,
        User,
        Shield,
        Target,
        Award,
    } from "lucide-svelte";
    import { fly, fade } from "svelte/transition";

    let data = {
        name: "Estudiante",
        level: "Pawn",
        attendance: 0,
        skills: [] as { name: string; val: number }[],
        lastClass: "",
        notes: "",
    };

    let loading = true;

    onMount(() => {
        const q = $page.url.searchParams.get("d");
        if (q) {
            try {
                const decoded = JSON.parse(atob(q));
                data = { ...data, ...decoded };
            } catch (e) {
                console.error("Error decoding data", e);
            }
        }
        loading = false;
    });

    function getLevelColor(level: string) {
        switch (level) {
            case "Pawn":
                return "bg-slate-500";
            case "Bishop":
                return "bg-blue-500";
            case "Rook":
                return "bg-purple-500";
            case "King":
                return "bg-amber-500";
            default:
                return "bg-emerald-500";
        }
    }

    function getLevelName(level: string) {
        const map: Record<string, string> = {
            Pawn: "Peón",
            Bishop: "Alfil",
            Rook: "Torre",
            King: "Rey",
        };
        return map[level] || level;
    }
</script>

<div
    class="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-800"
>
    <!-- Decorative Background Elements -->
    <div
        class="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-b-[3rem] shadow-lg z-0"
    ></div>
    <div
        class="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
    ></div>
    <div
        class="absolute top-20 left-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
    ></div>

    <div class="relative z-10 max-w-md mx-auto p-4 pt-12">
        {#if loading}
            <div class="flex items-center justify-center h-64 text-white">
                Cargando perfil...
            </div>
        {:else}
            <!-- Profile Header Card -->
            <div
                in:fly={{ y: 20, duration: 600 }}
                class="bg-white rounded-2xl shadow-xl p-6 mb-6 text-center border border-indigo-50"
            >
                <div class="relative inline-block">
                    <div
                        class="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-inner mb-3 border-4 border-white"
                    >
                        <span class="text-3xl font-bold text-slate-400"
                            >{data.name.charAt(0)}</span
                        >
                    </div>
                    <div
                        class="absolute -bottom-2 -right-2 {getLevelColor(
                            data.level,
                        )} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1"
                    >
                        <Shield class="w-3 h-3" />
                        {getLevelName(data.level)}
                    </div>
                </div>

                <h1 class="text-2xl font-bold text-slate-800 mt-2">
                    {data.name}
                </h1>
                <p class="text-slate-500 text-sm">Alumno de Ajedrez</p>

                <div class="grid grid-cols-2 gap-4 mt-6">
                    <div
                        class="bg-blue-50 p-3 rounded-xl border border-blue-100"
                    >
                        <div
                            class="flex items-center justify-center gap-2 text-blue-600 mb-1"
                        >
                            <Calendar class="w-4 h-4" />
                            <span class="text-xs font-bold uppercase"
                                >Asistencia</span
                            >
                        </div>
                        <span class="text-2xl font-bold text-blue-700"
                            >{data.attendance}%</span
                        >
                    </div>
                    <div
                        class="bg-amber-50 p-3 rounded-xl border border-amber-100"
                    >
                        <div
                            class="flex items-center justify-center gap-2 text-amber-600 mb-1"
                        >
                            <Star class="w-4 h-4" />
                            <span class="text-xs font-bold uppercase"
                                >Nivel</span
                            >
                        </div>
                        <span class="text-xl font-bold text-amber-700"
                            >{getLevelName(data.level)}</span
                        >
                    </div>
                </div>
            </div>

            <!-- Skills Progress -->
            <div
                in:fly={{ y: 20, duration: 600, delay: 100 }}
                class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100"
            >
                <h2
                    class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"
                >
                    <Target class="w-5 h-5 text-indigo-500" />
                    Progreso de Habilidades
                </h2>

                <div class="space-y-4">
                    {#if data.skills.length === 0}
                        <p
                            class="text-slate-400 text-sm italic py-2 text-center"
                        >
                            Sin habilidades registradas aún.
                        </p>
                    {:else}
                        {#each data.skills as skill}
                            <div>
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="font-medium text-slate-700"
                                        >{skill.name}</span
                                    >
                                    <span class="text-slate-500"
                                        >{skill.val}%</span
                                    >
                                </div>
                                <div
                                    class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden"
                                >
                                    <div
                                        class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                        style="width: {skill.val}%"
                                    ></div>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>

            <!-- Recent Activity / Notes -->
            <div
                in:fly={{ y: 20, duration: 600, delay: 200 }}
                class="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-100"
            >
                <h2
                    class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"
                >
                    <Award class="w-5 h-5 text-amber-500" />
                    Últimas Notas
                </h2>
                {#if data.notes}
                    <div
                        class="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400 italic text-slate-700 text-sm"
                    >
                        "{data.notes}"
                    </div>
                {:else}
                    <div class="text-slate-400 text-sm text-center py-4">
                        Sin notas recientes.
                    </div>
                {/if}
            </div>

            <div class="text-center pb-8 opacity-60">
                <p class="text-xs text-slate-500">Generado con ChessNet</p>
                <div class="flex justify-center gap-2 mt-2">
                    <div class="w-2 h-2 rounded-full bg-indigo-400"></div>
                    <div class="w-2 h-2 rounded-full bg-purple-400"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                </div>
            </div>
        {/if}
    </div>
</div>
