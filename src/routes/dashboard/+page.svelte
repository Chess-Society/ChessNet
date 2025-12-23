<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { appStore } from "$lib/services/storage";
    import {
        School,
        Users,
        UserPlus,
        BookOpen,
        Trophy,
        Target,
        ClipboardCheck,
        BarChart3,
        CreditCard,
        ChevronRight,
        Activity,
        TrendingUp,
        TrendingDown,
        Calendar,
        Clock,
        AlertTriangle,
        Bell,
        ArrowUpRight,
        ArrowDownRight,
        CheckCircle,
        Layout,
    } from "lucide-svelte";
    import { notifications } from "$lib/stores/notifications";
    import CalendarWidget from "$lib/components/dashboard/CalendarWidget.svelte";
    import { flip } from "svelte/animate";
    import { storeActions } from "$lib/services/storage";
    import { Settings2, GripVertical } from "lucide-svelte";

    // Suscribirse a los datos reales
    let store = $appStore;
    appStore.subscribe((value) => (store = value));

    const actions = [
        {
            id: "centers",
            title: "Centros Educativos",
            desc: "Gestionar centros y ubicaciones",
            icon: School,
            color: "text-blue-500",
            hover: "hover:border-blue-500/50",
            link: "centers",
        },
        {
            id: "classes",
            title: "Clases",
            desc: "Organizar grupos y horarios",
            icon: BookOpen,
            color: "text-purple-500",
            hover: "hover:border-purple-500/50",
            link: "classes",
        },
        {
            id: "students",
            title: "Estudiantes",
            desc: "Gestionar alumnado e inscripciones",
            icon: Users,
            color: "text-emerald-500",
            hover: "hover:border-emerald-500/50",
            link: "students",
        },
        {
            id: "skills",
            title: "Habilidades",
            desc: "Definir temarios y competencias",
            icon: Target,
            color: "text-yellow-500",
            hover: "hover:border-yellow-500/50",
            link: "skills",
        },
        {
            id: "tournaments",
            title: "Gestionar Torneos",
            desc: "Organizar competiciones locales",
            icon: Trophy,
            color: "text-orange-500",
            hover: "hover:border-orange-500/50",
            link: "tournaments",
        },
        {
            id: "attendance",
            title: "Control de Asistencia",
            desc: "Pasar lista y estadísticas",
            icon: ClipboardCheck,
            color: "text-pink-500",
            hover: "hover:border-pink-500/50",
            link: "attendance",
        },
        {
            id: "reports",
            title: "Informes",
            desc: "Reportes y análisis avanzados",
            icon: BarChart3,
            color: "text-cyan-500",
            hover: "hover:border-cyan-500/50",
            link: "reports",
        },
        {
            id: "payments",
            title: "Sistema de Pagos",
            desc: "Gestionar cobros y facturación",
            icon: CreditCard,
            color: "text-teal-500",
            hover: "hover:border-teal-500/50",
            link: "payments",
            badge: "BETA",
        },
        {
            id: "planner",
            title: "Planificador",
            desc: "Diseñar sesiones y contenido",
            icon: Layout,
            color: "text-indigo-500",
            hover: "hover:border-indigo-500/50",
            link: "planner",
            badge: "NEW",
        },
        {
            id: "leads",
            title: "CRM / Interesados",
            desc: "Gestionar posibles alumnos",
            icon: UserPlus,
            color: "text-pink-500",
            hover: "hover:border-pink-500/50",
            link: "leads",
            badge: "NEW",
        },
        {
            id: "achievements",
            title: "Logros",
            desc: "Ver progreso y medallas",
            icon: Trophy,
            color: "text-amber-500",
            hover: "hover:border-amber-500/50",
            link: "achievements",
        },
    ];

    // Reorder Display Logic
    $: displayedActions = (() => {
        const layout = store.dashboardLayout || [];
        if (layout.length === 0) return actions;

        // Map ID to action
        const map = new Map(actions.map((a) => [a.id, a]));
        const reordered = [];

        // Add from layout if exists
        for (const id of layout) {
            const act = map.get(id);
            if (act) {
                reordered.push(act);
                map.delete(id);
            }
        }
        // Add remaining
        for (const act of map.values()) {
            reordered.push(act);
        }
        return reordered;
    })();

    let isEditingLayout = false;
    let draggedItem: any = null;
    let draggedOverItem: any = null;
    let localOrder: any[] = [];

    // Initialize local order from displayed actions
    $: if (!isEditingLayout) {
        localOrder = [...displayedActions];
    }

    // Use local order when editing for instant feedback
    $: finalActions = isEditingLayout ? localOrder : displayedActions;

    function handleDragStart(event: DragEvent, item: any) {
        draggedItem = item;
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
        }
        // Add visual feedback
        const target = event.currentTarget as HTMLElement;
        target.style.opacity = "0.4";
    }

    function handleDragOver(event: DragEvent, targetItem: any) {
        event.preventDefault();
        if (!draggedItem || draggedItem === targetItem) return;

        draggedOverItem = targetItem;

        const srcIndex = localOrder.findIndex((i) => i.id === draggedItem.id);
        const dstIndex = localOrder.findIndex((i) => i.id === targetItem.id);

        if (srcIndex !== -1 && dstIndex !== -1 && srcIndex !== dstIndex) {
            // Create new array with swapped items for instant visual feedback
            const newOrder = [...localOrder];
            const [removed] = newOrder.splice(srcIndex, 1);
            newOrder.splice(dstIndex, 0, removed);
            localOrder = newOrder;
        }
    }

    function handleDragEnd(event: DragEvent) {
        // Reset visual feedback
        const target = event.currentTarget as HTMLElement;
        target.style.opacity = "1";

        draggedItem = null;
        draggedOverItem = null;
    }

    // Touch support variables for mobile
    let touchStartY = 0;
    let touchStartX = 0;
    let isDragging = false;

    // Touch event handlers for mobile
    function handleTouchStart(event: TouchEvent, item: any) {
        if (!isEditingLayout) return;

        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        draggedItem = item;
        isDragging = true;

        const target = event.currentTarget as HTMLElement;
        target.style.opacity = "0.6";
        target.style.transform = "scale(1.05)";
    }

    function handleTouchMove(event: TouchEvent) {
        if (!isDragging || !draggedItem) return;

        event.preventDefault();
        const touch = event.touches[0];

        // Find element under touch point
        const elementAtPoint = document.elementFromPoint(
            touch.clientX,
            touch.clientY,
        );
        if (!elementAtPoint) return;

        // Find the closest action card
        const cardElement = elementAtPoint.closest("[data-action-id]");
        if (!cardElement) return;

        const targetId = cardElement.getAttribute("data-action-id");
        const targetItem = localOrder.find((a) => a.id === targetId);

        if (targetItem && targetItem !== draggedItem) {
            const srcIndex = localOrder.findIndex(
                (i) => i.id === draggedItem.id,
            );
            const dstIndex = localOrder.findIndex(
                (i) => i.id === targetItem.id,
            );

            if (srcIndex !== -1 && dstIndex !== -1 && srcIndex !== dstIndex) {
                const newOrder = [...localOrder];
                const [removed] = newOrder.splice(srcIndex, 1);
                newOrder.splice(dstIndex, 0, removed);
                localOrder = newOrder;
            }
        }
    }

    function handleTouchEnd(event: TouchEvent) {
        if (!isDragging) return;

        const target = event.currentTarget as HTMLElement;
        target.style.opacity = "1";
        target.style.transform = "scale(1)";

        isDragging = false;
        draggedItem = null;
        draggedOverItem = null;
    }

    function toggleEditMode() {
        if (isEditingLayout) {
            // Save the order when exiting edit mode
            storeActions.updateDashboardLayout(localOrder.map((a) => a.id));
            notifications.success("Diseño del dashboard guardado.");
        }
        isEditingLayout = !isEditingLayout;
    }

    function navigate(path: string) {
        if (path === "payments" && store.settings.plan === "free") {
            notifications.warning(
                `El Sistema de Pagos solo está disponible en los planes Profe y Club.`,
            );
            return;
        }
        goto(`${base}/dashboard/${path}`);
    }

    const today = new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    // Helper functions
    function getTimeAgo(dateStr: string): string {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `hace ${diffMins} min`;
        if (diffHours < 24) return `hace ${diffHours}h`;
        if (diffDays === 1) return "ayer";
        if (diffDays < 7) return `hace ${diffDays} días`;
        return date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
        });
    }

    function daysSince(dateStr: string): number {
        const date = new Date(dateStr);
        const now = new Date();
        return Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );
    }

    function daysTill(dateStr: string): number {
        const date = new Date(dateStr);
        const now = new Date();
        return Math.floor(
            (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
    }

    // Derived Stats

    $: totalStudents = store.students.length;
    $: totalRevenue = store.payments.reduce((sum, p) => sum + p.amount, 0);

    // Tendencias (comparar con datos antiguos - simplificado)
    $: recentStudents = store.students.filter((s) => {
        // Asumimos que los últimos añadidos son recientes
        const index = store.students.indexOf(s);
        return (
            index >=
            store.students.length - Math.ceil(store.students.length * 0.2)
        );
    }).length;

    $: recentPayments = store.payments.filter((p) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(p.date) >= thirtyDaysAgo;
    });

    $: revenueThisMonth = recentPayments.reduce((sum, p) => sum + p.amount, 0);

    // Tasa de asistencia promedio
    $: averageAttendance = (() => {
        if (store.attendance.length === 0) return 0;
        const rates = store.attendance.map((record) => {
            const total = record.records.length;
            const present = record.records.filter(
                (r) => r.status === "present",
            ).length;
            return total > 0 ? (present / total) * 100 : 0;
        });
        return Math.round(rates.reduce((sum, r) => sum + r, 0) / rates.length);
    })();

    // Actividad reciente
    $: recentActivity = (() => {
        const activities: any[] = [];

        // Últimos estudiantes
        store.students
            .slice(-3)
            .reverse()
            .forEach((s) => {
                activities.push({
                    type: "student",
                    description: `Nuevo estudiante: ${s.name}`,
                    timeAgo: "reciente",
                    icon: Users,
                    color: "emerald",
                    timestamp: Date.now(),
                });
            });

        // Últimos pagos
        store.payments
            .slice(-3)
            .reverse()
            .forEach((p) => {
                const student = store.students.find(
                    (s) => s.id === p.studentId,
                );
                activities.push({
                    type: "payment",
                    description: `Pago: ${p.amount}€ - ${student?.name || "Desconocido"}`,
                    timeAgo: getTimeAgo(p.date),
                    icon: CreditCard,
                    color: "teal",
                    timestamp: new Date(p.date).getTime(),
                });
            });

        // Últimos torneos
        store.tournaments
            .slice(-2)
            .reverse()
            .forEach((t) => {
                activities.push({
                    type: "tournament",
                    description: `Torneo: ${t.name}`,
                    timeAgo: getTimeAgo(t.date),
                    icon: Trophy,
                    color: "orange",
                    timestamp: new Date(t.date).getTime(),
                });
            });

        return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
    })();

    // Alertas inteligentes
    $: alerts = (() => {
        const alertList: any[] = [];

        // Alumnos con baja asistencia
        const studentStats = store.students
            .map((student) => {
                const records = store.attendance.flatMap((r) =>
                    r.records.filter((rec) => rec.studentId === student.id),
                );
                const total = records.length;
                const present = records.filter(
                    (r) => r.status === "present",
                ).length;
                const rate = total > 0 ? (present / total) * 100 : 100;
                return { student, rate, total };
            })
            .filter((s) => s.rate < 70 && s.total >= 3);

        if (studentStats.length > 0) {
            alertList.push({
                type: "warning",
                message: `${studentStats.length} alumno${studentStats.length > 1 ? "s" : ""} con baja asistencia`,
                action: "Ver detalles",
                link: "students",
            });
        }

        // Clases sin asistencia reciente
        const classesNoAttendance = store.classes.filter((c) => {
            const lastRecord = store.attendance
                .filter((r) => r.classId === c.id)
                .sort((a, b) => b.date.localeCompare(a.date))[0];
            return !lastRecord || daysSince(lastRecord.date) > 7;
        });

        if (classesNoAttendance.length > 0) {
            alertList.push({
                type: "info",
                message: `${classesNoAttendance.length} clase${classesNoAttendance.length > 1 ? "s" : ""} sin asistencia registrada`,
                action: "Pasar lista",
                link: "attendance",
            });
        }

        return alertList;
    })();

    // Tareas Pendientes
    $: pendingTasks = (() => {
        const tasks: any[] = [];

        // 1. Clases sin asistencia registrada (>3 días)
        const classesNeedingAttendance = store.classes.filter((c) => {
            const lastRecord = store.attendance
                .filter((r) => r.classId === c.id)
                .sort((a, b) => b.date.localeCompare(a.date))[0];
            return !lastRecord || daysSince(lastRecord.date) > 3;
        });

        classesNeedingAttendance.forEach((cls) => {
            const lastRecord = store.attendance
                .filter((r) => r.classId === cls.id)
                .sort((a, b) => b.date.localeCompare(a.date))[0];
            const daysAgo = lastRecord ? daysSince(lastRecord.date) : 999;

            tasks.push({
                type: "attendance",
                title: `Pasar lista: ${cls.name}`,
                subtitle: lastRecord
                    ? `Última asistencia hace ${daysAgo} días`
                    : "Sin registros de asistencia",
                priority: daysAgo > 7 ? "high" : "medium",
                icon: ClipboardCheck,
                color: daysAgo > 7 ? "red" : "amber",
                action: "Registrar",
                link: "attendance",
                linkParams: `?classId=${cls.id}`,
            });
        });

        // 2. Torneos sin emparejamientos generados
        const tournamentsNeedingPairings = store.tournaments.filter(
            (t) =>
                t.status === "Upcoming" &&
                t.matches.length === 0 &&
                t.participants.length >= 2,
        );

        tournamentsNeedingPairings.forEach((t) => {
            const daysUntil = daysTill(t.date);
            tasks.push({
                type: "tournament-pairings",
                title: `Generar emparejamientos: ${t.name}`,
                subtitle: `${t.participants.length} participantes inscritos`,
                priority: daysUntil <= 2 ? "high" : "medium",
                icon: Trophy,
                color: daysUntil <= 2 ? "red" : "orange",
                action: "Generar",
                link: `tournaments/${t.id}`,
                linkParams: "",
            });
        });

        // 3. Clases de hoy sin asistencia registrada
        const todaysClassesNeedingAttendance = todaysClasses.filter((cls) => {
            const todayRecord = store.attendance.find(
                (r) =>
                    r.classId === cls.id &&
                    r.date === new Date().toISOString().split("T")[0],
            );
            return !todayRecord;
        });

        todaysClassesNeedingAttendance.forEach((cls) => {
            tasks.push({
                type: "today-attendance",
                title: `Clase de hoy: ${cls.name}`,
                subtitle: `${cls.schedule} • ${cls.students.length} alumnos`,
                priority: "high",
                icon: BookOpen,
                color: "purple",
                action: "Pasar lista",
                link: "attendance",
                linkParams: `?classId=${cls.id}`,
            });
        });

        // 4. Torneos próximos (2 días) sin suficientes participantes
        const tournamentsNeedingParticipants = store.tournaments.filter(
            (t) =>
                t.status === "Upcoming" &&
                daysTill(t.date) <= 2 &&
                daysTill(t.date) >= 0 &&
                t.participants.length < 4,
        );

        tournamentsNeedingParticipants.forEach((t) => {
            tasks.push({
                type: "tournament-participants",
                title: `Inscribir participantes: ${t.name}`,
                subtitle: `Solo ${t.participants.length} inscritos • Empieza en ${daysTill(t.date)} día${daysTill(t.date) !== 1 ? "s" : ""}`,
                priority: "medium",
                icon: Trophy,
                color: "blue",
                action: "Inscribir",
                link: `tournaments/${t.id}`,
                linkParams: "",
            });
        });

        // Ordenar por prioridad: high > medium > low
        const priorityOrder: Record<string, number> = {
            high: 0,
            medium: 1,
            low: 2,
        };
        return tasks.sort(
            (a, b) =>
                (priorityOrder[a.priority] ?? 99) -
                (priorityOrder[b.priority] ?? 99),
        );
    })();

    // Real Schedule Logic
    const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];
    const currentDayName = days[new Date().getDay()];

    // Find classes that mention today's name in their schedule string
    $: todaysClasses = store.classes.filter((c) =>
        c.schedule.toLowerCase().includes(currentDayName.toLowerCase()),
    );
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header Section -->
    <div class="mb-8">
        <div class="flex justify-between items-end">
            <div>
                <h2 class="text-3xl font-bold text-white">Dashboard</h2>
                <p class="text-slate-400 mt-1">
                    Bienvenido de vuelta, profesor.
                </p>
            </div>
            <div class="text-right hidden sm:block">
                <p class="text-sm text-slate-400">Hoy</p>
                <p class="text-xl font-bold text-white capitalize">{today}</p>
            </div>
        </div>
    </div>

    <!-- Stats Grid -->
    <!-- Quick Actions -->
    <div
        class="bg-[#1e293b] rounded-2xl border border-slate-800 p-8 mb-8 relative"
    >
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white">Acciones Rápidas</h3>
            <button
                onclick={toggleEditMode}
                class="text-xs flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors {isEditingLayout
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                    : 'text-slate-400'}"
            >
                <Settings2 class="w-3.5 h-3.5" />
                {isEditingLayout ? "Guardar Orden" : "Personalizar"}
            </button>
        </div>

        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            role="list"
        >
            {#each finalActions as action (action.id)}
                <div
                    animate:flip={{ duration: 300 }}
                    draggable={isEditingLayout}
                    ondragstart={(e) => handleDragStart(e, action)}
                    ondragover={(e) => handleDragOver(e, action)}
                    ondragend={(e) => handleDragEnd(e)}
                    ontouchstart={(e) => handleTouchStart(e, action)}
                    ontouchmove={handleTouchMove}
                    ontouchend={handleTouchEnd}
                    data-action-id={action.id}
                    class="relative transition-all duration-200 {draggedItem?.id ===
                    action.id
                        ? 'scale-105 z-10'
                        : ''}"
                    role="listitem"
                >
                    <button
                        onclick={() =>
                            !isEditingLayout && navigate(action.link)}
                        class="group flex flex-col items-start p-6 bg-[#0f172a] rounded-2xl border border-slate-800 transition-all duration-300 {action.hover} hover:shadow-xl hover:-translate-y-1 relative w-full text-left cursor-pointer {isEditingLayout
                            ? 'border-dashed border-slate-600 cursor-move'
                            : ''}"
                    >
                        {#if action.badge}
                            <span
                                class="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full z-10"
                                >{action.badge}</span
                            >
                        {/if}
                        <div class="flex justify-between w-full">
                            <svelte:component
                                this={action.icon}
                                class="w-10 h-10 mb-4 {action.color}"
                            />
                            {#if isEditingLayout}
                                <GripVertical class="w-5 h-5 text-slate-600" />
                            {:else}
                                <ChevronRight
                                    class="w-5 h-5 text-slate-700 group-hover:text-white transition-colors"
                                />
                            {/if}
                        </div>

                        <h4
                            class="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors"
                        >
                            {action.title}
                        </h4>
                        <p
                            class="text-sm text-slate-500 font-medium leading-relaxed"
                        >
                            {action.desc}
                        </p>
                    </button>
                </div>
            {/each}
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Estudiantes -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div class="flex-1">
                <p class="text-slate-400 text-sm font-medium">
                    Estudiantes Activos
                </p>
                <p class="text-3xl font-bold text-white mt-2">
                    {store.students.length}
                </p>
                {#if recentStudents > 0}
                    <div class="flex items-center gap-2 mt-2">
                        <span
                            class="text-emerald-500 text-xs flex items-center font-medium"
                        >
                            <ArrowUpRight class="w-3 h-3 mr-1" />
                            +{recentStudents} recientes
                        </span>
                    </div>
                {:else}
                    <p class="text-slate-500 text-xs mt-2 font-medium">
                        Matriculados
                    </p>
                {/if}
            </div>
            <div class="bg-emerald-500/10 p-3 rounded-xl">
                <Users class="w-6 h-6 text-emerald-500" />
            </div>
        </div>

        <!-- Clases -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div class="flex-1">
                <p class="text-slate-400 text-sm font-medium">
                    Grupos / Clases
                </p>
                <p class="text-3xl font-bold text-white mt-2">
                    {store.classes.length}
                </p>
                <p class="text-slate-500 text-xs mt-2 font-medium">
                    En funcionamiento
                </p>
            </div>
            <div class="bg-purple-500/10 p-3 rounded-xl">
                <BookOpen class="w-6 h-6 text-purple-500" />
            </div>
        </div>

        <!-- Asistencia Promedio (NUEVO) -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div class="flex-1">
                <p class="text-slate-400 text-sm font-medium">
                    Asistencia Promedio
                </p>
                <p class="text-3xl font-bold text-white mt-2">
                    {averageAttendance}%
                </p>
                <div class="flex items-center gap-2 mt-2">
                    {#if averageAttendance >= 90}
                        <span
                            class="text-emerald-500 text-xs flex items-center font-medium"
                        >
                            <TrendingUp class="w-3 h-3 mr-1" />
                            Excelente
                        </span>
                    {:else if averageAttendance >= 70}
                        <span
                            class="text-blue-500 text-xs flex items-center font-medium"
                        >
                            <Activity class="w-3 h-3 mr-1" />
                            Buena
                        </span>
                    {:else}
                        <span
                            class="text-amber-500 text-xs flex items-center font-medium"
                        >
                            <AlertTriangle class="w-3 h-3 mr-1" />
                            Mejorable
                        </span>
                    {/if}
                </div>
            </div>
            <div class="bg-pink-500/10 p-3 rounded-xl">
                <ClipboardCheck class="w-6 h-6 text-pink-500" />
            </div>
        </div>

        <!-- Ingresos -->
        <div
            class="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-start"
        >
            <div class="flex-1">
                <p class="text-slate-400 text-sm font-medium">
                    Ingresos Totales
                </p>
                <p class="text-3xl font-bold text-white mt-2">
                    {totalRevenue}€
                </p>
                {#if revenueThisMonth > 0}
                    <div class="flex items-center gap-2 mt-2">
                        <span
                            class="text-emerald-500 text-xs flex items-center font-medium"
                        >
                            <TrendingUp class="w-3 h-3 mr-1" />
                            {revenueThisMonth}€ este mes
                        </span>
                    </div>
                {:else}
                    <p class="text-slate-500 text-xs mt-2 font-medium">
                        Acumulado
                    </p>
                {/if}
            </div>
            <div class="bg-teal-500/10 p-3 rounded-xl">
                <CreditCard class="w-6 h-6 text-teal-500" />
            </div>
        </div>
    </div>

    <!-- Calendar Layout -->
    <CalendarWidget />

    <!-- Mid Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Sesiones de Hoy -->
        <div
            class="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 p-6 h-80 flex flex-col"
        >
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">
                    Sesiones de Hoy ({currentDayName})
                </h3>
                <span class="text-xs text-slate-500 flex items-center">
                    <Clock class="w-3 h-3 mr-1" />
                    {todaysClasses.length} programadas hoy
                </span>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {#if todaysClasses.length === 0}
                    <div
                        class="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-xl"
                    >
                        <Calendar class="w-12 h-12 mb-4 opacity-50" />
                        <p>No hay clases para hoy</p>
                    </div>
                {:else}
                    {#each todaysClasses as cls}
                        <button
                            class="w-full text-left bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center hover:bg-slate-800 transition-colors cursor-pointer"
                            onclick={() => navigate("classes")}
                        >
                            <div>
                                <h4 class="font-bold text-white">{cls.name}</h4>
                                <p
                                    class="text-sm text-slate-400 flex items-center gap-2"
                                >
                                    <Clock class="w-3 h-3" />
                                    {cls.schedule}
                                </p>
                            </div>
                            <div class="text-right">
                                <span
                                    class="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/20"
                                >
                                    {cls.level === "Pawn"
                                        ? "Peón"
                                        : cls.level === "Bishop"
                                          ? "Alfil"
                                          : cls.level === "Rook"
                                            ? "Torre"
                                            : cls.level === "King"
                                              ? "Rey"
                                              : cls.level}
                                </span>
                                <p class="text-xs text-slate-500 mt-1">
                                    {cls.students.length} alumnos
                                </p>
                            </div>
                        </button>
                    {/each}
                {/if}
            </div>
        </div>

        <!-- Alertas Inteligentes (NUEVO) -->
        <div
            class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6 h-80 flex flex-col"
        >
            <div class="flex justify-between items-center mb-6">
                <h3
                    class="text-lg font-bold text-white flex items-center gap-2"
                >
                    <Bell class="w-5 h-5 text-amber-500" />
                    Alertas
                </h3>
                {#if alerts.length > 0}
                    <span
                        class="bg-amber-500/10 text-amber-400 text-xs font-bold px-2 py-1 rounded-full"
                    >
                        {alerts.length}
                    </span>
                {/if}
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                {#if alerts.length === 0}
                    <div
                        class="h-full flex flex-col items-center justify-center text-slate-500"
                    >
                        <CheckCircle
                            class="w-12 h-12 mb-4 opacity-50 text-emerald-500"
                        />
                        <p class="text-sm">Todo en orden</p>
                    </div>
                {:else}
                    {#each alerts as alert}
                        <div
                            class="bg-{alert.type === 'warning'
                                ? 'amber'
                                : 'blue'}-500/10 border border-{alert.type ===
                            'warning'
                                ? 'amber'
                                : 'blue'}-500/30 rounded-xl p-4"
                        >
                            <div class="flex items-start gap-3">
                                <AlertTriangle
                                    class="w-5 h-5 text-{alert.type ===
                                    'warning'
                                        ? 'amber'
                                        : 'blue'}-500 flex-shrink-0 mt-0.5"
                                />
                                <div class="flex-1">
                                    <p
                                        class="text-{alert.type === 'warning'
                                            ? 'amber'
                                            : 'blue'}-400 font-medium text-sm"
                                    >
                                        {alert.message}
                                    </p>
                                    <button
                                        onclick={() => navigate(alert.link)}
                                        class="text-xs text-{alert.type ===
                                        'warning'
                                            ? 'amber'
                                            : 'blue'}-300 hover:underline mt-1 cursor-pointer"
                                    >
                                        {alert.action} →
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>

    <!-- Nueva fila: Actividad Reciente + Próximos Eventos -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Actividad Reciente (Mejorado) -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
            <div class="flex justify-between items-center mb-6">
                <h3
                    class="text-lg font-bold text-white flex items-center gap-2"
                >
                    <Activity class="w-5 h-5 text-cyan-500" />
                    Actividad Reciente
                </h3>
            </div>

            <div class="space-y-3">
                {#if recentActivity.length === 0}
                    <p class="text-slate-500 text-center py-8 text-sm">
                        Sin actividad reciente
                    </p>
                {:else}
                    {#each recentActivity as activity}
                        <div
                            class="flex items-start gap-3 text-sm p-3 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-colors"
                        >
                            <div
                                class="w-8 h-8 rounded-full bg-{activity.color}-500/10 flex items-center justify-center flex-shrink-0"
                            >
                                <svelte:component
                                    this={activity.icon}
                                    class="w-4 h-4 text-{activity.color}-500"
                                />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-slate-300 truncate">
                                    {activity.description}
                                </p>
                                <p class="text-xs text-slate-500 mt-0.5">
                                    {activity.timeAgo}
                                </p>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>

        <!-- Tareas Pendientes (NUEVO) -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
            <div class="flex justify-between items-center mb-6">
                <h3
                    class="text-lg font-bold text-white flex items-center gap-2"
                >
                    <CheckCircle class="w-5 h-5 text-cyan-500" />
                    Tareas Pendientes
                </h3>
                {#if pendingTasks.length > 0}
                    <span
                        class="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2 py-1 rounded-full"
                    >
                        {pendingTasks.length}
                    </span>
                {/if}
            </div>

            <div class="space-y-3">
                {#if pendingTasks.length === 0}
                    <div class="text-center py-8 text-slate-500">
                        <CheckCircle
                            class="w-12 h-12 mx-auto mb-4 opacity-50 text-emerald-500"
                        />
                        <p class="text-sm font-medium text-emerald-400">
                            ¡Todo al día!
                        </p>
                        <p class="text-xs mt-1">No hay tareas pendientes</p>
                    </div>
                {:else}
                    {#each pendingTasks as task}
                        <div
                            class="bg-slate-900/30 p-4 rounded-lg border border-{task.color}-500/30 hover:border-{task.color}-500/50 transition-colors group"
                        >
                            <div class="flex items-start gap-3">
                                <!-- Priority indicator -->
                                <div class="flex flex-col items-center gap-1">
                                    <div
                                        class="w-10 h-10 rounded-full bg-{task.color}-500/10 flex items-center justify-center flex-shrink-0"
                                    >
                                        <svelte:component
                                            this={task.icon}
                                            class="w-5 h-5 text-{task.color}-500"
                                        />
                                    </div>
                                    {#if task.priority === "high"}
                                        <span
                                            class="text-[10px] font-bold text-red-400 uppercase"
                                            >Urgente</span
                                        >
                                    {/if}
                                </div>

                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="font-semibold text-white text-sm"
                                    >
                                        {task.title}
                                    </h4>
                                    <p class="text-xs text-slate-400 mt-1">
                                        {task.subtitle}
                                    </p>

                                    <!-- Action button -->
                                    <button
                                        onclick={() =>
                                            goto(
                                                `${base}/dashboard/${task.link}${task.linkParams}`,
                                            )}
                                        class="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-{task.color}-400 hover:text-{task.color}-300 transition-colors cursor-pointer group-hover:gap-2"
                                    >
                                        {task.action}
                                        <ChevronRight class="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>

    <!-- Performance (Placeholder) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Rendimiento por Centro -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">Centros Recientes</h3>
            </div>
            {#if store.centers.length === 0}
                <div
                    class="bg-slate-900/50 p-4 rounded-xl flex items-center justify-between"
                >
                    <div>
                        <p class="text-slate-300 font-medium">Sin centros</p>
                        <p class="text-slate-500 text-xs">
                            Añade tu primer centro
                        </p>
                    </div>
                </div>
            {:else}
                {#each store.centers.slice(0, 3) as center}
                    <div
                        class="bg-slate-900/50 p-4 rounded-xl flex items-center justify-between mb-3 last:mb-0"
                    >
                        <div>
                            <p class="text-slate-300 font-medium">
                                {center.name}
                            </p>
                            <p class="text-slate-500 text-xs">
                                {center.location}
                            </p>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Estado de clases -->
        <div class="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-white">Clases Principales</h3>
            </div>
            {#if store.classes.length === 0}
                <div class="text-center text-slate-500 mt-8">
                    <p class="text-sm">No hay clases creadas</p>
                </div>
            {:else}
                <div class="space-y-3">
                    {#each store.classes.slice(0, 3) as cls}
                        <div
                            class="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center"
                        >
                            <span class="text-slate-300 text-sm"
                                >{cls.name}</span
                            >
                            <span
                                class="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded"
                                >{cls.level === "Pawn"
                                    ? "Peón"
                                    : cls.level === "Bishop"
                                      ? "Alfil"
                                      : cls.level === "Rook"
                                        ? "Torre"
                                        : cls.level === "King"
                                          ? "Rey"
                                          : cls.level}</span
                            >
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <!-- Quick Actions -->
</div>
