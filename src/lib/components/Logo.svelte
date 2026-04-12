<script lang="ts">
  let { size = "w-10 h-10", iconSize = "w-6 h-6", className = "" } = $props();
</script>

<div class={`${size} rounded-xl bg-slate-900 border border-slate-700/50 flex items-center justify-center shadow-lg shadow-emerald-500/10 transition-all ${className}`}>
  <!-- Custom Shield SVG -->
  <svg 
    class={`${iconSize} text-emerald-500`}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    stroke-width="2" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
</div>
