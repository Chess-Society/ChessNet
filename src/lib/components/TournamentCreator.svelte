<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    X, 
    Trophy, 
    Users, 
    Clock, 
    Calendar,
    Plus,
    Minus,
    AlertCircle,
    Info
  } from 'lucide-svelte';
  import { getLocalTournamentsApi } from '$lib/api/local-tournaments';
  import { studentsApi } from '$lib/api/students';
  import { schoolsApi } from '$lib/api/schools';
  import type { 
    CreateTournamentForm, 
    Student, 
    School,
    LocalTournament
  } from '$lib/types';

  interface Props {
    onCreated?: (tournament: LocalTournament) => void;
    onClose?: () => void;
  }

  let { onCreated, onClose }: Props = $props();

  // Form data
  let formData = $state<CreateTournamentForm>({
    name: '',
    format: 'swiss',
    school_id: '',
    time_control: '',
    startAt: '',
    endAt: '',
    roundsPlanned: undefined,
    notes: '',
    selected_students: []
  });

  // UI state
  let isOpen = $state(false);
  let isLoading = $state(false);
  let error = $state('');
  let step = $state(1); // 1: Basic info, 2: Players selection, 3: Confirmation

  // Data
  let students = $state<Student[]>([]);
  let schools = $state<School[]>([]);
  let searchTerm = $state('');

  // Form validation
  let isFormValid = $derived(!!formData.name.trim() && formData.selected_students.length >= 2);
  
  function calculateDefaultRounds(playerCount: number, format: string): number {
    if (playerCount < 2) return 1;
    
    switch (format) {
      case 'swiss':
        return Math.ceil(Math.log2(playerCount));
      case 'round_robin':
        return playerCount - 1;
      case 'knockout':
        return Math.ceil(Math.log2(playerCount));
      default:
        return 1;
    }
  }

  let calculatedRounds = $derived(calculateDefaultRounds(formData.selected_students.length, formData.format));
  
  let filteredStudents = $derived(
    searchTerm.trim() 
      ? students.filter(student => 
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (student.first_name && student.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (student.last_name && student.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : students
  );

  export function open() {
    isOpen = true;
    loadData();
  }

  export function close() {
    isOpen = false;
    resetForm();
    onClose?.();
  }

  function resetForm() {
    formData.name = '';
    formData.format = 'swiss';
    formData.school_id = '';
    formData.time_control = '';
    formData.startAt = '';
    formData.endAt = '';
    formData.roundsPlanned = undefined;
    formData.notes = '';
    formData.selected_students = [];
    
    step = 1;
    error = '';
    searchTerm = '';
  }

  async function loadData() {
    try {
      isLoading = true;
      const [studentsData, schoolsData] = await Promise.all([
        studentsApi.getMyStudents(),
        schoolsApi.getMySchools()
      ]);
      
      students = studentsData;
      schools = schoolsData;
    } catch (err) {
      console.error('Error loading data:', err);
      error = 'Error al cargar los datos';
    } finally {
      isLoading = false;
    }
  }

  function toggleStudent(studentId: string) {
    if (formData.selected_students.includes(studentId)) {
      formData.selected_students = formData.selected_students.filter(id => id !== studentId);
    } else {
      formData.selected_students = [...formData.selected_students, studentId];
    }
  }

  function selectAllStudents() {
    formData.selected_students = filteredStudents.map(s => s.id);
  }

  function deselectAllStudents() {
    formData.selected_students = [];
  }

  function nextStep() {
    if (step === 1 && formData.name.trim()) {
      step = 2;
    } else if (step === 2 && formData.selected_students.length >= 2) {
      step = 3;
    }
  }

  function prevStep() {
    if (step > 1) {
      step--;
    }
  }

  async function createTournament() {
    if (!isFormValid) return;

    try {
      isLoading = true;
      error = '';

      const api = await getLocalTournamentsApi();
      const tournamentResult = await api.createTournament({
        ...formData,
        roundsPlanned: formData.roundsPlanned || calculatedRounds
      });

      onCreated?.(tournamentResult);
      close();
    } catch (err) {
      console.error('Error creating tournament:', err);
      error = err instanceof Error ? err.message : 'Error al crear el torneo';
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    // Set default dates
    const now = new Date();
    formData.startAt = now.toISOString().slice(0, 16);
    
    const endDate = new Date(now);
    endDate.setHours(now.getHours() + 3);
    formData.endAt = endDate.toISOString().slice(0, 16);
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-700">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-yellow-500/20 rounded-lg">
            <Trophy class="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-white">Crear Torneo</h2>
            <p class="text-slate-400 text-sm">
              {step === 1 ? 'Información básica' : step === 2 ? 'Seleccionar jugadores' : 'Confirmación'}
            </p>
          </div>
        </div>
        <button onclick={close} class="p-2 hover:bg-slate-700 rounded-lg transition-colors">
          <X class="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <!-- Progress indicator -->
      <div class="px-6 py-4 border-b border-slate-700">
        <div class="flex items-center space-x-4">
          {#each [1, 2, 3] as stepNum}
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                {step >= stepNum ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}">
                {stepNum}
              </div>
              {#if stepNum < 3}
                <div class="w-16 h-0.5 mx-2 {step > stepNum ? 'bg-orange-500' : 'bg-slate-700'}"></div>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        {#if error}
          <div class="mb-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-3">
            <AlertCircle class="w-5 h-5 text-red-400 flex-shrink-0" />
            <p class="text-red-300">{error}</p>
          </div>
        {/if}

        {#if step === 1}
          <!-- Step 1: Basic Information -->
          <div class="space-y-6">
            <div>
              <label for="tournament-name" class="block text-sm font-medium text-slate-300 mb-2">
                Nombre del torneo *
              </label>
              <input
                id="tournament-name"
                type="text"
                bind:value={formData.name}
                placeholder="Ej: Torneo Escolar de Primavera"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="tournament-format" class="block text-sm font-medium text-slate-300 mb-2">
                  Formato
                </label>
                <select id="tournament-format" bind:value={formData.format} class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors">
                  <option value="swiss">Sistema Suizo</option>
                  <option value="round_robin">Round Robin</option>
                  <option value="knockout">Eliminación Directa</option>
                </select>
              </div>

              <div>
                <label for="tournament-school" class="block text-sm font-medium text-slate-300 mb-2">
                  Centro educativo
                </label>
                <select id="tournament-school" bind:value={formData.school_id} class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors">
                  <option value="">Sin centro específico</option>
                  {#each schools as school}
                    <option value={school.id}>{school.name}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label for="tournament-time" class="block text-sm font-medium text-slate-300 mb-2">
                  Control de tiempo
                </label>
                <input
                  id="tournament-time"
                  type="text"
                  bind:value={formData.time_control}
                  placeholder="Ej: 15+10"
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label for="tournament-start" class="block text-sm font-medium text-slate-300 mb-2">
                  Fecha de inicio
                </label>
                <input
                  id="tournament-start"
                  type="datetime-local"
                  bind:value={formData.startAt}
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label for="tournament-end" class="block text-sm font-medium text-slate-300 mb-2">
                  Fecha de fin
                </label>
                <input
                  id="tournament-end"
                  type="datetime-local"
                  bind:value={formData.endAt}
                  class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label for="tournament-notes" class="block text-sm font-medium text-slate-300 mb-2">
                Notas
              </label>
              <textarea
                id="tournament-notes"
                bind:value={formData.notes}
                placeholder="Información adicional sobre el torneo..."
                rows="3"
                class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
              ></textarea>
            </div>
          </div>

        {:else if step === 2}
          <!-- Step 2: Player Selection -->
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-white">Seleccionar Jugadores</h3>
              <div class="text-sm text-slate-400">
                {formData.selected_students.length} seleccionados
              </div>
            </div>

            {#if students.length === 0}
              <div class="text-center py-8">
                <Users class="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p class="text-slate-400">No tienes estudiantes registrados</p>
                <p class="text-slate-500 text-sm">Crea estudiantes primero para poder organizar torneos</p>
              </div>
            {:else}
              <div>
                <div class="flex items-center space-x-4 mb-4">
                  <input
                    type="text"
                    bind:value={searchTerm}
                    placeholder="Buscar estudiantes..."
                    class="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none transition-colors"
                  />
                  <button
                    onclick={selectAllStudents}
                    class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs transition-colors"
                  >
                    Todos
                  </button>
                  <button
                    onclick={deselectAllStudents}
                    class="px-4 py-2 hover:bg-slate-700 text-slate-400 rounded-lg text-xs transition-colors"
                  >
                    Ninguno
                  </button>
                </div>

                <div class="max-h-64 overflow-y-auto border border-slate-700 rounded-lg">
                  {#each filteredStudents as student}
                    <label class="flex items-center p-3 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700 last:border-b-0">
                      <input
                        type="checkbox"
                        checked={formData.selected_students.includes(student.id)}
                        onchange={() => toggleStudent(student.id)}
                        class="mr-3 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                      />
                      <div class="flex-1">
                        <div class="font-medium text-white">{student.name}</div>
                        {#if student.first_name || student.last_name}
                          <div class="text-sm text-slate-400">
                            {student.first_name} {student.last_name}
                          </div>
                        {/if}
                      </div>
                    </label>
                  {/each}
                </div>

                {#if formData.selected_students.length < 2}
                  <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg flex items-center space-x-3">
                    <Info class="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p class="text-yellow-300 text-sm">
                      Selecciona al menos 2 jugadores para crear el torneo
                    </p>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

        {:else if step === 3}
          <!-- Step 3: Confirmation -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium text-white">Confirmar Torneo</h3>

            <div class="bg-slate-700/50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-slate-400">Nombre:</span>
                <span class="text-white font-medium">{formData.name}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Formato:</span>
                <span class="text-white">
                  {formData.format === 'swiss' ? 'Sistema Suizo' : 
                   formData.format === 'round_robin' ? 'Round Robin' : 'Eliminación Directa'}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Jugadores:</span>
                <span class="text-white">{formData.selected_students.length}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Rondas estimadas:</span>
                <span class="text-white">{calculatedRounds}</span>
              </div>
              {#if formData.time_control}
                <div class="flex justify-between">
                  <span class="text-slate-400">Control de tiempo:</span>
                  <span class="text-white">{formData.time_control}</span>
                </div>
              {/if}
            </div>

            <div>
              <h4 class="text-sm font-medium text-slate-300 mb-2">Jugadores inscritos:</h4>
              <div class="bg-slate-700/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                {#each formData.selected_students as studentId}
                  {@const student = students.find(s => s.id === studentId)}
                  {#if student}
                    <div class="flex items-center space-x-2 py-1">
                      <Users class="w-4 h-4 text-slate-400" />
                      <span class="text-white text-sm">{student.name}</span>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-slate-700">
        <div class="flex items-center space-x-4">
          {#if step > 1}
            <button onclick={prevStep} class="px-6 py-2 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
              Anterior
            </button>
          {/if}
        </div>

        <div class="flex items-center space-x-4">
          <button onclick={close} class="px-6 py-2 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
            Cancelar
          </button>
          
          {#if step < 3}
            <button 
              onclick={nextStep}
              disabled={(step === 1 && !formData.name.trim()) || (step === 2 && formData.selected_students.length < 2)}
              class="px-6 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors font-semibold"
            >
              Siguiente
            </button>
          {:else}
            <button 
              onclick={createTournament}
              disabled={!isFormValid || isLoading}
              class="px-6 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors font-semibold flex items-center"
            >
              {#if isLoading}
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              {/if}
              Crear Torneo
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
