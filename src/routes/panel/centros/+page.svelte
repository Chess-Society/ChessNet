<script lang="ts">
    import { appStore, storeActions, type Center } from "$lib/services/storage";
    import {
        School,
        MapPin,
        Users,
        Building,
        Plus,
        Trash2,
    } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";
    import { base } from "$app/paths";
    import ConfirmationModal from "$lib/components/ConfirmationModal.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { notifications } from "$lib/stores/notifications";

    $: store = $appStore;

    let showForm = false;
    let newCenter: Center = {
        id: "",
        name: "",
        location: "",
        description: "",
    };

    // Form validation errors
    let formErrors: {
        name?: string;
        location?: string;
    } = {};

    function validateCenterForm(): boolean {
        formErrors = {};
        let isValid = true;

        if (!newCenter.name || newCenter.name.trim().length < 3) {
            formErrors.name = "El nombre debe tener al menos 3 caracteres";
            isValid = false;
        }

        if (!newCenter.location || newCenter.location.trim().length < 3) {
            formErrors.location = "La ubicación es obligatoria";
            isValid = false;
        }

        return isValid;
    }

    function handleSubmit() {
        if (!validateCenterForm()) {
            notifications.error(
                "Por favor, corrige los errores del formulario",
            );
            return;
        }

        const centerToAdd = {
            ...newCenter,
            id: crypto.randomUUID(),
        };

        storeActions.addCenter(centerToAdd);

        // Reset form
        newCenter = { id: "", name: "", location: "", description: "" };
        formErrors = {};
        showForm = false;
        notifications.success("Centro añadido correctamente");
    }

    let showDeleteModal = false;
    let centerToDeleteId: string | null = null;

    function deleteCenter(id: string) {
        centerToDeleteId = id;
        showDeleteModal = true;
    }

    function confirmDelete() {
        if (centerToDeleteId) {
            storeActions.removeCenter(centerToDeleteId);
            notifications.success("Centro eliminado correctamente.");
            centerToDeleteId = null;
        }
    }

    function getStudentCount(centerId: string) {
        const centerClasses = store.classes.filter(
            (c) => c.centerId === centerId,
        );
        const uniqueStudents = new Set<string>();
        centerClasses.forEach((c) => {
            c.students.forEach((sId) => uniqueStudents.add(sId));
        });
        return uniqueStudents.size;
    }

    function openForm() {
        formErrors = {};
        showForm = true;
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8"
    >
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <School class="w-8 h-8 text-blue-500" /> Centros Educativos
            </h1>
            <p class="mt-2 text-slate-400">
                Gest iona las escuelas y clubes donde impartes clase.
            </p>
        </div>
        <button
            onclick={openForm}
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 sm:py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-900/20"
        >
            <Plus class="w-5 h-5" />
            Nuevo Centro
        </button>
    </div>

    <Modal bind:isOpen={showForm} title="Añadir Nuevo Centro" size="md">
        <div class="space-y-4">
            <div>
                <label
                    for="center-name"
                    class="block text-sm font-medium text-slate-400 mb-1"
                    >Nombre del Centro <span class="text-red-400">*</span
                    ></label
                >
                <input
                    id="center-name"
                    bind:value={newCenter.name}
                    type="text"
                    placeholder="Ej: Colegio San José"
                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 {formErrors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                        : ''}"
                />
                {#if formErrors.name}
                    <p
                        class="text-red-400 text-xs mt-1 flex items-center gap-1"
                    >
                        <svg
                            class="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        {formErrors.name}
                    </p>
                {/if}
            </div>
            <div>
                <label
                    for="center-location"
                    class="block text-sm font-medium text-slate-400 mb-1"
                    >Ubicación <span class="text-red-400">*</span></label
                >
                <div class="relative">
                    <MapPin
                        class="absolute left-3 top-3.5 w-4 h-4 text-slate-500"
                    />
                    <input
                        id="center-location"
                        bind:value={newCenter.location}
                        type="text"
                        placeholder="Ciudad, Barrio o Dirección"
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 {formErrors.location
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                            : ''}"
                    />
                </div>
                {#if formErrors.location}
                    <p
                        class="text-red-400 text-xs mt-1 flex items-center gap-1"
                    >
                        <svg
                            class="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        {formErrors.location}
                    </p>
                {/if}
            </div>
            <div class="flex justify-end gap-3 mt-6">
                <button
                    onclick={() => (showForm = false)}
                    class="text-slate-400 hover:text-white px-4 py-2"
                    >Cancelar</button
                >
                <button
                    onclick={handleSubmit}
                    class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium"
                    >Guardar Centro</button
                >
            </div>
        </div>
    </Modal>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if store.centers.length === 0}
            <div
                class="col-span-full py-12 text-center bg-[#1e293b]/50 rounded-3xl border border-dashed border-slate-700"
            >
                <School class="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 class="text-xl font-bold text-white mb-2">
                    No hay centros registrados
                </h3>
                <p class="text-slate-400 mb-6">
                    Añade tu primer centro educativo para empezar.
                </p>
                <button
                    onclick={openForm}
                    class="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-6 py-2 rounded-xl font-medium transition-all"
                >
                    Añadir Centro
                </button>
            </div>
        {:else}
            {#each store.centers as center}
                <div
                    class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500/30 transition-all group relative"
                >
                    <button
                        onclick={() => deleteCenter(center.id)}
                        class="absolute top-4 right-4 text-slate-500 hover:text-red-400 hover:bg-slate-800 p-2 rounded-lg transition-colors z-10"
                        title="Eliminar Centro"
                    >
                        <Trash2 class="w-5 h-5" />
                    </button>

                    <div class="flex items-start justify-between mb-4">
                        <div class="bg-blue-500/10 p-3 rounded-xl">
                            <Building class="w-6 h-6 text-blue-500" />
                        </div>
                    </div>

                    <h3 class="text-xl font-bold text-white mb-2">
                        {center.name}
                    </h3>

                    <div class="space-y-2 mb-6">
                        <div class="flex items-center text-slate-400 text-sm">
                            <MapPin class="w-4 h-4 mr-2" />
                            {center.location}
                        </div>
                        <div class="flex items-center text-slate-400 text-sm">
                            <Users class="w-4 h-4 mr-2" />
                            {getStudentCount(center.id)} Alumnos
                        </div>
                    </div>

                    <a
                        href="{base}/panel/centros/{center.id}"
                        class="block w-full text-center bg-slate-800 text-slate-300 py-2 rounded-xl text-sm font-semibold hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
                    >
                        Gestionar
                    </a>
                </div>
            {/each}
        {/if}
    </div>
</div>

<ConfirmationModal
    bind:isOpen={showDeleteModal}
    title="¿Eliminar centro?"
    message="Esta acción eliminará el centro y todas las clases asociadas a él."
    confirmText="Eliminar Centro"
    on:confirm={confirmDelete}
/>
