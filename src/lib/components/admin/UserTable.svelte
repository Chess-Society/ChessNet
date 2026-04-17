<script lang="ts">
  import { t } from '$lib/i18n';
  import { 
    MagnifyingGlass, 
    UserCircle, 
    Crown, 
    DotsThreeVertical,
    CheckCircle,
    XCircle,
    UserPlus,
    IdentificationBadge,
    Eye,
    Trash,
    Medal
  } from 'phosphor-svelte';
  import { fade } from 'svelte/transition';

  interface Props {
    users: any[];
    onEdit: (user: any) => void;
    onImpersonate: (user: any) => void;
    onSearch: (query: string) => void;
  }

  let { users, onEdit, onImpersonate, onSearch }: Props = $props();
  let searchQuery = $state("");

  function handleSearchInput() {
    onSearch(searchQuery);
  }

  function getPlanStatus(user: any) {
    return user.settings?.plan === 'premium' || user.settings?.plan === 'pro' ? 'pro' : 'free';
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  }
</script>

<div class="space-y-6">
  <!-- Search and Actions Bar -->
  <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
    <div class="relative w-full md:w-96 group">
      <div class="absolute inset-0 bg-primary-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
      <div class="relative flex items-center bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus-within:border-primary-500/50 transition-all">
        <MagnifyingGlass class="w-5 h-5 text-slate-500 mr-3" />
        <input 
          type="text" 
          bind:value={searchQuery}
          oninput={handleSearchInput}
          placeholder="Buscar profesor por email o ID..."
          class="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-600 font-medium"
        />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button class="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
        <UserPlus class="w-4 h-4" />
        Exportar CSV
      </button>
    </div>
  </div>

  <!-- Users Table -->
  <div class="bg-[#1e293b]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-black/20 border-b border-white/5">
            <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest font-display italic">Profesor</th>
            <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest font-display italic">Logros</th>
            <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest font-display italic">Plan</th>
            <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest font-display italic">Registro</th>
            <th class="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest font-display italic">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {#each users as user (user.id)}
            <tr class="hover:bg-white/[0.02] transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform">
                    {#if user.photoURL}
                      <img src={user.photoURL} alt="" class="w-full h-full object-cover rounded-2xl" />
                    {:else}
                      <UserCircle class="w-6 h-6" />
                    {/if}
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white group-hover:text-primary-400 transition-colors uppercase italic">{user.displayName || 'Sin Nombre'}</h4>
                    <p class="text-[10px] text-slate-500 font-medium">{user.email}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                {#if user.badgesCount > 0}
                  <div class="flex items-center gap-2">
                    <div class="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
                      <Medal weight="fill" class="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <span class="text-xs font-black text-violet-300 italic">{user.badgesCount}</span>
                  </div>
                {:else}
                  <span class="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Iniciado</span>
                {/if}
              </td>
              <td class="px-8 py-6">
                {#if getPlanStatus(user) === 'pro'}
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 text-[9px] font-black uppercase tracking-widest">
                    <Crown weight="fill" class="w-3 h-3" />
                    Premium
                  </div>
                {:else}
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-500/10 text-slate-500 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest">
                    Free
                  </div>
                {/if}
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-300 font-bold">{formatDate(user.createdAt)}</span>
                  <span class="text-[9px] text-slate-600 font-black uppercase tracking-tighter">Firestore Native</span>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                   <button 
                    onclick={() => onEdit(user)}
                    class="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/30 transition-all pointer-interactions"
                    title="Gestionar"
                   >
                    <IdentificationBadge weight="bold" class="w-4 h-4" />
                   </button>
                   <button 
                    onclick={() => onImpersonate(user)}
                    class="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-primary-500/20 hover:border-primary-500/30 transition-all pointer-interactions"
                    title="Suplantar"
                   >
                    <Eye weight="bold" class="w-4 h-4" />
                   </button>
                   <button 
                    class="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all pointer-interactions"
                    title="Eliminar"
                   >
                    <Trash weight="bold" class="w-4 h-4" />
                   </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if users.length === 0}
      <div class="p-20 text-center space-y-4">
        <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700">
          <MagnifyingGlass class="w-8 h-8" />
        </div>
        <p class="text-slate-500 italic text-sm">No se encontraron profesores que coincidan con la búsqueda.</p>
      </div>
    {/if}
  </div>
</div>
