<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { fade, fly, scale, slide } from "svelte/transition";
    import {
        Shield,
        Mail,
        Lock,
        ArrowRight,
        Loader2,
        CheckCircle2,
        User,
    } from "lucide-svelte";
    import { LoginSchema } from "$lib/schemas";
    import { AuthService } from "$lib/services/auth";

    let email = "";
    let password = "";
    let isLoading = false;
    let error: string | null = null;
    let errors: Record<string, string> = {};
    let success = false;

    async function handleLogin() {
        if (success) return;

        error = null;
        errors = {};
        isLoading = true;

        // 1. Verificación Lógica (Zod)
        const result = LoginSchema.safeParse({ email, password });

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            // Map zod errors to our specific structure
            if (fieldErrors.email) errors.email = fieldErrors.email[0];
            if (fieldErrors.password) errors.password = fieldErrors.password[0];

            isLoading = false;
            // Shake visual effect logic could go here
            return;
        }

        // 2. Llamada al Servicio (REST API Ready)
        try {
            await AuthService.login({ email, password });
            success = true;

            // Redirigir tras breve pausa para mostrar estado de éxito
            setTimeout(() => {
                goto(`${base}/panel`);
            }, 800);
        } catch (err: any) {
            error = err.message || "Ocurrió un error inesperado";
            isLoading = false;
        }
    }
</script>

<div
    class="min-h-screen bg-[#0f172a] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden"
>
    <!-- Background Effects -->
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div
            class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        ></div>
        <div
            class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"
        ></div>
    </div>

    <!-- Orbs -->
    <div
        class="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse"
    ></div>
    <div
        class="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none"
    ></div>

    <div
        class="w-full max-w-md relative z-10"
        in:fly={{ y: 20, duration: 600, delay: 200 }}
    >
        <!-- Logo Header -->
        <div class="text-center mb-8">
            <a
                href="{base}/"
                class="inline-flex items-center gap-2 group mb-4 transition-transform hover:scale-105"
            >
                <div class="relative">
                    <div
                        class="absolute -inset-2 bg-emerald-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    ></div>
                    <div
                        class="relative bg-[#1e293b] p-3 rounded-xl border border-slate-700 shadow-xl"
                    >
                        <Shield class="w-10 h-10 text-emerald-500" />
                    </div>
                </div>
            </a>
            <h1 class="text-3xl font-bold text-white tracking-tight">
                Bienvenido de nuevo
            </h1>
            <p class="text-slate-400 mt-2">
                Accede a tu panel de gestión de ajedrez
            </p>
        </div>

        <!-- Login Card -->
        <div
            class="bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
            <!-- Success Overlay -->
            {#if success}
                <div
                    class="absolute inset-0 bg-emerald-600/90 backdrop-blur-md z-20 flex flex-col items-center justify-center text-white"
                    in:fade
                >
                    <div in:scale={{ start: 0.5, duration: 300 }}>
                        <CheckCircle2 class="w-16 h-16 mb-4" />
                    </div>
                    <p class="text-xl font-bold">¡Acceso Correcto!</p>
                    <p class="text-emerald-100 text-sm mt-1">
                        Entrando al panel...
                    </p>
                </div>
            {/if}

            <form on:submit|preventDefault={handleLogin} class="space-y-5">
                <!-- Global Error -->
                {#if error}
                    <div
                        class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2 animate-shake"
                        transition:slide
                    >
                        <Shield class="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                {/if}

                <!-- Email Input -->
                <div class="space-y-1.5">
                    <label
                        for="email"
                        class="block text-sm font-medium text-slate-300 ml-1"
                        >Email</label
                    >
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <Mail class="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            bind:value={email}
                            disabled={isLoading}
                            class="block w-full pl-10 pr-3 py-2.5 bg-slate-900/50 border {errors.email
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-slate-700 focus:ring-emerald-500'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            placeholder="tu@email.com"
                        />
                    </div>
                    {#if errors.email}
                        <p class="text-red-400 text-xs ml-1" transition:slide>
                            {errors.email}
                        </p>
                    {/if}
                </div>

                <!-- Password Input -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between ml-1">
                        <label
                            for="password"
                            class="block text-sm font-medium text-slate-300"
                            >Contraseña</label
                        >
                        <a
                            href="#"
                            class="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                            >¿Olvidaste tu contraseña?</a
                        >
                    </div>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <Lock class="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            bind:value={password}
                            disabled={isLoading}
                            class="block w-full pl-10 pr-3 py-2.5 bg-slate-900/50 border {errors.password
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-slate-700 focus:ring-emerald-500'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    {#if errors.password}
                        <p class="text-red-400 text-xs ml-1" transition:slide>
                            {errors.password}
                        </p>
                    {/if}
                </div>

                <!-- Submit Button -->
                <div class="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        class="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-900/20 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {#if isLoading}
                            <Loader2 class="w-5 h-5 animate-spin" />
                            <span>Verificando...</span>
                        {:else}
                            <span>Iniciar Sesión</span>
                            <ArrowRight
                                class="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            />
                        {/if}
                    </button>
                </div>
            </form>

            <div class="mt-6 pt-6 border-t border-slate-700/50 text-center">
                <p class="text-sm text-slate-400">
                    ¿No tienes una cuenta?
                    <a
                        href="#"
                        class="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                        >Regístrate gratis</a
                    >
                </p>
            </div>
        </div>

        <p class="text-center text-xs text-slate-600 mt-8">
            &copy; {new Date().getFullYear()} ChessNet. Todos los derechos reservados.
        </p>
    </div>
</div>

<style>
    /* Efecto shake para errores */
    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-4px);
        }
        75% {
            transform: translateX(4px);
        }
    }
    .animate-shake {
        animation: shake 0.3s ease-in-out;
    }
</style>
