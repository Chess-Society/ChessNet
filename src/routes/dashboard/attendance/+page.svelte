<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { base } from "$app/paths";

    onMount(() => {
        // Redirect to classes page for now as attendance is taken there
        goto(`${base}/dashboard/classes`);
    });
</script>

<div class="p-8 text-center text-slate-400">
    <p>Redirigiendo a Clases...</p>
</div>
