<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    DollarSign,
    Plus,
    Search,
    Filter,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Users,
    School,
    CreditCard,
    Banknote,
    Eye,
    Edit3,
    Download,
    ChevronDown,
    ChevronRight,
    BarChart3,
    ArrowLeft,
    Wallet,
    History,
    PieChart,
    X
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { PaymentWithDetails, PaymentStatus, PaymentType, PaymentConcept } from '$lib/types';
  import { fade, fly } from 'svelte/transition';

  let { data } = $props<{ data: PageData }>();

  let searchTerm = $state('');
  let statusFilter = $state<PaymentStatus | 'all'>('all');
  let typeFilter = $state<PaymentType | 'all'>('all');
  let conceptFilter = $state<PaymentConcept | 'all'>('all');
  let showFilters = $state(false);
  let selectedTab = $state<'overview' | 'payments' | 'students' | 'schools'>('overview');

  const filteredPayments = $derived(
    data.payments?.filter((payment: PaymentWithDetails) => {
      const matchesSearch = !searchTerm || 
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.school?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesType = typeFilter === 'all' || payment.payment_type === typeFilter;
      const matchesConcept = conceptFilter === 'all' || payment.concept === conceptFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesConcept;
    }) || []
  );

  const groupedPayments = $derived(() => {
    const schoolPayments = filteredPayments.filter((p: PaymentWithDetails) => p.payment_type === 'school');
    const studentPayments = filteredPayments.filter((p: PaymentWithDetails) => p.payment_type === 'student');
    
    const sortedSchools = [...schoolPayments].sort((a, b) => (a.school?.name || '').localeCompare(b.school?.name || ''));
    const sortedStudents = [...studentPayments].sort((a, b) => (a.student?.name || '').localeCompare(b.student?.name || ''));
    
    return [...sortedSchools, ...sortedStudents];
  });

  const handleViewPayment = (id: string) => {
    // Implement viewing logic
    console.log('Viewing payment:', id);
  };

  const handleEditPayment = (id: string) => {
    goto(`/payments/${id}/edit`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statusThemes: Record<string, string> = {
    paid: 'bg-green-500/10 text-green-400 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
    cancelled: 'bg-surface-800 text-surface-500 border-surface-700',
    refunded: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  const statusLabels: Record<string, string> = {
    paid: 'Pagado',
    pending: 'Pendiente',
    overdue: 'Vencido',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado'
  };

  const conceptLabels: Record<string, string> = {
    monthly_fee: 'Mensualidad',
    registration: 'Inscripción',
    tournament: 'Torneo',
    material: 'Material',
    private_lesson: 'Clase Particular',
    other: 'Otros'
  };
</script>

<svelte:head>
  <title>Pagos - ChessNet</title>
</svelte:head>

<div class="space-y-8 animate-fade-in" in:fade>
  <!-- Header Section -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div class="space-y-2 text-center md:text-left">
      <div class="flex items-center justify-center md:justify-start gap-3 text-primary-400 font-bold uppercase tracking-widest text-xs">
        <Wallet class="w-4 h-4" />
        Finanzas & Facturación
      </div>
      <h1 class="text-4xl font-black text-white tracking-tight">Sistema de Pagos</h1>
      <p class="text-surface-400 text-lg">Administra ingresos, cobros pendientes y estados financieros.</p>
    </div>

    <div class="flex items-center justify-center gap-3">
      <button 
        onclick={() => goto('/payments/create')}
        class="group relative px-6 py-3 bg-primary-500 hover:bg-primary-400 text-surface-950 font-black uppercase tracking-tighter rounded-xl transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-2xl shadow-primary-500/20"
      >
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <Plus class="w-5 h-5 relative z-10" />
        <span class="relative z-10 text-sm">Nuevo Pago</span>
      </button>
    </div>
  </div>

  <!-- Tabs Navigation -->
  <div class="flex p-1 bg-surface-950/50 border border-surface-800 rounded-2xl w-full max-w-2xl overflow-x-auto no-scrollbar">
    {#each ['overview', 'payments', 'students', 'schools'] as tab}
      <button
        onclick={() => selectedTab = tab as any}
        class={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
          selectedTab === tab 
            ? 'bg-surface-800 text-primary-400 shadow-xl' 
            : 'text-surface-500 hover:text-surface-300'
        }`}
      >
        {#if tab === 'overview'}<PieChart class="w-3.5 h-3.5" />{/if}
        {#if tab === 'payments'}<History class="w-3.5 h-3.5" />{/if}
        {#if tab === 'students'}<Users class="w-3.5 h-3.5" />{/if}
        {#if tab === 'schools'}<School class="w-3.5 h-3.5" />{/if}
        {tab === 'overview' ? 'Resumen' : tab === 'payments' ? 'Pagos' : tab === 'students' ? 'Alumnos' : 'Centros'}
      </button>
    {/each}
  </div>

  <main class="space-y-8 min-h-[60vh]">
    {#if selectedTab === 'overview'}
      <div class="space-y-8" in:fade>
        <!-- KPIs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-card p-6 border-b-2 border-primary-500 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-all duration-500"></div>
            <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Ingresos Mes</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-3xl font-black text-white">{formatCurrency(data.paymentStats?.total_revenue_this_month || 0)}</p>
                <div class="flex items-center gap-1.5 mt-1">
                  {#if (data.paymentStats?.revenue_growth_percentage || 0) >= 0}
                    <TrendingUp class="w-3 h-3 text-green-400" />
                    <span class="text-[10px] font-bold text-green-400">+{data.paymentStats.revenue_growth_percentage}%</span>
                  {:else}
                    <TrendingDown class="w-3 h-3 text-red-400" />
                    <span class="text-[10px] font-bold text-red-400">{data.paymentStats.revenue_growth_percentage}%</span>
                  {/if}
                </div>
              </div>
              <div class="p-2 bg-primary-500/10 rounded-xl text-primary-400">
                <DollarSign class="w-5 h-5" />
              </div>
            </div>
          </div>

          <div class="glass-card p-6 border-b-2 border-yellow-500">
            <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Pendientes</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-3xl font-black text-yellow-500">{data.paymentStats?.pending_payments_count || 0}</p>
                <p class="text-[10px] text-surface-500 font-bold mt-1 uppercase">POR COBRAR</p>
              </div>
              <div class="p-2 bg-yellow-500/10 rounded-xl text-yellow-500">
                <Clock class="w-5 h-5" />
              </div>
            </div>
          </div>

          <div class="glass-card p-6 border-b-2 border-red-500">
            <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Vencidos (Debt)</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-3xl font-black text-red-500">{formatCurrency(data.paymentStats?.overdue_amount || 0)}</p>
                <p class="text-[10px] text-red-500/50 font-bold mt-1 uppercase">{data.paymentStats?.overdue_payments_count || 0} RECIBOS</p>
              </div>
              <div class="p-2 bg-red-500/10 rounded-xl text-red-400">
                <AlertTriangle class="w-5 h-5" />
              </div>
            </div>
          </div>

          <div class="glass-card p-6 border-b-2 border-blue-500">
            <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Ticket Medio</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-3xl font-black text-blue-400">{formatCurrency(data.paymentStats?.average_payment_amount || 0)}</p>
                <p class="text-[10px] text-surface-500 font-bold mt-1 uppercase">VALOR TRANSACCIÓN</p>
              </div>
              <div class="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                <BarChart3 class="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-white flex items-center gap-2 italic uppercase">
              <History class="w-5 h-5 text-primary-400" />
              Últimas Transacciones
            </h2>
            <button onclick={() => selectedTab = 'payments'} class="text-[10px] font-bold text-primary-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
              Ver Historial Completo
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>

          <div class="grid grid-cols-1 gap-3">
            {#each data.payments?.slice(0, 4) || [] as payment}
              <div class="glass-panel group hover:bg-surface-900/40 transition-all duration-300">
                <div class="p-4 flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class={`w-12 h-12 rounded-xl flex items-center justify-center border border-surface-800 shadow-xl transition-all group-hover:scale-110 ${
                      payment.payment_type === 'student' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {#if payment.payment_type === 'student'}<Users class="w-6 h-6" />{:else}<School class="w-6 h-6" />{/if}
                    </div>
                    <div>
                      <h4 class="font-bold text-white group-hover:text-primary-400 transition-colors">{payment.student?.name || payment.school?.name}</h4>
                      <p class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">{conceptLabels[payment.concept] || 'Otros'}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-8">
                    <div class="text-right hidden sm:block">
                      <p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest mb-0.5">Vencimiento</p>
                      <p class="text-xs font-black text-white">{formatDate(payment.due_date)}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-black text-white">{formatCurrency(payment.amount)}</p>
                      <span class={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${statusThemes[payment.status]}`}>
                        {statusLabels[payment.status]}
                      </span>
                    </div>
                    <button onclick={() => handleViewPayment(payment.id)} class="p-2 text-surface-600 hover:text-white transition-colors">
                      <ChevronRight class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    {#if selectedTab === 'payments'}
      <div class="space-y-6" in:fade>
        <!-- Filters Area -->
        <div class="glass-panel p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div class="relative group md:col-span-2">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors" />
              <input
                type="text"
                placeholder="Buscar por descripción, alumno o centro..."
                bind:value={searchTerm}
                class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-primary-500/50 outline-none transition-all"
              />
            </div>

            <select bind:value={statusFilter} class="bg-surface-950 border border-surface-800 rounded-xl px-4 py-3 text-sm text-white">
              <option value="all">TODOS LOS ESTADOS</option>
              <option value="paid">PAGADOS</option>
              <option value="pending">PENDIENTES</option>
              <option value="overdue">VENCIDOS</option>
            </select>

            <select bind:value={typeFilter} class="bg-surface-950 border border-surface-800 rounded-xl px-4 py-3 text-sm text-white">
              <option value="all">TODOS LOS TIPOS</option>
              <option value="student">ESTUDIANTES</option>
              <option value="school">CENTROS</option>
            </select>

            <button onclick={() => { searchTerm = ''; statusFilter = 'all'; typeFilter = 'all'; }} class="btn-ghost flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-surface-500 hover:text-white">
              <X class="w-4 h-4" />
              LIMPIAR
            </button>
          </div>
        </div>

        <!-- Table View -->
        <div class="glass-panel overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-surface-900/50 border-b border-surface-800">
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-surface-500">Cliente</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-surface-500">Concepto</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-surface-500">Importe</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-surface-500">Vencimiento</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-surface-500">Estado</th>
                  <th class="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-800/50">
                {#each groupedPayments() as payment, i}
                  <tr class="hover:bg-surface-900/30 transition-colors group">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class={`w-10 h-10 rounded-lg flex items-center justify-center border border-surface-800 ${payment.payment_type === 'student' ? 'bg-blue-500/5 text-blue-400' : 'bg-purple-500/5 text-purple-400'}`}>
                          {#if payment.payment_type === 'student'}<Users class="w-5 h-5" />{:else}<School class="w-5 h-5" />{/if}
                        </div>
                        <div>
                          <p class="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{payment.student?.name || payment.school?.name}</p>
                          <p class={`text-[8px] font-black uppercase tracking-widest ${payment.payment_type === 'student' ? 'text-blue-500' : 'text-purple-500'}`}>{payment.payment_type}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <p class="text-sm font-medium text-surface-200">{conceptLabels[payment.concept]}</p>
                      <p class="text-[10px] text-surface-500 line-clamp-1">{payment.description}</p>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap font-black text-white">{formatCurrency(payment.amount)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-surface-400">{formatDate(payment.due_date)}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${statusThemes[payment.status]}`}>
                        {statusLabels[payment.status]}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2 outline-none">
                        <button onclick={() => handleViewPayment(payment.id)} class="p-2 text-surface-600 hover:text-white transition-colors"><Eye class="w-4 h-4" /></button>
                        <button onclick={() => handleEditPayment(payment.id)} class="p-2 text-surface-600 hover:text-primary-400 transition-colors"><Edit3 class="w-4 h-4" /></button>
                        <button class="p-2 text-surface-600 hover:text-blue-400 transition-colors"><Download class="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}

    {#if selectedTab === 'students' || selectedTab === 'schools'}
      {@const list = selectedTab === 'students' ? data.studentSummaries : data.schoolSummaries}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" in:fade>
        {#each (list as any[]) || [] as item}
          <div class="glass-card group hover:bg-surface-900/40 transition-all duration-300">
            <div class="p-6 space-y-6">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div class={`w-12 h-12 rounded-xl flex items-center justify-center border border-surface-800 shadow-xl group-hover:scale-110 transition-all ${selectedTab === 'students' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {#if selectedTab === 'students'}<Users class="w-6 h-6" />{:else}<School class="w-6 h-6" />{/if}
                  </div>
                  <div>
                    <h3 class="font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight line-clamp-1">{item.student_name || item.school_name}</h3>
                    <p class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">{selectedTab === 'students' ? 'Alumno' : 'Centro'}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-surface-950/50 rounded-xl border border-surface-900">
                  <p class="text-[8px] font-bold text-surface-600 uppercase tracking-widest mb-1">Pagado</p>
                  <p class="text-sm font-black text-green-400">{formatCurrency(item.paid_amount)}</p>
                </div>
                <div class="p-3 bg-surface-950/50 rounded-xl border border-surface-900">
                  <p class="text-[8px] font-bold text-surface-600 uppercase tracking-widest mb-1">Pendiente</p>
                  <p class="text-sm font-black text-yellow-500">{formatCurrency(item.pending_amount)}</p>
                </div>
                <div class="p-3 bg-surface-950/50 rounded-xl border border-surface-900">
                  <p class="text-[8px] font-bold text-surface-600 uppercase tracking-widest mb-1">Vencido</p>
                  <p class="text-sm font-black text-red-500">{formatCurrency(item.overdue_amount)}</p>
                </div>
                <div class="p-3 bg-surface-950/50 rounded-xl border border-surface-900">
                  <p class="text-[8px] font-bold text-surface-600 uppercase tracking-widest mb-1">Total</p>
                  <p class="text-sm font-black text-white">{formatCurrency(item.total_amount)}</p>
                </div>
              </div>

              <div class="pt-4 border-t border-surface-800 flex items-center justify-between">
                <div class="flex items-center gap-2 text-[10px] font-bold text-surface-500 uppercase">
                  <Calendar class="w-3 h-3" />
                  Prox: {item.next_due_date ? formatDate(item.next_due_date) : 'Fin'}
                </div>
                <button class="text-[10px] font-black text-primary-400 uppercase tracking-tighter hover:text-white transition-colors flex items-center gap-1">
                  Gestionar
                  <ChevronRight class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>

<style lang="postcss">
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
