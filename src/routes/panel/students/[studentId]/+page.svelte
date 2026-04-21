<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft, 
    PencilSimple, 
    Buildings, 
    FileText, 
    Calendar,
    Pulse,
    Medal,
    TrendUp,
    IdentificationBadge,
    CheckCircle,
    GraduationCap,
    CaretLeft
  } from 'phosphor-svelte';
  import { fade, fly } from 'svelte/transition';
  import { t } from '$lib/i18n';
  import type { PageData } from './$types';
  import { appStore } from '$lib/stores/appStore';

  let { data } = $props<{ data: PageData }>();
  let student = $derived($appStore.students?.find(s => s.id === data.student.id) || data.student);
  let school = $derived($appStore.schools?.find(s => s.id === student?.schoolId) || data.school);
  // Classes requires a filter based on `class_students` mock logic if it was fully implemented.
  // For now we'll leave enrolledClasses from `data` since it's hardcoded for mock anyway, or could use data.enrolledClasses.
  let enrolledClasses = $derived(data.enrolledClasses || []);
  let attendanceRate = $derived(data.attendanceRate);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  let lichessData: any = $state(null);
  let lichessHistory: any = $state(null);
  let isFetchingLichess = $state(false);

  $effect(() => {
    if (student?.lichessUsername) {
      fetchLichessData(student.lichessUsername);
    }
  });

  async function fetchLichessData(username: string) {
    if (lichessData) return; // Ya se cargó
    try {
      isFetchingLichess = true;
      const [res, historyRes] = await Promise.all([
        fetch(`https://lichess.org/api/user/${username}`),
        fetch(`https://lichess.org/api/user/${username}/rating-history`)
      ]);
      if (res.ok) {
        lichessData = await res.json();
      }
      if (historyRes.ok) {
        lichessHistory = await historyRes.json();
      }
    } catch (e) {
      console.error('Error fetching Lichess data:', e);
    } finally {
      isFetchingLichess = false;
    }
  }

  function generateSparkline(points: any[]) {
    const recent = points.slice(-30);
    if (recent.length < 2) return '';
    const ratings = recent.map(p => p[3]);
    const min = Math.min(...ratings);
    const max = Math.max(...ratings);
    const range = max - min || 1;
    const w = 100;
    const h = 20; // smaller height
    
    const svgPoints = recent.map((p, i) => {
       const x = (i / (recent.length - 1)) * w;
       const y = h - ((p[3] - min) / range * h);
       return `${x},${y}`;
    }).join(' ');
    
    return `<svg viewBox="-2 -2 104 24" class="w-full h-8 overflow-visible" preserveAspectRatio="none">
      <polyline points="${svgPoints}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
    </svg>`;
  }
</script>

<svelte:head>
  <title>{student?.firstName} {student?.lastName} - {$t('students.records')} - ChessNet</title>
</svelte:head>

