<script lang="ts">
    import {
        appStore,
        storeActions,
        type AttendanceRecord,
    } from "$lib/services/storage";
    import {
        exportAttendancePDF,
        exportAttendanceCSV,
    } from "$lib/services/export";
    import {
        ClipboardCheck,
        Calendar,
        Users,
        CheckCircle,
        XCircle,
        AlertCircle,
        Save,
        FileText,
        Download,
        FileSpreadsheet,
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
    let sessionNotes = "";

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
            sessionNotes = existingRecord.sessionNotes || "";
        } else {
            // Default to 'present' for new records
            attendanceStatus = {};
            studentsInClass.forEach((s) => {
                attendanceStatus[s.id] = "present"; // Default value
            });
            sessionNotes = "";
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

    // Statistics and History
    $: classHistory = selectedClassId
        ? store.attendance
              .filter((r) => r.classId === selectedClassId)
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 10)
        : [];

    $: studentStats =
        selectedClassId && studentsInClass.length > 0
            ? studentsInClass
                  .map((student) => {
                      const studentRecords = store.attendance
                          .filter((r) => r.classId === selectedClassId)
                          .flatMap((r) =>
                              r.records.filter(
                                  (rec) => rec.studentId === student.id,
                              ),
                          );

                      const total = studentRecords.length;
                      const present = studentRecords.filter(
                          (r) => r.status === "present",
                      ).length;
                      const absent = studentRecords.filter(
                          (r) => r.status === "absent",
                      ).length;
                      const excused = studentRecords.filter(
                          (r) => r.status === "excused",
                      ).length;
                      const rate =
                          total > 0 ? Math.round((present / total) * 100) : 100;

                      return {
                          student,
                          total,
                          present,
                          absent,
                          excused,
                          rate,
                          isLowAttendance: rate < 70 && total >= 3,
                      };
                  })
                  .sort((a, b) => a.rate - b.rate)
            : [];

    // Weekly trend (last 7 days)
    $: weeklyTrend = selectedClassId
        ? (() => {
              const last7Days = [];
              const today = new Date();
              for (let i = 6; i >= 0; i--) {
                  const date = new Date(today);
                  date.setDate(date.getDate() - i);
                  const dateStr = date.toISOString().split("T")[0];

                  const record = store.attendance.find(
                      (r) =>
                          r.classId === selectedClassId && r.date === dateStr,
                  );

                  if (record) {
                      const total = record.records.length;
                      const present = record.records.filter(
                          (r) => r.status === "present",
                      ).length;
                      const rate =
                          total > 0 ? Math.round((present / total) * 100) : 0;
                      last7Days.push({ date: dateStr, rate, hasData: true });
                  } else {
                      last7Days.push({
                          date: dateStr,
                          rate: 0,
                          hasData: false,
                      });
                  }
              }
              return last7Days;
          })()
        : [];

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
            sessionNotes: sessionNotes.trim() || undefined,
        };

        storeActions.saveAttendance(record);

        saveMessage = "Asistencia guardada correctamente";
        hasUnsavedChanges = false;
        initialAttendanceState = { ...attendanceStatus };
        setTimeout(() => (saveMessage = ""), 3000);
    }

    // Export functions
    function handleExportPDF() {
        if (!selectedClass || classHistory.length === 0) {
            alert("No hay datos de asistencia para exportar");
            return;
        }

        exportAttendancePDF(
            selectedClass.name,
            classHistory,
            (id) =>
                store.students.find((s) => s.id === id)?.name || "Desconocido",
        );
    }

    function handleExportCSV() {
        if (!selectedClass || classHistory.length === 0) {
            alert("No hay datos de asistencia para exportar");
            return;
        }

        exportAttendanceCSV(selectedClass.name, classHistory, studentsInClass);
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

                <!-- Session Notes -->
                <div class="p-4 bg-slate-900/30 border-t border-slate-700">
                    <label
                        for="session-notes"
                        class="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2"
                    >
                        <FileText class="w-4 h-4" />
                        Observaciones de la Sesión (Opcional)
                    </label>
                    <textarea
                        id="session-notes"
                        bind:value={sessionNotes}
                        oninput={() => checkForChanges()}
                        placeholder="Ej: Clase muy participativa, repasamos aperturas..."
                        rows="2"
                        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-pink-500 resize-none"
                    ></textarea>
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

    <!-- Statistics and Analysis Section -->
    {#if selectedClassId && classHistory.length > 0}
        <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Student Statistics Panel -->
            <div
                class="lg:col-span-2 bg-[#1e293b] border border-slate-700 rounded-2xl p-6"
            >
                <h3
                    class="text-lg font-bold text-white mb-4 flex items-center gap-2"
                >
                    <Users class="w-5 h-5 text-pink-500" />
                    Estadísticas por Alumno
                </h3>

                {#if studentStats.length === 0}
                    <p class="text-slate-500 text-sm text-center py-8">
                        No hay datos de asistencia registrados aún.
                    </p>
                {:else}
                    <div
                        class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar"
                    >
                        {#each studentStats as stat}
                            <div
                                class="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
                            >
                                <div
                                    class="flex items-center justify-between mb-2"
                                >
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-sm"
                                        >
                                            {stat.student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p class="text-white font-medium">
                                                {stat.student.name}
                                            </p>
                                            <p class="text-xs text-slate-500">
                                                {stat.total} sesiones registradas
                                            </p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div
                                            class="text-2xl font-bold {stat.isLowAttendance
                                                ? 'text-red-400'
                                                : stat.rate >= 90
                                                  ? 'text-emerald-400'
                                                  : 'text-slate-300'}"
                                        >
                                            {stat.rate}%
                                        </div>
                                        {#if stat.isLowAttendance}
                                            <span
                                                class="text-xs text-red-400 font-medium"
                                                >⚠ Baja asistencia</span
                                            >
                                        {/if}
                                    </div>
                                </div>

                                <!-- Progress Bar -->
                                <div
                                    class="w-full bg-slate-800 rounded-full h-2 overflow-hidden"
                                >
                                    <div
                                        class="h-2 rounded-full transition-all duration-500 {stat.isLowAttendance
                                            ? 'bg-red-500'
                                            : stat.rate >= 90
                                              ? 'bg-emerald-500'
                                              : 'bg-blue-500'}"
                                        style="width: {stat.rate}%"
                                    ></div>
                                </div>

                                <!-- Detailed Stats -->
                                <div class="flex gap-4 mt-3 text-xs">
                                    <span class="text-emerald-400"
                                        >✓ {stat.present} presentes</span
                                    >
                                    <span class="text-red-400"
                                        >✗ {stat.absent} ausentes</span
                                    >
                                    {#if stat.excused > 0}
                                        <span class="text-yellow-400"
                                            >⚠ {stat.excused} justif.</span
                                        >
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Weekly Trend Chart -->
            <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
                <h3
                    class="text-lg font-bold text-white mb-4 flex items-center gap-2"
                >
                    <Calendar class="w-5 h-5 text-blue-500" />
                    Tendencia Semanal
                </h3>

                <div
                    class="h-56 flex items-end justify-between gap-2 mb-4 px-2"
                >
                    {#each weeklyTrend as day}
                        {@const displayHeight = day.hasData
                            ? Math.max(day.rate, 8)
                            : 4}
                        <div
                            class="flex-1 flex flex-col items-center group relative"
                        >
                            <!-- Bar -->
                            <div
                                class="w-full rounded-t-lg transition-all duration-300 relative {day.hasData
                                    ? 'bg-gradient-to-t from-pink-500/40 to-pink-500/20 border-t-4 border-pink-500 hover:from-pink-500/60 hover:to-pink-500/30 cursor-pointer'
                                    : 'bg-slate-800/30 border-t-2 border-slate-700'}"
                                style="height: {displayHeight}%"
                            >
                                <!-- Tooltip -->
                                {#if day.hasData}
                                    <div
                                        class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none"
                                    >
                                        <div class="font-bold text-pink-400">
                                            {day.rate}%
                                        </div>
                                        <div class="text-[10px] text-slate-400">
                                            asistencia
                                        </div>
                                    </div>
                                {/if}

                                <!-- Value label inside bar for high values -->
                                {#if day.hasData && day.rate >= 30}
                                    <div
                                        class="absolute top-2 left-1/2 -translate-x-1/2 text-white text-xs font-bold"
                                    >
                                        {day.rate}%
                                    </div>
                                {/if}
                            </div>

                            <!-- Day label -->
                            <p
                                class="text-[10px] text-slate-400 mt-2 font-medium uppercase"
                            >
                                {new Date(day.date).toLocaleDateString(
                                    "es-ES",
                                    { weekday: "short" },
                                )}
                            </p>

                            <!-- Date -->
                            <p class="text-[9px] text-slate-600">
                                {new Date(day.date).getDate()}
                            </p>
                        </div>
                    {/each}
                </div>

                <div
                    class="text-xs text-slate-500 text-center pt-2 border-t border-slate-700"
                >
                    Últimos 7 días • Pasa el ratón para ver detalles
                </div>
            </div>
        </div>

        <!-- Session History -->
        <div
            class="mt-6 bg-[#1e293b] border border-slate-700 rounded-2xl overflow-hidden"
        >
            <div
                class="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center flex-wrap gap-3"
            >
                <div class="flex items-center gap-3">
                    <h3 class="font-bold text-white flex items-center gap-2">
                        <ClipboardCheck class="w-5 h-5 text-cyan-500" />
                        Historial de Sesiones
                    </h3>
                    <span class="text-xs text-slate-500"
                        >Últimas 10 sesiones</span
                    >
                </div>

                <!-- Export Buttons -->
                <div class="flex gap-2">
                    <button
                        onclick={handleExportPDF}
                        class="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-xs font-medium transition-colors"
                    >
                        <Download class="w-4 h-4" />
                        <span class="hidden sm:inline">Exportar PDF</span>
                    </button>
                    <button
                        onclick={handleExportCSV}
                        class="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-lg text-xs font-medium transition-colors"
                    >
                        <FileSpreadsheet class="w-4 h-4" />
                        <span class="hidden sm:inline">Exportar CSV</span>
                    </button>
                </div>
            </div>

            <div class="divide-y divide-slate-700">
                {#each classHistory as record}
                    {@const total = record.records.length}
                    {@const present = record.records.filter(
                        (r) => r.status === "present",
                    ).length}
                    {@const absent = record.records.filter(
                        (r) => r.status === "absent",
                    ).length}
                    {@const excused = record.records.filter(
                        (r) => r.status === "excused",
                    ).length}
                    {@const rate =
                        total > 0 ? Math.round((present / total) * 100) : 0}

                    <div class="p-4 hover:bg-slate-800/30 transition-colors">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-white">
                                        {new Date(record.date).getDate()}
                                    </div>
                                    <div
                                        class="text-xs text-slate-500 uppercase"
                                    >
                                        {new Date(
                                            record.date,
                                        ).toLocaleDateString("es-ES", {
                                            month: "short",
                                        })}
                                    </div>
                                </div>

                                <div class="flex-1">
                                    <div class="text-sm text-slate-300 mb-1">
                                        {new Date(
                                            record.date,
                                        ).toLocaleDateString("es-ES", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <div class="flex gap-3 text-xs">
                                        <span class="text-emerald-400"
                                            >✓ {present}</span
                                        >
                                        <span class="text-red-400"
                                            >✗ {absent}</span
                                        >
                                        {#if excused > 0}
                                            <span class="text-yellow-400"
                                                >⚠ {excused}</span
                                            >
                                        {/if}
                                    </div>
                                </div>
                            </div>

                            <div class="text-right">
                                <div
                                    class="text-xl font-bold {rate >= 90
                                        ? 'text-emerald-400'
                                        : rate >= 70
                                          ? 'text-blue-400'
                                          : 'text-red-400'}"
                                >
                                    {rate}%
                                </div>
                                <div class="text-xs text-slate-500">
                                    {total} alumnos
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
