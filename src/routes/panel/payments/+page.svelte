<script lang="ts">
  import { onMount } from 'svelte';
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
    CheckCircle
  } from 'phosphor-svelte';
  import { appStore } from '$lib/stores/appStore';
  import { fade, fly, scale } from 'svelte/transition';

  let searchQuery = $state('');

  // Reactive data using Runes
  let payments = $derived($appStore.payments || []);
  let students = $derived($appStore.students || []);

  const getStudentName = (id: string) => {
    return students.find(s => s.id === id)?.name || 'Unknown';
  };

  const filteredPayments = $derived(
    payments
      .filter(p => getStudentName(p.student_id || '').toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a,b) => (b.paid_date || '').localeCompare(a.paid_date || ''))
  );

  // Financial metrics calculated with derived
  const metrics = $derived.by(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyTotal = payments
      .filter(p => {
        const d = new Date(p.paid_date || '');
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, p) => acc + p.amount, 0);

    const prevMonthTotal = payments
      .filter(p => {
        const d = new Date(p.paid_date || '');
        return d.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) && 
               d.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
      })
      .reduce((acc, p) => acc + p.amount, 0);

    const growth = prevMonthTotal > 0 ? ((monthlyTotal - prevMonthTotal) / prevMonthTotal) * 100 : 0;
    
    return { 
      monthlyTotal, 
      prevMonthTotal, 
      growth: growth.toFixed(1),
      totalCount: payments.length,
      averageTicket: payments.length > 0 ? (payments.reduce((acc, p) => acc + p.amount, 0) / payments.length).toFixed(2) : 0
    };
  });

  // For the new payment modal
  let showModal = $state(false);
  let newPayment = $state({
    student_id: '',
    amount: 0,
    paid_date: new Date().toISOString().split('T')[0],
    concept: 'Monthly Fee'
  });

  const addPayment = () => {
    if (!newPayment.student_id || newPayment.amount <= 0) return;
    appStore.addPayment({
      ...newPayment,
      id: crypto.randomUUID()
    });
    showModal = false;
    newPayment = { student_id: '', amount: 0, paid_date: new Date().toISOString().split('T')[0], concept: 'Monthly Fee' };
  };

</script>

