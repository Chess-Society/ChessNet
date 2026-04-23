<script lang="ts">
  import { fade, scale, slide } from 'svelte/transition';
  import { X, Globe, Trophy, CheckCircle, WarningCircle, Calendar, Tag, TextT, Info } from 'phosphor-svelte';
  import { predictionApi } from '$lib/api/predictions';
  import { appStore } from '$lib/stores/appStore';
  import { toast } from '$lib/stores/toast';

  interface Props {
    show: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editMarket?: any;
  }

  let { show = $bindable(), onClose, onSuccess, editMarket }: Props = $props();

  let loading = $state(false);
  let marketData = $state<{
    question: string;
    description: string;
    category: string;
    endDate: string;
    options: { id: string; text: string; totalStaked: number; totalShares: number; }[];
    oracleType: 'MANUAL' | 'LICHESS' | 'SYSTEM';
    oracleConfig: { tournamentId: string; };
  }>({
    question: '',
    description: '',
    category: 'Torneos',
    endDate: '',
    options: [
      { id: 'yes', text: 'Sí', totalStaked: 0, totalShares: 0 },
      { id: 'no', text: 'No', totalStaked: 0, totalShares: 0 }
    ],
    oracleType: 'MANUAL',
    oracleConfig: {
        tournamentId: ''
    }
  });

  $effect(() => {
    if (editMarket) {
      marketData = {
        question: editMarket.question || '',
        description: editMarket.description || '',
        category: editMarket.category || 'Torneos',
        endDate: editMarket.endDate ? new Date(editMarket.endDate).toISOString().slice(0, 16) : '',
        options: editMarket.options || [
          { id: 'yes', text: 'Sí', totalStaked: 0, totalShares: 0 },
          { id: 'no', text: 'No', totalStaked: 0, totalShares: 0 }
        ],
        oracleType: (editMarket.oracleType as 'MANUAL' | 'LICHESS' | 'SYSTEM') || 'MANUAL',
        oracleConfig: editMarket.oracleConfig || { tournamentId: '' }
      };
    } else {
      // Reset to defaults
      marketData = {
        question: '',
        description: '',
        category: 'Torneos',
        endDate: '',
        options: [
          { id: 'yes', text: 'Sí', totalStaked: 0, totalShares: 0 },
          { id: 'no', text: 'No', totalStaked: 0, totalShares: 0 }
        ],
        oracleType: 'MANUAL',
        oracleConfig: { tournamentId: '' }
      };
    }
  });

  const categories = [
    { id: 'Torneos', label: 'Torneos', icon: Trophy, color: 'text-amber-400' },
    { id: 'Mejoras', label: 'Mejoras', icon: Globe, color: 'text-blue-400' },
    { id: 'Docencia', label: 'Docencia', icon: Tag, color: 'text-emerald-400' },
    { id: 'Academia', label: 'Academia', icon: CheckCircle, color: 'text-purple-400' }
  ];

  async function handleSubmit() {
    if (!marketData.question || !marketData.endDate) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    loading = true;
    try {
      // Get correct school ID from store
      const schoolId = appStore.school?.id || $appStore.schools?.[0]?.id || 'default';
      
      const finalEndDate = new Date(marketData.endDate).toISOString();
      
      const payload = {
        question: marketData.question,
        description: marketData.description,
        category: marketData.category,
        endDate: finalEndDate,
        options: marketData.options,
        oracleType: marketData.oracleType,
        oracleConfig: {
          ...(marketData.oracleConfig.tournamentId ? { externalId: marketData.oracleConfig.tournamentId, tournamentId: marketData.oracleConfig.tournamentId } : {}),
          validationSource: marketData.oracleType === 'LICHESS' ? 'LICHESS_API' : 'MANUAL'
        },
        schoolId
      };

      if (editMarket) {
        await predictionApi.updateMarket(editMarket.id, payload as any);
        toast.success('Hito actualizado correctamente');
      } else {
        console.log("[Modal] Creating market:", payload);
        await predictionApi.createMarket(payload as any);
        toast.success('Hito de pronóstico publicado con éxito');
      }
      
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      marketData = {
        question: '',
        description: '',
        category: 'Torneos',
        endDate: '',
        options: [
          { id: 'yes', text: 'Sí', totalStaked: 0, totalShares: 0 },
          { id: 'no', text: 'No', totalStaked: 0, totalShares: 0 }
        ],
        oracleType: 'MANUAL' as 'MANUAL',
        oracleConfig: { tournamentId: '' }
      };
    } catch (e: any) {
      console.error("[Modal] Submission error:", e);
      toast.error('Error: ' + (e.message || 'Error al procesar la solicitud'));
    } finally {
      loading = false;
    }
  }
