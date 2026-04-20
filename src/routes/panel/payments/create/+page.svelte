<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
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
    User as UserIcon,
    Student,
    Info,
    Layout,
    Trophy,
    BookOpen,
    DotsThreeOutline
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
  const paymentMethods = [
    { id: 'transfer', icon: Bank, label: 'payments.methods.transfer' },
    { id: 'cash', icon: CurrencyEur, label: 'payments.methods.cash' },
    { id: 'card', icon: CreditCard, label: 'payments.methods.card' },
    { id: 'receipt', icon: Receipt, label: 'payments.methods.receipt' }
  ];

  let isSubmitting = $state(false);
  let errors: Record<string, string> = $state({});

  // Reactivity with appStore
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
        monthly_fee: $t('payments.monthly_fee'),
        registration: $t('payments.registration'),
        tournament: $t('payments.tournament'),
        material: $t('payments.material'),
        private_lesson: $t('payments.private_lesson'),
        other: $t('payments.other')
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
    goto('/panel/payments');
  };

  const validateForm = (): boolean => {
    errors = {};

    if (!formData.payment_type) {
      errors.payment_type = $t('payments.error.select_type');
    }

    if (formData.payment_type === 'student' && !formData.student_id) {
      errors.student_id = $t('payments.error.select_student');
    }

    if (formData.payment_type === 'school' && !formData.school_id) {
      errors.school_id = $t('payments.error.select_school');
    }

    if (formData.amount !== null && formData.amount <= 0) {
      errors.amount = $t('payments.error.amount_positive');
    }

    if (formData.period_start && formData.period_end) {
      if (new Date(formData.period_start) >= new Date(formData.period_end)) {
        errors.period_start = $t('payments.error.date_sequence');
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
      const payload = {
        ...formData,
        amount: Number(formData.amount) || 0,
        student_id: formData.payment_type === 'student' ? formData.student_id : undefined,
        school_id: formData.payment_type === 'school' ? formData.school_id : undefined
      };

      await appStore.addPayment(payload);

      goto('/panel/payments?created=true');
    } catch (error) {
      console.error('Error creating payment:', error);
      errors.submit = error instanceof Error ? error.message : 'Unknown error';
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

   const paymentConcepts = [
    { id: 'monthly_fee', label: 'payments.monthly_fee', icon: Tag },
    { id: 'registration', label: 'payments.registration', icon: IdentificationBadge },
    { id: 'tournament', label: 'payments.tournament', icon: Trophy },
    { id: 'material', label: 'payments.material', icon: BookOpen },
    { id: 'private_lesson', label: 'payments.private_lesson', icon: UserIcon },
    { id: 'other', label: 'payments.other', icon: DotsThreeOutline }
  ];
 
  const getConceptLabel = (c: string) => {
    const key = paymentConcepts.find(pc => pc.id === c)?.label;
    return key ? $t(key) : c;
  };

  let activeSection = $state('entity');
</script>

 <svelte:head>
  <title>{$t('payments.issue_receipt')} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-[#09090b] p-4 lg:p-8 font-outfit">
  <div class="max-w-[1400px] mx-auto">
    
    <!-- Premium Top Bar -->
    <header class="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 mb-12">
      <div class="max-w-[1400px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button 
            onclick={handleGoBack}
            class="w-10 h-10 rounded-none bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft weight="bold" class="w-5 h-5" />
          </button>
          <div>
            <div class="flex items-center gap-2 mb-0.5">
              <h1 class="text-lg font-black uppercase tracking-widest italic flex items-center gap-2">
                 <Receipt weight="bold" class="w-4 h-4 text-violet-500" />
                {$t('payments.issue_receipt')}
              </h1>
            </div>
            <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{$t('payments.payments_finance')}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button 
            onclick={handleGoBack}
            class="px-5 py-2.5 rounded-none text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
          >
             {$t('payments.discard')}
          </button>
          <button 
            onclick={handleSubmit}
            disabled={isSubmitting}
            class="px-8 py-2.5 rounded-none bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-0.5 transition-all text-xs font-black tracking-widest uppercase flex items-center gap-2 disabled:opacity-50"
          >
            {#if isSubmitting}
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin"></div>
            {:else}
              <CheckCircle weight="bold" class="w-4 h-4" />
            {/if}
            {isSubmitting ? $t('payments.processing') : $t('payments.finish_issuance')}
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Left Column: Sectioned Form -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Section 1: Entity -->
        <div class="bento-card p-8">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-none bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <UserIcon weight="duotone" class="w-5 h-5 text-blue-400" />
            </div>
             <div>
              <h3 class="text-sm font-black uppercase tracking-widest italic text-white">{$t('payments.recipient')}</h3>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{$t('payments.recipient_desc')}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-10">
            <button 
              onclick={() => { formData.payment_type = 'student'; handlePaymentTypeChange(); }}
              class="selection-card {formData.payment_type === 'student' ? 'active' : ''}"
            >
              <div class="selection-card-content flex flex-col items-center py-6">
                 <Users weight={formData.payment_type === 'student' ? 'fill' : 'duotone'} class="w-10 h-10 mb-4 {formData.payment_type === 'student' ? 'text-violet-400' : 'text-zinc-500'}" />
                <span class="text-xs font-black uppercase tracking-widest">{$t('payments.student')}</span>
                {#if formData.payment_type === 'student'}
                  <div class="selection-card-check">
                    <CheckCircle weight="bold" class="w-4 h-4" />
                  </div>
                {/if}
              </div>
            </button>
            <button 
              onclick={() => { formData.payment_type = 'school'; handlePaymentTypeChange(); }}
              class="selection-card {formData.payment_type === 'school' ? 'active' : ''}"
            >
              <div class="selection-card-content flex flex-col items-center py-6">
                 <Buildings weight={formData.payment_type === 'school' ? 'fill' : 'duotone'} class="w-10 h-10 mb-4 {formData.payment_type === 'school' ? 'text-violet-400' : 'text-zinc-500'}" />
                <span class="text-xs font-black uppercase tracking-widest">{$t('payments.school')}</span>
                {#if formData.payment_type === 'school'}
                  <div class="selection-card-check">
                    <CheckCircle weight="bold" class="w-4 h-4" />
                  </div>
                {/if}
              </div>
            </button>
          </div>

          {#if formData.payment_type === 'student'}
             <div class="space-y-4">
              <label for="student_id_select" class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">{$t('payments.search_select_student')}</label>
              <div class="relative group">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none z-10">
                  <Student weight="bold" class="w-5 h-5" />
                </div>
                <select 
                  id="student_id_select"
                  bind:value={formData.student_id}
                  class="glass-input pl-12 h-14"
                >
                   <option value="">{$t('payments.select_student_placeholder')}</option>
                  {#each students as student}
                    <option value={student.id}>{student.name}</option>
                  {/each}
                </select>
              </div>
              {#if errors.student_id}
                <p class="text-rose-400 text-[10px] font-bold uppercase flex items-center gap-1.5 ml-1">
                  <WarningCircle weight="fill" class="w-3.5 h-3.5" /> {errors.student_id}
                </p>
              {/if}
            </div>
          {:else}
             <div class="space-y-4">
              <label for="school_id_select" class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">{$t('payments.search_select_school')}</label>
              <div class="relative group">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none z-10">
                  <Buildings weight="bold" class="w-5 h-5" />
                </div>
                <select 
                  id="school_id_select"
                  bind:value={formData.school_id}
                  class="glass-input pl-12 h-14"
                >
                   <option value="">{$t('payments.select_school_placeholder')}</option>
                  {#each schools as school}
                    <option value={school.id}>{school.name}</option>
                  {/each}
                </select>
              </div>
              {#if errors.school_id}
                <p class="text-rose-400 text-[10px] font-bold uppercase flex items-center gap-1.5 ml-1">
                  <WarningCircle weight="fill" class="w-3.5 h-3.5" /> {errors.school_id}
                </p>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Section 2: Payment Configuration -->
        <div class="bento-card p-8 group">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-none bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Tag weight="duotone" class="w-5 h-5 text-violet-400" />
            </div>
             <div>
              <h3 class="text-sm font-black uppercase tracking-widest italic text-white">{$t('payments.concept_amount')}</h3>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{$t('payments.concept_amount_desc')}</p>
            </div>
          </div>

          <div class="space-y-8">
            <!-- Concept Selection Grid -->
             <div class="space-y-4">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">{$t('payments.main_concept')}</span>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                {#each paymentConcepts as concept}
                  <button 
                    onclick={() => formData.concept = concept.id as PaymentConcept}
                    class="selection-card small {formData.concept === concept.id ? 'active' : ''}"
                  >
                    <div class="selection-card-content flex items-center gap-3 p-3">
                       <concept.icon weight={formData.concept === concept.id ? 'fill' : 'duotone'} class="w-5 h-5 {formData.concept === concept.id ? 'text-violet-400' : 'text-zinc-500'}" />
                      <span class="text-[10px] font-black uppercase tracking-wider">{$t(concept.label)}</span>
                      {#if formData.concept === concept.id}
                        <div class="selection-card-check">
                          <CheckCircle weight="bold" class="w-3 h-3" />
                        </div>
                      {/if}
                    </div>
                  </button>
                {/each}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div class="space-y-2">
                <label for="amount" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{$t('payments.payment_amount')}</label>
                <div class="relative group">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none z-10">
                    <CurrencyEur weight="bold" class="w-5 h-5" />
                  </div>
                  <input 
                    id="amount"
                    type="number" 
                    bind:value={formData.amount}
                    placeholder="0.00"
                    class="glass-input pl-12 h-14"
                  />
                  {#if errors.amount}
                    <p class="text-rose-400 text-[10px] font-bold uppercase flex items-center gap-1.5 mt-2 ml-1">
                      <WarningCircle weight="fill" class="w-3.5 h-3.5" /> {errors.amount}
                    </p>
                  {/if}
                </div>
              </div>

               <div class="space-y-2">
                <label for="due_date" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{$t('payments.due_date')}</label>
                <div class="relative group">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors pointer-events-none z-10">
                    <Clock weight="bold" class="w-5 h-5" />
                  </div>
                  <input 
                    id="due_date"
                    type="date" 
                    bind:value={formData.due_date}
                    class="glass-input pl-12 h-14 w-full"
                  />
                </div>
              </div>
            </div>

            <!-- Class Selection (Optional) -->
             <div class="space-y-4">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">{$t('payments.associated_class')}</span>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  onclick={() => formData.class_id = ''}
                  class="selection-card small {formData.class_id === '' ? 'active' : ''}"
                >
                  <div class="selection-card-content flex items-center gap-3 p-3">
                     <Info weight={formData.class_id === '' ? 'fill' : 'duotone'} class="w-5 h-5 {formData.class_id === '' ? 'text-violet-400' : 'text-zinc-500'}" />
                    <span class="text-[10px] font-black uppercase tracking-wider">{$t('payments.no_class_associated')}</span>
                    {#if formData.class_id === ''}
                      <div class="selection-card-check">
                        <CheckCircle weight="bold" class="w-3 h-3" />
                      </div>
                    {/if}
                  </div>
                </button>
                {#each filteredClasses.slice(0, 5) as cls}
                  <button 
                    onclick={() => formData.class_id = cls.id}
                    class="selection-card small {formData.class_id === cls.id ? 'active' : ''}"
                  >
                    <div class="selection-card-content flex items-center gap-3 p-3">
                      <IdentificationBadge weight={formData.class_id === cls.id ? 'fill' : 'duotone'} class="w-5 h-5 {formData.class_id === cls.id ? 'text-violet-400' : 'text-zinc-500'}" />
                      <span class="text-[10px] font-black uppercase tracking-wider truncate">{cls.name}</span>
                      {#if formData.class_id === cls.id}
                        <div class="selection-card-check">
                          <CheckCircle weight="bold" class="w-3 h-3" />
                        </div>
                      {/if}
                    </div>
                  </button>
                {/each}
              </div>
            </div>

             <div class="space-y-2">
              <label for="description" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{$t('payments.receipt_description')}</label>
              <textarea 
                id="description"
                bind:value={formData.description}
                rows="2"
                class="glass-input h-auto min-h-[100px] py-4 resize-none"
                placeholder={$t('payments.description_placeholder')}
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Section 3: Period & Method -->
        <div class="bento-card p-8">
           <div class="flex items-center gap-4 mb-8">
            <div class="w-10 h-10 rounded-none bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <CalendarBlank weight="duotone" class="w-5 h-5 text-amber-400" />
            </div>
             <div>
              <h3 class="text-sm font-black uppercase tracking-widest italic text-white">{$t('payments.period_method')}</h3>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{$t('payments.period_method_desc')}</p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
               <div class="space-y-2">
                <label for="period_start" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{$t('payments.from')}</label>
                <input id="period_start" type="date" bind:value={formData.period_start} class="glass-input h-14" />
              </div>
               <div class="space-y-2">
                <label for="period_end" class="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{$t('payments.to')}</label>
                <input id="period_end" type="date" bind:value={formData.period_end} class="glass-input h-14" />
              </div>
            </div>

            <!-- Payment Method Selection -->
             <div class="space-y-4">
              <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">{$t('payments.payment_method')}</span>
              <div class="grid grid-cols-2 gap-3">
                {#each paymentMethods as method}
                  <button 
                    onclick={() => formData.payment_method = method.id}
                    class="selection-card small {formData.payment_method === method.id ? 'active' : ''}"
                  >
                    <div class="selection-card-content flex items-center gap-3 p-3">
                       <method.icon weight={formData.payment_method === method.id ? 'fill' : 'duotone'} class="w-5 h-5 {formData.payment_method === method.id ? 'text-violet-400' : 'text-zinc-500'}" />
                      <span class="text-[10px] font-black uppercase tracking-wider">{$t(method.label)}</span>
                      {#if formData.payment_method === method.id}
                        <div class="selection-card-check">
                          <CheckCircle weight="bold" class="w-3 h-3" />
                        </div>
                      {/if}
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Live Receipt Preview -->
      <div class="lg:col-span-5 relative">
        <div class="sticky top-8 space-y-6">
          
           <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-black text-zinc-500 uppercase tracking-widest">{$t('payments.receipt_preview')}</h3>
            <div class="flex gap-1">
              <div class="w-2 h-2 rounded-none bg-violet-500 pulse"></div>
              <span class="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">{$t('payments.live')}</span>
            </div>
          </div>

          <!-- The Receipt Card -->
          <div class="bg-white rounded-none p-8 shadow-2xl shadow-black/80 text-zinc-900 overflow-hidden relative group">
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
                  <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Chess Academy</p>
                </div>
                 <div class="text-right">
                  <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{$t('payments.total_to_pay')}</div>
                  <div class="text-3xl font-black tracking-tight">{formatCurrency(formData.amount)}</div>
                </div>
              </div>

              <!-- Main Info Grid -->
              <div class="grid grid-cols-2 gap-8 mb-12">
                 <div>
                  <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">{$t('payments.issued_to')}</div>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-none bg-zinc-100 flex items-center justify-center">
                      {#if formData.payment_type === 'student'}
                        <UserIcon weight="fill" class="w-5 h-5 text-zinc-400" />
                      {:else}
                        <Buildings weight="fill" class="w-5 h-5 text-zinc-400" />
                      {/if}
                    </div>
                    <div>
                      <p class="text-sm font-black text-black leading-tight italic">
                        {selectedStudent?.name || selectedSchool?.name || $t('payments.undefined_client')}
                      </p>
                       <p class="text-[10px] font-bold text-zinc-500 uppercase italic">
                        {formData.payment_type === 'student' ? $t('payments.student') : $t('payments.entity')}
                      </p>
                    </div>
                  </div>
                </div>

                 <div class="text-right">
                  <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">{$t('payments.issue_date')}</div>
                  <p class="text-sm font-black text-black italic">
                    {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <!-- Line Items -->
               <div class="space-y-4 mb-12">
                <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{$t('payments.receipt_concepts')}</div>
                <div class="bg-zinc-50 rounded-none p-6 border border-zinc-100">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-black text-black italic uppercase">{getConceptLabel(formData.concept)}</p>
                      <p class="text-[10px] font-bold text-zinc-500 mt-1 max-w-[200px]">
                        {formData.description || $t('payments.no_description')}
                      </p>
                      {#if selectedClass}
                         <div class="mt-3 flex items-center gap-1.5">
                            <IdentificationBadge class="w-3.5 h-3.5 text-violet-500" />
                            <span class="text-[10px] font-black text-violet-600 uppercase italic">{$t('common.class')}: {selectedClass.name}</span>
                         </div>
                      {/if}
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-black text-black italic">{formatCurrency(formData.amount)}</p>
                        <p class="text-[9px] font-bold text-zinc-400 uppercase mt-1">{$t('payments.inc_vat')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Details -->
              <div class="grid grid-cols-2 gap-4 pt-8 border-t-2 border-dashed border-zinc-200">
                 <div>
                  <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">{$t('payments.due_date')}</div>
                  <p class="text-xs font-black text-black italic">
                    {formData.due_date ? formatDate(formData.due_date) : $t('payments.upon_receipt')}
                  </p>
                </div>
                 <div class="text-right">
                    <div class="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">{$t('payments.reference_no')}</div>
                    <p class="text-xs font-black text-black italic">TEMP-{Math.floor(Math.random() * 90000) + 10000}</p>
                </div>
              </div>

              <!-- Bottom Bar -->
              <div class="mt-8 flex justify-center">
                <div class="flex flex-col items-center">
                   <div class="w-32 h-1 bg-zinc-900/5 rounded-none mb-4"></div>
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
                <div class="w-12 h-12 rounded-none bg-zinc-900 flex items-center justify-center">
                   <Calculator weight="duotone" class="w-6 h-6 text-zinc-400" />
                </div>
                 <div>
                   <h4 class="text-white text-sm font-bold">{$t('payments.monthly_projection')}</h4>
                   <p class="text-[10px] text-zinc-500">{$t('payments.projection_desc')}</p>
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


  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2352525b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1.5rem;
  }
</style>

