<script lang="ts">
  import { page } from '$app/stores';
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
    Lifebuoy
  } from 'phosphor-svelte';

  import { fade, fly } from 'svelte/transition';
  import Logo from '$lib/components/Logo.svelte';
  import { appStore } from '$lib/stores/appStore';
  import { INSIGNIAS } from '$lib/constants/insignias';
  import { t, locale } from '$lib/i18n';
  import { auth, signOut } from '$lib/firebase';
  import { onMount, onDestroy } from 'svelte';
  import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
  import { db } from '$lib/firebase';

  import { user as authUser, loading as authLoading } from '$lib/stores/auth';
  import { uiStore } from '$lib/stores/uiStore';
  import type { LayoutData } from './$types';
  
  let { data, children } = $props<{ data: LayoutData, children: any }>();

  let isLoggingOut = $state(false);
  let showMobileMenu = $state(false);

  // Reactividad del store
  let teacherName = $derived($appStore?.settings?.teacherName || $authUser?.displayName || ($authLoading ? '...' : 'User'));
  let teacherAvatar = $derived($appStore?.settings?.teacherAvatar || $authUser?.photoURL || null);
  let plan = $derived(data.isAdmin ? 'premium' : ($appStore?.settings?.plan || 'free'));
  let email = $derived($authUser?.email || '');
  
  let currentRoute = $derived($page.url.pathname);

  // Impersonation state
  let isImpersonating = $derived(!!data.impersonateEmail);

  // Lobby & Support Notifications state
  let lobbyPulse = $state(false);
  let supportPulse = $state(false);
  let unsubs: (() => void)[] = [];

  // Scroll logic for mobile nav
  let lastScrollY = $state(0);
  let isNavVisible = $state(true);
  let navThreshold = 50;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < 10) {
      isNavVisible = true;
    } else if (currentScrollY > lastScrollY && currentScrollY > navThreshold) {
      // Scrolling down
      isNavVisible = false;
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up
      isNavVisible = true;
    }
    
    lastScrollY = currentScrollY;
  }

  onMount(() => {
    if (!$authUser) return;
    
    // Si estamos en local con el usuario de desarrollo, no conectamos los listeners de comunidad ruidosos
    if ($authUser.uid === 'chessnet-dev-uid') {
        console.log("🛠️ [Panel Layout] Modo desarrollo local activo. Omitiendo listeners de comunidad.");
        return;
    }
    const colName = data.isAdmin ? 'lobby_suggestions' : 'lobby_announcements';
    const qLobby = query(collection(db, colName), orderBy('createdAt', 'desc'), limit(1));
    
    unsubs.push(onSnapshot(qLobby, 
      (snap) => {
        if (!snap.empty) {
          const lastActivity = (snap.docs[0].data() as any).createdAt;
          const lastViewed = localStorage.getItem(`last_viewed_${colName}`);
          
          if (lastActivity) {
            const activityDate = typeof lastActivity.toDate === 'function' ? lastActivity.toDate() : new Date(lastActivity);
            const activityTime = activityDate.getTime();
            if (!lastViewed || activityTime > parseInt(lastViewed)) lobbyPulse = true;
          }
        }
      },
      (error) => {
        console.warn(`⚠️ [Panel Layout] No se pudo leer ${colName}:`, error.message);
      }
    ));

    // 2. Monitor for Global System Announcements
    const qGlobal = query(collection(db, 'announcements'), where('is_global', '==', true), orderBy('created_at', 'desc'), limit(1));
    unsubs.push(onSnapshot(qGlobal, 
        (snap) => {
            if (!snap.empty) {
                const lastActivity = (snap.docs[0].data() as any).created_at;
                const lastViewed = localStorage.getItem('last_viewed_announcements_global');
                
                if (lastActivity) {
                    const activityTime = new Date(lastActivity).getTime();
                    if (!lastViewed || activityTime > parseInt(lastViewed)) lobbyPulse = true;
                }
            }
        },
        (error) => {
            console.warn('⚠️ [Panel Layout] No se pudieron leer anuncios globales:', error.message);
        }
    ));

    // 3. Monitor for Support Tickets (User or Admin)
    const qTickets = data.isAdmin
      ? query(collection(db, 'lobby_reports'), where('status', '==', 'open'), orderBy('createdAt', 'desc'), limit(1))
      : query(collection(db, 'lobby_reports'), where('authorId', '==', $authUser.uid), orderBy('createdAt', 'desc'), limit(1));

    unsubs.push(onSnapshot(qTickets,
      (snap) => {
        if (!snap.empty) {
          const ticket = snap.docs[0].data() as any;
          const lastUpdate = ticket.updatedAt || ticket.createdAt;
          const lastViewedSupport = localStorage.getItem('last_viewed_support');

          if (data.isAdmin) {
            // Admin sees pulse if there are ANY open tickets
            supportPulse = true;
          } else {
            // User sees pulse if their latest ticket has a response and haven't seen it yet
            if (ticket.adminResponse && lastUpdate) {
              const updateTime = new Date(lastUpdate).getTime();
              if (!lastViewedSupport || updateTime > parseInt(lastViewedSupport)) {
                supportPulse = true;
              }
            }
          }
        } else if (data.isAdmin) {
          supportPulse = false;
        }
      },
      (error) => {
        console.warn('⚠️ [Panel Layout] No se pudieron leer tickets de soporte:', error.message);
      }
    ));

    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onDestroy(() => {
    unsubs.forEach(unsub => unsub());
    window.removeEventListener('scroll', handleScroll);
  });

  function stopImpersonating() {
    document.cookie = 'impersonate_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin';
  }

  // Breadcrumbs dinámicos localizados con resolución de nombres
  let breadcrumbItems = $derived.by(() => {
    const parts = currentRoute.replace('/panel', '').split('/').filter(e => e);
    if (parts.length === 0) return $t('nav.dashboard');
    
    // Mapeo de rutas raíz a claves de traducción
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
      'materials': 'nav.materials'
    };
    
    const base = parts[0];
    const baseName = rootMappings[base] ? $t(rootMappings[base]) : base;
    
    let items = [{ name: baseName, href: `/panel/${base}` }];

    if (parts.length === 1) return items;

    const id = parts[1];
    let entityName = '';

    if (base === 'schools') {
      entityName = $appStore.schools.find(s => s.id === id)?.name || '';
    } else if (base === 'classes') {
      entityName = $appStore.classes.find(c => c.id === id)?.name || '';
    } else if (base === 'students') {
      entityName = $appStore.students.find(s => s.id === id)?.name || '';
    } else if (base === 'tournaments') {
      entityName = $appStore.localTournaments.find(t => t.id === id)?.name || '';
    }

    if (entityName) {
      items.push({ name: entityName, href: `/panel/${base}/${id}` });
      if (parts[2] === 'edit') items.push({ name: $t('classes.edit_title') || 'Editar', href: `/panel/${base}/${id}/edit` });
      if (parts[2] === 'attendance') items.push({ name: $t('nav.attendance') || 'Asistencia', href: `/panel/${base}/${id}/attendance` });
      return items;
    }

    if (id === 'create' || id === 'new') {
      items.push({ name: $t('common.create') || 'Nuevo', href: `/panel/${base}/${id}` });
      return items;
    }
    
    items.push({ name: $t('common.details') || 'Detalles', href: `/panel/${base}/${id}` });
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
  <!-- Impersonation Banner -->
  {#if isImpersonating}
    <div class="fixed top-0 inset-x-0 h-10 bg-red-600 z-[100] flex items-center justify-center gap-3 px-4 shadow-lg border-b border-white/10">
      <Warning weight="duotone" class="w-4 h-4 text-white" />
      <span class="text-[10px] font-outfit font-black text-white uppercase tracking-widest">{$t('admin.impersonation_active') || 'Impersonation Mode Active'}</span>
      <button onclick={stopImpersonating} class="ml-4 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-[9px] font-bold text-white transition-all uppercase tracking-widest border border-white/10">
        {$t('admin.back_to_admin') || 'Back to Admin'}
      </button>
    </div>
  {/if}

  <!-- Mobile Header (Premium App Style) -->
  <div class="lg:hidden fixed top-0 left-0 right-0 h-[var(--ios-nav-height)] bg-zinc-950/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 pt-[env(safe-area-inset-top)] z-[60] {isImpersonating ? 'translate-y-10' : ''}">
    <button onclick={handleGoHome} class="flex items-center gap-2 group active:scale-95 transition-transform pointer-events-auto">
      <Logo className="h-7 w-7 shadow-violet-flare/20" />
      <span class="text-lg font-outfit font-black text-white tracking-tighter uppercase italic">ChessNet</span>
    </button>
    
    <div class="flex items-center gap-4 pointer-events-auto">
       <button 
         onclick={() => showMobileMenu = true}
         class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center text-white font-outfit font-extrabold text-[10px] ring-2 ring-white/10 overflow-hidden"
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
          <div class="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center text-white font-outfit font-extrabold text-2xl mb-4 shadow-xl shadow-violet-500/10">
            {#if teacherAvatar}
              <img src={teacherAvatar} alt="Profile" class="w-full h-full object-cover rounded-[2rem]" />
            {:else}
              {initials}
            {/if}
          </div>
          <h3 class="text-lg font-bold text-white font-outfit leading-tight">{teacherName}</h3>
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{email}</p>
          
          <div class="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            {#if plan === 'premium'}
              <Crown weight="fill" size={10} class="text-amber-500" />
              <span class="text-[8px] font-black text-white uppercase tracking-widest">PREMIUM COACH</span>
            {:else}
              <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">FREE PLAN</span>
            {/if}
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <a href="/panel/settings" 
             onclick={() => showMobileMenu = false}
             class="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 font-bold hover:bg-violet-500/10 hover:text-violet-400 transition-all font-outfit">
            <GearSix weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.settings')}</span>
          </a>
          
          {#if data.isAdmin}
            <a href="/admin" 
               onclick={() => showMobileMenu = false}
               class="flex items-center gap-4 px-6 py-4 rounded-2xl text-amber-500 font-black bg-amber-500/5 border border-amber-500/10 transition-all font-outfit">
              <Key weight="duotone" size={20} />
              <span class="text-xs uppercase tracking-widest">ADMINISTRATION</span>
            </a>
          {/if}

          <div class="h-px bg-white/5 my-4 mx-4"></div>

          <a href="/panel/schools" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 font-bold hover:bg-white/5 transition-all font-outfit">
            <Buildings weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.schools')}</span>
          </a>
          <a href="/panel/classes" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 font-bold hover:bg-white/5 transition-all font-outfit">
            <Chalkboard weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.classes')}</span>
          </a>
          <a href="/panel/attendance" onclick={() => showMobileMenu = false} class="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 font-bold hover:bg-white/5 transition-all font-outfit">
            <ListChecks weight="duotone" size={20} />
            <span class="text-xs uppercase tracking-widest">{$t('nav.attendance')}</span>
          </a>
        </nav>

        <div class="p-6 border-t border-white/5">
          <button 
            onclick={handleLogout}
            class="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500/10 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            <SignOut weight="bold" size={18} />
            {$t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <header class="hidden lg:block fixed top-0 right-0 left-0 bg-zinc-950/80 backdrop-blur-2xl border-b border-white/5 z-40 transition-all {isImpersonating ? 'mt-10' : ''}">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
      <div class="flex items-center gap-4 lg:gap-8 min-w-0 flex-1">
        
        <!-- Desktop Logo -->
        <button onclick={handleGoHome} class="hidden lg:flex items-center gap-3 cursor-pointer group transition-transform active:scale-95 flex-shrink-0" type="button">
          <Logo className="h-10 w-10 shadow-violet-flare/20" />
          <span class="text-2xl font-outfit font-extrabold text-white tracking-tighter">ChessNet</span>
        </button>
        
        <nav class="hidden lg:flex items-center gap-2 text-slate-500 min-w-0 flex-shrink">
          <div class="w-px h-10 bg-white/5 mx-1 flex-shrink-0"></div>
          <button onclick={handleGoHome} class="hover:text-violet-400 transition-colors flex-shrink-0">
            <House weight="duotone" size={20} />
          </button>
          
          {#if breadcrumbItems && breadcrumbItems.length > 0}
            <div class="flex items-center gap-2 min-w-0 overflow-hidden">
              {#each breadcrumbItems as item, i}
                <CaretRight weight="bold" size={12} class="text-white/10 flex-shrink-0" />
                <a href={item.href} class="text-[10px] font-outfit font-bold uppercase tracking-widest transition-colors truncate max-w-[80px] xl:max-w-[120px] {i === breadcrumbItems.length - 1 ? 'text-white pointer-events-none' : 'text-slate-500 hover:text-violet-400'}">
                  {item.name}
                </a>
              {/each}
            </div>
          {/if}
        </nav>

        <!-- Quick Module Switcher (Teachers only) -->
        <div class="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5 flex-shrink-0">
          <a href="/panel/schools" 
             class="p-2.5 rounded-xl hover:bg-violet-500/10 transition-all {currentRoute.includes('/schools') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'}" 
             title={$t('nav.schools')}>
            <Buildings size={20} weight={currentRoute.includes('/schools') ? 'fill' : 'duotone'} />
          </a>
          <a href="/panel/classes" 
             class="p-2.5 rounded-xl hover:bg-violet-500/10 transition-all {currentRoute.includes('/classes') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'}" 
             title={$t('nav.classes')}>
            <Chalkboard size={20} weight={currentRoute.includes('/classes') ? 'fill' : 'duotone'} />
          </a>
          <a href="/panel/students" 
             class="p-2.5 rounded-xl hover:bg-violet-500/10 transition-all {currentRoute.includes('/students') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'}" 
             title={$t('nav.students')}>
            <Users size={20} weight={currentRoute.includes('/students') ? 'fill' : 'duotone'} />
          </a>
          <div class="w-px h-6 bg-white/5 mx-1"></div>
          <a href="/panel/attendance" 
             class="p-2.5 rounded-xl hover:bg-violet-500/10 transition-all {currentRoute.includes('/attendance') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'}" 
             title={$t('nav.attendance')}>
            <ListChecks size={20} weight={currentRoute.includes('/attendance') ? 'fill' : 'duotone'} />
          </a>
          <a href={plan === 'premium' ? '/panel/payments' : '/pricing'} 
             class="p-2.5 rounded-xl hover:bg-violet-500/10 transition-all {currentRoute.includes('/payments') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'} relative group/nav" 
             title={$t('nav.payments')}>
            <Wallet size={20} weight={currentRoute.includes('/payments') ? 'fill' : 'duotone'} />
            {#if plan !== 'premium'}
              <div class="absolute -top-1 -right-1">
                <Crown weight="fill" size={10} class="text-violet-400" />
              </div>
            {/if}
          </a>
          <a href={plan === 'premium' ? '/panel/tournaments' : '/pricing'} 
             class="p-2.5 rounded-xl hover:bg-violet-500/10 transition-all {currentRoute.includes('/tournaments') ? 'text-violet-400 bg-violet-500/5' : 'text-slate-500 hover:text-slate-300'} relative group/nav" 
             title={$t('nav.tournaments')}>
            <Trophy size={20} weight={currentRoute.includes('/tournaments') ? 'fill' : 'duotone'} />
            {#if plan !== 'premium'}
              <div class="absolute -top-1 -right-1">
                <Crown weight="fill" size={10} class="text-violet-400" />
              </div>
            {/if}
          </a>
        </div>
      </div>

      <div class="flex items-center gap-4 flex-shrink-0">
        <!-- Language Switcher -->

        
        <!-- Subscription Badge -->
        <div class="hidden md:flex items-center gap-2.5 bg-white/5 rounded-full py-2 px-4 border border-white/5 group hover:border-violet-500/20 transition-all flex-shrink-0">
          {#if plan === 'premium'}
            <Crown weight="duotone" size={16} class="text-violet-400 group-hover:scale-110 transition-transform" />
            <span class="text-[10px] font-outfit font-bold text-white uppercase tracking-widest">{$t('panel.premiumCoach')}</span>
          {:else}
            <div class="w-2 h-2 rounded-full bg-slate-600"></div>
            <span class="text-[10px] font-outfit font-bold text-slate-500 uppercase tracking-widest">{$t('panel.freePlan')}</span>
          {/if}
        </div>
        
        <div class="relative group">
          <button class="flex items-center gap-3 hover:bg-white/5 p-1 rounded-2xl transition-all border border-transparent hover:border-white/10">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-900 flex items-center justify-center text-white font-outfit font-extrabold text-sm ring-4 ring-violet-500/10 shadow-xl overflow-hidden relative shadow-violet-flare/10">
              {#if teacherAvatar}
                <img src={teacherAvatar} alt="Profile" class="w-full h-full object-cover" />
              {:else}
                {initials}
              {/if}
            </div>
            <div class="text-left hidden sm:block pr-1">
              <div class="flex items-center gap-2">
                <p class="text-sm font-outfit font-bold text-white leading-tight">{teacherName}</p>
                {#if $appStore?.settings?.featuredInsignias && $appStore.settings.featuredInsignias.length > 0}
                  <div class="flex items-center gap-1.5 translate-y-[1px]">
                    {#each $appStore.settings.featuredInsignias as insId}
                      {@const ins = INSIGNIAS.find(i => i.id === insId)}
                      {#if ins}
                        {@const Icon = ins.icon}
                        <Icon size={12} weight="fill" class={ins.color} />
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
              <div class="flex items-center gap-1.5 pt-0.5">
                <p class="text-[9px] text-slate-500 font-outfit font-black uppercase tracking-widest">Control Panel</p>
                <CaretDown weight="bold" size={10} class="text-slate-600 group-hover:text-violet-400 transition-colors" />
              </div>
            </div>
          </button>
          
          <!-- Dropdown -->
          <div class="absolute right-0 top-full mt-3 w-64 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-[100] translate-y-2 group-hover:translate-y-0">
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
              <a href="/panel/settings" class="flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 rounded-xl transition-all group/item">
                <GearSix weight="duotone" size={18} class="group-hover/item:rotate-90 transition-transform duration-500" /> 
                {$t('nav.settings') || 'SETTINGS'}
              </a>

              <!-- Support Link (Everyone) -->
              <a href="/panel/support" 
                 class="flex items-center justify-between px-4 py-3 text-xs font-outfit font-bold text-slate-400 hover:bg-violet-600/10 hover:text-violet-400 rounded-xl transition-all group/item"
                 onclick={() => {
                   supportPulse = false;
                   localStorage.setItem('last_viewed_support', Date.now().toString());
                 }}
              >
                <div class="flex items-center gap-3">
                  <Lifebuoy weight="duotone" size={18} class="group-hover/item:scale-110 transition-transform" /> 
                  {$t('support.title') || 'SOPORTE CHESSNET'}
                </div>
                {#if supportPulse}
                  <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse ring-2 ring-zinc-900"></div>
                {/if}
              </a>
              {#if data.isAdmin}
                <a href="/admin" class="flex items-center justify-between px-4 py-3 text-xs font-outfit font-bold text-primary-400 hover:bg-primary-500/10 rounded-xl transition-all group/admin">
                  <div class="flex items-center gap-3">
                    <Key weight="duotone" size={18} /> 
                    ADMINISTRATION
                  </div>
                  {#if supportPulse}
                    <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse ring-2 ring-zinc-900"></div>
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
                  <div class="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                    <ChatCircleDots weight="duotone" size={18} />
                  </div>
                  <span class="text-xs font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{$t('nav.lobby')}</span>
                </div>
                
                {#if plan !== 'premium' && !data.isAdmin}
                  <div class="flex items-center gap-1.5 px-2 py-1 bg-violet-500/10 rounded-lg border border-violet-500/20">
                    <Crown weight="fill" size={10} class="text-violet-400" />
                    <span class="text-[8px] text-violet-400 font-black">PRO</span>
                  </div>
                {/if}
              </a>
            </div>
            
            <div class="mx-2 mt-1 border-t border-white/5 pt-1">
              <button onclick={handleLogout} class="w-full flex items-center gap-3 px-4 py-3 text-xs font-outfit font-bold text-red-400/70 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all">
                <SignOut weight="duotone" size={18} /> 
                {$t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="pt-20 lg:pt-20 pb-32 lg:pb-24 min-h-screen {isImpersonating ? 'mt-10' : ''}">
    <div class="max-w-7xl mx-auto px-4 lg:px-0">
        {#if $authLoading}
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6" in:fade>
                <div class="relative">
                  <div class="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
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
          <div class="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="absolute inset-4 bg-violet-500/10 rounded-full flex items-center justify-center">
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

  <!-- Mobile Bottom Tab Bar (Premium App Style) -->
  <div  
    class="lg:hidden fixed bottom-6 left-4 right-4 z-50 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom)] ring-1 ring-white/5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer {isNavVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-90 opacity-40 hover:opacity-70'}"
    role="button"
    tabindex="0"
    onclick={() => isNavVisible = true}
    onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') isNavVisible = true; }}
  >
    <div class="h-16 relative px-2 flex items-center justify-between">
      <nav class="flex items-center justify-around w-full relative">
        <!-- Left Side -->
        <a href="/panel" class="flex flex-col items-center justify-center gap-1 w-12 transition-all {currentRoute === '/panel' ? 'text-violet-400 font-bold' : 'text-slate-500'}">
          <House weight={currentRoute === '/panel' ? 'fill' : 'duotone'} size={22} />
          <span class="text-[7px] font-black uppercase tracking-widest leading-none">{$t('nav.dashboard').split(' ')[0]}</span>
        </a>
        
        <a href={plan === 'premium' ? '/panel/lobby' : '/pricing'} class="relative flex flex-col items-center justify-center gap-1 w-12 transition-all {currentRoute.includes('/lobby') ? 'text-violet-400 font-bold' : 'text-slate-500'}">
          <ChatCircleDots weight={currentRoute.includes('/lobby') ? 'fill' : 'duotone'} size={22} />
          <span class="text-[7px] font-black uppercase tracking-widest leading-none">{$t('nav.lobby').split(' ')[1] || $t('nav.lobby')}</span>
          {#if lobbyPulse && plan === 'premium'}
            <div class="absolute top-0 right-1 w-2 h-2 bg-violet-500 rounded-full animate-pulse ring-2 ring-zinc-900"></div>
          {/if}
        </a>
 
        <!-- Center Yellow Support Button -->
        <div class="relative -top-6 px-1">
          <a href="/panel/support" 
             class="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-[0_8px_20px_rgba(245,158,11,0.4)] border-4 border-zinc-950 transition-all active:scale-90 relative overflow-hidden group"
             title={$t('nav.support')}
             onclick={() => {
               supportPulse = false;
               localStorage.setItem('last_viewed_support', Date.now().toString());
             }}
          >
            <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Lifebuoy weight="bold" size={24} class="text-zinc-950" />
            {#if supportPulse}
              <div class="absolute top-2 right-2 w-3 h-3 bg-white rounded-full animate-pulse shadow-lg ring-2 ring-amber-600"></div>
            {/if}
          </a>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span class="text-[7px] font-black text-amber-500 uppercase tracking-[0.2em] leading-none">Help</span>
          </div>
        </div>
 
        <!-- Right Side -->
        <a href="/panel/students" class="flex flex-col items-center justify-center gap-1 w-12 transition-all {currentRoute.includes('/students') ? 'text-violet-400 font-bold' : 'text-slate-500'}">
          <Users weight={currentRoute.includes('/students') ? 'fill' : 'duotone'} size={22} />
          <span class="text-[7px] font-black uppercase tracking-widest leading-none">{$t('nav.students')}</span>
        </a>
 
        <a href="/panel/planner" class="flex flex-col items-center justify-center gap-1 w-12 transition-all {currentRoute.includes('/planner') ? 'text-violet-400 font-bold' : 'text-slate-500'}">
          <Calendar weight={currentRoute.includes('/planner') ? 'fill' : 'duotone'} size={22} />
          <span class="text-[7px] font-black uppercase tracking-widest leading-none">{$t('nav.planner') || 'Plan'}</span>
        </a>
      </nav>
    </div>
  </div>
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
    :global(.font-jakarta), :global(.font-outfit), :global(body) {
       font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
    }
    
    :global(main) {
      padding-top: calc(var(--ios-nav-height) + 1rem) !important;
      padding-bottom: calc(120px + env(safe-area-inset-bottom)) !important;
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
    @apply bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-24 transition-all duration-300;
  }

  @media (max-width: 1023px) {
    :global(.bento-card) {
      @apply rounded-[20px] bg-zinc-900/80 border-white/[0.03];
    }
  }

  :global(.btn-pill) {
    @apply rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center;
  }

  :global(.shadow-violet-flare) {
    box-shadow: 0 0 30px -5px rgba(139, 92, 246, 0.25);
  }
</style>
