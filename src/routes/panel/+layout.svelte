<script lang="ts">
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { 
    SignOut, 
    GearSix, 
    House, 
    Key, 
    CaretRight, 
    Warning,
    Crown,
    UserCircle,
    CaretDown,
    Buildings,
    Chalkboard,
    Users,
    ListChecks,
    Wallet,
    ChatCircleDots,
    Lock,
    Calendar,
    Trophy,
    Lifebuoy,
    BookOpen,
    Medal,
    RocketLaunch,
    ShareNetwork,
    ChatTeardropDots,
    ChartPieSlice,
    Lightning,
    Question,
    WarningCircle
  } from 'phosphor-svelte';

  import { fade, fly } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { appStore } from '$lib/stores/appStore';
  import { INSIGNIAS } from '$lib/constants/insignias';
  import { t, locale } from '$lib/i18n';
  import { auth, signOut } from '$lib/firebase';
  import { onMount, onDestroy } from 'svelte';
  import { db } from '$lib/firebase';
  import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';

  import { user as authUser, loading as authLoading, authInitialized } from '$lib/stores/auth';
  import { uiStore } from '$lib/stores/uiStore';
  import { globalAnnouncements as globalAnnouncementsStore } from '$lib/stores/configStore';
  import { ADMIN_EMAILS } from '$lib/constants';
  import type { LayoutData } from './$types';
  
  let { data, children } = $props<{ data: LayoutData, children: any }>();

  let isLoggingOut = $state(false);
  let showMobileMenu = $state(false);

  // Reactividad del store
  let teacherName = $derived($appStore?.settings?.teacherName || $authUser?.displayName || ($authLoading ? '...' : 'Socio'));
  let teacherAvatar = $derived($appStore?.settings?.teacherAvatar || $authUser?.photoURL || null);
  let plan = $derived(data.isAdmin ? 'premium' : ($appStore?.settings?.plan || 'free'));
  let email = $derived($authUser?.email || '');
  
  let currentRoute = $derived($page.url.pathname);

  // Economía del profesor
  let netsBalance = $derived($appStore?.settings?.economy?.netsBalance || 0);

  // Impersonation state
  let isImpersonating = $derived(!!data.impersonateEmail);

  // Lobby & Support Notifications state
  let lobbyPulse = $state(false);
  let supportPulse = $state(false);
  let adminPulse = $state(false); // Separado: dot rojo en link Admin (tickets abiertos sin revisar)
  let unsubs: (() => void)[] = [];

  // Scroll logic for mobile nav
  let lastScrollY = $state(0);
  let isNavVisible = $state(true);
  let showSupportMenu = $state(false);
  let navThreshold = 30; // Reducido para mayor sensibilidad

  function handleScroll() {
    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    
    if (currentScrollY < 20) {
      isNavVisible = true;
    } else if (Math.abs(currentScrollY - lastScrollY) < 5) {
      return; // Ignorar micro-scrolls
    } else if (currentScrollY > lastScrollY && currentScrollY > navThreshold) {
      isNavVisible = false;
    } else if (currentScrollY < lastScrollY) {
      isNavVisible = true;
    }
    
    lastScrollY = currentScrollY;
  }

  // Lock body scroll when mobile menu is open (iOS Safari safe)
  $effect(() => {
    if (showMobileMenu) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  });

  // Close menu on route change
  $effect(() => {
    if ($page.url.pathname) {
      showMobileMenu = false;
    }
  });

  // ---------------------------------------------------------
  // INDICATORS (Effect based on global stores)
  // ---------------------------------------------------------
  
  // 1. Monitor for New Announcements (Red Dot) - Effect based on configStore
  $effect(() => {
    const list = $globalAnnouncementsStore;
    if (list && list.length > 0) {
      const lastActivity = list[0].created_at;
      const lastViewed = localStorage.getItem('last_viewed_announcements_global');
      if (lastActivity) {
        const activityTime = new Date(lastActivity).getTime();
        if (!lastViewed || activityTime > parseInt(lastViewed)) {
          lobbyPulse = true;
        }
      }
    }
  });

  // BUG-06: Auto-resetear lobbyPulse al entrar en /panel/lobby
  $effect(() => {
    if (currentRoute.startsWith('/panel/lobby')) {
      lobbyPulse = false;
      const colName = data.isAdmin ? 'lobby_suggestions' : 'lobby_announcements';
      localStorage.setItem(`last_viewed_${colName}`, Date.now().toString());
      localStorage.setItem('last_viewed_announcements_global', Date.now().toString());
    }
  });

  // 2. Monitor for Support Tickets (User or Admin) - Effect based on appStore
  $effect(() => {
    const list = $appStore.reports || [];
    if (list.length > 0) {
      const isAdmin = $authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase());
      
      if (isAdmin) {
        // Admin: dot en /admin si hay tickets abiertos sin revisar
        const openTickets = list.filter(r => r.status === 'open');
        if (openTickets.length > 0) {
          const lastUpdate = openTickets[0].updatedAt || openTickets[0].createdAt;
          const lastViewed = localStorage.getItem('last_viewed_support_admin');
          if (lastUpdate) {
            const updateTime = typeof lastUpdate.toDate === 'function' ? lastUpdate.toDate().getTime() : new Date(lastUpdate).getTime();
            if (!lastViewed || updateTime > parseInt(lastViewed)) adminPulse = true;
          }
        }
      } else {
        // Usuario: dot en /panel/support si su ticket fue actualizado
        const activeTickets = list.filter(r => r.status !== 'resolved');
        if (activeTickets.length > 0) {
          const lastUpdate = activeTickets[0].updatedAt || activeTickets[0].createdAt;
          const lastViewed = localStorage.getItem('last_viewed_support_user');
          if (lastUpdate) {
            const updateTime = typeof lastUpdate.toDate === 'function' ? lastUpdate.toDate().getTime() : new Date(lastUpdate).getTime();
            if (!lastViewed || updateTime > parseInt(lastViewed)) supportPulse = true;
          }
        }
      }
    }
  });

  onMount(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  onDestroy(() => {
    unsubs.forEach(unsub => unsub());
    window.removeEventListener('scroll', handleScroll);
  });

  function stopImpersonating() {
    // Borrar ambas cookies de impersonación (id + email)
    document.cookie = 'impersonate_id=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'impersonate_email=; path=/; max-age=0; SameSite=Lax';
    window.location.href = '/admin';
  }

  // Breadcrumbs dinámicos localizados con resolución de nombres
  let breadcrumbItems = $derived.by(() => {
    const parts = currentRoute.replace('/panel', '').split('/').filter(e => e);
    if (parts.length === 0) return [{ name: $t('nav.dashboard'), href: '/panel' }];
    
    const rootMappings: Record<string, string> = {
      'students': 'nav.students',
      'tournaments': 'nav.tournaments',
      'payments': 'nav.payments',
      'classes': 'nav.classes',
      'schools': 'nav.schools',
      'skills': 'nav.skills',
      'reports': 'nav.reports',
      'settings': 'nav.settings',
      'achievements': 'nav.achievements',
      'attendance': 'nav.attendance',
      'leads': 'nav.leads',
      'planner': 'planner.title',
      'lobby': 'nav.lobby',
      'inventory': 'nav.inventory',
      'materials': 'nav.materials',
      'nets': 'nav.nets',
      'support': 'support.title'
    };

    let items = [];
    let currentPath = '/panel';

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath += `/${part}`;
        
        let name = part;
        const prevPart = i > 0 ? parts[i-1] : 'panel';
        
        // Root mapping
        if (i === 0 && rootMappings[part]) {
            name = $t(rootMappings[part]);
        } 
        // Logic for parts after the root (IDs, special actions like create/edit/attendance)
        else {
            if (part === 'create' || part === 'new') {
                const createMappings: Record<string, string> = {
                    'students': 'students.new_title',
                    'classes': 'classes.new_title',
                    'tournaments': 'tournaments.create_new',
                    'schools': 'schools.new_title'
                };
                name = createMappings[prevPart] ? $t(createMappings[prevPart]) : $t('common.new');
            } else if (part === 'edit') {
                name = $t('common.edit');
            } else if (part === 'attendance') {
                name = $t('nav.attendance');
            } else {
                // Try to resolve as an ID using the previous part as context
                let entity = null;
                if (prevPart === 'schools') entity = $appStore?.schools?.find(s => s.id === part);
                else if (prevPart === 'classes') entity = $appStore?.classes?.find(c => c.id === part);
                else if (prevPart === 'students') entity = $appStore?.students?.find(s => s.id === part);
                else if (prevPart === 'tournaments') entity = $appStore?.localTournaments?.find(t => t.id === part) || $appStore?.tournaments?.find(t => t.id === part);
                else if (prevPart === 'leads') entity = $appStore?.leads?.find(l => l.id === part);
                else if (prevPart === 'achievements' || prevPart === 'badges') entity = $appStore?.badges?.find(b => b.id === part);
                
                if (entity) {
                    const e = entity as any;
                    name = e.name || e.title || e.label || part;
                } else if (rootMappings[part]) {
                    // Handle cases like /panel/schools/id/classes where 'classes' is a sub-route
                    name = $t(rootMappings[part]);
                } else if (part.length >= 15 || /^[0-9a-fA-F-]{36}$/.test(part)) { // Likely a Firestore ID (20 chars) or UUID
                    name = $t('common.details');
                }
            }
        }
        
        items.push({ name, href: currentPath });
    }
    
    return items;
  });

  let initials = $derived(teacherName.substring(0,2).toUpperCase());

  const handleLogout = async () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    try {
      await signOut();
      await fetch('/api/auth/session', { method: 'DELETE' });
      goto('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      isLoggingOut = false;
    }
  };

  const handleGoHome = () => goto('/panel');


