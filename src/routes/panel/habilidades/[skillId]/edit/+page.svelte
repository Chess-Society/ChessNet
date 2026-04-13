<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft,
    Save,
    X,
    Target,
    Plus,
    Trash2,
    Star,
    Clock,
    BookOpen,
    CheckCircle,
    Eye,
    RotateCcw,
    Lightbulb,
    Award,
    Link,
    FileText,
    Layers,
    Zap
  } from 'lucide-svelte';
  import type { Skill } from '$lib/types';
  import type { PageData } from './$types';

  const { data } = $props<{ data: PageData }>();
  
  const skillData = $derived(data.skill);
  const categories = $derived(data.categories || []);
  const availablePrerequisites = $derived(data.availablePrerequisites || []);

  // Form data state - Snapshot the initial data to avoid Svelte 5 state capturing warnings
  const initial = $state.snapshot(data.skill);
  
  let formData = $state({
    name: initial?.name || '',
    description: initial?.description || '',
    category_id: initial?.category_id || '',
    difficulty: initial?.difficulty || 1,
    estimated_hours: initial?.estimated_hours || 1,
    prerequisites: (initial?.prerequisites || []) as string[],
    learning_objectives: (initial?.learning_objectives || ['']) as string[],
    assessment_criteria: (initial?.assessment_criteria || ['']) as string[],
    resources: (initial?.resources || ['']) as string[],
    icon: initial?.icon || '',
    resource_link: initial?.resource_link || '',
    order_index: initial?.order_index || 1,
    active: initial?.active ?? true
  });

  // Form UI state
  let isSubmitting = $state(false);
  let errors: Record<string, string> = $state({});
  let showPreview = $state(false);

  const difficultyLevels = [
    { value: 1, label: 'Muy Fácil', color: 'text-green-400', description: 'Conceptos básicos' },
    { value: 2, label: 'Fácil', color: 'text-lime-400', description: 'Fundamentos' },
    { value: 3, label: 'Intermedio', color: 'text-yellow-400', description: 'Aplicación práctica' },
    { value: 4, label: 'Difícil', color: 'text-orange-400', description: 'Conceptos avanzados' },
    { value: 5, label: 'Muy Difícil', color: 'text-red-400', description: 'Maestría' }
  ];

  onMount(() => {
    console.log('✏️ Edit skill page loaded:', skillData?.name);
  });

  const handleGoBack = () => {
    goto('/panel/habilidades');
  };

  const validateForm = () => {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre de la habilidad es obligatorio';
    }

    if (!formData.description.trim()) {
      errors.description = 'La descripción es obligatoria';
    }

    if (!formData.category_id) {
      errors.category_id = 'Debes seleccionar una categoría';
    }

    if (formData.difficulty < 1 || formData.difficulty > 5) {
      errors.difficulty = 'La dificultad debe estar entre 1 y 5';
    }

    if (formData.estimated_hours < 0.5 || formData.estimated_hours > 20) {
      errors.estimated_hours = 'Las horas estimadas deben estar entre 0.5 y 20';
    }

    // Validar que los objetivos no estén vacíos
    const validObjectives = formData.learning_objectives.filter((obj: string) => obj.trim());
    if (validObjectives.length === 0) {
      errors.learning_objectives = 'Debe haber al menos un objetivo de aprendizaje';
    }

    // Validar que los criterios no estén vacíos
    const validCriteria = formData.assessment_criteria.filter((criteria: string) => criteria.trim());
    if (validCriteria.length === 0) {
      errors.assessment_criteria = 'Debe haber al menos un criterio de evaluación';
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    // Limpiar arrays de elementos vacíos
    formData.learning_objectives = formData.learning_objectives.filter((obj: string) => obj.trim());
    formData.assessment_criteria = formData.assessment_criteria.filter((criteria: string) => criteria.trim());
    formData.resources = formData.resources.filter((resource: string) => resource.trim());

    isSubmitting = true;

    try {
      console.log('💾 Updating skill:', formData);

      // Simular actualización
      const response = await fetch(`/api/skills/${skillData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('✅ Skill updated successfully');
        import('$lib/utils/toast').then(({ showToast }) => {
          showToast.success('Habilidad actualizada correctamente');
        });
        goto('/panel/habilidades');
      } else {
        throw new Error('Error updating skill');
      }
    } catch (error) {
      console.error('Error updating skill:', error);
      import('$lib/utils/toast').then(({ showError }) => {
        showError(error, 'Error al actualizar la habilidad');
      });
    } finally {
      isSubmitting = false;
    }
  };

  const resetToOriginal = () => {
    formData = {
      name: skillData?.name || '',
      description: skillData?.description || '',
      category_id: skillData?.category_id || '',
      difficulty: skillData?.difficulty || 1,
      estimated_hours: skillData?.estimated_hours || 1,
      prerequisites: skillData?.prerequisites || [],
      learning_objectives: skillData?.learning_objectives || [''],
      assessment_criteria: skillData?.assessment_criteria || [''],
      resources: skillData?.resources || [''],
      icon: skillData?.icon || '',
      resource_link: skillData?.resource_link || '',
      order_index: skillData?.order_index || 1,
      active: skillData?.active ?? true
    };
    errors = {};
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify({
      name: skillData?.name || '',
      description: skillData?.description || '',
      category_id: skillData?.category_id || '',
      difficulty: skillData?.difficulty || 1,
      estimated_hours: skillData?.estimated_hours || 1,
      prerequisites: skillData?.prerequisites || [],
      learning_objectives: skillData?.learning_objectives || [''],
      assessment_criteria: skillData?.assessment_criteria || [''],
      resources: skillData?.resources || [''],
      icon: skillData?.icon || '',
      resource_link: skillData?.resource_link || '',
      order_index: skillData?.order_index || 1,
      active: skillData?.active ?? true
    });
  };

  const addObjective = () => {
    formData.learning_objectives = [...formData.learning_objectives, ''];
  };

  const removeObjective = (index: number) => {
    formData.learning_objectives = formData.learning_objectives.filter((_: string, i: number) => i !== index);
  };

  const addCriteria = () => {
    formData.assessment_criteria = [...formData.assessment_criteria, ''];
  };

  const removeCriteria = (index: number) => {
    formData.assessment_criteria = formData.assessment_criteria.filter((_: string, i: number) => i !== index);
  };

  const addResource = () => {
    formData.resources = [...formData.resources, ''];
  };

  const removeResource = (index: number) => {
    formData.resources = formData.resources.filter((_: string, i: number) => i !== index);
  };

  const togglePrerequisite = (skillId: string) => {
    if (formData.prerequisites.includes(skillId)) {
      formData.prerequisites = formData.prerequisites.filter(id => id !== skillId);
    } else {
      formData.prerequisites = [...formData.prerequisites, skillId];
    }
  };

  const getDifficultyInfo = () => {
    return difficultyLevels.find((level: any) => level.value === formData.difficulty) || difficultyLevels[0];
  };

  const getSelectedCategoryName = () => {
    const category = categories.find((c: any) => c.id === formData.category_id);
    return category?.name || 'Seleccionar categoría';
  };

  const getSelectedCategoryColor = () => {
    const category = categories.find((c: any) => c.id === formData.category_id);
    return category?.color || '#6B7280';
  };

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => i < difficulty);
  };
</script>

<svelte:head>
  <title>Editar Skill - {skillData?.name || 'Habilidad'} - ChessNet</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
  <!-- Header -->
  <header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button onclick={handleGoBack} class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-white">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-purple-500/20 rounded-lg">
              <Target class="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Editar Habilidad</h1>
              <p class="text-sm text-slate-400">{skillData?.name}</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          {#if hasChanges()}
            <button onclick={resetToOriginal} class="btn-secondary">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Descartar Cambios
            </button>
          {/if}
          <button onclick={() => showPreview = !showPreview} class="btn-secondary">
            <Eye class="w-4 h-4 mr-2" />
            {showPreview ? 'Ocultar' : 'Vista Previa'}
          </button>
          <button onclick={handleSubmit} disabled={isSubmitting || !hasChanges()} class="btn-primary">
            {#if isSubmitting}
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            {:else}
              <Save class="w-4 h-4 mr-2" />
              Guardar Cambios
            {/if}
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Formulario principal -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Información básica -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-6">Información Básica</h2>
          
          <div class="space-y-6">
            <!-- Nombre -->
            <div>
              <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
                Nombre de la Habilidad *
              </label>
              <input
                id="name"
                type="text"
                bind:value={formData.name}
                class={`input w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Ej: Movimiento de Peones"
              />
              {#if errors.name}
                <p class="text-red-400 text-sm mt-1">{errors.name}</p>
              {/if}
            </div>

            <!-- Descripción -->
            <div>
              <label for="description" class="block text-sm font-medium text-slate-300 mb-2">
                Descripción Detallada *
              </label>
              <textarea
                id="description"
                bind:value={formData.description}
                class={`input w-full h-24 resize-none ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe qué aprenderá el estudiante con esta habilidad..."
              ></textarea>
              {#if errors.description}
                <p class="text-red-400 text-sm mt-1">{errors.description}</p>
              {/if}
            </div>

            <!-- Categoría y dificultad -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="category_id" class="block text-sm font-medium text-slate-300 mb-2">
                  Categoría *
                </label>
                <select
                  id="category_id"
                  bind:value={formData.category_id}
                  class={`input w-full ${errors.category_id ? 'border-red-500' : ''}`}
                >
                  <option value="">Seleccionar categoría</option>
                  {#each categories as category}
                    <option value={category.id}>{category.name}</option>
                  {/each}
                </select>
                {#if errors.category_id}
                  <p class="text-red-400 text-sm mt-1">{errors.category_id}</p>
                {/if}
              </div>

              <div>
                <label for="difficulty" class="block text-sm font-medium text-slate-300 mb-2">
                  Nivel de Dificultad *
                </label>
                <select
                  id="difficulty"
                  bind:value={formData.difficulty}
                  class={`input w-full ${errors.difficulty ? 'border-red-500' : ''}`}
                >
                  {#each difficultyLevels as level}
                    <option value={level.value}>
                      {'⭐'.repeat(level.value)} {level.label}
                    </option>
                  {/each}
                </select>
                <p class="text-xs text-slate-400 mt-1">{getDifficultyInfo().description}</p>
                {#if errors.difficulty}
                  <p class="text-red-400 text-sm mt-1">{errors.difficulty}</p>
                {/if}
              </div>
            </div>

            <!-- Horas estimadas y orden -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="estimated_hours" class="block text-sm font-medium text-slate-300 mb-2">
                  Horas Estimadas
                </label>
                <input
                  id="estimated_hours"
                  type="number"
                  bind:value={formData.estimated_hours}
                  class={`input w-full ${errors.estimated_hours ? 'border-red-500' : ''}`}
                  min="0.5"
                  max="20"
                  step="0.5"
                />
                {#if errors.estimated_hours}
                  <p class="text-red-400 text-sm mt-1">{errors.estimated_hours}</p>
                {/if}
              </div>

              <div>
                <label for="order_index" class="block text-sm font-medium text-slate-300 mb-2">
                  Orden en la Categoría
                </label>
                <input
                  id="order_index"
                  type="number"
                  bind:value={formData.order_index}
                  class="input w-full"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Objetivos de aprendizaje -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Objetivos de Aprendizaje</h2>
            <button onclick={addObjective} class="btn-secondary text-sm">
              <Plus class="w-4 h-4 mr-1" />
              Añadir Objetivo
            </button>
          </div>
          
          <div class="space-y-4">
            {#each formData.learning_objectives as objective, index}
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-green-500/20 rounded-lg mt-1">
                  <Lightbulb class="w-4 h-4 text-green-400" />
                </div>
                <div class="flex-1">
                  <textarea
                    bind:value={formData.learning_objectives[index]}
                    class="input w-full h-16 resize-none"
                    placeholder="Describe qué debe lograr el estudiante..."
                  ></textarea>
                </div>
                {#if formData.learning_objectives.length > 1}
                  <button
                    onclick={() => removeObjective(index)}
                    class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                {/if}
              </div>
            {/each}
            {#if errors.learning_objectives}
              <p class="text-red-400 text-sm">{errors.learning_objectives}</p>
            {/if}
          </div>
        </div>

        <!-- Criterios de evaluación -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Criterios de Evaluación</h2>
            <button onclick={addCriteria} class="btn-secondary text-sm">
              <Plus class="w-4 h-4 mr-1" />
              Añadir Criterio
            </button>
          </div>
          
          <div class="space-y-4">
            {#each formData.assessment_criteria as criteria, index}
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-blue-500/20 rounded-lg mt-1">
                  <Award class="w-4 h-4 text-blue-400" />
                </div>
                <div class="flex-1">
                  <textarea
                    bind:value={formData.assessment_criteria[index]}
                    class="input w-full h-16 resize-none"
                    placeholder="¿Cómo sabrás que el estudiante ha dominado esta habilidad?"
                  ></textarea>
                </div>
                {#if formData.assessment_criteria.length > 1}
                  <button
                    onclick={() => removeCriteria(index)}
                    class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                {/if}
              </div>
            {/each}
            {#if errors.assessment_criteria}
              <p class="text-red-400 text-sm">{errors.assessment_criteria}</p>
            {/if}
          </div>
        </div>

        <!-- Prerequisitos -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 class="text-xl font-semibold mb-6">Habilidades Prerequisito</h2>
          
          {#if availablePrerequisites.length === 0}
            <p class="text-slate-400 text-center py-4">No hay otras habilidades disponibles como prerequisitos</p>
          {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              {#each availablePrerequisites as skill}
                <label class="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.prerequisites.includes(skill.id)}
                    onchange={() => togglePrerequisite(skill.id)}
                    class="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <div class="flex-1">
                    <p class="text-slate-300 font-medium">{skill.name}</p>
                    <div class="flex items-center space-x-2 mt-1">
                      <div class="flex items-center space-x-1">
                        {#each getDifficultyStars(skill.difficulty) as filled}
                          <Star class={`w-3 h-3 ${filled ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                        {/each}
                      </div>
                      <span class="text-xs text-slate-500">Nivel {skill.difficulty}</span>
                    </div>
                  </div>
                </label>
              {/each}
            </div>
            <p class="text-xs text-slate-400 mt-3">
              Los estudiantes deben dominar estas habilidades antes de empezar con esta
            </p>
          {/if}
        </div>

        <!-- Recursos -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-white">Recursos Educativos</h2>
            <button onclick={addResource} class="btn-secondary text-sm">
              <Plus class="w-4 h-4 mr-1" />
              Añadir Recurso
            </button>
          </div>
          
          <div class="space-y-4">
            {#each formData.resources as resource, index}
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-orange-500/20 rounded-lg">
                  <BookOpen class="w-4 h-4 text-orange-400" />
                </div>
                <div class="flex-1">
                  <input
                    bind:value={formData.resources[index]}
                    class="input w-full"
                    placeholder="Ej: Tablero de ajedrez físico, software educativo..."
                  />
                </div>
                <button
                  onclick={() => removeResource(index)}
                  class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Panel lateral -->
      <div class="space-y-6">
        <!-- Vista previa -->
        {#if showPreview}
          <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 class="font-semibold mb-4">Vista Previa</h3>
            
            <div class="space-y-4">
              <div>
                <h4 class="font-medium text-white">{formData.name || 'Nombre de la habilidad'}</h4>
                <p class="text-sm text-slate-400 leading-relaxed mt-1">
                  {formData.description || 'Descripción de la habilidad'}
                </p>
              </div>

              <div class="flex items-center justify-between">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  style={`background-color: ${getSelectedCategoryColor()}20; color: ${getSelectedCategoryColor()}; border: 1px solid ${getSelectedCategoryColor()}30`}
                >
                  {getSelectedCategoryName()}
                </span>
                <div class="flex items-center space-x-1">
                  {#each getDifficultyStars(formData.difficulty) as filled}
                    <Star class={`w-4 h-4 ${filled ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                  {/each}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-400">Duración:</span>
                  <span class="text-white ml-1">{formData.estimated_hours}h</span>
                </div>
                <div>
                  <span class="text-slate-400">Dificultad:</span>
                  <span class={`ml-1 ${getDifficultyInfo().color}`}>{getDifficultyInfo().label}</span>
                </div>
              </div>

              {#if formData.prerequisites.length > 0}
                <div>
                  <span class="text-slate-400 text-sm">Prerequisitos:</span>
                  <div class="mt-1 space-y-1">
                    {#each formData.prerequisites as prereqId}
                      {#each availablePrerequisites.filter((s: Skill) => s.id === prereqId) as prereq}
                        <span class="flex-1 text-sm text-slate-300 hover:text-emerald-400 truncate cursor-pointer transition-colors">
                          {prereq.name}
                        </span>
                      {/each}
                    {/each}
                  </div>
                </div>
              {/if}

              <div class="pt-3 border-t border-slate-700">
                <span class={`px-3 py-1 rounded-full text-xs font-medium ${formData.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {formData.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </div>
        {/if}

        <!-- Información de ayuda -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 class="font-semibold mb-4">Consejos Pedagógicos</h3>
          
          <div class="space-y-3 text-sm text-slate-400">
            <div class="flex items-start space-x-2">
              <Lightbulb class="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p>Los objetivos deben ser específicos y medibles para evaluar el progreso.</p>
            </div>
            <div class="flex items-start space-x-2">
              <Award class="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p>Los criterios de evaluación ayudan a mantener estándares consistentes.</p>
            </div>
            <div class="flex items-start space-x-2">
              <Link class="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <p>Los prerequisitos crean una progresión lógica del aprendizaje.</p>
            </div>
            <div class="flex items-start space-x-2">
              <Clock class="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>Las horas estimadas ayudan a planificar las clases efectivamente.</p>
            </div>
          </div>
        </div>

        <!-- Estado y configuración -->
        <div class="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 class="font-semibold mb-4">Configuración</h3>
          
          <div class="space-y-4">
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                bind:checked={formData.active}
                class="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <span class="text-slate-300">Habilidad activa</span>
            </label>
            <p class="text-xs text-slate-400">
              Las habilidades inactivas no aparecen en las listas de asignación
            </p>

            <div class="pt-4 border-t border-slate-700">
              <div class="text-sm text-slate-400 space-y-1">
                <p><strong>Objetivos:</strong> {formData.learning_objectives.filter(obj => obj.trim()).length}</p>
                <p><strong>Criterios:</strong> {formData.assessment_criteria.filter(c => c.trim()).length}</p>
                <p><strong>Recursos:</strong> {formData.resources.filter(r => r.trim()).length}</p>
                <p><strong>Prerequisitos:</strong> {formData.prerequisites.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  /* Styles simplified to avoid @apply warnings during build */
  .input {
    background-color: rgb(51, 65, 85); /* slate-700 */
    border: 1px solid rgb(71, 85, 105); /* slate-600 */
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    color: white;
  }
  .input:focus {
    outline: none;
    border-color: rgb(16, 185, 129); /* primary-500/emerald-500 */
    box-shadow: 0 0 0 1px rgb(16, 185, 129);
  }
</style>
