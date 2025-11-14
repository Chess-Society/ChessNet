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
    Sparkles
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { initiateUpgrade } from '$lib/api/subscriptions';

  export let data: PageData;

  let upgradeData = data.upgradeData;
  let isUpgrading = false;
  let selectedPlan = '';

  onMount(() => {
    console.log('✅ Upgrade page loaded:', upgradeData);
  });

  const handleUpgrade = async (planName: string) => {
    if (isUpgrading || planName === 'free') return;
    
    isUpgrading = true;
    selectedPlan = planName;
    
    try {
      console.log(`🚀 Starting upgrade to: ${planName}`);
      
      const result = await initiateUpgrade(planName);
      
      if (result.success && result.payment_url) {
        console.log('✅ Redirecting to PayPal:', result.payment_url);
        window.location.href = result.payment_url;
      } else {
        console.error('❌ Upgrade failed:', result.error);
        alert(result.error || 'Error al iniciar el proceso de upgrade');
      }
    } catch (error) {
      console.error('❌ Upgrade error:', error);
      alert('Error inesperado. Por favor, intenta nuevamente.');
    } finally {
      isUpgrading = false;
      selectedPlan = '';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // Ilimitado
    return Math.min((current / max) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'free': return Users;
      case 'professional': return Star;
      case 'academy': return Crown;
      default: return Shield;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'free': return 'border-slate-600 bg-slate-800/50';
      case 'professional': return 'border-blue-500/50 bg-blue-500/10';
      case 'academy': return 'border-purple-500/50 bg-purple-500/10';
      default: return 'border-slate-600 bg-slate-800/50';
    }
  };

  const isCurrentPlan = (planName: string) => {
    return upgradeData?.current_plan?.name === planName;
  };

  const isPopularPlan = (planName: string) => {
    return planName === 'professional';
  };
</script>

<svelte:head>
  <title>Upgrade de Plan - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 text-slate-100">
  <!-- Header -->
  <div class="bg-slate-800/50 border-b border-slate-700/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button
            on:click={() => goto('/dashboard')}
            class="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
        
        <div class="flex items-center space-x-3">
          <Sparkles class="w-6 h-6 text-blue-400" />
          <h1 class="text-2xl font-bold text-white">Upgrade de Plan</h1>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {#if !upgradeData}
      <div class="text-center">
        <div class="text-slate-400">Cargando datos de suscripción...</div>
      </div>
    {:else}
      <!-- Current Usage Stats -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-4">Tu Uso Actual</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {#each [
            { key: 'students', label: 'Estudiantes', icon: Users, current: upgradeData.usage_stats.students_count, max: upgradeData.user_limits.max_students },
            { key: 'classes', label: 'Clases', icon: School, current: upgradeData.usage_stats.classes_count, max: upgradeData.user_limits.max_classes },
            { key: 'colleges', label: 'Centros', icon: School, current: upgradeData.usage_stats.colleges_count, max: upgradeData.user_limits.max_colleges },
            { key: 'tournaments', label: 'Torneos', icon: Trophy, current: upgradeData.usage_stats.tournaments_count, max: upgradeData.user_limits.max_tournaments },
            { key: 'storage', label: 'Almacenamiento', icon: HardDrive, current: upgradeData.usage_stats.storage_used_mb, max: upgradeData.user_limits.max_storage_mb },
            { key: 'skills', label: 'Skills Custom', icon: Target, current: upgradeData.usage_stats.custom_skills_count, max: upgradeData.user_limits.max_custom_skills }
          ] as stat}
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
              <div class="flex items-center space-x-2 mb-2">
                <svelte:component this={stat.icon} class="w-4 h-4 text-slate-400" />
                <span class="text-sm text-slate-400">{stat.label}</span>
              </div>
              <div class="text-lg font-semibold text-white">
                {stat.current}{stat.max === -1 ? '' : `/${stat.max}`}
              </div>
              {#if stat.max !== -1}
                <div class="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                  <div 
                    class="bg-blue-400 h-1.5 rounded-full transition-all"
                    style="width: {getUsagePercentage(stat.current, stat.max)}%"
                  ></div>
                </div>
                <div class="text-xs {getUsageColor(getUsagePercentage(stat.current, stat.max))} mt-1">
                  {getUsagePercentage(stat.current, stat.max).toFixed(0)}% usado
                </div>
              {:else}
                <div class="text-xs text-green-400 mt-1">Ilimitado</div>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Plans Grid -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-white mb-6 text-center">Elige tu Plan</h2>
        <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {#each upgradeData.available_plans as plan (plan.id)}
            {@const IconComponent = getPlanIcon(plan.name)}
            <div class="relative">
              <!-- Popular Badge -->
              {#if isPopularPlan(plan.name)}
                <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Más Popular
                  </div>
                </div>
              {/if}

              <!-- Plan Card -->
              <div class="card {getPlanColor(plan.name)} relative overflow-hidden">
                {#if isCurrentPlan(plan.name)}
                  <div class="absolute top-4 right-4">
                    <div class="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Plan Actual
                    </div>
                  </div>
                {/if}

                <!-- Plan Header -->
                <div class="text-center mb-6">
                  <div class="flex justify-center mb-3">
                    <div class="p-3 bg-slate-700/50 rounded-full">
                      <svelte:component this={IconComponent} class="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <h3 class="text-xl font-bold text-white mb-2">{plan.display_name}</h3>
                  <p class="text-slate-400 text-sm mb-4">{plan.description}</p>
                  
                  <!-- Price -->
                  <div class="mb-4">
                    {#if plan.price_annual === 0}
                      <div class="text-3xl font-bold text-green-400">Gratuito</div>
                    {:else}
                      <div class="text-3xl font-bold text-white">
                        {formatPrice(plan.price_annual)}
                        <span class="text-lg font-normal text-slate-400">/año</span>
                      </div>
                      <div class="text-sm text-slate-400">
                        Solo {formatPrice(plan.price_annual / 12)}/mes
                      </div>
                    {/if}
                  </div>
                </div>

                <!-- Features -->
                <div class="mb-6">
                  <h4 class="text-sm font-semibold text-slate-300 mb-3">Características:</h4>
                  <ul class="space-y-2">
                    {#each plan.features as feature}
                      <li class="flex items-start space-x-2">
                        <Check class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span class="text-sm text-slate-300">{feature}</span>
                      </li>
                    {/each}
                  </ul>
                </div>

                <!-- Limits -->
                <div class="mb-6">
                  <h4 class="text-sm font-semibold text-slate-300 mb-3">Límites:</h4>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="text-slate-400">
                      <span class="font-medium">Estudiantes:</span> 
                      {plan.max_students === -1 ? 'Ilimitados' : plan.max_students}
                    </div>
                    <div class="text-slate-400">
                      <span class="font-medium">Clases:</span> 
                      {plan.max_classes === -1 ? 'Ilimitadas' : plan.max_classes}
                    </div>
                    <div class="text-slate-400">
                      <span class="font-medium">Centros:</span> 
                      {plan.max_colleges === -1 ? 'Ilimitados' : plan.max_colleges}
                    </div>
                    <div class="text-slate-400">
                      <span class="font-medium">Torneos:</span> 
                      {plan.max_tournaments === -1 ? 'Ilimitados' : plan.max_tournaments}
                    </div>
                  </div>
                </div>

                <!-- Action Button -->
                <div class="mt-auto">
                  {#if isCurrentPlan(plan.name)}
                    <button
                      disabled
                      class="w-full py-3 bg-slate-600 text-slate-400 rounded-lg font-medium cursor-not-allowed"
                    >
                      Plan Actual
                    </button>
                  {:else if plan.name === 'free'}
                    <button
                      disabled
                      class="w-full py-3 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed"
                    >
                      No se puede downgrade
                    </button>
                  {:else}
                    <button
                      on:click={() => handleUpgrade(plan.name)}
                      disabled={isUpgrading}
                      class="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {#if isUpgrading && selectedPlan === plan.name}
                        <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Procesando...</span>
                      {:else}
                        <Zap class="w-4 h-4" />
                        <span>Upgrade Ahora</span>
                      {/if}
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="max-w-3xl mx-auto">
        <h2 class="text-xl font-semibold text-white mb-6 text-center">Preguntas Frecuentes</h2>
        <div class="space-y-4">
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 class="font-medium text-white mb-2">¿Puedo cambiar de plan en cualquier momento?</h3>
            <p class="text-slate-400 text-sm">Sí, puedes hacer upgrade en cualquier momento. Los downgrades se aplicarán al final del período de facturación actual.</p>
          </div>
          
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 class="font-medium text-white mb-2">¿Qué pasa si supero los límites de mi plan?</h3>
            <p class="text-slate-400 text-sm">Te notificaremos cuando te acerques a los límites y te daremos la opción de hacer upgrade antes de que se bloqueen las funcionalidades.</p>
          </div>
          
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 class="font-medium text-white mb-2">¿Hay descuentos por pago anual?</h3>
            <p class="text-slate-400 text-sm">¡Sí! Todos nuestros precios ya incluyen un descuento significativo por pago anual comparado con planes mensuales.</p>
          </div>
          
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <h3 class="font-medium text-white mb-2">¿Puedo cancelar en cualquier momento?</h3>
            <p class="text-slate-400 text-sm">Por supuesto. Puedes cancelar tu suscripción en cualquier momento y seguirás teniendo acceso hasta el final del período pagado.</p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
