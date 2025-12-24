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
    import RevenueChart from "$lib/components/dashboard/charts/RevenueChart.svelte";
    import StudentGrowthChart from "$lib/components/dashboard/charts/StudentGrowthChart.svelte";
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
            link: "centros",
        },
        {
            id: "classes",
            title: "Clases",
            desc: "Organizar grupos y horarios",
            icon: BookOpen,
            color: "text-purple-500",
            hover: "hover:border-purple-500/50",
            link: "clases",
        },
        {
            id: "students",
            title: "Estudiantes",
            desc: "Gestionar alumnado e inscripciones",
            icon: Users,
            color: "text-emerald-500",
            hover: "hover:border-emerald-500/50",
            link: "alumnos",
        },
        {
            id: "skills",
            title: "Habilidades",
            desc: "Definir temarios y competencias",
            icon: Target,
            color: "text-yellow-500",
            hover: "hover:border-yellow-500/50",
            link: "habilidades",
        },
        {
            id: "tournaments",
            title: "Gestionar Torneos",
            desc: "Organizar competiciones locales",
            icon: Trophy,
            color: "text-orange-500",
            hover: "hover:border-orange-500/50",
            link: "torneos",
        },
        {
            id: "attendance",
            title: "Control de Asistencia",
            desc: "Pasar lista y estadísticas",
            icon: ClipboardCheck,
            color: "text-pink-500",
            hover: "hover:border-pink-500/50",
            link: "asistencia",
        },
        {
            id: "reports",
            title: "Informes",
            desc: "Reportes y análisis avanzados",
            icon: BarChart3,
            color: "text-cyan-500",
            hover: "hover:border-cyan-500/50",
            link: "informes",
        },
        {
            id: "payments",
            title: "Sistema de Pagos",
            desc: "Gestionar cobros y facturación",
            icon: CreditCard,
            color: "text-teal-500",
            hover: "hover:border-teal-500/50",
            link: "pagos",
            badge: "BETA",
        },
        {
            id: "planner",
            title: "Planificador",
            desc: "Diseñar sesiones y contenido",
            icon: Layout,
            color: "text-indigo-500",
            hover: "hover:border-indigo-500/50",
            link: "agenda",
            badge: "NEW",
        },
        {
            id: "leads",
            title: "CRM / Interesados",
            desc: "Gestionar posibles alumnos",
            icon: UserPlus,
            color: "text-pink-500",
            hover: "hover:border-pink-500/50",
            link: "contactos",
            badge: "NEW",
        },
        {
            id: "achievements",
            title: "Logros",
            desc: "Ver progreso y medallas",
            icon: Trophy,
            color: "text-amber-500",
            hover: "hover:border-amber-500/50",
            link: "logros",
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
        if (path === "pagos" && store.settings.plan === "free") {
            notifications.warning(
                `El Sistema de Pagos solo está disponible en los planes Profe y Club.`,
            );
            return;
        }
        goto(`${base}/panel/${path}`);
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
                link: "alumnos",
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
                link: "asistencia",
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
                link: "asistencia",
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
                link: `torneos/${t.id}`,
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
                link: "asistencia",
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
                link: `torneos/${t.id}`,
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

    // --- Chart Data Logic ---
    $: chartLabels = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        // Capitalize first letter
        const month = d.toLocaleDateString("es-ES", { month: "short" });
        return month.charAt(0).toUpperCase() + month.slice(1);
    });

    $: revenueData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const month = d.getMonth();
        const year = d.getFullYear();

        return store.payments
            .filter((p) => {
                const pDate = new Date(p.date);
                return (
                    pDate.getMonth() === month && pDate.getFullYear() === year
                );
            })
            .reduce((sum, p) => sum + p.amount, 0);
    });

    $: totalRevenueCurrentMonth = revenueData[5] || 0;
    $: revenueTrend =
        revenueData[4] > 0
            ? ((revenueData[5] - revenueData[4]) / revenueData[4]) * 100
            : 0;

    $: studentGrowthData = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const month = d.getMonth();
        const year = d.getFullYear();

        return store.students.filter((s) => {
            // If no joinedAt, assume old student (or handle as you wish, here ignoring or placing in ancient times)
            if (!s.joinedAt) return false;
            const sDate = new Date(s.joinedAt);
            return sDate.getMonth() === month && sDate.getFullYear() === year;
        }).length;
    });

    $: newStudentsCurrentMonth = studentGrowthData[5] || 0;
    // Simple text based on previous month
    $: studentGrowthTrendText =
        newStudentsCurrentMonth >= studentGrowthData[4]
            ? "este mes"
            : "baja activ.";
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
    <!-- 1. Header & Welcome -->
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pt-6"
    >
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-2">
                Hola, Profe <span class="animate-pulse">👋</span>
            </h1>
            <p class="text-slate-400 mt-1 text-lg">
                Aquí tienes el resumen de tu academia hoy.
            </p>
        </div>
        <div
            class="mt-4 md:mt-0 text-left md:text-right bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50"
        >
            <p
                class="text-xs text-slate-400 uppercase font-bold tracking-wider"
            >
                Hoy es
            </p>
            <p
                class="text-xl font-bold text-white capitalize flex items-center gap-2"
            >
                <Calendar class="w-5 h-5 text-indigo-400" />
                {today}
            </p>
        </div>
    </div>

    <!-- 2. Quick Actions (Navigation) - NOW TOP PRIORITY -->
    <div class="mb-10">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
                <Layout class="w-5 h-5 text-indigo-500" />
                Accesos Directos
            </h2>
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
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4"
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
                        ? 'scale-105 z-10 opacity-50'
                        : ''}"
                    role="listitem"
                >
                    <button
                        onclick={() =>
                            !isEditingLayout && navigate(action.link)}
                        class="group flex flex-col items-center justify-center p-4 bg-[#1e293b] hover:bg-slate-800 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 w-full aspect-square md:aspect-auto md:h-32 shadow-lg hover:shadow-xl hover:-translate-y-1 relative {isEditingLayout
                            ? 'cursor-move border-dashed border-slate-500'
                            : 'cursor-pointer'}"
                    >
                        {#if action.badge}
                            <span
                                class="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10"
                            >
                                {action.badge}
                            </span>
                        {/if}

                        <div
                            class="p-3 bg-slate-900/50 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300"
                        >
                            <svelte:component
                                this={action.icon}
                                class="w-6 h-6 {action.color}"
                            />
                        </div>

                        <span
                            class="text-sm font-semibold text-slate-300 group-hover:text-white text-center leading-tight"
                        >
                            {action.title}
                        </span>

                        {#if isEditingLayout}
                            <div
                                class="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center"
                            >
                                <GripVertical class="w-6 h-6 text-white/80" />
                            </div>
                        {/if}
                    </button>
                </div>
            {/each}
        </div>
    </div>

    <!-- 3. Command Center (Alerts & Activity) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <!-- Left: Priority Alerts & Today's Schedule -->
        <div class="lg:col-span-2 space-y-8">
            <!-- Smart Alerts -->
            {#if alerts.length > 0 || pendingTasks.length > 0}
                <div class="space-y-3">
                    <h3
                        class="text-lg font-bold text-white flex items-center gap-2"
                    >
                        <Bell class="w-5 h-5 text-amber-500" />
                        Atención Requerida
                    </h3>

                    {#if pendingTasks.length > 0}
                        {#each pendingTasks.slice(0, 3) as task}
                            <div
                                class="bg-slate-800/40 border-l-4 border-{task.color}-500 rounded-r-xl p-4 flex items-center justify-between hover:bg-slate-800/60 transition-colors"
                            >
                                <div class="flex items-center gap-4">
                                    <div class="p-2 bg-slate-900 rounded-lg">
                                        <svelte:component
                                            this={task.icon}
                                            class="w-5 h-5 text-{task.color}-500"
                                        />
                                    </div>
                                    <div>
                                        <p
                                            class="font-bold text-slate-200 text-sm"
                                        >
                                            {task.title}
                                        </p>
                                        <p class="text-xs text-slate-500">
                                            {task.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onclick={() =>
                                        navigate(
                                            `${task.link}${task.linkParams || ""}`,
                                        )}
                                    class="text-xs font-bold bg-{task.color}-500/10 text-{task.color}-400 px-3 py-1.5 rounded-lg hover:bg-{task.color}-500/20 transition-colors"
                                >
                                    {task.action}
                                </button>
                            </div>
                        {/each}
                    {/if}

                    {#each alerts.slice(0, 2) as alert}
                        <div
                            class="bg-slate-800/40 border-l-4 border-amber-500 rounded-r-xl p-4 flex items-center justify-between"
                        >
                            <div class="flex items-center gap-3">
                                <AlertTriangle class="w-5 h-5 text-amber-500" />
                                <span class="text-sm text-slate-300 font-medium"
                                    >{alert.message}</span
                                >
                            </div>
                            <button
                                onclick={() => navigate(alert.link)}
                                class="text-xs font-bold text-amber-500 hover:text-amber-400"
                            >
                                {alert.action} →
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Today's Classes -->
            <div>
                <h3
                    class="text-lg font-bold text-white flex items-center gap-2 mb-4"
                >
                    <Clock class="w-5 h-5 text-emerald-500" />
                    Clases de Hoy
                </h3>

                {#if todaysClasses.length === 0}
                    <div
                        class="bg-[#1e293b] border border-slate-700 rounded-2xl p-8 text-center"
                    >
                        <div
                            class="inline-block p-4 bg-slate-800 rounded-full mb-3"
                        >
                            <Calendar class="w-8 h-8 text-slate-500" />
                        </div>
                        <p class="text-slate-300 font-medium">¡Día libre! 🎉</p>
                        <p class="text-sm text-slate-500 mt-1">
                            No tienes clases programadas para hoy.
                        </p>
                        <button
                            onclick={() => navigate("clases")}
                            class="mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Ver horario completo →
                        </button>
                    </div>
                {:else}
                    <div class="grid gap-4">
                        {#each todaysClasses as cls}
                            <div
                                class="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold text-xl border border-emerald-500/20 group-hover:scale-105 transition-transform"
                                    >
                                        {cls.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4
                                            class="font-bold text-white text-lg"
                                        >
                                            {cls.name}
                                        </h4>
                                        <div
                                            class="flex items-center gap-3 text-sm text-slate-400 mt-1"
                                        >
                                            <span
                                                class="flex items-center gap-1"
                                            >
                                                <Clock class="w-3.5 h-3.5" />
                                                {cls.schedule}
                                            </span>
                                            <span
                                                class="flex items-center gap-1"
                                            >
                                                <Users class="w-3.5 h-3.5" />
                                                {cls.students.length} alumnos
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href="{base}/panel/asistencia?classId={cls.id}"
                                    class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-emerald-900/20 text-center"
                                >
                                    Pasar Lista
                                </a>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Quick Stats Row -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div
                    class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50"
                >
                    <p class="text-slate-500 text-xs font-bold uppercase mb-1">
                        Alumnos
                    </p>
                    <p class="text-2xl font-bold text-white">
                        {store.students.length}
                    </p>
                    <p
                        class="text-xs text-emerald-400 mt-1 flex items-center gap-1"
                    >
                        <TrendingUp class="w-3 h-3" /> Activos
                    </p>
                </div>
                <div
                    class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50"
                >
                    <p class="text-slate-500 text-xs font-bold uppercase mb-1">
                        Ingresos (Mes)
                    </p>
                    <p class="text-2xl font-bold text-white">
                        {totalRevenueCurrentMonth}€
                    </p>
                    <p
                        class="text-xs {revenueTrend >= 0
                            ? 'text-emerald-400'
                            : 'text-red-400'} mt-1 flex items-center gap-1"
                    >
                        {#if revenueTrend >= 0}<TrendingUp
                                class="w-3 h-3"
                            />{:else}<TrendingDown class="w-3 h-3" />{/if}
                        {Math.round(revenueTrend)}% vs mes ant.
                    </p>
                </div>
                <div
                    class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50"
                >
                    <p class="text-slate-500 text-xs font-bold uppercase mb-1">
                        Asistencia
                    </p>
                    <p class="text-2xl font-bold text-white">
                        {averageAttendance}%
                    </p>
                    <p class="text-xs text-blue-400 mt-1">Promedio global</p>
                </div>
                <div
                    class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50"
                >
                    <p class="text-slate-500 text-xs font-bold uppercase mb-1">
                        Próx. Torneo
                    </p>
                    {#if store.tournaments.filter((t) => t.status === "Upcoming").length > 0}
                        {@const next = store.tournaments.filter(
                            (t) => t.status === "Upcoming",
                        )[0]}
                        <p class="text-lg font-bold text-white truncate">
                            {next.name}
                        </p>
                        <p class="text-xs text-orange-400 mt-1">
                            {daysTill(next.date)} días
                        </p>
                    {:else}
                        <p class="text-lg font-bold text-slate-500">—</p>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Right: Recent Activity Feed -->
        <div class="space-y-6">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <Activity class="w-5 h-5 text-blue-500" />
                Actividad Reciente
            </h3>

            <div
                class="bg-[#1e293b] border border-slate-700 rounded-2xl p-2 max-h-[500px] overflow-y-auto custom-scrollbar"
            >
                {#if recentActivity.length === 0}
                    <div class="p-8 text-center text-slate-500 text-sm">
                        No hay actividad reciente.
                    </div>
                {:else}
                    <div class="divide-y divide-slate-800">
                        {#each recentActivity as item}
                            <div
                                class="p-4 flex gap-4 hover:bg-slate-800/30 transition-colors rounded-xl"
                            >
                                <div class="mt-1">
                                    <div
                                        class="w-8 h-8 rounded-full bg-{item.color}-500/20 flex items-center justify-center border border-{item.color}-500/30"
                                    >
                                        <svelte:component
                                            this={item.icon}
                                            class="w-4 h-4 text-{item.color}-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p
                                        class="text-sm text-slate-300 font-medium leading-snug"
                                    >
                                        {item.description}
                                    </p>
                                    <p class="text-xs text-slate-500 mt-1">
                                        {item.timeAgo}
                                    </p>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Optional: Evaluation / Progression Widget could go here in future -->
            <div
                class="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30 text-center"
            >
                <Trophy class="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                <h4 class="text-white font-bold mb-1">
                    ¡Nuevo Logro Desbloqueado?
                </h4>
                <p class="text-sm text-indigo-200 mb-4">
                    Revisa si has subido de nivel como entrenador.
                </p>
                <button
                    onclick={() => navigate("logros")}
                    class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all w-full"
                >
                    Ver Mis Logros
                </button>
            </div>
        </div>
    </div>

    <!-- 4. Detailed Charts (Collapsible or Bottom) -->
    <div class="border-t border-slate-800 pt-8">
        <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 class="w-5 h-5 text-slate-400" />
            Análisis Detallado
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueChart
                data={revenueData}
                labels={chartLabels}
                totalRevenue={totalRevenueCurrentMonth}
                trendPercentage={revenueTrend}
            />
            <StudentGrowthChart
                data={studentGrowthData}
                labels={chartLabels}
                totalNewStudents={newStudentsCurrentMonth}
                trendText={studentGrowthTrendText}
            />
        </div>
    </div>
</div>
