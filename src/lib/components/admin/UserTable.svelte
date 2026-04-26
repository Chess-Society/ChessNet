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
      <div class="absolute inset-0 bg-primary-500/5 rounded-none blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
      <div class="relative flex items-center bg-[#02040a] border border-white/10 rounded-none px-6 py-4 focus-within:border-primary-500/50 transition-all">
        <MagnifyingGlass class="w-5 h-5 text-slate-500 mr-3" />
        <input 
          type="text" 
          bind:value={searchQuery}
          oninput={handleSearchInput}
          placeholder={$t('admin.users.search')}
          class="bg-transparent border-none outline-none text-xs font-mono font-black uppercase tracking-widest w-full text-white placeholder:text-slate-700"
        />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button class="px-8 py-4 bg-white/5 border border-white/10 rounded-none text-[10px] font-mono font-black uppercase tracking-[0.2em] hover:bg-white text-slate-400 hover:text-black transition-all flex items-center gap-3">
        <UserPlus class="w-4 h-4" />
        {$t('admin.users.export_csv')}
      </button>
    </div>
  </div>

  <!-- Users Grid (Mobile) / Table (Desktop) -->
  <div class="bg-black border border-white/10 rounded-none shadow-2xl overflow-hidden">
    <!-- Desktop Table View -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-white/[0.02] border-b border-white/10">
            <th class="px-10 py-6 text-[10px] font-mono font-black text-slate-600 uppercase tracking-wider">{$t('admin.tech.identity')}</th>
            <th class="px-10 py-6 text-[10px] font-mono font-black text-slate-600 uppercase tracking-wider">{$t('admin.tech.plan')}</th>
            <th class="px-10 py-6 text-[10px] font-mono font-black text-slate-600 uppercase tracking-wider">{$t('admin.tech.timestamp')}</th>
            <th class="px-10 py-6 text-[10px] font-mono font-black text-slate-600 uppercase tracking-wider text-right">{$t('admin.tech.operations')}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {#each users as user (user.id)}
            <tr class="hover:bg-white/[0.01] transition-colors group">
              <td class="px-10 py-6">
                <div class="flex items-center gap-6">
                  <div class="w-14 h-14 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:border-primary-500 transition-colors relative overflow-hidden">
                    {#if user.photoURL}
                      <img src={user.photoURL} alt="" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    {:else}
                      <UserCircle class="w-6 h-6" />
                    {/if}
                    <div class="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500"></div>
                  </div>
                  <div>
                    <h4 class="text-sm font-black text-white group-hover:text-primary-400 transition-colors uppercase italic font-display">{user.displayName || $t('admin.users.no_name')}</h4>
                    <p class="text-[9px] font-mono font-black text-slate-600 uppercase mt-1">{user.email}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <p class="text-[7px] font-mono text-slate-800 uppercase tracking-tighter truncate max-w-[80px]">ID: {user.id}</p>
                      <button 
                        onclick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(user.id);
                          // Maybe a tiny toast or indicator
                        }}
                        class="text-[7px] font-mono text-primary-500 hover:text-primary-400 transition-colors uppercase font-black"
                      >
                        [COPY]
                      </button>
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-10 py-6">
                {#if getPlanStatus(user) === 'pro'}
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-black rounded-none text-[9px] font-mono font-black uppercase tracking-widest">
                    <Crown weight="fill" class="w-3 h-3" />
                    {$t('admin.users.plan.premium')}
                  </div>
                {:else}
                  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 text-slate-500 rounded-none border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest">
                    {$t('admin.users.plan.free')}
                  </div>
                {/if}
              </td>
              <td class="px-10 py-6">
                <div class="flex flex-col">
                  <span class="text-xs text-white font-mono font-black italic">{formatDate(user.createdAt)}</span>
                  <span class="text-[9px] text-slate-700 font-mono font-black uppercase tracking-tight mt-1">FIRESTORE.NATIVE</span>
                </div>
              </td>
              <td class="px-10 py-6">
                <div class="flex items-center justify-end gap-3">
                   <button 
                    onclick={() => onEdit(user)}
                    class="h-12 w-12 bg-white/5 border border-white/10 rounded-none text-slate-500 hover:text-white hover:bg-violet-500 hover:border-violet-500 transition-all flex items-center justify-center"
                    title={$t('admin.users.actions.manage')}
                   >
                    <IdentificationBadge weight="bold" class="w-5 h-5" />
                   </button>
                   <button 
                    onclick={() => onImpersonate(user)}
                    class="h-12 w-12 bg-white/5 border border-white/10 rounded-none text-slate-500 hover:text-white hover:bg-primary-500 hover:border-primary-500 transition-all flex items-center justify-center"
                    title={$t('admin.users.actions.impersonate')}
                   >
                    <Eye weight="bold" class="w-5 h-5" />
                   </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="lg:hidden divide-y divide-white/5">
      {#each users as user (user.id)}
        <div class="p-8 space-y-6 hover:bg-white/[0.01] transition-colors relative">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-none bg-zinc-900 border border-white/10 overflow-hidden relative">
                {#if user.photoURL}
                  <img src={user.photoURL} alt="" class="w-full h-full object-cover grayscale" />
                {:else}
                  <div class="w-full h-full flex items-center justify-center text-slate-700">
                    <UserCircle size={24} />
                  </div>
                {/if}
              </div>
              <div>
                <h4 class="text-sm font-black text-white uppercase italic tracking-tight font-display">{user.displayName || $t('admin.users.no_name')}</h4>
                <p class="text-[9px] font-mono font-black text-slate-600 uppercase">{user.email}</p>
              </div>
            </div>
            {#if getPlanStatus(user) === 'pro'}
              <Crown weight="fill" class="w-4 h-4 text-amber-500" />
            {/if}
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-white/5">
            <div class="flex flex-col gap-1">
              <p class="text-[8px] font-mono font-black text-slate-700 uppercase tracking-wider">{$t('admin.tech.timestamp')}</p>
              <p class="text-[10px] text-slate-400 font-mono font-black uppercase">{formatDate(user.createdAt)}</p>
            </div>
            
            <div class="flex items-center gap-2">
              <button 
                onclick={() => onEdit(user)}
                class="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-none text-slate-400 hover:text-white transition-all"
              >
                <IdentificationBadge weight="bold" class="w-4 h-4" />
                <span class="text-[9px] font-mono font-black uppercase tracking-[0.2em]">MANAGE</span>
              </button>
              <button 
                onclick={() => onImpersonate(user)}
                class="p-3 bg-white/5 border border-white/10 rounded-none text-slate-400"
              >
                <Eye weight="bold" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if users.length === 0}
      <div class="p-20 text-center space-y-4">
        <div class="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center mx-auto text-slate-700">
          <MagnifyingGlass class="w-8 h-8" />
        </div>
        <p class="text-slate-500 italic text-sm">{$t('admin.users.no_results')}</p>
      </div>
    {/if}
  </div>
</div>
