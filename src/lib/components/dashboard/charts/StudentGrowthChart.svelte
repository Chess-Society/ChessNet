<script lang="ts">
    import { Users, UserPlus } from "lucide-svelte";

    // Props
    export let data: number[] = [0, 0, 0, 0, 0, 0];
    export let labels: string[] = ["", "", "", "", "", ""];
    export let totalNewStudents: number = 0;
    export let trendText: string = "este mes";

    // Chart dimensions
    const height = 150;
    const width = 300;
    const padding = 20;

    // Helper to scale values
    $: maxVal = Math.max(...data, 10) * 1.2;

    // Bar calculations
    $: barWidth = ((width - 2 * padding) / data.length) * 0.6;
    $: gap = (width - 2 * padding) / data.length;
</script>

<div
    class="bg-[#1e293b] border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 group"
>
    <div class="flex justify-between items-start mb-6">
        <div>
            <h3 class="text-slate-400 text-sm font-medium">Nuevos Alumnos</h3>
            <div class="flex items-baseline gap-2 mt-1">
                <span class="text-2xl font-bold text-white"
                    >{totalNewStudents}</span
                >
                <span
                    class="text-blue-400 text-xs font-medium flex items-center bg-blue-500/10 px-1.5 py-0.5 rounded-full"
                >
                    <UserPlus class="w-3 h-3 mr-1" />
                    {trendText}
                </span>
            </div>
        </div>
        <div
            class="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors"
        >
            <Users class="w-5 h-5 text-blue-500" />
        </div>
    </div>

    <div class="relative h-[150px] w-full">
        <svg viewBox="0 0 {width} {height}" class="w-full h-full">
            <!-- Guide lines -->
            {#each [0, 1, 2, 3] as line}
                <line
                    x1={padding}
                    y1={height - padding - (line * (height - 2 * padding)) / 3}
                    x2={width - padding}
                    y2={height - padding - (line * (height - 2 * padding)) / 3}
                    class="stroke-slate-700/30"
                    stroke-width="1"
                    stroke-dasharray="4 4"
                />
            {/each}

            <!-- Bars -->
            {#each data as val, i}
                {@const x = padding + i * gap + (gap - barWidth) / 2}
                {@const barHeight = (val / maxVal) * (height - 2 * padding)}
                {@const y = height - padding - barHeight}

                <!-- Bar Background (for hover target size) -->
                <rect
                    {x}
                    {y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    class="fill-blue-500/80 hover:fill-blue-400 transition-colors duration-300 cursor-pointer"
                />

                <!-- Label on top -->
                <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    text-anchor="middle"
                    class="fill-slate-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    {val}
                </text>
            {/each}
        </svg>

        <!-- X Axis Labels -->
        <div
            class="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[10px] text-slate-500 font-medium"
        >
            {#each labels as label}
                <span class="w-[16.6%] text-center">{label}</span>
            {/each}
        </div>
    </div>
</div>
