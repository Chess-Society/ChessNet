<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Check, 
    X, 
    Crown, 
    Users, 
    School, 
    Trophy, 
    HardDrive,
    Target,
    ArrowLeft,
    Zap,
    Star,
    Shield,
    Sparkles,
    CreditCard,
    Activity
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { initiateUpgrade } from '$lib/api/subscriptions';
  import { fade, fly, scale } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let upgradeData = $derived(data.upgradeData);
  let isUpgrading = $state(false);
  let selectedPlan = $state('');

  const handleUpgrade = async (planName: string) => {
    if (isUpgrading || planName === 'free') return;
    
    isUpgrading = true;
    selectedPlan = planName;
    
    try {
      const result = await initiateUpgrade(planName);
      if (result.success && result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        alert(result.error || 'Error al iniciar el proceso de upgrade');
      }
    } catch (error) {
      alert('Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      isUpgrading = false;
      selectedPlan = '';
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const getPlanIcon = (planName: string): any => {
    switch (planName) {
      case 'free': return Shield;
      case 'professional': return Star;
      case 'academy': return Crown;
      default: return Zap;
    }
  };

  const getStatIcon = (icon: any): any => icon;
</script>

<svelte:head>
  <title>Premium Upgrade - ChessNet</title>
</svelte:head>

<div class="space-y-12 animate-fade-in pb-20" in:fade>
  <!-- Hero Section -->
  <div class="text-center space-y-4 py-8">
    <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-[10px] font-black uppercase tracking-widest mb-4">
      <Sparkles class="w-3 h-3" />
      Potencia tu academia
    </div>
    <h1 class="text-5xl font-black text-white tracking-tighter sm:text-6xl">
      Lleva el ajedrez al <span class="text-primary-400">siguiente nivel</span>
    </h1>
    <p class="text-surface-400 text-lg max-w-2xl mx-auto">
      Desbloquea herramientas avanzadas, límites extendidos e insights detallados para gestionar tu academia de forma profesional.
    </p>
  </div>

  {#if upgradeData}
    <!-- Usage Stats -->
    <div class="glass-panel p-8 relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Activity class="w-32 h-32 text-primary-400" />
      </div>

      <div class="relative z-10 space-y-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-primary-500/20 rounded-2xl text-primary-400 shadow-2xl">
            <HardDrive class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-xl font-black text-white uppercase tracking-tight">Tu Uso Actual</h2>
            <p class="text-surface-500 text-xs font-bold uppercase tracking-widest">Estado del plan {upgradeData.current_plan.display_name}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {#each [
            { label: 'Estudiantes', icon: Users, current: upgradeData.usage_stats.students_count, max: upgradeData.user_limits.max_students },
            { label: 'Clases', icon: School, current: upgradeData.usage_stats.classes_count, max: upgradeData.user_limits.max_classes },
            { label: 'Centros', icon: School, current: upgradeData.usage_stats.colleges_count, max: upgradeData.user_limits.max_colleges },
            { label: 'Torneos', icon: Trophy, current: upgradeData.usage_stats.tournaments_count, max: upgradeData.user_limits.max_tournaments },
            { label: 'Storage', icon: HardDrive, current: upgradeData.usage_stats.storage_used_mb, max: upgradeData.user_limits.max_storage_mb },
            { label: 'Skills', icon: Target, current: upgradeData.usage_stats.custom_skills_count, max: upgradeData.user_limits.max_custom_skills }
          ] as stat}
            {@const StatIcon = getStatIcon(stat.icon)}
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-surface-500">
                <span class="flex items-center gap-1.5">
                  <StatIcon class="w-3 h-3" />
                  {stat.label}
                </span>
                <span class="text-surface-300">
                  {stat.current}{stat.max === -1 ? '' : ` / ${stat.max}`}
                </span>
              </div>
              <div class="h-2 bg-surface-950 border border-surface-900 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary-500 transition-all duration-1000" 
                  style={`width: ${stat.max === -1 ? 100 : getUsagePercentage(stat.current, stat.max)}%`}
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Plans -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {#each upgradeData.available_plans as plan}
        {@const isCurrent = upgradeData.current_plan.name === plan.name}
        {@const isPopular = plan.name === 'professional'}
        {@const PlanIcon = getPlanIcon(plan.name)}
        <div class={`glass-panel p-8 relative flex flex-col transition-all duration-300 hover:translate-y-[-8px] ${isPopular ? 'border-t-4 border-primary-500 scale-105 z-10 shadow-[0_32px_64px_-16px_rgba(16,185,129,0.2)]' : ''}`}>
          {#if isPopular}
            <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              Más Popular
            </div>
          {/if}

          <div class="mb-8 text-center">
            <div class={`w-16 h-16 mx-auto mb-6 rounded-3xl flex items-center justify-center border-2 ${isPopular ? 'bg-primary-500/10 border-primary-500 shadow-[0_0_24px_-12px_rgba(16,185,129,0.5)]' : 'bg-surface-900 border-surface-800'}`}>
              <PlanIcon class={`w-8 h-8 ${isPopular ? 'text-primary-400' : 'text-surface-600'}`} />
            </div>
            <h3 class="text-2xl font-black text-white uppercase tracking-tighter mb-2">{plan.display_name}</h3>
            <div class="flex items-baseline justify-center gap-1 mb-4">
              <span class="text-4xl font-black text-white">€{plan.price_annual}</span>
              <span class="text-surface-500 text-sm font-bold">/año</span>
            </div>
            <p class="text-surface-500 text-sm">{plan.description}</p>
          </div>

          <div class="space-y-4 mb-10 flex-grow">
            {#each plan.features as feature}
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <Check class="w-3 h-3 text-primary-400" />
                </div>
                <span class="text-sm text-surface-300 font-medium">{feature}</span>
              </div>
            {/each}
          </div>

          <button 
            disabled={isCurrent || isUpgrading || plan.name === 'free'}
            onclick={() => handleUpgrade(plan.name)}
            class={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${
              isCurrent 
                ? 'bg-surface-900 border border-surface-800 text-surface-600' 
                : isPopular
                  ? 'bg-primary-500 text-black hover:bg-primary-400 hover:shadow-[0_0_32px_-8px_rgba(16,185,129,0.4)]'
                  : 'bg-white text-black hover:bg-surface-200'
            }`}
          >
            {#if isUpgrading && selectedPlan === plan.name}
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
              <span>Procesando</span>
            {:else if isCurrent}
              <Check class="w-4 h-4" />
              Plan Actual
            {:else}
              <Zap class="w-4 h-4" />
              Suscritbirse
            {/if}
          </button>
        </div>
      {/each}
    </div>

    <!-- FAQ -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-12">
      <div class="space-y-2">
        <h4 class="text-white font-black uppercase tracking-tight">¿Puedo cambiar luego?</h4>
        <p class="text-surface-500 text-sm leading-relaxed">Puedes mejorar tu plan en cualquier momento. La diferencia se prorrateará automáticamente en tu factura.</p>
      </div>
      <div class="space-y-2">
        <h4 class="text-white font-black uppercase tracking-tight">¿Es seguro el pago?</h4>
        <p class="text-surface-500 text-sm leading-relaxed">Utilizamos pasarelas de pago cifradas de nivel bancario. ChessNet nunca almacena tus datos de tarjeta.</p>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Upgrade specific styles */
</style>
