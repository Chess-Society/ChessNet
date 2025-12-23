<script lang="ts">
    import {
        appStore,
        storeActions,
        type AttendanceRecord,
    } from "$lib/services/storage";
    import {
        ClipboardCheck,
        Calendar,
        Users,
        CheckCircle,
        XCircle,
        AlertCircle,
        Save,
    } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import { base } from "$app/paths";

    import { page } from "$app/stores";
    import { onMount } from "svelte";

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let selectedClassId = "";
    let selectedDate = new Date().toISOString().split("T")[0];
    let attendanceStatus: Record<string, "present" | "absent" | "excused"> = {};
    let saveMessage = "";
    let hasUnsavedChanges = false;
    let initialAttendanceState: Record<
        string,
        "present" | "absent" | "excused"
    > = {};

    onMount(() => {
        const classIdParam = $page.url.searchParams.get("classId");
        if (classIdParam) {
            selectedClassId = classIdParam;
        }
    });

    // Derived values
    $: selectedClass = store.classes.find((c) => c.id === selectedClassId);
    $: studentsInClass = selectedClass
        ? store.students.filter((s) => selectedClass?.students.includes(s.id))
        : [];

    // Load existing record when class or date changes
    $: if (selectedClassId && selectedDate) {
        loadAttendance();
    }

    function loadAttendance() {
        const existingRecord = store.attendance.find(
            (r) => r.classId === selectedClassId && r.date === selectedDate,
        );

        if (existingRecord) {
            attendanceStatus = {};
            existingRecord.records.forEach((r) => {
                attendanceStatus[r.studentId] = r.status;
            });
        } else {
            // Default to 'present' for new records
            attendanceStatus = {};
            studentsInClass.forEach((s) => {
                attendanceStatus[s.id] = "present"; // Default value
            });
        }

        // Save initial state and reset unsaved changes flag
        initialAttendanceState = { ...attendanceStatus };
        hasUnsavedChanges = false;
    }

    // React to students list changes to ensure defaults are set even if no record exists yet
    $: if (
        studentsInClass.length > 0 &&
        Object.keys(attendanceStatus).length === 0
    ) {
        studentsInClass.forEach((s) => {
            if (!attendanceStatus[s.id]) attendanceStatus[s.id] = "present";
        });
    }

    function setStatus(
        studentId: string,
        status: "present" | "absent" | "excused",
    ) {
        attendanceStatus[studentId] = status;
        checkForChanges();
    }

    function checkForChanges() {
        hasUnsavedChanges =
            JSON.stringify(attendanceStatus) !==
            JSON.stringify(initialAttendanceState);
    }

    // Quick Actions
    function markAllPresent() {
        studentsInClass.forEach((s) => {
            attendanceStatus[s.id] = "present";
        });
        checkForChanges();
    }

    function markAllAbsent() {
        if (confirm("¿Estás seguro de marcar a todos como ausentes?")) {
            studentsInClass.forEach((s) => {
                attendanceStatus[s.id] = "absent";
            });
            checkForChanges();
        }
    }

    // Date Navigation
    function goToPreviousDay() {
        if (
            hasUnsavedChanges &&
            !confirm("Tienes cambios sin guardar. ¿Continuar sin guardar?")
        ) {
            return;
        }
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        selectedDate = currentDate.toISOString().split("T")[0];
    }

    function goToNextDay() {
        if (
            hasUnsavedChanges &&
            !confirm("Tienes cambios sin guardar. ¿Continuar sin guardar?")
        ) {
            return;
        }
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + 1);
        selectedDate = currentDate.toISOString().split("T")[0];
    }

    // Computed stats
    $: presentCount = Object.values(attendanceStatus).filter(
        (s) => s === "present",
    ).length;
    $: absentCount = Object.values(attendanceStatus).filter(
        (s) => s === "absent",
    ).length;
    $: excusedCount = Object.values(attendanceStatus).filter(
        (s) => s === "excused",
    ).length;

    function saveAttendance() {
        if (!selectedClassId) return;

        const record: AttendanceRecord = {
            id: crypto.randomUUID(), // Or reuse existing ID if we want to be strict, but overwriting works too
            classId: selectedClassId,
            date: selectedDate,
            records: Object.entries(attendanceStatus).map(
                ([studentId, status]) => ({
                    studentId,
                    status,
                }),
            ),
        };

        storeActions.saveAttendance(record);

        saveMessage = "Asistencia guardada correctamente";
        hasUnsavedChanges = false;
        initialAttendanceState = { ...attendanceStatus };
        setTimeout(() => (saveMessage = ""), 3000);
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-white flex items-center gap-3">
            <ClipboardCheck class="w-8 h-8 text-pink-500" /> Control de Asistencia
        </h1>
        <p class="mt-2 text-slate-400">
            Registra la asistencia diaria de tus grupos.
        </p>
    </div>

    <!-- Controls -->
    <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
                <label
                    for="class-select"
                    class="block text-sm font-medium text-slate-400 mb-2"
                >
                    Seleccionar Grupo
                </label>
                <div class="relative">
                    <Users
                        class="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
                    />
                    <select
                        id="class-select"
                        bind:value={selectedClassId}
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-pink-500 appearance-none"
                    >
                        <option value="">-- Elegir Clase --</option>
                        {#each store.classes as cls}
                            <option value={cls.id}>{cls.name}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div>
                <label
                    for="date-select"
                    class="block text-sm font-medium text-slate-400 mb-2"
                >
                    Fecha
                </label>
                <div class="flex gap-2">
                    <button
                        onclick={goToPreviousDay}
                        class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors"
                        title="Día anterior"
                    >
                        ←
                    </button>
                    <div class="relative flex-1">
                        <Calendar
                            class="absolute left-3 top-2.5 w-4 h-4 text-slate-500"
                        />
                        <input
                            id="date-select"
                            type="date"
                            bind:value={selectedDate}
                            class="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-pink-500"
                        />
                    </div>
                    <button
                        onclick={goToNextDay}
                        class="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors"
                        title="Día siguiente"
                    >
                        →
                    </button>
                </div>
            </div>

            <div class="flex items-end">
                {#if selectedClassId}
                    <div class="w-full">
                        <div class="text-slate-400 text-sm mb-2">
                            <span class="font-bold text-white"
                                >{studentsInClass.length}</span
                            > alumnos en lista
                        </div>
                        <div class="flex gap-2 text-xs">
                            <span
                                class="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20"
                            >
                                ✓ {presentCount} Presentes
                            </span>
                            <span
                                class="bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20"
                            >
                                ✗ {absentCount} Ausentes
                            </span>
                            {#if excusedCount > 0}
                                <span
                                    class="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20"
                                >
                                    ⚠ {excusedCount} Justif.
                                </span>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Quick Actions -->
        {#if selectedClassId && studentsInClass.length > 0}
            <div class="flex gap-2 pt-4 border-t border-slate-700">
                <button
                    onclick={markAllPresent}
                    class="flex-1 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <CheckCircle class="w-4 h-4" />
                    Marcar Todos Presentes
                </button>
                <button
                    onclick={markAllAbsent}
                    class="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <XCircle class="w-4 h-4" />
                    Marcar Todos Ausentes
                </button>
            </div>
        {/if}
    </div>

    <!-- List -->
    {#if selectedClassId}
        <div
            class="bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
            transition:slide
        >
            {#if studentsInClass.length === 0}
                <div class="p-12 text-center text-slate-500">
                    <p>Este grupo no tiene alumnos asignados todavía.</p>
                    <a
                        href="{base}/dashboard/classes"
                        class="text-pink-400 hover:underline mt-2 inline-block"
                        >Gestionar Clases</a
                    >
                </div>
            {:else}
                <div class="divide-y divide-slate-700">
                    {#each studentsInClass as student}
                        <div
                            class="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold"
                                >
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p class="text-white font-medium">
                                        {student.name}
                                    </p>
                                    <p class="text-xs text-slate-500">
                                        {student.level}
                                    </p>
                                </div>
                            </div>

                            <div class="flex bg-slate-900 rounded-lg p-1 gap-1">
                                <button
                                    onclick={() =>
                                        setStatus(student.id, "present")}
                                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 cursor-pointer {attendanceStatus[
                                        student.id
                                    ] === 'present'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
                                >
                                    <CheckCircle class="w-4 h-4" />
                                    <span class="hidden sm:inline"
                                        >Presente</span
                                    >
                                </button>
                                <button
                                    onclick={() =>
                                        setStatus(student.id, "excused")}
                                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 cursor-pointer {attendanceStatus[
                                        student.id
                                    ] === 'excused'
                                        ? 'bg-yellow-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
                                >
                                    <AlertCircle class="w-4 h-4" />
                                    <span class="hidden sm:inline"
                                        >Justificado</span
                                    >
                                </button>
                                <button
                                    onclick={() =>
                                        setStatus(student.id, "absent")}
                                    class="px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 cursor-pointer {attendanceStatus[
                                        student.id
                                    ] === 'absent'
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
                                >
                                    <XCircle class="w-4 h-4" />
                                    <span class="hidden sm:inline">Ausente</span
                                    >
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>

                <div
                    class="p-6 bg-slate-900/50 border-t border-slate-700 flex justify-between items-center"
                >
                    <div class="flex items-center gap-3">
                        {#if saveMessage}
                            <span class="text-emerald-400 font-medium"
                                >{saveMessage}</span
                            >
                        {:else if hasUnsavedChanges}
                            <span
                                class="text-amber-400 font-medium flex items-center gap-2"
                            >
                                <span
                                    class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"
                                ></span>
                                Cambios sin guardar
                            </span>
                        {:else}
                            <span class="text-slate-500 font-medium">
                                Todo guardado
                            </span>
                        {/if}
                    </div>
                    <button
                        onclick={saveAttendance}
                        disabled={!hasUnsavedChanges}
                        class="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-pink-500/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-600"
                    >
                        <Save class="w-5 h-5" />
                        Guardar Asistencia
                    </button>
                </div>
            {/if}
        </div>
    {:else}
        <div
            class="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500"
        >
            <Users class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p class="text-lg">
                Selecciona un grupo arriba para empezar a pasar lista.
            </p>
        </div>
    {/if}
</div>
