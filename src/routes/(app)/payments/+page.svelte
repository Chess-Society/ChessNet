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
    ArrowLeft
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { PaymentWithDetails, PaymentStatus, PaymentType, PaymentConcept } from '$lib/types';

  export let data: PageData;

  let searchTerm = '';
  let statusFilter: PaymentStatus | 'all' = 'all';
  let typeFilter: PaymentType | 'all' = 'all';
  let conceptFilter: PaymentConcept | 'all' = 'all';
  let showFilters = false;
  let selectedTab: 'overview' | 'payments' | 'students' | 'schools' = 'overview';

  // Datos reactivos
  $: filteredPayments = data.payments?.filter((payment: PaymentWithDetails) => {
    const matchesSearch = !searchTerm || 
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.school?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.payment_type === typeFilter;
    const matchesConcept = conceptFilter === 'all' || payment.concept === conceptFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesConcept;
  }) || [];

  // Agrupar pagos por tipo (centros primero, luego estudiantes)
  $: groupedPayments = (() => {
    const schoolPayments = filteredPayments.filter(p => p.payment_type === 'school');
    const studentPayments = filteredPayments.filter(p => p.payment_type === 'student');
    
    // Ordenar centros por nombre
    const sortedSchools = schoolPayments.sort((a, b) => {
      const nameA = a.school?.name || '';
      const nameB = b.school?.name || '';
      return nameA.localeCompare(nameB);
    });
    
    // Ordenar estudiantes por nombre
    const sortedStudents = studentPayments.sort((a, b) => {
      const nameA = a.student?.name || '';
      const nameB = b.student?.name || '';
      return nameA.localeCompare(nameB);
    });
    
    return [...sortedSchools, ...sortedStudents];
  })();

  const handleCreatePayment = () => {
    goto('/payments/create');
  };

  const handleViewPayment = (paymentId: string) => {
    goto(`/payments/${paymentId}`);
  };

  const handleEditPayment = (paymentId: string) => {
    goto(`/payments/${paymentId}/edit`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const badges = {
      paid: { class: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Pagado' },
      pending: { class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Pendiente' },
      overdue: { class: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Vencido' },
      cancelled: { class: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Cancelado' },
      refunded: { class: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Reembolsado' }
    };
    return badges[status] || badges.pending;
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
  <title>Sistema de Pagos - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-slate-900">
  <!-- Header -->
  <div class="border-b border-slate-700/50 bg-slate-800/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center space-x-4">
          <button
            on:click={() => goto('/dashboard')}
            class="p-2 text-slate-400 hover:text-white transition-colors"
            title="Volver al Dashboard"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="p-2 bg-emerald-500/20 rounded-lg">
            <DollarSign class="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Sistema de Pagos</h1>
            <p class="text-slate-400">Gestión de cobros y facturación</p>
          </div>
        </div>
        
        <button
          on:click={handleCreatePayment}
          class="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Nuevo Pago</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Tabs Navigation -->
  <div class="border-b border-slate-700/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex space-x-12">
        <button
          on:click={() => selectedTab = 'overview'}
          class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'overview' 
            ? 'border-emerald-500 text-emerald-400' 
            : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
        >
          Resumen
        </button>
        <button
          on:click={() => selectedTab = 'payments'}
          class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'payments' 
            ? 'border-emerald-500 text-emerald-400' 
            : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
        >
          Todos los Pagos
        </button>
        <button
          on:click={() => selectedTab = 'students'}
          class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'students' 
            ? 'border-emerald-500 text-emerald-400' 
            : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
        >
          Por Estudiante
        </button>
        <button
          on:click={() => selectedTab = 'schools'}
          class="py-4 px-2 border-b-2 font-medium text-sm transition-colors {selectedTab === 'schools' 
            ? 'border-emerald-500 text-emerald-400' 
            : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}"
        >
          Por Centro
        </button>
      </nav>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Tab: Resumen -->
    {#if selectedTab === 'overview'}
      <div class="space-y-8">
        <!-- KPIs Principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Ingresos Este Mes -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 bg-emerald-500/20 rounded-lg">
                <DollarSign class="w-6 h-6 text-emerald-400" />
              </div>
              {#if data.paymentStats?.revenue_growth_percentage > 0}
                <div class="flex items-center space-x-1 text-emerald-400">
                  <TrendingUp class="w-4 h-4" />
                  <span class="text-sm">+{data.paymentStats.revenue_growth_percentage}%</span>
                </div>
              {:else if data.paymentStats?.revenue_growth_percentage < 0}
                <div class="flex items-center space-x-1 text-red-400">
                  <TrendingDown class="w-4 h-4" />
                  <span class="text-sm">{data.paymentStats.revenue_growth_percentage}%</span>
                </div>
              {/if}
            </div>
            <h3 class="text-2xl font-bold text-white mb-1">
              {formatCurrency(data.paymentStats?.total_revenue_this_month || 0)}
            </h3>
            <p class="text-slate-400 text-sm">Ingresos este mes</p>
          </div>

          <!-- Pagos Pendientes -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 bg-yellow-500/20 rounded-lg">
                <Clock class="w-6 h-6 text-yellow-400" />
              </div>
              <span class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                {data.paymentStats?.pending_payments_count || 0}
              </span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-1">Pendientes</h3>
            <p class="text-slate-400 text-sm">Por cobrar</p>
          </div>

          <!-- Pagos Vencidos -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle class="w-6 h-6 text-red-400" />
              </div>
              <span class="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                {data.paymentStats?.overdue_payments_count || 0}
              </span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-1">
              {formatCurrency(data.paymentStats?.overdue_amount || 0)}
            </h3>
            <p class="text-slate-400 text-sm">Vencidos</p>
          </div>

          <!-- Promedio por Pago -->
          <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 class="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white mb-1">
              {formatCurrency(data.paymentStats?.average_payment_amount || 0)}
            </h3>
            <p class="text-slate-400 text-sm">Promedio por pago</p>
          </div>
        </div>

        <!-- Pagos Recientes -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg">
          <div class="p-6 border-b border-slate-700/50">
            <h2 class="text-lg font-semibold text-white">Pagos Recientes</h2>
          </div>
          <div class="p-6">
            {#if data.payments && data.payments.length > 0}
              <div class="space-y-4">
                {#each data.payments.slice(0, 5) as payment}
                  <div class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div class="flex items-center space-x-4">
                      <div class="p-2 bg-slate-600/50 rounded-lg">
                        {#if payment.payment_type === 'student'}
                          <Users class="w-5 h-5 text-slate-400" />
                        {:else}
                          <School class="w-5 h-5 text-slate-400" />
                        {/if}
                      </div>
                      <div>
                        <h4 class="font-medium text-white">
                          {payment.student?.name || payment.school?.name || 'Sin nombre'}
                        </h4>
                        <p class="text-sm text-slate-400">{payment.description}</p>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                      <div class="text-right">
                        <p class="font-semibold text-white">{formatCurrency(payment.amount)}</p>
                        <p class="text-sm text-slate-400">{formatDate(payment.due_date)}</p>
                      </div>
                      
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusBadge(payment.status).class}">
                        {getStatusBadge(payment.status).label}
                      </span>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8">
                <DollarSign class="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p class="text-slate-400">No hay pagos registrados</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Alertas y Recordatorios -->
        {#if data.paymentStats?.overdue_payments_count > 0}
          <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <div class="flex items-center space-x-3">
              <AlertTriangle class="w-6 h-6 text-red-400" />
              <div>
                <h3 class="font-semibold text-red-400">Atención: Pagos Vencidos</h3>
                <p class="text-red-300/80">
                  Tienes {data.paymentStats.overdue_payments_count} pagos vencidos por un total de {formatCurrency(data.paymentStats.overdue_amount)}
                </p>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Tab: Todos los Pagos -->
    {#if selectedTab === 'payments'}
      <div class="space-y-6">
        <!-- Filtros y Búsqueda -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <!-- Búsqueda -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar pagos, estudiantes o centros..."
                bind:value={searchTerm}
                class="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 w-full lg:w-80"
              />
            </div>

            <!-- Filtros -->
            <div class="flex items-center space-x-3">
              <button
                on:click={() => showFilters = !showFilters}
                class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
              >
                <Filter class="w-4 h-4" />
                <span>Filtros</span>
                <ChevronDown class="w-4 h-4 transition-transform {showFilters ? 'rotate-180' : ''}" />
              </button>
            </div>
          </div>

          <!-- Panel de filtros expandible -->
          {#if showFilters}
            <div class="mt-4 pt-4 border-t border-slate-700/50">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label for="status-filter" class="block text-sm font-medium text-slate-300 mb-2">Estado</label>
                  <select
                    id="status-filter"
                    bind:value={statusFilter}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="paid">Pagado</option>
                    <option value="pending">Pendiente</option>
                    <option value="overdue">Vencido</option>
                    <option value="cancelled">Cancelado</option>
                    <option value="refunded">Reembolsado</option>
                  </select>
                </div>

                <div>
                  <label for="type-filter" class="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                  <select
                    id="type-filter"
                    bind:value={typeFilter}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="student">Estudiante</option>
                    <option value="school">Centro</option>
                  </select>
                </div>

                <div>
                  <label for="concept-filter" class="block text-sm font-medium text-slate-300 mb-2">Concepto</label>
                  <select
                    id="concept-filter"
                    bind:value={conceptFilter}
                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="all">Todos los conceptos</option>
                    <option value="monthly_fee">Mensualidad</option>
                    <option value="registration">Inscripción</option>
                    <option value="tournament">Torneo</option>
                    <option value="material">Material</option>
                    <option value="private_lesson">Clase Particular</option>
                    <option value="other">Otros</option>
                  </select>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Lista de Pagos -->
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-700/30">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Cliente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Concepto</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Importe</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Vencimiento</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {#each groupedPayments as payment, index}
                  <!-- Separador visual entre centros y estudiantes -->
                  {#if index > 0 && groupedPayments[index - 1].payment_type === 'school' && payment.payment_type === 'student'}
                    <tr>
                      <td colspan="6" class="px-6 py-3 bg-slate-700/20 border-t-2 border-slate-600/50">
                        <div class="flex items-center space-x-2">
                          <Users class="w-4 h-4 text-blue-400" />
                          <span class="text-sm font-medium text-blue-400">ESTUDIANTES INDIVIDUALES</span>
                        </div>
                      </td>
                    </tr>
                  {/if}
                  
                  <!-- Encabezado de sección para centros -->
                  {#if index === 0 && payment.payment_type === 'school'}
                    <tr>
                      <td colspan="6" class="px-6 py-3 bg-slate-700/20">
                        <div class="flex items-center space-x-2">
                          <School class="w-4 h-4 text-purple-400" />
                          <span class="text-sm font-medium text-purple-400">CENTROS EDUCATIVOS</span>
                        </div>
                      </td>
                    </tr>
                  {/if}
                  
                  <!-- Encabezado de sección para estudiantes (si no hay centros) -->
                  {#if index === 0 && payment.payment_type === 'student'}
                    <tr>
                      <td colspan="6" class="px-6 py-3 bg-slate-700/20">
                        <div class="flex items-center space-x-2">
                          <Users class="w-4 h-4 text-blue-400" />
                          <span class="text-sm font-medium text-blue-400">ESTUDIANTES INDIVIDUALES</span>
                        </div>
                      </td>
                    </tr>
                  {/if}

                  <tr class="hover:bg-slate-700/30 transition-colors border-b border-slate-700/30">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="p-2 {payment.payment_type === 'student' ? 'bg-blue-500/20' : 'bg-purple-500/20'} rounded-lg mr-3">
                          {#if payment.payment_type === 'student'}
                            <Users class="w-4 h-4 {payment.payment_type === 'student' ? 'text-blue-400' : 'text-purple-400'}" />
                          {:else}
                            <School class="w-4 h-4 {payment.payment_type === 'student' ? 'text-blue-400' : 'text-purple-400'}" />
                          {/if}
                        </div>
                        <div>
                          <div class="text-sm font-medium text-white">
                            {payment.student?.name || payment.school?.name || 'Sin nombre'}
                          </div>
                          <div class="text-sm {payment.payment_type === 'student' ? 'text-blue-400/80' : 'text-purple-400/80'}">
                            {payment.payment_type === 'student' ? 'Estudiante' : 'Centro'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-white">{getConceptLabel(payment.concept)}</div>
                      <div class="text-sm text-slate-400">{payment.description}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-white">{formatCurrency(payment.amount)}</div>
                      {#if payment.currency !== 'EUR'}
                        <div class="text-sm text-slate-400">{payment.currency}</div>
                      {/if}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-white">{formatDate(payment.due_date)}</div>
                      {#if payment.paid_date}
                        <div class="text-sm text-emerald-400">Pagado: {formatDate(payment.paid_date)}</div>
                      {/if}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusBadge(payment.status).class}">
                        {getStatusBadge(payment.status).label}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center space-x-2">
                        <button
                          on:click={() => handleViewPayment(payment.id)}
                          class="text-slate-400 hover:text-white transition-colors"
                          title="Ver detalles"
                        >
                          <Eye class="w-4 h-4" />
                        </button>
                        <button
                          on:click={() => handleEditPayment(payment.id)}
                          class="text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Editar"
                        >
                          <Edit3 class="w-4 h-4" />
                        </button>
                        <button
                          class="text-slate-400 hover:text-blue-400 transition-colors"
                          title="Descargar factura"
                        >
                          <Download class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
          
          {#if groupedPayments.length === 0}
            <div class="text-center py-12">
              <DollarSign class="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p class="text-slate-400">No se encontraron pagos</p>
              {#if searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || conceptFilter !== 'all'}
                <button
                  on:click={() => {
                    searchTerm = '';
                    statusFilter = 'all';
                    typeFilter = 'all';
                    conceptFilter = 'all';
                  }}
                  class="mt-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Limpiar filtros
                </button>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Tab: Por Estudiante -->
    {#if selectedTab === 'students'}
      <div class="space-y-6">
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg">
          <div class="p-6 border-b border-slate-700/50">
            <h2 class="text-lg font-semibold text-white">Resumen de Pagos por Estudiante</h2>
          </div>
          <div class="p-6">
            {#if data.studentSummaries && data.studentSummaries.length > 0}
              <div class="space-y-4">
                {#each data.studentSummaries as student}
                  <div class="p-6 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="p-2 bg-blue-500/20 rounded-lg">
                          <Users class="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 class="font-semibold text-white">{student.student_name}</h3>
                          <p class="text-sm text-slate-400">Estudiante individual</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-lg font-bold text-white">{formatCurrency(student.total_amount)}</p>
                        <p class="text-sm text-slate-400">Total facturado</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p class="text-sm text-slate-400">Pagado</p>
                        <p class="font-semibold text-emerald-400">{formatCurrency(student.paid_amount)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-slate-400">Pendiente</p>
                        <p class="font-semibold text-yellow-400">{formatCurrency(student.pending_amount)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-slate-400">Vencido</p>
                        <p class="font-semibold text-red-400">{formatCurrency(student.overdue_amount)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-slate-400">Próximo vencimiento</p>
                        <p class="font-semibold text-white">
                          {student.next_due_date ? formatDate(student.next_due_date) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8">
                <Users class="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p class="text-slate-400">No hay resúmenes de estudiantes</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}

    <!-- Tab: Por Centro -->
    {#if selectedTab === 'schools'}
      <div class="space-y-6">
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg">
          <div class="p-6 border-b border-slate-700/50">
            <h2 class="text-lg font-semibold text-white">Resumen de Pagos por Centro</h2>
          </div>
          <div class="p-6">
            {#if data.schoolSummaries && data.schoolSummaries.length > 0}
              <div class="space-y-4">
                {#each data.schoolSummaries as school}
                  <div class="p-6 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center space-x-3">
                        <div class="p-2 bg-purple-500/20 rounded-lg">
                          <School class="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h3 class="font-semibold text-white">{school.school_name}</h3>
                          <p class="text-sm text-slate-400">Centro educativo</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-lg font-bold text-white">{formatCurrency(school.total_amount)}</p>
                        <p class="text-sm text-slate-400">Total facturado</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p class="text-sm text-slate-400">Pagado</p>
                        <p class="font-semibold text-emerald-400">{formatCurrency(school.paid_amount)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-slate-400">Pendiente</p>
                        <p class="font-semibold text-yellow-400">{formatCurrency(school.pending_amount)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-slate-400">Vencido</p>
                        <p class="font-semibold text-red-400">{formatCurrency(school.overdue_amount)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-slate-400">Próximo vencimiento</p>
                        <p class="font-semibold text-white">
                          {school.next_due_date ? formatDate(school.next_due_date) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="text-center py-8">
                <School class="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p class="text-slate-400">No hay resúmenes de centros</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
