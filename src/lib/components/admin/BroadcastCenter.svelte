<script lang="ts">
  import { 
    Megaphone, 
    PaperPlaneTilt, 
    X, 
    CheckCircle, 
    Info, 
    Warning,
    ChatTeardropDots,
    Globe
  } from 'phosphor-svelte';
  import { fade, slide } from 'svelte/transition';
  import { toast } from '$lib/stores/toast';
  import { db } from '$lib/firebase';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

  let message = $state("");
  let type = $state<"info" | "warning" | "success" | "critical">("info");
  let isSending = $state(false);

  async function handleSend() {
    if (!message.trim()) return;
    isSending = true;
    try {
      // Send to lobby_announcements (which displays in the lobby chat)
      await addDoc(collection(db, "lobby_announcements"), {
        content: message,
        type: type,
        authorName: "Admin ChessNet",
        authorEmail: "admin@chessnet.dev",
        createdAt: new Date().toISOString(),
        isSystem: true
      });

      // Also send to global notifications if needed, but for now lobby is prime
      
      toast.success("Comunicación enviada a toda la comunidad");
      message = "";
    } catch (e) {
      toast.error("Error al enviar el mensaje");
    } finally {
      isSending = false;
    }
  }

  const types = [
    { id: 'info', icon: Info, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10', label: 'Informativo' },
    { id: 'success', icon: CheckCircle, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', label: 'Éxito / Actualización' },
    { id: 'warning', icon: Warning, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', label: 'Aviso' },
    { id: 'critical', icon: Megaphone, color: 'text-red-400 border-red-500/30 bg-red-500/10', label: 'Crítico / Mantenimiento' }
  ];
</script>

<div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden group">
  <!-- Mesh Gradient Background -->
  <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full group-hover:bg-primary-500/20 transition-all duration-1000"></div>

  <div class="flex items-center justify-between">
    <div class="space-y-1">
      <h3 class="text-xl font-black font-display uppercase italic tracking-wider flex items-center gap-3">
        <Globe weight="duotone" class="w-6 h-6 text-primary-500" />
        Broadcast Center
      </h3>
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-9">Comunicaciones globales en tiempo real</p>
    </div>
  </div>

  <div class="space-y-6 relative z-10">
    <!-- Message Type Selector -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      {#each types as t}
        {@const Icon = t.icon}
        <button 
          onclick={() => type = t.id as any}
          class="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all {type === t.id ? t.color + ' border border-current shadow-lg shadow-current/5 scale-[1.02]' : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/20'}"
        >
          <Icon weight="duotone" class="w-5 h-5" />
          <span class="text-[9px] font-black uppercase tracking-tighter">{t.label}</span>
        </button>
      {/each}
    </div>

    <!-- Message Input -->
    <div class="relative">
      <textarea 
        bind:value={message}
        placeholder="Escribe el mensaje para enviar al Community Lobby..."
        class="w-full bg-black/40 border border-white/10 rounded-3xl p-6 min-h-[160px] text-sm text-white placeholder:text-slate-600 outline-none focus:border-primary-500/50 transition-all resize-none shadow-inner"
      ></textarea>
      
      <div class="absolute bottom-6 right-6 flex items-center gap-4">
        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">{message.length} Caracteres</span>
        <button 
          onclick={handleSend}
          disabled={!message.trim() || isSending}
          class="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-primary-500 to-violet-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:grayscale"
        >
          {#if isSending}
            <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          {:else}
            <PaperPlaneTilt weight="bold" class="w-4 h-4" />
          {/if}
          Lanzar Broadcast
        </button>
      </div>
    </div>
  </div>

  <div class="flex items-center gap-4 p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
    <ChatTeardropDots weight="duotone" class="w-6 h-6 text-primary-400" />
    <p class="text-[10px] text-primary-300/80 font-medium italic">
      Este mensaje aparecerá instantáneamente en el "Lobby Comunidad" de todos los profesores conectados.
    </p>
  </div>
</div>
