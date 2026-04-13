<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    DollarSign,
    Users,
    School,
    Calendar,
    FileText,
    AlertCircle,
    CheckCircle,
    Calculator,
    CreditCard,
    Banknote
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import type { PaymentType, PaymentConcept, CreatePaymentData } from '$lib/types';

  // Form data
  let formData: CreatePaymentData = {
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
  };

  // UI state
  let isSubmitting = $state(false);
  let showPreview = $state(false);
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

    // Validaciones opcionales - solo validar formato si se proporciona
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
          payment_type: formData.payment_type || 'student',
          student_id: (formData.payment_type === 'student' && formData.student_id?.trim()) ? formData.student_id.trim() : undefined,
          school_id: (formData.payment_type === 'school' && formData.school_id?.trim()) ? formData.school_id.trim() : undefined,
          class_id: (formData.class_id?.trim()) ? formData.class_id.trim() : undefined,
          amount: Number(formData.amount) || 0,
          currency: formData.currency || 'EUR',
          concept: formData.concept || 'monthly_fee',
          description: (formData.description?.trim()) ? formData.description.trim() : undefined,
          period_start: formData.period_start || undefined,
          period_end: formData.period_end || undefined,
          status: formData.status || 'pending',
          due_date: formData.due_date || undefined,
          payment_method: (formData.payment_method?.trim()) ? formData.payment_method.trim() : undefined,
          payment_reference: (formData.payment_reference?.trim()) ? formData.payment_reference.trim() : undefined,
          invoice_number: (formData.invoice_number?.trim()) ? formData.invoice_number.trim() : undefined,
          invoice_date: formData.invoice_date || undefined,
          notes: (formData.notes?.trim()) ? formData.notes.trim() : undefined
        })
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to payments page with success message
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

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '0,00 €';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getConceptLabel = (concept: PaymentConcept) => {
    const labels = {
      monthly_fee: 'Mensualidad',
      registration: 'Inscripción',
      tournament: 'Torneo',
      material: 'Material',
      private_lesson: 'Clase Particular',
      other: 'Otros'
    };
    return labels[concept] || concept;
  };
</script>

