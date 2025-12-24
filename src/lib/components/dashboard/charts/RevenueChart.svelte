<script lang="ts">
    import { onMount } from "svelte";
    import { TrendingUp, DollarSign } from "lucide-svelte";

    // Props
    export let data: number[] = [0, 0, 0, 0, 0, 0];
    export let labels: string[] = ["", "", "", "", "", ""];
    export let totalRevenue: number = 0;
    export let trendPercentage: number = 0;

    // Chart dimensions
    const height = 150;
    const width = 300;
    const padding = 20;

    // Helper to scale values
    $: maxVal = Math.max(...data, 100) * 1.1; // Ensure at least some height
    $: minVal = Math.min(...data) * 0.8;

    // Generate path definition
    $: points = data
        .map((val, i) => {
            const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
            const y =
                height -
                padding -
                ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
            return `${x},${y}`;
        })
        .join(" ");

    $: areaPath = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;
</script>

<div
    class="bg-[#1e293b] border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 group"
>
    <div class="flex justify-between items-start mb-6">
        <div>
            <h3 class="text-slate-400 text-sm font-medium">
                Ingresos Estimados
            </h3>
            <div class="flex items-baseline gap-2 mt-1">
                <span class="text-2xl font-bold text-white"
                    >{totalRevenue.toLocaleString()}€</span
                >
                <span
                    class="text-emerald-400 text-xs font-medium flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-full"
                >
                    <TrendingUp class="w-3 h-3 mr-1" />
                    {trendPercentage > 0 ? "+" : ""}{trendPercentage.toFixed(
                        1,
                    )}%
                </span>
            </div>
        </div>
        <div
            class="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors"
        >
            <DollarSign class="w-5 h-5 text-emerald-500" />
        </div>
    </div>

    <div class="relative h-[150px] w-full overflow-hidden">
        <svg
            viewBox="0 0 {width} {height}"
            class="w-full h-full transform transition-transform duration-500 group-hover:scale-[1.02]"
        >
            <!-- Gradients -->
            <defs>
                <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.2" />
                    <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                </linearGradient>
            </defs>

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

            <!-- Area fill -->
            <path d={areaPath} fill="url(#revenueGradient)" />

            <!-- Line -->
            <path
                d={`M ${points}`}
                fill="none"
                stroke="#10b981"
                stroke-width="2"
                vector-effect="non-scaling-stroke"
                stroke-linecap="round"
                stroke-linejoin="round"
            />

            <!-- Dots -->
            {#each data as val, i}
                {@const x =
                    (i / (data.length - 1)) * (width - 2 * padding) + padding}
                {@const y =
                    height -
                    padding -
                    ((val - minVal) / (maxVal - minVal)) *
                        (height - 2 * padding)}
                <circle
                    cx={x}
                    cy={y}
                    r="3"
                    class="fill-slate-900 stroke-emerald-500 stroke-2 group-hover:r-4 transition-all"
                />
            {/each}
        </svg>

        <!-- X Axis Labels -->
        <div
            class="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-slate-500 font-medium"
        >
            {#each labels as label}
                <span>{label}</span>
            {/each}
        </div>
    </div>
</div>
