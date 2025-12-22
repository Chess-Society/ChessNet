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

    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    let selectedClassId = "";
    let selectedDate = new Date().toISOString().split("T")[0];
    let attendanceStatus: Record<string, "present" | "absent" | "excused"> = {};
    let saveMessage = "";

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
    }

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
    <div
        class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
        <div>
            <label
                for="class-select"
                class="block text-sm font-medium text-slate-400 mb-2"
            >
                Seleccionar Grupo
            </label>
            <div class="relative">
                <Users class="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
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
            <div class="relative">
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
        </div>

        <div class="flex items-end">
            {#if selectedClassId}
                <div class="text-slate-400 text-sm pb-3">
                    <span class="font-bold text-white"
                        >{studentsInClass.length}</span
                    > alumnos en lista
                </div>
            {/if}
        </div>
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
                    <span class="text-emerald-400 font-medium"
                        >{saveMessage}</span
                    >
                    <button
                        onclick={saveAttendance}
                        class="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-pink-500/20 active:scale-95 cursor-pointer"
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
