<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Check, 
    X, 
    Crown, 
    Users, 
    Buildings, 
    Trophy, 
    HardDrive,
    Target,
    ArrowLeft,
    Lightning,
    Star,
    Shield,
    Sparkle,
    CreditCard,
    ArrowUpRight,
    CaretRight,
    Pulse,
    UserCircle,
    CheckCircle,
    Warning
  } from 'phosphor-svelte';
  import { initiateUpgrade } from '$lib/api/subscriptions';
  import { t } from '$lib/i18n';
  import { toast } from '$lib/stores/toast';
  import { fade, fly, scale } from 'svelte/transition';
  import { auth } from '$lib/firebase';
  import type { PageData } from './$types';

  let { data } = $props<{ data: PageData }>();

  let upgradeData = $derived(data.upgradeData);
  let isUpgrading = $state(false);
  let selectedPlan = $state('');

  const handleUpgrade = async (planName: string) => {
    if (isUpgrading || planName === 'free') return;
    
    isUpgrading = true;
    selectedPlan = planName;
    
    const user = auth.currentUser;
    if (!user) {
      toast.error('Debes iniciar sesión para mejorar tu plan');
      isUpgrading = false;
      return;
    }
    
    try {
      const result = await initiateUpgrade(planName, user.uid, user.email || undefined);
      if (result.success && result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        toast.error(result.error || 'Error al iniciar el proceso de pago');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      isUpgrading = false;
      selectedPlan = '';
    }
  };

  let isOpeningPortal = $state(false);
  const handleManageBilling = async () => {
    if (isOpeningPortal) return;
    isOpeningPortal = true;
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || 'No se pudo abrir el portal de facturación. Asegúrate de tener una suscripción activa.');
      }
    } catch (err) {
      toast.error('Error al conectar con Stripe');
    } finally {
      isOpeningPortal = false;
    }
  };

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0;
    if (max === 0) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const getPlanIcon = (planName: string): any => {
    switch (planName) {
      case 'free': return UserCircle;
      case 'premium': return Crown;
      default: return Lightning;
    }
  };

</script>

<svelte:head>
  <title>Mejorar Plan | ChessNet Premium</title>
