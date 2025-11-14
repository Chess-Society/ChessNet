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
    Building
  } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let schoolData = data.school;

  // Form data - SOLO campos que existen en la tabla colleges de Supabase
  let formData = {
    name: schoolData?.name || '',
    city: schoolData?.city || '',
    country: schoolData?.country || 'ES',
    address: schoolData?.address || '',
    phone: schoolData?.phone || '',
    email: schoolData?.email || '',
    website: schoolData?.website || ''
  };

  // Form state
  let isSubmitting = false;
  let errors: Record<string, string> = {};

  onMount(() => {
    console.log('✏️ Edit school page loaded:', schoolData?.name);
  });

  const handleGoBack = () => {
    goto(`/schools/${schoolData.id}`);
  };

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre del centro es obligatorio';
    }

    if (!formData.city.trim()) {
      errors.city = 'La ciudad es obligatoria';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no tiene un formato válido';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      errors.website = 'La web debe empezar con http:// o https://';
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      isSubmitting = true;

      console.log('💾 Updating school:', formData);
      
      const response = await fetch(`/api/schools/${schoolData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el centro');
      }
      
      console.log('✅ School updated successfully');
      goto(`/schools/${schoolData.id}`);
    } catch (error) {
      console.error('Error updating school:', error);
      alert(error instanceof Error ? error.message : 'Error al actualizar el centro');
    } finally {
      isSubmitting = false;
    }
  };
</script>

<svelte:head>
  <title>Editar Centro - {schoolData?.name || 'Centro'} | ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900 text-white">
  <!-- Header -->
  <div class="bg-slate-800 border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-4">
          <button
            on:click={handleGoBack}
            class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>Volver</span>
          </button>
          
          <div class="h-6 w-px bg-slate-600"></div>
          
          <div class="flex items-center space-x-3">
            <School class="w-6 h-6 text-blue-400" />
            <div>
              <h1 class="text-xl font-semibold">Editar Centro</h1>
              <p class="text-sm text-slate-400">Actualizar información del centro</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <button
            on:click={handleGoBack}
            class="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            <X class="w-4 h-4 mr-2 inline" />
            Cancelar
          </button>
          
          <button
            on:click={handleSubmit}
            disabled={isSubmitting}
            class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save class="w-4 h-4" />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h2 class="text-xl font-semibold mb-6 flex items-center">
        <Building class="w-5 h-5 mr-2 text-blue-400" />
        Información del Centro
      </h2>
      
      <div class="space-y-6">
        <!-- Nombre del centro -->
        <div>
          <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
            Nombre del Centro *
          </label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            class={`input w-full ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Ej: Escuela de Ajedrez Madrid Centro"
          />
          {#if errors.name}
            <p class="text-red-400 text-sm mt-1">{errors.name}</p>
          {/if}
        </div>

        <!-- Ciudad y País -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="city" class="block text-sm font-medium text-slate-300 mb-2">
              Ciudad *
            </label>
            <input
              id="city"
              type="text"
              bind:value={formData.city}
              class={`input w-full ${errors.city ? 'border-red-500' : ''}`}
              placeholder="Ej: Madrid"
            />
            {#if errors.city}
              <p class="text-red-400 text-sm mt-1">{errors.city}</p>
            {/if}
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-slate-300 mb-2">
              País
            </label>
            <select
              id="country"
              bind:value={formData.country}
              class="input w-full"
            >
              <option value="ES">España</option>
              <option value="FR">Francia</option>
              <option value="IT">Italia</option>
              <option value="PT">Portugal</option>
              <option value="DE">Alemania</option>
              <option value="GB">Reino Unido</option>
              <option value="US">Estados Unidos</option>
              <option value="MX">México</option>
              <option value="AR">Argentina</option>
              <option value="CO">Colombia</option>
            </select>
          </div>
        </div>

        <!-- Dirección -->
        <div>
          <label for="address" class="block text-sm font-medium text-slate-300 mb-2">
            <MapPin class="w-4 h-4 inline mr-1" />
            Dirección
          </label>
          <input
            id="address"
            type="text"
            bind:value={formData.address}
            class="input w-full"
            placeholder="Calle, número, piso, código postal"
          />
        </div>

        <!-- Contacto -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="phone" class="block text-sm font-medium text-slate-300 mb-2">
              <Phone class="w-4 h-4 inline mr-1" />
              Teléfono
            </label>
            <input
              id="phone"
              type="tel"
              bind:value={formData.phone}
              class="input w-full"
              placeholder="Ej: +34 91 123 45 67"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
              <Mail class="w-4 h-4 inline mr-1" />
              Email
            </label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              class={`input w-full ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Ej: info@centro.com"
            />
            {#if errors.email}
              <p class="text-red-400 text-sm mt-1">{errors.email}</p>
            {/if}
          </div>
        </div>

        <!-- Sitio web -->
        <div>
          <label for="website" class="block text-sm font-medium text-slate-300 mb-2">
            <Globe class="w-4 h-4 inline mr-1" />
            Sitio Web
          </label>
          <input
            id="website"
            type="url"
            bind:value={formData.website}
            class={`input w-full ${errors.website ? 'border-red-500' : ''}`}
            placeholder="https://www.tu-centro.com"
          />
          {#if errors.website}
            <p class="text-red-400 text-sm mt-1">{errors.website}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .input {
    @apply w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors;
  }
</style>