</script>

<div class="min-h-screen bg-zinc-950 text-slate-300 font-jakarta selection:bg-violet-500/30">
  <!-- BroadcastBanner renderizado desde el root +layout.svelte para evitar duplicación -->

  <!-- Impersonation Banner -->
  {#if isImpersonating}
    <div class="fixed top-0 inset-x-0 h-10 bg-red-600 z-[250] flex items-center justify-center gap-3 px-4 shadow-lg border-b border-white/10">
      <Warning weight="duotone" class="w-4 h-4 text-white" />
      <span class="text-[10px] font-outfit font-black text-white uppercase tracking-widest">{$t('admin.impersonation_active')}</span>
      <button type="button" onclick={stopImpersonating} class="ml-4 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-none text-[9px] font-bold text-white transition-all uppercase tracking-widest border border-white/10">
        {$t('admin.back_to_admin')}
      </button>
    </div>
  {/if}

  <!-- Mobile Header (Premium App Style) -->
  <div class="lg:hidden fixed top-0 left-0 right-0 h-[var(--ios-nav-height)] bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 pt-[env(safe-area-inset-top)] z-[60] transition-transform duration-300" style="transform: translateY(calc(var(--banner-height, 0px) + {isImpersonating ? '40px' : '0px'}))">
    <!-- Logo: min 44x44px para área táctil Apple HIG -->
    <button type="button" onclick={handleGoHome} class="flex items-center gap-2 group active:scale-95 transition-transform pointer-events-auto min-w-[44px] min-h-[44px] -ml-2 pl-2" aria-label="Go to home">
      <Logo className="h-7 w-7 shadow-violet-flare/20" />
      <span class="text-xl font-outfit font-black text-white tracking-tighter uppercase">ChessNet</span>
    </button>
    
    <div class="flex items-center gap-3 pointer-events-auto">
       <div class="flex items-center gap-1.5 mr-1">
         <div class="px-2 py-1 bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-1">
           <ChartPieSlice weight="fill" size={12} class="text-primary-400" />
           <span class="text-[9px] font-black text-white">{netsBalance.toLocaleString()}</span>
         </div>
       </div>
       <button 
         type="button"
         onclick={() => showMobileMenu = true}
         class="w-9 h-9 rounded-none bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center text-white font-outfit font-extrabold text-[10px] ring-2 ring-white/10 overflow-hidden shadow-lg shadow-violet-500/20"
         aria-label="Open profile menu"
       >
         {#if teacherAvatar}
           <img src={teacherAvatar} alt="Profile" class="w-full h-full object-cover" />
         {:else}
           {initials}
         {/if}
       </button>
    </div>
  </div>

  <!-- Mobile Side Menu Drawer -->
  {#if showMobileMenu}
    <div class="fixed inset-0 z-[100] lg:hidden" in:fade={{ duration: 200 }}>
      <!-- Backdrop -->
      <button 
        type="button"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default w-full h-full border-none" 
        onclick={() => showMobileMenu = false}
        aria-label="Close menu"
      ></button>
      
      <!-- Drawer -->
      <div 
        class="absolute right-0 top-0 bottom-0 w-[280px] bg-zinc-950 border-l border-white/5 shadow-2xl flex flex-col pt-[env(safe-area-inset-top)]"
        transition:fly={{ x: 280, duration: 300 }}
      >
        <div class="p-8 flex flex-col items-center text-center border-b border-white/5">
          <div class="w-20 h-20 rounded-none bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center text-white font-outfit font-extrabold text-2xl mb-4 shadow-xl shadow-violet-500/10">
            {#if teacherAvatar}
              <img src={teacherAvatar} alt="Profile" class="w-full h-full object-cover rounded-none" />
            {:else}
              {initials}
            {/if}
          </div>
          <h3 class="text-lg font-bold text-white font-outfit leading-tight">{teacherName}</h3>
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{email}</p>
          
          <div class="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-none border border-white/5">
            {#if plan === 'premium'}
              <Crown weight="fill" size={10} class="text-amber-500" />
              <span class="text-[8px] font-black text-white uppercase tracking-widest">{$t('panel.premiumCoach')}</span>
            {:else}
              <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">{$t('panel.freePlan')}</span>
            {/if}
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <a href="/panel/settings" 
             onclick={() => showMobileMenu = false}
             class="flex items-center gap-4 px-6 py-4 rounded-none text-slate-400 font-bold hover:bg-violet-500/10 hover:text-violet-400 transition-all font-outfit {currentRoute.includes('/settings') ? 'bg-violet-500/10 text-violet-400' : ''}">
            <GearSix weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.settings')}</span>
          </a>
          
          {#if data.isAdmin}
            <a href="/admin" 
               onclick={() => showMobileMenu = false}
               class="flex items-center gap-4 px-6 py-4 rounded-none text-amber-500 font-black bg-amber-500/5 border border-amber-500/10 transition-all font-outfit">
              <Key weight="duotone" size={20} />
              <span class="text-xs uppercase tracking-widest">{$t('common.admin')}</span>
            </a>
          {/if}

          {#if $appStore?.settings?.role === 'director'}
            <a href="/panel/director" 
               onclick={() => showMobileMenu = false}
               class="flex items-center gap-4 px-6 py-4 rounded-none text-emerald-500 font-black bg-emerald-500/5 border border-emerald-500/10 transition-all font-outfit">
              <Buildings weight="duotone" size={20} />
              <span class="text-xs uppercase tracking-widest">{$t('nav.director_console')}</span>
            </a>
          {/if}

          <a href="/panel/changelog" 
             onclick={() => showMobileMenu = false}
             class="flex items-center gap-4 px-6 py-4 rounded-none text-slate-400 font-bold hover:bg-violet-500/10 hover:text-violet-400 transition-all font-outfit {currentRoute.includes('/changelog') ? 'bg-violet-500/10 text-violet-400' : ''}">
            <RocketLaunch weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.changelog')}</span>
          </a>

          <div class="h-px bg-white/5 my-2 mx-4"></div>
          <p class="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] px-6 pb-1">{$t('nav.management') || 'Gestión'}</p>

          <a href="/panel/schools" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/schools') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <Buildings weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.schools')}</span>
          </a>
          <a href="/panel/classes" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/classes') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <Chalkboard weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.classes')}</span>
          </a>
          <a href="/panel/students" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/students') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <Users weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.students')}</span>
          </a>
          <a href="/panel/attendance" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/attendance') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <ListChecks weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.attendance')}</span>
          </a>

          <div class="h-px bg-white/5 my-2 mx-4"></div>
          <p class="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] px-6 pb-1">{$t('nav.premium_features') || 'Avanzado'}</p>

          <a href={plan === 'premium' ? '/panel/payments' : '/pricing'} onclick={() => showMobileMenu = false} class="flex items-center justify-between px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/payments') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <div class="flex items-center gap-4">
              <Wallet weight="duotone" size={20} />
              <span class="text-xs uppercase tracking-widest">{$t('nav.payments')}</span>
            </div>
            {#if plan !== 'premium'}<Crown weight="fill" size={10} class="text-violet-400" />{/if}
          </a>
          <a href={plan === 'premium' ? '/panel/tournaments' : '/pricing'} onclick={() => showMobileMenu = false} class="flex items-center justify-between px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/tournaments') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <div class="flex items-center gap-4">
              <Trophy weight="duotone" size={20} />
              <span class="text-xs uppercase tracking-widest">{$t('nav.tournaments')}</span>
            </div>
            {#if plan !== 'premium'}<Crown weight="fill" size={10} class="text-violet-400" />{/if}
          </a>
          <a href="/panel/skills" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/skills') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <BookOpen weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.skills') || 'Temario'}</span>
          </a>
          <a href="/panel/achievements" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/achievements') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <Medal weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.achievements')}</span>
          </a>
          <a href="/panel/social" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/social') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <ChatTeardropDots weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.social')}</span>
          </a>
          <a href="/panel/nets" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-3.5 rounded-none font-bold hover:bg-white/5 transition-all font-outfit {currentRoute.includes('/nets') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-400'}">
            <ChartPieSlice weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.nets')}</span>
          </a>
        </nav>

        <div class="p-6 border-t border-white/5">
          <button 
            type="button"
            onclick={handleLogout}
            class="w-full flex items-center justify-center gap-3 py-4 rounded-none bg-red-500/10 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            <SignOut weight="bold" size={18} />
            {$t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <header class="hidden lg:block fixed top-0 right-0 left-0 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 z-40 transition-all duration-300" style="margin-top: calc(var(--banner-height, 0px) + {isImpersonating ? '40px' : '0px'})">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4 lg:gap-8">
      <div class="flex items-center gap-4 lg:gap-8 min-w-0 flex-shrink-1 flex-grow-1">
        
        <!-- Desktop Logo -->
        <button onclick={handleGoHome} class="hidden lg:flex items-center gap-3 cursor-pointer group transition-transform active:scale-95 flex-shrink-0" type="button">
          <Logo className="h-10 w-10 shadow-violet-flare/20" />
          <span class="text-2xl font-outfit font-extrabold text-white tracking-tighter">ChessNet</span>
        </button>
        
        <nav class="hidden lg:flex items-center gap-2 text-slate-500 min-w-0 flex-shrink">
          <div class="w-px h-10 bg-white/5 mx-1 flex-shrink-0"></div>
          <button type="button" onclick={handleGoHome} class="hover:text-violet-400 transition-colors flex-shrink-0" aria-label="Home">
            <House weight="duotone" size={20} />
          </button>
          
          {#if breadcrumbItems && breadcrumbItems.length > 0}
            <div class="flex items-center gap-2 min-w-0 overflow-hidden">
              {#each breadcrumbItems as item, i}
                <CaretRight weight="bold" size={12} class="text-white/10 flex-shrink-0" />
                <a href={item.href} class="text-[10px] font-outfit font-bold uppercase tracking-widest transition-colors truncate max-w-[80px] xl:max-w-[120px] {i === breadcrumbItems.length - 1 ? 'text-white pointer-events-none' : 'text-slate-500 hover:text-violet-400'}">
                  {item?.name || ''}
                </a>
              {/each}
            </div>
          {/if}
        </nav>

        <!-- Quick Module Switcher (Teachers only) -->
        <div class="hidden lg:flex items-center gap-0.5 bg-white/[0.03] p-1 rounded-none border border-white/10 flex-shrink backdrop-blur-xl">
          <a href="/panel/schools" 
             class="p-2.5 rounded-none hover:bg-violet-500/10 transition-all duration-300 {currentRoute.includes('/schools') ? 'text-violet-400 bg-violet-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' : 'text-slate-500 hover:text-slate-300'} group/nav" 
             title={$t('nav.schools')}>
            <Buildings size={20} weight={currentRoute.includes('/schools') ? 'fill' : 'duotone'} class="group-hover/nav:scale-110 transition-transform" />
          </a>
          <a href="/panel/classes" 
             class="p-2.5 rounded-none hover:bg-violet-500/10 transition-all duration-300 {currentRoute.includes('/classes') ? 'text-violet-400 bg-violet-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' : 'text-slate-500 hover:text-slate-300'} group/nav" 
             title={$t('nav.classes')}>
            <Chalkboard size={20} weight={currentRoute.includes('/classes') ? 'fill' : 'duotone'} class="group-hover/nav:scale-110 transition-transform" />
          </a>
          <a href="/panel/students" 
             class="p-2.5 rounded-none hover:bg-violet-500/10 transition-all duration-300 {currentRoute.includes('/students') ? 'text-violet-400 bg-violet-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' : 'text-slate-500 hover:text-slate-300'} group/nav" 
             title={$t('nav.students')}>
            <Users size={20} weight={currentRoute.includes('/students') ? 'fill' : 'duotone'} class="group-hover/nav:scale-110 transition-transform" />
          </a>
          <div class="w-px h-6 bg-white/5 mx-1"></div>
          <a href="/panel/attendance" 
             class="p-2.5 rounded-none hover:bg-violet-500/10 transition-all duration-300 {currentRoute.includes('/attendance') ? 'text-violet-400 bg-violet-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' : 'text-slate-500 hover:text-slate-300'} group/nav" 
             title={$t('nav.attendance')}>
            <ListChecks size={20} weight={currentRoute.includes('/attendance') ? 'fill' : 'duotone'} class="group-hover/nav:scale-110 transition-transform" />
          </a>
          <a href={plan === 'premium' ? '/panel/payments' : '/pricing'} 
             class="p-2.5 rounded-none hover:bg-violet-500/10 transition-all duration-300 {currentRoute.includes('/payments') ? 'text-violet-400 bg-violet-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' : 'text-slate-500 hover:text-slate-300'} relative group/nav" 
             title={$t('nav.payments')}>
            <Wallet size={20} weight={currentRoute.includes('/payments') ? 'fill' : 'duotone'} class="group-hover/nav:scale-110 transition-transform" />
            {#if plan !== 'premium'}
              <div class="absolute -top-1 -right-1">
                <Crown weight="fill" size={10} class="text-violet-400 animate-pulse" />
              </div>
            {/if}
          </a>
          <a href={plan === 'premium' ? '/panel/tournaments' : '/pricing'} 
             class="p-2.5 rounded-none hover:bg-violet-500/10 transition-all duration-300 {currentRoute.includes('/tournaments') ? 'text-violet-400 bg-violet-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' : 'text-slate-500 hover:text-slate-300'} relative group/nav" 
             title={$t('nav.tournaments')}>
            <Trophy size={20} weight={currentRoute.includes('/tournaments') ? 'fill' : 'duotone'} class="group-hover/nav:scale-110 transition-transform" />
            {#if plan !== 'premium'}
              <div class="absolute -top-1 -right-1">
                <Crown weight="fill" size={10} class="text-violet-400 animate-pulse" />
              </div>
            {/if}
          </a>
          <div class="w-px h-6 bg-white/5 mx-1"></div>
          <a href="/panel/social" 
             class="p-2.5 rounded-none hover:bg-violet-500/10 transition-all duration-300 {currentRoute.includes('/social') ? 'text-violet-400 bg-violet-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' : 'text-slate-500 hover:text-slate-300'} group/nav" 
             title={$t('nav.social')}>
            <ChatTeardropDots size={20} weight={currentRoute.includes('/social') ? 'fill' : 'duotone'} class="group-hover/nav:scale-110 transition-transform" />
          </a>
          <a href="/panel/nets" 
             class="p-2.5 rounded-none hover:bg-violet-500/10 transition-all duration-300 {currentRoute.includes('/nets') ? 'text-violet-400 bg-violet-500/10 shadow-[inset_0_0_10px_rgba(139,92,246,0.1)]' : 'text-slate-500 hover:text-slate-300'} group/nav" 
             title={$t('nav.nets')}>
            <ChartPieSlice size={20} weight={currentRoute.includes('/nets') ? 'fill' : 'duotone'} class="group-hover/nav:scale-110 transition-transform" />
          </a>
        </div>
      </div>

      <div class="flex items-center gap-4 flex-shrink-0">
        <!-- Language Switcher -->

        


        <!-- Economy Capsules -->
        <div class="hidden lg:flex items-center gap-3 flex-shrink-0">
          <div class="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/10 backdrop-blur-3xl group hover:border-primary-500/40 transition-all duration-500 hover:bg-primary-500/[0.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 -translate-x-full group-hover:animate-shimmer"></div>
            <ChartPieSlice weight="fill" size={16} class="text-primary-400 group-hover:scale-110 transition-transform duration-500" />
            <div class="flex flex-col relative z-10">
              <span class="text-[8px] font-black text-zinc-500 uppercase leading-none mb-1 tracking-widest">Saldo Nets</span>
              <span class="text-[12px] font-black text-white tracking-[0.1em] uppercase leading-none group-hover:text-primary-300 transition-colors">{netsBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div class="relative group">
          <button type="button" class="flex items-center gap-3 hover:bg-white/[0.03] p-1.5 rounded-none transition-all border border-transparent hover:border-white/10 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.05)]" aria-label="User account menu">
            <div class="w-10 h-10 rounded-none bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center text-white font-outfit font-extrabold text-sm ring-1 ring-white/20 shadow-xl overflow-hidden relative group-hover:ring-violet-500/50 transition-all duration-500">
              {#if teacherAvatar}
                <img src={teacherAvatar} alt="Profile" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              {:else}
                <span class="group-hover:scale-110 transition-transform duration-500">{initials}</span>
              {/if}
              <div class="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div class="text-left hidden sm:block pr-2">
              <div class="flex items-center gap-2">
                <p class="text-sm font-outfit font-black text-white leading-tight tracking-tight group-hover:text-violet-300 transition-colors">{teacherName}</p>
                {#if $appStore?.settings?.featuredInsignias && $appStore.settings.featuredInsignias.length > 0}
                  <div class="flex items-center gap-1.5">
                    {#each $appStore.settings.featuredInsignias as insId}
                      {@const ins = INSIGNIAS.find(i => i.id === insId)}
                      {#if ins}
                        {@const Icon = ins.icon}
                        <Icon size={12} weight="fill" class="{ins.color} drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" />
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
              <div class="flex flex-col gap-0.5 pt-0.5">
                <div class="flex items-center gap-1.5">
                  <p class="text-[9px] text-slate-500 font-outfit font-black uppercase tracking-[0.3em] group-hover:text-slate-400 transition-colors">{$t('nav.control_panel')}</p>
                  <CaretDown weight="bold" size={10} class="text-slate-600 group-hover:text-violet-400 group-hover:translate-y-0.5 transition-all" />
                </div>
              </div>
            </div>
          </button>

          <!-- Plan Badge - Moved Below Profile Box per user request -->
          <div class="absolute top-[calc(100%-12px)] right-2 pointer-events-none">
            {#if plan === 'premium'}
              <div class="flex items-center gap-1.5 px-2 py-0.5 bg-violet-500 text-[7px] font-black text-white uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Crown weight="fill" size={8} />
                <span>{$t('panel.premiumCoach')}</span>
              </div>
            {:else}
              <div class="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-800 text-[7px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <span>{$t('panel.freePlan')}</span>
              </div>
            {/if}
          </div>
          
          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-3 w-64 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-none shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-[100] translate-y-2 group-hover:translate-y-0">
            <div class="px-5 py-4 border-b border-white/5 bg-white/[0.02] mb-1">
              <div class="flex items-center gap-2 mb-0.5">
                <p class="text-sm font-outfit font-bold text-white truncate">{teacherName}</p>
                {#if $appStore?.settings?.featuredInsignias && $appStore.settings.featuredInsignias.length > 0}
                  <div class="flex items-center gap-1">
                    {#each $appStore.settings.featuredInsignias as insId}
                      {@const ins = INSIGNIAS.find(i => i.id === insId)}
                      {#if ins}
                        {@const Icon = ins.icon}
                        <Icon size={11} weight="fill" class={ins.color} />
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
              <p class="text-[10px] font-jakarta font-medium text-slate-500 truncate">{email}</p>
            </div>
            
            <div class="p-2 space-y-1">
              <a href="/panel/settings" class="flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 rounded-none transition-all group/item">
                <GearSix weight="duotone" size={18} class="group-hover/item:rotate-90 transition-transform duration-500" /> 
                {$t('nav.settings')}
              </a>

              {#if $appStore?.settings?.role === 'director'}
                <a href="/panel/director" class="flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-emerald-400 hover:bg-emerald-600/10 rounded-none transition-all group/item">
                  <Buildings weight="duotone" size={18} class="group-hover/item:scale-110 transition-transform" /> 
                  {$t('nav.director_console')}
                </a>
              {/if}

              <!-- Support Link (Everyone) -->
              <a href="/panel/support" 
                 class="flex items-center justify-between px-4 py-3 text-xs font-outfit font-bold text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 rounded-none transition-all group/item"
                 onclick={() => {
                   supportPulse = false;
                   localStorage.setItem('last_viewed_support', Date.now().toString());
                 }}
              >
                <div class="flex items-center gap-3">
                  <Lifebuoy weight="duotone" size={18} class="group-hover/item:scale-110 transition-transform" /> 
                  {$t('support.title')}
                </div>
                {#if supportPulse}
                  <div class="w-2 h-2 bg-amber-500 rounded-none animate-pulse ring-2 ring-zinc-900"></div>
                {/if}
              </a>
              {#if data.isAdmin}
                <a href="/admin" class="flex items-center justify-between px-4 py-3 text-xs font-outfit font-bold text-primary-400 hover:bg-primary-500/10 rounded-none transition-all group/admin"
                   onclick={() => {
                     adminPulse = false;
                     localStorage.setItem('last_viewed_support_admin', Date.now().toString());
                   }}
                >
                  <div class="flex items-center gap-3">
                    <Key weight="duotone" size={18} />
                    {$t('common.admin')}
                  </div>
                  {#if adminPulse}
                    <div class="w-2 h-2 bg-red-500 rounded-none animate-pulse ring-2 ring-zinc-900"></div>
                  {/if}
                </a>
              {/if}

              <a href={plan === 'premium' ? '/panel/lobby' : '/pricing'} 
                class="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors group"
                onclick={() => {
                  uiStore.closeAllModals();
                  lobbyPulse = false;
                  const colName = data.isAdmin ? 'lobby_suggestions' : 'lobby_announcements';
                  localStorage.setItem(`last_viewed_${colName}`, Date.now().toString());
                }}
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-none bg-violet-600/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                    <ChatCircleDots weight="duotone" size={18} />
                  </div>
                  <span class="text-xs font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{$t('nav.lobby')}</span>
                </div>
                
                {#if plan !== 'premium' && !data.isAdmin}
                  <div class="flex items-center gap-1.5 px-2 py-1 bg-violet-500/10 rounded-none border border-violet-500/20">
                    <Crown weight="fill" size={10} class="text-violet-400" />
                    <span class="text-[8px] text-violet-400 font-black">PRO</span>
                  </div>
                {/if}
              </a>

              <a href="/panel/social" class="flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 rounded-none transition-all group/item">
                <ChatTeardropDots weight="duotone" size={18} class="group-hover/item:scale-110 transition-transform" /> 
                {$t('nav.social')}
              </a>

              <a href="/panel/nets" class="flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 rounded-none transition-all group/item">
                <ChartPieSlice weight="duotone" size={18} class="group-hover/item:scale-110 transition-transform" /> 
                {$t('nav.nets')}
              </a>

              <div class="h-px bg-white/5 my-1"></div>

              <!-- New: Changelog Link -->
              <a href="/panel/changelog" class="flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 rounded-none transition-all group/item">
                <RocketLaunch weight="duotone" size={18} class="group-hover/item:animate-bounce" /> 
                {$t('nav.changelog')}
              </a>
            </div>
            
            <div class="mx-2 mt-1 border-t border-white/5 pt-1">
            <button type="button" onclick={handleLogout} class="w-full flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-red-400/70 hover:bg-red-500/10 hover:text-red-400 rounded-none transition-all">
                <SignOut weight="duotone" size={18} /> 
                {$t('nav.logout')}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="pt-24 lg:pt-24 pb-32 lg:pb-24 min-h-screen transition-all duration-300" style="margin-top: calc(var(--banner-height, 0px) + {isImpersonating ? '40px' : '0px'})">
    <div class="max-w-7xl mx-auto px-4 lg:px-0">
        {#if $authLoading}
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6" in:fade>
                <div class="relative">
                  <div class="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-none animate-spin"></div>
                  <div class="absolute inset-x-0 -bottom-12 flex justify-center">
                    <p class="text-slate-500 font-outfit font-black uppercase tracking-[0.3em] text-[10px] whitespace-nowrap">{$t('common.loading')}</p>
                  </div>
                </div>
            </div>
        {/if}
        
        <div class={!$authLoading && $authUser ? 'block' : 'hidden'} in:fade={{ duration: 400 }}>
            {@render children()}
        </div>
    </div>
  </main>

  <!-- Global Loading Overlay -->
  {#if $uiStore.isLoading}
    <div class="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/80 backdrop-blur-md" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
      <div class="flex flex-col items-center gap-6">
        <div class="relative w-20 h-20">
          <div class="absolute inset-0 border-4 border-violet-500/20 rounded-none"></div>
          <div class="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-none animate-spin"></div>
          <div class="absolute inset-4 bg-violet-500/10 rounded-none flex items-center justify-center">
            <Logo className="w-8 h-8 opacity-50" />
          </div>
        </div>
        <div class="space-y-1 text-center">
          <p class="text-white font-black uppercase tracking-[0.3em] text-[10px]">ChessNet AI</p>
          <p class="text-zinc-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">{$t('common.processing') || 'PROCESANDO...'}</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Global Confirmation Modal -->
  {#if $uiStore.confirmDialog}
    <ConfirmModal
      show={!!$uiStore.confirmDialog}
      title={$uiStore.confirmDialog.title || ''}
      message={$uiStore.confirmDialog.message || ''}
      confirmText={$uiStore.confirmDialog.confirmText || ''}
      cancelText={$uiStore.confirmDialog.cancelText || ''}
      type={$uiStore.confirmDialog.type || 'info'}
      onConfirm={$uiStore.confirmDialog.onConfirm}
      onCancel={$uiStore.confirmDialog.onCancel || (() => {})}
    />
  {/if}
  <!-- Mobile Bottom Tab Bar (Premium App Style) -->
  <div 
    id="mobile-nav-bar"
    class="lg:hidden fixed bottom-6 left-4 right-4 z-50 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom)] ring-1 ring-white/5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] {isNavVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-20 scale-90 opacity-0 pointer-events-none'}"
  >
    <div class="h-16 relative px-2 flex items-center justify-between">
      <nav class="flex items-center justify-around w-full">
        <a href="/panel" class="flex flex-col items-center justify-center gap-1 w-12 transition-all {currentRoute === '/panel' ? 'text-violet-400' : 'text-slate-500'}">
          <House weight={currentRoute === '/panel' ? 'fill' : 'duotone'} size={20} />
          <span class="text-[8px] font-black uppercase tracking-widest leading-none">PANEL</span>
        </a>
        
        <a href="/panel/social" class="flex flex-col items-center justify-center gap-1 w-12 transition-all {currentRoute.includes('/social') ? 'text-violet-400' : 'text-slate-500'}">
          <ShareNetwork weight={currentRoute.includes('/social') ? 'fill' : 'duotone'} size={20} />
          <span class="text-[8px] font-black uppercase tracking-widest leading-none">COMUNIDAD</span>
        </a>
 
        <!-- Center Action Button (Support Menu) -->
        <div class="relative -top-5">
          <button 
             type="button"
             class="flex items-center justify-center w-14 h-14 rounded-none bg-gradient-to-tr from-violet-600 to-indigo-800 shadow-[0_8px_25px_rgba(139,92,246,0.5)] border-4 border-zinc-950 transition-all active:scale-90 relative overflow-hidden group"
             onclick={() => showSupportMenu = true}
             aria-label="Support and Quick Actions"
          >
            <Logo className="h-7 w-7 text-white" />
            {#if supportPulse}
              <div class="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-none ring-2 ring-white"></div>
            {/if}
          </button>
        </div>

        <a href="/panel/lobby" class="relative flex flex-col items-center justify-center gap-1 w-12 transition-all {currentRoute.includes('/lobby') ? 'text-violet-400' : 'text-slate-500'}">
          <ChatCircleDots weight={currentRoute.includes('/lobby') ? 'fill' : 'duotone'} size={20} />
          <span class="text-[8px] font-black uppercase tracking-widest leading-none">MENSAJES</span>
          {#if lobbyPulse && plan === 'premium'}
            <div class="absolute top-0 right-1 w-1.5 h-1.5 bg-violet-500 rounded-none animate-pulse ring-2 ring-zinc-900"></div>
          {/if}
        </a>

        <a href="/panel/settings" class="flex flex-col items-center justify-center gap-1 w-12 transition-all {currentRoute.includes('/settings') ? 'text-violet-400' : 'text-slate-500'}">
          <GearSix weight={currentRoute.includes('/settings') ? 'fill' : 'duotone'} size={20} />
          <span class="text-[8px] font-black uppercase tracking-widest leading-none">AJUSTES</span>
        </a>
      </nav>
    </div>
  </div>

  <!-- Support Quick Menu -->
  {#if showSupportMenu}
    <div 
      class="lg:hidden fixed inset-0 z-[100] flex items-end justify-center p-4"
    >
      <!-- Backdrop -->
      <button 
        type="button"
        class="absolute inset-0 bg-black/80 backdrop-blur-md w-full h-full border-none cursor-default" 
        onclick={() => showSupportMenu = false}
        onkeydown={(e) => e.key === 'Escape' && (showSupportMenu = false)}
        aria-label="Close support menu"
        transition:fade
      ></button>

      <!-- Drawer Content -->
      <div 
        class="relative w-full max-w-sm bg-zinc-900 border border-white/10 p-6 space-y-4 shadow-2xl mb-24 z-10"
        transition:fly={{ y: 100 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
      >
        <div class="flex items-center gap-4 mb-2">
          <div class="w-10 h-10 bg-violet-600 flex items-center justify-center">
            <Logo className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 id="support-title" class="text-sm font-black text-white uppercase tracking-widest">Centro de Ayuda</h3>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">¿Cómo podemos ayudarte hoy?</p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2">
          <button type="button" class="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:bg-violet-500/10 hover:border-violet-500/20 transition-all text-left group">
            <ChatTeardropDots size={20} class="text-violet-400 group-hover:scale-110 transition-transform" />
            <div>
              <p class="text-xs font-black text-white uppercase tracking-wider">Hablar con Soporte</p>
              <p class="text-[9px] text-zinc-600 font-bold uppercase">Chat en vivo con el equipo</p>
            </div>
          </button>

          <button type="button" class="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:bg-violet-500/10 hover:border-violet-500/20 transition-all text-left group">
            <Question size={20} class="text-amber-400 group-hover:scale-110 transition-transform" />
            <div>
              <p class="text-xs font-black text-white uppercase tracking-wider">Preguntas Frecuentes</p>
              <p class="text-[9px] text-zinc-600 font-bold uppercase">Resuelve tus dudas rápido</p>
            </div>
          </button>

          <button type="button" class="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-left group">
            <WarningCircle size={20} class="text-red-400 group-hover:scale-110 transition-transform" />
            <div>
              <p class="text-xs font-black text-white uppercase tracking-wider">Reportar un Fallo</p>
              <p class="text-[9px] text-zinc-600 font-bold uppercase">Ayúdanos a mejorar</p>
            </div>
          </button>
        </div>

        <button 
          type="button"
          onclick={() => showSupportMenu = false}
          class="w-full py-3 bg-zinc-950 text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-all border border-white/5"
        >
          Cerrar
        </button>
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  :root {
    --ios-nav-height: calc(44px + env(safe-area-inset-top));
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    @apply bg-zinc-950 text-slate-400 antialiased;
    -webkit-tap-highlight-color: transparent;
  }

  /* Override Jakarta and Outfit for mobile to feel more native */
  @media (max-width: 1023px) {
    :global(main) {
      padding-top: calc(var(--ios-nav-height) + 1rem) !important;
      padding-bottom: calc(120px + env(safe-area-inset-bottom)) !important;
    }
    /* iOS Safari scroll fix: usar position fixed en body cuando el drawer está abierto */
    :global(body.menu-open) {
      position: fixed;
      width: 100%;
      overflow: hidden;
    }
  }

  :global(.font-outfit) {
    font-family: 'Outfit', sans-serif;
  }

  :global(.font-jakarta) {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* Bento specific global improvements */
  :global(.bento-card) {
    @apply bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-none transition-all duration-300;
  }

  @media (max-width: 1023px) {
    :global(.bento-card) {
      @apply rounded-none bg-zinc-900/80 border-white/[0.03];
    }
  }

  :global(.btn-pill) {
    @apply rounded-none transition-all duration-300 active:scale-95 flex items-center justify-center;
  }

  :global(.shadow-violet-flare) {
    box-shadow: 0 0 30px -5px rgba(139, 92, 246, 0.25);
  }
</style>

