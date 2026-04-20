<script lang="ts">
  let { size = "w-11 h-11", iconSize = "w-6 h-6", className = "" } = $props();
</script>

<div class={`${size} rounded-none bg-[#09090B] border border-white/5 flex items-center justify-center shadow-lg shadow-violet-500/10 transition-all duration-300 hover:shadow-violet-500/30 hover:-translate-y-0.5 ${className}`}>
  <!-- Custom Shield SVG -->
  <svg 
    class={`${iconSize} text-violet-500`}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2.5" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
</div>

