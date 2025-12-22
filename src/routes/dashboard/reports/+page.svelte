<script lang="ts">
    import { appStore } from "$lib/services/storage";
    import { BarChart3, TrendingUp, Users, Calendar } from "lucide-svelte";
    import { fade } from "svelte/transition";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    // --- KPIs ---
    $: totalStudents = store.students.length;
    $: totalRevenue = store.payments.reduce((sum, p) => sum + p.amount, 0);
    // Attendance Rate (simplified: present / total records)
    $: attendanceRate = calculateAttendanceRate(store.attendance);

    function calculateAttendanceRate(records: any[]) {
        if (records.length === 0) return 0;
        let total = 0;
        let present = 0;
        records.forEach((r) => {
            r.records.forEach((s: any) => {
                total++;
                if (s.status === "present") present++;
            });
        });
        return total === 0 ? 0 : Math.round((present / total) * 100);
    }

    // --- Charts Data ---

    // 1. Students by Level
    $: studentsByLevel = getStudentsByLevel(store.students);

    function getStudentsByLevel(students: any[]) {
        const levels: Record<string, number> = {
            Pawn: 0,
            Bishop: 0,
            Rook: 0,
            King: 0,
        };
        students.forEach((s) => {
            const lvl = s.level || "Pawn";
            if (levels[lvl] !== undefined) levels[lvl]++;
            else levels[lvl] = (levels[lvl] || 0) + 1;
        });
        return Object.entries(levels).map(([name, count]) => ({
            name,
            count,
            percentage: totalStudents > 0 ? (count / totalStudents) * 100 : 0,
        }));
    }

    // 2. Revenue by Month (Last 6 months)
    $: monthlyRevenue = getMonthlyRevenue(store.payments);

    function getMonthlyRevenue(payments: any[]) {
        const months = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = d.toISOString().slice(0, 7); // YYYY-MM
            const label = d.toLocaleString("es-ES", { month: "short" });

            const total = payments
                .filter((p) => p.date.startsWith(key))
                .reduce((sum, p) => sum + p.amount, 0);

            months.push({ label, total, key });
        }

        const max = Math.max(...months.map((m) => m.total), 10); // avoid div by 0
        return months.map((m) => ({ ...m, height: (m.total / max) * 100 }));
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" in:fade>
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 class="w-8 h-8 text-cyan-400" /> Analíticas
        </h1>
        <p class="mt-2 text-slate-400">
            Visión general del rendimiento de tu escuela.
        </p>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-slate-400 text-sm font-medium">
                        Asistencia Promedio
                    </p>
                    <p class="text-3xl font-bold text-white mt-2">
                        {attendanceRate}%
                    </p>
                </div>
                <div class="bg-pink-500/10 p-3 rounded-xl">
                    <Calendar class="w-6 h-6 text-pink-500" />
                </div>
            </div>
            <div class="mt-4 w-full bg-slate-800 rounded-full h-2">
                <div
                    class="bg-pink-500 h-2 rounded-full"
                    style="width: {attendanceRate}%"
                ></div>
            </div>
        </div>

        <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-slate-400 text-sm font-medium">
                        Ingresos Totales
                    </p>
                    <p class="text-3xl font-bold text-white mt-2">
                        {totalRevenue}€
                    </p>
                </div>
                <div class="bg-teal-500/10 p-3 rounded-xl">
                    <TrendingUp class="w-6 h-6 text-teal-500" />
                </div>
            </div>
            <p class="text-xs text-slate-500 mt-4">
                Calculado sobre historial de pagos
            </p>
        </div>

        <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-slate-400 text-sm font-medium">
                        Total Alumnos
                    </p>
                    <p class="text-3xl font-bold text-white mt-2">
                        {totalStudents}
                    </p>
                </div>
                <div class="bg-emerald-500/10 p-3 rounded-xl">
                    <Users class="w-6 h-6 text-emerald-500" />
                </div>
            </div>
            <p class="text-xs text-slate-500 mt-4">Matriculados actualmente</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Revenue Chart -->
        <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-white mb-6">
                Ingresos Últimos 6 Meses
            </h3>
            <div class="h-64 flex items-end justify-between gap-2">
                {#each monthlyRevenue as month}
                    <div
                        class="flex-1 flex flex-col items-center group cursor-default"
                    >
                        <div
                            class="w-full bg-slate-800/50 rounded-t-lg relative group-hover:bg-slate-700/50 transition-colors flex flex-col justify-end"
                            style="height: {month.height}%"
                        >
                            <!-- Bar fill -->
                            <div
                                class="w-full h-full bg-teal-500/20 border-t-2 border-teal-500 rounded-t-lg absolute bottom-0 left-0"
                            ></div>

                            <!-- Tooltip -->
                            <div
                                class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
                            >
                                {month.total} €
                            </div>
                        </div>
                        <p
                            class="text-xs text-slate-400 mt-3 uppercase font-medium"
                        >
                            {month.label}
                        </p>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Level Distribution -->
        <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-white mb-6">
                Distribución por Nivel
            </h3>
            <div class="space-y-6">
                {#each studentsByLevel as level}
                    <div>
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-slate-300 font-medium"
                                >{level.name}</span
                            >
                            <span class="text-slate-500"
                                >{level.count} alumnos ({Math.round(
                                    level.percentage,
                                )}%)</span
                            >
                        </div>
                        <div
                            class="w-full bg-slate-800 rounded-full h-3 overflow-hidden"
                        >
                            <div
                                class="h-3 rounded-full transition-all duration-1000"
                                style="width: {level.percentage}%;"
                                class:bg-blue-500={level.name === "Pawn"}
                                class:bg-emerald-500={level.name === "Bishop"}
                                class:bg-purple-500={level.name === "Rook"}
                                class:bg-orange-500={level.name === "King"}
                            ></div>
                        </div>
                    </div>
                {/each}
                {#if totalStudents === 0}
                    <p class="text-slate-500 text-center italic">
                        No hay estudiantes registrados.
                    </p>
                {/if}
            </div>

            <div
                class="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50"
            >
                <p class="text-sm text-slate-400 italic text-center">
                    "La táctica fluye de una posición superior."
                </p>
                <p class="text-xs text-slate-600 text-center mt-1">
                    — Bobby Fischer
                </p>
            </div>
        </div>
    </div>
</div>
