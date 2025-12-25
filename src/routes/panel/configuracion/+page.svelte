<script lang="ts">
    import { appStore, storeActions } from "$lib/services/storage";
    import {
        Save,
        Upload,
        Crown,
        Settings as SettingsIcon,
        Globe,
        Wallet,
        User,
    } from "lucide-svelte";
    import { notifications } from "$lib/stores/notifications";

    let store = $appStore;
    appStore.subscribe((val) => (store = val));

    let academyName = store.settings.academyName || "Mi Academia de Ajedrez";
    let currency = store.settings.currency || "EUR";
    let language = store.settings.language || "es";
    let logoPreview = store.settings.academyLogo || "";

    // Teacher Profile
    let teacherName = store.settings.teacherName || "Usuario";
    let teacherTitle = store.settings.teacherTitle || "Profesor";
    let teacherBio = store.settings.teacherBio || "";
    let teacherAvatar = store.settings.teacherAvatar || "";

    function handleLogoUpload(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            logoPreview = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    function handleTeacherUpload(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            teacherAvatar = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    function saveSettings() {
        storeActions.updateSettings({
            academyName,
            currency,
            language,
            academyLogo: logoPreview,
            teacherName,
            teacherTitle,
            teacherBio,
            teacherAvatar,
        });
        notifications.success("Configuración actualizada correctamente");
    }
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center gap-4 mb-8">
        <div class="bg-slate-800 p-3 rounded-xl border border-slate-700">
            <SettingsIcon class="w-8 h-8 text-blue-500" />
        </div>
        <div>
            <h1 class="text-2xl font-bold text-white">Configuración</h1>
            <p class="text-slate-400">Personaliza tu academia y preferencias</p>
        </div>
    </div>

    <!-- Academny Profile -->
    <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 mb-8">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Crown class="w-5 h-5 text-amber-500" />
            Perfil de la Academia
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Logo Upload -->
            <div>
                <span class="block text-sm font-medium text-slate-400 mb-2"
                    >Logo de la Academia</span
                >
                <div class="flex items-center gap-6">
                    <div
                        class="w-24 h-24 bg-slate-900 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group"
                    >
                        {#if logoPreview}
                            <img
                                src={logoPreview}
                                alt="Logo"
                                class="w-full h-full object-contain"
                            />
                            <div
                                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                                <span class="text-xs text-white">Cambiar</span>
                            </div>
                        {:else}
                            <Upload class="w-8 h-8 text-slate-600" />
                        {/if}
                    </div>
                    <div>
                        <input
                            type="file"
                            id="logo-upload"
                            accept="image/*"
                            class="hidden"
                            onchange={handleLogoUpload}
                        />
                        <label
                            for="logo-upload"
                            class="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-700 transition-colors inline-block"
                        >
                            Subir Imagen
                        </label>
                        <p class="text-xs text-slate-500 mt-2">
                            Recomendado: PNG transparente, 200x200px
                        </p>
                    </div>
                </div>
            </div>

            <!-- Academy Name -->
            <div>
                <label
                    for="academyName"
                    class="block text-sm font-medium text-slate-400 mb-2"
                    >Nombre de la Institución</label
                >
                <input
                    type="text"
                    id="academyName"
                    bind:value={academyName}
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 transition-all"
                    placeholder="Ej. Escuela de Ajedrez Kasparov"
                />
                <p class="text-xs text-slate-500 mt-2">
                    Este nombre aparecerá en los diplomas generados.
                </p>
            </div>
        </div>
    </div>

    <!-- Teacher Profile -->
    <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 mb-8">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User class="w-5 h-5 text-blue-400" />
            Perfil del Profesional
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Avatar -->
            <div>
                <span class="block text-sm font-medium text-slate-400 mb-2"
                    >Foto de Perfil</span
                >
                <div class="flex items-center gap-6">
                    <div
                        class="w-24 h-24 bg-slate-900 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative group"
                    >
                        {#if teacherAvatar}
                            <img
                                src={teacherAvatar}
                                alt="Avatar"
                                class="w-full h-full object-cover"
                            />
                            <div
                                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                                <span class="text-xs text-white">Cambiar</span>
                            </div>
                        {:else}
                            <User class="w-8 h-8 text-slate-600" />
                        {/if}
                    </div>
                    <div>
                        <input
                            type="file"
                            id="teacher-upload"
                            accept="image/*"
                            class="hidden"
                            onchange={handleTeacherUpload}
                        />
                        <label
                            for="teacher-upload"
                            class="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-700 transition-colors inline-block"
                        >
                            Subir Foto
                        </label>
                        <p class="text-xs text-slate-500 mt-2">
                            Visible en el panel
                        </p>
                    </div>
                </div>
            </div>

            <!-- Basic Info -->
            <div class="space-y-4">
                <div>
                    <label
                        for="tName"
                        class="block text-sm font-medium text-slate-400 mb-2"
                        >Nombre Completo</label
                    >
                    <input
                        type="text"
                        id="tName"
                        bind:value={teacherName}
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
                        placeholder="Tu nombre"
                    />
                </div>
                <div>
                    <label
                        for="tTitle"
                        class="block text-sm font-medium text-slate-400 mb-2"
                        >Título / Cargo</label
                    >
                    <input
                        type="text"
                        id="tTitle"
                        bind:value={teacherTitle}
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600"
                        placeholder="Ej. Entrenador FIDE"
                    />
                </div>
            </div>

            <!-- Bio (Full Width) -->
            <div class="md:col-span-2">
                <label
                    for="tBio"
                    class="block text-sm font-medium text-slate-400 mb-2"
                    >Biografía Breve</label
                >
                <textarea
                    id="tBio"
                    bind:value={teacherBio}
                    rows="3"
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-600 resize-none"
                    placeholder="Pequeña descripción sobre ti para tus alumnos..."
                ></textarea>
            </div>
        </div>
    </div>

    <!-- Preferences -->
    <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 mb-8">
        <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe class="w-5 h-5 text-emerald-500" />
            Preferencias Regionales
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Currency -->
            <div>
                <label
                    for="currency"
                    class="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2"
                >
                    <Wallet class="w-4 h-4" />
                    Moneda Principal
                </label>
                <select
                    id="currency"
                    bind:value={currency}
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dólar ($)</option>
                    <option value="MXN">Peso Mexicano ($)</option>
                    <option value="ARS">Peso Argentino ($)</option>
                </select>
            </div>

            <!-- Language -->
            <div>
                <label
                    for="language"
                    class="block text-sm font-medium text-slate-400 mb-2"
                    >Idioma de la Interfaz</label
                >
                <select
                    id="language"
                    bind:value={language}
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option value="es">Español</option>
                    <option value="en">English (Beta)</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
        <button
            onclick={saveSettings}
            class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
            <Save class="w-5 h-5" />
            Guardar Cambios
        </button>
    </div>
</div>
