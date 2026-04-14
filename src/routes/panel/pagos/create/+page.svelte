<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    CurrencyEur,
    Users,
    Buildings,
    CalendarBlank,
    FileText,
    WarningCircle,
    CheckCircle,
    Calculator,
    CreditCard,
    Bank,
    Receipt,
    IdentificationBadge,
    Note,
    ArrowUpRight,
    Tag,
    Clock,
    User,
    Student,
    Info,
    Layout
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import type { PaymentType, PaymentConcept, CreatePaymentData } from '$lib/types';
  import { fade, fly, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  // Form data
  let formData: CreatePaymentData = $state({
    payment_type: 'student',
    student_id: '',
    school_id: '',
    class_id: '',
    amount: 0,
    currency: 'EUR',
    concept: 'monthly_fee',
    description: '',
    period_start: '',
    period_end: '',
    status: 'pending',
    due_date: '',
    payment_method: '',
    payment_reference: '',
    invoice_number: '',
    invoice_date: '',
    notes: ''
  });

  // UI state
  let isSubmitting = $state(false);
  let errors: Record<string, string> = $state({});

  // Reactividad con appStore
  let students = $derived($appStore.students || []);
  let schools = $derived($appStore.schools || []);
  let classes = $derived($appStore.classes || []);

  // Reactive variables
  let filteredClasses = $derived(classes.filter((cls: any) => {
    if (formData.payment_type === 'student' && formData.student_id) {
      const student = students.find((s: any) => s.id === formData.student_id);
      return student && cls.school_id === student.school_id;
    }
    if (formData.payment_type === 'school' && formData.school_id) {
      return cls.school_id === formData.school_id;
    }
    return true;
  }));

  let selectedStudent = $derived(students.find((s: any) => s.id === formData.student_id));
  let selectedSchool = $derived(schools.find((s: any) => s.id === formData.school_id));
  let selectedClass = $derived(classes.find((c: any) => c.id === formData.class_id));

  // Auto-fill amount when class is selected
  $effect(() => {
    if (selectedClass && formData.amount === 0) {
      formData.amount = selectedClass.price || 0;
    }
  });

  // Auto-generate description
  $effect(() => {
    if (formData.concept && (selectedStudent || selectedSchool)) {
      const conceptLabels: Record<string, string> = {
        monthly_fee: 'Mensualidad',
        registration: 'Inscripción',
        tournament: 'Torneo',
        material: 'Material educativo',
        private_lesson: 'Clase particular',
        other: 'Otros servicios'
      };
      
      const entityName = selectedStudent?.name || selectedSchool?.name || '';
      const className = selectedClass ? ` - ${selectedClass.name}` : '';
      const periodText = formData.period_start && formData.period_end 
        ? ` (${formatDate(formData.period_start)} - ${formatDate(formData.period_end)})`
        : '';
      
      formData.description = `${conceptLabels[formData.concept] || ''} ${entityName}${className}${periodText}`.trim();
    }
  });

  // Set default due date (next month, day 5)
  onMount(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(5);
    formData.due_date = nextMonth.toISOString().split('T')[0];
  });

  const handlePaymentTypeChange = () => {
    // Reset related fields when payment type changes
    formData.student_id = '';
    formData.school_id = '';
    formData.class_id = '';
    formData.amount = 0;
    formData.description = '';
    errors = {};
  };

  const handleGoBack = () => {
    goto('/panel/pagos');
  };

  const validateForm = (): boolean => {
    errors = {};

    if (!formData.payment_type) {
      errors.payment_type = 'Selecciona el tipo de pago';
    }

    if (formData.payment_type === 'student' && !formData.student_id) {
      errors.student_id = 'Selecciona un estudiante';
    }

    if (formData.payment_type === 'school' && !formData.school_id) {
      errors.school_id = 'Selecciona un centro';
    }

    if (formData.amount !== null && formData.amount <= 0) {
      errors.amount = 'El importe debe ser mayor a 0';
    }

    if (formData.period_start && formData.period_end) {
      if (new Date(formData.period_start) >= new Date(formData.period_end)) {
        errors.period_start = 'La fecha de inicio debe ser anterior a la fecha de fin';
      }
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    isSubmitting = true;

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount) || 0,
          student_id: formData.payment_type === 'student' ? formData.student_id : undefined,
          school_id: formData.payment_type === 'school' ? formData.school_id : undefined
        })
      });

      const result = await response.json();

      if (result.success) {
        goto('/panel/pagos?created=true');
      } else {
        throw new Error(result.error || 'Error al crear el pago');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      errors.submit = error instanceof Error ? error.message : 'Error desconocido';
    } finally {
      isSubmitting = false;
    }
  };

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const getConceptLabel = (concept: string) => {
    const labels: Record<string, string> = {
      monthly_fee: 'Mensualidad',
      registration: 'Inscripción',
      tournament: 'Torneo',
      material: 'Material Educativo',
      private_lesson: 'Clase Particular',
      other: 'Otros'
    };
    return labels[concept] || concept;
  };

  const paymentMethods = [
    { id: 'transfer', label: 'Transferencia', icon: Bank },
    { id: 'cash', label: 'Efectivo', icon: Bank },
    { id: 'card', label: 'Tarjeta', icon: CreditCard },
    { id: 'direct_debit', label: 'Domiciliación', icon: Receipt }
  ];

  let activeSection = $state('entity');
