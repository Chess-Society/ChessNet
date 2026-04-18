<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { 
    ChartBar, 
    TrendUp, 
    Users, 
    CalendarBlank,
    Target,
    ChartPieSlice,
    ChartLine,
    ArrowUpRight,
    MagnifyingGlass,
    Star,
    Quotes,
    GraduationCap,
    Buildings,
    CheckCircle,
    TrendDown,
    Pulse,
    Trophy
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { user as authUser } from '$lib/stores/auth';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { goto } from '$app/navigation';
  import { fade, fly, scale } from 'svelte/transition';

  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));

  onMount(() => {
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
    }
  });

  // Data fetching from appStore
  let students = $derived($appStore.students || []);
  let schools = $derived($appStore.schools || []);
  let attendance = $derived($appStore.attendance || []);
  let payments = $derived($appStore.payments || []);

  // Advanced Analytics Derivations
  const attendanceStats = $derived(() => {
    if (attendance.length === 0) return { rate: 0, trend: 'stable' };
    const present = attendance.filter(a => a.status === 'P' || a.status === 'T').length;
    const rate = Math.round((present / attendance.length) * 100);
    return { rate, trend: rate > 85 ? 'up' : 'stable' };
  });

  const growthStats = $derived(() => {
    if (students.length === 0) return { count: 0, percent: 0, trend: 'up' };
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newStudents = students.filter(s => {
      const createdAt = s.created_at ? new Date(s.created_at) : new Date(0);
      return createdAt > thirtyDaysAgo;
    }).length;

    const previousTotal = students.length - newStudents;
    const percent = previousTotal > 0 ? (newStudents / previousTotal) * 100 : 100;

    return { 
      count: newStudents, 
      percent: Math.round(percent),
      trend: percent > 10 ? 'up' : 'stable'
    };
  });

  const academicStats = $derived(() => {
    const totalStudents = students.length;
    const totalSchools = schools.length;
    
    const levels: Record<string, number> = {};
    students.forEach(s => {
      const level = s.grade || s.level || 'No level';
      levels[level] = (levels[level] || 0) + 1;
    });

    const sortedLevels = Object.entries(levels)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, percent: Math.round((count / totalStudents) * 100) }));

    return { totalStudents, totalSchools, sortedLevels };
  });

  const schoolBreakdown = $derived(() => {
    const total = students.length || 1;
    return schools.map(s => {
      const count = students.filter(student => student.school_id === s.id).length;
      return {
        id: s.id,
        name: s.name,
        count,
        percent: Math.round((count / total) * 100)
      };
    }).sort((a,b) => b.count - a.count);
  });

  const healthScore = $derived(() => {
    if (payments.length === 0) return 100;
    const overdue = payments.filter(p => p.status === 'overdue').length;
    return Math.max(0, 100 - (overdue / payments.length) * 50);
  });

  // UI State
  let hoveredCard = $state<string | null>(null);
</script>

<svelte:head>
  <title>{$t('reports.title')} - ChessNet Analytics</title>
</svelte:head>

