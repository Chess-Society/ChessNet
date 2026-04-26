<script lang="ts">
  import { t, locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    Trophy,
    FloppyDisk,
    Calendar,
    Clock,
    Users,
    MapPin,
    Target,
    FileText,
    Warning,
    WarningCircle,
    CheckCircle,
    Gear,
    Trash,
    ArrowCounterClockwise,
    Info,
    Layout,
    Pulse,
    ArrowsClockwise,
    UsersThree,
    Check,
    ArrowLeft,
    X,
    ArrowArcLeft,
    Buildings,
    EnvelopeSimple,
    Plus,
    Sparkle
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, slide, fly, scale } from 'svelte/transition';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { tournamentSchema } from '$lib/schemas/tournament';
  import { toast } from 'svelte-french-toast';
  
  let { data }: { data: PageData } = $props();

  const { form, errors, enhance, delayed, message, tainted } = superForm(data.form as any, {
    validators: zodClient(tournamentSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success($t('tournaments.updates.success') || 'Tournament updated successfully');
        goto(`/panel/tournaments/${data.tournamentId}`);
      } else if (form.message?.error) {
        toast.error(form.message.error);
      }
    }
  }) as any;

  let showDeleteConfirm = $state(false);
  let showResetConfirm = $state(false);

  let newDirectorEmail = $state('');
  let isResolvingEmail = $state(false);

  let schools = $derived((data.schools as any[]) || []);

  const addDirector = async () => {
    if (!newDirectorEmail) return;
    try {
      isResolvingEmail = true;
      const res = await fetch(`/api/users/resolve-email?email=${encodeURIComponent(newDirectorEmail)}`);
      if (!res.ok) throw new Error('Usuario no encontrado o error de servidor');
      const user = await res.json();
      
      if ($form.sharedWith.includes(user.uid)) {
        toast.error('Este director ya tiene acceso');
      } else {
        $form.sharedWith = [...$form.sharedWith, user.uid];
        newDirectorEmail = '';
        toast.success('Director añadido correctamente');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      isResolvingEmail = false;
    }
  };

  const removeDirector = (uid: string) => {
    $form.sharedWith = $form.sharedWith.filter(id => id !== uid);
    toast.success('Acceso revocado');
  };

  const getFormatLabel = (f: string) => {
    switch(f) {
      case 'swiss': return $t('tournaments.format_swiss');
      case 'round_robin': return $t('tournaments.format_round_robin');
      case 'knockout': return $t('tournaments.format_elimination');
      default: return f;
    }
  };

  const statusColors: Record<string, string> = {
    draft: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    upcoming: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    ongoing: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    in_progress: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    canceled: 'bg-red-500/10 text-red-400 border-red-500/20'
  };
</script>

<svelte:head>
  <title>Edit | {$form.name || $t('tournaments.untitled')} - ChessNet</title>
</svelte:head>

<form method="POST" use:enhance class="min-h-screen bg-black">
  <!-- Premium Sticky Header -->
  <div class="sticky top-0 z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12">
    <div class="max-w-[1400px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-6">
        <button 
          type="button"
          onclick={() => goto(`/panel/tournaments/${data.tournamentId}`)}
          class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all active:scale-95 group"
        >
          <ArrowLeft weight="bold" class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <div class="flex items-center gap-3">
              <h1 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('tournaments.manage_title')}</h1>
              <span class="px-2 py-0.5 rounded-none text-[8px] font-black uppercase border {(statusColors as any)[$form.status]}">
                {$t(`tournaments.status_${$form.status}`)}
              </span>
          </div>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{$form.name || $t('tournaments.untitled')}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        {#if $tainted}
          <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest animate-pulse mr-4 hidden md:block">
            {$t('common.unsaved_changes') || 'CAMBIOS SIN GUARDAR'}
          </span>
        {/if}

        <button 
          type="button"
          onclick={() => goto(`/panel/tournaments/${data.tournamentId}`)}
          class="hidden md:flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-none text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          <X weight="bold" class="w-4 h-4" />
          {$t('common.cancel')}
        </button>
        <button 
          type="submit"
          disabled={$delayed}
          class="flex items-center gap-3 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-none text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/20 active:scale-95 disabled:opacity-50 group"
        >
          {#if $delayed}
            <ArrowsClockwise weight="bold" class="w-4 h-4 animate-spin" />
          {:else}
            <FloppyDisk weight="bold" class="w-4 h-4 group-hover:scale-110 transition-transform" />
          {/if}
          {$t('common.save')}
        </button>
      </div>
    </div>
  </div>

  <div class="max-w-[1400px] mx-auto px-6 md:px-12 py-12" in:fade={{ duration: 300 }}>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <!-- Left: Form Sections (8 Columns) -->
      <div class="lg:col-span-8 space-y-10">
        
        <!-- Section: Identity Info -->
        <section class="bento-card !p-10 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100"></div>
          
          <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
            <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
              <Trophy weight="duotone" class="w-8 h-8" />
            </div>
            <div>
                <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.identity_info')}</h3>
                <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.identity_desc')}</p>
            </div>
          </div>

          <div class="space-y-10 relative z-10">
            <div class="space-y-3">
              <label for="name" class="glass-label">{$t('tournaments.form.name')} <span class="text-violet-500">*</span></label>
              <div class="relative group">
                 <Trophy weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                 <input 
                  id="name"
                  name="name"
                  type="text" 
                  bind:value={$form.name}
                  class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
                  placeholder={$t('tournaments.form.name_placeholder')}
                />
              </div>
              {#if $errors.name}<p class="text-red-500 text-[10px] font-bold uppercase mt-1">{$errors.name}</p>{/if}
            </div>

            <!-- School Context Selection -->
            <div class="space-y-6">
               <div class="flex items-center gap-3">
                  <Buildings weight="duotone" class="w-5 h-5 text-zinc-400" />
                  <span class="glass-label !ml-0">
                    {$t('classes.school_label')}
                  </span>
               </div>
              
              <input type="hidden" name="schoolId" bind:value={$form.schoolId} />
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each schools as school}
                  <button
                    type="button"
                    onclick={() => $form.schoolId = school.id}
                    class="selection-card {$form.schoolId === school.id ? 'active' : ''}"
                  >
                    <div class="card-icon">
                      <Buildings weight={$form.schoolId === school.id ? "fill" : "duotone"} />
                    </div>
                    <div class="card-content">
                      <span class="card-title">{school.name}</span>
                      <p class="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">{school.city}</p>
                    </div>
                    {#if $form.schoolId === school.id}
                      <div class="card-check" in:scale>
                        <Check size={14} weight="bold" />
                      </div>
                    {/if}
                  </button>
                {/each}

                <button
                  type="button"
                  onclick={() => $form.schoolId = ''}
                  class="selection-card {$form.schoolId === '' ? 'active' : ''}"
                >
                  <div class="card-icon">
                    <Sparkle weight={$form.schoolId === '' ? "fill" : "duotone"} />
                  </div>
                  <div class="card-content">
                    <span class="card-title">{$t('classes.independent')}</span>
                    <p class="text-[9px] font-bold opacity-30 uppercase tracking-widest mt-1">{$t('common.verified')}</p>
                  </div>
                  {#if $form.schoolId === ''}
                    <div class="card-check" in:scale>
                      <Check size={14} weight="bold" />
                    </div>
                  {/if}
                </button>
              </div>
            </div>

            <div class="space-y-3">
              <label for="description" class="glass-label">{$t('common.description')}</label>
              <textarea 
                id="description"
                name="description"
                bind:value={$form.description}
                rows="3"
                class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50"
                placeholder={$t('tournaments.form.notes_placeholder')}
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-4">
                <span class="glass-label mb-2 block">{$t('tournaments.game_system')}</span>
                <input type="hidden" name="format" bind:value={$form.format} />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {#each [
                    { id: 'swiss', icon: UsersThree, label: 'tournaments.type_swiss' },
                    { id: 'round_robin', icon: ArrowsClockwise, label: 'tournaments.type_round_robin' },
                    { id: 'knockout', icon: Trophy, label: 'tournaments.type_knockout' }
                  ] as formatItem}
                    <button
                      type="button"
                      onclick={() => $form.format = formatItem.id as any}
                      class="selection-card small {$form.format === formatItem.id ? 'active' : ''}"
                    >
                      <div class="card-icon">
                        <formatItem.icon weight={$form.format === formatItem.id ? "fill" : "duotone"} />
                      </div>
                      <div class="card-content">
                        <span class="card-title">{$t(formatItem.label)}</span>
                      </div>
                      {#if $form.format === formatItem.id}
                        <div class="card-check" in:scale>
                          <Check size={12} weight="bold" />
                        </div>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
              <div class="space-y-3">
                <label for="timeControl" class="glass-label">{$t('tournaments.time_control')}</label>
                <div class="relative group">
                    <Clock weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                    <input 
                      id="timeControl"
                      name="timeControl"
                      type="text" 
                      bind:value={$form.timeControl}
                      class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
                      placeholder="10+5"
                    />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Section: Logistics & Config -->
        <section class="bento-card !p-10 relative overflow-hidden group">
          <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
            <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
              <MapPin weight="duotone" class="w-8 h-8" />
            </div>
            <div>
                <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.logistics_details')}</h3>
                <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.logistics_desc')}</p>
            </div>
          </div>

          <div class="space-y-10 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-3">
                <label for="maxPlayers" class="glass-label">{$t('tournaments.max_capacity')}</label>
                <input id="maxPlayers" name="maxPlayers" type="number" bind:value={$form.maxPlayers} class="glass-input w-full px-6 bg-zinc-950/50 font-bold" />
              </div>
              <div class="space-y-3">
                <label for="entryFee" class="glass-label">{$t('tournaments.entry_fee_label')}</label>
                <div class="relative">
                  <input id="entryFee" name="entryFee" type="number" bind:value={$form.entryFee} class="glass-input w-full px-6 bg-zinc-950/50 text-violet-400 font-bold" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black">€</span>
                </div>
              </div>
              <div class="space-y-3">
                <label for="prizePool" class="glass-label">{$t('tournaments.prize_pool_label')}</label>
                <div class="relative">
                  <input id="prizePool" name="prizePool" type="number" bind:value={$form.prizePool} class="glass-input w-full px-6 bg-zinc-950/50 text-violet-400 font-black" />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black">€</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div class="space-y-3">
                <label for="location" class="glass-label">{$t('tournaments.location_platform')}</label>
                <div class="relative group">
                    <MapPin weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                    <input id="location" name="location" type="text" bind:value={$form.location} class="glass-input pl-16 w-full bg-zinc-950/50" />
                </div>
              </div>
              <div class="space-y-3">
                <label for="organizer" class="glass-label">{$t('tournaments.organizing_entity')}</label>
                <div class="relative group">
                    <Buildings weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                    <input id="organizer" name="organizer" type="text" bind:value={$form.organizer} class="glass-input pl-16 w-full bg-zinc-950/50" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
              <div class="space-y-2">
                <label for="startAt" class="glass-label">{$t('tournaments.start')}</label>
                <input id="startAt" name="startAt" type="datetime-local" bind:value={$form.startAt} class="glass-input w-full px-4 text-xs [color-scheme:dark] bg-zinc-950/50" />
                {#if $errors.startAt}<p class="text-red-500 text-[10px] font-bold uppercase mt-1">{$errors.startAt}</p>{/if}
              </div>
              <div class="space-y-2">
                <label for="endAt" class="glass-label">{$t('tournaments.status_completed')}</label>
                <input id="endAt" name="endAt" type="datetime-local" bind:value={$form.endAt} class="glass-input w-full px-4 text-xs [color-scheme:dark] bg-zinc-950/50" />
              </div>
              <div class="space-y-2">
                <label for="registrationDeadline" class="glass-label">{$t('tournaments.registration_deadline')}</label>
                <input id="registrationDeadline" name="registrationDeadline" type="datetime-local" bind:value={$form.registrationDeadline} class="glass-input w-full px-4 text-xs text-violet-400 [color-scheme:dark] bg-zinc-950/50" />
              </div>
            </div>
          </div>
        </section>

        <!-- Section: Director Access (Sharing) -->
        <section class="bento-card !p-10 relative overflow-hidden group border-violet-500/10">
          <div class="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-100"></div>
          
          <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
            <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
              <Users weight="duotone" class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">Acceso Directores</h3>
              <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Comparte este torneo con directores de clubes</p>
            </div>
          </div>

          <div class="space-y-8 relative z-10">
            <div class="space-y-4">
              <p class="text-xs text-zinc-400 font-jakarta leading-relaxed">
                Introduce el email del director para permitirle ver este torneo y sus resultados. Solo podrá ver los datos creados por ti.
              </p>
              
              <div class="flex gap-3">
                <div class="relative flex-1 group">
                  <EnvelopeSimple weight="bold" class="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    placeholder="email@del-director.com"
                    bind:value={newDirectorEmail}
                    class="glass-input pl-16 pr-8 w-full focus:ring-violet-500/20 focus:border-violet-500 bg-zinc-950/50"
                    onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addDirector())}
                  />
                </div>
                <button 
                  type="button"
                  onclick={addDirector}
                  disabled={!newDirectorEmail || isResolvingEmail}
                  class="px-8 bg-violet-600 hover:bg-violet-500 text-white font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {isResolvingEmail ? '...' : 'Añadir'}
                </button>
              </div>
            </div>

            <input type="hidden" name="sharedWith" value={JSON.stringify($form.sharedWith)} />

            {#if $form.sharedWith && $form.sharedWith.length > 0}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each $form.sharedWith as uid}
                  <div class="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-none group/item">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-violet-500/20 flex items-center justify-center text-violet-400 font-black text-[10px]">
                        {uid.substring(0, 2).toUpperCase()}
                      </div>
                      <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-widest truncate max-w-[120px]">{uid}</span>
                    </div>
                    <button 
                      type="button"
                      onclick={() => removeDirector(uid)}
                      class="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <X weight="bold" size={14} />
                    </button>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="p-8 border border-dashed border-white/5 text-center">
                <p class="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic">No se ha compartido con ningún director</p>
              </div>
            {/if}
          </div>
        </section>

        <!-- Rules and Documentation -->
        <section class="bento-card !p-10 relative overflow-hidden group">
          <div class="flex items-center gap-5 mb-10 relative z-10 border-b border-white/5 pb-8">
            <div class="w-14 h-14 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
              <FileText weight="duotone" class="w-8 h-8" />
            </div>
            <div>
                <h3 class="text-2xl font-outfit font-black text-white uppercase italic tracking-tight">{$t('tournaments.documentation')}</h3>
                <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{$t('tournaments.doc_desc')}</p>
            </div>
          </div>

          <div class="space-y-10 relative z-10">
            <div class="space-y-3">
              <label for="rules" class="glass-label">{$t('tournaments.rules')}</label>
              <textarea 
                id="rules"
                name="rules"
                bind:value={$form.rules}
                rows="5"
                class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50 focus:ring-violet-500/20 focus:border-violet-500"
                placeholder={$t('tournaments.rules_placeholder')}
              ></textarea>
            </div>
            <div class="space-y-3">
              <label for="notes" class="glass-label">{$t('tournaments.staff_notes')}</label>
              <textarea 
                id="notes"
                name="notes"
                bind:value={$form.notes}
                rows="2"
                class="glass-input w-full px-6 py-5 resize-none bg-zinc-950/50 focus:ring-violet-500/20 focus:border-violet-500 opacity-70"
                placeholder={$t('tournaments.staff_notes_placeholder')}
              ></textarea>
            </div>
          </div>
        </section>

        <!-- Danger Zone -->
        <section class="bento-card !p-10 bg-red-500/5 border-red-500/20 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[80px] rounded-none -mr-16 -mt-16 group-hover:bg-red-500/10 transition-all duration-700"></div>
          <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div class="text-center md:text-left">
              <h3 class="text-xl font-outfit font-black text-red-100 uppercase italic tracking-wider mb-2">{$t('tournaments.danger_zone')}</h3>
              <p class="text-red-400/60 text-[10px] font-black uppercase tracking-widest">{$t('tournaments.danger_zone_desc')}</p>
            </div>
            <div class="flex items-center gap-4">
              <button 
                type="button"
                onclick={() => showResetConfirm = true}
                class="h-12 px-6 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
              >
                {$t('tournaments.reset_tournament')}
              </button>
              <button 
                type="button"
                onclick={() => showDeleteConfirm = true}
                class="h-12 px-6 rounded-none bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95"
              >
                {$t('common.delete')}
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Right: Sticky Sidebar (4 Columns) -->
      <div class="lg:col-span-4">
        <div class="sticky top-32 space-y-8">
          
          <!-- Premium Preview Card -->
          <div class="bento-card !p-8 overflow-hidden relative group">
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 rounded-none blur-3xl"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-8">
                <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-4 py-2 rounded-none border border-zinc-800 shadow-inner">
                  {$t('tournaments.live_preview')}
                </span>
                <div class="w-12 h-12 bg-violet-600/20 border border-violet-500/30 rounded-none flex items-center justify-center text-violet-400 shadow-xl shadow-violet-500/10">
                  <Trophy weight="duotone" class="w-6 h-6" />
                </div>
              </div>

              <div class="space-y-6">
                <div class="bg-zinc-950/50 p-6 rounded-none border border-zinc-800/50 shadow-inner">
                  <p class="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">{$t('tournaments.preview_tournament')}</p>
                  <h4 class="text-2xl font-outfit font-black text-white leading-tight uppercase truncate tracking-tighter italic">
                    {$form.name || $t('tournaments.untitled')}
                  </h4>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                    <div class="flex items-center gap-3">
                      <Calendar weight="duotone" class="w-5 h-5 text-zinc-600" />
                      <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('common.date')}</span>
                    </div>
                    <span class="text-[10px] font-bold text-white uppercase">{$form.startAt ? new Date($form.startAt).toLocaleDateString() : 'TBD'}</span>
                  </div>
                  <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                    <div class="flex items-center gap-3">
                      <Target weight="duotone" class="w-5 h-5 text-zinc-600" />
                      <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.game_system')}</span>
                    </div>
                    <span class="text-[10px] font-bold text-violet-400 uppercase">{getFormatLabel($form.format)}</span>
                  </div>
                  <div class="flex items-center justify-between p-4 bg-zinc-950/20 border border-zinc-800/40 rounded-none">
                    <div class="flex items-center gap-3">
                      <Clock weight="duotone" class="w-5 h-5 text-zinc-600" />
                      <span class="text-[10px] font-black text-zinc-500 uppercase">{$t('tournaments.time_control')}</span>
                    </div>
                    <span class="text-[10px] font-bold text-white uppercase">{$form.timeControl}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Warning Panel -->
          <div class="bento-card !p-8 relative overflow-hidden bg-violet-600/5 border-violet-500/20">
            <div class="flex gap-4 items-start">
               <WarningCircle weight="duotone" class="w-6 h-6 text-violet-400 shrink-0 mt-0.5" />
               <p class="text-[11px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                 {$t('tournaments.edit_warning')}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</form>

<!-- Delete confirmation modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-3xl" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-10 rounded-none max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden" in:fly={{ y: 40, duration: 400 }}>
      <div class="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
      <div class="w-20 h-20 rounded-none bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
        <Trash weight="bold" size={40} />
      </div>
      <div class="text-center space-y-3">
        <h3 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('tournaments.delete_permanently_title')}</h3>
        <p class="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">{$t('tournaments.delete_permanently_desc')}</p>
      </div>
      <div class="flex flex-col gap-3">
        <form action="?/delete" method="POST">
            <button 
              type="submit"
              class="w-full h-14 rounded-none bg-red-600 text-white font-black uppercase text-[11px] tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-500/40 active:scale-95"
            >
              {$t('tournaments.delete_now')}
            </button>
        </form>
        <button 
          type="button"
          onclick={() => showDeleteConfirm = false}
          class="h-14 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[11px] tracking-widest hover:text-white transition-all active:scale-95"
        >
          {$t('common.cancel')}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Reset confirmation modal -->
{#if showResetConfirm}
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-3xl" transition:fade>
    <div class="bg-zinc-900 border border-zinc-800 p-10 rounded-none max-w-md w-full shadow-2xl space-y-8 relative overflow-hidden" in:fly={{ y: 40, duration: 400 }}>
      <div class="absolute top-0 left-0 w-full h-1 bg-violet-600"></div>
      <div class="w-20 h-20 rounded-none bg-violet-500/10 flex items-center justify-center text-violet-500 mx-auto">
        <ArrowCounterClockwise weight="bold" size={40} />
      </div>
      <div class="text-center space-y-3">
        <h3 class="text-3xl font-outfit font-black text-white uppercase italic tracking-tighter">{$t('tournaments.reset_structure_title')}</h3>
        <p class="text-zinc-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed">{$t('tournaments.reset_structure_desc')}</p>
      </div>
      <div class="flex flex-col gap-3">
        <button 
          type="button"
          onclick={() => {
            $form.status = 'upcoming';
            showResetConfirm = false;
            toast.success('Estado del torneo reiniciado. Guarda los cambios para aplicar.');
          }}
          class="h-14 rounded-none bg-violet-600 text-white font-black uppercase text-[11px] tracking-widest hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/40 active:scale-95"
        >
          {$t('common.reset')}
        </button>
        <button 
          type="button"
          onclick={() => showResetConfirm = false}
          class="h-14 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[11px] tracking-widest hover:text-white transition-all active:scale-95"
        >
          {$t('common.cancel')}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 0px;
  }

  .selection-card {
    @apply relative p-6 bg-zinc-900/50 border border-zinc-800 transition-all text-left flex items-center gap-5 hover:border-violet-500/30 hover:bg-zinc-800/50;
  }

  .selection-card.active {
    @apply border-violet-500 bg-violet-500/10;
  }

  .selection-card.small {
    @apply p-4 gap-3;
  }

  .card-icon {
    @apply w-10 h-10 bg-zinc-950 flex items-center justify-center text-zinc-600 transition-colors shrink-0;
  }

  .active .card-icon {
    @apply text-violet-400 bg-violet-500/20;
  }

  .card-title {
    @apply text-[10px] font-black uppercase tracking-widest text-zinc-400;
  }

  .active .card-title {
    @apply text-white;
  }

  .card-check {
    @apply absolute top-3 right-3 text-violet-500;
  }

  .glass-input {
    @apply h-14 bg-zinc-900/50 border border-zinc-800 rounded-none text-white text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500;
  }

  .glass-label {
    @apply text-[10px] font-black text-zinc-500 uppercase tracking-widest;
  }

  .bento-card {
    @apply bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-none p-6 hover:border-white/10 transition-all;
  }
</style>
