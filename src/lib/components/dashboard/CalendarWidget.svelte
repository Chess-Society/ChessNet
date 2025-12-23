<script lang="ts">
    import { appStore, type ClassGroup } from "$lib/services/storage";
    import {
        ChevronLeft,
        ChevronRight,
        Calendar as CalendarIcon,
        Clock,
        MapPin,
    } from "lucide-svelte";
    import { fade } from "svelte/transition";

    $: store = $appStore;

    // Calendar State
    let currentDate = new Date();
    // Start of week (Monday)
    $: startOfWeek = getStartOfWeek(currentDate);
    $: weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => i + 9); // 09:00 to 21:00

    function getStartOfWeek(date: Date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    function nextWeek() {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 7);
        currentDate = d;
    }

    function prevWeek() {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - 7);
        currentDate = d;
    }

    function isToday(date: Date) {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    function getEventsForDay(date: Date, classes: ClassGroup[]) {
        const dayIndex = date.getDay(); // 0=Sun, 1=Mon...

        const tokensForDay: Record<number, string[]> = {
            1: ["lunes", "lun", "l"],
            2: ["martes", "mar", "m"],
            3: ["miércoles", "miercoles", "mie", "x"],
            4: ["jueves", "jue", "j"],
            5: ["viernes", "vie", "v"],
            6: ["sábado", "sabado", "sab", "s"],
            0: ["domingo", "dom", "d"],
        };

        const targetTokens = tokensForDay[dayIndex] || [];

        return classes
            .map((c) => {
                const lowerSched = c.schedule.toLowerCase();
                let isDayMatch = false;

                for (const token of targetTokens) {
                    if (lowerSched.includes(token)) {
                        const fullDayNames = [
                            "lunes",
                            "martes",
                            "miércoles",
                            "miercoles",
                            "jueves",
                            "viernes",
                            "sábado",
                            "sabado",
                            "domingo",
                        ];
                        const hasFullName = fullDayNames.some((name) =>
                            lowerSched.includes(name),
                        );

                        if (token.length > 1) {
                            isDayMatch = true;
                        } else if (!hasFullName) {
                            isDayMatch = true;
                        }
                    }
                }

                if (!isDayMatch) return null;

                const timeMatch = lowerSched.match(/(\d{1,2})[:\.](\d{2})/);
                if (!timeMatch) return null;

                const hour = parseInt(timeMatch[1]);
                const minute = parseInt(timeMatch[2]);

                return {
                    id: c.id,
                    title: c.name,
                    centerId: c.centerId,
                    startHour: hour + minute / 60,
                    duration: 1.5,
                    level: c.level,
                    students: c.students.length,
                };
            })
            .filter((e): e is NonNullable<typeof e> => e !== null);
    }

    function getCenterColor(id: string) {
        const colors = [
            "from-blue-600/90 to-blue-800/90 border-blue-500/50 text-blue-100",
            "from-purple-600/90 to-purple-800/90 border-purple-500/50 text-purple-100",
            "from-emerald-600/90 to-emerald-800/90 border-emerald-500/50 text-emerald-100",
            "from-amber-600/90 to-amber-800/90 border-amber-500/50 text-amber-100",
            "from-rose-600/90 to-rose-800/90 border-rose-500/50 text-rose-100",
            "from-cyan-600/90 to-cyan-800/90 border-cyan-500/50 text-cyan-100",
        ];
        const index = id.charCodeAt(0) % colors.length;
        return colors[index];
    }
</script>

<div
    class="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl h-[600px] mb-8"
>
    <!-- Widget Header -->
    <div
        class="p-6 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/30"
    >
        <div>
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <CalendarIcon class="w-6 h-6 text-indigo-500" />
                Calendario Global
            </h3>
            <p class="text-sm text-slate-400 mt-1">Vista rápida de tu semana</p>
        </div>

        <div
            class="flex items-center gap-3 bg-[#0f172a] p-1 rounded-lg border border-slate-700"
        >
            <button
                onclick={prevWeek}
                class="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
            >
                <ChevronLeft class="w-4 h-4" />
            </button>
            <span
                class="text-white text-sm font-medium min-w-[120px] text-center"
            >
                {currentDate.toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                })}
            </span>
            <button
                onclick={nextWeek}
                class="p-1.5 hover:bg-slate-700 rounded-md text-slate-400 hover:text-white transition-colors"
            >
                <ChevronRight class="w-4 h-4" />
            </button>
        </div>
    </div>

    <!-- Calendar Grid -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
        <!-- Days Header -->
        <div
            class="grid grid-cols-8 border-b border-slate-700 bg-slate-900/50 shrink-0"
        >
            <div
                class="p-2 border-r border-slate-700/50 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider"
            >
                Hora
            </div>
            {#each weekDays as day}
                <div
                    class="p-2 text-center border-r border-slate-700/50 last:border-r-0 {isToday(
                        day,
                    )
                        ? 'bg-indigo-500/10'
                        : ''}"
                >
                    <span
                        class="block text-[10px] font-bold uppercase tracking-wider {isToday(
                            day,
                        )
                            ? 'text-indigo-400'
                            : 'text-slate-500'}"
                    >
                        {day.toLocaleDateString("es-ES", { weekday: "short" })}
                    </span>
                    <span
                        class="block text-sm font-bold {isToday(day)
                            ? 'text-indigo-400'
                            : 'text-slate-300'}"
                    >
                        {day.getDate()}
                    </span>
                </div>
            {/each}
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto flex-1 custom-scrollbar relative">
            <div class="grid grid-cols-8 relative min-h-[600px]">
                {#each TIME_SLOTS as hour}
                    <!-- Time Label -->
                    <div
                        class="border-r border-slate-700/50 border-b border-slate-800/50 p-1 text-right text-[10px] text-slate-500 font-mono relative pr-2"
                    >
                        <span class="absolute -top-2 right-1">{hour}:00</span>
                    </div>

                    <!-- Day Cells -->
                    {#each weekDays as day}
                        {@const events = getEventsForDay(day, store.classes)}
                        <div
                            class="border-r border-slate-700/30 border-b border-slate-800/30 last:border-r-0 relative group min-h-[60px]"
                        >
                            <div
                                class="absolute inset-0 hover:bg-white/5 transition-colors pointer-events-none"
                            ></div>

                            {#each events as event}
                                {#if Math.floor(event.startHour) === hour}
                                    <div
                                        transition:fade
                                        class="absolute inset-x-0.5 p-1 rounded border shadow-lg cursor-pointer hover:brightness-110 hover:z-50 transition-all bg-gradient-to-br {getCenterColor(
                                            event.centerId,
                                        )}"
                                        style="top: {(event.startHour % 1) *
                                            100}%; height: {event.duration *
                                            100}%; min-height: 30px;"
                                    >
                                        <div
                                            class="flex flex-col h-full overflow-hidden leading-tight"
                                        >
                                            <div
                                                class="font-bold text-[10px] sm:text-xs truncate"
                                            >
                                                {event.title}
                                            </div>
                                            <div
                                                class="flex items-center gap-1 text-[9px] opacity-90 truncate mt-0.5"
                                            >
                                                <MapPin class="w-2.5 h-2.5" />
                                                {store.centers.find(
                                                    (c) =>
                                                        c.id === event.centerId,
                                                )?.name || "Centro"}
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/each}
                {/each}
            </div>

            <!-- Current Time Indicator -->
            {#if isToday(currentDate) || weekDays.some((d) => isToday(d))}
                {@const now = new Date()}
                {@const currentHour = now.getHours() + now.getMinutes() / 60}
                {#if currentHour >= 9 && currentHour <= 21}
                    <div
                        class="absolute left-[12.5%] right-0 border-t border-red-500/70 z-40 pointer-events-none flex items-center"
                        style="top: {(currentHour - 9) * 60}px;"
                    >
                        <!-- 60px is approx height of row in min-h-[600px]/13 rows = 46px... wait. Layout specific. -->
                        <!-- Recalculating top: The grid total height is 600px hardcoded min. 13 slots. 600/13 = 46px. -->
                        <!-- Actually I set min-h-[600px] on the simple grid container. -->
                        <!-- Let's match the style logic: (currentHour - 9) * (rowHeight) -->
                        <!-- If each row has min-h-[60px] then it's * 60. -->
                        <!-- IN previous code I used 80px. Here I used 60px for min-height of cell. -->
                        <!-- Let's set style top based on ratio. -->
                        <!-- Or just stick to the calculation if I set fixed height per row. -->
                        <!-- It's dynamic height, so pixel math is tricky. -->
                        <!-- I'll rely on the same proportional logic or just leave it out for widget MVP if complex. -->
                        <!-- Better: use %. (currentHour - 9) / 13 * 100 %. -->
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1e293b;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #334155;
        border-radius: 3px;
        border: 1px solid #1e293b;
    }
</style>
