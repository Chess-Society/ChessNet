<script lang="ts">
  import { globalAnnouncements } from "$lib/stores/configStore";
  import { page } from "$app/stores";
  import { fade, slide } from "svelte/transition";
  import { Megaphone, X } from "phosphor-svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let dismissedIds = $state(new Set<string>());
  let visible = $state(false);
  let currentAnnouncement = $derived($globalAnnouncements[0] || null);
  let isLanding = $derived($page.url.pathname === "/");

  // Robust visibility management
  $effect(() => {
    if (currentAnnouncement) {
      const dismissedId = browser ? localStorage.getItem("dismissed_announcement_id") : null;
      // Show only if not dismissed in session OR localStorage, and not on landing
      const isDismissed = dismissedIds.has(currentAnnouncement.id) || dismissedId === currentAnnouncement.id;
      visible = !isDismissed && !isLanding;
    } else {
      visible = false;
    }
  });

  // Communicating height to layouts
  $effect(() => {
    if (browser) {
      if (visible) {
        document.documentElement.style.setProperty("--banner-height", "40px");
      } else {
        document.documentElement.style.setProperty("--banner-height", "0px");
      }
    }
  });

  function dismiss() {
    if (currentAnnouncement) {
      dismissedIds.add(currentAnnouncement.id);
      if (browser) {
        localStorage.setItem("dismissed_announcement_id", currentAnnouncement.id);
      }
    }
    visible = false;
  }
</script>

{#if currentAnnouncement && visible && !isLanding}
  <div
    class="fixed top-0 left-0 right-0 z-[200] bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white shadow-xl h-10 flex items-center"
    transition:slide={{ duration: 400 }}
  >
    <div class="max-w-7xl mx-auto px-4 w-full sm:px-6 lg:px-8">
      <div class="flex items-center justify-between flex-wrap">
        <div class="w-0 flex-1 flex items-center">
          <span class="flex p-1.5 rounded-none bg-orange-800/20">
            <Megaphone weight="fill" class="h-3.5 w-3.5 text-white" />
          </span>
          <p
            class="ml-3 font-outfit font-black text-[9px] sm:text-[10px] uppercase tracking-widest truncate"
          >
            <span class="md:hidden"> {currentAnnouncement.title} </span>
            <span class="hidden md:inline">
              {currentAnnouncement.title}: {currentAnnouncement.content || currentAnnouncement.message || ''}
            </span>
          </p>
        </div>


        <div class="flex items-center gap-4">
          {#if currentAnnouncement.link}
            <a
              href={currentAnnouncement.link}
              class="flex items-center justify-center px-4 py-1 border border-transparent rounded-none shadow-sm text-[9px] font-black text-orange-600 bg-white hover:bg-orange-50 transition-colors uppercase tracking-widest"
            >
              {currentAnnouncement.linkText || "VER MÁS"}
            </a>
          {/if}

          <button
            type="button"
            onclick={dismiss}
            class="-mr-1 flex p-1 rounded-none hover:bg-orange-500 focus:outline-none transition-colors"
          >
            <span class="sr-only">Dismiss</span>
            <X class="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
