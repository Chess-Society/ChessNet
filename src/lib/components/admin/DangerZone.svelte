<script lang="ts">
  import { t } from '$lib/i18n';
  import { Shield, Warning, Trash, ArrowCounterClockwise, Star } from 'phosphor-svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    onResetGlobal: () => void;
    onRepairIntegrity: () => void;
    onRepairEconomy: () => void;
    onToggleMaintenance: () => void;
    maintenanceMode: boolean;
    isSaving: boolean;
  }

  let { 
    onResetGlobal, 
    onRepairIntegrity, 
    onRepairEconomy, 
    onToggleMaintenance,
    maintenanceMode,
    isSaving 
  }: Props = $props();

  let confirmText = $state('');
</script>

<div class="space-y-12 max-w-4xl">
  <!-- Header -->
  <div class="space-y-4">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
        <Shield weight="fill" size={24} />
      </div>
      <div>
        <h2 class="text-3xl font-black font-display uppercase italic tracking-tighter text-white">PROTOCOL_DANGER_ZONE</h2>
        <p class="text-[10px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1">NIVEL DE ACCESO: OMEGA (ADMINISTRADOR_SISTEMA)</p>
      </div>
    </div>
    <div class="h-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 opacity-30"></div>
  </div>

  <div class="grid grid-cols-1 gap-8">
    <!-- Maintenance Mode -->
    <div class="bg-black/40 border border-white/5 p-8 relative overflow-hidden group">
      <div class="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
        <div class="space-y-2">
          <h3 class="text-lg font-black text-white uppercase italic font-display">{$t('admin.guard.maintenance_mode')}</h3>
          <p class="text-xs text-slate-500 max-w-md">{$t('admin.guard.maintenance_desc')}</p>
        </div>
        <button 
          onclick={onToggleMaintenance}
          disabled={isSaving}
          class="px-10 py-5 border {maintenanceMode ? 'bg-red-500 text-white border-red-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'} text-[10px] font-mono font-black uppercase tracking-widest transition-all min-w-[240px]"
        >
          {maintenanceMode ? 'DESACTIVAR MANTENIMIENTO' : 'ACTIVAR MANTENIMIENTO'}
        </button>
      </div>
    </div>

    <!-- Integrity Tools -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <button 
        onclick={onRepairIntegrity}
        disabled={isSaving}
        class="bg-zinc-900/40 border border-white/5 p-8 text-left hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="p-3 bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <ArrowCounterClockwise weight="bold" size={20} />
          </div>
          <span class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">SISTEMA_INTEGRIDAD</span>
        </div>
        <h4 class="text-sm font-black text-white uppercase italic mb-2">REPARAR_ESTRUCTURA_USUARIOS</h4>
        <p class="text-[10px] text-slate-600 leading-relaxed uppercase">SINCRONIZA CAMPOS FALTANTES Y NORMALIZA EL ESQUEMA DE DATOS FIRESTORE.</p>
      </button>

      <button 
        onclick={onRepairEconomy}
        disabled={isSaving}
        class="bg-zinc-900/40 border border-white/5 p-8 text-left hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Star weight="bold" size={20} />
          </div>
          <span class="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest">SISTEMA_ECONOMIA</span>
        </div>
        <h4 class="text-sm font-black text-white uppercase italic mb-2">NORMALIZAR_CARTERAS_NETS</h4>
        <p class="text-[10px] text-slate-600 leading-relaxed uppercase">INICIALIZA EL MÓDULO ECONOMY PARA USUARIOS LEGACY SIN WALLET ACTIVA.</p>
      </button>
    </div>

    <!-- Global Economy Reset (Critical) -->
    <div class="p-10 space-y-8 bg-zinc-900/50 border border-white/5 relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-10">
        <Warning size={80} weight="fill" class="text-red-500" />
      </div>
      
      <div class="relative">
        <h3 class="text-xs font-mono font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-3">
          <div class="w-2 h-2 bg-red-500 animate-pulse"></div>
          {$t('admin.guard.economy_reset')}
        </h3>
        <p class="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-3 leading-relaxed max-w-lg">
          {$t('admin.guard.economy_reset_desc')}
        </p>
      </div>

      <div class="space-y-6 max-w-md relative z-10">
        <div class="space-y-3">
          <p class="text-[8px] font-mono text-red-900 font-black uppercase tracking-widest">
            {confirmText === 'PURGAR_SISTEMA' ? 'AUTORIZACIÓN_COMPLETA_LISTO_PARA_EJECUCIÓN' : 'REQUERIDA_CONFIRMACION_TEXTUAL'}
          </p>
          <input 
            type="text" 
            bind:value={confirmText}
            placeholder={$t('admin.guard.confirm_placeholder')}
            class="w-full bg-black border border-red-500/20 px-6 py-4 text-[10px] font-mono font-black uppercase tracking-widest text-red-500 placeholder:text-red-900/50 focus:border-red-500 outline-none transition-all"
          />
        </div>
        
        <button 
          onclick={() => {
            if (confirmText === 'PURGAR_SISTEMA') {
              onResetGlobal();
              confirmText = '';
            }
          }}
          disabled={confirmText !== 'PURGAR_SISTEMA' || isSaving}
          class="w-full py-5 bg-red-500/10 border border-red-500/20 rounded-none text-[10px] font-mono font-black uppercase tracking-[0.3em] text-red-500 hover:bg-red-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group/btn"
        >
          <Trash weight="bold" class="w-4 h-4 group-hover/btn:animate-bounce" />
          {$t('admin.tech.transmit')}
        </button>
      </div>
    </div>
  </div>
</div>

  <!-- Security Footer -->
  <div class="pt-8 border-t border-white/5 flex items-center justify-between">
    <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest">ChessNet_OS_SECURITY_PROTOCOLS // V4.1.2</p>
    <div class="flex items-center gap-4">
      <div class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
      <span class="text-[8px] font-mono font-black text-red-500 uppercase tracking-widest">RECORDING_ADMIN_ACTION</span>
    </div>
  </div>
  
<style>
  button:disabled {
    filter: grayscale(1);
    opacity: 0.5;
  }
</style>
