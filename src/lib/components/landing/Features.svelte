<script lang="ts">
    import {
        BarChart3,
        CheckCircle2,
        Brain,
        Users,
        Trophy,
        School,
    } from "lucide-svelte";
</script>

<div id="features" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 class="text-base font-semibold leading-7 text-emerald-400">
                Características Principales
            </h2>
            <p
                class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
                Todo lo que necesita un club moderno
            </p>
            <p class="mt-6 text-lg leading-8 text-slate-400">
                Desde pequeñas academias hasta grandes clubes, ChessNet escala
                contigo.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Feature 1: Asistencia (Teacher Daily Driver) -->
            <div
                class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
            >
                <div
                    class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                >
                    <BarChart3 class="w-24 h-24 text-emerald-500" />
                </div>
                <div
                    class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all"
                >
                    <CheckCircle2 class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-white mb-3">
                    Diario de Clase
                </h3>
                <p class="text-slate-400 leading-relaxed">
                    Pasa lista en segundos, registra los temas impartidos y
                    evalúa el progreso de cada sesión al instante.
                </p>
            </div>

            <!-- Feature 2: Material (Content) -->
            <div
                class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
            >
                <div
                    class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                >
                    <Brain class="w-24 h-24 text-pink-500" />
                </div>
                <div
                    class="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition-all"
                >
                    <Brain class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-white mb-3">
                    Material Didáctico
                </h3>
                <p class="text-slate-400 leading-relaxed">
                    Organiza tu temario. Define habilidades (Celada,
                    Apertura...) y asígnalas a tus alumnos cuando las dominen.
                </p>
            </div>

            <!-- Feature 3: Alumnos (CRM) -->
            <div
                class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
            >
                <div
                    class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                >
                    <Users class="w-24 h-24 text-blue-500" />
                </div>
                <div
                    class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all"
                >
                    <Users class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-white mb-3">
                    Ficha de Alumno
                </h3>
                <p class="text-slate-400 leading-relaxed">
                    Ten a mano niveles, contacto, notas privadas y estadísticas
                    de asistencia de cada estudiante.
                </p>
            </div>

            <!-- Feature 4: Torneos -->
            <div
                class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
            >
                <div
                    class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                >
                    <Trophy class="w-24 h-24 text-orange-500" />
                </div>
                <div
                    class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all"
                >
                    <Trophy class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-white mb-3">
                    Torneos Internos
                </h3>
                <p class="text-slate-400 leading-relaxed">
                    Crea competiciones para tus alumnos, genera emparejamientos
                    y fomenta la práctica competitiva.
                </p>
            </div>

            <!-- Feature 5: Academias (Growth) -->
            <div
                class="relative group bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2"
            >
                <div
                    class="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"
                >
                    <School class="w-24 h-24 text-purple-500" />
                </div>
                <div
                    class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all"
                >
                    <School class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-white mb-3">
                    Clubes y Academias
                </h3>
                <p class="text-slate-400 leading-relaxed">
                    ¿Creces? ChessNet escala contigo. Gestiona múltiples
                    ubicaciones, profesores y cientos de alumnos.
                </p>
            </div>

            <div
                class="relative group bg-slate-800/30 p-8 rounded-3xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-center"
            >
                <h3 class="text-xl font-bold text-white mb-2">Próximamente</h3>
                <p class="text-slate-500 text-sm">
                    Pagos online integrados, app para padres y herramientas de
                    marketing.
                </p>
            </div>
        </div>
    </div>
</div>
