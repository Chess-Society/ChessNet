<script lang="ts">
    import { logger, type LogEntry, type LogLevel } from "$lib/services/logger";
    import {
        Bug,
        Download,
        Trash2,
        Filter,
        Search,
        AlertTriangle,
        Info,
        AlertCircle,
        XCircle,
    } from "lucide-svelte";
    import { onMount } from "svelte";

    let logs: LogEntry[] = [];
    let filteredLogs: LogEntry[] = [];
    let selectedLevel: LogLevel | "all" = "all";
    let searchQuery = "";
    let selectedContext = "all";
    let autoRefresh = true;

    $: contexts = [
        "all",
        ...new Set(logs.map((l) => l.context).filter(Boolean)),
    ];

    $: {
        filteredLogs = logs.filter((log) => {
            const levelMatch =
                selectedLevel === "all" || log.level === selectedLevel;
            const contextMatch =
                selectedContext === "all" || log.context === selectedContext;
            const searchMatch =
                searchQuery === "" ||
                log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.context?.toLowerCase().includes(searchQuery.toLowerCase());

            return levelMatch && contextMatch && searchMatch;
        });
    }

    function refreshLogs() {
        logs = logger.getLogs();
    }

    function clearLogs() {
        if (confirm("¿Estás seguro de que quieres borrar todos los logs?")) {
            logger.clear();
            refreshLogs();
        }
    }

    function exportLogs() {
        logger.export();
    }

    function getLevelColor(level: LogLevel): string {
        switch (level) {
            case "debug":
                return "text-slate-400";
            case "info":
                return "text-blue-400";
            case "warn":
                return "text-yellow-400";
            case "error":
                return "text-orange-400";
            case "critical":
                return "text-red-400";
            default:
                return "text-slate-400";
        }
    }

    function getLevelBg(level: LogLevel): string {
        switch (level) {
            case "debug":
                return "bg-slate-500/10 border-slate-500/20";
            case "info":
                return "bg-blue-500/10 border-blue-500/20";
            case "warn":
                return "bg-yellow-500/10 border-yellow-500/20";
            case "error":
                return "bg-orange-500/10 border-orange-500/20";
            case "critical":
                return "bg-red-500/10 border-red-500/20";
            default:
                return "bg-slate-500/10 border-slate-500/20";
        }
    }

    function getLevelIcon(level: LogLevel) {
        switch (level) {
            case "debug":
                return Bug;
            case "info":
                return Info;
            case "warn":
                return AlertTriangle;
            case "error":
                return AlertCircle;
            case "critical":
                return XCircle;
            default:
                return Info;
        }
    }

    onMount(() => {
        refreshLogs();

        const unsubscribe = logger.subscribe(() => {
            if (autoRefresh) {
                refreshLogs();
            }
        });

        return unsubscribe;
    });
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
            <div class="bg-slate-800 p-3 rounded-xl border border-slate-700">
                <Bug class="w-8 h-8 text-red-500" />
            </div>
            <div>
                <h1 class="text-2xl font-bold text-white">Sistema de Logs</h1>
                <p class="text-slate-400">Monitoreo y depuración de errores</p>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <label
                for="auto-refresh-checkbox"
                class="flex items-center gap-2 text-sm text-slate-400"
            >
                <input
                    id="auto-refresh-checkbox"
                    type="checkbox"
                    bind:checked={autoRefresh}
                    class="rounded bg-slate-800 border-slate-600"
                />
                Auto-refresh
            </label>
            <button
                onclick={refreshLogs}
                class="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
            >
                Actualizar
            </button>
            <button
                onclick={exportLogs}
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium flex items-center gap-2"
            >
                <Download class="w-4 h-4" />
                Exportar
            </button>
            <button
                onclick={clearLogs}
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm font-medium flex items-center gap-2"
            >
                <Trash2 class="w-4 h-4" />
                Limpiar
            </button>
        </div>
    </div>

    <!-- Filters -->
    <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Search -->
            <div>
                <label class="block text-sm font-medium text-slate-400 mb-2">
                    <Search class="w-4 h-4 inline mr-1" />
                    Buscar
                </label>
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Buscar en logs..."
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <!-- Level Filter -->
            <div>
                <label class="block text-sm font-medium text-slate-400 mb-2">
                    <Filter class="w-4 h-4 inline mr-1" />
                    Nivel
                </label>
                <select
                    bind:value={selectedLevel}
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Todos</option>
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                    <option value="critical">Critical</option>
                </select>
            </div>

            <!-- Context Filter -->
            <div>
                <label class="block text-sm font-medium text-slate-400 mb-2">
                    Contexto
                </label>
                <select
                    bind:value={selectedContext}
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {#each contexts as context}
                        <option value={context}
                            >{context === "all" ? "Todos" : context}</option
                        >
                    {/each}
                </select>
            </div>
        </div>

        <div class="mt-4 text-sm text-slate-500">
            Mostrando {filteredLogs.length} de {logs.length} logs
        </div>
    </div>

    <!-- Logs List -->
    <div class="space-y-3">
        {#if filteredLogs.length === 0}
            <div
                class="bg-[#1e293b] rounded-2xl border border-slate-800 p-12 text-center"
            >
                <Bug class="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p class="text-slate-400 text-lg">No hay logs que mostrar</p>
                <p class="text-slate-500 text-sm mt-2">
                    Los logs aparecerán aquí automáticamente
                </p>
            </div>
        {:else}
            {#each filteredLogs.slice().reverse() as log (log.id)}
                <div
                    class="bg-[#1e293b] rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-colors"
                >
                    <div class="flex items-start gap-4">
                        <!-- Level Icon -->
                        <div
                            class="flex-shrink-0 w-10 h-10 rounded-lg {getLevelBg(
                                log.level,
                            )} border flex items-center justify-center"
                        >
                            <svelte:component
                                this={getLevelIcon(log.level)}
                                class="w-5 h-5 {getLevelColor(log.level)}"
                            />
                        </div>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                            <div
                                class="flex items-start justify-between gap-4 mb-2"
                            >
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-xs font-bold uppercase {getLevelColor(
                                            log.level,
                                        )} tracking-wider"
                                    >
                                        {log.level}
                                    </span>
                                    {#if log.context}
                                        <span
                                            class="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded"
                                        >
                                            {log.context}
                                        </span>
                                    {/if}
                                </div>
                                <span
                                    class="text-xs text-slate-500 whitespace-nowrap"
                                >
                                    {new Date(log.timestamp).toLocaleString(
                                        "es-ES",
                                    )}
                                </span>
                            </div>

                            <p class="text-white font-medium mb-2">
                                {log.message}
                            </p>

                            {#if log.data}
                                <details class="mt-2">
                                    <summary
                                        class="text-sm text-slate-400 cursor-pointer hover:text-slate-300"
                                    >
                                        Ver datos adicionales
                                    </summary>
                                    <pre
                                        class="mt-2 p-3 bg-slate-900 rounded-lg text-xs text-slate-300 overflow-x-auto">{JSON.stringify(
                                            log.data,
                                            null,
                                            2,
                                        )}</pre>
                                </details>
                            {/if}

                            {#if log.stack}
                                <details class="mt-2">
                                    <summary
                                        class="text-sm text-red-400 cursor-pointer hover:text-red-300"
                                    >
                                        Ver stack trace
                                    </summary>
                                    <pre
                                        class="mt-2 p-3 bg-slate-900 rounded-lg text-xs text-red-300 overflow-x-auto">{log.stack}</pre>
                                </details>
                            {/if}

                            {#if log.url}
                                <p class="text-xs text-slate-600 mt-2">
                                    URL: {log.url}
                                </p>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
