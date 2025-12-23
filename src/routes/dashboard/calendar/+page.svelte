<script lang="ts">
    import {
        appStore,
        type ClassGroup,
        type Center,
    } from "$lib/services/storage";
    import {
        ChevronLeft,
        ChevronRight,
        Calendar as CalendarIcon,
        Clock,
        MapPin,
    } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";

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

    // --- MAPPING LOGIC (Temporary until we have structured data) ---
    // This function attempts to parse "Lunes 17:00" or similar to place on calendar
    function getEventsForDay(date: Date, classes: ClassGroup[]) {
        const dayIndex = date.getDay(); // 0=Sun, 1=Mon...

        // Define tokens for this specific day
        const tokensForDay: Record<number, string[]> = {
            1: ["lunes", "lun", "l"],
            2: ["martes", "mar", "m"],
            3: ["miércoles", "miercoles", "mie", "x"], // 'x' is common for Wed in FR/ES
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

                // Strict check: if the schedule contains any of the tokens for THIS day.
                // We iterate through tokens.
                for (const token of targetTokens) {
                    if (lowerSched.includes(token)) {
                        // Quick heuristic to avoid false positives (e.g. 'v' in 'jueves')
                        // If token is 1 char, check if it's likely a day code (uppercase in original, or separated).
                        // For MVP: assume if 'l' is present, it's Monday.
                        // To avoid 'l' in 'coles' (miercoles?? no).
                        // 'v' in 'jueves' -> YES, failure.

                        // Improved heuristic: Only match single letters if the string is SHORT (e.g. "L-X")
                        // OR if the single letter is followed by punctuation/space?
                        // Let's rely on standard formats.
                        // If "Jueves", contains 'v'. Bad.

                        // If the schedule contains full day names, ignore single letter matches?
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
                            // Only match single chars if no full names are present (implies short code format like L-X)
                            isDayMatch = true;
                        }
                    }
                }

                if (!isDayMatch) return null;

                // Extract Time
                const timeMatch = lowerSched.match(/(\d{1,2})[:\.](\d{2})/);
                if (!timeMatch) return null;

                const hour = parseInt(timeMatch[1]);
                const minute = parseInt(timeMatch[2]);

                return {
                    id: c.id,
                    title: c.name,
                    centerId: c.centerId,
                    startHour: hour + minute / 60,
                    duration: 1.5, // Default 1.5 hour
                    level: c.level,
                    students: c.students.length,
                };
            })
            .filter((e): e is NonNullable<typeof e> => e !== null);
    }

    function getCenterColor(id: string) {
        // Deterministic color based on ID chars
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
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col"
>
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
    >
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <CalendarIcon class="w-8 h-8 text-purple-500" /> Calendario
            </h1>
            <p class="mt-1 text-slate-400">
                Organización semanal de tus clases
            </p>
        </div>

        <div
            class="flex items-center gap-4 bg-[#1e293b] p-1.5 rounded-xl border border-slate-700"
        >
            <button
                onclick={prevWeek}
                class="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
                <ChevronLeft class="w-5 h-5" />
            </button>
            <span class="text-white font-medium min-w-[140px] text-center">
                {currentDate.toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                })}
            </span>
            <button
                onclick={nextWeek}
                class="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
                <ChevronRight class="w-5 h-5" />
            </button>
        </div>
    </div>

    <!-- Calendar Grid -->
    <div
        class="flex-1 bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative"
    >
        <!-- Days Header -->
        <div class="grid grid-cols-8 border-b border-slate-700 bg-slate-900/50">
            <div
                class="p-4 border-r border-slate-700/50 text-center text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
                Hora
            </div>
            {#each weekDays as day}
                <div
                    class="p-3 text-center border-r border-slate-700/50 last:border-r-0 {isToday(
                        day,
                    )
                        ? 'bg-purple-500/10'
                        : ''}"
                >
                    <span
                        class="block text-xs font-bold uppercase tracking-wider {isToday(
                            day,
                        )
                            ? 'text-purple-400'
                            : 'text-slate-500'}"
                    >
                        {day.toLocaleDateString("es-ES", { weekday: "short" })}
                    </span>
                    <span
                        class="block text-xl font-bold {isToday(day)
                            ? 'text-purple-400'
                            : 'text-slate-300'}"
                    >
                        {day.getDate()}
                    </span>
                </div>
            {/each}
        </div>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto flex-1 custom-scrollbar relative">
            <!-- Grid Lines and Time Slots -->
            <div class="grid grid-cols-8 relative min-h-[800px]">
                {#each TIME_SLOTS as hour, i}
                    <!-- Time Label -->
                    <div
                        class="border-r border-slate-700/50 border-b border-slate-800/50 p-2 text-right text-xs text-slate-500 font-mono relative md:pr-4"
                    >
                        <span
                            class="absolute -top-2.5 right-2 md:right-4 bg-[#1e293b] px-1"
                            >{hour}:00</span
                        >
                    </div>

                    <!-- Day Cells -->
                    {#each weekDays as day}
                        {@const events = getEventsForDay(day, store.classes)}
                        <div
                            class="border-r border-slate-700/30 border-b border-slate-800/30 last:border-r-0 relative group min-h-[80px]"
                        >
                            <!-- Hover effect for cell -->
                            <div
                                class="absolute inset-0 hover:bg-white/5 transition-colors pointer-events-none"
                            ></div>

                            {#each events as event}
                                {#if Math.floor(event.startHour) === hour}
                                    <div
                                        transition:fade
                                        class="absolute inset-x-1 p-2 rounded-lg border shadow-lg cursor-pointer hover:brightness-110 hover:scale-[1.02] hover:z-50 transition-all bg-gradient-to-br {getCenterColor(
                                            event.centerId,
                                        )}"
                                        style="top: {(event.startHour % 1) *
                                            100}%; height: {event.duration *
                                            100}%; min-height: 40px;"
                                    >
                                        <div
                                            class="flex flex-col h-full justify-between overflow-hidden"
                                        >
                                            <div>
                                                <div
                                                    class="flex justify-between items-start mb-1"
                                                >
                                                    <h4
                                                        class="font-bold text-xs sm:text-sm leading-tight line-clamp-2"
                                                    >
                                                        {event.title}
                                                    </h4>
                                                </div>
                                                <div
                                                    class="flex items-center gap-1 text-[10px] sm:text-xs opacity-90 truncate"
                                                >
                                                    <MapPin class="w-3 h-3" />
                                                    {store.centers.find(
                                                        (c) =>
                                                            c.id ===
                                                            event.centerId,
                                                    )?.name || "Centro"}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center gap-2 mt-1"
                                            >
                                                <span
                                                    class="inline-flex items-center gap-1 text-[10px] bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-sm"
                                                >
                                                    <Clock
                                                        class="w-2.5 h-2.5"
                                                    />
                                                    {Math.floor(
                                                        event.startHour,
                                                    )}:00
                                                </span>
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
                {@const dayIndex = now.getDay() || 7}
                <!-- 1=Mon, ..., 7=Sun or 0?? Check logic -->
                <!-- Only showing typical hours -->
                {#if currentHour >= 9 && currentHour <= 21}
                    <div
                        class="absolute left-[12.5%] right-0 border-t-2 border-red-500/70 z-40 pointer-events-none flex items-center"
                        style="top: {(currentHour - 9) * 80}px;"
                    >
                        <div
                            class="w-2 h-2 rounded-full bg-red-500 -ml-1"
                        ></div>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>

<style>
    /* Custom Scrollbar for the calendar grid */
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1e293b;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #334155;
        border-radius: 4px;
        border: 2px solid #1e293b;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #475569;
    }
</style>
