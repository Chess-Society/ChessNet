<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { CreditCard, ArrowRight, Server, Database, Globe } from 'lucide-svelte';
    import { t } from '$lib/i18n';

    let hasEnvVars = $state(true);
    let hasCorrectImport = $state(true);
    let hasUserId = $state(true);
    let simulationSteps = $state<{ text: string, type: 'info' | 'success' | 'error' }[]>([]);
    let isSimulating = $state(false);
    let currentPhase = $state<'idle' | 'stripe' | 'server' | 'firestore'>('idle');

    async function simulate() {
        if (isSimulating) return;
        isSimulating = true;
        simulationSteps = [];
        currentPhase = 'stripe';
        
        addStep($t('simulator.steps.loading'), 'info');
        await wait(1000);
        
        addStep($t('simulator.steps.stripe_ok'), 'success');
        addStep($t('simulator.steps.stripe_webhook'), 'info');
        await wait(1000);
        
        currentPhase = 'server';
        if (!hasUserId) {
            addStep($t('simulator.steps.error_no_uid'), 'error');
            fail(); return;
        }

        addStep($t('simulator.steps.validating_sig'), 'info');
        await wait(800);

        if (!hasEnvVars) {
            addStep($t('simulator.steps.error_500'), 'error');
            fail(); return;
        }
        
        addStep($t('simulator.steps.admin_ok'), 'success');
        await wait(800);

        currentPhase = 'firestore';
        if (!hasCorrectImport) {
            addStep($t('simulator.steps.error_db'), 'error');
            fail(); return;
        }

        addStep($t('simulator.steps.updating_firestore'), 'info');
        await wait(1000);
        
        addStep($t('simulator.steps.success'), 'success');
        isSimulating = false;
        currentPhase = 'idle';
    }

    function addStep(text: string, type: 'info' | 'success' | 'error') {
        simulationSteps = [...simulationSteps, { text, type }];
    }

    function fail() {
        isSimulating = false;
    }

    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));
</script>

