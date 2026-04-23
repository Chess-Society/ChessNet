<script lang="ts">
  import { untrack } from 'svelte';
  import { appStore } from '$lib/stores/appStore';
  import ChessBoard from '../ChessBoard.svelte';
  import { toast } from '$lib/stores/toast';
  import { fade, fly, slide } from 'svelte/transition';
  import { Plus, X, ChartLine, Target, Medal, Buildings, Image, Globe } from 'phosphor-svelte';
  import type { SocialPost } from '$lib/types/social';
  
  interface Props {
    post?: SocialPost | null;
    onComplete?: (() => void) | null;
  }


  let { post = null, onComplete = null }: Props = $props();
  
  // untrack: captura inicial intencional — no debe reaccionar a cambios de `post` mientras se edita
  const initial = untrack(() => post ? $state.snapshot(post) : null);

  let title = $state(initial?.title || '');
  let content = $state(initial?.content || '');
  let type = $state(initial?.type || 'GAME_ANALYSIS');
  let fen = $state(initial?.fen || '');
  let lichessUrl = $state(initial?.lichessUrl || '');
  let isSubmitting = $state(false);
  let showBoardPreview = $state(!!initial?.fen);
  // untrack: inicialización intencional — se puede togglear manualmente después
  let isExpanded = $state(untrack(() => !!post));

  const handleSubmit = async () => {
    if (!content) {
      toast.error('El contenido es obligatorio');
      return;
    }

    isSubmitting = true;
    try {
      const postData = {
        title: title || 'Sin título',
        content,
        type,
        fen: fen.trim() || null,
        lichessUrl: lichessUrl.trim() || null,
      };

      const economy = $appStore.settings?.economy;
      const isPremium = $appStore.settings?.plan === 'premium' || economy?.battlePass?.isPremium;

      if (post) {
        await appStore.updatePost(post.id, {
          ...postData,
          metadata: {
            ...post.metadata,
            authorColor: economy?.activeColor || 'none',
            authorFrame: economy?.activeFrame || 'none',
            authorFont: economy?.activeFont || 'none',
            isPremium
          }
        });
        toast.success('Actualizado');
      } else {
        await appStore.addPost({
          ...postData,
          reactions: {},
          metadata: {
            authorColor: economy?.activeColor || 'none',
            authorFrame: economy?.activeFrame || 'none',
            authorFont: economy?.activeFont || 'none',
            isPremium
          }
        });
        toast.success('Publicado');
      }

      if (onComplete) onComplete();

      if (!post) {
        title = '';
        content = '';
        fen = '';
        lichessUrl = '';
        showBoardPreview = false;
        isExpanded = false;
      }
    } catch (error) {
      console.error('Error publishing Post:', error);
      toast.error('Error al procesar');
    } finally {
      isSubmitting = false;
    }
  };

  const categories = [
    { id: 'GAME_ANALYSIS', label: 'Análisis', icon: ChartLine, color: 'text-blue-400' },
    { id: 'EXERCISE', label: 'Ejercicio', icon: Target, color: 'text-emerald-400' },
    { id: 'ACHIEVEMENT', label: 'Logro', icon: Medal, color: 'text-amber-400' },
    { id: 'SCHOOL_UPDATE', label: 'Escuelas', icon: Buildings, color: 'text-violet-400' }
  ];
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
    <div 
      class="pro-card p-6 border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
      transition:slide
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-[10px] font-black text-violet-400 uppercase tracking-[0.3em]">{post ? 'Editar' : 'Nueva'} Publicación</h3>
        <button onclick={() => isExpanded = false} class="text-zinc-600 hover:text-white transition-colors" aria-label="Cerrar editor">
          <X size={16} weight="bold" />
        </button>
      </div>

      <div class="space-y-4">
        <input 
          type="text" 
          bind:value={title}
          placeholder="Título (opcional)"
          aria-label="Título de la publicación"
          class="w-full bg-transparent border-b border-white/5 py-2 text-sm font-black text-white placeholder:text-zinc-700 outline-none focus:border-violet-500/50 transition-all"
        />

        <textarea 
          bind:value={content}
          placeholder="Escribe tu reflexión o análisis aquí..."
          aria-label="Contenido de la publicación"
          class="w-full bg-transparent text-xs text-zinc-300 placeholder:text-zinc-700 outline-none resize-none min-h-[100px] leading-relaxed"
        ></textarea>

        <div class="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
          {#each categories as cat}
            <button 
              onclick={() => type = cat.id}
              class="flex items-center gap-2 px-3 py-1.5 border transition-all text-[9px] font-black uppercase tracking-widest {type === cat.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300'}"
            >
              <cat.icon size={12} weight="bold" class={type === cat.id ? 'text-black' : cat.color} />
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
                bind:value={lichessUrl}
                placeholder="URL Lichess / Estudio"
                aria-label="Enlace de Lichess"
                class="bg-transparent text-[10px] text-zinc-400 outline-none w-full font-medium"
              />
            </div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center gap-2 px-3 py-2 bg-zinc-950 border border-white/5">
              <Image size={14} class="text-zinc-600" />
              <input 
                type="text" 
                bind:value={fen}
                placeholder="Posición FEN (Tablero)"
                aria-label="Posición FEN"
                class="bg-transparent text-[10px] text-zinc-400 outline-none w-full font-mono"
              />
            </div>
          </div>
        </div>

        {#if fen && fen.length > 20}
          <div class="flex justify-center p-4 bg-zinc-950 border border-white/5 pro-grid-bg" transition:fade>
             <ChessBoard position={fen} interactive={false} size={200} showCoordinates={false} />
          </div>
        {/if}

        <div class="flex justify-end gap-3 pt-4">
          <button 
            onclick={() => isExpanded = false}
            class="px-6 py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-all"
          >
            Cancelar
          </button>
          <button 
            onclick={handleSubmit}
            disabled={isSubmitting}
            class="px-8 py-3 bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-violet-500 transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            {isSubmitting ? '...' : (post ? 'Guardar' : 'Publicar')}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