<div class="page-container" in:fade>
  
  <div class="glow-bg"></div>

  {#if student}
  <!-- Header Section -->
  <header class="main-header">
    <div class="title-section">
      <button 
        onclick={() => goto('/panel/students')}
        class="back-orb"
        title={$t('students.back_to_list')}
      >
        <CaretLeft size={24} weight="bold" />
      </button>
      <div class="flex items-center gap-6">
        <div class="profile-avatar">
          {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
        </div>
        <div class="text-group">
          <h1 class="gradient-text font-outfit">{student.firstName} {student.lastName}</h1>
          <div class="flex items-center gap-3 mt-2">
            <span class="pill-badge active">
              <CheckCircle size={14} weight="bold" />
              {student.active ? $t('students.status_active') : $t('students.status_inactive')}
            </span>
            {#if student.level}
              <span class="pill-badge secondary">
                {$t('students.level')}: {student.level}
              </span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="action-section">
      <button 
        class="glass-btn primary" 
        onclick={() => goto(`/panel/students/${student.id}/edit`)}
      >
        <PencilSimple size={20} weight="bold" />
        <span class="font-outfit font-bold">{$t('students.edit_record')}</span>
      </button>
    </div>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Info (Left) -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Academic & Institutional Card -->
      <section class="bento-card !p-10 space-y-10">
        <div class="flex items-center gap-4 border-b border-white/5 pb-8">
          <GraduationCap size={24} weight="duotone" class="text-violet-400" />
          <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight uppercase">{$t('students.academic_record')}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="info-block group hover:border-violet-500/30 transition-all">
            <div class="flex items-center gap-2 mb-3">
               <Buildings size={16} weight="duotone" class="text-violet-500/60" />
               <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.educational_school')}</p>
            </div>
            <p class="text-white font-outfit font-bold text-lg">{school?.name || $t('classes.independent')}</p>
          </div>
          
          <div class="info-block group hover:border-violet-500/30 transition-all">
            <div class="flex items-center gap-2 mb-3">
               <IdentificationBadge size={16} weight="duotone" class="text-violet-500/60" />
               <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.active_classes')}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              {#if enrolledClasses.length > 0}
                {#each enrolledClasses as cls}
                  <span class="px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-none text-[10px] font-outfit font-black text-violet-400 uppercase tracking-widest">
                    {cls.name}
                  </span>
                {/each}
              {:else}
                <p class="text-slate-600 font-jakarta text-xs font-bold uppercase italic">{$t('students.no_records')}</p>
              {/if}
            </div>
          </div>
        </div>
      </section>

      <!-- Observations & Notes -->
      <section class="bento-card !p-10 space-y-10">
        <div class="flex items-center gap-4 border-b border-white/5 pb-8">
          <FileText size={24} weight="duotone" class="text-violet-400" />
          <h2 class="text-xl font-outfit font-extrabold text-white tracking-tight uppercase">{$t('students.observations')}</h2>
        </div>
        
        <div class="notes-container">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/5 blur-3xl rounded-none pointer-events-none"></div>
          
          {#if student.notes}
            <p class="text-slate-400 font-jakarta text-lg leading-relaxed whitespace-pre-wrap relative z-10">{student.notes}</p>
          {:else}
            <div class="empty-notes">
               <div class="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center border border-white/10 mb-4 opacity-30">
                  <FileText size={32} />
               </div>
               <p class="text-xs font-outfit font-black uppercase tracking-widest text-slate-600">{$t('students.no_notes')}</p>
            </div>
          {/if}
        </div>
      </section>
    </div>

    <!-- Stats & Achievements (Right) -->
    <div class="space-y-8">
       <!-- Lichess Live Stats -->
       <section class="bento-card !p-8 border-t-4 border-t-sky-500 bg-gradient-to-b from-sky-600/5 to-transparent relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-sky-600/5 blur-3xl rounded-none"></div>
          
          <div class="flex items-center justify-between mb-8 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-zinc-950 rounded-none flex items-center justify-center text-sky-400 border border-white/5 shadow-inner">
                <svg width="20" height="20" viewBox="0 0 44 44" class="fill-current"><path d="M12.92,10.6A11.75,11.75,0,0,0,24,20H24V9.66L15.3,1.06A11.75,11.75,0,0,0,1,12.79h0A11.75,11.75,0,0,0,12.79,24.5h.13V24a11.75,11.75,0,0,1-11.75-11.75h0A11.75,11.75,0,0,1,12.92,10.6Zm18.15,22.8A11.75,11.75,0,0,0,20,24H20V34.34L28.7,42.94A11.75,11.75,0,0,0,43,31.21h0A11.75,11.75,0,0,0,31.21,19.5h-.13v.5a11.75,11.75,0,0,1,11.75,11.75h0A11.75,11.75,0,0,1,31.08,33.4Z"></path></svg>
              </div>
              <div>
                <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">Lichess ELO</h3>
                {#if student?.lichessUsername}
                  <a href="https://lichess.org/@/{student.lichessUsername}" target="_blank" class="text-[10px] font-bold text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-widest block mt-0.5">
                    @{student.lichessUsername} ↗
                  </a>
                {/if}
              </div>
            </div>
            
            {#if isFetchingLichess}
              <div class="flex gap-1">
                <div class="w-1.5 h-1.5 rounded-none bg-sky-500 animate-ping"></div>
              </div>
            {/if}
          </div>

          <div class="space-y-6 relative z-10">
            {#if !student?.lichessUsername}
              <div class="text-center p-6 bg-zinc-900/50 rounded-none border border-white/5">
                <p class="text-xs font-jakarta text-slate-400 mb-3">No hay cuenta vinculada todavía.</p>
                <button onclick={() => goto(`/panel/students/${student.id}/edit`)} class="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest rounded-none transition-colors border border-sky-500/20">
                  Vincular Lichess
                </button>
              </div>
            {:else if lichessData}
              <div class="grid grid-cols-2 gap-4">
                <!-- Blitz ELO -->
                <div class="p-4 bg-zinc-900/40 rounded-none border border-white/5 flex flex-col items-center justify-center text-center group/elo hover:bg-zinc-900/60 transition-colors relative overflow-hidden">
                  <p class="text-[9px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] mb-1 relative z-10">Blitz</p>
                  <p class="text-2xl font-outfit font-black text-white tracking-tighter relative z-10">
                    {lichessData.perfs?.blitz?.rating || 'Unr.'}
                  </p>
                  {#if lichessData.perfs?.blitz?.prog}
                    <p class="text-[10px] font-bold mt-1 {lichessData.perfs.blitz.prog >= 0 ? 'text-violet-400' : 'text-rose-400'} relative z-10">
                      {lichessData.perfs.blitz.prog >= 0 ? '+' : ''}{lichessData.perfs.blitz.prog}
                    </p>
                  {/if}
                  {#if lichessHistory}
                     {@const blitzHistory = lichessHistory.find((h: any) => h.name === 'Blitz')?.points}
                     {#if blitzHistory}
                        <div class="w-full text-amber-500 mt-3 opacity-40 group-hover/elo:opacity-100 transition-opacity">
                          {@html generateSparkline(blitzHistory)}
                        </div>
                     {/if}
                  {/if}
                </div>
                <!-- Rapid ELO -->
                <div class="p-4 bg-zinc-900/40 rounded-none border border-white/5 flex flex-col items-center justify-center text-center group/elo hover:bg-zinc-900/60 transition-colors relative overflow-hidden">
                  <p class="text-[9px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] mb-1 relative z-10">Rapid</p>
                  <p class="text-2xl font-outfit font-black text-white tracking-tighter relative z-10">
                    {lichessData.perfs?.rapid?.rating || 'Unr.'}
                  </p>
                  {#if lichessData.perfs?.rapid?.prog}
                    <p class="text-[10px] font-bold mt-1 {lichessData.perfs.rapid.prog >= 0 ? 'text-violet-400' : 'text-rose-400'} relative z-10">
                      {lichessData.perfs.rapid.prog >= 0 ? '+' : ''}{lichessData.perfs.rapid.prog}
                    </p>
                  {/if}
                  {#if lichessHistory}
                     {@const rapidHistory = lichessHistory.find((h: any) => h.name === 'Rapid')?.points}
                     {#if rapidHistory}
                        <div class="w-full text-blue-500 mt-3 opacity-40 group-hover/elo:opacity-100 transition-opacity">
                          {@html generateSparkline(rapidHistory)}
                        </div>
                     {/if}
                  {/if}
                </div>
                <!-- Puzzles ELO -->
                <div class="col-span-2 p-4 bg-zinc-900/40 rounded-none border border-white/5 flex flex-col justify-between group/elo hover:bg-zinc-900/60 transition-colors relative overflow-hidden">
                  <div class="flex items-center justify-between w-full relative z-10">
                     <div>
                       <p class="text-[9px] font-outfit font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Puzzles</p>
                       <p class="text-[10px] font-bold text-slate-400 mt-1">{lichessData.count?.puzzle || 0} resueltos</p>
                     </div>
                     <div class="text-right">
                       <p class="text-xl font-outfit font-black text-white tracking-tighter">
                         {lichessData.perfs?.puzzle?.rating || 'Unr.'}
                       </p>
                       {#if lichessData.perfs?.puzzle?.prog}
                          <p class="text-[10px] font-bold {lichessData.perfs.puzzle.prog >= 0 ? 'text-violet-400' : 'text-rose-400'}">
                            {lichessData.perfs.puzzle.prog >= 0 ? '+' : ''}{lichessData.perfs.puzzle.prog}
                          </p>
                       {/if}
                     </div>
                  </div>
                  {#if lichessHistory}
                     {@const puzzleHistory = lichessHistory.find((h: any) => h.name === 'Puzzles')?.points}
                     {#if puzzleHistory}
                        <div class="w-full text-violet-500 mt-3 opacity-40 group-hover/elo:opacity-100 transition-opacity">
                          {@html generateSparkline(puzzleHistory)}
                        </div>
                     {/if}
                  {/if}
                </div>
              </div>
            {:else if !isFetchingLichess}
              <div class="text-center p-6 bg-zinc-900/50 rounded-none border border-white/5">
                <p class="text-[11px] font-jakarta text-slate-400 mb-2">No pudimos encontrar el perfil público en Lichess.</p>
                <p class="text-[10px] text-zinc-500">Asegúrate de que el usuario `{student.lichessUsername}` es correcto.</p>
              </div>
            {/if}
          </div>
       </section>
       <section class="bento-card !p-8 border-t-4 border-t-violet-500 bg-gradient-to-b from-violet-600/5 to-transparent relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/5 blur-3xl rounded-none"></div>
          
          <div class="flex items-center gap-4 mb-8">
             <div class="p-2.5 bg-violet-600/10 rounded-none border border-violet-500/20">
                <TrendUp size={20} weight="duotone" class="text-violet-400" />
             </div>
             <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">{$t('students.performance')}</h3>
          </div>
          
          <div class="space-y-10 relative z-10">
             <div class="progress-metric">
                <div class="flex justify-between items-end mb-4">
                   <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.estimated_progress')}</p>
                   <p class="text-3xl font-outfit font-extrabold text-white leading-none tracking-tighter">{data.estimatedProgress || 0}%</p>
                </div>
                <div class="progress-track">
                   <div class="progress-fill gold" style="width: {data.estimatedProgress || 0}%"></div>
                </div>
             </div>
             
             <div class="progress-metric">
                <div class="flex justify-between items-end mb-4">
                   <p class="text-[10px] font-outfit font-black text-slate-500 uppercase tracking-widest">{$t('students.avg_attendance')}</p>
                   <p class="text-3xl font-outfit font-extrabold text-white leading-none tracking-tighter">{attendanceRate || 0}%</p>
                </div>
                <div class="progress-track">
                   <div class="progress-fill blue" style="width: {attendanceRate || 0}%"></div>
                </div>
             </div>
          </div>
       </section>

       <section class="bento-card !p-8 relative overflow-hidden group">
          <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 blur-3xl rounded-none"></div>
          
          <div class="flex items-center gap-4 mb-8 relative z-10">
             <div class="p-2.5 bg-amber-500/10 rounded-none border border-amber-500/20">
                <Medal size={20} weight="duotone" class="text-amber-400" />
             </div>
             <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">{$t('students.achievements')}</h3>
          </div>
          
          <div class="space-y-4 relative z-10">
             {#if (data.achievements || []).length > 0}
               {#each (data.achievements || []) as achievement}
                 <div class="achievement-card">
                    <div class="badge-orb">
                       <Medal size={24} weight="duotone" />
                    </div>
                    <div class="min-w-0">
                       <p class="text-xs font-outfit font-black text-white uppercase tracking-tight truncate">
                         {$t(`achievements.${achievement.type}.title`) || achievement.type}
                       </p>
                       <p class="text-[10px] font-jakarta font-bold text-slate-500 uppercase tracking-widest mt-0.5 truncate">
                         {new Date(achievement.timestamp).toLocaleDateString()}
                       </p>
                    </div>
                 </div>
               {/each}
             {:else}
               <div class="text-center p-6 bg-zinc-900/50 rounded-none border border-white/5 opacity-50">
                 <p class="text-[10px] font-outfit font-black uppercase tracking-widest text-slate-600">{$t('students.no_achievements') || 'SIN LOGROS'}</p>
               </div>
             {/if}
          </div>
       </section>
    </div>
  </div>
  {:else}
  <div class="loader-overlay">
    <div class="relative">
      <div class="spinner"></div>
      <div class="absolute inset-0 flex items-center justify-center text-violet-400">
         <IdentificationBadge size={48} weight="duotone" class="animate-pulse" />
      </div>
    </div>
    <p class="loading-text">{$t('common.loading')}...</p>
  </div>
  {/if}
</div>

<style lang="postcss">
  /* Premium Styles */
  .page-container {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    min-height: 100vh;
    z-index: 1;
  }

  .glow-bg {
    position: fixed;
    top: -10%;
    right: -10%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
    filter: blur(80px);
    z-index: -1;
    pointer-events: none;
  }

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3.5rem;
    gap: 2rem;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 1.75rem;
  }

  .back-orb {
    width: 54px;
    height: 54px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #475569;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .back-orb:hover {
    background: rgba(255,255,255,0.05);
    color: #fff;
    border-color: rgba(139, 92, 246, 0.3);
    transform: translateX(-5px);
  }

  .profile-avatar {
    width: 80px;
    height: 80px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a78bfa;
    font-family: 'Outfit';
    font-weight: 900;
    font-size: 2.5rem;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  }

  .gradient-text {
    font-size: 3.5rem;
    font-weight: 900;
    margin: 0;
    line-height: 1;
    letter-spacing: -3px;
    background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .action-section {
    display: flex;
    gap: 1rem;
  }

  .glass-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1.75rem;
    border-radius: 0;
    font-size: 0.95rem;
    font-weight: 700;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.08);
  }

  .glass-btn.primary {
    background: #fff;
    color: #000;
    box-shadow: 0 10px 25px rgba(255,255,255,0.1);
  }

  .glass-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(255,255,255,0.15);
  }

  .pill-badge {
    padding: 0.4rem 1rem;
    border-radius: 0;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid transparent;
  }

  .pill-badge.active { background: rgba(139, 92, 246, 0.1); color: #a78bfa; border-color: rgba(139, 92, 246, 0.2); }
  .pill-badge.secondary { background: rgba(255, 255, 255, 0.05); color: #94a3b8; border-color: rgba(255, 255, 255, 0.1); }

  .info-block {
    padding: 1.5rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0;
    box-shadow: inset 0 0 40px rgba(255,255,255,0.01);
  }

  .notes-container {
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: 0;
    padding: 2.5rem;
    min-height: 250px;
    position: relative;
    overflow: hidden;
  }

  .empty-notes {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    opacity: 0.5;
  }

  .progress-metric {
    position: relative;
  }

  .progress-track {
    width: 100%;
    height: 10px;
    background: #000;
    border-radius: 0;
    border: 1px solid rgba(255,255,255,0.03);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 0;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .progress-fill.gold { background: linear-gradient(90deg, #7c3aed, #a78bfa); box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
  .progress-fill.blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }

  .achievement-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: 0;
    transition: all 0.3s;
  }

  .achievement-card:hover { border-color: rgba(245, 158, 11, 0.3); background: rgba(0,0,0,0.4); }

  .badge-orb {
    width: 48px;
    height: 48px;
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader-overlay {
    height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .spinner {
    width: 90px;
    height: 90px;
    border: 3px solid rgba(139, 92, 246, 0.1);
    border-top-color: #7c3aed;
    border-radius: 0;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    font-family: 'Outfit';
    font-weight: 800;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 5px;
    color: #475569;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 1024px) {
    .main-header { flex-direction: column; align-items: flex-start; }
    .gradient-text { font-size: 2.5rem; }
    .back-orb { width: 44px; height: 44px; }
  }
</style>
