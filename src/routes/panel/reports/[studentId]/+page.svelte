<script lang="ts">
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    IdentificationCard,
    CalendarBlank,
    Clock,
    TrendUp,
    TrendDown,
    Target,
    BookOpen,
    Trophy,
    CurrencyEur,
    Phone,
    EnvelopeSimple,
    MapPin,
    CheckCircle,
    Warning,
    XCircle,
     Medal,
     ChartBar,
    ChartPieSlice,
    Users,
    Buildings,
    FileText,
    Star,
    Lightning,
    Timer,
    CaretRight,
    MagnifyingGlass,
    DownloadSimple,
    ShareNetwork,
    Briefcase,
    Stack,
    Pulse
  } from 'phosphor-svelte';
  import type { PageData } from './$types';
  import { fade, fly, scale } from 'svelte/transition';
  import { t, locale } from '$lib/i18n';

  let { data } = $props<{ data: PageData }>();

  let selectedTab = $state<'overview' | 'attendance' | 'skills' | 'payments' | 'tournaments' | 'timeline'>('overview');
  let hoveredKpi = $state<string | null>(null);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString($locale === 'es' ? 'es-ES' : 'en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat($locale === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'P': return CheckCircle;
      case 'T': return Clock;
      case 'A': return XCircle;
      default: return Warning;
    }
  };

  const getAttendanceTheme = (status: string) => {
    switch (status) {
      case 'P': return 'violet';
      case 'T': return 'amber';
      case 'A': return 'rose';
      default: return 'slate';
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const report = $derived(data.report);
  const student = $derived(report?.student);
  const progress = $derived(report?.progress_summary);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Stack },
    { id: 'attendance', label: 'Attendance', icon: CalendarBlank },
    { id: 'skills', label: 'Syllabus', icon: Lightning },
    { id: 'payments', label: 'Payments', icon: CurrencyEur },
    { id: 'tournaments', label: 'Competitions', icon: Trophy },
    { id: 'timeline', label: 'Activity', icon: Timer },
  ] as const;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance': return CalendarBlank;
      case 'skill': return Lightning;
      case 'payment': return CurrencyEur;
      case 'tournament': return Trophy;
      default: return Pulse;
    }
  };
</script>

<svelte:head>
  <title>{student?.name ? `${student.name} - ${$t('reports.title')}` : $t('reports.title')} | ChessNet</title>
</svelte:head>

