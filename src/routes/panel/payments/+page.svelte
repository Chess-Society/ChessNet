<script lang="ts">
  import { t } from '$lib/i18n';
  import { onMount, tick, untrack } from 'svelte';
  import { 
    Plus, 
    MagnifyingGlass, 
    CalendarBlank,
    Users,
    TrendUp,
    Receipt,
    Wallet,
    ArrowClockwise,
    FileText,
    CheckCircle,
    Trash,
    FileArrowDown,
    User,
    Buildings,
    Eye,
    PencilSimple,
    Coins,
    HandCoins,
    Bank,
    X,
    CaretRight,
    CaretDown,
    Hourglass,
    Warning
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { user as authUser } from '$lib/stores/auth';

  import { goto } from '$app/navigation';
  import { uiStore } from '$lib/stores/uiStore';
  import { toast } from '$lib/stores/toast';
  import { fade, fly, scale } from 'svelte/transition';
  import { enhance as sEnhance } from '$app/forms';
  import { superForm } from 'sveltekit-superforms';
  import { zod4 as zod } from 'sveltekit-superforms/adapters';
  import { paymentSchema } from '$lib/schemas/payment';

  let { data } = $props();

  // Auth & Access Control
  const plan = $derived($appStore?.settings?.plan || 'free');
  const isAdmin = $derived($authUser?.isAdmin === true);

  // Data from Server Load
  let payments = $derived((data.payments as any[]) || []);
  let students = $derived((data.students as any[]) || []);
  let schools = $derived((data.schools as any[]) || []);

  onMount(() => {
    if (plan === 'free' && !isAdmin) {
      goto('/pricing');
      return;
    }
  });

  let searchQuery = $state('');

  const getEntityName = (id: string, type: 'student' | 'school' = 'student') => {
    if (type === 'school') {
      const school = schools.find(s => s.id === id);
      return school?.name || $t('common.unknown');
    }
    const student = students.find(s => s.id === id);
    return student?.name || $t('payments.unknown_student');
  };

  // Financial metrics (Accounting Ledger style)
  const metrics = $derived.by(() => {
    const totalPotential = payments.reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
    const realizedRevenue = payments
      .filter((p: any) => p.status === 'paid')
      .reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
    const accountsReceivable = payments
      .filter((p: any) => p.status === 'pending' || p.status === 'overdue')
      .reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
    
    const efficiency = totalPotential > 0 ? (realizedRevenue / totalPotential) * 100 : 100;

    return { 
      realizedRevenue, 
      accountsReceivable, 
      efficiency: efficiency.toFixed(1),
      totalCount: payments.length,
      paidCount: payments.filter((p: any) => p.status === 'paid').length,
      pendingCount: payments.filter((p: any) => p.status !== 'paid').length
    };
  });

  // Filtering state
  let statusFilter = $state('all'); 
  let typeFilter = $state('all');
  
  const filteredPayments = $derived(
    payments
      .filter((p: any) => {
        const studentName = getEntityName(p.studentId || '', p.paymentType || 'student').toLowerCase();
        const concept = (p.concept || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        
        const matchesSearch = studentName.includes(query) || concept.includes(query);
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchesType = typeFilter === 'all' || p.paymentType === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a: any,b: any) => (b.paidDate || b.createdAt || '').localeCompare(a.paidDate || a.createdAt || ''))
  );

  // Modal & Superform state
  let showModal = $state(false);
  let editMode = $state(false);
  let isDeleting = $state<string | null>(null);
  let deleteForm = $state<HTMLFormElement | null>(null);
  let deleteId = $state<string>('');

  const { form, errors, enhance: paymentEnhance, reset, constraints, message, isTainted, delayed } = superForm(untrack(() => data.form) as any, {
    validators: zod(paymentSchema as any),
    dataType: 'json',
    onUpdated({ form }) {
      if (form.valid) {
        toast.success((form.message as string) || (editMode ? $t('payments.update_success') : $t('payments.add_success')));
        showModal = false;
        reset();
      } else if (form.message) {
        toast.error(form.message as string);
      }
    },
    onError({ result }) {
      toast.error((result as any).error?.message || $t('payments.error_action'));
    }
  }) as any;

  const openNew = () => {
    reset();
    $form.paidDate = new Date().toISOString().split('T')[0];
    editMode = false;
    showModal = true;
  };

  const openEdit = (payment: any) => {
    $form = { ...payment };
    editMode = true;
    showModal = true;
  };

  const deletePayment = async (id: string) => {
    const confirmed = await uiStore.confirm({
      title: $t('payments.confirm_delete'),
      message: $t('payments.modal_description'),
      type: 'danger',
      confirmText: $t('common.delete'),
      cancelText: $t('common.cancel')
    });

    if (!confirmed) return;

    deleteId = id;
    await tick();
    deleteForm?.requestSubmit();
  };

  const exportToCSV = () => {
    const headers = [
      $t('payments.client_entity'),
      $t('payments.reference_concept'),
      $t('payments.accounting_date'),
      $t('payments.amount'),
      $t('common.status')
    ];
    const rows = filteredPayments.map((p: any) => [
      getEntityName(p.studentId || '', p.paymentType),
      $t(`payments.concepts.${p.concept}`) || p.concept,
      p.paidDate || p.createdAt,
      p.amount,
      p.status
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };


</script>

<svelte:head>
  <title>{$t('payments.ledger')} - ChessNet</title>
</svelte:head>

<div class="page-container" in:fade>
  
  <div class="glow-bg"></div>

  <!-- Header -->
  <header class="main-header">
    <div class="title-section">
      <div class="icon-orb">
        <Bank size={32} weight="duotone" />
      </div>
      <div class="text-group">
        <h1 class="gradient-text">{$t('payments.title')}</h1>
        <p class="subtitle">{$t('payments.desc')}</p>
      </div>
    </div>

    <div class="action-section">
      <button class="glass-btn secondary" onclick={exportToCSV}>
        <FileArrowDown size={20} />
        <span class="desktop-only text-xs font-bold uppercase tracking-widest">CSV</span>
      </button>
      <button class="glass-btn primary" onclick={openNew}>
        <Plus size={20} weight="bold" />
        <span>{$t('payments.new_payment')}</span>
      </button>
    </div>
  </header>

  <!-- Metrics Grid -->
  <section class="super-metrics">
    <div class="metric-card gold">
      <div class="card-glow"></div>
      <div class="info">
        <span class="label">{$t('payments.revenue_month')}</span>
        <div class="value-row">
          <span class="symbol">€</span>
          <span class="amount">{(metrics.realizedRevenue ?? 0).toLocaleString()}</span>
        </div>
        <div class="footer-stats">
          <CheckCircle size={14} />
          <span>{$t('payments.transactions_settled', { n: metrics.paidCount })}</span>
        </div>
      </div>
      <div class="icon-visual">
        <Coins size={80} weight="duotone" />
      </div>
    </div>

    <div class="metric-card silver">
      <div class="info">
        <span class="label">{$t('payments.accounts_receivable')}</span>
        <div class="value-row">
          <span class="symbol">€</span>
          <span class="amount">{(metrics.accountsReceivable ?? 0).toLocaleString()}</span>
        </div>
        <div class="footer-stats">
          <Hourglass size={14} />
          <span>{$t('payments.open_records', { n: metrics.pendingCount })}</span>
        </div>
      </div>
      <div class="icon-visual">
        <HandCoins size={80} weight="duotone" />
      </div>
    </div>

    <div class="metric-card efficiency">
      <div class="info">
        <span class="label">{$t('payments.portfolio_status')}</span>
        <div class="value-row">
          <span class="amount">{metrics.efficiency}</span>
          <span class="symbol">%</span>
        </div>
        <div class="efficiency-bar">
          <div class="fill" style="width: {metrics.efficiency}%"></div>
        </div>
      </div>
      <div class="icon-visual">
        <TrendUp size={80} weight="duotone" />
      </div>
    </div>
  </section>

  <!-- Main Ledger Table -->
  <main class="ledger-wrapper">
    <div class="wrapper-header">
      <div class="search-wrap">
        <MagnifyingGlass size={20} />
        <input type="text" placeholder={$t('payments.filter_placeholder')} bind:value={searchQuery} />
      </div>

      <div class="filter-tabs">
        <button class="tab" class:active={statusFilter === 'all'} onclick={() => statusFilter = 'all'}>{$t('common.all')}</button>
        <button class="tab" class:active={statusFilter === 'paid'} onclick={() => statusFilter = 'paid'}>{$t('payments.status_paid')}</button>
        <button class="tab" class:active={statusFilter === 'pending'} onclick={() => statusFilter = 'pending'}>{$t('payments.status_pending')}</button>
        <button class="tab" class:active={statusFilter === 'overdue'} onclick={() => statusFilter = 'overdue'}>{$t('payments.status_overdue')}</button>
      </div>
    </div>

    <div class="table-container">
      <table class="super-table">
        <thead>
          <tr>
            <th class="pl-8">{$t('common.entitity')}</th>
            <th>{$t('common.category')}</th>
            <th>{$t('common.date')}</th>
            <th>{$t('payments.receipt.payment_method')}</th>
            <th class="text-right">{$t('payments.amount')}</th>
            <th class="text-right pr-8">{$t('common.status')}</th>
          </tr>
        </thead>
        <tbody>
          {#if filteredPayments.length === 0}
            <tr>
              <td colspan="6" class="no-data">
                <div class="empty-box">
                  <Receipt size={48} weight="thin" />
                  <p>{$t('common.no_results')}</p>
                </div>
              </td>
            </tr>
          {:else}
            {#each filteredPayments as p (p.id)}
              <tr class="table-row group" in:fly={{ y: 8, duration: 300 }}>
                <td class="pl-8">
                  <div class="entity-info">
                    <div class="icon-type" class:school={p.paymentType === 'school'}>
                      {#if p.paymentType === 'school'}
                        <Buildings size={20} weight="duotone" />
                      {:else}
                        <User size={20} weight="duotone" />
                      {/if}
                    </div>
                    <div class="details">
                      <span class="name">{getEntityName(p.studentId || '', p.paymentType || 'student')}</span>
                      <span class="type">{$t(`payments.type_${p.paymentType}`)}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="concept-tag">{$t(`payments.concepts.${p.concept}`) || p.concept}</span>
                </td>
                <td>
                  <span class="date-text">
                    {new Date(p.paidDate || p.createdAt || '').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </span>
                </td>
                <td>
                  <div class="method-cell">
                    <span class="method">{$t(`payments.method_${p.paymentMethod || 'transfer'}`)}</span>
                  </div>
                </td>
                <td class="text-right">
                  <span class="amount-text">{p.amount}€</span>
                </td>
                <td class="text-right pr-8">
                  <div class="status-cell">
                    <span class="pill {p.status}">
                      {$t(`payments.status_${p.status}`)}
                    </span>
                    <div class="quick-actions">
                      <button class="act-btn" onclick={() => { selectedPayment = p; showReceipt = true; }}><Eye size={18} /></button>
                      <button class="act-btn" onclick={() => openEdit(p)}><PencilSimple size={18} /></button>
                      <button 
                        class="act-btn delete" 
                        onclick={() => deletePayment(p.id)} 
                        disabled={isDeleting === p.id}
                      >
                        {#if isDeleting === p.id}
                          <div class="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-none animate-spin"></div>
                        {:else}
                          <Trash size={18} />
                        {/if}
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </main>

  <!-- Record Transaction Modal -->
  {#if showModal}
    <div class="overlay" transition:fade onclick={() => showModal = false} onkeydown={e => e.key === 'Escape' && (showModal = false)} role="button" tabindex="-1" aria-label="Close modal">
      <div class="modal-card" transition:scale={{ start: 0.95 }} onclick={e => e.stopPropagation()} onkeydown={e => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
        <div class="card-header">
          <div class="icon-bg">
            <Plus size={24} weight="bold" />
          </div>
          <div class="text">
            <h2>{editMode ? $t('payments.edit_record') : $t('payments.new_record')}</h2>
            <p>{$t('payments.modal_subtitle')}</p>
          </div>
          <button class="close-x" onclick={() => showModal = false}><X size={24} /></button>
        </div>

        <form method="POST" action="?/upsert" use:paymentEnhance class="ledger-form">
          <input type="hidden" name="id" bind:value={$form.id} />
          <div class="form-section">
            <span class="label">{$t('payments.entity_category')}</span>
            <div class="toggle-group">
              <button type="button" class:active={$form.paymentType === 'student'} onclick={() => $form.paymentType = 'student'}>
                <User size={18} /> {$t('common.student')}
              </button>
              <button type="button" class:active={$form.paymentType === 'school'} onclick={() => $form.paymentType = 'school'}>
                <Buildings size={18} /> {$t('common.school')}
              </button>
            </div>
            <input type="hidden" name="paymentType" value={$form.paymentType} />
          </div>

          <div class="field-group">
            <label for="entity-select">{$t('payments.select_entity', { type: $form.paymentType === 'school' ? $t('common.school') : $t('common.student') })}</label>
            <div class="select-input">
              <select id="entity-select" name="studentId" bind:value={$form.studentId} required>
                <option value="" disabled selected>{$t('common.select_option')}...</option>
                {#if $form.paymentType === 'school'}
                  {#each schools as school}
                    <option value={school.id}>{school.name}</option>
                  {/each}
                {:else}
                  {#each students as student}
                    <option value={student.id}>{student.name}</option>
                  {/each}
                {/if}
              </select>
            </div>
            {#if $errors.studentId}<span class="text-red-500 text-[10px]">{$errors.studentId}</span>{/if}
          </div>

          <div class="grid-2">
            <div class="field-group">
              <label for="amount-input">{$t('payments.amount')} (€)</label>
              <input id="amount-input" name="amount" type="number" step="0.01" bind:value={$form.amount} required />
              {#if $errors.amount}<span class="text-red-500 text-[10px]">{$errors.amount}</span>{/if}
            </div>
            <div class="field-group">
              <label for="date-input">{$t('payments.operation_date')}</label>
              <input id="date-input" name="paidDate" type="date" bind:value={$form.paidDate} required />
              {#if $errors.paidDate}<span class="text-red-500 text-[10px]">{$errors.paidDate}</span>{/if}
            </div>
          </div>

          <div class="grid-2">
            <div class="field-group">
              <label for="concept-select">{$t('payments.concept')}</label>
              <select id="concept-select" name="concept" bind:value={$form.concept} required>
                <option value="monthly_fee">{$t('payments.concepts.monthly_fee')}</option>
                <option value="registration">{$t('payments.concepts.registration')}</option>
                <option value="tournament">{$t('payments.concepts.tournament')}</option>
                <option value="material">{$t('payments.concepts.material')}</option>
                <option value="other">{$t('payments.concepts.other')}</option>
              </select>
            </div>
            <div class="field-group">
              <label for="status-select">{$t('common.status')}</label>
              <select id="status-select" name="status" bind:value={$form.status} required>
                <option value="paid">{$t('payments.status_paid')}</option>
                <option value="pending">{$t('payments.status_pending')}</option>
                <option value="overdue">{$t('payments.status_overdue')}</option>
              </select>
            </div>
          </div>

          <div class="field-group">
             <span class="label">{$t('payments.payment_method')}</span>
             <div class="method-pills">
               {#each ['transfer', 'cash', 'card'] as m}
                 <button type="button" class:selected={$form.paymentMethod === m} onclick={() => $form.paymentMethod = m}>
                   {$t(`payments.method_${m}`)}
                 </button>
               {/each}
             </div>
             <input type="hidden" name="paymentMethod" value={$form.paymentMethod} />
          </div>

          <div class="form-footer flex gap-3 mt-4">
            {#if editMode}
              <button 
                type="button" 
                class="flex-1 p-4 bg-red-500/10 text-red-500 rounded-none font-bold uppercase text-xs tracking-widest hover:bg-red-500/20 transition-colors"
                onclick={() => {
                  if ($form.id) {
                    deletePayment($form.id);
                    showModal = false;
                  }
                }}
              >
                {$t('common.delete')}
              </button>
            {/if}
            <button type="submit" class="submit-btn flex-[2] mt-0">{editMode ? $t('payments.edit_record') : $t('payments.new_payment')}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Receipt Viewer (Improved) -->
  {#if showReceipt && selectedPayment}
    <div class="overlay" transition:fade onclick={() => showReceipt = false} onkeydown={e => e.key === 'Escape' && (showReceipt = false)} role="button" tabindex="-1" aria-label="Close receipt">
       <div class="receipt-card" transition:scale onclick={e => e.stopPropagation()} onkeydown={e => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
          <div class="scallop-top"></div>
          <div class="receipt-content">
             <div class="header">
               <h3>{$t('payments.view_receipt')}</h3>
               <p class="ref">{$t('payments.receipt.ref_id')}: {selectedPayment.id?.slice(-8).toUpperCase()}</p>
             </div>
             
             <div class="main-stats">
               <div class="item">
                 <span class="label">{$t('payments.receipt.issued_to')}</span>
                 <span>{getEntityName(selectedPayment.studentId || '', selectedPayment.paymentType || 'student')}</span>
               </div>
               <div class="item text-right">
                 <span class="label">{$t('payments.receipt.issue_date')}</span>
                 <span>{new Date(selectedPayment.paidDate || selectedPayment.createdAt || '').toLocaleDateString()}</span>
               </div>
             </div>

             <div class="ledger-line">
               <div class="desc">
                 <p class="con">{$t(`payments.concepts.${selectedPayment.concept}`)}</p>
                 <p class="sub">{$t(`payments.method_${selectedPayment.paymentMethod || 'transfer'}`)}</p>
               </div>
               <div class="price">
                 {formatCurrency(selectedPayment.amount)}
               </div>
             </div>

             <div class="total-row">
               <span class="label">{$t('payments.receipt.total_paid')}</span>
               <span class="val">{formatCurrency(selectedPayment.amount)}</span>
             </div>

             <div class="footer-msg">
               <div class="checkmark"><CheckCircle size={20} /></div>
               <p>{$t('payments.receipt.confirmation_text')}</p>
             </div>
          </div>
          <div class="scallop-bottom"></div>
          <button class="print-btn" onclick={() => window.print()}>{$t('actions.print')}</button>
       </div>
    </div>
  {/if}

  <!-- Hidden Delete Form -->
  <form method="POST" action="?/delete" use:sEnhance={() => {
    isDeleting = deleteId;
    return async ({ result }: { result: any }) => {
      isDeleting = null;
      if (result.type === 'success') {
        toast.success(result.data?.message || 'Pago eliminado');
      } else if (result.type === 'failure') {
        toast.error(result.data?.message || 'Error al eliminar');
      }
    };
  }} bind:this={deleteForm} class="hidden">
    <input type="hidden" name="id" bind:value={deleteId} />
  </form>
</div>

<style>
  :global(:root) {
    --gold: #f59e0b;
    --silver: #94a3b8;
    --success: #a78bfa;
    --pending: #f59e0b;
    --overdue: #ef4444;
    --card-bg: rgba(20, 20, 20, 0.4);
    --border-soft: rgba(255, 255, 255, 0.05);
  }

  .page-container {
    padding: 3rem;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .glow-bg {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vh;
    background: radial-gradient(circle, rgba(167, 139, 250, 0.05) 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }

  /* Header */
  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4rem;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .icon-orb {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(99, 102, 241, 0.1));
    border: 1px solid rgba(167, 139, 250, 0.3);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a78bfa;
    box-shadow: 0 0 30px rgba(167, 139, 250, 0.1);
  }

  .gradient-text {
    font-family: 'Outfit', sans-serif;
    font-size: 3.5rem;
    font-weight: 900;
    margin: 0;
    letter-spacing: -2px;
    background: linear-gradient(to right, #fff, #a78bfa);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle { color: #64748b; font-size: 0.9rem; font-weight: 700; margin-top: 0.25rem; text-transform: uppercase; letter-spacing: 1px; }

  .action-section { display: flex; gap: 1rem; }

  .glass-btn {
    padding: 0.85rem 1.75rem;
    border-radius: 0px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s;
    cursor: pointer;
  }

  .glass-btn.primary {
    background: white;
    color: black;
    border: none;
    box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
  }

  .glass-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(255, 255, 255, 0.15);
  }

  .glass-btn.secondary {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-soft);
    color: #94a3b8;
  }

  /* Metrics */
  .super-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .metric-card {
    background: var(--card-bg);
    border: 1px solid var(--border-soft);
    border-radius: 0px;
    padding: 2.5rem;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(20px);
    transition: transform 0.3s;
  }

  .metric-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.1); }

  .metric-card .label {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #475569;
    display: block;
    margin-bottom: 1rem;
  }

  .value-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .value-row .amount {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -2px;
    color: white;
    font-family: 'Outfit';
  }

  .value-row .symbol {
    font-size: 1.5rem;
    font-weight: 800;
    color: #a78bfa;
  }

  .footer-stats {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
  }

  .efficiency-bar {
    height: 6px;
    background: rgba(255,255,255,0.05);
    border-radius: 0px;
    overflow: hidden;
  }

  .efficiency-bar .fill {
    height: 100%;
    background: linear-gradient(90deg, #7c3aed, #a78bfa);
    border-radius: 0px;
  }

  .icon-visual {
    position: absolute;
    bottom: -20px;
    right: -20px;
    opacity: 0.03;
    transform: rotate(-10deg);
    color: white;
  }

  /* Ledger Table */
  .ledger-wrapper {
    background: var(--card-bg);
    border: 1px solid var(--border-soft);
    border-radius: 0px;
    overflow: hidden;
    backdrop-filter: blur(30px);
  }

  .wrapper-header {
    background: rgba(0,0,0,0.2);
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-soft);
  }

  .search-wrap {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255,255,255,0.03);
    padding: 0 1.5rem;
    border-radius: 0px;
    border: 1px solid var(--border-soft);
    width: 400px;
    color: #475569;
  }

  .search-wrap input {
    background: none;
    border: none;
    color: white;
    padding: 1rem 0;
    width: 100%;
    outline: none;
    font-size: 0.9rem;
  }

  .filter-tabs {
    display: flex;
    gap: 0.5rem;
    background: rgba(0,0,0,0.2);
    padding: 0.4rem;
    border-radius: 0px;
  }

  .tab {
    padding: 0.6rem 1.5rem;
    border-radius: 0px;
    border: none;
    background: none;
    color: #64748b;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
  }

  .tab.active { background: white; color: black; }

  .super-table { width: 100%; border-collapse: collapse; }

  .super-table th {
    padding: 1.5rem 1rem;
    text-align: left;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #475569;
    border-bottom: 1px solid var(--border-soft);
  }

  .table-row { transition: background 0.2s; }
  .table-row:hover { background: rgba(255,255,255,0.02); }

  .table-row td { padding: 1.5rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.02); }

  .no-data {
    padding: 6rem 0 !important;
    text-align: center;
  }

  .empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    color: #475569;
  }

  .empty-box p {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #64748b;
  }

  .entity-info { display: flex; align-items: center; gap: 1.25rem; }

  .icon-type {
    width: 44px;
    height: 44px;
    border-radius: 0px;
    background: rgba(139, 92, 246, 0.1);
    color: #a78bfa;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(139, 92, 246, 0.1);
  }

  .icon-type.school { background: rgba(14, 165, 233, 0.1); color: #7dd3fc; border-color: rgba(14, 165, 233, 0.1); }

  .details .name { display: block; font-weight: 700; color: white; font-size: 0.95rem; }
  .details .type { font-size: 0.65rem; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

  .concept-tag {
    background: rgba(255,255,255,0.03);
    padding: 0.4rem 0.8rem;
    border-radius: 0px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #94a3b8;
    border: 1px solid var(--border-soft);
  }

  .date-text { font-family: 'Outfit'; font-size: 0.85rem; color: #64748b; font-weight: 600; }
  .amount-text { font-family: 'Outfit'; font-size: 1.15rem; font-weight: 800; color: white; }

  .status-cell { position: relative; display: flex; align-items: center; justify-content: flex-end; }

  .pill {
    padding: 0.35rem 0.8rem;
    border-radius: 0px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: 1px solid transparent;
  }

  .pill.paid { background: rgba(167, 139, 250, 0.1); color: #a78bfa; border-color: rgba(167, 139, 250, 0.2); }
  .pill.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: rgba(245, 158, 11, 0.2); }
  .pill.overdue { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }

  .quick-actions {
    position: absolute;
    right: 0;
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.2s;
  }

  .table-row:hover .pill { opacity: 0; pointer-events: none; }
  .table-row:hover .quick-actions { opacity: 1; transform: translateX(0); }

  .act-btn {
    width: 36px;
    height: 36px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border-soft);
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s;
  }

  .act-btn:hover { background: white; color: black; border-color: white; }
  .act-btn.delete:hover { background: #ef4444; border-color: #ef4444; color: white; }

  /* Modal */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(20px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .modal-card {
    background: #0a0a0a;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 0px;
    width: 100%;
    max-width: 600px;
    padding: 3rem;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .icon-bg {
    width: 56px;
    height: 56px;
    background: #a78bfa;
    color: black;
    border-radius: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-header h2 { font-family: 'Outfit'; font-size: 1.75rem; margin: 0; letter-spacing: -1px; }
  .card-header p { font-size: 0.85rem; color: #475569; margin: 0.25rem 0 0 0; }

  .close-x { background: none; border: none; color: #475569; cursor: pointer; margin-left: auto; }

  .ledger-form { display: flex; flex-direction: column; gap: 1.75rem; }

  .form-section .label, .field-group label, .field-group .label {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #475569;
    display: block;
    margin-bottom: 0.75rem;
  }

  .toggle-group {
    display: flex;
    background: #111;
    padding: 0.4rem;
    border-radius: 0px;
    gap: 0.35rem;
  }

  .toggle-group button {
    flex: 1;
    padding: 0.85rem;
    border-radius: 0px;
    border: none;
    background: none;
    color: #475569;
    font-weight: 700;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .toggle-group button.active { background: #222; color: white; }

  .select-input select, .field-group input, .field-group select {
    width: 100%;
    background: #111;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0px;
    padding: 1rem 1.25rem;
    color: white;
    outline: none;
    font-family: inherit;
    font-size: 0.95rem;
  }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

  .method-pills { display: flex; gap: 0.75rem; }
  .method-pills button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 0px;
    background: #111;
    border: 1px solid rgba(255,255,255,0.05);
    color: #475569;
    font-weight: 700;
    font-size: 0.75rem;
    cursor: pointer;
  }
  .method-pills button.selected { border-color: #a78bfa; color: #a78bfa; background: rgba(167, 139, 250, 0.05); }

  .submit-btn {
    width: 100%;
    padding: 1.25rem;
    background: #a78bfa;
    color: black;
    border-radius: 0px;
    border: none;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    margin-top: 1rem;
  }

  /* Receipt Card */
  .receipt-card {
    width: 100%;
    max-width: 450px;
    background: white;
    color: black;
    padding: 3rem;
    position: relative;
    border-radius: 0px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  }

  .receipt-content { text-align: center; }
  .receipt-content .header h3 { font-size: 1.5rem; margin: 0; color: black; font-weight: 950; }
  .receipt-content .ref { font-size: 0.65rem; font-weight: 800; color: #94a3b8; margin-top: 0.5rem; }

  .main-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 2.5rem 0;
    padding: 1.5rem 0;
    border-top: 1px dashed #e2e8f0;
    border-bottom: 1px dashed #e2e8f0;
  }

  .main-stats .item .label { font-size: 0.55rem; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 0.4rem; }
  .main-stats .item span { font-size: 0.85rem; font-weight: 900; }

  .ledger-line { display: flex; justify-content: space-between; align-items: flex-start; text-align: left; margin-bottom: 2rem; }
  .ledger-line .con { font-weight: 950; text-transform: uppercase; font-size: 1.1rem; margin: 0; line-height: 1; }
  .ledger-line .sub { font-size: 0.7rem; font-weight: 700; color: #64748b; margin-top: 0.4rem; }
  .ledger-line .price { font-size: 1.25rem; font-weight: 900; }

  .total-row { display: flex; justify-content: space-between; background: #f8fafc; padding: 1.25rem; border-radius: 0px; }
  .total-row .label { font-size: 0.65rem; font-weight: 950; }
  .total-row .val { font-size: 1.25rem; font-weight: 950; }

  .footer-msg { margin-top: 3rem; opacity: 0.5; }
  .footer-msg p { font-size: 0.65rem; font-weight: 700; line-height: 1.5; color: #64748b; }

  .print-btn {
    width: 100%;
    margin-top: 2rem;
    padding: 1rem;
    background: black;
    color: white;
    border-radius: 0px;
    font-weight: 700;
    cursor: pointer;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .super-metrics { grid-template-columns: 1fr; }
    .page-container { padding: 1.5rem; }
    .gradient-text { font-size: 2rem; }
    .search-wrap { width: 100%; }
    .wrapper-header { flex-direction: column; gap: 1.5rem; align-items: stretch; }
  }

  @media print {
    .page-container > *:not(.overlay), .print-btn { display: none !important; }
    .overlay { background: none; backdrop-filter: none; position: static; }
    .receipt-card { box-shadow: none; width: 100%; max-width: none; }
  }
</style>