<div class="reports-container" in:fade={{ duration: 400 }}>
  
  <!-- Header Section -->
  <header class="page-header">
    <div class="header-content">
      <div class="icon-orb-wrap">
        <div class="icon-orb">
          <ChartBar weight="duotone" />
          <div class="orb-glow"></div>
        </div>
      </div>
      <div class="title-wrap">
        <div class="badge-row">
          <span class="premium-badge">
            <Star weight="fill" class="w-3 h-3" />
            {$t('reports.premium_analytics')}
          </span>
          <span class="live-indicator">
            <span class="dot"></span>
            {$t('reports.real_time')}
          </span>
        </div>
        <h1>{$t('reports.title')}</h1>
        <p class="subtitle">{$t('reports.subtitle')}</p>
      </div>
    </div>
  </header>

  <!-- Top KPI Grid -->
  <div class="kpi-grid">
    <div 
      class="kpi-card" 
      class:hovered={hoveredCard === 'students'}
      onmouseenter={() => hoveredCard = 'students'}
      onmouseleave={() => hoveredCard = null}
      role="region"
      aria-label="Student Statistics"
    >
      <div class="kpi-icon violet">
        <Users weight="duotone" />
      </div>
      <div class="kpi-info">
        <span class="kpi-label">{$t('reports.subscriptions')}</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{academicStats().totalStudents}</span>
          <div class="kpi-trend up">
            <TrendUp weight="bold" />
            <span>{growthStats().percent}%</span>
          </div>
        </div>
        <p class="kpi-desc">{$t('reports.active_now')}</p>
      </div>
      <div class="card-glow"></div>
    </div>

    <div 
      class="kpi-card"
      class:hovered={hoveredCard === 'attendance'}
      onmouseenter={() => hoveredCard = 'attendance'}
      onmouseleave={() => hoveredCard = null}
      role="region"
      aria-label="Attendance Statistics"
    >
      <div class="kpi-icon emerald">
        <CalendarBlank weight="duotone" />
      </div>
      <div class="kpi-info">
        <span class="kpi-label">{$t('reports.attendance')}</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{attendanceStats().rate}%</span>
          <div class="kpi-trend {attendanceStats().trend}">
            {#if attendanceStats().trend === 'up'}
              <TrendUp weight="bold" />
            {:else}
              <Pulse weight="bold" />
            {/if}
            <span>{attendanceStats().trend === 'up' ? '+2' : '0'}%</span>
          </div>
        </div>
        <p class="kpi-desc">{$t('reports.updated_today')}</p>
      </div>
      <div class="card-glow"></div>
    </div>

    <div 
      class="kpi-card"
      class:hovered={hoveredCard === 'schools'}
      onmouseenter={() => hoveredCard = 'schools'}
      onmouseleave={() => hoveredCard = null}
      role="region"
      aria-label="Active Schools"
    >
      <div class="kpi-icon amber">
        <Buildings weight="duotone" />
      </div>
      <div class="kpi-info">
        <span class="kpi-label">{$t('reports.active_centers')}</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{academicStats().totalSchools}</span>
        </div>
        <p class="kpi-desc">{schoolBreakdown().length} {$t('reports.locations')}</p>
      </div>
      <div class="card-glow"></div>
    </div>

    <div 
      class="kpi-card"
      class:hovered={hoveredCard === 'health'}
      onmouseenter={() => hoveredCard = 'health'}
      onmouseleave={() => hoveredCard = null}
      role="region"
      aria-label="Academy Health Score"
    >
      <div class="kpi-icon indigo">
        <Target weight="duotone" />
      </div>
      <div class="kpi-info">
        <span class="kpi-label">{$t('reports.health_score')}</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{Math.round(healthScore())}</span>
          <span class="unit">/100</span>
        </div>
        <p class="kpi-desc">{$t('reports.estimated')}</p>
      </div>
      <div class="card-glow"></div>
    </div>
  </div>

  <!-- Main Content Grid -->
  <div class="main-grid">
    
    <!-- Left Column: School Breakdown -->
    <section class="content-panel schools-panel">
      <div class="panel-header">
        <div class="panel-title">
          <div class="icon-box">
            <Buildings weight="duotone" />
          </div>
          <div>
            <h3>{$t('reports.students_per_center')}</h3>
            <p>{$t('reports.updated_today')}</p>
          </div>
        </div>
      </div>

      <div class="panel-body scroll-visual">
        {#if schoolBreakdown().length === 0}
          <div class="empty-state">
            <GraduationCap weight="thin" />
            <p>{$t('reports.no_center_data')}</p>
          </div>
        {:else}
          <div class="school-list">
            {#each schoolBreakdown() as school, i}
              <div class="school-item" in:fly={{ y: 20, delay: i * 50 }}>
                <div class="school-info">
                  <span class="school-name">{school.name}</span>
                  <div class="school-meta">
                    <span class="count">{school.count} {$t('reports.alumni')}</span>
                    <span class="percent">{school.percent}%</span>
                  </div>
                </div>
                <div class="progress-track">
                  <div 
                    class="progress-fill" 
                    style="width: {school.percent}%"
                  >
                    <div class="fill-glow"></div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>

    <!-- Right Column: Level & Growth -->
    <div class="sidebar-panels">
      
      <!-- Levels Panel -->
      <section class="content-panel levels-panel">
        <div class="panel-header">
          <div class="panel-title">
            <div class="icon-box violet">
              <ChartPieSlice weight="duotone" />
            </div>
            <h3>{$t('reports.levels')}</h3>
          </div>
        </div>
        <div class="panel-body">
          <div class="level-stats">
            {#each academicStats().sortedLevels as level, i}
              <div class="level-pill" in:scale={{ delay: i * 100 }}>
                <div class="level-header">
                  <span class="level-name">{level.name === 'No level' ? $t('reports.no_levels') : level.name}</span>
                  <span class="level-count">{level.count}</span>
                </div>
                <div class="level-bar-wrap">
                  <div class="level-bar" style="width: {level.percent}%"></div>
                </div>
              </div>
            {/each}
            {#if academicStats().sortedLevels.length === 0}
              <p class="empty-text">{$t('reports.no_levels')}</p>
            {/if}
          </div>
        </div>
      </section>

      <!-- Growth Panel -->
      <section class="content-panel growth-panel">
        <div class="panel-header">
          <div class="panel-title">
            <div class="icon-box emerald">
              <TrendUp weight="duotone" />
            </div>
            <h3>{$t('reports.growth')}</h3>
          </div>
        </div>
        <div class="panel-body growth-body">
          <div class="growth-display">
            <div class="growth-circle">
              <div class="svg-wrap">
                 <svg viewBox="0 0 36 36" class="circular-chart violet">
                  <path class="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path class="circle"
                    stroke-dasharray="{growthStats().percent}, 100"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div class="circle-content">
                  <span class="val">+{growthStats().count}</span>
                  <span class="lab">{$t('reports.last_30_days')}</span>
                </div>
              </div>
            </div>
            <div class="growth-info">
              <p class="growth-desc">{$t('reports.growth_desc')}</p>
              <div class="status-badge positive">
                <CheckCircle weight="fill" />
                <span>{$t('reports.steady_recovery')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>

</div>

<style>
  .reports-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    color: white;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* Header Styles */
  .page-header {
    margin-bottom: 3rem;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .icon-orb-wrap {
    position: relative;
  }

  .icon-orb {
    width: 72px;
    height: 72px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.25rem;
    color: #a78bfa;
    position: relative;
    z-index: 2;
  }

  .orb-glow {
    position: absolute;
    inset: -10px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
    filter: blur(15px);
    z-index: -1;
    animation: pulse-glow 4s infinite alternate;
  }

  .title-wrap h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: -2px;
    background: linear-gradient(to bottom, #fff, #94a3b8);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    line-height: 1.1;
  }

  .subtitle {
    color: #64748b;
    font-size: 1rem;
    margin: 0.5rem 0 0 0;
  }

  .badge-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .premium-badge {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: #8b5cf6;
    padding: 0.25rem 0.75rem;
    border-radius: 100px;
    font-size: 0.7rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    letter-spacing: 0.05em;
  }

  .live-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .live-indicator .dot {
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 10px #10b981;
    animation: blink 2s infinite;
  }

  /* KPI Grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .kpi-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 28px;
    padding: 2rem;
    display: flex;
    gap: 1.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .kpi-card.hovered {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .kpi-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    flex-shrink: 0;
  }

  .kpi-icon.violet { background: rgba(139, 92, 246, 0.1); color: #a78bfa; }
  .kpi-icon.emerald { background: rgba(16, 185, 129, 0.1); color: #34d399; }
  .kpi-icon.amber { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
  .kpi-icon.indigo { background: rgba(79, 70, 229, 0.1); color: #818cf8; }

  .kpi-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .kpi-value-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .kpi-value {
    font-size: 2.25rem;
    font-weight: 800;
    font-family: 'Outfit', sans-serif;
  }

  .unit {
    color: #475569;
    font-weight: 700;
  }

  .kpi-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
  }

  .kpi-trend.up { background: rgba(16, 185, 129, 0.1); color: #10b981; }
  .kpi-trend.stable { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }

  .kpi-desc {
    font-size: 0.75rem;
    color: #475569;
    margin: 0.5rem 0 0 0;
    font-weight: 600;
  }

  .card-glow {
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Main Grid */
  .main-grid {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 2rem;
  }

  .content-panel {
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .panel-header {
    padding: 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .icon-box {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: #94a3b8;
  }

  .icon-box.violet { background: rgba(139, 92, 246, 0.1); color: #a78bfa; }
  .icon-box.emerald { background: rgba(16, 185, 129, 0.1); color: #34d399; }

  .panel-title h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
  }

  .panel-title p {
    font-size: 0.7rem;
    color: #475569;
    margin: 0.1rem 0 0 0;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .panel-body {
    padding: 2rem;
    flex-grow: 1;
  }

  /* Schools Panel */
  .school-list {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .school-item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .school-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .school-name {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1.05rem;
    color: #e2e8f0;
  }

  .school-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    font-weight: 800;
  }

  .school-meta .count { color: #64748b; }
  .school-meta .percent { color: #8b5cf6; }

  .progress-track {
    height: 8px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 100px;
    overflow: hidden;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6366f1, #a855f7);
    border-radius: 100px;
    position: relative;
    transition: width 1s ease-out;
  }

  .fill-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: sweep 3s infinite linear;
  }

  /* Sidebar Panels */
  .sidebar-panels {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .level-stats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .level-pill {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 16px;
    padding: 1rem;
  }

  .level-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .level-name {
    font-size: 0.75rem;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .level-count {
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    color: white;
  }

  .level-bar-wrap {
    height: 4px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  .level-bar {
    height: 100%;
    background: #8b5cf6;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
  }

  /* Growth Panel */
  .growth-display {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .growth-circle {
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }

  .svg-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .circular-chart {
    display: block;
    margin: 0 auto;
    width: 100%;
    height: 100%;
  }

  .circle-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.05);
    stroke-width: 3.8;
  }

  .circle {
    fill: none;
    stroke-width: 3.8;
    stroke-linecap: round;
    stroke: #8b5cf6;
    transition: stroke-dasharray 1s ease-out;
  }

  .circle-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .circle-content .val {
    font-family: 'Outfit', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
  }

  .circle-content .lab {
    font-size: 0.65rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
  }

  .growth-info {
    flex-grow: 1;
  }

  .growth-desc {
    font-size: 0.9rem;
    color: #64748b;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.8rem;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .status-badge.positive {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }

  /* Utils */
  .empty-state {
    height: 100%;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #1e293b;
    gap: 1.5rem;
  }

  .empty-state :global(svg) {
    font-size: 5rem;
    opacity: 0.2;
  }

  .empty-state p {
    font-size: 0.9rem;
    font-style: italic;
    color: #475569;
  }

  .scroll-visual {
    overflow-y: auto;
    max-height: 500px;
  }

  .scroll-visual::-webkit-scrollbar { width: 4px; }
  .scroll-visual::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

  @keyframes pulse-glow {
    from { opacity: 0.4; transform: scale(0.9); }
    to { opacity: 0.6; transform: scale(1.1); }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @keyframes sweep {
    from { transform: translateX(-100%); }
    to { transform: translateX(200%); }
  }

  @media (max-width: 1024px) {
    .main-grid {
      grid-template-columns: 1fr;
    }
    
    .reports-container {
      padding: 1rem;
    }

    .kpi-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 640px) {
    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .kpi-grid {
      grid-template-columns: 1fr;
    }

    .title-wrap h1 {
      font-size: 2.25rem;
    }
  }
</style>
