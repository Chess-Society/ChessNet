<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition';
  import { 
    X, 
    Buildings, 
    CalendarBlank, 
    Trophy, 
    CurrencyEur, 
    Lightning, 
    CheckCircle, 
    XCircle,
    Clock,
    UserCircle,
    TrendUp,
    TrendDown,
    FileText,
    GraduationCap,
    ChartBar,
    Pulse
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { t, locale } from '$lib/i18n';

  let { studentId, onclose } = $props<{ studentId: string; onclose: () => void }>();

  // Data from store
  const student = $derived($appStore.students.find(s => s.id === studentId));
  const school = $derived($appStore.schools.find(s => s.id === student?.schoolId));
  const studentClasses = $derived($appStore.classes.filter(c => student?.classId === c.id));
  
  // Metrics calculations
  const attendance = $derived($appStore.attendance.filter(a => a.studentId === studentId));
  const payments = $derived($appStore.payments.filter(p => p.studentId === studentId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  const tournamentResults = $derived($appStore.localTournamentPlayers.filter(p => p.studentId === studentId));
  
  const attendanceStats = $derived.by(() => {
    if (attendance.length === 0) return { rate: 0, p: 0, a: 0, t: 0 };
    const p = attendance.filter(a => a.status === 'P').length;
    const tCount = attendance.filter(a => a.status === 'T').length;
    const a = attendance.filter(a => a.status === 'A').length;
    return {
      rate: ((p + tCount) / attendance.length * 100).toFixed(1),
      p, t: tCount, a
    };
  });

  const paymentStatus = $derived.by(() => {
    if (payments.length === 0) return 'pending';
    const lastPayment = payments[0];
    const lastDate = new Date(lastPayment.createdAt);
    const today = new Date();
    const diffMonths = (today.getFullYear() - lastDate.getFullYear()) * 12 + (today.getMonth() - lastDate.getMonth());
    return diffMonths <= 1 ? 'ok' : 'overdue';
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short' });
  };
</script>

<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8" in:fade={{ duration: 200 }}>
  <!-- Backdrop -->
  <button 
    class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm cursor-default"
    onclick={onclose}
    aria-label="Close modal"
  ></button>

  {#if student}
    <div 
      class="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      in:scale={{ start: 0.95, duration: 300 }}
    >
      <!-- Header Area -->
      <div class="p-8 lg:p-10 bg-zinc-950/50 border-b border-zinc-800 flex items-start justify-between relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-[80px] rounded-none -mr-32 -mt-32"></div>
        
        <div class="flex items-center gap-6 relative z-10">
          <div class="w-20 h-20 bg-violet-600 rounded-none flex items-center justify-center text-white font-outfit font-black text-2xl shadow-2xl shadow-violet-500/20 uppercase tracking-tighter">
            {getInitials(student.name)}
          </div>
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-none text-[10px] font-black text-violet-400 uppercase tracking-widest">{$t('students.student_label')}</span>
              <span class="w-1.5 h-1.5 bg-zinc-800 rounded-none"></span>
              <span class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">ID: {student.id.slice(0, 8)}</span>
            </div>
            <h2 class="text-3xl lg:text-4xl font-outfit font-black text-white uppercase italic tracking-tighter leading-none">{student.name}</h2>
            <div class="flex items-center gap-3 mt-3 text-zinc-500 font-medium">
              <div class="flex items-center gap-1.5">
                <Buildings weight="bold" class="w-4 h-4 text-zinc-700" />
                <span class="text-xs uppercase tracking-wider">{school?.name || $t('students.unassigned')}</span>
              </div>
              <span class="w-1 h-1 bg-zinc-800 rounded-none"></span>
              <div class="flex items-center gap-1.5">
                <GraduationCap weight="bold" class="w-4 h-4 text-zinc-700" />
                <span class="text-xs uppercase tracking-wider">{student.level || '--'}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onclick={onclose}
          class="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-all active:scale-95 relative z-10"
        >
          <X weight="bold" size={24} />
        </button>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Attendance Card -->
          <div class="bg-zinc-950/50 border border-zinc-800 rounded-none p-6 relative overflow-hidden group">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-none flex items-center justify-center text-violet-400">
                  <CalendarBlank weight="bold" size={20} />
                </div>
                <h3 class="text-xs font-black text-zinc-400 uppercase tracking-widest">{$t('reports.metrics.attendance')}</h3>
              </div>
              <span class="text-2xl font-outfit font-black text-white italic">{attendanceStats.rate}%</span>
            </div>
            
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-zinc-900/50 rounded-none p-3 text-center border border-zinc-800/50">
                <p class="text-[10px] font-black text-zinc-600 uppercase mb-1">P</p>
                <p class="text-lg font-outfit font-black text-violet-400">{attendanceStats.p}</p>
              </div>
              <div class="bg-zinc-900/50 rounded-none p-3 text-center border border-zinc-800/50">
                <p class="text-[10px] font-black text-zinc-600 uppercase mb-1">T</p>
                <p class="text-lg font-outfit font-black text-amber-400">{attendanceStats.t}</p>
              </div>
              <div class="bg-zinc-900/50 rounded-none p-3 text-center border border-zinc-800/50">
                <p class="text-[10px] font-black text-zinc-600 uppercase mb-1">A</p>
                <p class="text-lg font-outfit font-black text-rose-400">{attendanceStats.a}</p>
              </div>
            </div>
          </div>

          <!-- Payments Card -->
          <div class="bg-zinc-950/50 border border-zinc-800 rounded-none p-6 relative overflow-hidden group">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-none flex items-center justify-center text-amber-400">
                  <CurrencyEur weight="bold" size={20} />
                </div>
                <h3 class="text-xs font-black text-zinc-400 uppercase tracking-widest">{$t('reports.tabs.payments')}</h3>
              </div>
              <span class="px-2 py-1 {paymentStatus === 'ok' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'} border rounded-none text-[8px] font-black uppercase tracking-widest">
                {paymentStatus === 'ok' ? $t('reports.common.ok') : $t('payments.filters.pending')}
              </span>
            </div>
            
            {#if payments.length > 0}
              <div class="space-y-3">
                {#each payments.slice(0, 2) as payment}
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-zinc-500 font-medium">{formatDate(payment.createdAt)}</span>
                    <span class="text-white font-bold">{payment.amount}€</span>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-xs text-zinc-600 font-medium italic">{$t('payments.no_payments')}</p>
            {/if}
          </div>

          <!-- Competition Card -->
          <div class="bg-zinc-950/50 border border-zinc-800 rounded-none p-6 md:col-span-2 relative overflow-hidden group">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-none flex items-center justify-center text-fuchsia-400">
                <Trophy weight="bold" size={20} />
              </div>
              <h3 class="text-xs font-black text-zinc-400 uppercase tracking-widest">{$t('reports.tabs.tournaments')}</h3>
            </div>
            
            {#if tournamentResults.length > 0}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {#each tournamentResults.slice(0, 4) as result}
                  <div class="bg-zinc-900/50 border border-zinc-800/50 rounded-none p-4 flex items-center justify-between">
                    <div>
                      <p class="text-white font-bold text-sm truncate max-w-[140px]">
                        {$appStore.localTournaments.find(t => t.id === result.tournamentId)?.name || '---'}
                      </p>
                      <p class="text-[10px] text-zinc-600 font-black uppercase tracking-tighter mt-1">
                        {formatDate($appStore.localTournaments.find(t => t.id === result.tournamentId)?.startAt || '')}
                      </p>
                    </div>
                    <div class="flex items-center gap-2">
                       <span class="w-8 h-8 rounded-none bg-zinc-950 flex items-center justify-center text-sm font-outfit font-black text-amber-500">
                        {result.points || 0}
                       </span>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="py-8 flex flex-col items-center justify-center gap-3 text-zinc-700">
                <Trophy size={32} weight="thin" />
                <p class="text-xs font-medium uppercase tracking-widest">{$t('reports.tabs.tournaments')} - {$t('common.empty')}</p>
              </div>
            {/if}
          </div>

        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-8 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800 flex items-center justify-between">
        <button 
          onclick={() => { window.open(`/panel/reports/${studentId}`, '_blank'); onclose(); }}
          class="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors group"
        >
          <div class="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center group-hover:bg-zinc-800 transition-all">
            <FileText weight="bold" size={20} />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest">{$t('reports.view_full_report')}</span>
        </button>

        <button 
          onclick={onclose}
          class="h-12 px-8 bg-zinc-900 border border-zinc-800 text-white font-black rounded-none hover:bg-zinc-800 transition-all active:scale-95 uppercase text-[10px] tracking-widest"
        >
          {$t('common.close')}
        </button>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 0;
  }
</style>
