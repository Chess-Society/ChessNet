<script lang="ts">
    import { appStore, storeActions, type Lead } from "$lib/services/storage";
    import {
        Plus,
        Phone,
        Mail,
        UserPlus,
        CheckCircle,
        XCircle,
        MessageCircle,
        MoreVertical,
    } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";
    import { flip } from "svelte/animate";

    $: store = $appStore;
    $: leads = store.leads || [];

    let showAddForm = false;
    let newLead: Partial<Lead> = {
        name: "",
        contact: "",
        notes: "",
        status: "new",
        source: "web",
    };

    const columns = [
        { id: "new", label: "Nuevos", color: "bg-blue-500" },
        { id: "contacted", label: "Contactados", color: "bg-amber-500" },
        { id: "trial", label: "Clase Prueba", color: "bg-purple-500" },
        { id: "converted", label: "Inscritos", color: "bg-emerald-500" },
        // 'lost' is hidden or separate
    ];

    function addLead() {
        if (!newLead.name) return;
        storeActions.addLead({
            id: crypto.randomUUID(),
            name: newLead.name,
            contact: newLead.contact || "",
            notes: newLead.notes || "",
            status: "new",
            source: "web",
            createdAt: new Date().toISOString(),
        } as Lead);
        showAddForm = false;
        newLead = { name: "", contact: "", notes: "" };
    }

    function moveLead(lead: Lead, status: Lead["status"]) {
        storeActions.updateLead({ ...lead, status });
        if (status === "converted") {
            if (
                confirm(
                    `¿Deseas convertir a ${lead.name} en estudiante oficial ahora?`,
                )
            ) {
                // Logic to convert to Student could go here
                storeActions.addStudent({
                    id: crypto.randomUUID(),
                    name: lead.name,
                    email: lead.contact.includes("@") ? lead.contact : "",
                    level: "Pawn",
                    notes: `Convertido desde CRM. Notas: ${lead.notes || ""}`,
                });
                alert(
                    `${lead.name} ha sido añadido a la lista de estudiantes.`,
                );
            }
        }
    }

    function deleteLead(id: string) {
        if (confirm("¿Eliminar este interesado?")) {
            storeActions.removeLead(id);
        }
    }
</script>

<div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-6rem)] flex flex-col"
>
    <!-- Header -->
    <div class="flex justify-between items-center py-6">
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <UserPlus class="w-8 h-8 text-indigo-500" /> CRM / Interesados
            </h1>
            <p class="mt-1 text-slate-400">
                Gestiona potenciales alumnos y seguimientos.
            </p>
        </div>
        <button
            on:click={() => (showAddForm = true)}
            class="btn btn-primary bg-indigo-600 hover:bg-indigo-500"
        >
            <Plus class="w-5 h-5 mr-2" />
            Nuevo Interesado
        </button>
    </div>

    <!-- Add Form Modal -->
    {#if showAddForm}
        <div
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            transition:fade
        >
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 class="text-lg font-bold mb-4 text-slate-800">
                    Añadir Interesado
                </h3>
                <div class="space-y-3">
                    <div>
                        <label
                            class="block text-sm font-medium text-slate-700"
                            for="lead-name">Nombre</label
                        >
                        <input
                            id="lead-name"
                            bind:value={newLead.name}
                            type="text"
                            class="w-full px-3 py-2 border rounded-lg"
                            placeholder="Nombre del alumno/padre"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-slate-700"
                            for="lead-contact">Contacto</label
                        >
                        <input
                            id="lead-contact"
                            bind:value={newLead.contact}
                            type="text"
                            class="w-full px-3 py-2 border rounded-lg"
                            placeholder="Teléfono o Email"
                        />
                    </div>
                    <div>
                        <label
                            class="block text-sm font-medium text-slate-700"
                            for="lead-notes">Notas Iniciales</label
                        >
                        <textarea
                            id="lead-notes"
                            bind:value={newLead.notes}
                            class="w-full px-3 py-2 border rounded-lg"
                            placeholder="Interés, edad, nivel..."
                        ></textarea>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button
                            on:click={() => (showAddForm = false)}
                            class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >Cancelar</button
                        >
                        <button
                            on:click={addLead}
                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >Guardar</button
                        >
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Kanban Board -->
    <div class="flex-1 overflow-x-auto pb-4">
        <div class="flex gap-6 min-w-max h-full">
            {#each columns as col}
                <div
                    class="w-80 flex flex-col bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden"
                >
                    <!-- Column Header -->
                    <div
                        class="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50"
                    >
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full {col.color}"></div>
                            <span class="font-bold text-white">{col.label}</span
                            >
                        </div>
                        <span
                            class="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300"
                        >
                            {leads.filter((l) => l.status === col.id).length}
                        </span>
                    </div>

                    <!-- Cards Container -->
                    <div
                        class="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar"
                    >
                        {#each leads.filter((l) => l.status === col.id) as lead (lead.id)}
                            <div
                                animate:flip={{ duration: 300 }}
                                class="bg-[#1e293b] p-4 rounded-lg border border-slate-700 shadow-sm hover:border-slate-500 transition-all group"
                            >
                                <div
                                    class="flex justify-between items-start mb-2"
                                >
                                    <h4 class="font-bold text-white text-base">
                                        {lead.name}
                                    </h4>
                                    <button
                                        on:click={() => deleteLead(lead.id)}
                                        class="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XCircle class="w-4 h-4" />
                                    </button>
                                </div>

                                {#if lead.contact}
                                    <div
                                        class="flex items-center gap-2 text-sm text-slate-400 mb-2"
                                    >
                                        {#if lead.contact.includes("@")}
                                            <Mail class="w-3 h-3" />
                                        {:else}
                                            <Phone class="w-3 h-3" />
                                        {/if}
                                        {lead.contact}
                                    </div>
                                {/if}

                                {#if lead.notes}
                                    <p
                                        class="text-xs text-slate-500 mb-3 bg-slate-800/50 p-2 rounded italic"
                                    >
                                        "{lead.notes}"
                                    </p>
                                {/if}

                                <!-- Actions / Move -->
                                <div
                                    class="flex gap-1 mt-2 pt-2 border-t border-slate-700/50"
                                >
                                    {#if col.id !== "new"}
                                        <button
                                            class="flex-1 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors"
                                            title="Mover Atrás"
                                            on:click={() =>
                                                moveLead(
                                                    lead,
                                                    columns[
                                                        columns.findIndex(
                                                            (c) =>
                                                                c.id === col.id,
                                                        ) - 1
                                                    ].id as any,
                                                )}
                                        >
                                            ←
                                        </button>
                                    {/if}
                                    {#if col.id !== "converted"}
                                        <button
                                            class="flex-1 py-1 text-xs bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 hover:text-white rounded transition-colors font-medium"
                                            title="Avanzar Estado"
                                            on:click={() =>
                                                moveLead(
                                                    lead,
                                                    columns[
                                                        columns.findIndex(
                                                            (c) =>
                                                                c.id === col.id,
                                                        ) + 1
                                                    ].id as any,
                                                )}
                                        >
                                            Avanzar →
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        {/each}

                        {#if leads.filter((l) => l.status === col.id).length === 0}
                            <div
                                class="text-center py-8 text-slate-600 text-sm border-2 border-dashed border-slate-800 rounded-lg"
                            >
                                Vacío
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    /* Utility for flip animation which is not auto-imported */
    /* We can't use animate:flip without importing flip from svelte/animate */
</style>
