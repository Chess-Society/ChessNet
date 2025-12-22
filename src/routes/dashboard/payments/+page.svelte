<script>
    import { CreditCard, Wrench } from "lucide-svelte";
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
    <div
        class="bg-[#1e293b] rounded-3xl p-12 border border-slate-700 inline-block max-w-lg"
    >
        <div class="bg-teal-500/10 p-6 rounded-full inline-block mb-6">
            <CreditCard class="w-12 h-12 text-teal-400" />
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Sistema de Pagos</h1>
        <div class="flex items-center justify-center gap-2 mb-6">
            <span
                class="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full"
                >BETA</span
            >
            <p class="text-slate-400">Próximamente</p>
        </div>
        <p class="text-slate-400 mb-8 leading-relaxed">
            Estamos integrando Stripe y opciones de pago locales para que puedas
            gestionar las cuotas de tus alumnos directamente desde ChessNet.
        </p>
        <button
            class="bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors pointer-events-none opacity-50 flex items-center gap-2 mx-auto"
        >
            <Wrench class="w-4 h-4" />
            En Desarrollo
        </button>
    </div>
</div>