<svelte:head>
  <title>Crear Nuevo Pago - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
  <!-- Header -->
  <div class="border-b border-slate-700/50 bg-slate-800/50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between py-6">
        <div class="flex items-center space-x-4">
          <button
            onclick={handleGoBack}
            class="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="p-2 bg-emerald-500/20 rounded-lg">
            <DollarSign class="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Crear Nuevo Pago</h1>
            <p class="text-slate-400">Registrar un nuevo pago o factura</p>
          </div>
        </div>
        
        <button
          onclick={() => showPreview = !showPreview}
          class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
        >
          <FileText class="w-4 h-4" />
          <span>{showPreview ? 'Ocultar' : 'Vista Previa'}</span>
        </button>
      </div>
    </div>
  </div>

  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 {showPreview ? 'lg:grid-cols-2' : ''} gap-8">
      
      <!-- Formulario -->
      <div class="space-y-8">
        
        <!-- Tipo de Pago -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Tipo de Pago</h2>
          
          <div class="grid grid-cols-2 gap-4">
            <label class="relative">
              <input
                type="radio"
                bind:group={formData.payment_type}
                value="student"
                onchange={handlePaymentTypeChange}
                class="sr-only"
              />
              <div class="p-4 border-2 rounded-lg cursor-pointer transition-all {formData.payment_type === 'student' 
                ? 'border-emerald-500 bg-emerald-500/10' 
                : 'border-slate-600 hover:border-slate-500'}">
                <div class="flex items-center space-x-3">
                  <Users class="w-6 h-6 {formData.payment_type === 'student' ? 'text-emerald-400' : 'text-slate-400'}" />
                  <div>
                    <h3 class="font-medium {formData.payment_type === 'student' ? 'text-emerald-300' : 'text-white'}">
                      Estudiante Individual
                    </h3>
                    <p class="text-sm text-slate-400">Pago de un estudiante específico</p>
                  </div>
                </div>
              </div>
            </label>

            <label class="relative">
              <input
                type="radio"
                bind:group={formData.payment_type}
                value="school"
                onchange={handlePaymentTypeChange}
                class="sr-only"
              />
              <div class="p-4 border-2 rounded-lg cursor-pointer transition-all {formData.payment_type === 'school' 
                ? 'border-emerald-500 bg-emerald-500/10' 
                : 'border-slate-600 hover:border-slate-500'}">
                <div class="flex items-center space-x-3">
                  <School class="w-6 h-6 {formData.payment_type === 'school' ? 'text-emerald-400' : 'text-slate-400'}" />
                  <div>
                    <h3 class="font-medium {formData.payment_type === 'school' ? 'text-emerald-300' : 'text-white'}">
                      Centro Educativo
                    </h3>
                    <p class="text-sm text-slate-400">Pago de un centro completo</p>
                  </div>
                </div>
              </div>
            </label>
          </div>
          
          {#if errors.payment_type}
            <p class="mt-2 text-sm text-red-400 flex items-center space-x-1">
              <AlertCircle class="w-4 h-4" />
              <span>{errors.payment_type}</span>
            </p>
          {/if}
        </div>

        <!-- Selección de Cliente -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">
            {formData.payment_type === 'student' ? 'Seleccionar Estudiante' : 'Seleccionar Centro'}
          </h2>
          
          {#if formData.payment_type === 'student'}
            <div class="space-y-4">
              <div>
                <label for="student_id" class="block text-sm font-medium text-slate-300 mb-2">Estudiante</label>
                <select
                  id="student_id"
                  bind:value={formData.student_id}
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                >
                  <option value="">Selecciona un estudiante</option>
                  {#each students as student}
                    <option value={student.id}>{student.name} - {student.email}</option>
                  {/each}
                </select>
                {#if errors.student_id}
                  <p class="mt-1 text-sm text-red-400">{errors.student_id}</p>
                {/if}
              </div>

              {#if selectedStudent}
                <div class="p-3 bg-slate-700/30 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <Users class="w-5 h-5 text-blue-400" />
                    <div>
                      <p class="font-medium text-white">{selectedStudent.name}</p>
                      <p class="text-sm text-slate-400">{selectedStudent.email}</p>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {:else}
            <div class="space-y-4">
              <div>
                <label for="school_id" class="block text-sm font-medium text-slate-300 mb-2">Centro Educativo</label>
                <select
                  id="school_id"
                  bind:value={formData.school_id}
                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                >
                  <option value="">Selecciona un centro</option>
                  {#each schools as school}
                    <option value={school.id}>{school.name} - {school.city}</option>
                  {/each}
                </select>
                {#if errors.school_id}
                  <p class="mt-1 text-sm text-red-400">{errors.school_id}</p>
                {/if}
              </div>

              {#if selectedSchool}
                <div class="p-3 bg-slate-700/30 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <School class="w-5 h-5 text-purple-400" />
                    <div>
                      <p class="font-medium text-white">{selectedSchool.name}</p>
                      <p class="text-sm text-slate-400">{selectedSchool.city}</p>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Detalles del Pago -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Detalles del Pago</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Concepto -->
            <div>
              <label for="concept" class="block text-sm font-medium text-slate-300 mb-2">Concepto</label>
              <select
                id="concept"
                bind:value={formData.concept}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              >
                <option value="monthly_fee">Mensualidad</option>
                <option value="registration">Inscripción</option>
                <option value="tournament">Torneo</option>
                <option value="material">Material</option>
                <option value="private_lesson">Clase Particular</option>
                <option value="other">Otros</option>
              </select>
              {#if errors.concept}
                <p class="mt-1 text-sm text-red-400">{errors.concept}</p>
              {/if}
            </div>

            <!-- Clase (opcional) -->
            <div>
              <label for="class_id" class="block text-sm font-medium text-slate-300 mb-2">
                Clase (opcional)
              </label>
              <select
                id="class_id"
                bind:value={formData.class_id}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              >
                <option value="">Sin clase específica</option>
                {#each filteredClasses as cls}
                  <option value={cls.id}>{cls.name} - {formatCurrency(cls.price)}</option>
                {/each}
              </select>
            </div>

            <!-- Importe -->
            <div>
              <label for="amount" class="block text-sm font-medium text-slate-300 mb-2">
                Importe
              </label>
              <div class="relative">
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  bind:value={formData.amount}
                  placeholder="0.00"
                  class="w-full pl-8 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                />
                <DollarSign class="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              {#if errors.amount}
                <p class="mt-1 text-sm text-red-400">{errors.amount}</p>
              {/if}
            </div>

            <!-- Fecha de Vencimiento -->
            <div>
              <label for="due_date" class="block text-sm font-medium text-slate-300 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                id="due_date"
                type="date"
                bind:value={formData.due_date}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              />
              {#if errors.due_date}
                <p class="mt-1 text-sm text-red-400">{errors.due_date}</p>
              {/if}
            </div>
          </div>

          <!-- Descripción -->
          <div class="mt-4">
            <label for="description" class="block text-sm font-medium text-slate-300 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              bind:value={formData.description}
              placeholder="Descripción del pago..."
              rows="3"
              class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
            ></textarea>
            {#if errors.description}
              <p class="mt-1 text-sm text-red-400">{errors.description}</p>
            {/if}
          </div>
        </div>

        <!-- Período (opcional) -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Período (Opcional)</h2>
          <p class="text-sm text-slate-400 mb-4">
            Define el período que cubre este pago (útil para mensualidades)
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="period_start" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Inicio</label>
              <input
                id="period_start"
                type="date"
                bind:value={formData.period_start}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label for="period_end" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Fin</label>
              <input
                id="period_end"
                type="date"
                bind:value={formData.period_end}
                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
              />
            </div>
          </div>
          
          {#if errors.period_start}
            <p class="mt-2 text-sm text-red-400">{errors.period_start}</p>
          {/if}
        </div>

        <!-- Notas -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-white mb-4">Notas Adicionales</h2>
          <textarea
            bind:value={formData.notes}
            placeholder="Notas internas, recordatorios, observaciones..."
            rows="3"
            class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none"
          ></textarea>
        </div>

        <!-- Error de envío -->
        {#if errors.submit}
          <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <AlertCircle class="w-5 h-5 text-red-400" />
              <p class="text-red-400">{errors.submit}</p>
            </div>
          </div>
        {/if}

        <!-- Botones de Acción -->
        <div class="flex items-center justify-between space-x-4">
          <button
            onclick={handleGoBack}
            class="px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
          >
            Cancelar
          </button>

          <button
            onclick={handleSubmit}
            disabled={isSubmitting}
            class="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-lg transition-colors"
          >
            {#if isSubmitting}
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Creando...</span>
            {:else}
              <CheckCircle class="w-4 h-4" />
              <span>Crear Pago</span>
            {/if}
          </button>
        </div>
      </div>

      <!-- Vista Previa -->
      {#if showPreview}
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 sticky top-8">
          <h2 class="text-lg font-semibold text-white mb-4">Vista Previa</h2>
          
          <div class="space-y-4">
            <!-- Cliente -->
            <div class="flex items-center space-x-3">
              {#if formData.payment_type === 'student'}
                <Users class="w-5 h-5 text-blue-400" />
              {:else}
                <School class="w-5 h-5 text-purple-400" />
              {/if}
              <div>
                <p class="font-medium text-white">
                  {selectedStudent?.name || selectedSchool?.name || 'Sin seleccionar'}
                </p>
                <p class="text-sm text-slate-400">
                  {formData.payment_type === 'student' ? 'Estudiante' : 'Centro'}
                </p>
              </div>
            </div>

            <!-- Detalles -->
            <div class="border-t border-slate-700/50 pt-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-slate-400">Concepto:</span>
                <span class="text-white">{getConceptLabel(formData.concept)}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-slate-400">Importe:</span>
                <span class="text-white font-semibold">{formatCurrency(formData.amount)}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-slate-400">Vencimiento:</span>
                <span class="text-white">
                  {formData.due_date ? formatDate(formData.due_date) : 'Sin fecha'}
                </span>
              </div>
              
              {#if selectedClass}
                <div class="flex justify-between">
                  <span class="text-slate-400">Clase:</span>
                  <span class="text-white">{selectedClass.name}</span>
                </div>
              {/if}
              
              {#if formData.period_start && formData.period_end}
                <div class="flex justify-between">
                  <span class="text-slate-400">Período:</span>
                  <span class="text-white">
                    {formatDate(formData.period_start)} - {formatDate(formData.period_end)}
                  </span>
                </div>
              {/if}
            </div>

            <!-- Descripción -->
            {#if formData.description}
              <div class="border-t border-slate-700/50 pt-4">
                <p class="text-sm text-slate-400 mb-2">Descripción:</p>
                <p class="text-white text-sm">{formData.description}</p>
              </div>
            {/if}

            <!-- Notas -->
            {#if formData.notes}
              <div class="border-t border-slate-700/50 pt-4">
                <p class="text-sm text-slate-400 mb-2">Notas:</p>
                <p class="text-slate-300 text-sm">{formData.notes}</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </main>
</div>
