<script lang="ts">
  import { superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';
  import { postSchema } from '$lib/schemas/post';
  import { untrack } from 'svelte';
  import { appStore } from '$lib/stores/appStore';
  import ChessBoard from '../ChessBoard.svelte';
  import { toast } from '$lib/stores/toast';
  import { fade, fly, slide } from 'svelte/transition';
  import { Plus, X, ChartLine, Target, Medal, Buildings, Image, Globe } from 'phosphor-svelte';
  import type { SocialPost } from '$lib/types/social';
  
  interface Props {
    form: any;
    post?: SocialPost | null;
    onComplete?: (() => void) | null;
  }

  let { form: serverForm, post = null, onComplete = null }: Props = $props();
  
  const { form, errors, enhance, submitting, reset } = superForm(serverForm as any, {
    validators: zod(postSchema as any),
    onUpdated({ form }) {
      if (form.valid) {
        toast.success(post ? 'Actualizado' : 'Publicado');
        if (onComplete) onComplete();
        if (!post) {
          isExpanded = false;
          reset();
        }
      }
    }
  }) as any;

  // untrack: captura inicial intencional — no debe reaccionar a cambios de `post` mientras se edita
  $effect(() => {
    if (post) {
      $form.id = post.id;
      $form.title = post.title || '';
      $form.content = post.content || '';
      $form.type = post.type || 'GAME_ANALYSIS';
      $form.fen = post.fen || '';
      $form.lichessUrl = post.lichessUrl || '';
      isExpanded = true;
    }
  });

  let isSubmitting = $derived($submitting);
  let showBoardPreview = $state(!!post?.fen);
  let isExpanded = $state(!!post);

  const categories = [
    { id: 'GAME_ANALYSIS', label: 'ANÁLISIS', icon: ChartLine, color: 'text-blue-400' },
    { id: 'EXERCISE', label: 'EJERCICIO', icon: Target, color: 'text-emerald-400' },
    { id: 'ACHIEVEMENT', label: 'LOGRO', icon: Medal, color: 'text-amber-400' },
    { id: 'SCHOOL_UPDATE', label: 'ESCUELAS', icon: Buildings, color: 'text-violet-400' }
  ];

  const isValidFen = $derived((f: string | null | undefined) => {
    if (!f) return true;
    const parts = f.trim().split(' ');
    if (parts.length < 1) return false;
    // Basic regex for FEN board part
    return /^[pnbrqkPNBRQK1-8/]+$/.test(parts[0]);
  });
</script>

<div class="relative group">
  {#if !isExpanded}
    <button 
      onclick={() => isExpanded = true}
      class="w-full flex items-center gap-4 p-4 bg-zinc-950 border border-white/5 hover:border-violet-500/30 transition-all text-left"
      in:fade
    >
      <div class="w-10 h-10 bg-violet-600/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
        <Plus weight="bold" size={20} />
      </div>
      <span class="text-xs font-black text-zinc-600 uppercase tracking-widest italic">¿Qué tienes en mente para la comunidad?</span>
    </button>
  {:else}
    <form 
      method="POST"
      action={post ? '?/updatePost' : '?/addPost'}
      use:enhance
      class="pro-card p-6 border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
      transition:slide
    >
      <input type="hidden" name="id" bind:value={$form.id} />
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">{post ? 'Editar' : 'Nueva'} Publicación</h3>
        <button onclick={() => isExpanded = false} class="text-zinc-600 hover:text-white transition-colors" aria-label="Cerrar editor">
          <X size={16} weight="bold" />
        </button>
      </div>

      <div class="space-y-4">
        <input 
          type="text" 
          name="title"
          bind:value={$form.title}
          placeholder="Título (opcional)"
          aria-label="Título de la publicación"
          class="w-full bg-transparent border-b border-white/5 py-2 text-sm font-black text-white placeholder:text-zinc-700 outline-none focus:border-violet-500/50 transition-all"
        />
        {#if $errors.title}<p class="text-[8px] text-red-500 uppercase tracking-widest">{$errors.title}</p>{/if}

        <textarea 
          name="content"
          bind:value={$form.content}
          placeholder="Escribe tu reflexión, análisis o posición táctica..."
          aria-label="Contenido de la publicación"
          class="w-full bg-transparent text-xs text-zinc-300 placeholder:text-zinc-700 outline-none resize-none min-h-[120px] leading-relaxed font-medium"
        ></textarea>
        {#if $errors.content}<p class="text-[8px] text-red-500 uppercase tracking-widest">{$errors.content}</p>{/if}

        <div class="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
          <input type="hidden" name="type" bind:value={$form.type} />
          {#each categories as cat}
            <button 
              type="button"
              onclick={() => $form.type = cat.id as any}
              class="flex items-center gap-2 px-3 py-1.5 border transition-all text-[9px] font-black uppercase tracking-widest {$form.type === cat.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300'}"
            >
              <cat.icon size={12} weight="bold" class={$form.type === cat.id ? 'text-black' : cat.color} />
              {cat.label}
            </button>
          {/each}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex items-center gap-2 px-3 py-2 bg-zinc-950 border border-white/5">
              <Globe size={14} class="text-zinc-600" />
              <input 
                type="url" 
                name="lichessUrl"
                bind:value={$form.lichessUrl}
                placeholder="URL Lichess / Estudio"
                aria-label="Enlace de Lichess"
                class="bg-transparent text-[10px] text-zinc-400 outline-none w-full font-medium"
              />
            </div>
            {#if $errors.lichessUrl}<p class="text-[8px] text-red-500 uppercase tracking-widest">{$errors.lichessUrl}</p>{/if}
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2 px-3 py-2.5 bg-zinc-950 border {$form.fen && !isValidFen($form.fen) ? 'border-red-500/50' : 'border-white/5'} transition-colors">
              <Image size={14} class={$form.fen && !isValidFen($form.fen) ? 'text-red-500' : 'text-zinc-600'} />
              <input 
                type="text" 
                name="fen"
                bind:value={$form.fen}
                placeholder="Posición FEN (Opcional)"
                aria-label="Posición FEN"
                class="bg-transparent text-[10px] text-zinc-400 outline-none w-full font-mono"
              />
            </div>
            {#if $form.fen && !isValidFen($form.fen)}
              <p class="text-[8px] font-mono text-red-500 uppercase tracking-widest px-1">FEN_INVALID_FORMAT</p>
            {/if}
          </div>
        </div>

        {#if $form.fen && isValidFen($form.fen) && $form.fen.length > 10}
          <div class="flex flex-col items-center gap-4 p-6 bg-zinc-950 border border-white/5 pro-grid-bg" transition:fade>
             <div class="text-[8px] font-mono font-black text-violet-400 uppercase tracking-[0.4em] mb-2">Previsualización de Posición</div>
             <div class="relative group/board">
                <div class="absolute -inset-4 bg-violet-500/5 blur-xl opacity-0 group-hover/board:opacity-100 transition-opacity"></div>
                <ChessBoard position={$form.fen} interactive={false} size={240} showCoordinates={false} />
             </div>
          </div>
        {/if}

        <div class="flex justify-end gap-3 pt-4">
          <button 
            type="button"
            onclick={() => isExpanded = false}
            class="px-6 py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            class="px-8 py-3 bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-violet-500 transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            {isSubmitting ? '...' : (post ? 'Guardar' : 'Publicar')}
          </button>
        </div>
      </div>
    </form>
  {/if}
</div>