<div class="bg-slate-900 border border-slate-800 rounded-none p-8 shadow-2xl overflow-hidden relative">
    <div class="absolute top-0 right-0 p-8 opacity-5">
        <CreditCard class="w-32 h-32 text-indigo-500" />
    </div>

    <div class="relative z-10">
        <div class="flex items-center gap-3 mb-8">
            <div class="p-3 bg-indigo-500/10 rounded-none text-indigo-500">
                <Globe class="w-6 h-6" />
            </div>
            <div>
                <h2 class="text-xl font-bold text-white">{$t('simulator.title')}</h2>
                <p class="text-slate-500 text-sm">{$t('simulator.subtitle')}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Controles -->
            <div class="space-y-6">
                <div class="bg-slate-800/50 p-6 rounded-none border border-slate-700/50">
                    <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{$t('simulator.env_config')}</h3>
                    
                    <div class="space-y-4">
                        <label class="flex items-center justify-between cursor-pointer group">
                            <span class="text-sm text-slate-300 group-hover:text-white transition-colors">{$t('simulator.env_vars')}</span>
                            <button 
                                aria-label="Toggle Env Vars"
                                onclick={() => hasEnvVars = !hasEnvVars}
                                class="w-10 h-5 rounded-full transition-colors relative {hasEnvVars ? 'bg-indigo-500' : 'bg-slate-700'} cursor-pointer"
                            >
                                <div class="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform {hasEnvVars ? 'translate-x-5' : ''}"></div>
                            </button>
                        </label>

                        <label class="flex items-center justify-between cursor-pointer group">
                            <span class="text-sm text-slate-300 group-hover:text-white transition-colors">{$t('simulator.admin_db')}</span>
                            <button 
                                aria-label="Toggle Admin DB Status"
                                onclick={() => hasCorrectImport = !hasCorrectImport}
                                class="w-10 h-5 rounded-full transition-colors relative {hasCorrectImport ? 'bg-indigo-500' : 'bg-slate-700'} cursor-pointer"
                            >
                                <div class="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform {hasCorrectImport ? 'translate-x-5' : ''}"></div>
                            </button>
                        </label>

                        <label class="flex items-center justify-between cursor-pointer group">
                            <span class="text-sm text-slate-300 group-hover:text-white transition-colors">{$t('simulator.uid_sent')}</span>
                            <button 
                                aria-label="Toggle User ID Status"
                                onclick={() => hasUserId = !hasUserId}
                                class="w-10 h-5 rounded-full transition-colors relative {hasUserId ? 'bg-indigo-500' : 'bg-slate-700'} cursor-pointer"
                            >
                                <div class="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform {hasUserId ? 'translate-x-5' : ''}"></div>
                            </button>
                        </label>
                    </div>
                </div>

                <button 
                    onclick={simulate}
                    disabled={isSimulating}
                    class="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-none transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 cursor-pointer"
                >
                    {#if isSimulating}
                        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {$t('simulator.simulating')}
                    {:else}
                        <ArrowRight class="w-5 h-5" />
                        {$t('simulator.simulate_btn')}
                    {/if}
                </button>
            </div>

            <!-- Visualización -->
            <div class="bg-black/40 rounded-none border border-slate-800 p-6 font-mono text-[11px] h-[300px] flex flex-col">
                <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{$t('simulator.console')}</span>
                    <div class="flex gap-1">
                        <div class="w-2 h-2 rounded-full bg-red-500/50"></div>
                        <div class="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                        <div class="w-2 h-2 rounded-full bg-indigo-500/50"></div>
                    </div>
                </div>

                <div class="flex-grow overflow-y-auto space-y-2 custom-scrollbar">
                    {#each simulationSteps as step}
                        <div 
                            class="flex gap-3"
                            in:fly={{ x: -10, duration: 300 }}
                        >
                            {#if step.type === 'info'}
                                <span class="text-blue-400 font-bold">[INFO]</span>
                            {:else if step.type === 'success'}
                                <span class="text-indigo-400 font-bold">[OK]</span>
                            {:else}
                                <span class="text-red-400 font-bold">[ERR]</span>
                            {/if}
                            <span class="text-slate-400">{step.text}</span>
                        </div>
                    {/each}
                    {#if isSimulating}
                        <div class="inline-block w-2 h-4 bg-indigo-500 animate-pulse"></div>
                    {/if}
                </div>

                <div class="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <div class="flex gap-4">
                        <div class="flex flex-col items-center gap-1">
                            <div class="w-8 h-8 rounded-none flex items-center justify-center {currentPhase === 'stripe' ? 'bg-indigo-500 text-white animate-bounce' : 'bg-slate-800 text-slate-600'} transition-all">
                                <Globe class="w-4 h-4" />
                            </div>
                            <span class="text-[8px] uppercase font-bold {currentPhase === 'stripe' ? 'text-indigo-400' : 'text-slate-600'}">Stripe</span>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                            <div class="w-8 h-8 rounded-none flex items-center justify-center {currentPhase === 'server' ? 'bg-indigo-500 text-white animate-bounce' : 'bg-slate-800 text-slate-600'} transition-all">
                                <Server class="w-4 h-4" />
                            </div>
                            <span class="text-[8px] uppercase font-bold {currentPhase === 'server' ? 'text-indigo-400' : 'text-slate-600'}">Netlify</span>
                        </div>
                        <div class="flex flex-col items-center gap-1">
                            <div class="w-8 h-8 rounded-none flex items-center justify-center {currentPhase === 'firestore' ? 'bg-indigo-500 text-white animate-bounce' : 'bg-slate-800 text-slate-600'} transition-all">
                                <Database class="w-4 h-4" />
                            </div>
                            <span class="text-[8px] uppercase font-bold {currentPhase === 'firestore' ? 'text-indigo-400' : 'text-slate-600'}">Firestore</span>
                        </div>
                    </div>

                    {#if !isSimulating && simulationSteps.length > 0}
                        <div class="text-xs font-black italic {simulationSteps[simulationSteps.length-1].type === 'error' ? 'text-red-500' : 'text-indigo-500'}">
                            {simulationSteps[simulationSteps.length-1].type === 'error' ? $t('simulator.status.failed') : $t('simulator.status.success')}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
</style>
