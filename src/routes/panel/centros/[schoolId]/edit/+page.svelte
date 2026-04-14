<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    CaretLeft,
    FloppyDiskBack,
    X,
    Buildings,
    Phone,
    EnvelopeSimple,
    MapPin,
    Globe,
    House,
    CheckCircle,
    PencilLine,
    CircleNotch
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  const schoolData = $derived(data.school as any);

  let formData = $state({
    name: '',
    city: '',
    country: 'ES',
    address: '',
    phone: '',
    email: '',
    website: ''
  });

  onMount(() => {
    if (schoolData) {
      formData = {
        name: schoolData.name || '',
        city: schoolData.city || '',
        country: schoolData.country || 'ES',
        address: schoolData.address || '',
        phone: schoolData.phone || '',
        email: schoolData.email || '',
        website: schoolData.website || ''
      };
    }
  });

  let isSubmitting = $state(false);
  let errors = $state<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) newErrors.website = 'URL inválida';
    
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      isSubmitting = true;
      const response = await fetch(`/api/schools/${schoolData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      goto(`/panel/centros/${schoolData.id}`);
    } catch (error) {
      console.error('Error:', error);
      // In a real app, I'd use a toast component
      alert('Error al actualizar el centro');
    } finally {
      isSubmitting = false;
    }
  };
</script>

<svelte:head>
  <title>Editar {schoolData?.name || 'Centro'} - ChessNet</title>
</svelte:head>

<div class="max-w-[1200px] mx-auto p-4 md:p-8 space-y-8 pb-24" in:fade={{ duration: 300 }}>
  <!-- Navigation and Actions -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div class="space-y-2">
      <button 
        onclick={() => goto(`/panel/centros/${schoolData.id}`)}
        class="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group text-sm font-medium"
      >
        <CaretLeft weight="bold" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Volver al centro
      </button>

      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center text-violet-500">
          <PencilLine weight="duotone" class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Configuración de Sede</h1>
          <p class="text-zinc-500 text-sm">Actualiza los detalles institucionales y de contacto.</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => goto(`/panel/centros/${schoolData.id}`)}
        class="px-6 py-2.5 rounded-full border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all text-sm font-semibold flex items-center gap-2"
        disabled={isSubmitting}
      >
        <X weight="bold" class="w-4 h-4" />
        Cancelar
      </button>
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting}
        class="px-6 py-2.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {#if isSubmitting}
          <CircleNotch weight="bold" class="w-4 h-4 animate-spin" />
          <span>Guardando...</span>
        {:else}
          <FloppyDiskBack weight="duotone" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Guardar cambios</span>
        {/if}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Form Area -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Section: Basic Information -->
      <section class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 md:p-8 space-y-8">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-zinc-800 rounded-xl text-zinc-400">
            <Buildings weight="duotone" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-bold text-white tracking-tight">Información de la Sede</h2>
        </div>

        <div class="grid grid-cols-1 gap-6">
          <div class="space-y-2">
            <label for="name" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Nombre Oficial</label>
            <div class="relative group">
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                class={`w-full bg-zinc-950/50 border rounded-2xl px-5 py-3.5 text-white font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-700 ${errors.name ? 'border-red-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
                placeholder="Ej: Colegio San Ramón"
              />
              {#if errors.name}
                <p class="text-red-500 text-[11px] font-medium mt-1 ml-1">{errors.name}</p>
              {/if}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="city" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Ciudad</label>
              <input
                id="city"
                type="text"
                bind:value={formData.city}
                class={`w-full bg-zinc-950/50 border rounded-2xl px-5 py-3.5 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all ${errors.city ? 'border-red-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
                placeholder="Ej: Madrid"
              />
            </div>

            <div class="space-y-2">
              <label for="country" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">País</label>
              <div class="relative">
                <select 
                  bind:value={formData.country} 
                  class="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-5 py-3.5 text-white appearance-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="ES">España</option>
                  <option value="MX">México</option>
                  <option value="AR">Argentina</option>
                  <option value="CO">Colombia</option>
                  <option value="US">Estados Unidos</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-xs">▼</div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="address" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Dirección Postal</label>
            <div class="relative group">
              <MapPin weight="duotone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-violet-500 transition-colors" />
              <input
                id="address"
                type="text"
                bind:value={formData.address}
                class="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-5 py-3.5 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all placeholder:text-zinc-700 hover:border-zinc-700"
                placeholder="Calle, número, código postal..."
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Contact Channels -->
      <section class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 md:p-8 space-y-8">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-zinc-800 rounded-xl text-zinc-400">
            <EnvelopeSimple weight="duotone" class="w-5 h-5" />
          </div>
          <h2 class="text-lg font-bold text-white tracking-tight">Canales de Contacto</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label for="phone" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Teléfono</label>
            <div class="relative group">
              <Phone weight="duotone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                id="phone"
                type="tel"
                bind:value={formData.phone}
                class="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl pl-12 pr-5 py-3.5 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all hover:border-zinc-700"
                placeholder="+34 000 000 000"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Email Profesional</label>
            <div class="relative group">
              <EnvelopeSimple weight="duotone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input
                id="email"
                type="email"
                bind:value={formData.email}
                class={`w-full bg-zinc-950/50 border rounded-2xl pl-12 pr-5 py-3.5 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all ${errors.email ? 'border-red-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
                placeholder="administracion@academia.com"
              />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label for="website" class="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Sitio Web</label>
          <div class="relative group">
            <Globe weight="duotone" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              id="website"
              type="url"
              bind:value={formData.website}
              class={`w-full bg-zinc-950/50 border rounded-2xl pl-12 pr-5 py-3.5 text-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all ${errors.website ? 'border-red-500/50' : 'border-zinc-800 hover:border-zinc-700'}`}
              placeholder="https://www.tu-academia.com"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Info & Help Column -->
    <div class="space-y-6">
      <div class="bg-zinc-900/50 border border-zinc-800 rounded-[24px] p-6 space-y-6">
        <div class="flex items-center gap-3 pb-4 border-b border-zinc-800">
          <div class="p-2 bg-violet-500/10 rounded-xl text-violet-400">
            <CheckCircle weight="duotone" class="w-5 h-5" />
          </div>
          <h3 class="text-sm font-bold text-white tracking-tight">Estado del Perfil</h3>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-zinc-500">ID del Centro</span>
            <span class="text-[10px] font-bold text-white font-mono bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
              {schoolData?.id.split('-')[0].toUpperCase()}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-zinc-500">Último cambio</span>
            <span class="text-xs font-bold text-white">Hace unos instantes</span>
          </div>
          <div class="pt-2 flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span class="text-xs font-bold text-emerald-500 uppercase tracking-widest">Activo</span>
          </div>
        </div>
      </div>

      <div class="p-6 border border-violet-500/20 rounded-[24px] bg-violet-500/5 space-y-4">
        <div class="flex items-center gap-3">
          <House weight="duotone" class="w-5 h-5 text-violet-400" />
          <h3 class="text-sm font-bold text-violet-400">Guía de Membrete</h3>
        </div>
        <p class="text-sm text-zinc-400 leading-relaxed">
          Asegúrate de que el nombre y la dirección sean exactos. Esta información aparecerá automáticamente en los <strong>Reportes PDF</strong> y facturas generadas para este centro.
        </p>
      </div>

      <!-- Delete Action (Optional/Future) -->
      <div class="p-6 bg-red-500/5 border border-red-500/10 rounded-[24px] opacity-60">
        <p class="text-[10px] font-black text-red-500/70 uppercase tracking-widest mb-1">Zona Crítica</p>
        <p class="text-xs text-zinc-500 font-medium italic">
          Para eliminar esta sede, contacta con soporte técnico para asegurar que los registros de alumnos no se vean afectados.
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  :global(input:-webkit-autofill),
  :global(input:-webkit-autofill:hover), 
  :global(input:-webkit-autofill:focus) {
    -webkit-text-fill-color: white;
    -webkit-box-shadow: 0 0 0px 1000px #09090b inset;
    transition: background-color 5000s ease-in-out 0s;
  }
</style>
