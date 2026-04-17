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
    Pulse,
    ArrowUpRight,
    CaretRight
  } from 'phosphor-svelte';
  import { initiateUpgrade } from '$lib/api/subscriptions';
  import { t } from '$lib/i18n';
  import { toast, showError } from '$lib/stores/toast';
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
      toast.error('You must be logged in to upgrade');
      isUpgrading = false;
      return;
    }
    
    try {
      const result = await initiateUpgrade(planName, user.uid, user.email || undefined);
      if (result.success && result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        toast.error(result.error || 'Error starting the upgrade process');
      }
    } catch (error) {
      showError(error, 'Unexpected error. Please try again.');
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
      case 'premium': return Crown;
      default: return Lightning;
    }
  };

</script>

<svelte:head>
  <title>Premium Upgrade - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-8" transition:fade>
  
  <!-- Hero Section -->
  <div class="text-center space-y-6 pt-10 pb-16 relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-violet-600/5 blur-[120px] rounded-full -z-10"></div>
    
    <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-full text-violet-400 text-[10px] font-outfit font-black uppercase tracking-[0.2em] mb-4">
      <Sparkle weight="fill" class="w-3.5 h-3.5" />
      Power up your academy
    </div>
    <h1 class="text-5xl font-outfit font-extrabold text-white tracking-tighter sm:text-7xl leading-tight">
      Take your chess to the <br /> <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-violet-600">Next Level</span>
    </h1>
    <p class="text-slate-400 font-plus-jakarta text-lg max-w-2xl mx-auto leading-relaxed">
      Unlock advanced tools, extended limits, and detailed reports to manage your academy professionally.
    </p>
  </div>

  {#if upgradeData}
    <!-- Usage Stats -->
    <div class="bento-card p-10 mb-16 relative group transition-all duration-700 hover:border-violet-500/30">
      <div class="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
        <Pulse weight="duotone" class="w-40 h-40 text-violet-500" />
      </div>

      <div class="relative z-10 space-y-10">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-500 shadow-xl shadow-violet-500/5">
            <HardDrive weight="duotone" class="w-8 h-8" />
          </div>
          <div>
            <h2 class="text-2xl font-outfit font-black text-white tracking-tight uppercase">Resource Usage</h2>
            <p class="text-slate-500 font-plus-jakarta text-xs font-bold uppercase tracking-widest mt-1">
              Current plan status: <span class="text-violet-500">{upgradeData.current_plan.display_name}</span>
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10">
          {#each [
            { label: 'Students', icon: Users, current: upgradeData.usage_stats.students_count, max: upgradeData.user_limits.max_students },
            { label: 'Classes', icon: Buildings, current: upgradeData.usage_stats.classes_count, max: upgradeData.user_limits.max_classes },
            { label: 'Schools', icon: Buildings, current: upgradeData.usage_stats.schools_count, max: upgradeData.user_limits.max_schools },
            { label: 'Tournaments', icon: Trophy, current: upgradeData.usage_stats.tournaments_count, max: upgradeData.user_limits.max_tournaments },
            { label: 'Storage', icon: HardDrive, current: upgradeData.usage_stats.storage_used_mb, max: upgradeData.user_limits.max_storage_mb },
            { label: 'Skills', icon: Target, current: upgradeData.usage_stats.custom_skills_count, max: upgradeData.user_limits.max_custom_skills }
          ] as stat}
            {@const Icon = stat.icon}
            <div class="space-y-3">
              <div class="flex items-center justify-between text-[10px] font-outfit font-black uppercase tracking-widest text-slate-500">
                <span class="flex items-center gap-2">
                  <Icon weight="duotone" class="w-4 h-4 text-violet-500/60" />
                  {stat.label}
                </span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-outfit font-black text-white">{stat.current}</span>
                <span class="text-slate-600 text-[10px] font-bold">/ {stat.max === -1 ? '∞' : stat.max}</span>
              </div>
              <div class="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.25)]" 
                  style={`width: ${stat.max === -1 ? 100 : getUsagePercentage(stat.current, stat.max)}%`}
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Plans -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
      {#each upgradeData.available_plans as plan, i}
        {@const isCurrent = upgradeData.current_plan.name === plan.name}
        {@const isPopular = plan.name === 'professional'}
        {@const PlanIcon = getPlanIcon(plan.name)}
        <div 
          class="bento-card p-1 relative flex flex-col group transition-all duration-500 {isPopular ? 'border-violet-500/50 scale-105 z-10 shadow-[0_40px_80px_-20px_rgba(139,92,246,0.15)]' : 'hover:border-violet-500/20 shadow-xl shadow-zinc-950'}"
          in:fly={{ y: 40, delay: i * i * 100 }}
        >
          <div class="bg-zinc-900/40 rounded-[28px] p-10 flex flex-col h-full">
            {#if isPopular}
              <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[10px] font-outfit font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-violet-600/30">
                Recommended
              </div>
            {/if}

            <div class="mb-10 text-center">
              <div class={`w-20 h-20 mx-auto mb-8 rounded-[32px] flex items-center justify-center border transition-all duration-500 ${isPopular ? 'bg-violet-600 shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] border-white/20' : 'bg-zinc-950 border-white/5'}`}>
                <PlanIcon weight="duotone" class={`w-10 h-10 ${isPopular ? 'text-white' : 'text-violet-500'}`} />
              </div>
              <h3 class="text-2xl font-outfit font-black text-white tracking-tight mb-2">{plan.display_name}</h3>
              <div class="flex items-baseline justify-center gap-1.5 mb-6">
                <span class="text-5xl font-outfit font-black text-white">{plan.name === 'premium' ? '1' : plan.price_annual}{$t('common.currency')}</span>
                <span class="text-slate-600 font-outfit font-bold text-sm tracking-widest uppercase">/Month</span>
              </div>
              <p class="text-slate-500 font-plus-jakarta text-sm leading-relaxed px-4">{plan.description}</p>
            </div>

            <div class="space-y-4 mb-12 flex-grow">
              {#each plan.features as feature}
                <div class="flex items-start gap-3">
                  <div class="w-5 h-5 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check weight="bold" class="w-2.5 h-2.5 text-violet-400" />
                  </div>
                  <span class="text-[13px] text-slate-400 font-plus-jakarta font-medium">{feature}</span>
                </div>
              {/each}
            </div>

            <button 
              disabled={isCurrent || isUpgrading || plan.name === 'free'}
              onclick={() => handleUpgrade(plan.name)}
              class="btn-pill py-4 px-6 w-full font-outfit font-black uppercase tracking-[0.15em] text-xs transition-all flex items-center justify-center gap-3 active:scale-95 disabled:hover:translate-y-0 disabled:active:scale-100 {
                isCurrent 
                  ? 'bg-zinc-950/80 border border-white/5 text-slate-600 cursor-not-allowed' 
                  : isPopular
                    ? 'bg-violet-600 text-white shadow-violet-flare hover:bg-violet-500'
                    : 'bg-white text-black hover:bg-zinc-200'
              }"
            >
              {#if isUpgrading && selectedPlan === plan.name}
                <div class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                <span>Processing</span>
              {:else if isCurrent}
                <Check weight="bold" class="w-4 h-4" />
                Current Plan
              {:else if plan.name === 'free'}
                <X weight="bold" class="w-4 h-4" />
                Not Available
              {:else}
                <Lightning weight="fill" class="w-4 h-4" />
                Get {plan.display_name}
              {/if}
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- FAQ & Trust -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto pt-16 border-t border-white/5">
      <div class="flex gap-6">
        <div class="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Sparkle weight="duotone" class="w-6 h-6 text-violet-400" />
        </div>
        <div class="space-y-2">
          <h4 class="text-white font-outfit font-black uppercase tracking-tight text-lg">Total Flexibility</h4>
          <p class="text-slate-500 font-plus-jakarta text-sm leading-relaxed">You can upgrade your plan at any time. The difference will be automatically prorated on your invoice with no surprise charges.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Shield weight="duotone" class="w-6 h-6 text-violet-400" />
        </div>
        <div class="space-y-2">
          <h4 class="text-white font-outfit font-black uppercase tracking-tight text-lg">Banking Security</h4>
          <p class="text-slate-500 font-plus-jakarta text-sm leading-relaxed">We use encrypted payment gateways with Stripe. ChessNet never stores your sensitive payment details.</p>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  /* Upgrade specific styles */
</style>
