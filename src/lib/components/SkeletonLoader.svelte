<script lang="ts">
  export let width: string = "100%";
  export let height: string = "1rem";
  export let className: string = "";
</script>

<div 
  class="skeleton rounded {className}" 
  style="width: {width}; height: {height};"
  aria-label="Cargando..."
></div>