</script>

<svelte:head>
  <title>Crear Pago - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b] p-4 lg:p-8 font-outfit">
  <div class="max-w-[1400px] mx-auto">
    
    <!-- Header Refactor -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
      <div class="flex items-center gap-6">
        <button 
          onclick={handleGoBack}
          class="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition-all group"
        >
          <ArrowLeft class="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
        </button>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-wider rounded border border-violet-500/20">
              Pagos & Finanzas
            </span>
          </div>
          <h1 class="text-4xl font-black text-white tracking-tight">Emitir Recibo</h1>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button 
          onclick={handleGoBack}
          class="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 font-bold text-sm border border-white/5 hover:bg-zinc-800 transition-all"
        >
          Descartar
        </button>
        <button 
          onclick={handleSubmit}
          disabled={isSubmitting}
          class="px-8 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-violet-900/20 transition-all flex items-center gap-2"
        >
          {#if isSubmitting}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Analizando...
          {:else}
            <CheckCircle weight="bold" class="w-4 h-4" />
            Finalizar Emisión
          {/if}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Columna Izquierda: Formulario Seccionado -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Sección 1: Entidad -->
        <div class="bento-card p-8">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <User weight="duotone" class="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 class="text-white font-bold">Destinatario</h3>
              <p class="text-xs text-zinc-500">¿A quién va dirigido este recibo?</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <button 
              onclick={() => { formData.payment_type = 'student'; handlePaymentTypeChange(); }}
              class="flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all {formData.payment_type === 'student' ? 'bg-violet-500/5 border-violet-500/30 ring-1 ring-violet-500/30' : 'bg-zinc-900/50 border-white/5 hover:border-white/10'}"
            >
              <Users weight={formData.payment_type === 'student' ? 'fill' : 'duotone'} class="w-8 h-8 {formData.payment_type === 'student' ? 'text-violet-400' : 'text-zinc-500'}" />
              <span class="text-sm font-bold {formData.payment_type === 'student' ? 'text-white' : 'text-zinc-400'}">Estudiante</span>
            </button>
            <button 
              onclick={() => { formData.payment_type = 'school'; handlePaymentTypeChange(); }}
              class="flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all {formData.payment_type === 'school' ? 'bg-violet-500/5 border-violet-500/30 ring-1 ring-violet-500/30' : 'bg-zinc-900/50 border-white/5 hover:border-white/10'}"
            >
              <Buildings weight={formData.payment_type === 'school' ? 'fill' : 'duotone'} class="w-8 h-8 {formData.payment_type === 'school' ? 'text-violet-400' : 'text-zinc-500'}" />
              <span class="text-sm font-bold {formData.payment_type === 'school' ? 'text-white' : 'text-zinc-400'}">Centro</span>
            </button>
          </div>

          {#if formData.payment_type === 'student'}
            <div class="space-y-2">
              <label for="student_id_select" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Estudiante Seleccionado</label>
              <select 
                id="student_id_select"
                bind:value={formData.student_id}
                class="bento-input h-14"
              >
                <option value="">Selecciona estudiante...</option>
                {#each students as student}
                  <option value={student.id}>{student.name}</option>
                {/each}
              </select>
              {#if errors.student_id}
                <p class="text-red-400 text-[10px] font-bold mt-1 ml-1">{errors.student_id}</p>
              {/if}
            </div>
          {:else}
            <div class="space-y-2">
              <label for="school_id_select" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Centro Seleccionado</label>
              <select 
                id="school_id_select"
                bind:value={formData.school_id}
                class="bento-input h-14"
              >
                <option value="">Selecciona centro...</option>
                {#each schools as school}
                  <option value={school.id}>{school.name}</option>
                {/each}
              </select>
              {#if errors.school_id}
                <p class="text-red-400 text-[10px] font-bold mt-1 ml-1">{errors.school_id}</p>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Sección 2: Configuración del Pago -->
        <div class="bento-card p-8 group">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Tag weight="duotone" class="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 class="text-white font-bold">Concepto e Importe</h3>
              <p class="text-xs text-zinc-500">Define qué se cobra y cuánto</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="concept" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Concepto Principal</label>
              <select id="concept" bind:value={formData.concept} class="bento-input h-14">
                <option value="monthly_fee">Mensualidad</option>
                <option value="registration">Inscripción</option>
                <option value="tournament">Torneo</option>
                <option value="material">Material</option>
                <option value="private_lesson">Clase Particular</option>
                <option value="other">Otros</option>
              </select>
            </div>

            <div class="space-y-2">
              <label for="amount" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Importe del Pago</label>
              <div class="relative">
                <CurrencyEur class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  id="amount"
                  type="number" 
                  bind:value={formData.amount}
                  placeholder="0.00"
                  class="bento-input h-14 pl-12 pr-4"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="class_id" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Clase Asociada (Opcional)</label>
              <select id="class_id" bind:value={formData.class_id} class="bento-input h-14">
                <option value="">Ninguna</option>
                {#each filteredClasses as cls}
                  <option value={cls.id}>{cls.name}</option>
                {/each}
              </select>
            </div>

            <div class="space-y-2">
              <label for="due_date" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Fecha Límite</label>
              <div class="relative">
                <Clock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  id="due_date"
                  type="date" 
                  bind:value={formData.due_date}
                  class="bento-input h-14 pl-12 pr-4 w-full"
                />
              </div>
            </div>
          </div>

          <div class="mt-8 space-y-2">
            <label for="description" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Descripción del Recibo</label>
            <textarea 
              id="description"
              bind:value={formData.description}
              rows="2"
              class="bento-input h-auto min-h-[80px] py-4 resize-none"
              placeholder="Ej: Mensualidad de Enero - Alberto Gómez..."
            ></textarea>
          </div>
        </div>

        <!-- Sección 3: Temporada -->
        <div class="bento-card p-8">
           <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <CalendarBlank weight="duotone" class="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 class="text-white font-bold">Período Fiscal</h3>
              <p class="text-xs text-zinc-500">¿Qué tiempo cubre este pago?</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label for="period_start" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Desde</label>
              <input id="period_start" type="date" bind:value={formData.period_start} class="bento-input h-14" />
            </div>
            <div class="space-y-2">
              <label for="period_end" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Hasta</label>
              <input id="period_end" type="date" bind:value={formData.period_end} class="bento-input h-14" />
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Recibo Live Preview -->
      <div class="lg:col-span-5 relative">
        <div class="sticky top-8 space-y-6">
          
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-black text-zinc-500 uppercase tracking-widest">Vista Previa del Recibo</h3>
            <div class="flex gap-1">
              <div class="w-2 h-2 rounded-full bg-violet-500 pulse"></div>
              <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">En Tiempo Real</span>
            </div>
          </div>

          <!-- The Receipt Card -->
          <div class="bg-white rounded-3xl p-8 shadow-2xl shadow-black/80 text-zinc-900 overflow-hidden relative group">
            <!-- Security Pattern Overlay -->
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
              <div class="grid grid-cols-12 gap-1 w-[200%] h-[200%] rotate-45 -translate-x-1/2 -translate-y-1/2">
                {#each Array(400) as _}
                    <div class="text-[8px] font-bold">CHESSNET</div>
                {/each}
              </div>
            </div>

            <div class="relative z-10">
              <!-- Header -->
              <div class="flex justify-between items-start border-b-2 border-zinc-100 pb-8 mb-8">
                <div>
                  <h2 class="text-2xl font-black tracking-tighter text-black">ChessNet</h2>
                  <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Academia de Ajedrez</p>
                </div>
                <div class="text-right">
                  <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total a Pagar</div>
                  <div class="text-3xl font-black tracking-tight">{formatCurrency(formData.amount)}</div>
                </div>
              </div>

              <!-- Main Info Grid -->
              <div class="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">Emitido para</div>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                      {#if formData.payment_type === 'student'}
                        <User weight="fill" class="w-5 h-5 text-zinc-400" />
                      {:else}
                        <Buildings weight="fill" class="w-5 h-5 text-zinc-400" />
                      {/if}
                    </div>
                    <div>
                      <p class="text-sm font-black text-black leading-tight italic">
                        {selectedStudent?.name || selectedSchool?.name || 'Cliente sin definir'}
                      </p>
                      <p class="text-[10px] font-bold text-zinc-500 uppercase italic">
                        {formData.payment_type === 'student' ? 'Estudiante' : 'Entidad'}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">Fecha Emisión</div>
                  <p class="text-sm font-black text-black italic">
                    {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <!-- Line Items -->
              <div class="space-y-4 mb-12">
                <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Conceptos del Recibo</div>
                <div class="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-black text-black italic uppercase">{getConceptLabel(formData.concept)}</p>
                      <p class="text-[10px] font-bold text-zinc-500 mt-1 max-w-[200px]">
                        {formData.description || 'No hay descripción vinculada a este movimiento.'}
                      </p>
                      {#if selectedClass}
                         <div class="mt-3 flex items-center gap-1.5">
                            <IdentificationBadge class="w-3.5 h-3.5 text-violet-500" />
                            <span class="text-[10px] font-black text-violet-600 uppercase italic">Clase: {selectedClass.name}</span>
                         </div>
                      {/if}
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-black text-black italic">{formatCurrency(formData.amount)}</p>
                      <p class="text-[9px] font-bold text-zinc-400 uppercase mt-1">INC. IVA</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Details -->
              <div class="grid grid-cols-2 gap-4 pt-8 border-t-2 border-dashed border-zinc-200">
                <div>
                  <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">Vencimiento</div>
                  <p class="text-xs font-black text-black italic">
                    {formData.due_date ? formatDate(formData.due_date) : 'Al recibir'}
                  </p>
                </div>
                <div class="text-right">
                    <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">Nº Referencia</div>
                    <p class="text-xs font-black text-black italic">TEMP-{Math.floor(Math.random() * 90000) + 10000}</p>
                </div>
              </div>

              <!-- Bottom Bar -->
              <div class="mt-8 flex justify-center">
                <div class="flex flex-col items-center">
                   <div class="w-32 h-1 bg-zinc-900/5 rounded-full mb-4"></div>
                   <p class="text-[8px] font-black text-zinc-300 uppercase tracking-[0.3em]">ChessNet International Systems</p>
                </div>
              </div>
            </div>

            <!-- Scissors Cut Line (Effect) -->
            <div class="absolute -bottom-6 left-0 right-0 h-1 border-t-2 border-dashed border-zinc-200"></div>
          </div>

          <!-- Receipt Stats Extra -->
          <div class="bento-card p-6 border-zinc-900">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center">
                   <Calculator weight="duotone" class="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                   <h4 class="text-white text-sm font-bold">Proyección Mensual</h4>
                   <p class="text-[10px] text-zinc-500">Este cobro incrementará el flujo de caja del centro en un 2.4%.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .pulse {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }

  .bento-input {
    @apply w-full bg-zinc-900 border border-white/5 rounded-2xl px-4 text-white font-bold text-sm outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2352525b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1.5rem;
  }
</style>
