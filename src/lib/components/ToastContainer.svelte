<script lang="ts">
    import { notifications } from "$lib/stores/notifications";
    import Toast from "./Toast.svelte";
    import { flip } from "svelte/animate";
</script>

<div
    class="pointer-events-none fixed inset-0 flex flex-col items-center justify-end gap-4 p-4 sm:items-end sm:justify-start z-[9999]"
>
    {#each $notifications as toast (toast.id)}
        <div animate:flip={{ duration: 300 }}>
            <Toast {toast} />
        </div>
    {/each}
</div>
