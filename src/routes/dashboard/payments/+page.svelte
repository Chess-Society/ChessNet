<script lang="ts">
    import {
        appStore,
        storeActions,
        type Payment,
    } from "$lib/services/storage";
    import {
        CreditCard,
        Plus,
        TrendingUp,
        Calendar,
        DollarSign,
        User,
        Trash2,
        Wallet,
        Search,
        Filter,
        FileText,
        Download,
    } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import { exportReceiptPDF } from "$lib/services/export";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let showForm = false;
    let newPayment: Payment = {
        id: "",
        studentId: "",
        amount: 30,
        concept: "Mensualidad",
        date: new Date().toISOString().split("T")[0],
        method: "cash",
        notes: "",
    };

    // --- Filters ---
    let searchTerm = "";
    let filterDate = ""; // Month YYYY-MM
    let filterMethod = "all";

    // Derived values with Filtering
    $: totalRevenue = store.payments.reduce((sum, p) => sum + p.amount, 0);

    $: filteredPayments = store.payments.filter((p) => {
        const matchesTerm =
            searchTerm === "" ||
            p.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getStudentName(p.studentId)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesDate = filterDate === "" || p.date.startsWith(filterDate);
        const matchesMethod =
            filterMethod === "all" || p.method === filterMethod;

        return matchesTerm && matchesDate && matchesMethod;
    });

    $: sortedPayments = [...filteredPayments].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    function getStudentName(id: string) {
        const s = store.students.find((std) => std.id === id);
        return s ? s.name : "Alumno Eliminado";
    }

    function handleSubmit() {
        if (!newPayment.studentId || !newPayment.amount) return;

        const paymentToAdd = {
            ...newPayment,
            id: crypto.randomUUID(),
        };

        storeActions.addPayment(paymentToAdd);

        // Reset form
        newPayment = {
            id: "",
            studentId: "",
            amount: 30,
            concept: "Mensualidad",
            date: new Date().toISOString().split("T")[0],
            method: "cash",
            notes: "",
        };
        showForm = false;
    }

    function removePayment(id: string) {
        if (confirm("¿Borrar este registro de pago?")) {
            storeActions.removePayment(id);
        }
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <CreditCard class="w-8 h-8 text-teal-400" /> Control de Pagos
            </h1>
            <p class="mt-2 text-slate-400">
                Gestiona los ingresos y cuotas de tus alumnos.
            </p>
        </div>
        <button
            onclick={() => (showForm = !showForm)}
            class="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
        >
            <Plus class="w-5 h-5" />
            Registrar Pago
        </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
            <p class="text-slate-400 text-sm font-medium">Ingresos Totales</p>
            <p class="text-3xl font-bold text-white mt-2">
                {totalRevenue.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                })}
            </p>
            <div class="mt-2 text-teal-400 text-xs flex items-center">
                <TrendingUp class="w-3 h-3 mr-1" /> Acumulado histórico
            </div>
        </div>
        <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
            <p class="text-slate-400 text-sm font-medium">Pagos Registrados</p>
            <p class="text-3xl font-bold text-white mt-2">
                {store.payments.length}
            </p>
            <div class="mt-2 text-slate-500 text-xs">Transacciones</div>
        </div>
        <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
            <p class="text-slate-400 text-sm font-medium">Ticket Medio</p>
            <p class="text-3xl font-bold text-white mt-2">
                {(store.payments.length > 0
                    ? totalRevenue / store.payments.length
                    : 0
                ).toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                })}
            </p>
            <div class="mt-2 text-slate-500 text-xs">Por transacción</div>
        </div>
    </div>

    <!-- Form -->
    {#if showForm}
        <div
            transition:slide
            class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 max-w-2xl mx-auto shadow-2xl"
        >
            <h3 class="text-lg font-bold text-white mb-4">
                Registrar Nuevo Ingreso
            </h3>
            <div class="space-y-4">
                <div>
                    <label
                        for="payment-student"
                        class="block text-sm font-medium text-slate-400 mb-1"
                        >Alumno</label
                    >
                    <select
                        id="payment-student"
                        bind:value={newPayment.studentId}
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    >
                        <option value="">Seleccionar alumno...</option>
                        {#each store.students as student}
                            <option value={student.id}>{student.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            for="payment-amount"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Cantidad (€)</label
                        >
                        <div class="relative">
                            <DollarSign
                                class="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
                            />
                            <input
                                id="payment-amount"
                                type="number"
                                bind:value={newPayment.amount}
                                class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            for="payment-date"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Fecha</label
                        >
                        <input
                            id="payment-date"
                            type="date"
                            bind:value={newPayment.date}
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            for="payment-concept"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Concepto</label
                        >
                        <input
                            id="payment-concept"
                            type="text"
                            bind:value={newPayment.concept}
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label
                            for="payment-method"
                            class="block text-sm font-medium text-slate-400 mb-1"
                            >Método de Pago</label
                        >
                        <select
                            id="payment-method"
                            bind:value={newPayment.method}
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="cash">Efectivo</option>
                            <option value="transfer">Transferencia</option>
                            <option value="bizum">Bizum</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button
                        onclick={() => (showForm = false)}
                        class="text-slate-400 hover:text-white px-4 py-2"
                        >Cancelar</button
                    >
                    <button
                        onclick={handleSubmit}
                        class="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-lg font-medium"
                        >Guardar Pago</button
                    >
                </div>
            </div>
        </div>
    {/if}

    <!-- Transaction History -->
    <div
        class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
    >
        <!-- Filter Bar -->
        <div
            class="p-4 border-b border-slate-700 bg-slate-900/30 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
            <div class="flex items-center gap-2 w-full md:w-auto">
                <div class="relative w-full md:w-64">
                    <Search
                        class="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
                    />
                    <input
                        bind:value={searchTerm}
                        type="text"
                        placeholder="Buscar alumno o concepto..."
                        class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-teal-500 outline-none"
                    />
                </div>
            </div>

            <div class="flex gap-2 w-full md:w-auto">
                <div class="relative">
                    <input
                        bind:value={filterDate}
                        type="month"
                        class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-teal-500 outline-none"
                    />
                </div>
                <select
                    bind:value={filterMethod}
                    class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-teal-500 outline-none"
                >
                    <option value="all">Todos los métodos</option>
                    <option value="cash">Efectivo</option>
                    <option value="transfer">Transferencia</option>
                    <option value="bizum">Bizum</option>
                </select>
            </div>
        </div>

        <div class="overflow-x-auto">
            <!-- Mobile View (Cards) -->
            <div class="block sm:hidden divide-y divide-slate-700">
                {#if sortedPayments.length === 0}
                    <div class="p-8 text-center text-slate-500">
                        <Search class="w-8 h-8 mx-auto mb-2 opacity-20" />
                        No se encontraron transacciones.
                    </div>
                {:else}
                    {#each sortedPayments as payment}
                        <div class="p-4 flex flex-col gap-3">
                            <div class="flex items-start justify-between">
                                <div>
                                    <div class="font-medium text-white text-lg">
                                        {getStudentName(payment.studentId)}
                                    </div>
                                    <div
                                        class="text-xs text-slate-400 font-mono mt-0.5"
                                    >
                                        {payment.date}
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div
                                        class="font-bold text-teal-400 text-lg"
                                    >
                                        +{payment.amount} €
                                    </div>
                                    <span
                                        class="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border border-slate-700 inline-block mt-1"
                                    >
                                        {payment.method}
                                    </span>
                                </div>
                            </div>

                            <div
                                class="text-sm text-slate-300 bg-slate-800/50 p-2 rounded border border-slate-700/50"
                            >
                                {payment.concept}
                            </div>

                            <div
                                class="flex items-center justify-end gap-2 mt-1"
                            >
                                <button
                                    onclick={() =>
                                        exportReceiptPDF(
                                            payment,
                                            getStudentName(payment.studentId),
                                        )}
                                    class="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-teal-500/20 transition-colors flex-1 flex justify-center items-center gap-2 text-sm font-medium"
                                >
                                    <FileText class="w-4 h-4" /> Recibo
                                </button>
                                <button
                                    onclick={() => removePayment(payment.id)}
                                    class="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-colors flex-1 flex justify-center items-center gap-2 text-sm font-medium"
                                >
                                    <Trash2 class="w-4 h-4" /> Eliminar
                                </button>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>

            <!-- Desktop View (Table) -->
            <table class="w-full text-left hidden sm:table">
                <thead class="bg-slate-900/50">
                    <tr>
                        <th class="p-4 text-slate-400 font-medium text-sm"
                            >Fecha</th
                        >
                        <th class="p-4 text-slate-400 font-medium text-sm"
                            >Alumno</th
                        >
                        <th class="p-4 text-slate-400 font-medium text-sm"
                            >Concepto</th
                        >
                        <th class="p-4 text-slate-400 font-medium text-sm"
                            >Método</th
                        >
                        <th
                            class="p-4 text-slate-400 font-medium text-sm text-right"
                            >Cantidad</th
                        >
                        <th
                            class="p-4 text-slate-400 font-medium text-sm text-center"
                            >Acciones</th
                        >
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700">
                    {#if sortedPayments.length === 0}
                        <tr>
                            <td
                                colspan="6"
                                class="p-12 text-center text-slate-500"
                            >
                                <Search
                                    class="w-8 h-8 mx-auto mb-2 opacity-20"
                                />
                                No se encontraron transacciones.
                            </td>
                        </tr>
                    {:else}
                        {#each sortedPayments as payment}
                            <tr
                                class="hover:bg-slate-800/50 transition-colors group"
                            >
                                <td class="p-4 text-slate-300 font-mono text-sm"
                                    >{payment.date}</td
                                >
                                <td class="p-4 font-medium text-white"
                                    >{getStudentName(payment.studentId)}</td
                                >
                                <td class="p-4 text-slate-400 text-sm"
                                    >{payment.concept}</td
                                >
                                <td class="p-4">
                                    <span
                                        class="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded uppercase font-bold border border-slate-700"
                                    >
                                        {payment.method}
                                    </span>
                                </td>
                                <td
                                    class="p-4 text-right font-bold text-teal-400"
                                >
                                    +{payment.amount} €
                                </td>
                                <td
                                    class="p-4 flex items-center justify-center gap-2"
                                >
                                    <button
                                        onclick={() =>
                                            exportReceiptPDF(
                                                payment,
                                                getStudentName(
                                                    payment.studentId,
                                                ),
                                            )}
                                        class="p-2 text-slate-500 hover:text-teal-400 transition-colors rounded-lg hover:bg-teal-500/10"
                                        title="Descargar Recibo"
                                    >
                                        <FileText class="w-4 h-4" />
                                    </button>
                                    <button
                                        onclick={() =>
                                            removePayment(payment.id)}
                                        class="p-2 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                                        title="Eliminar registro"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>
