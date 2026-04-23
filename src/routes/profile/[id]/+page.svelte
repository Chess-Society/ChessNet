<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { socialApi } from '$lib/api/social';
  import type { SocialPost } from '$lib/types';
  import PostCard from '$lib/components/social/PostCard.svelte';
  import { fade, fly } from 'svelte/transition';
  import { Trophy, Star, Crown, MapPin, Calendar, IdentificationCard, Coins, ArrowLeft } from 'phosphor-svelte';

  let profile = $state<any>(null);
  let posts = $state<SocialPost[]>([]);
  let loading = $state(true);
  let unsubscribe: () => void;

  const userId = $derived($page.params.id);

  onMount(async () => {
    if (!userId) {
      loading = false;
      return;
    }
    
    try {
      profile = await socialApi.getUserProfile(userId as string);
      unsubscribe = socialApi.subscribeToUserPosts(userId as string, (newPosts) => {
        posts = newPosts;
        loading = false;
      });
    } catch (e) {
      console.error(e);
      loading = false;
    }
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  function formatDate(date: string) {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(date));
  }

  // Customization derived from profile data
  let customization = $derived(profile?.economy?.customization || {
    themeColor: '#8b5cf6',
    font: 'Outfit',
    frame: 'none',
    badges: []
  });

  let collection = $derived(profile?.economy?.collection || {
    badges: [],
    emotes: [],
    fonts: [],
    colors: [],
    themes: [],
    frames: []
  });

  // Dynamic Styles
  let profileStyles = $derived(`
    --theme-color: ${customization.themeColor || '#8b5cf6'};
    --theme-font: "${customization.font || 'Outfit'}", sans-serif;
  `);
</script>

<div class="profile-page-container">
  <!-- Header / Navigation -->
  <div class="page-nav">
    <a href="/admin" class="back-btn">
      <ArrowLeft size={16} weight="bold" />
      <span>Volver al Dashboard</span>
    </a>
  </div>

  {#if loading && !profile}
    <div class="loading-full" in:fade>
      <div class="spinner"></div>
      <p>Sincronizando datos del profesor...</p>
    </div>
  {:else if !profile}
    <div class="error-state" in:fade>
      <h2>Usuario no encontrado</h2>
      <p>El perfil que buscas no existe o ha sido movido.</p>
    </div>
  {:else}
    <!-- Profile Hero -->
    <div class="profile-hero" in:fly={{ y: 20 }} style={profileStyles}>
      <div class="hero-content">
        <div class="avatar-large frame-{customization.frame || 'none'}">
          {#if profile.photoURL || profile.avatar_url}
            <img src={profile.photoURL || profile.avatar_url} alt={profile.displayName || profile.full_name} />
          {:else}
            <div class="avatar-placeholder">{(profile.displayName || profile.full_name || 'U')[0]}</div>
          {/if}
          <div class="role-badge" style="background: var(--theme-color)">
            <Star weight="fill" size={12} />
            {profile.settings?.role || 'PROFESOR'}
          </div>
        </div>

        <div class="profile-main-info">
          <h1 class="display-name" style="font-family: var(--theme-font)">
            {profile.displayName || profile.full_name || 'Profesor Sin Nombre'}
          </h1>
          
          <div class="meta-row">
            <div class="meta-item">
              <IdentificationCard size={14} weight="bold" />
              <span>Cédula: #{profile.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div class="meta-item">
              <Calendar size={14} weight="bold" />
              <span>Miembro desde {formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>

        <div class="economy-stats">
          <div class="stat-box nets">
            <div class="label">Saldo de Nets</div>
            <div class="value">
              {profile.economy?.netsBalance || 0}
              <span class="unit">NTS</span>
            </div>
            <div class="icon-bg">
              <Coins size={40} weight="fill" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Split -->
    <div class="content-layout">
      <div class="posts-column">
        <div class="section-header">
          <h2 class="section-title">Actividad Reciente</h2>
          <div class="line"></div>
        </div>

        {#if posts.length === 0}
          <div class="empty-posts">
            <p>Este profesor aún no ha realizado publicaciones sociales.</p>
          </div>
        {:else}
          <div class="posts-list">
            {#each posts as post (post.id)}
              <PostCard {post} />
            {/each}
          </div>
        {/if}
      </div>

      <div class="sidebar-column">
        <div class="info-card" style="--card-accent: var(--theme-color)">
          <h3 class="card-title">Logros y Reconocimientos</h3>
          <div class="badges-grid">
            {#if collection.badges && collection.badges.length > 0}
              {#each collection.badges as badge}
                <div class="badge-item group">
                  <div class="badge-mini">
                    <Trophy size={20} weight="fill" style="color: var(--theme-color)" />
                  </div>
                  <span class="badge-tooltip">{badge}</span>
                </div>
              {/each}
            {:else if profile.badgesCount > 0}
              {#each Array(profile.badgesCount) as _}
                <div class="badge-mini">
                  <Trophy size={20} weight="fill" class="text-amber-500" />
                </div>
              {/each}
            {:else}
              <p class="empty-text">Sin insignias destacadas</p>
            {/if}
          </div>
        </div>

        <div class="info-card">
          <h3 class="card-title">Colección Cosmética</h3>
          <div class="cosmetic-stats">
            <div class="c-stat">
              <span class="c-val">{collection.emotes?.length || 0}</span>
              <span class="c-lab">Emotes</span>
            </div>
            <div class="c-stat">
              <span class="c-val">{collection.colors?.length || 0}</span>
              <span class="c-lab">Colores</span>
            </div>
            <div class="c-stat">
              <span class="c-val">{collection.fonts?.length || 0}</span>
              <span class="c-lab">Fuentes</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3 class="card-title">Sobre el Profesor</h3>
          <p class="bio text-slate-400 text-sm italic">
            "Comprometido con la excelencia ajedrecística en ChessNet OS."
          </p>
          <div class="mt-4 pt-4 border-t border-white/5 space-y-2">
            <div class="flex justify-between text-[10px] font-mono">
              <span class="text-slate-500">ESTADO</span>
              <span class="text-emerald-500 font-black">ACTIVO</span>
            </div>
            <div class="flex justify-between text-[10px] font-mono">
              <span class="text-slate-500">NIVEL</span>
              <span class="text-white font-black">{profile.economy?.tier || 'BRONCE'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .profile-page-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  .page-nav {
    margin-bottom: 2rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    text-decoration: none;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(255,255,255,0.05);
    transition: all 0.2s;
  }

  .back-btn:hover {
    color: #fff;
    border-color: rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.02);
  }

  .profile-hero {
    background: #000;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 3rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
  }

  .profile-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-content {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 3rem;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  .avatar-large {
    width: 140px;
    height: 140px;
    background: #111;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 4px;
    position: relative;
  }

  .avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.5);
    transition: filter 0.3s;
  }

  .avatar-large:hover img {
    filter: grayscale(0);
  }

  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    font-weight: 900;
    font-family: 'Outfit', sans-serif;
    background: #000;
    color: #fff;
  }

  .role-badge {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: #8b5cf6;
    color: white;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 900;
    padding: 0.2rem 0.6rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    white-space: nowrap;
    letter-spacing: 0.1em;
  }

  .display-name {
    font-family: 'Outfit', sans-serif;
    font-size: 4rem;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: -0.04em;
    line-height: 0.9;
    color: #fff;
    margin-bottom: 1rem;
  }

  .meta-row {
    display: flex;
    gap: 2rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #666;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .economy-stats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 250px;
  }

  .stat-box {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .stat-box .label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    font-weight: 900;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 0.5rem;
  }

  .stat-box .value {
    font-family: 'Outfit', sans-serif;
    font-size: 2rem;
    font-weight: 900;
    font-style: italic;
    color: #fff;
    line-height: 1;
  }

  .stat-box .unit {
    font-size: 10px;
    color: #555;
    font-style: normal;
    margin-left: 0.2rem;
  }



  .stat-box.nets {
    border-color: var(--theme-color);
  }

  .icon-bg {
    position: absolute;
    right: -10px;
    bottom: -10px;
    opacity: 0.05;
    color: var(--theme-color);
    transform: rotate(-15deg);
  }

  /* Avatar Frames */
  .avatar-large.frame-neon-violet {
    border: 4px solid #8b5cf6;
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
  }

  .avatar-large.frame-gold {
    border: 4px solid #fbbf24;
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
  }

  /* Tooltips for badges */
  .badge-item {
    position: relative;
  }

  .badge-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-5px);
    background: #000;
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    padding: 2px 6px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s;
  }

  .badge-item:hover .badge-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-10px);
  }

  .cosmetic-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .c-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255,255,255,0.02);
    padding: 0.75rem;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .c-val {
    font-family: 'Outfit', sans-serif;
    font-size: 1.25rem;
    font-weight: 900;
    color: #fff;
  }

  .c-lab {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7px;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .content-layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 4rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .section-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.25rem;
    font-weight: 900;
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: 0.1em;
    color: #fff;
    white-space: nowrap;
  }

  .line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(255,255,255,0.1), transparent);
  }

  .info-card {
    background: #000;
    border: 1px solid rgba(255,255,255,0.05);
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .card-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 900;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .badges-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .badge-mini {
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #444;
    text-transform: uppercase;
  }

  .loading-full, .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10rem 0;
    text-align: center;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 2px solid rgba(255,255,255,0.05);
    border-top-color: #8b5cf6;
    border-radius: 50%;
    animation: spin 1s cubic-bezier(0.16, 1, 0.3, 1) infinite;
    margin-bottom: 2rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .posts-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @media (max-width: 900px) {
    .hero-content {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 2rem;
    }

    .avatar-large { margin: 0 auto; }
    .display-name { font-size: 2.5rem; }
    .meta-row { justify-content: center; }
    .economy-stats { min-width: 100%; }
    .content-layout { grid-template-columns: 1fr; }
  }
</style>