<div class="report-detail-container" in:fade={{ duration: 400 }}>
  {#if !report}
    <div class="empty-layout" in:fade>
      <div class="error-glass">
        <div class="error-icon">
          <Warning weight="duotone" />
        </div>
        <div class="error-text">
          <h2>{$t('reports.not_found')}</h2>
          <p>{$t('reports.not_found_desc')}</p>
        </div>
        <button onclick={() => goto('/panel/reports')} class="back-btn">
          <ArrowLeft />
          {$t('common.back')}
        </button>
      </div>
    </div>
  {:else}
    <!-- Top Action Bar -->
    <nav class="action-bar" in:fly={{ y: -20, duration: 600 }}>
      <button onclick={() => goto('/panel/reports')} class="icon-btn-back">
        <ArrowLeft weight="bold" />
      </button>
      
      <div class="action-group">
        <button class="secondary-btn">
          <ShareNetwork weight="bold" />
        </button>
        <button class="secondary-btn">
          <DownloadSimple weight="bold" />
        </button>
        <button class="primary-btn">
          <FileText weight="fill" />
          <span>{$t('reports.generate_pdf')}</span>
        </button>
      </div>
    </nav>

    <!-- Header Section -->
    <header class="profile-header">
      <div class="profile-main">
        <div class="avatar-orb-wrap">
          <div class="avatar-orb">
            <span class="initial">{student.name.charAt(0)}</span>
            <div class="orb-glow"></div>
            <div class="status-indicator {student.status === 'active' ? 'active' : 'inactive'}"></div>
          </div>
        </div>
        
        <div class="profile-info">
          <div class="name-row">
            <h1>{student.name}</h1>
            <span class="verified-badge">
              <CheckCircle weight="fill" />
              {$t('reports.common.verified')}
            </span>
          </div>
          
          <div class="meta-row">
            <div class="meta-item">
              <Buildings weight="duotone" class="text-violet-400" />
              <span>{report.school.name}</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <CalendarBlank weight="duotone" class="text-violet-400" />
              <span>{calculateAge(student.date_of_birth)} {$t('reports.years')}</span>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-item">
              <Clock weight="duotone" class="text-amber-400" />
              <span>{$t('reports.active_since')} {formatDate(progress.enrollment_date)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- KPI Metrics Grid -->
    <section class="kpi-metrics-grid">
      <div 
        class="metric-card violet"
        class:active={hoveredKpi === 'attendance'}
        onmouseenter={() => hoveredKpi = 'attendance'}
        onmouseleave={() => hoveredKpi = null}
        role="region"
      >
        <div class="card-content">
          <span class="card-label">{$t('reports.metrics.attendance')}</span>
          <div class="card-value-wrap">
            <span class="card-value">{progress.attendance_rate.toFixed(1)}%</span>
            <div class="card-icon">
              <Pulse weight="duotone" />
            </div>
          </div>
        </div>
        <div class="card-bg-glow"></div>
      </div>

      <div 
        class="metric-card violet"
        class:active={hoveredKpi === 'rating'}
        onmouseenter={() => hoveredKpi = 'rating'}
        onmouseleave={() => hoveredKpi = null}
        role="region"
      >
        <div class="card-content">
          <span class="card-label">{$t('reports.metrics.rating')}</span>
          <div class="card-value-wrap">
            <div class="value-group">
              <span class="card-value">{progress.current_rating}</span>
              <span class="trend {progress.rating_change >= 0 ? 'up' : 'down'}">
                {#if progress.rating_change >= 0}
                  <TrendUp weight="bold" />
                {:else}
                  <TrendDown weight="bold" />
                {/if}
                {Math.abs(progress.rating_change)}
              </span>
            </div>
            <div class="card-icon">
              <Trophy weight="duotone" />
            </div>
          </div>
        </div>
        <div class="card-bg-glow"></div>
      </div>

      <div 
        class="metric-card amber"
        class:active={hoveredKpi === 'skills'}
        onmouseenter={() => hoveredKpi = 'skills'}
        onmouseleave={() => hoveredKpi = null}
        role="region"
      >
        <div class="card-content">
          <span class="card-label">{$t('reports.metrics.skills')}</span>
          <div class="card-value-wrap">
            <span class="card-value">{progress.skill_completion_rate.toFixed(1)}%</span>
            <div class="card-icon">
              <Lightning weight="duotone" />
            </div>
          </div>
        </div>
        <div class="card-bg-glow"></div>
      </div>

      <div 
        class="metric-card violet"
        class:active={hoveredKpi === 'balance'}
        onmouseenter={() => hoveredKpi = 'balance'}
        onmouseleave={() => hoveredKpi = null}
        role="region"
      >
        <div class="card-content">
          <span class="card-label">{$t('reports.metrics.balance')}</span>
          <div class="card-value-wrap">
            <span class="card-value">
              {progress.overdue_payments > 0 ? `-${progress.overdue_payments}` : $t('reports.common.ok')}
            </span>
            <div class="card-icon">
              <CurrencyEur weight="duotone" />
            </div>
          </div>
        </div>
        <div class="card-bg-glow"></div>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <div class="tabs-container">
      <div class="tabs-scroll">
        {#each tabs as tab}
          <button 
            onclick={() => selectedTab = tab.id}
            class="tab-btn"
            class:active={selectedTab === tab.id}
          >
            <tab.icon weight={selectedTab === tab.id ? 'fill' : 'bold'} />
            <span class="tab-label">{$t(`reports.tabs.${tab.id}`)}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Main Content Area -->
    {#key selectedTab}
      <main class="content-wrapper" in:fade={{ duration: 300 }}>
      {#if selectedTab === 'overview'}
        <div class="overview-grid">
          <!-- Contact & Notes -->
          <div class="bento-column">
            <div class="bento-card contact-card">
              <div class="card-header">
                <IdentificationCard weight="duotone" />
                <h3>{$t('reports.contact.title')}</h3>
              </div>
              <div class="card-body contact-grid">
                <div class="info-group">
                  <span class="label">{$t('reports.contact.email')}</span>
                  <div class="info-val">
                    <EnvelopeSimple />
                    <span>{student.email}</span>
                  </div>
                </div>
                <div class="info-group">
                  <span class="label">{$t('reports.contact.phone')}</span>
                  <div class="info-val">
                    <Phone />
                    <span>{student.phone}</span>
                  </div>
                </div>
                <div class="info-group">
                  <span class="label">{$t('reports.contact.birth')}</span>
                  <div class="info-val">
                    <CalendarBlank />
                    <span>{formatDate(student.date_of_birth)}</span>
                  </div>
                </div>
                <div class="info-group">
                  <span class="label">{$t('reports.contact.last_activity')}</span>
                  <div class="info-val">
                    <Pulse />
                    <span>{formatDate(progress.last_activity_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {#if student.instructor_notes}
              <div class="bento-card notes-card">
                <div class="card-header">
                  <FileText weight="duotone" class="text-amber-400" />
                  <h3>{$t('reports.observations.title')}</h3>
                </div>
                <div class="card-body">
                  <blockquote class="instructor-note">
                    <BookOpen class="quote-icon" />
                    <p>"{student.instructor_notes}"</p>
                  </blockquote>
                </div>
              </div>
            {/if}

            <div class="bento-card groups-card">
              <div class="card-header">
                <Stack weight="duotone" class="text-blue-400" />
                <h3>{$t('reports.programs.title')}</h3>
              </div>
              <div class="card-body groups-grid">
                {#each report.classes as cls}
                  <div class="group-item">
                    <div class="group-info">
                      <span class="group-name">{cls.name}</span>
                      <span class="group-price">{formatCurrency(cls.price)}<small>/{$t('reports.programs.per_month')}</small></span>
                    </div>
                    <div class="group-schedule">
                      <Clock weight="bold" />
                      <span>{cls.schedule}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          </div>

          <!-- Progress Charts -->
          <div class="charts-column">
            <div class="bento-card history-card">
              <div class="card-header">
                <ChartBar weight="duotone" />
                <h3>{$t('reports.history.rating')}</h3>
              </div>
              <div class="card-body history-list scroll-visual">
                {#each report.rating_history as entry}
                  <div class="history-item">
                    <div class="history-main">
                      <span class="history-event">{entry.event}</span>
                      <span class="history-date">{formatDate(entry.date)}</span>
                    </div>
                    <div class="history-value">
                      <span class="val">{entry.rating}</span>
                      <span class="change {entry.change >= 0 ? 'pos' : 'neg'}">
                        {entry.change >= 0 ? '+' : ''}{entry.change}
                      </span>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <div class="bento-card syllabus-card">
              <div class="card-header">
                <ChartPieSlice weight="duotone" class="text-violet-400" />
                <h3>{$t('reports.skills.status')}</h3>
              </div>
              <div class="card-body syllabus-progress">
                <div class="progress-item mastered">
                  <div class="item-header">
                    <span>{$t('reports.skills.mastered')}</span>
                    <span class="count">{report.skills?.filter((s: any) => s.status === 'completed').length || 0} / {report.skills?.length || 0}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width: {progress.total_skills_assigned > 0 ? (progress.skills_mastered/progress.total_skills_assigned)*100 : 0}%"></div>
                  </div>
                </div>

                <div class="progress-item study">
                  <div class="item-header">
                    <span>{$t('reports.skills.in_progress')}</span>
                    <span class="count">{progress.skills_in_progress}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width: {progress.total_skills_assigned > 0 ? (progress.skills_in_progress/progress.total_skills_assigned)*100 : 0}%"></div>
                  </div>
                </div>

                <div class="progress-item pending">
                  <div class="item-header">
                    <span>{$t('reports.skills.pending')}</span>
                    <span class="count">{progress.total_skills_assigned - progress.skills_mastered - progress.skills_in_progress}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width: {progress.total_skills_assigned > 0 ? ((progress.total_skills_assigned - progress.skills_mastered - progress.skills_in_progress)/progress.total_skills_assigned)*100 : 0}%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      {#if selectedTab === 'attendance'}
        <div class="attendance-layout">
          <div class="attendance-stats">
            <div class="stat-pill">
              <span class="val">{progress.attended_sessions}</span>
              <span class="label">{$t('reports.attendance.present')}</span>
            </div>
            <div class="stat-pill amber">
              <span class="val">{progress.late_sessions}</span>
              <span class="label">{$t('reports.attendance.late')}</span>
            </div>
            <div class="stat-pill rose">
              <span class="val">{progress.absent_sessions}</span>
              <span class="label">{$t('reports.attendance.absent')}</span>
            </div>
            <div class="stat-pill violet">
              <span class="val">{progress.punctuality_rate.toFixed(0)}%</span>
              <span class="label">{$t('reports.attendance.punctuality')}</span>
            </div>
          </div>

          <div class="bento-card">
            <div class="card-header">
              <CalendarBlank weight="duotone" />
              <h3>{$t('reports.attendance.record')}</h3>
            </div>
            <div class="attendance-log">
              {#each report.attendance_history as h}
                {@const Icon = getAttendanceIcon(h.status)}
                {@const theme = getAttendanceTheme(h.status)}
                <div class="log-item {theme}">
                  <div class="log-info">
                    <div class="status-box">
                      <Icon weight="fill" />
                    </div>
                    <div class="log-text">
                      <span class="date">{formatDate(h.date)}</span>
                      <span class="status-label">
                        {h.status === 'P' ? $t('reports.attendance.present') : h.status === 'T' ? $t('reports.attendance.late') : $t('reports.attendance.absent')}
                      </span>
                    </div>
                  </div>
                  {#if h.notes}
                    <div class="log-note">
                      <span>"{h.notes}"</span>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      {#if selectedTab === 'skills'}
        <div class="skills-layout">
          <div class="category-summary">
            {#each ['fundamentals', 'tactics', 'endgames'] as category}
              {@const catSkills = (report.skills_progress as any[]).filter(s => s.category.toLowerCase() === category.toLowerCase())}
              {@const completed = catSkills.filter(s => s.status === 'completed').length}
              {@const ratio = (completed / (catSkills.length || 1)) * 100}
              <div class="category-card">
                <div class="cat-label">{$t(`reports.skills.categories.${category}`)}</div>
                <div class="cat-main">
                  <span class="cat-count">{completed} / {catSkills.length}</span>
                  <div class="progress-circle">
                    <svg viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" class="track" />
                      <circle cx="18" cy="18" r="16" class="fill" style="stroke-dasharray: {ratio}, 100" />
                    </svg>
                    <span class="percent">{ratio.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <div class="skills-grid">
            {#each report.skills_progress as skill}
              <div class="skill-entry {skill.status}">
                <div class="skill-header">
                  <div class="skill-title">
                    <h4>{skill.skill_name}</h4>
                    <span class="category-tag">{skill.category}</span>
                  </div>
                  <span class="status-pill">
                    {skill.status === 'completed' ? $t('reports.skills.completed') : skill.status === 'in_progress' ? $t('reports.skills.in_progress') : $t('reports.skills.not_started')}
                  </span>
                </div>
                
                {#if skill.notes}
                  <p class="skill-note">"{skill.notes}"</p>
                {/if}

                <div class="skill-meta">
                  <div class="skill-levels">
                    <span class="lv-label">{$t('reports.skills.level')}</span>
                    <span class="lv-val">{skill.level} / {skill.max_level}</span>
                  </div>
                  {#if skill.completion_date}
                    <span class="completion-date">{formatDate(skill.completion_date)}</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if selectedTab === 'payments'}
        <div class="payments-layout">
          <div class="metric-row">
            <div class="stat-pill">
              <span class="val">{progress.total_payments}</span>
              <span class="label">{$t('reports.payments.issued')}</span>
            </div>
            <div class="stat-pill violet">
              <span class="val">{progress.paid_payments}</span>
              <span class="label">{$t('reports.payments.settled')}</span>
            </div>
            <div class="stat-pill rose">
              <span class="val">{progress.overdue_payments}</span>
              <span class="label">{$t('reports.payments.overdue')}</span>
            </div>
            <div class="stat-pill violet">
              <span class="val">{progress.payment_compliance.toFixed(0)}%</span>
              <span class="label">{$t('reports.payments.compliance')}</span>
            </div>
          </div>

          <div class="bento-card">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>{$t('reports.payments.concept')}</th>
                    <th>{$t('reports.payments.amount')}</th>
                    <th>{$t('reports.payments.status')}</th>
                    <th class="text-right">{$t('reports.payments.reference')}</th>
                  </tr>
                </thead>
                <tbody>
                  {#each report.payment_history as pay}
                    <tr class={pay.status}>
                      <td>
                        <div class="concept-cell">
                          <span class="desc">{pay.description}</span>
                          <span class="due">{$t('reports.payments.due')}: {formatDate(pay.due_date)}</span>
                        </div>
                      </td>
                      <td class="amount">{formatCurrency(pay.amount)}</td>
                      <td>
                        <span class="status-badge {pay.status}">
                          {pay.status === 'paid' ? $t('reports.payments.settled') : pay.status === 'overdue' ? $t('reports.payments.overdue') : $t('reports.payments.pending')}
                        </span>
                      </td>
                      <td class="text-right reference">
                        <span>{pay.payment_reference || '---'}</span>
                        {#if pay.paid_date}
                          <small>{$t('reports.payments.paid')}: {formatDate(pay.paid_date)}</small>
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {/if}

      {#if selectedTab === 'tournaments'}
         <div class="tournaments-layout">
            {#if report.tournament_history.length > 0}
               <div class="metric-row">
                  <div class="stat-pill amber">
                     <span class="val">{progress.tournaments_participated}</span>
                     <span class="label">{$t('reports.tournaments.played')}</span>
                  </div>
                  <div class="stat-pill violet">
                     <span class="val">{progress.tournament_wins}</span>
                     <span class="label">{$t('reports.tournaments.wins')}</span>
                  </div>
                  <div class="stat-pill slate">
                     <span class="val">{progress.tournament_draws}</span>
                     <span class="label">{$t('reports.tournaments.draws')}</span>
                  </div>
                  <div class="stat-pill rose">
                     <span class="val">{progress.tournament_losses}</span>
                     <span class="label">{$t('reports.tournaments.losses')}</span>
                  </div>
               </div>

               <div class="tournaments-stack">
                  {#each report.tournament_history as tmnt}
                     <div class="tournament-panel">
                        <div class="panel-header">
                           <div class="tmnt-info">
                              <h3>{tmnt.name}</h3>
                              <div class="tmnt-meta">
                                 <span>{formatDate(tmnt.date)}</span>
                                 <div class="dot"></div>
                                 <span>{tmnt.format}</span>
                                 <div class="dot"></div>
                                 <span>{tmnt.participants} {$t('reports.tournaments.participants')}</span>
                              </div>
                           </div>
                           <div class="tmnt-result">
                              <div class="pos">{$t('reports.tournaments.position')}: <b>{tmnt.final_position}</b> <small>/ {tmnt.participants}</small></div>
                              <div class="pts">{$t('reports.tournaments.score')}: {tmnt.points} PTS</div>
                           </div>
                        </div>
                        <div class="panel-body">
                           <div class="games-grid">
                              {#each tmnt.games as g}
                                 <div class="game-card {g.result === '1-0' ? 'win' : g.result === '0-1' ? 'loss' : 'draw'}">
                                    <div class="game-header">
                                       <span class="round">{$t('reports.common.round_short')}{g.round}</span>
                                       <span class="result-badge">
                                          {g.result === '1-0' ? $t('reports.tournaments.wins') : g.result === '0-1' ? $t('reports.tournaments.losses') : $t('reports.tournaments.draws')}
                                       </span>
                                    </div>
                                    <div class="game-main">
                                       <span class="opponent">{g.opponent}</span>
                                       <span class="rating">ELO: {g.opponent_rating}</span>
                                    </div>
                                    <div class="game-meta">
                                       <span class="color">{g.color === 'white' ? '⚪' : '⚫'} {g.color === 'white' ? $t('reports.tournaments.color_white') : $t('reports.tournaments.color_black')}</span>
                                    </div>
                                 </div>
                              {/each}
                           </div>
                        </div>
                     </div>
                  {/each}
               </div>
            {:else}
               <div class="empty-notif">
                  <div class="notif-icon"><Trophy weight="duotone" /></div>
                  <h4>{$t('reports.no_history')}</h4>
                  <p>{$t('reports.no_history_desc')}</p>
               </div>
            {/if}
         </div>
      {/if}

      {#if selectedTab === 'timeline'}
         <div class="timeline-layout">
            <div class="timeline-container">
               <div class="timeline-line"></div>
               <div class="timeline-events">
                  {#each report.activity_timeline as act}
                     {@const ActIcon = getActivityIcon(act.type)}
                     <div class="event-entry {act.status}">
                        <div class="event-marker">
                           <div class="marker-dot"></div>
                        </div>
                        <div class="event-glass">
                           <div class="event-header">
                              <div class="event-title">
                                 <div class="icon-wrap"><ActIcon /></div>
                                 <h4>{act.title}</h4>
                              </div>
                              <span class="event-date">{formatDate(act.date)}</span>
                           </div>
                           <p class="event-desc">{act.description}</p>
                           
                           {#if act.details && Object.keys(act.details).length > 0}
                              <div class="event-details">
                                 {#each Object.entries(act.details) as [key, value]}
                                    <div class="detail-pill">
                                       <span class="lab">{key}</span>
                                       <span class="val">{value}</span>
                                    </div>
                                 {/each}
                              </div>
                           {/if}
                        </div>
                     </div>
                  {/each}
               </div>
            </div>
         </div>
       {/if}
      </main>
    {/key}
  {/if}
</div>

<style>
  .report-detail-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    color: white;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* Navigation Bar */
  .action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .icon-btn-back {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    transition: all 0.3s;
  }

  .icon-btn-back:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    transform: translateX(-3px);
  }

  .action-group {
    display: flex;
    gap: 0.75rem;
  }

  .secondary-btn {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s;
  }

  .secondary-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .primary-btn {
    background: #a78bfa;
    color: black;
    padding: 0 1.5rem;
    height: 44px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3);
  }

  .primary-btn:hover {
    background: #c4b5fd;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(167, 139, 250, 0.4);
  }

  /* Header Section */
  .profile-header {
    margin-bottom: 3rem;
  }

  .profile-main {
    display: flex;
    align-items: center;
    gap: 2.5rem;
  }

  .avatar-orb-wrap {
    position: relative;
  }

  .avatar-orb {
    width: 110px;
    height: 110px;
    background: rgba(167, 139, 250, 0.1);
    border: 2px solid rgba(167, 139, 250, 0.2);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
  }

  .avatar-orb .initial {
    font-family: 'Outfit', sans-serif;
    font-size: 3rem;
    font-weight: 900;
    color: #a78bfa;
  }

  .orb-glow {
    position: absolute;
    inset: -15px;
    background: radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%);
    filter: blur(20px);
    z-index: -1;
  }

  .status-indicator {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 24px;
    height: 24px;
    border: 4px solid #020617;
    border-radius: 0px;
  }

  .status-indicator.active {
    background: #a78bfa;
    box-shadow: 0 0 10px #a78bfa;
  }

  .profile-info h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -2px;
    background: linear-gradient(to bottom, #fff, #94a3b8);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    line-height: 1;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }

  .verified-badge {
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    color: #a78bfa;
    padding: 0.4rem 0.8rem;
    border-radius: 0px;
    font-size: 0.65rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .meta-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.85rem;
    font-weight: 700;
    color: #64748b;
  }

  .meta-divider {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0px;
  }

  /* KPI Grid */
  .kpi-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .metric-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    padding: 1.75rem;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .metric-card.active {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .metric-card.violet { border-left: 4px solid #a78bfa; }
  .metric-card.amber { border-left: 4px solid #f59e0b; }
  .metric-card.rose { border-left: 4px solid #f43f5e; }
  .metric-card.indigo { border-left: 4px solid #a78bfa; }

  .card-label {
    display: block;
    font-size: 0.65rem;
    font-weight: 800;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.75rem;
  }

  .card-value-wrap {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .card-value {
    font-family: 'Outfit', sans-serif;
    font-size: 2.25rem;
    font-weight: 800;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #64748b;
  }

  .metric-card.violet .card-icon { color: #a78bfa; background: rgba(167, 139, 250, 0.1); }
  .metric-card.amber .card-icon { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
  .metric-card.rose .card-icon { color: #f43f5e; background: rgba(244, 63, 94, 0.1); }

  .value-group {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .trend {
    padding: 0.2rem 0.5rem;
    border-radius: 0px;
    font-size: 0.7rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .trend.up { background: rgba(139, 92, 246, 0.1); color: #a78bfa; }
  .trend.down { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }

  /* Tabs Section */
  .tabs-container {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    padding: 0.5rem;
    margin-bottom: 3rem;
  }

  .tabs-scroll {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }

  .tab-btn {
    flex: 1;
    min-width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-radius: 0px;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    transition: all 0.3s;
  }

  .tab-btn:hover {
    color: white;
    background: rgba(255, 255, 255, 0.05);
  }

  .tab-btn.active {
    background: #a78bfa;
    color: black;
    box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3);
  }

  /* Bento Layouts */
  .overview-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 2rem;
  }

  .bento-column, .charts-column {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .bento-card {
    background: rgba(30, 41, 59, 0.3);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    overflow: hidden;
  }

  .card-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .card-header h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
  }

  .card-header :global(svg) {
    font-size: 1.25rem;
    color: #94a3b8;
  }

  .card-body {
    padding: 2rem;
  }

  /* Contact Card */
  .contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .info-group .label {
    display: block;
    font-size: 0.65rem;
    font-weight: 800;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .info-val {
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .info-val :global(svg) {
    color: #a78bfa;
    font-size: 1.1rem;
  }

  /* Notes Card */
  .instructor-note {
    position: relative;
    background: rgba(245, 158, 11, 0.05);
    border: 1px solid rgba(245, 158, 11, 0.1);
    border-radius: 0px;
    padding: 1.5rem 2rem;
    margin: 0;
  }

  .quote-icon {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    font-size: 3rem;
    color: rgba(245, 158, 11, 0.1);
  }

  .instructor-note p {
    font-style: italic;
    color: #d1d5db;
    line-height: 1.6;
    font-size: 0.95rem;
    margin: 0;
    position: relative;
    z-index: 1;
  }

  /* Groups Card */
  .groups-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .group-item {
    background: rgba(15, 23, 42, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    padding: 1.25rem;
    transition: all 0.3s;
  }

  .group-item:hover {
    border-color: rgba(96, 165, 250, 0.3);
    background: rgba(15, 23, 42, 0.5);
  }

  .group-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .group-name {
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.95rem;
  }

  .group-price {
    color: #60a5fa;
    font-weight: 800;
  }

  .group-price small {
    font-size: 0.6rem;
    margin-left: 2px;
  }

  .group-schedule {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 600;
  }

  /* History Card */
  .history-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 0 1rem;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  }

  .history-main {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .history-event {
    font-weight: 700;
    font-size: 0.9rem;
  }

  .history-date {
    font-size: 0.7rem;
    font-weight: 800;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .history-value {
    text-align: right;
  }

  .history-value .val {
    display: block;
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
  }

  .history-value .change {
    font-size: 0.75rem;
    font-weight: 800;
  }

  .change.pos { color: #a78bfa; }
  .change.neg { color: #f43f5e; }

  /* Syllabus Progress */
  .syllabus-progress {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .progress-item .item-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .mastered .item-header { color: #a855f7; }
  .study .item-header { color: #3b82f6; }
  .pending .item-header { color: #475569; }

  .progress-track {
    height: 8px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 0px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 0px;
    transition: width 1s ease-out;
  }

  .mastered .progress-fill { background: #a78bfa; box-shadow: 0 0 10px rgba(167, 139, 250, 0.4); }
  .study .progress-fill { background: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.4); }
  .pending .progress-fill { background: #334155; }

  /* Attendance Log */
  .attendance-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-pill {
    background: rgba(30, 41, 59, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    padding: 1.5rem;
    text-align: center;
  }

  .stat-pill .val {
    display: block;
    font-family: 'Outfit', sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.25rem;
  }

  .stat-pill .label {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748b;
  }

  .stat-pill.amber .val { color: #f59e0b; }
  .stat-pill.rose .val { color: #f43f5e; }
  .stat-pill.violet .val { color: #a78bfa; }

  .attendance-log {
    display: flex;
    flex-direction: column;
  }

  .log-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    transition: all 0.3s;
  }

  .log-item:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .log-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .status-box {
    width: 44px;
    height: 44px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }

  .log-item.violet .status-box { background: rgba(167, 139, 250, 0.1); color: #a78bfa; }
  .log-item.amber .status-box { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
  .log-item.rose .status-box { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }

  .log-text {
    display: flex;
    flex-direction: column;
  }

  .log-text .date {
    font-weight: 800;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: -0.5px;
  }

  .status-label {
    font-size: 0.7rem;
    font-weight: 800;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .log-note {
    background: rgba(15, 23, 42, 0.5);
    padding: 0.75rem 1.25rem;
    border-radius: 0px;
    font-size: 0.85rem;
    color: #94a3b8;
    font-style: italic;
    max-width: 400px;
  }

  /* Skills View */
  .category-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .category-card {
    background: rgba(30, 41, 59, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    padding: 2rem;
  }

  .cat-label {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    color: #64748b;
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .cat-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .cat-count {
    font-family: 'Outfit', sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
  }

  .progress-circle {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 0px;
  }

  .progress-circle svg {
    transform: rotate(-90deg);
  }

  .progress-circle circle {
    fill: none;
    stroke-width: 4;
  }

  .progress-circle .track { stroke: rgba(255, 255, 255, 0.05); }
  .progress-circle .fill { 
    stroke: #a78bfa; 
    stroke-linecap: square;
    transition: stroke-dasharray 1s ease-out;
  }

  .progress-circle .percent {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .skill-entry {
    background: rgba(30, 41, 59, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    padding: 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .skill-entry.completed { border-left: 6px solid #a78bfa; }
  .skill-entry.in_progress { border-left: 6px solid #3b82f6; }

  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .skill-title h4 {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin: 0 0 0.25rem 0;
  }

  .category-tag {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #475569;
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 0.2rem 0.5rem;
    border-radius: 0px;
  }

  .status-pill {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.03);
    padding: 0.5rem 1rem;
    border-radius: 0px;
  }

  .completed .status-pill { background: rgba(167, 139, 250, 0.1); color: #a78bfa; }

  .skill-note {
    font-style: italic;
    color: #94a3b8;
    font-size: 0.9rem;
    margin: 0;
  }

  .skill-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.03);
    padding-top: 1rem;
  }

  .skill-levels {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .lv-label { font-size: 0.65rem; font-weight: 800; color: #475569; text-transform: uppercase; }
  .lv-val { font-weight: 800; color: #e2e8f0; }

  .completion-date {
    font-size: 0.7rem;
    font-weight: 800;
    color: #475569;
    text-transform: uppercase;
  }

  /* Payments Table */
  .table-container {
    padding: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    padding: 1.5rem 2rem;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #475569;
    letter-spacing: 0.15rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  td {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  }

  .concept-cell {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .concept-cell .desc { font-weight: 700; font-size: 1rem; }
  .concept-cell .due { font-size: 0.65rem; color: #475569; text-transform: uppercase; font-weight: 800; }

  .amount { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.1rem; }

  .status-badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 0px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
  }

  .status-badge.paid { background: rgba(167, 139, 250, 0.1); color: #a78bfa; }
  .status-badge.overdue { background: rgba(244, 63, 94, 0.1); color: #f43f5e; box-shadow: 0 0 15px rgba(244, 63, 94, 0.1); }
  .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

  .reference { display: flex; flex-direction: column; gap: 0.2rem; }
  .reference span { font-weight: 700; color: #64748b; font-size: 0.8rem; }
  .reference small { font-size: 0.6rem; color: #475569; font-weight: 800; text-transform: uppercase; }

  /* Tournaments Section */
  .tournaments-stack {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .tournament-panel {
    background: rgba(30, 41, 59, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    overflow: hidden;
  }

  .tournament-panel .panel-header {
    background: rgba(255, 255, 255, 0.01);
    padding: 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tmnt-info h3 {
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -1px;
    margin: 0 0 0.5rem 0;
  }

  .tmnt-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #475569;
    letter-spacing: 0.05em;
  }

  .tmnt-meta .dot { width: 4px; height: 4px; border-radius: 50%; background: #334155; }

  .tmnt-result { text-align: right; }
  .tmnt-result .pos { font-size: 1.5rem; font-weight: 600; }
  .tmnt-result .pos b { color: #a78bfa; font-size: 2rem; font-family: 'Outfit'; }
  .tmnt-result .pts { font-size: 0.75rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-top: 0.25rem; }

  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 2.5rem;
  }

  .game-card {
    background: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 0px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: all 0.3s;
  }

  .game-card:hover { transform: translateY(-3px); border-color: rgba(255, 255, 255, 0.1); }

  .game-header { display: flex; justify-content: space-between; align-items: center; }
  .game-header .round { 
    background: #020617; 
    padding: 0.3rem 0.6rem; 
    border-radius: 0px; 
    font-size: 0.65rem; 
    font-weight: 800; 
  }

  .result-badge { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; padding: 0.2rem 0.5rem; border-radius: 0px; }
  .win .result-badge { background: rgba(167, 139, 250, 0.1); color: #a78bfa; }
  .loss .result-badge { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
  .draw .result-badge { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

  .game-main { display: flex; flex-direction: column; }
  .game-main .opponent { font-weight: 800; font-size: 1rem; }
  .game-main .rating { font-size: 0.7rem; color: #475569; font-weight: 700; margin-top: 0.15rem; }

  .game-meta { border-top: 1px solid rgba(255, 255, 255, 0.03); padding-top: 0.75rem; color: #64748b; font-size: 0.75rem; font-weight: 700; }

  /* Timeline View */
  .timeline-layout {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .timeline-container { position: relative; }
  .timeline-line { position: absolute; left: 1.5rem; top: 0; bottom: 0; width: 1px; background: rgba(255, 255, 255, 0.05); }

  .event-entry { position: relative; padding-left: 4.5rem; margin-bottom: 4rem; }
  .event-marker { position: absolute; left: 1rem; top: 0.5rem; }
  .marker-dot { 
    width: 1rem; height: 1rem; border-radius: 0px; 
    background: #1e293b; border: 3px solid #334155; 
    transition: all 0.3s;
  }

  .event-entry:hover .marker-dot { transform: scale(1.4); }

  .event-entry.positive .marker-dot { background: #a78bfa; box-shadow: 0 0 10px #a78bfa; }
  .event-entry.negative .marker-dot { background: #f43f5e; box-shadow: 0 0 10px #f43f5e; }
  .event-entry.neutral .marker-dot { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }

  .event-glass {
    background: rgba(30, 41, 59, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 0px;
    padding: 2rem;
    transition: all 0.3s;
  }

  .event-entry:hover .event-glass { border-color: rgba(255, 255, 255, 0.08); background: rgba(30, 41, 59, 0.3); }

  .event-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .event-title { display: flex; align-items: center; gap: 1rem; }
  .icon-wrap { 
    width: 36px; height: 36px; border-radius: 0px; 
    background: rgba(255, 255, 255, 0.03); 
    display: flex; align-items: center; justify-content: center; 
    color: #64748b;
  }

  .event-title h4 { font-weight: 800; font-size: 1.1rem; margin: 0; }
  .event-date { font-size: 0.7rem; font-weight: 800; color: #475569; text-transform: uppercase; }

  .event-desc { font-size: 0.95rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem; }

  .event-details { display: flex; flex-wrap: wrap; gap: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.03); padding-top: 1.25rem; }
  .detail-pill { display: flex; flex-direction: column; gap: 0.1rem; }
  .detail-pill .lab { font-size: 0.6rem; font-weight: 800; color: #475569; text-transform: uppercase; }
  .detail-pill .val { font-size: 0.85rem; font-weight: 800; color: #e2e8f0; }

  /* Empty States */
  .empty-layout { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
  .error-glass { 
    background: rgba(30, 41, 59, 0.4); 
    backdrop-filter: blur(20px); 
    padding: 4rem; border-radius: 0px; 
    text-align: center; border: 1px solid rgba(255, 255, 255, 0.05);
    max-width: 500px;
  }
  .error-icon { font-size: 4rem; color: #f43f5e; margin-bottom: 2rem; }
  .error-text h2 { font-family: 'Outfit'; font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; }
  .error-text p { color: #64748b; margin-bottom: 3rem; }
  .back-btn { 
    width: 100%; height: 60px; background: #020617; 
    border: 1px solid #1e293b; border-radius: 0px; 
    font-weight: 800; text-transform: uppercase; 
    display: flex; align-items: center; justify-content: center; gap: 1rem; 
  }

  .empty-notif { text-align: center; padding: 6rem 2rem; }
  .notif-icon { font-size: 4rem; color: #1e293b; margin-bottom: 2rem; }
  .empty-notif h4 { font-family: 'Outfit'; font-size: 1.5rem; font-weight: 800; margin: 0 0 1rem 0; }
  .empty-notif p { color: #475569; }

  /* Scroll Visual */
  .scroll-visual::-webkit-scrollbar { width: 4px; }
  .scroll-visual::-webkit-scrollbar-track { background: transparent; }
  .scroll-visual::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }

  @media (max-width: 1024px) {
    .overview-grid { grid-template-columns: 1fr; }
    .profile-main { flex-direction: column; text-align: center; }
    .name-row { justify-content: center; flex-direction: column; }
    .meta-row { justify-content: center; flex-wrap: wrap; }
    .attendance-stats, .metric-row { grid-template-columns: repeat(2, 1fr); }
    .category-summary { grid-template-columns: 1fr; }
  }
</style>
style>
