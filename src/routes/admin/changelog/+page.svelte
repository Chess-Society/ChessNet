<script lang="ts">
  import { untrack } from 'svelte';
  import { superForm } from 'sveltekit-superforms';
  import { zod4 as zod } from 'sveltekit-superforms/adapters';
  import { changelogEntrySchema } from '$lib/schemas/changelog';
  import { fade, slide } from 'svelte/transition';
  import { 
    Plus, 
    Trash, 
    RocketLaunch, 
    Sparkle, 
    Trophy, 
    ChartLineUp, 
    Star, 
    ShieldCheck, 
    Users, 
    Buildings,
    FloppyDisk,
    Calendar,
    Tag,
    Palette
  } from 'phosphor-svelte';
  import { toast } from '$lib/stores/toast';

  let { data } = $props();

  const { form, errors, enhance, delayed } = superForm(untrack(() => data.form) as any, {
    validators: zod(changelogEntrySchema),
    dataType: 'json',
    onUpdated({ form }) {
      if (form.valid) {
        toast.success('Changelog publicado correctamente');
      }
    }
  });

  const icons = [
    { name: 'RocketLaunch', icon: RocketLaunch },
    { name: 'Sparkle', icon: Sparkle },
    { name: 'Trophy', icon: Trophy },
    { name: 'ChartLineUp', icon: ChartLineUp },
    { name: 'Star', icon: Star },
    { name: 'ShieldCheck', icon: ShieldCheck },
    { name: 'Users', icon: Users },
    { name: 'Buildings', icon: Buildings }
  ];

  const colors = [
    { label: 'Violeta', color: 'text-violet-400', bgColor: 'bg-violet-500/10' },
    { label: 'Esmeralda', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { label: 'Azul', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { label: 'Ámbar', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { label: 'Rojo', color: 'text-red-400', bgColor: 'bg-red-500/10' }
  ];

  function addItem() {
    $form.items = [...$form.items, { title: '', description: '', icon: 'Sparkle' }];
  }

  function removeItem(index: number) {
    $form.items = $form.items.filter((_: any, i: number) => i !== index);
  }

</script>

<div class="space-y-12 pb-32" in:fade>
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-black font-display uppercase italic tracking-tighter text-white">Gestión de Changelog</h1>
      <p class="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-2">Publica actualizaciones para todos los usuarios</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
    <!-- Form -->
    <div class="space-y-8">
      <div class="bg-white/[0.02] border border-white/5 p-8 space-y-8">
        <h2 class="text-xs font-mono font-black text-primary-500 uppercase tracking-[0.3em]">Nueva Entrada</h2>
        
        <form method="POST" action="?/create" use:enhance class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="version" class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> Versión
              </label>
              <input 
                id="version"
                bind:value={$form.version}
                placeholder="ej. 0.15.0 Beta"
                class="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-primary-500 outline-none transition-all"
              />
              {#if $errors.version}<p class="text-[10px] text-red-500 uppercase font-black">{$errors.version}</p>{/if}
            </div>

            <div class="space-y-2">
              <label for="date" class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> Fecha
              </label>
              <input 
                id="date"
                type="date"
                bind:value={$form.date}
                class="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-primary-500 outline-none transition-all"
              />
              {#if $errors.date}<p class="text-[10px] text-red-500 uppercase font-black">{$errors.date}</p>{/if}
            </div>
          </div>

          <div class="space-y-2">
            <label for="main-title" class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Título de la Actualización</label>
            <input 
              id="main-title"
              bind:value={$form.title}
              placeholder="ej. Misiones y UX Premium"
              class="w-full bg-black border border-white/10 p-3 text-xs font-mono text-white focus:border-primary-500 outline-none transition-all"
            />
            {#if $errors.title}<p class="text-[10px] text-red-500 uppercase font-black">{$errors.title}</p>{/if}
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <span class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <RocketLaunch size={12} /> Icono Principal
              </span>
              <div class="grid grid-cols-4 gap-2">
                {#each icons as { name, icon: Icon }}
                  <button 
                    type="button"
                    onclick={() => $form.icon = name}
                    class="aspect-square flex items-center justify-center border transition-all {$form.icon === name ? 'bg-primary-500 border-primary-500 text-black' : 'bg-black border-white/10 text-white hover:border-white/30'}"
                  >
                    <Icon size={18} weight="duotone" />
                  </button>
                {/each}
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Palette size={12} /> Estilo Visual
              </label>
              <div class="grid grid-cols-1 gap-2">
                {#each colors as style}
                  <button 
                    type="button"
                    onclick={() => { $form.color = style.color; $form.bgColor = style.bgColor; }}
                    class="flex items-center gap-3 p-2 border transition-all {($form.color === style.color) ? 'border-primary-500 bg-primary-500/10' : 'border-white/5 bg-black hover:border-white/20'}"
                  >
                    <div class="w-4 h-4 {style.bgColor} border border-white/10"></div>
                    <span class="text-[10px] font-mono font-black uppercase {style.color}">{style.label}</span>
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- Items -->
          <div class="space-y-4 pt-4 border-t border-white/5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Puntos de la Actualización</span>
              <button 
                type="button"
                onclick={addItem}
                class="text-[10px] font-mono font-black text-primary-500 hover:text-primary-400 uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={12} /> Añadir Punto
              </button>
            </div>

            <div class="space-y-4">
              {#each $form.items as item, i}
                <div class="bg-black border border-white/10 p-4 space-y-4 relative group" transition:slide>
                  <button 
                    type="button"
                    onclick={() => removeItem(i)}
                    class="absolute top-4 right-4 text-slate-700 hover:text-red-500 transition-colors"
                  >
                    <Trash size={14} />
                  </button>

                  <div class="grid grid-cols-[32px_1fr] gap-4">
                    <div class="space-y-2">
                       <button 
                        type="button"
                        class="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"
                       >
                         <Sparkle size={14} />
                       </button>
                    </div>
                    <div class="space-y-3">
                      <input 
                        bind:value={item.title}
                        placeholder="Título del punto"
                        class="w-full bg-transparent border-b border-white/10 pb-2 text-[11px] font-mono font-black text-white outline-none focus:border-primary-500 transition-all"
                      />
                      <textarea 
                        bind:value={item.description}
                        placeholder="Descripción detallada..."
                        class="w-full bg-transparent text-[10px] font-mono text-slate-500 outline-none min-h-[60px] resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
            {#if ($errors.items as any)?._errors}<p class="text-[10px] text-red-500 uppercase font-black">{($errors.items as any)._errors}</p>{/if}
          </div>

          <button 
            type="submit"
            disabled={$delayed}
            class="w-full h-14 bg-primary-500 text-black font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-primary-400 transition-all disabled:opacity-50"
          >
            {#if $delayed}
              <div class="w-4 h-4 border-2 border-black/20 border-t-black animate-spin"></div>
            {:else}
              <FloppyDisk weight="fill" size={18} />
              PUBLICAR_AHORA
            {/if}
          </button>
        </form>
      </div>
    </div>

    <!-- List -->
    <div class="space-y-8">
      <h2 class="text-xs font-mono font-black text-slate-500 uppercase tracking-[0.3em]">Entradas Publicadas</h2>
      
      <div class="space-y-4">
        {#each data.entries as entry}
          <div class="bg-white/[0.02] border border-white/5 p-6 flex items-center justify-between group transition-all hover:bg-white/[0.04]">
            <div class="flex items-center gap-6">
              <div class="w-12 h-12 {entry.bgColor} {entry.color} border border-current/20 flex items-center justify-center">
                <RocketLaunch size={24} weight="duotone" />
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <span class="text-[10px] font-mono font-black {entry.color} uppercase tracking-widest">{entry.version}</span>
                  <span class="text-[10px] font-mono font-black text-slate-700 uppercase tracking-widest">{entry.date}</span>
                </div>
                <h3 class="text-sm font-black text-white uppercase italic tracking-tight mt-1">{entry.title}</h3>
              </div>
            </div>
            
            <form method="POST" action="?/delete&id={entry.id}">
              <button 
                class="p-3 text-slate-700 hover:text-red-500 transition-colors"
                onclick={(e) => {
                  if (!confirm('¿Seguro que quieres borrar esta entrada?')) e.preventDefault();
                }}
              >
                <Trash size={18} />
              </button>
            </form>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
