<script lang="ts">
  import { onMount } from 'svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { 
    Trophy, 
    Plus, 
    ArrowLeft,
    Settings
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import { t } from '$lib/i18n';

  export let data: PageData;

  let isLoading = false; // Simplificado - no hay carga de datos

  onMount(() => {
  });

  function goBack() {
    invalidateAll().then(() => {
      goto(`/panel/schools/${data.schoolId}`);
    });
  }

</script>

<svelte:head>
  <title>{$t('tournaments.school_tournaments_title')} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
  <!-- Header -->
  <header class="bg-slate-800 border-b border-slate-700">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button 
            on:click={goBack}
            class="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex items-center space-x-3">
            <Trophy class="w-6 h-6 text-primary-500" />
            <div>
              <h1 class="text-xl font-bold text-white">{$t('tournaments.hub_title')}</h1>
              <p class="text-sm text-slate-400">{$t('tournaments.school_id')}: {data.schoolId}</p>
            </div>
          </div>
        </div>
        
        <button class="btn-primary">
          <Plus class="w-4 h-4 mr-2" />
          {$t('tournaments.new_tournament_btn')}
        </button>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <!-- Status message -->
    <div class="mb-8">
      <div class="bg-slate-800 rounded-none p-6 border border-slate-700">
        <div class="flex items-center space-x-3 mb-4">
          <div class="p-2 bg-blue-500/20 rounded-none">
            <Settings class="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 class="text-lg font-semibold">{$t('tournaments.module_configuring')}</h3>
            <p class="text-slate-400">{$t('tournaments.module_configuring_subtitle')}</p>
          </div>
        </div>
        <p class="text-slate-300 mb-4">
          {$t('tournaments.module_description')}
        </p>
        <div class="flex space-x-3">
          <button class="btn-primary">
            <Plus class="w-4 h-4 mr-2" />
            {$t('tournaments.create_first_tournament')}
          </button>
          <button class="btn-secondary">
            <Trophy class="w-4 h-4 mr-2" />
            {$t('tournaments.view_docs')}
          </button>
        </div>
      </div>
    </div>

    <!-- Features preview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card hover:bg-slate-700 transition-colors">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-primary-500/20 rounded-none">
            <Trophy class="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 class="font-semibold">{$t('tournaments.swiss_tournaments')}</h3>
            <p class="text-sm text-slate-400">{$t('tournaments.auto_pairing')}</p>
          </div>
        </div>
      </div>

      <div class="card hover:bg-slate-700 transition-colors">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-green-500/20 rounded-none">
            <Plus class="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 class="font-semibold">{$t('tournaments.elimination_tournaments')}</h3>
            <p class="text-sm text-slate-400">{$t('tournaments.direct_competitions')}</p>
          </div>
        </div>
      </div>

      <div class="card hover:bg-slate-700 transition-colors">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-yellow-500/20 rounded-none">
            <Settings class="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h3 class="font-semibold">{$t('tournaments.team_tournaments')}</h3>
            <p class="text-sm text-slate-400">{$t('tournaments.group_competitions')}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success message -->
    <div class="mt-8">
      <div class="bg-green-900/20 border border-green-500/30 rounded-none p-4">
        <div class="flex items-center">
          <div class="w-2 h-2 bg-green-500 rounded-none mr-3"></div>
          <p class="text-green-300 text-sm">
            ✅ {$t('tournaments.module_active')}
          </p>
        </div>
      </div>
    </div>
  </main>
</div>