<svelte:head>
  <title>Payments & Finance - ChessNet</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 pb-20" transition:fade>
  
  <!-- Header Section -->
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 pt-10">
    <div class="space-y-4">
      <div class="flex items-center gap-5">
        <div class="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-[24px] flex items-center justify-center text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.1)] group">
          <Wallet size={36} weight="duotone" class="group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <h1 class="text-4xl font-outfit font-black text-white tracking-tight uppercase leading-none">Finance Hub</h1>
          <p class="text-slate-500 font-jakarta text-sm mt-2 tracking-wide font-medium">Total control of academy revenue and billing.</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
        <button 
          onclick={() => showModal = true}
          class="btn-pill bg-violet-600 text-white px-10 py-5 font-bold hover:bg-violet-500 transition-all shadow-violet-flare flex items-center gap-3 group active:scale-95"
        >
          <Plus size={22} weight="bold" class="transition-transform group-hover:rotate-90" />
          REGISTER PAYMENT
        </button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
     <!-- Ingresos Mes -->
     <div class="bento-card p-8 group">
        <div class="absolute -top-4 -right-4 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
           <TrendUp size={140} weight="duotone" class="text-violet-400" />
        </div>
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 font-jakarta relative z-10">Revenue this month</p>
        <div class="flex items-baseline gap-1 relative z-10">
          <span class="text-5xl font-outfit font-black text-white tracking-tighter">{metrics.monthlyTotal}</span>
          <span class="text-2xl font-outfit font-bold text-violet-400">€</span>
        </div>
        <div class="flex items-center gap-2 mt-6 relative z-10">
          <div class="flex items-center gap-1 bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full text-[10px] font-black border border-primary-500/20">
            <ArrowUpRight size={12} weight="bold" /> {metrics.growth}%
          </div>
          <span class="text-[9px] text-slate-500 font-bold uppercase tracking-widest">vs last month</span>
        </div>
     </div>
     
     <!-- Ticket Promedio -->
     <div class="bento-card p-8 group">
        <div class="absolute -top-4 -right-4 opacity-10 group-hover:scale-110 transition-all duration-700">
           <Receipt size={140} weight="duotone" class="text-primary-400" />
        </div>
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 font-jakarta relative z-10">Average Ticket</p>
        <div class="flex items-baseline gap-1 relative z-10">
          <span class="text-5xl font-outfit font-black text-white tracking-tighter">{metrics.averageTicket}</span>
          <span class="text-2xl font-outfit font-bold text-primary-400">€</span>
        </div>
        <p class="text-[9px] text-slate-500 mt-6 font-bold uppercase tracking-widest relative z-10">Based on {metrics.totalCount} transactions</p>
     </div>

     <!-- Alumnos al día -->
     <div class="bento-card p-8 group">
        <div class="absolute -top-4 -right-4 opacity-10 group-hover:scale-110 transition-all duration-700">
           <CheckCircle size={140} weight="duotone" class="text-blue-400" />
        </div>
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 font-jakarta relative z-10">Portfolio Status</p>
        <div class="flex items-baseline gap-2 relative z-10">
          <span class="text-5xl font-outfit font-black text-white tracking-tighter">100</span>
          <span class="text-2xl font-outfit font-bold text-blue-400">%</span>
        </div>
        <div class="flex items-center gap-2 mt-6 relative z-10">
            <div class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
            <span class="text-[9px] text-primary-400 font-black uppercase tracking-widest">Up to date</span>
        </div>
     </div>

     <!-- SaaS Status -->
     <div class="bento-card p-8 border-violet-500/30 bg-gradient-to-br from-violet-600/10 to-transparent">
        <div class="flex items-center justify-between mb-4">
            <p class="text-violet-400 text-[10px] font-black uppercase tracking-[0.2em] font-jakarta">SaaS Subscription</p>
            <div class="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-lg">
                <CurrencyEur size={18} weight="bold" />
            </div>
        </div>
        <p class="text-2xl font-outfit font-black text-white mb-1 uppercase tracking-tight">Premium Master</p>
        <div class="flex items-center gap-2 text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest">
          <CalendarBlank size={16} class="text-violet-400" />
          RENEWAL: 01 MAY 2026
        </div>
     </div>
  </div>

  <!-- Search and Actions Bar -->
  <div class="flex flex-col md:flex-row gap-4 mb-8">
      <div class="relative flex-1 group">
        <MagnifyingGlass size={20} class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
        <input
          type="text"
          placeholder="Search transactions by student..."
          bind:value={searchQuery}
          class="w-full bg-white/[0.03] border border-white/10 rounded-[20px] pl-16 pr-6 py-5 text-sm text-white focus:border-violet-500/50 focus:bg-white/[0.05] outline-none transition-all backdrop-blur-xl font-jakarta font-medium placeholder:text-slate-600"
        />
      </div>
      <button class="px-6 py-5 bg-white/[0.03] border border-white/10 rounded-[20px] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-3">
          <Funnel size={20} weight="duotone" />
          <span class="text-xs font-black uppercase tracking-widest">Advanced Filters</span>
      </button>
  </div>

  <!-- Transactions Table/List -->
  <div class="bento-card border border-white/5 shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse font-jakarta">
              <thead>
                  <tr class="bg-white/[0.02] border-b border-white/5">
                      <th class="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Competitor</th>
                      <th class="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Reference / Concept</th>
                      <th class="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Accounting Date</th>
                      <th class="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Amount</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                  {#if filteredPayments.length === 0}
                      <tr>
                          <td colspan="4" class="px-10 py-32 text-center" in:fade>
                            <div class="flex flex-col items-center gap-4 opacity-20">
                                <Receipt size={64} weight="duotone" />
                                <p class="text-sm font-black uppercase tracking-widest">No transactions registered</p>
                            </div>
                          </td>
                      </tr>
                  {:else}
                      {#each filteredPayments as p (p.id)}
                          <tr class="hover:bg-white/[0.015] transition-all group cursor-pointer" in:fly={{ y: 10, duration: 400 }}>
                              <td class="px-10 py-6">
                                  <div class="flex items-center gap-4">
                                      <div class="w-12 h-12 rounded-[16px] bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-sm font-outfit font-black text-violet-400 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shadow-lg">
                                          {getStudentName(p.student_id || '')[0].toUpperCase()}
                                      </div>
                                      <div>
                                          <span class="text-sm font-black text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{getStudentName(p.student_id || '')}</span>
                                          <p class="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-0.5">Active Student</p>
                                      </div>
                                  </div>
                              </td>
                              <td class="px-10 py-6">
                                  <div class="flex items-center gap-3">
                                      <FileText size={16} class="text-slate-600 group-hover:text-violet-400 transition-colors" />
                                      <span class="text-xs text-slate-400 font-medium">{p.concept}</span>
                                  </div>
                              </td>
                              <td class="px-10 py-6">
                                  <div class="flex items-center gap-3">
                                      <CalendarBlank size={16} class="text-slate-600" />
                                      <span class="text-xs text-slate-500 font-bold uppercase tracking-widest">{new Date(p.paid_date || '').toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                  </div>
                              </td>
                              <td class="px-10 py-6 text-right">
                                  <div class="flex flex-col items-end">
                                      <span class="text-lg font-outfit font-black text-violet-400 group-hover:text-violet-300 transition-colors tracking-tight">{p.amount}€</span>
                                      <span class="text-[9px] font-black text-primary-500/60 uppercase tracking-widest">Completed</span>
                                  </div>
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
    <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4" transition:fade>
        <div 
          class="bg-[#09090b] border border-white/10 w-full max-w-xl rounded-[40px] shadow-[0_0_100px_rgba(139,92,246,0.15)] overflow-hidden relative" 
          in:scale={{ start: 0.9, duration: 400, opacity: 0 }}
        >
            <!-- Decorative light -->
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div class="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
                <div class="flex items-center gap-5">
                    <div class="w-14 h-14 bg-violet-600 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-violet-600/20">
                        <CreditCard size={28} weight="duotone" />
                    </div>
                    <div>
                      <h3 class="text-2xl font-outfit font-black text-white tracking-tight uppercase">Register Payment</h3>
                      <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Enter billing details.</p>
                    </div>
                </div>
                <button 
                  onclick={() => showModal = false} 
                  class="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/10 active:scale-90"
                >
                   <X size={22} weight="bold" />
                </button>
            </div>
            
            <div class="p-10 space-y-8 font-jakarta relative z-10">
                <div class="space-y-3">
                    <label for="student-select" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Select Competitor</label>
                    <div class="relative group">
                      <IdentificationCard size={22} class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
                      <select 
                        id="student-select" 
                        bind:value={newPayment.student_id} 
                        class="w-full bg-white/5 border border-white/10 rounded-[20px] pl-16 pr-8 py-5 text-sm font-bold text-white focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all appearance-none cursor-pointer"
                      >
                          <option value="" class="bg-[#121214]">CHOOSE STUDENT...</option>
                          {#each students as s}
                              <option value={s.id} class="bg-[#121214]">{s.name.toUpperCase()}</option>
                          {/each}
                      </select>
                      <CaretRight size={18} class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 rotate-90" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-8">
                    <div class="space-y-3">
                        <label for="payment-amount" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Net Amount (€)</label>
                        <div class="relative group">
                          <CurrencyEur size={22} class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                          <input 
                            id="payment-amount" 
                            type="number" 
                            bind:value={newPayment.amount} 
                            class="w-full bg-white/5 border border-white/10 rounded-[20px] pl-16 pr-6 py-5 text-sm font-bold focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all text-primary-400 placeholder:text-slate-800" 
                            placeholder="0.00"
                          />
                        </div>
                    </div>
                    <div class="space-y-3">
                        <label for="payment-date" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Accounting Date</label>
                        <div class="relative group">
                          <input 
                            id="payment-date" 
                            type="date" 
                            bind:value={newPayment.paid_date} 
                            class="w-full bg-white/5 border border-white/10 rounded-[20px] px-6 py-5 text-sm font-bold text-white focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all font-outfit" 
                          />
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <label for="payment-concept" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Billing Concept</label>
                    <div class="relative group">
                        <FileText size={22} class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors" />
                        <input 
                        id="payment-concept" 
                        type="text" 
                        bind:value={newPayment.concept} 
                        class="w-full bg-white/5 border border-white/10 rounded-[20px] pl-16 pr-6 py-5 text-sm font-bold text-white focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 outline-none transition-all placeholder:text-slate-800" 
                        placeholder="E.G. SEPTEMBER MONTHLY FEE"
                        />
                    </div>
                </div>

                <div class="pt-4 flex gap-4">
                    <button 
                         onclick={() => showModal = false}
                         class="flex-1 px-8 py-5 rounded-[22px] bg-white/5 border border-white/10 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button 
                      onclick={addPayment}
                      class="flex-[2] btn-pill bg-violet-600 hover:bg-violet-500 text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-[22px] transition-all flex items-center justify-center gap-3 shadow-violet-flare group active:scale-95"
                    >
                        <CheckCircle size={22} weight="fill" class="group-hover:scale-110 transition-transform" />
                        EXECUTE REGISTRATION
                    </button>
                </div>
            </div>
        </div>
    </div>
  {/if}

</div>

<style>
    /* Premium Table Styling */
    table {
        border-collapse: separate;
        border-spacing: 0;
    }
    
    ::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.3s;
    }

    ::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
    }
</style>
