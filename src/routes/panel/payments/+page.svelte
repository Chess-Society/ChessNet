<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount, getContext } from 'svelte';
  import { 
    CurrencyEur, 
    Plus, 
    MagnifyingGlass, 
    Funnel, 
    CalendarBlank,
    Users,
    ArrowUpRight,
    ArrowDownLeft,
    CaretRight,
    TrendUp,
    CreditCard,
    X,
    Receipt,
    Wallet,
    ArrowClockwise,
    IdentificationCard,
    ArrowsLeftRight,
    FileText,
    CheckCircle,
    Trash,
    DotsThreeVertical,
    FileArrowDown,
    User,
    Buildings,
    Eye,
    PencilSimple
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { user as authUser } from '$lib/stores/auth';
  import { ADMIN_EMAILS } from '$lib/constants';
  import { toast, showError } from '$lib/stores/toast';
  import { goto } from '$app/navigation';
  import { fade, fly, scale } from 'svelte/transition';

  // Auth & Access Control
  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.email && ADMIN_EMAILS.includes($authUser.email.toLowerCase()));

  onMount(() => {
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
    }
  });

  let searchQuery = $state('');
  
  // Reactive data using Runes
  let payments = $derived($appStore.payments || []);
  let students = $derived($appStore.students || []);
  let schools = $derived($appStore.schools || []);

  const getEntityName = (id: string, type: 'student' | 'school' = 'student') => {
    if (type === 'school') {
      const school = schools.find(s => s.id === id);
      return school?.name || $t('common.unknown');
    }
    const student = students.find(s => s.id === id);
    return student?.name || $t('payments.unknown_student');
  };


  // Financial metrics
  const metrics = $derived.by(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTotal = payments
      .filter(p => {
        const d = new Date(p.paid_date || p.created_at || '');
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && p.status === 'paid';
      })
      .reduce((acc, p) => acc + (p.amount || 0), 0);

    const prevMonthTotal = payments
      .filter(p => {
        const d = new Date(p.paid_date || p.created_at || '');
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        return d.getMonth() === prevMonthDate.getMonth() && d.getFullYear() === prevMonthDate.getFullYear() && p.status === 'paid';
      })
      .reduce((acc, p) => acc + (p.amount || 0), 0);

    const growth = prevMonthTotal > 0 ? ((monthlyTotal - prevMonthTotal) / prevMonthTotal) * 100 : 
                  (monthlyTotal > 0 ? 100 : 0);
    
    // Portfolio health calculation (Paid vs Pending/Overdue)
    const pendingAmount = payments
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((acc, p) => acc + (p.amount || 0), 0);
    
    const totalAmount = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const health = totalAmount > 0 ? ((totalAmount - pendingAmount) / totalAmount) * 100 : 100;

    return { 
      monthlyTotal, 
      prevMonthTotal, 
      growth: growth.toFixed(1),
      totalCount: payments.length,
      averageTicket: payments.filter(p => p.status === 'paid').length > 0 
        ? (payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + (p.amount || 0), 0) / payments.filter(p => p.status === 'paid').length).toFixed(2) 
        : 0,
      portfolioHealth: health.toFixed(0),
      isHealthy: health >= 90
    };
  });

  // Filtering state
  let activeFilter = $state('all'); 
  
  const filteredPayments = $derived(
    payments
      .filter(p => {
        const studentName = getEntityName(p.student_id || '', p.payment_type || 'student').toLowerCase();
        const concept = (p.concept || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        
        const matchesSearch = studentName.includes(query) || concept.includes(query);
        const matchesFilter = activeFilter === 'all' || p.concept === activeFilter;
        
        return matchesSearch && matchesFilter;
      })
      .sort((a,b) => (b.paid_date || b.created_at || '').localeCompare(a.paid_date || a.created_at || ''))
  );

  // Modal & Actions state
  let showModal = $state(false);
  let editMode = $state(false);
  let isDeleting = $state<string | null>(null);

  let newPayment = $state({
    id: '',
    student_id: '',
    amount: 0,
    paid_date: new Date().toISOString().split('T')[0],
    concept: 'monthly_fee' as any,
    status: 'paid' as any,
    payment_type: 'student' as 'student' | 'school'
  });

  const resetForm = () => {
    newPayment = { 
      id: '',
      student_id: '', 
      amount: 0, 
      paid_date: new Date().toISOString().split('T')[0], 
      concept: 'monthly_fee' as any, 
      status: 'paid' as any,
      payment_type: 'student'
    };
    editMode = false;
  };

  const addPayment = async () => {
    if (!newPayment.student_id || newPayment.amount <= 0) return;
    
    try {
      if (editMode && newPayment.id) {
        await appStore.updatePayment(newPayment);
        toast.success($t('payments.update_success'));
      } else {
        const { id, ...data } = newPayment;
        await appStore.addPayment(data);
        toast.success($t('payments.add_success'));
      }
      showModal = false;
      resetForm();
    } catch (err: any) {
      console.error('Error in payment action:', err);
      showError(err, $t('payments.error_action'));
    }
  };

  const openEdit = (payment: any) => {
    newPayment = { ...payment };
    editMode = true;
    showModal = true;
  };

  const deletePayment = async (id: string) => {
    if (!confirm($t('payments.confirm_delete'))) return;
    isDeleting = id;
    try {
      await appStore.removePayment(id);
      toast.success($t('payments.delete_success'));
    } catch (err: any) {
      console.error('Error deleting payment:', err);
      showError(err, $t('payments.error_delete'));
    } finally {
      isDeleting = null;
    }
  };

  const exportToCSV = () => {
    const headers = [
      $t('payments.student'),
      $t('payments.concept'),
      $t('payments.date'),
      $t('payments.amount')
    ];
    const rows = filteredPayments.map(p => [
      getEntityName(p.student_id, p.payment_type),
      $t(`payments.concepts.${p.concept}`) || p.concept,
      p.paid_date,
      p.amount
    ]);
    
    const content = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contabilidad_chessnet_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  // Receipt logic
  let selectedPayment = $state<any>(null);
  let showReceipt = $state(false);

  const openReceipt = (payment: any) => {
    selectedPayment = payment;
    showReceipt = true;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

</script>

<svelte:head>
  <title>ChessNet Premium Ledger</title>
</svelte:head>

<div class="page-container" in:fade>
  
  <!-- Backglow Decor -->
  <div class="glow-bg"></div>

  <!-- Header Section -->
  <header class="page-header">
    <div class="header-content">
      <div class="title-group">
        <div class="icon-box">
          <Wallet size={32} weight="duotone" />
          <div class="icon-pulse"></div>
        </div>
        <div>
          <h1 class="font-outfit">{$t('actions.payments.title')}</h1>
          <p class="font-jakarta text-slate-400">{$t('actions.payments.desc')}</p>
        </div>
      </div>

      <div class="action-group">
        <button class="btn-secondary transition-all" onclick={exportToCSV}>
          <FileArrowDown size={20} weight="bold" />
          <span class="desktop-only text-xs font-black uppercase tracking-widest">{$t('payments.export_csv')}</span>
        </button>
        <button class="btn-primary" onclick={() => { resetForm(); showModal = true; }}>
          <Plus size={20} weight="bold" />
          {$t('payments.new_payment')}
        </button>
      </div>
    </div>
  </header>

  <!-- Metrics Dashboard -->
  <section class="metrics-grid">
    <div class="metric-card revenue">
       <div class="metric-info">
          <p class="label">{$t('payments.revenue_month')}</p>
          <div class="value-row">
            <span class="value">{metrics.monthlyTotal}</span>
            <span class="curr">{$t('common.currency')}</span>
          </div>
          <div class="trend" class:positive={parseFloat(metrics.growth) >= 0}>
            {#if parseFloat(metrics.growth) >= 0}
              <ArrowUpRight size={14} />
            {:else}
              <ArrowDownLeft size={14} />
            {/if}
            {Math.abs(parseFloat(metrics.growth))}%
            <span class="text-slate-500 ml-1 lowercase">{$t('payments.last_month')}</span>
          </div>
       </div>
       <div class="metric-visual">
          <TrendUp size={80} weight="duotone" />
       </div>
    </div>

    <div class="metric-card ticket">
       <div class="metric-info">
          <p class="label">{$t('payments.avg_ticket')}</p>
          <div class="value-row">
            <span class="value">{metrics.averageTicket}</span>
            <span class="curr">{$t('common.currency')}</span>
          </div>
          <p class="sublabel">Basado en {metrics.totalCount} transacciones</p>
       </div>
       <div class="metric-visual">
          <Receipt size={80} weight="duotone" />
       </div>
    </div>

    <div class="metric-card portfolio" class:unhealthy={!metrics.isHealthy}>
       <div class="metric-info">
          <p class="label">{$t('payments.portfolio_status')}</p>
          <div class="value-row">
            <span class="value">{metrics.portfolioHealth}</span>
            <span class="curr">%</span>
          </div>
          <div class="status-indicator" class:warning={!metrics.isHealthy}>
            <div class="dot pulse"></div>
            <span>{metrics.isHealthy ? $t('payments.healthy_status') : $t('payments.unhealthy_status')}</span>
          </div>
       </div>
       <div class="metric-visual">
          <CheckCircle size={80} weight="duotone" />
       </div>
    </div>

    <div class="metric-card premium">
        <div class="premium-badge">{plan.toUpperCase()}</div>
        <div class="metric-info">
          <p class="label">{$t('payments.service_status') || 'ESTADO DEL SERVICIO'}</p>
          <div class="value-row">
            <span class="value text-2xl uppercase tracking-tighter">
              {plan === 'premium' ? 'ChessNet Pro' : (plan === 'free' ? 'Plan Gratuito' : plan)}
            </span>
          </div>
          <p class="sublabel flex items-center gap-2">
            <CalendarBlank size={14} />
            {$t('payments.active_subscription')}
          </p>
        </div>
        <div class="metric-visual">
            <CurrencyEur size={40} weight="bold" />
        </div>
    </div>
  </section>

  <!-- Main Content: Premium Ledger -->
  <main class="ledger-container">
    
    <div class="ledger-toolbar">
      <div class="search-box">
        <MagnifyingGlass size={20} />
        <input 
          type="text" 
          placeholder={$t('payments.filter_placeholder')} 
          bind:value={searchQuery}
        />
      </div>
      
      <div class="ledger-filters hide-mobile">
        <button 
          class="filter-btn" 
          class:active={activeFilter === 'all'} 
          onclick={() => activeFilter = 'all'}
        >
          {$t('common.all') || 'Todos'}
        </button>
        <button 
          class="filter-btn" 
          class:active={activeFilter === 'tournament'}
          onclick={() => activeFilter = 'tournament'}
        >
          {$t('payments.concepts.tournament')}
        </button>
        <button 
          class="filter-btn" 
          class:active={activeFilter === 'registration'} 
          onclick={() => activeFilter = 'registration'}
        >
          {$t('payments.concepts.registration')}
        </button>
        <button 
          class="filter-btn" 
          class:active={activeFilter === 'monthly_fee'} 
          onclick={() => activeFilter = 'monthly_fee'}
        >
          {$t('payments.concepts.monthly_fee')}
        </button>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="ledger-table">
        <thead>
          <tr>
            <th class="pl-10">{$t('payments.client_entity')}</th>
            <th>{$t('payments.reference_concept')}</th>
            <th>{$t('payments.accounting_date')}</th>
            <th class="text-right">{$t('payments.amount')}</th>
            <th class="w-20 pr-10"></th>
          </tr>
        </thead>
        <tbody>
          {#if filteredPayments.length === 0}
            <tr>
              <td colspan="5" class="empty-state">
                <div class="empty-content">
                  <Receipt size={64} weight="thin" class="opacity-20 translate-y-2" />
                  <p class="font-outfit text-xl font-bold tracking-tight">{$t('common.no_results')}</p>
                  <span class="text-slate-500 font-jakarta text-sm">{$t('payments.no_results_query')}</span>
                </div>
              </td>
            </tr>
          {:else}
            {#each filteredPayments as p (p.id)}
              <tr class="ledger-row group" in:fly={{ y: 10, duration: 400 }}>
                <td class="pl-10">
                  <div class="student-cell">
                    <div class="avatar shadow-inner">
                      {getEntityName(p.student_id, p.payment_type)[0].toUpperCase()}
                    </div>
                    <div class="info">
                      <span class="name">{getEntityName(p.student_id, p.payment_type)}</span>
                      <span class="id">ID: #{p.student_id?.slice(-5).toUpperCase()}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="concept-cell">
                    <span class="concept">
                      {$t(`payments.concepts.${p.concept}`) || p.concept}
                    </span>
                    <span class="category">{$t(`payments.type_${p.payment_type || 'student'}`)}</span>
                  </div>
                </td>
                <td>
                  <div class="date-cell">
                    <CalendarBlank size={14} weight="duotone" class="text-violet-400" />
                    <span>{new Date(p.paid_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                </td>
                <td class="text-right">
                  <div class="amount-cell">
                    <span class="amount">{p.amount}{$t('common.currency')}</span>
                    <span class="status-pill" class:success={p.status === 'paid'} class:warning={p.status === 'pending' || p.status === 'overdue'}>
                      {$t(`payments.status_${p.status}`).toUpperCase()}
                    </span>
                  </div>
                </td>
                <td class="pr-10">
                  <div class="row-actions">
                    <button 
                      class="view-btn" 
                      onclick={() => openReceipt(p)}
                      title={$t('payments.view_receipt')}
                    >
                      <Eye size={18} weight="duotone" />
                    </button>
                    <button 
                      class="edit-btn" 
                      onclick={() => openEdit(p)}
                      title={$t('payments.edit_record')}
                    >
                      <PencilSimple size={18} weight="duotone" />
                    </button>
                    <button 
                      class="delete-btn" 
                      onclick={() => deletePayment(p.id)}
                      disabled={isDeleting === p.id}
                      title={$t('payments.delete_record')}
                    >
                      {#if isDeleting === p.id}
                        <ArrowClockwise size={18} class="animate-spin" />
                      {:else}
                        <Trash size={18} weight="duotone" />
                      {/if}
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </main>

  <!-- Modal Nuveo Pago -->
  {#if showModal}
    <div class="modal-overlay" transition:fade onclick={() => showModal = false}>
      <div class="modal-card" transition:scale={{ start: 0.9, duration: 400 }} onclick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <div class="modal-title">
            <div class="modal-icon">
              {#if editMode}
                <PencilSimple size={24} weight="bold" />
              {:else}
                <Plus size={24} weight="bold" />
              {/if}
            </div>
            <div>
              <h3 class="font-outfit uppercase tracking-tighter text-2xl">
                {editMode ? $t('common.edit') + ' ' + $t('actions.payments.title') : $t('payments.new_payment')}
              </h3>
              <p class="font-jakarta opacity-50 text-xs uppercase tracking-widest font-bold">
                {editMode ? 'Modifica los detalles del registro contable' : $t('payments.modal_description')}
              </p>
            </div>
          </div>
          <button class="close-btn" onclick={() => showModal = false}>
             <X size={20} weight="bold" />
          </button>
        </div>

        <form class="modal-form" onsubmit={(e) => { e.preventDefault(); addPayment(); }}>
          
          <!-- Payment Type Selector -->
          <div class="form-group">
            <label>{$t('payments.payment_type')}</label>
            <div class="type-selector shadow-inner">
               <button 
                type="button" 
                class="type-btn" 
                class:active={newPayment.payment_type === 'student'} 
                onclick={() => { if (newPayment.payment_type !== 'student') { newPayment.payment_type = 'student'; newPayment.student_id = ''; } }}
               >
                 <User size={16} weight={newPayment.payment_type === 'student' ? 'fill' : 'regular'} />
                 {$t('payments.type_student')}
               </button>
               <button 
                type="button" 
                class="type-btn" 
                class:active={newPayment.payment_type === 'school'} 
                onclick={() => { if (newPayment.payment_type !== 'school') { newPayment.payment_type = 'school'; newPayment.student_id = ''; } }}
               >
                 <Buildings size={16} weight={newPayment.payment_type === 'school' ? 'fill' : 'regular'} />
                 {$t('payments.type_school')}
               </button>
            </div>
          </div>

          <!-- Entity Selection -->
          <div class="form-group">
            <label for="entity">
              {newPayment.payment_type === 'school' ? $t('actions.schools.title') : $t('payments.student')}
            </label>
            <div class="select-wrapper">
              {#if newPayment.payment_type === 'school'}
                <Buildings size={20} />
              {:else}
                <Users size={20} />
              {/if}
              <select bind:value={newPayment.student_id} required id="entity" class="font-jakarta">
                <option value="" disabled selected>{$t('payments.choose_student')}</option>
                {#if newPayment.payment_type === 'school'}
                  {#each schools as school}
                    <option value={school.id}>{school.name}</option>
                  {/each}
                {:else}
                  {#each students as student}
                    <option value={student.id}>{student.name}</option>
                  {/each}
                {/if}
              </select>
              <CaretRight size={16} />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label for="amount">{$t('payments.amount')} ({$t('common.currency')})</label>
              <div class="input-wrapper">
                <CurrencyEur size={20} />
                <input type="number" step="0.01" bind:value={newPayment.amount} required id="amount" placeholder="0.00" class="font-outfit" />
              </div>
            </div>
            <div class="form-group flex-1">
              <label for="date">{$t('payments.paid_date_label')}</label>
              <div class="input-wrapper no-icon">
                <input type="date" bind:value={newPayment.paid_date} required id="date" class="font-outfit" />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="concept">{$t('payments.reference_concept')}</label>
            <div class="select-wrapper">
              <FileText size={20} />
              <select bind:value={newPayment.concept} required id="concept" class="font-jakarta">
                <option value="monthly_fee">{$t('payments.concepts.monthly_fee')}</option>
                <option value="registration">{$t('payments.concepts.registration')}</option>
                <option value="tournament">{$t('payments.concepts.tournament')}</option>
                <option value="material">{$t('payments.concepts.material')}</option>
                <option value="private_lesson">{$t('payments.concepts.private_lesson')}</option>
                <option value="other">{$t('payments.concepts.other')}</option>
              </select>
              <CaretRight size={16} />
            </div>
          </div>

          <div class="form-group">
            <label for="status">{$t('common.status_completed')}</label>
            <div class="select-wrapper">
              <CheckCircle size={20} />
              <select bind:value={newPayment.status} required id="status" class="font-jakarta">
                <option value="paid">{$t('payments.status_paid')}</option>
                <option value="pending">{$t('payments.status_pending')}</option>
                <option value="overdue">{$t('payments.status_overdue')}</option>
              </select>
              <CaretRight size={16} />
            </div>
          </div>

          <div class="form-actions lg:pt-4">
            <button type="button" class="btn-ghost-alt" onclick={() => { showModal = false; resetForm(); }}>{$t('common.back')}</button>
            <button type="submit" class="btn-submit shadow-violet-flare">
              {editMode ? $t('common.save_changes') : $t('payments.execute_registration')}
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Modal Recibo Premium -->
  {#if showReceipt && selectedPayment}
    <div class="modal-overlay" transition:fade onclick={() => showReceipt = false}>
      <div class="receipt-modal-card" transition:scale={{ start: 0.9, duration: 400 }} onclick={(e) => e.stopPropagation()}>
        <button class="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all" onclick={() => showReceipt = false}>
           <X size={20} weight="bold" class="text-zinc-400 group-hover:text-black" />
        </button>

        <div class="receipt-container">
           <!-- The Receipt Design (Reused from Create Page) -->
           <div class="bg-white rounded-3xl p-10 text-zinc-900 overflow-hidden relative shadow-2xl">
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
                <div class="flex justify-between items-start border-b-2 border-zinc-100 pb-10 mb-10">
                  <div>
                    <h2 class="text-3xl font-black tracking-tighter text-black">ChessNet</h2>
                    <p class="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Chess Academy & Management Systems</p>
                  </div>
                  <div class="text-right">
                    <div class="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1">{$t('payments.receipt.total_paid')}</div>
                    <div class="text-4xl font-black tracking-tight">{formatCurrency(selectedPayment.amount)}</div>
                  </div>
                </div>

                <!-- Main Info Grid -->
                <div class="grid grid-cols-2 gap-10 mb-14">
                  <div>
                    <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">{$t('payments.receipt.issued_to')}</div>
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                        {#if selectedPayment.payment_type === 'student'}
                          <User weight="fill" class="w-6 h-6 text-zinc-400" />
                        {:else}
                          <Buildings weight="fill" class="w-6 h-6 text-zinc-400" />
                        {/if}
                      </div>
                      <div>
                        <p class="text-lg font-black text-black leading-tight italic uppercase">
                          {getEntityName(selectedPayment.student_id, selectedPayment.payment_type)}
                        </p>
                        <p class="text-[11px] font-bold text-zinc-500 uppercase italic">
                          {selectedPayment.payment_type === 'student' ? $t('payments.category_student') : $t('payments.category_school')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="text-right">
                    <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">{$t('payments.receipt.issue_date')}</div>
                    <p class="text-lg font-black text-black italic">
                      {new Date(selectedPayment.paid_date || selectedPayment.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p class="text-[10px] font-bold text-emerald-500 uppercase mt-1">✓ {$t('payments.receipt.verified')}</p>
                  </div>
                </div>

                <!-- Line Items -->
                <div class="space-y-5 mb-14">
                  <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{$t('payments.receipt.concept_details')}</div>
                  <div class="bg-zinc-50 rounded-2xl p-8 border border-zinc-100">
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="text-lg font-black text-black italic uppercase">
                          {$t(`payments.concepts.${selectedPayment.concept}`) || selectedPayment.concept}
                        </p>
                        <p class="text-xs font-bold text-zinc-500 mt-2 max-w-[300px] leading-relaxed">
                          {$t('payments.receipt.confirmation_text')}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="text-xl font-black text-black italic">{formatCurrency(selectedPayment.amount)}</p>
                        <p class="text-[10px] font-bold text-zinc-400 uppercase mt-2">{$t('payments.receipt.tax_included')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Details -->
                <div class="grid grid-cols-2 gap-6 pt-10 border-t-2 border-dashed border-zinc-200">
                  <div>
                    <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 italic">{$t('payments.receipt.payment_method')}</div>
                    <p class="text-sm font-black text-black italic">
                      {selectedPayment.payment_method || $t('payments.method_transfer')}
                    </p>
                  </div>
                  <div class="text-right">
                      <div class="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 italic">{$t('payments.receipt.ref_id')}</div>
                      <p class="text-sm font-black text-black italic font-mono">
                        {selectedPayment.id?.slice(-12).toUpperCase()}
                      </p>
                  </div>
                </div>

                <!-- Bottom Bar -->
                <div class="mt-12 flex justify-center">
                  <div class="flex flex-col items-center">
                     <div class="w-48 h-1 bg-zinc-900/5 rounded-full mb-6"></div>
                     <p class="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">{$t('payments.receipt.footer')}</p>
                  </div>
                </div>
              </div>

              <!-- Scissors Cut Line (Effect) -->
              <div class="absolute -bottom-6 left-0 right-0 h-1 border-t-2 border-dashed border-zinc-200"></div>
           </div>

           <div class="mt-8 flex justify-center gap-4">
              <button class="px-8 py-3 bg-zinc-900 border border-white/10 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center gap-2" onclick={() => window.print()}>
                <FileArrowDown size={18} />
                {$t('payments.receipt.download_pdf')}
              </button>
           </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .page-container {
    padding: 2.5rem;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  .glow-bg {
    position: fixed;
    top: -10%;
    right: -10%;
    width: 60vw;
    height: 60vw;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
    filter: blur(120px);
  }

  .metric-card.unhealthy {
    border-bottom: 2px solid #ef444466;
  }

  .status-indicator.warning {
    color: #ef4444;
  }

  .status-indicator.warning .dot {
    background: #ef4444;
  }

  .status-indicator.warning .dot.pulse {
    animation: status-pulse-red 1.5s infinite;
  }

  @keyframes status-pulse-red {
    0% { outline: 0px solid rgba(239, 68, 68, 0.5); }
    100% { outline: 10px solid rgba(239, 68, 68, 0); }
  }

  /* Header Section */
  .page-header {
    margin-bottom: 4rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .icon-box {
    width: 72px;
    height: 72px;
    background: rgba(139, 92, 246, 0.1);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a78bfa;
    position: relative;
    box-shadow: 0 10px 40px rgba(139, 92, 246, 0.1);
  }

  .icon-pulse {
    position: absolute;
    inset: -6px;
    border: 1px solid rgba(139, 92, 246, 0.3);
    border-radius: 30px;
    animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
    opacity: 0;
  }

  @keyframes ping {
    75%, 100% { transform: scale(1.15); opacity: 0; }
    0% { transform: scale(1); opacity: 0.4; }
  }

  .title-group h1 {
    font-size: 3rem;
    font-weight: 900;
    color: white;
    margin: 0;
    letter-spacing: -1.5px;
    line-height: 0.9;
    text-transform: uppercase;
  }

  .action-group {
    display: flex;
    gap: 1.25rem;
  }

  /* Buttons */
  .btn-primary {
    background: linear-gradient(135deg, #7c3aed, #6366f1);
    color: white;
    padding: 1.15rem 2.5rem;
    border-radius: 20px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.8rem;
    border: none;
    box-shadow: 0 12px 24px -6px rgba(124, 58, 237, 0.5);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  }

  .btn-primary:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 20px 40px -8px rgba(124, 58, 237, 0.7);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.02);
    color: #cbd5e1;
    padding: 1rem 2rem;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }

  /* Metrics Styling */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 4rem;
  }

  .metric-card {
    background: rgba(15, 15, 15, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 32px;
    padding: 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
    backdrop-filter: blur(20px);
  }

  .metric-card:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-6px);
  }

  .metric-card.revenue { border-bottom: 2px solid #8b5cf666; }
  .metric-card.ticket { border-bottom: 2px solid #3b82f666; }
  .metric-card.portfolio { border-bottom: 2px solid #10b98166; }

  .metric-info .label {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.7rem;
    font-weight: 800;
    color: #475569;
    margin-bottom: 0.75rem;
  }

  .value-row {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    margin-bottom: 1.25rem;
  }

  .value {
    font-family: 'Outfit', sans-serif;
    font-size: 3.5rem;
    font-weight: 900;
    color: white;
    letter-spacing: -2.5px;
    line-height: 1;
  }

  .curr {
    font-size: 1.5rem;
    font-weight: 800;
    color: #8b5cf6;
  }

  .trend {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    color: #ef4444;
    padding: 0.35rem 0.85rem;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 800;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .trend.positive { color: #10b981; }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.7rem;
    font-weight: 900;
    color: #10b981;
    letter-spacing: 1.5px;
  }

  .dot { width: 10px; height: 10px; background: #10b981; border-radius: 50%; }
  .dot.pulse { animation: status-pulse 1.5s infinite; }

  @keyframes status-pulse {
    0% { outline: 0px solid rgba(16, 185, 129, 0.5); }
    100% { outline: 10px solid rgba(16, 185, 129, 0); }
  }

  .metric-visual {
    opacity: 0.05;
    color: white;
    transform: rotate(10deg) scale(1.5) translateX(10px);
    transition: transform 0.5s;
  }

  .metric-card:hover .metric-visual {
    opacity: 0.12;
    transform: rotate(0deg) scale(1.6);
  }

  .premium {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(0,0,0,0));
    border: 1px solid rgba(139, 92, 246, 0.3);
  }

  .premium-badge {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: #7c3aed;
    color: white;
    font-size: 0.6rem;
    font-weight: 900;
    padding: 0.35rem 0.85rem;
    border-radius: 10px;
    letter-spacing: 1px;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
  }

  .sublabel {
    font-size: 0.75rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Ledger / Excel Style Rework */
  .ledger-container {
    background: rgba(10, 10, 10, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
    backdrop-filter: blur(40px);
  }

  .ledger-toolbar {
    padding: 2rem 2.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0,0,0,0.2);
  }

  .search-box {
    flex: 1;
    max-width: 450px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    color: #475569;
    transition: all 0.3s;
  }

  .search-box:focus-within {
    border-color: #7c3aed66;
    background: rgba(124, 58, 237, 0.03);
    color: #7c3aed;
  }

  .search-box input {
    background: none;
    border: none;
    color: white;
    padding: 1.15rem 0;
    font-size: 0.95rem;
    outline: none;
    width: 100%;
    font-family: 'Inter', sans-serif;
  }

  .ledger-filters {
    display: flex;
    gap: 0.75rem;
    padding: 0.4rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.03);
  }

  .filter-btn {
    padding: 0.65rem 1.5rem;
    border-radius: 14px;
    font-size: 0.75rem;
    font-weight: 800;
    color: #475569;
    border: none;
    background: none;
    cursor: pointer;
    transition: all 0.3s sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .filter-btn.active { background: white; color: #0f172a; }
  .filter-btn.disabled { opacity: 0.4; cursor: not-allowed; }

  .ledger-table { width: 100%; border-collapse: separate; border-spacing: 0; }
  .ledger-table th {
    padding: 1.5rem 1rem;
    text-align: left;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 900;
    color: #334155;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.01);
  }

  .ledger-row { transition: all 0.3s; }
  .ledger-row:hover { background: rgba(124, 58, 237, 0.02); }
  .ledger-row td { padding: 1.75rem 1rem; vertical-align: middle; border-bottom: 1px solid rgba(255, 255, 255, 0.02); }

  .student-cell { display: flex; align-items: center; gap: 1.25rem; }
  .avatar {
    width: 48px; height: 48px; border-radius: 18px;
    background: linear-gradient(135deg, #1e293b, #030303);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; color: #8b5cf6; font-size: 1.25rem;
  }

  .info .name { display: block; font-weight: 800; color: white; font-size: 0.93rem; margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .info .id { font-size: 0.65rem; font-weight: 800; color: #475569; letter-spacing: 1.5px; }

  .concept-cell .concept { color: #94a3b8; font-size: 0.9rem; font-weight: 600; }
  .concept-cell .category { font-size: 0.65rem; font-weight: 900; color: #6366f1; text-transform: uppercase; margin-top: 0.4rem; letter-spacing: 1px; }

  .date-cell { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; font-weight: 800; color: #475569; font-family: 'Outfit', sans-serif;}

  .amount-cell { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; }
  .amount { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 900; color: white; letter-spacing: -1px;}

  .status-pill { font-size: 0.55rem; font-weight: 900; padding: 0.25rem 0.6rem; border-radius: 6px; letter-spacing: 1px; }
  .status-pill.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }

  .row-actions { display: flex; justify-content: flex-end; opacity: 0; transform: translateX(10px); transition: all 0.3s; gap: 0.75rem; }
  .ledger-row:hover .row-actions { opacity: 1; transform: translateX(0); }

  .delete-btn, .view-btn {
    width: 44px; height: 44px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s;
    border: 1px solid transparent;
  }

  .delete-btn { border-color: rgba(239, 68, 68, 0.1); background: rgba(239, 68, 68, 0.03); color: #fca5a5; }
  .delete-btn:hover:not(:disabled) { background: #ef4444; color: white; border-color: #ef4444; transform: rotate(5deg) scale(1.1); }

  .view-btn { border-color: rgba(139, 92, 246, 0.1); background: rgba(139, 92, 246, 0.03); color: #a78bfa; }
  .view-btn:hover { background: #8b5cf6; color: white; border-color: #8b5cf6; transform: rotate(-5deg) scale(1.1); }

  .edit-btn { border-color: rgba(14, 165, 233, 0.1); background: rgba(14, 165, 233, 0.03); color: #7dd3fc; }
  .edit-btn:hover { background: #0ea5e9; color: white; border-color: #0ea5e9; transform: scale(1.1); }

  .receipt-modal-card {
    width: 95%; max-width: 650px; position: relative; z-index: 1000;
  }
  .receipt-container { max-height: 85vh; overflow-y: auto; padding: 1rem; scrollbar-width: none; }
  .receipt-container::-webkit-scrollbar { display: none; }

  .empty-state { padding: 8rem 2rem; text-align: center; }

  /* Modal Styling */
  .modal-overlay { 
    position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(20px);
    display: flex; align-items: center; justify-content: center; padding: 2rem; z-index: 1000;
  }
  .modal-card {
    background: #050505; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 48px;
    width: 100%; max-width: 650px; padding: 3.5rem; box-shadow: 0 50px 100px rgba(0,0,0,0.8);
    position: relative;
  }
  .modal-icon { width: 64px; height: 64px; background: #7c3aed; color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 0.5rem; }
  .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem; }

  .modal-form { display: flex; flex-direction: column; gap: 2rem; }
  .form-group label { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #475569; margin-left: 0.5rem; }

  .input-wrapper input, .select-wrapper select {
    width: 100%; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 22px; padding: 1.25rem 1.5rem 1.25rem 4rem; color: white; font-weight: 700; outline: none; transition: all 0.3s;
  }
  .input-wrapper.no-icon input { padding-left: 1.5rem; }
  .input-wrapper input:focus, .select-wrapper select:focus { border-color: #8b5cf6; background: rgba(124, 58, 237, 0.05); box-shadow: 0 0 30px rgba(124, 58, 237, 0.15); }

  .input-wrapper svg, .select-wrapper svg:first-child { position: absolute; left: 1.5rem; color: #475569; }
  .select-wrapper { position: relative; }
  .select-wrapper select { appearance: none; cursor: pointer; }
  .select-wrapper svg:last-child { position: absolute; right: 1.5rem; color: #475569; transform: rotate(90deg); pointer-events: none; }

  .form-row { display: flex; gap: 1.5rem; }
  .btn-submit {
    flex: 2; background: white; color: #000; border: none; border-radius: 20px;
    padding: 1.5rem; font-weight: 950; text-transform: uppercase; letter-spacing: 1.5px;
    cursor: pointer; transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  }
  .btn-submit:hover { transform: scale(1.02); background: #f8fafc; }
  .btn-ghost-alt { flex: 1; background: none; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; color: #475569; font-weight: 800; text-transform: uppercase; cursor: pointer; }
  .btn-ghost-alt:hover { color: white; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.02); }

  .close-btn { background: rgba(255,255,255,0.03); border: none; color: #475569; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }

  /* Type Selector Styles */
  .type-selector {
    display: flex;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 18px;
    padding: 0.4rem;
    gap: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .type-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 14px;
    border: none;
    background: none;
    color: #475569;
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
  }

  .type-btn.active {
    background: white;
    color: black;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .status-pill.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }


  /* Utilities */
  .text-right { text-align: right; }
  .w-20 { width: 5rem; }
  .flex-1 { flex: 1; }
  .pr-10 { padding-right: 2.5rem; }
  .pl-10 { padding-left: 2.5rem; }

  @media (max-width: 1024px) {
    .desktop-only { display: none; }
    .hide-mobile { display: none; }
  }

  @media (max-width: 768px) {
    .page-container { padding: 1.25rem; }
    .header-content { flex-direction: column; align-items: stretch; margin-bottom: 2.5rem; }
    .title-group { gap: 1.25rem; }
    .title-group h1 { font-size: 2.25rem; }
    .icon-box { width: 56px; height: 56px; }
    .metrics-grid { grid-template-columns: 1fr; }
    .form-row { flex-direction: column; }
    .modal-card { padding: 2rem; border-radius: 32px; }
  }

  ::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }

</style>
