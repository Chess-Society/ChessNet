<script lang="ts">
  export let size: string = "w-6 h-6";
  export let color: string = "text-primary-500";
  export let className: string = "";
</script>

<div class="flex items-center justify-center {className}">
  <div class="spinner {size} {color}"></div>
</div>
