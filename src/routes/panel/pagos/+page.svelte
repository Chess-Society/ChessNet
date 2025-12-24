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
        ArrowUpRight,
        ArrowDownRight,
        Banknote,
        Smartphone,
        Landmark,
        MoreHorizontal,
    } from "lucide-svelte";
    import { slide, fade, fly } from "svelte/transition";
    import { exportReceiptPDF } from "$lib/services/export";
    import ConfirmationModal from "$lib/components/ConfirmationModal.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { notifications } from "$lib/stores/notifications";

    $: store = $appStore;

    // --- State ---
    let showForm = false;
    let newPayment: Payment = {
        id: "",
        studentId: "",
        amount: 30, // Default price
        concept: "Mensualidad Mes Actual",
        date: new Date().toISOString().split("T")[0],
        method: "cash",
        notes: "",
    };

    // Filters
    let searchTerm = "";

    // Form validation errors
    let formErrors: {
        studentId?: string;
        amount?: string;
        concept?: string;
    } = {};

    function validatePaymentForm(): boolean {
        formErrors = {};
        let isValid = true;

        if (!newPayment.studentId) {
            formErrors.studentId = "Selecciona un alumno";
            isValid = false;
        }

        if (!newPayment.amount || newPayment.amount <= 0) {
            formErrors.amount = "El importe debe ser mayor a 0";
            isValid = false;
        }

        if (!newPayment.concept || newPayment.concept.trim().length < 2) {
            formErrors.concept = "El concepto es obligatorio";
            isValid = false;
        }

        return isValid;
    }

    // --- Confirmation Modal State ---
    let showConfirmModal = false;
    let confirmTitle = "";
    let confirmMessage = "";
    let confirmAction: () => void = () => {};
    let confirmType: "danger" | "warning" = "danger";

    // --- Derived Data & KPIs ---

    $: payments = store.payments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Filter logic
    $: filteredPayments = payments.filter((p) => {
        const studentName = getStudentName(p.studentId).toLowerCase();
        const concept = p.concept.toLowerCase();
        const term = searchTerm.toLowerCase();
        return studentName.includes(term) || concept.includes(term);
    });

    // Grouping by Month (YYYY-MM)
    $: groupedPayments = filteredPayments.reduce(
        (acc, p) => {
            const monthKey = p.date.substring(0, 7); // "2023-11"
            if (!acc[monthKey]) acc[monthKey] = [];
            acc[monthKey].push(p);
            return acc;
        },
        {} as Record<string, Payment[]>,
    );

    $: sortedMonths = Object.keys(groupedPayments).sort((a, b) =>
        b.localeCompare(a),
    );

    // KPIs
    $: totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Current Month Revenue
    $: currentMonthKey = new Date().toISOString().substring(0, 7);
    $: currentMonthRevenue = (groupedPayments[currentMonthKey] || []).reduce(
        (sum, p) => sum + p.amount,
        0,
    );

    // Last Month Revenue
    $: lastDate = new Date();
    $: {
        lastDate.setMonth(lastDate.getMonth() - 1);
    }
    $: lastMonthKey = lastDate.toISOString().substring(0, 7);
    $: lastMonthRevenue = (groupedPayments[lastMonthKey] || []).reduce(
        (sum, p) => sum + p.amount,
        0,
    );

    $: growth =
        lastMonthRevenue > 0
            ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) *
              100
            : 100;

    // --- Helpers ---

    function getStudentName(id: string) {
        const s = store.students.find((std) => std.id === id);
        return s ? s.name : "Alumno Eliminado";
    }

    function formatMonth(monthKey: string) {
        const [year, month] = monthKey.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString("es-ES", {
            month: "long",
            year: "numeric",
        });
    }

    const methodIcons = {
        cash: Banknote,
        transfer: Landmark,
        bizum: Smartphone,
        other: Wallet,
    };

    const methodLabels = {
        cash: "Efectivo",
        transfer: "Transferencia",
        bizum: "Bizum",
        other: "Otro",
    };

    // --- Actions ---

    function handleSubmit() {
        if (!validatePaymentForm()) {
            notifications.error(
                "Por favor, corrige los errores del formulario",
            );
            return;
        }

        const paymentToAdd = {
            ...newPayment,
            id: crypto.randomUUID(),
        };

        storeActions.addPayment(paymentToAdd);
        notifications.success("Pago registrado correctamente");

        newPayment = {
            id: "",
            studentId: "",
            amount: 30,
            concept: "Mensualidad",
            date: new Date().toISOString().split("T")[0],
            method: "cash",
            notes: "",
        };
        formErrors = {};
        showForm = false;
    }

    function handleDeleteClick(id: string) {
        confirmTitle = "¿Eliminar pago?";
        confirmMessage =
            "Esta acción eliminará el registro financiero permanentemente.";
        confirmType = "danger";
        confirmAction = () => {
            storeActions.removePayment(id);
            notifications.success("Pago eliminado.");
        };
        showConfirmModal = true;
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Top Bar -->
    <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
    >
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
                <CreditCard class="w-8 h-8 text-teal-400" />
                Finanzas
            </h1>
            <p class="mt-2 text-slate-400">
                Panel de control de ingresos y mensualidades.
            </p>
        </div>
        <div class="flex gap-3">
            <div class="relative group">
                <input
                    bind:value={searchTerm}
                    type="text"
                    placeholder="Buscar..."
                    class="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500 w-full md:w-64 transition-all"
                />
                <Search
                    class="absolute left-3 top-2.5 w-4 h-4 text-slate-500 group-focus-within:text-teal-500"
                />
            </div>
            <button
                onclick={() => (showForm = !showForm)}
                class="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-teal-900/20"
            >
                <Plus class="w-5 h-5" />
                <span class="hidden sm:inline">Nuevo Ingreso</span>
            </button>
        </div>
    </div>

    <!-- KPIs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <!-- Card 1: Total Life Time -->
        <div
            class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-600 transition-colors"
        >
            <div
                class="absolute right-0 top-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-teal-500/20 transition-all"
            ></div>

            <div class="relative z-10">
                <div class="flex items-center gap-2 mb-2">
                    <div class="p-2 bg-slate-700/50 rounded-lg">
                        <Wallet class="w-5 h-5 text-slate-300" />
                    </div>
                    <span class="text-slate-400 text-sm font-medium"
                        >Ingresos Totales</span
                    >
                </div>
                <div class="text-3xl font-bold text-white tracking-tight">
                    {totalRevenue.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                    })}
                </div>
                <div class="text-xs text-slate-500 mt-2">
                    Desde el inicio de los tiempos
                </div>
            </div>
        </div>

        <!-- Card 2: This Month -->
        <div
            class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-600 transition-colors"
        >
            <div
                class="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mb-10 group-hover:bg-emerald-500/20 transition-all"
            ></div>

            <div class="relative z-10">
                <div class="flex items-center gap-2 mb-2">
                    <div class="p-2 bg-slate-700/50 rounded-lg">
                        <Calendar class="w-5 h-5 text-emerald-400" />
                    </div>
                    <span class="text-slate-400 text-sm font-medium"
                        >Este Mes ({new Date().toLocaleString("es-ES", {
                            month: "long",
                        })})</span
                    >
                </div>
                <div
                    class="text-3xl font-bold text-white tracking-tight flex items-end gap-3"
                >
                    {currentMonthRevenue.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                    })}

                    {#if growth !== 0}
                        <div
                            class="flex items-center text-sm mb-1 px-2 py-0.5 rounded-full {growth >=
                            0
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/20 text-red-400'}"
                        >
                            {#if growth >= 0}
                                <ArrowUpRight class="w-3 h-3 mr-1" />
                            {:else}
                                <ArrowDownRight class="w-3 h-3 mr-1" />
                            {/if}
                            {Math.abs(Math.round(growth))}%
                        </div>
                    {/if}
                </div>
                <div class="text-xs text-slate-500 mt-2">vs. mes anterior</div>
            </div>
        </div>

        <!-- Card 3: Recent Volume -->
        <div
            class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-600 transition-colors"
        >
            <div
                class="absolute left-0 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10 group-hover:bg-blue-500/20 transition-all"
            ></div>

            <div class="relative z-10">
                <div class="flex items-center gap-2 mb-2">
                    <div class="p-2 bg-slate-700/50 rounded-lg">
                        <FileText class="w-5 h-5 text-blue-400" />
                    </div>
                    <span class="text-slate-400 text-sm font-medium"
                        >Transacciones</span
                    >
                </div>
                <div class="text-3xl font-bold text-white tracking-tight">
                    {groupedPayments[currentMonthKey]?.length || 0}
                </div>
                <div class="text-xs text-slate-500 mt-2">
                    Registrados este mes
                </div>
            </div>
        </div>
    </div>

    <!-- Add Payment Form -->
    <Modal bind:isOpen={showForm} title="Registrar Nuevo Pago" size="lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Student Selector -->
            <div class="space-y-2">
                <label
                    for="payment-student"
                    class="text-sm font-semibold text-slate-400 ml-1"
                    >Alumno <span class="text-red-400">*</span></label
                >
                <select
                    id="payment-student"
                    bind:value={newPayment.studentId}
                    class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all {formErrors.studentId
                        ? 'border-red-500 focus:ring-red-500'
                        : ''}"
                >
                    <option value="" disabled>Selecciona un alumno</option>
                    {#each store.students as student}
                        <option value={student.id}>{student.name}</option>
                    {/each}
                </select>
                {#if formErrors.studentId}
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
                        {formErrors.studentId}
                    </p>
                {/if}
            </div>

            <!-- Amount & Date -->
            <div class="space-y-2">
                <span class="block text-sm font-semibold text-slate-400 ml-1"
                    >Importe y Fecha <span class="text-red-400">*</span></span
                >
                <div class="flex gap-2">
                    <div class="relative flex-1">
                        <span class="absolute left-4 top-3 text-slate-500"
                            >€</span
                        >
                        <input
                            type="number"
                            aria-label="Importe"
                            bind:value={newPayment.amount}
                            class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none {formErrors.amount
                                ? 'border-red-500 focus:ring-red-500'
                                : ''}"
                            placeholder="0.00"
                        />
                    </div>
                    <input
                        type="date"
                        aria-label="Fecha"
                        bind:value={newPayment.date}
                        class="w-40 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                </div>
                {#if formErrors.amount}
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
                        {formErrors.amount}
                    </p>
                {/if}
            </div>

            <!-- Method & Concept -->
            <div class="space-y-2">
                <span class="block text-sm font-semibold text-slate-400 ml-1"
                    >Detalles <span class="text-red-400">*</span></span
                >
                <div class="flex gap-2">
                    <select
                        aria-label="Método de Pago"
                        bind:value={newPayment.method}
                        class="w-36 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    >
                        <option value="cash">Efectivo</option>
                        <option value="transfer">Transf.</option>
                        <option value="bizum">Bizum</option>
                    </select>
                    <input
                        type="text"
                        aria-label="Concepto"
                        bind:value={newPayment.concept}
                        placeholder="Concepto (ej: Abril)"
                        class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 outline-none {formErrors.concept
                            ? 'border-red-500 focus:ring-red-500'
                            : ''}"
                    />
                </div>
                {#if formErrors.concept}
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
                        {formErrors.concept}
                    </p>
                {/if}
            </div>
        </div>

        <div class="mt-8 flex justify-end">
            <button
                onclick={handleSubmit}
                class="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
            >
                Confirmar Ingreso
            </button>
        </div>
    </Modal>

    <!-- Transaction History (Timeline Style) -->
    <div class="space-y-8">
        {#each sortedMonths as monthKey}
            <div in:fade={{ duration: 300 }}>
                <!-- Month Header -->
                <div class="flex items-center gap-4 mb-4">
                    <h3 class="text-lg font-bold text-white capitalize">
                        {formatMonth(monthKey)}
                    </h3>
                    <div class="h-[1px] flex-1 bg-slate-800"></div>
                </div>

                <!-- Transaction List for Month -->
                <div class="space-y-3">
                    {#each groupedPayments[monthKey] as payment (payment.id)}
                        <div
                            class="group bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-4 flex items-center justify-between transition-all duration-200"
                        >
                            <!-- Left: Icon & Info -->
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors"
                                >
                                    <svelte:component
                                        this={methodIcons[payment.method]}
                                        class="w-5 h-5"
                                    />
                                </div>
                                <div>
                                    <div
                                        class="font-bold text-slate-200 group-hover:text-white"
                                    >
                                        {getStudentName(payment.studentId)}
                                    </div>
                                    <div
                                        class="text-xs text-slate-500 flex items-center gap-2"
                                    >
                                        <span
                                            >{new Date(
                                                payment.date,
                                            ).toLocaleDateString()}</span
                                        >
                                        <span
                                            class="w-1 h-1 rounded-full bg-slate-600"
                                        ></span>
                                        <span class="capitalize"
                                            >{payment.concept}</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Amount & Actions -->
                            <div class="flex items-center gap-6">
                                <div class="text-right">
                                    <div
                                        class="font-bold text-emerald-400 text-lg"
                                    >
                                        +{payment.amount}€
                                    </div>
                                    <div
                                        class="text-[10px] text-slate-500 uppercase font-bold tracking-wider"
                                    >
                                        {methodLabels[payment.method]}
                                    </div>
                                </div>

                                <!-- Hover Actions -->
                                <div
                                    class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0"
                                >
                                    <button
                                        onclick={() =>
                                            exportReceiptPDF(
                                                payment,
                                                getStudentName(
                                                    payment.studentId,
                                                ),
                                            )}
                                        class="p-2 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white transition-colors"
                                        title="Descargar Recibo"
                                    >
                                        <FileText class="w-4 h-4" />
                                    </button>
                                    <button
                                        onclick={() =>
                                            handleDeleteClick(payment.id)}
                                        class="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}

        {#if sortedMonths.length === 0}
            <div class="text-center py-20 text-slate-500">
                <div
                    class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                    <Search class="w-8 h-8 opacity-50" />
                </div>
                <p>No se encontraron transacciones.</p>
            </div>
        {/if}
    </div>
</div>

<ConfirmationModal
    bind:isOpen={showConfirmModal}
    title={confirmTitle}
    message={confirmMessage}
    confirmText="Eliminar"
    type={confirmType}
    on:confirm={confirmAction}
/>
