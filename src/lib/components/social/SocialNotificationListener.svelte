<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { socialApi } from '$lib/api/social';
  import { toast } from '$lib/stores/toast';
  import type { SocialPost } from '$lib/types';

  let unsubscribe: () => void;
  // Store last known counts for engagement metrics to detect changes
  let lastState = new Map<string, { up: number, tips: number, reactions: number }>();
  let firstLoad = true;

  onMount(() => {
    if ($user?.uid) {
      unsubscribe = socialApi.subscribeToUserPosts($user.uid, (posts) => {
        if (firstLoad) {
          posts.forEach(p => {
            const reactionCount = Object.values(p.reactions || {}).reduce((acc, ids) => acc + (ids?.length || 0), 0);
            lastState.set(p.id, { 
              up: p.votes?.up?.length || 0, 
              tips: p.tipsTotal || 0,
              reactions: reactionCount
            });
          });
          firstLoad = false;
          return;
        }

        posts.forEach(p => {
          const prev = lastState.get(p.id);
          const currentUp = p.votes?.up?.length || 0;
          const currentTips = p.tipsTotal || 0;
          const currentReactions = Object.values(p.reactions || {}).reduce((acc, ids) => acc + (ids?.length || 0), 0);

          if (prev) {
            // New Upvotes
            if (currentUp > prev.up) {
              const diff = currentUp - prev.up;
              toast.info(`¡${diff > 1 ? diff + ' personas han' : 'Alguien ha'} dado un voto positivo a tu post!`);
            }
            
            // New Emoji Reactions
            if (currentReactions > prev.reactions) {
              const diff = currentReactions - prev.reactions;
              toast.info(`¡${diff > 1 ? diff + ' personas han' : 'Alguien ha'} reaccionado con emojis a tu publicación!`);
            }
            
            // New Tips (Nets)
            if (currentTips > prev.tips) {
              const diffNets = currentTips - prev.tips;
              toast.success(`¡Has recibido ${diffNets} Nets en propinas por tu publicación!`);
            }
          }

          // Update state for next change
          lastState.set(p.id, { up: currentUp, tips: currentTips, reactions: currentReactions });
        });
      });
    }
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });
</script>

<!-- This component doesn't render anything, it just listens and triggers toasts -->