</script>

{#if show}
  <div 
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    transition:fade={{ duration: 200 }}
  >
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-zinc-950/98 backdrop-blur-2xl"
      onclick={onClose}
      onkeydown={(e) => e.key === 'Escape' && onClose()}
      role="button"
      tabindex="-1"
      aria-label="Cerrar"
    ></div>

    <!-- Modal Content -->
    <div 
      class="relative w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-none shadow-3xl overflow-hidden flex flex-col max-h-[95vh]"
      transition:scale={{ duration: 400, start: 0.9, opacity: 0 }}
    >
      <!-- Header -->
      <div class="p-10 border-b border-white/5 flex items-center justify-between bg-zinc-900/80">
        <div class="flex items-center gap-6">
          <div class="w-14 h-14 bg-white text-black flex items-center justify-center shadow-2xl">
            <Trophy size={32} weight="bold" />
          </div>
          <div>
            <h2 class="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">{editMarket ? 'Editar Hito' : 'Nuevo Hito Académico'}</h2>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{editMarket ? 'Corrección de Parámetros' : 'Configuración de Dinámica de Grupo'}</p>
          </div>
        </div>
        <button 
          onclick={onClose}
          class="p-3 hover:bg-white/5 text-zinc-600 hover:text-white transition-all rounded-none"
        >
          <X size={32} />
        </button>
      </div>

      <!-- Body -->
      <div class="p-10 overflow-y-auto space-y-12">
        <!-- Step 1: Question -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
              <div class="w-1.5 h-6 bg-white"></div>
              <label for="market-question" class="text-xs font-black text-zinc-400 uppercase tracking-wider">Definición del Hito</label>
           </div>
          <div class="relative group">
            <TextT size={20} class="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors" />
            <input 
              id="market-question"
              type="text" 
              bind:value={marketData.question}
              placeholder="Ej: ¿El equipo A ganará el torneo inter-clubes?"
              class="w-full bg-white/[0.03] border border-white/10 p-6 pl-16 text-white font-bold text-xl focus:border-white/40 focus:bg-white/[0.05] outline-none transition-all placeholder:text-zinc-800"
            />
          </div>
          <textarea 
            id="market-description"
            placeholder="Descripción adicional u objetivos específicos (opcional)..."
            bind:value={marketData.description}
            rows="2"
            class="w-full bg-white/[0.02] border border-white/5 p-6 text-sm text-zinc-400 font-medium focus:border-white/20 outline-none transition-all resize-none placeholder:text-zinc-800 italic"
          ></textarea>
        </div>

        <!-- Step 2: Category -->
        <div class="space-y-6">
          <div class="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-3">
            <div class="w-1.5 h-6 bg-zinc-700"></div>
            Selecciona Categoría
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {#each categories as cat}
              <button 
                onclick={() => marketData.category = cat.id}
                class="flex flex-col items-center gap-3 p-6 border transition-all relative overflow-hidden group {marketData.category === cat.id ? 'bg-white border-white text-black' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20'}"
              >
                <cat.icon size={24} weight={marketData.category === cat.id ? 'bold' : 'duotone'} class={marketData.category === cat.id ? 'text-black' : cat.color} />
                <span class="text-[10px] font-black uppercase tracking-wider">{cat.label}</span>
                {#if marketData.category === cat.id}
                   <div class="absolute -right-2 -top-2 opacity-10">
                     <cat.icon size={48} weight="bold" />
                   </div>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Step 3: End Date -->
            <div class="space-y-6">
                <label for="market-end-date" class="text-xs font-black text-zinc-400 uppercase tracking-wider flex items-center gap-3">
                    <div class="w-1.5 h-6 bg-zinc-700"></div>
                    Fecha y Hora de Cierre
                </label>
                <div class="relative group">
                    <Calendar size={20} class="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors pointer-events-none" />
                    <input 
                        id="market-end-date"
                        type="datetime-local" 
                        bind:value={marketData.endDate}
                        class="w-full bg-white/[0.03] border border-white/10 p-6 pl-16 text-white font-black uppercase text-xs focus:border-white/40 focus:bg-white/[0.05] outline-none transition-all [color-scheme:dark]"
                    />
                </div>
                <p class="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter italic">Pasada esta hora, no se podrán realizar más pronósticos.</p>
            </div>

            <!-- Step 4: Binary Preview -->
            <div class="space-y-6">
                <div class="text-xs font-black text-zinc-400 uppercase tracking-wider flex items-center gap-3">
                    <div class="w-1.5 h-6 bg-zinc-700"></div>
                    Estructura del Hito
                </div>
                <div class="grid grid-cols-2 h-[72px]">
                    <div class="flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                        <CheckCircle size={20} weight="bold" />
                        <span class="text-sm font-black uppercase">SÍ</span>
                    </div>
                    <div class="flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500">
                        <WarningCircle size={20} weight="bold" />
                        <span class="text-sm font-black uppercase">NO</span>
                    </div>
                </div>
                <div class="flex items-center gap-3 p-4 bg-zinc-950 border border-white/5">
                   <Info size={16} class="text-zinc-500 shrink-0" />
                   <p class="text-[9px] text-zinc-500 font-bold uppercase leading-tight">Modelo binario de alta eficiencia: Solo permite posiciones a favor o en contra del hito.</p>
                </div>
            </div>
        </div>

        <!-- Oracle Settings (Simplified) -->
        <div class="p-8 bg-white/[0.02] border border-white/5 space-y-8 relative overflow-hidden group">
            <div class="absolute -right-12 -top-12 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
            
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <Globe size={24} class="text-white" />
                    <div class="space-y-1">
                        <label for="oracle-type" class="text-sm font-black text-white uppercase tracking-wider cursor-pointer">Protocolo de Validación</label>
                        <p class="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Garantía de veracidad del hito</p>
                    </div>
                </div>
                <select 
                    id="oracle-type"
                    bind:value={marketData.oracleType}
                    class="bg-zinc-950 border border-white/10 p-3 text-[10px] text-white font-black uppercase outline-none focus:border-white transition-all appearance-none px-6"
                >
                    <option value="MANUAL">Resolución Manual</option>
                    <option value="LICHESS">Lichess Automático</option>
                </select>
            </div>

            {#if marketData.oracleType === 'LICHESS'}
                <div class="pt-6 border-t border-white/5 space-y-4" transition:slide>
                    <label for="lichess-tournament-id" class="text-[10px] font-black text-zinc-500 uppercase tracking-wider">ID de Torneo Lichess</label>
                    <input 
                        id="lichess-tournament-id"
                        type="text" 
                        bind:value={marketData.oracleConfig.tournamentId}
                        placeholder="Ej: nP8zXUvW"
                        class="w-full bg-zinc-950 border border-white/10 p-5 text-sm text-white font-bold outline-none focus:border-white transition-all"
                    />
                </div>
            {/if}
        </div>
      </div>

      <!-- Footer -->
      <div class="p-10 border-t border-white/5 bg-zinc-900/90 flex justify-between items-center">
        <button 
          onclick={onClose}
          class="text-xs font-black text-zinc-600 uppercase tracking-wider hover:text-white transition-all underline underline-offset-8 decoration-zinc-800 hover:decoration-white"
        >
          Descartar Cambios
        </button>
        <button 
          onclick={handleSubmit}
          disabled={loading}
          class="px-16 py-6 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-3xl relative group overflow-hidden"
        >
          <span class="relative z-10">{loading ? 'PROCESANDO...' : (editMarket ? 'GUARDAR CAMBIOS' : 'PUBLICAR HITO')}</span>
          <div class="absolute inset-0 bg-zinc-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
    /* Styling for the native date picker to look cleaner */
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
        position: absolute;
        right: 24px;
        opacity: 0;
        cursor: pointer;
        width: 100%;
        height: 100%;
    }
</style>
