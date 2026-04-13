<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Save,
    X,
    School,
    Phone,
    Mail,
    MapPin,
    Globe,
    Building,
    Check,
    Edit
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';

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
      goto(`/schools/${schoolData.id}`);
    } catch (error) {
      alert('Error al actualizar el centro');
    } finally {
      isSubmitting = false;
    }
  };
</script>

<svelte:head>
  <title>Editar {schoolData?.name || 'Centro'} - ChessNet</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
    <div class="space-y-4">
      <button 
        onclick={() => goto(`/schools/${schoolData.id}`)}
        class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest"
      >
        <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Regresar al Centro
      </button>

      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400">
          <Edit class="w-8 h-8" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-white tracking-tighter uppercase">Configuración de Sede</h1>
          <p class="text-surface-500 text-sm font-medium">Personaliza los detalles y contacto de tu institución.</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button 
        onclick={() => goto(`/schools/${schoolData.id}`)}
        class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        disabled={isSubmitting}
      >
        <X class="w-4 h-4" />
        Descartar
      </button>
      <button 
        onclick={handleSubmit}
        disabled={isSubmitting}
        class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3"
      >
        {#if isSubmitting}
          <div class="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
          <span>Guardando...</span>
        {:else}
          <Save class="w-4 h-4" />
          <span>Guardar Cambios</span>
        {/if}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <!-- Form Area -->
    <div class="lg:col-span-2 space-y-8">
      <section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500">
        <h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">
          <Building class="w-5 h-5 text-primary-400" />
          Información Básica
        </h2>

        <div class="space-y-6">
          <div class="space-y-2">
            <label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre Oficial</label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              class={`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-surface-800'}`}
              placeholder="Ej: Colegio San Ramón y San Antonio"
            />
            {#if errors.name}<p class="text-red-500 text-[10px] font-bold uppercase tracking-widest">{errors.name}</p>{/if}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="city" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Ciudad</label>
              <input
                id="city"
                type="text"
                bind:value={formData.city}
                class={`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.city ? 'border-red-500' : 'border-surface-800'}`}
                placeholder="Ej: Madrid"
              />
            </div>

            <div class="space-y-2">
              <label for="country" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">País</label>
              <select bind:value={formData.country} class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all cursor-pointer font-bold">
                <option value="ES">ESPAÑA</option>
                <option value="MX">MÉXICO</option>
                <option value="AR">ARGENTINA</option>
                <option value="CO">COLOMBIA</option>
                <option value="US">ESTADOS UNIDOS</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label for="address" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Dirección Postal</label>
            <div class="relative group">
               <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-700 group-focus-within:text-primary-400 transition-colors" />
               <input
                id="address"
                type="text"
                bind:value={formData.address}
                class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-700"
                placeholder="Calle Fantasía 123, 28001"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="glass-panel p-8 space-y-8 border-t-4 border-blue-500">
        <h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">
          <Globe class="w-5 h-5 text-blue-400" />
          Canales de Contacto
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label for="phone" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Teléfono</label>
            <div class="relative group">
              <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700" />
              <input
                id="phone"
                type="tel"
                bind:value={formData.phone}
                class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all"
                placeholder="+34 000 000 000"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Email Profesional</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700" />
              <input
                id="email"
                type="email"
                bind:value={formData.email}
                class={`w-full bg-surface-950 border rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-surface-800'}`}
                placeholder="hola@academia.com"
              />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label for="website" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Sitio Web</label>
          <input
            id="website"
            type="url"
            bind:value={formData.website}
            class={`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.website ? 'border-red-500' : 'border-surface-800'}`}
            placeholder="https://www.tu-academia.com"
          />
        </div>
      </section>
    </div>

    <!-- Info Column -->
    <div class="space-y-8">
      <div class="glass-panel p-8 space-y-6">
        <div class="flex items-center gap-3 pb-4 border-b border-surface-900">
          <div class="p-2 bg-primary-500/10 rounded-xl text-primary-400">
            <Check class="w-5 h-5" />
          </div>
          <h3 class="text-xs font-black text-white uppercase tracking-widest">Estado de Perfil</h3>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Identificador</span>
            <span class="text-[10px] font-bold text-white font-mono bg-surface-950 px-2 py-0.5 rounded border border-surface-900">{schoolData?.id.split('-')[0]}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Actualizado</span>
            <span class="text-[10px] font-bold text-white uppercase tracking-widest">Hoy</span>
          </div>
        </div>
      </div>

      <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5 space-y-4">
        <h3 class="text-xs font-black text-primary-400 uppercase tracking-widest">Nota Maestro</h3>
        <p class="text-xs text-surface-400 leading-relaxed font-bold">
          Mantener la información de contacto actualizada ayuda a que los reportes PDF automáticos se generen con el membrete correcto para cada centro.
        </p>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  /* School edit styles */
</style>