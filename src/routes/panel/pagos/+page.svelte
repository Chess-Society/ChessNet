<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    DollarSign, 
    Plus, 
    Search, 
    Filter, 
    Calendar,
    Users,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronRight,
    TrendingUp,
    CreditCard
  } from 'lucide-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly } from 'svelte/transition';

  let searchQuery = $state('');

  // Datos reactivos
  let payments = $derived($appStore.payments || []);
  let students = $derived($appStore.students || []);

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || 'Desconocido';
  };

  const filteredPayments = $derived(() => {
    return payments
      .filter(p => getStudentName(p.student_id || p.studentId || '').toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a,b) => (b.paid_date || b.date || '').localeCompare(a.paid_date || a.date || ''));
  });

  // Métricas financieras
  const stats = $derived(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTotal = payments
      .filter(p => {
        const d = new Date(p.paid_date || p.date || '');
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, p) => acc + p.amount, 0);

    return { monthlyTotal };
  });

  // Para el modal de nuevo pago
  let showModal = $state(false);
  let newPayment = $state({
    student_id: '',
    amount: 0,
    paid_date: new Date().toISOString().split('T')[0],
    concept: 'monthly_fee' as any
  });

  const addPayment = () => {
    if (!newPayment.student_id || newPayment.amount <= 0) return;
    appStore.addPayment({
      ...newPayment,
      id: crypto.randomUUID()
    });
    showModal = false;
    newPayment = { student_id: '', amount: 0, paid_date: new Date().toISOString().split('T')[0], concept: 'monthly_fee' as any };
  };

</script>

<svelte:head>
  <title>Sistema de Pagos - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" transition:fade>
  
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6">
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center text-teal-500">
          <DollarSign class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Finanzas y Pagos</h1>
          <p class="text-slate-400 text-sm">Gestiona los cobros de tus alumnos y el rendimiento de tu academia.</p>
        </div>
      </div>
    </div>

    <button 
      onclick={() => showModal = true}
      class="bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-500 transition-all shadow-lg shadow-teal-900/20 flex items-center gap-2"
    >
      <Plus class="w-4 h-4" />
      Registrar Pago
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
     <div class="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
           <TrendingUp class="w-16 h-16 text-teal-500" />
        </div>
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Ingresos este mes</p>
        <p class="text-3xl font-bold text-white">{stats().monthlyTotal}€</p>
        <p class="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-bold">
           <ArrowUpRight class="w-3.5 h-3.5" /> +15.2% vs mes anterior
        </p>
     </div>
     
     <div class="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Pagos Pendientes</p>
        <p class="text-3xl font-bold text-white">0</p>
        <p class="text-xs text-slate-500 mt-2">Todo al día</p>
     </div>

     <div class="bg-gradient-to-br from-teal-900/30 to-slate-900/30 p-6 rounded-3xl border border-teal-500/20">
        <p class="text-teal-500 text-[10px] font-bold uppercase tracking-widest mb-1">Suscripción SaaS</p>
        <p class="text-xl font-bold text-white">Plan Maestro Premium</p>
        <p class="text-xs text-slate-400 mt-2 italic">Próxima renovación: 01 May 2026</p>
     </div>
  </div>

  <div class="relative group mb-6">
    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-500 transition-colors" />
    <input
      type="text"
      placeholder="Buscar por nombre de alumno..."
      bind:value={searchQuery}
      class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-teal-500/50 outline-none transition-all backdrop-blur-xl"
    />
  </div>

  <div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
              <thead>
                  <tr class="bg-slate-900/50 border-b border-slate-800">
                      <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alumno</th>
                      <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Concepto</th>
                      <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha</th>
                      <th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Monto</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/50">
                  {#if filteredPayments().length === 0}
                      <tr>
                          <td colspan="4" class="px-6 py-12 text-center text-slate-500 text-sm">No se han registrado pagos todavía.</td>
                      </tr>
                  {:else}
                      {#each filteredPayments() as p}
                          <tr class="hover:bg-slate-800/30 transition-colors group">
                              <td class="px-6 py-4">
                                  <div class="flex items-center gap-3">
                                      <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-teal-500">
                                          {getStudentName(p.student_id || p.studentId || '')[0]}
                                      </div>
                                      <span class="text-sm font-bold text-white">{getStudentName(p.student_id || p.studentId || '')}</span>
                                  </div>
                              </td>
                              <td class="px-6 py-4">
                                  <span class="text-xs text-slate-400 capitalize">{p.concept.replace('_', ' ')}</span>
                              </td>
                              <td class="px-6 py-4">
                                  <span class="text-xs text-slate-500">{new Date(p.paid_date || p.date || '').toLocaleDateString('es-ES')}</span>
                              </td>
                              <td class="px-6 py-4 text-right">
                                  <span class="text-sm font-bold text-teal-400">{p.amount}€</span>
                              </td>
                          </tr>
                      {/each}
                  {/if}
              </tbody>
          </table>
      </div>
  </div>

  <!-- Modal Nuevo Pago -->
  {#if showModal}
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" transition:fade>
        <div class="bg-[#1e293b] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl" in:fly={{y: 20}}>
            <div class="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 class="text-xl font-bold text-white">Registrar Nuevo Pago</h3>
                <button onclick={() => showModal = false} class="text-slate-500 hover:text-white transition-colors">
                   <Plus class="w-6 h-6 rotate-45" />
                </button>
            </div>
            
            <div class="p-8 space-y-6">
                <div class="space-y-2">
                    <label for="student-select" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Alumno</label>
                    <select id="student-select" bind:value={newPayment.student_id} class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none transition-all">
                        <option value="">Seleccionar alumno...</option>
                        {#each students as s}
                            <option value={s.id}>{s.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label for="payment-amount" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Monto (€)</label>
                        <input id="payment-amount" type="number" bind:value={newPayment.amount} class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none transition-all" />
                    </div>
                    <div class="space-y-2">
                        <label for="payment-date" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha</label>
                        <input id="payment-date" type="date" bind:value={newPayment.paid_date} class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none transition-all" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="payment-concept" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Concepto</label>
                    <input id="payment-concept" type="text" bind:value={newPayment.concept} class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-500 outline-none transition-all" />
                </div>

                <button 
                  onclick={addPayment}
                  class="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-teal-900/20 transition-all flex items-center justify-center gap-2"
                >
                    <CreditCard class="w-5 h-5" />
                    Confirmar Registro
                </button>
            </div>
        </div>
    </div>
  {/if}

</div>
