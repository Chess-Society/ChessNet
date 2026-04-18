<script lang="ts">
  import { t } from '$lib/i18n';
  import { 
    CaretLeft, 
    CaretRight, 
    CalendarBlank,
    CheckCircle,
    UserCheck,
    Clock,
    Eye
  } from 'phosphor-svelte';
  import { fade, fly } from 'svelte/transition';

  interface Props {
    selectedClassId: string;
    attendance: any[];
    onDateSelect: (date: string) => void;
  }

  let { selectedClassId, attendance, onDateSelect }: Props = $props();

  let currentMonth = $state(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  let monthDays = $derived(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    // Ajustar para que empiece en Lunes (1)
    let adjustedStart = startDay === 0 ? 6 : startDay - 1;

    const result = [];
    // Padding mes anterior
    for (let i = 0; i < adjustedStart; i++) {
      result.push({ day: null, date: null });
    }
    // Días mes actual
    for (let i = 1; i <= totalDays; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        result.push({ day: i, date: dateStr });
    }
    return result;
  });

  const getAttendanceForDate = (date: string | null) => {
    if (!date) return null;
    const records = attendance.filter(a => a.date === date && a.class_id === selectedClassId);
    if (records.length === 0) return null;
    
    const present = records.filter(r => r.status === 'P').length;
    // Agrupamos por estudiante para evitar duplicados si los hubiera (aunque no debería)
    const uniqueStudents = new Set(records.map(r => r.student_id));
    
    return {
        present,
        total: uniqueStudents.size,
        percent: uniqueStudents.size > 0 ? Math.round((present / records.length) * 100) : 0
    };
  };

  // Corrección: records.length es mejor ya que records ya esta filtrado por date y class
  const getStats = (date: string | null) => {
    if (!date) return null;
    const records = attendance.filter(a => a.date === date && a.class_id === selectedClassId);
    if (records.length === 0) return null;
    const present = records.filter(r => r.status === 'P').length;
    return { present, total: records.length, percent: Math.round((present / records.length) * 100) };
  };

  const nextMonth = () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  };

  const prevMonth = () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  };

  const isToday = (date: string | null) => {
    if (!date) return false;
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  import { locale } from '$lib/i18n';
</script>

<div class="bento-card overflow-hidden" in:fade>
    <!-- Calendar Header -->
    <div class="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-violet-600/10 rounded-xl flex items-center justify-center text-violet-400 border border-violet-500/20">
                <CalendarBlank weight="duotone" class="w-5 h-5" />
            </div>
            <div>
                <h3 class="text-lg font-outfit font-bold text-white leading-tight">
                    {currentMonth.toLocaleDateString($locale, { month: 'long', year: 'numeric' })}
                </h3>
                <p class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    {$t('attendance.calendar.title')}
                </p>
            </div>
        </div>

        <div class="flex items-center gap-2">
            <button 
                onclick={prevMonth}
                class="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
                <CaretLeft weight="bold" class="w-4 h-4" />
            </button>
            <button 
                onclick={() => currentMonth = new Date()}
                class="px-4 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
            >
                {$t('attendance.calendar.today')}
            </button>
            <button 
                onclick={nextMonth}
                class="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
                <CaretRight weight="bold" class="w-4 h-4" />
            </button>
        </div>
    </div>

    <!-- Calendar Grid -->
    <div class="p-6">
        <div class="grid grid-cols-7 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <!-- Days of Week -->
            {#each Array(7).fill(0) as _, i}
                <div class="bg-zinc-900/80 py-3 text-center">
                    <span class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-tighter">
                        {new Date(2024, 0, 1 + i).toLocaleDateString($locale, { weekday: 'narrow' })}
                    </span>
                </div>
            {/each}

            <!-- Date Cells -->
            {#each monthDays() as { day, date }}
                {@const stats = getStats(date)}
                <div class="bg-zinc-900/40 aspect-[4/3] relative group transition-all
                    {day ? 'hover:bg-violet-600/5' : 'bg-zinc-950/20'}
                    {isToday(date) ? 'ring-1 ring-inset ring-violet-500/30' : ''}"
                >
                    {#if day}
                        <button 
                            onclick={() => date && onDateSelect(date)}
                            class="absolute inset-0 w-full h-full p-3 flex flex-col justify-between items-start text-left"
                        >
                            <div class="flex items-center justify-between w-full">
                                <span class="text-sm font-outfit font-bold 
                                    {isToday(date) ? 'text-violet-400' : 'text-slate-500 group-hover:text-white'} transition-colors"
                                >
                                    {day}
                                </span>
                                
                                {#if isToday(date)}
                                    <div class="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50 pulse"></div>
                                {/if}
                            </div>

                            {#if stats}
                                <div class="w-full space-y-1.5" in:fade>
                                    <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            class="h-full rounded-full transition-all duration-1000
                                            {stats.percent > 80 ? 'bg-primary-500' : stats.percent > 50 ? 'bg-amber-500' : 'bg-red-500'}"
                                            style="width: {stats.percent}%"
                                        ></div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <span class="text-[9px] font-bold text-slate-400">
                                            {stats.present}/{stats.total}
                                        </span>
                                        <span class="text-[8px] font-black 
                                            {stats.percent > 80 ? 'text-primary-500' : stats.percent > 50 ? 'text-amber-500' : 'text-red-500'}">
                                            {stats.percent}%
                                        </span>
                                    </div>
                                </div>
                            {:else}
                                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span class="text-[8px] font-outfit font-extrabold text-violet-500/50 uppercase tracking-widest flex items-center gap-1">
                                        <Eye weight="bold" class="w-2.5 h-2.5" />
                                        {$t('attendance.view.take')}
                                    </span>
                                </div>
                            {/if}
                        </button>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- Legend -->
        <div class="mt-6 flex items-center justify-center gap-8 border-t border-white/5 pt-6">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-primary-500"></div>
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{$t('attendance.legend.excellent')} (>80%)</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-amber-500"></div>
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{$t('attendance.legend.regular')} (50%-80%)</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-red-500"></div>
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{$t('attendance.legend.critical')} (&lt;50%)</span>
            </div>
        </div>
    </div>
</div>

<style>
    .pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: .6;
            transform: scale(1.2);
        }
    }
</style>
