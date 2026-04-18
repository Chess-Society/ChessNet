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

  let { data } = $props<{ data: PageData }>();
  let student = $derived(data.student);
  let school = $derived(data.school);
  let enrolledClasses = $derived(data.enrolledClasses || []);
  let attendanceRate = $derived(data.attendanceRate);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
</script>

<svelte:head>
  <title>{student?.name || $t('common.unknown')} - {$t('students.records')} - ChessNet</title>
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
          {getInitials(student.name)}
        </div>
        <div class="text-group">
          <h1 class="gradient-text font-outfit">{student.name}</h1>
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
                  <span class="px-3 py-1.5 bg-violet-600/10 border border-violet-500/20 rounded-lg text-[10px] font-outfit font-black text-violet-400 uppercase tracking-widest">
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
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/5 blur-3xl rounded-full pointer-events-none"></div>
          
          {#if student.notes}
            <p class="text-slate-400 font-jakarta text-lg leading-relaxed whitespace-pre-wrap relative z-10">{student.notes}</p>
          {:else}
            <div class="empty-notes">
               <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-4 opacity-30">
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
       <section class="bento-card !p-8 border-t-4 border-t-violet-500 bg-gradient-to-b from-violet-600/5 to-transparent relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full"></div>
          
          <div class="flex items-center gap-4 mb-8">
             <div class="p-2.5 bg-violet-600/10 rounded-xl border border-violet-500/20">
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
          <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
          
          <div class="flex items-center gap-4 mb-8 relative z-10">
             <div class="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <Medal size={20} weight="duotone" class="text-amber-400" />
             </div>
             <h3 class="text-sm font-outfit font-black text-white uppercase tracking-widest">{$t('students.achievements')}</h3>
          </div>
          
          <div class="space-y-4 relative z-10">
             <div class="achievement-card">
                <div class="badge-orb">
                   <Medal size={24} weight="duotone" />
                </div>
                <div class="min-w-0">
                   <p class="text-xs font-outfit font-black text-white uppercase tracking-tight truncate">{$t('students.first_tournament')}</p>
                   <p class="text-[10px] font-jakarta font-bold text-slate-500 uppercase tracking-widest mt-0.5 truncate">{$t('students.special_mention')}</p>
                </div>
             </div>
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
    border-radius: 50%;
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
    border-radius: 28px;
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
    border-radius: 16px;
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
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid transparent;
  }

  .pill-badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
  .pill-badge.secondary { background: rgba(255, 255, 255, 0.05); color: #94a3b8; border-color: rgba(255, 255, 255, 0.1); }

  .info-block {
    padding: 1.5rem;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 24px;
    box-shadow: inset 0 0 40px rgba(255,255,255,0.01);
  }

  .notes-container {
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(255,255,255,0.03);
    border-radius: 28px;
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
    border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.03);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 50px;
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
    border-radius: 24px;
    transition: all 0.3s;
  }

  .achievement-card:hover { border-color: rgba(245, 158, 11, 0.3); background: rgba(0,0,0,0.4); }

  .badge-orb {
    width: 48px;
    height: 48px;
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border-radius: 15px;
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
    border-radius: 50%;
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