</svelte:head>
<div class="min-h-full pb-32" transition:fade>
  
  <!-- Header / Hero Section -->
  <div class="relative overflow-hidden pt-12 pb-24 px-6">
    <!-- Animated background elements -->
    <div class="absolute inset-0 bg-bento-bg pointer-events-none -z-20"></div>
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 blur-[150px] rounded-full -z-10 animate-pulse"></div>
    <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full -z-10 animate-pulse" style="animation-delay: 2s"></div>
    
    <div class="max-w-6xl mx-auto relative z-10 text-center">
      <div class="inline-flex items-center gap-2 px-5 py-2 bg-primary-500/10 border border-primary-500/20 rounded-none text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-lg shadow-primary-500/5">
        <Sparkle weight="fill" class="w-4 h-4 animate-spin-slow" />
        {$t('pricing.subtitle')}
      </div>
      
      <h1 class="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.85] mb-8 uppercase italic">
        Maestro <span class="text-primary-500">Premium.</span>
      </h1>
      
      <p class="text-surface-400 font-medium text-xl max-w-3xl mx-auto leading-relaxed">
        {$t('pricing.free.desc')} <span class="text-white">{$t('pricing.premium.desc')}</span>
      </p>

      {#if data.isAdmin}
        <div class="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold uppercase text-[11px] tracking-widest shadow-xl shadow-amber-500/5">
          <Crown weight="fill" class="w-5 h-5" />
          Modo Desarrollador: Acceso Total Ilimitado
        </div>
      {/if}
    </div>
  </div>

  {#if upgradeData}
    <div class="max-w-6xl mx-auto px-6 space-y-32">
      
      <!-- Resource Usage Section -->
      <section class="space-y-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div class="space-y-2">
            <h2 class="text-xs font-black text-primary-500 uppercase tracking-[0.25em] flex items-center gap-3">
              <Pulse class="w-5 h-5 animate-pulse" />
              {$t('pricing.usage_status')}
            </h2>
            <p class="text-surface-400 text-sm font-medium">
              {$t('pricing.current_usage')} 
              <span class="text-white font-black uppercase tracking-tighter ml-1 px-2 py-0.5 bg-white/5 border border-white/10">
                {upgradeData.current_plan.display_name}
              </span>
            </p>
          </div>
          <div class="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
            <span class="flex items-center gap-2 text-surface-600">
              <div class="w-2.5 h-2.5 bg-zinc-800 border border-white/5"></div>
              {$t('pricing.lib_usage')}
            </span>
            <span class="flex items-center gap-2 text-primary-400">
              <div class="w-2.5 h-2.5 bg-primary-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
              {$t('pricing.in_use')}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each [
            { label: $t('pricing.students'), icon: Users, current: upgradeData.usage_stats.students_count, max: upgradeData.user_limits.max_students },
            { label: $t('pricing.classes'), icon: Buildings, current: upgradeData.usage_stats.classes_count, max: upgradeData.user_limits.max_classes },
            { label: $t('pricing.schools'), icon: Buildings, current: upgradeData.usage_stats.schools_count, max: upgradeData.user_limits.max_schools },
            { label: $t('pricing.tournaments'), icon: Trophy, current: upgradeData.usage_stats.tournaments_count, max: upgradeData.user_limits.max_tournaments },
            { label: $t('pricing.storage'), icon: HardDrive, current: upgradeData.usage_stats.storage_used_mb, max: upgradeData.user_limits.max_storage_mb, unit: 'MB' },
            { label: $t('pricing.skills'), icon: Target, current: upgradeData.usage_stats.custom_skills_count, max: upgradeData.user_limits.max_custom_skills }
          ] as stat}
            {@const Icon = stat.icon}
            {@const percentage = stat.max === -1 ? 0 : getUsagePercentage(stat.current, stat.max)}
            <div class="bento-card group hover:shadow-violet-flare transition-all duration-500">
              <div class="p-8">
                <div class="flex justify-between items-start mb-6">
                  <div class="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-surface-400 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Icon weight="duotone" size={24} />
                  </div>
                  <div class="text-right">
                    <div class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1">{stat.label}</div>
                    <div class="text-2xl font-display font-black text-white italic">
                      {stat.current}
                      <span class="text-surface-600 text-xs font-bold not-italic">/ {stat.max === -1 ? '∞' : stat.max + (stat.unit || '')}</span>
                    </div>
                  </div>
                </div>

                <div class="relative h-2 bg-zinc-900 border border-white/5 overflow-hidden shadow-inner">
                  <div 
                    class="absolute top-0 left-0 h-full bg-primary-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-1000 ease-out"
                    style="width: {stat.max === -1 ? (stat.current > 0 ? 100 : 0) : percentage}%"
                  ></div>
                </div>
                
                {#if stat.max !== -1 && percentage >= 90}
                  <p class="mt-3 text-[10px] font-bold text-amber-500 uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                    <Warning weight="fill" class="w-3 h-3" />
                    Límite casi alcanzado
                  </p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Pricing Plans Section -->
      <section class="space-y-16">
        <div class="text-center space-y-4">
          <h2 class="text-4xl md:text-6xl font-display font-black text-white uppercase italic tracking-tighter">
            Planes de <span class="text-primary-500">Crecimiento.</span>
          </h2>
          <p class="text-surface-500 font-medium">Elige el plan que mejor se adapte a tu academia.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
          {#each upgradeData.available_plans as plan}
            {@const isCurrent = upgradeData.user_limits.plan_name === plan.name}
            {@const isPremium = plan.name === 'premium'}
            {@const PlanIcon = getPlanIcon(plan.name)}
            
            <div class="relative group">
              {#if isPremium}
                <div class="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span class="px-4 py-1.5 bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20">
                    {$t('pricing.recommended')}
                  </span>
                </div>
              {/if}

              <div class="bento-card h-full flex flex-col border-white/10 {isPremium ? 'ring-2 ring-primary-500/50 scale-[1.02] shadow-violet-flare' : ''}">
                <div class="p-10 flex-grow">
                  <div class="flex justify-between items-start mb-8">
                    <div class="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 shadow-inner">
                      <PlanIcon weight="duotone" size={32} />
                    </div>
                    <div class="text-right">
                      <h3 class="text-2xl font-display font-black text-white uppercase tracking-tight italic mb-2">{plan.display_name}</h3>
                      <div class="flex items-baseline justify-end gap-1">
                        <span class="text-5xl font-display font-black text-white italic">{plan.price_annual}€</span>
                        <span class="text-surface-500 text-[10px] font-black uppercase tracking-widest">
                          /{isPremium ? $t('pricing.premium.period').split('/')[1] : $t('pricing.free.period').split('/')[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p class="text-surface-400 text-sm font-medium leading-relaxed mb-10 h-12 overflow-hidden">
                    {plan.description}
                  </p>

                  <div class="space-y-5 mb-12">
                    {#each plan.features as feature}
                      <div class="flex items-start gap-4">
                        <div class="w-6 h-6 bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <Check weight="bold" class="w-3 h-3 text-primary-400" />
                        </div>
                        <span class="text-[13px] text-surface-200 font-semibold">{feature}</span>
                      </div>
                    {/each}
                  </div>

                  <button 
                    disabled={isCurrent || isUpgrading || plan.name === 'free'}
                    onclick={() => handleUpgrade(plan.name)}
                    class="w-full h-16 font-display font-black uppercase tracking-[0.25em] text-xs transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed {
                      isCurrent 
                        ? 'bg-zinc-950 text-surface-600 border border-white/5' 
                        : isPremium
                          ? 'bg-primary-500 text-white hover:bg-primary-400 shadow-2xl shadow-primary-500/30'
                          : 'bg-white text-black hover:bg-surface-200'
                    }"
                  >
                    {#if isUpgrading && selectedPlan === plan.name}
                      <div class="animate-spin h-4 w-4 border-2 border-current border-t-transparent"></div>
                      <span>{$t('pricing.processing')}</span>
                    {:else if isCurrent}
                      <CheckCircle weight="fill" class="w-5 h-5" />
                      {$t('pricing.current_plan')}
                    {:else if plan.name === 'free'}
                      {$t('pricing.not_available')}
                    {:else}
                      <Lightning weight="fill" class="w-5 h-5 animate-pulse" />
                      {$t('pricing.upgrade_to')} {plan.display_name}
                    {/if}
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- Trust Badges Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-white/5">
        <div class="group">
          <div class="text-primary-500 font-display font-black text-xs uppercase tracking-widest flex items-center gap-3 mb-4 group-hover:translate-x-1 transition-transform">
            <Shield weight="duotone" class="w-6 h-6" />
            {$t('pricing.secure_payment')}
          </div>
          <p class="text-surface-500 text-xs leading-relaxed font-medium">{$t('pricing.secure_payment_desc')}</p>
        </div>
        <div class="group">
          <div class="text-primary-500 font-display font-black text-xs uppercase tracking-widest flex items-center gap-3 mb-4 group-hover:translate-x-1 transition-transform">
            <CreditCard weight="duotone" class="w-6 h-6" />
            {$t('pricing.no_permanence')}
          </div>
          <p class="text-surface-500 text-xs leading-relaxed font-medium mb-4">{$t('pricing.no_permanence_desc')}</p>
          {#if upgradeData.user_limits.plan_name === 'premium'}
            <button 
              onclick={handleManageBilling}
              disabled={isOpeningPortal}
              class="text-[10px] font-black text-white bg-white/5 border border-white/10 px-4 py-2 hover:bg-white hover:text-black transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              {#if isOpeningPortal}
                <div class="animate-spin h-3 w-3 border-2 border-current border-t-transparent"></div>
              {/if}
              Gestionar Suscripción
            </button>
          {/if}
        </div>
        <div class="group">
          <div class="text-primary-500 font-display font-black text-xs uppercase tracking-widest flex items-center gap-3 mb-4 group-hover:translate-x-1 transition-transform">
            <ArrowUpRight weight="duotone" class="w-6 h-6" />
            {$t('pricing.scalability')}
          </div>
          <p class="text-surface-500 text-xs leading-relaxed font-medium">{$t('pricing.scalability_desc')}</p>
        </div>
      </div>

    </div>
  {:else}
    <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-primary-500/10 border-t-primary-500 animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <Pulse class="w-8 h-8 text-primary-500 animate-pulse" />
        </div>
      </div>
      <p class="text-surface-500 font-black uppercase tracking-widest text-[10px] animate-pulse">Sincronizando con Stripe...</p>
    </div>
  {/if}
</div>

<style lang="postcss">
  :global(.animate-spin-slow) {
    animation: spin 8s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .shadow-violet-flare {
    box-shadow: 0 0 40px -10px rgba(139, 92, 246, 0.2), 0 0 20px -5px rgba(139, 92, 246, 0.1);
  }

  :global(.bento-card) {
    @apply bg-zinc-900/50 border border-white/10 backdrop-blur-sm relative overflow-hidden;
  }
</style>
