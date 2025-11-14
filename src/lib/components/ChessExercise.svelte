<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { Chess } from 'chess.js';
  import ChessBoard from './ChessBoard.svelte';
  import { showToast } from '$lib/utils/toast';
  import { Lightbulb, RotateCcw, CheckCircle, XCircle, Target } from 'lucide-svelte';
  import type { ChessExercise } from '$lib/types';

  export let exercise: ChessExercise;
  export let onComplete: (correct: boolean, timeSpent: number) => void = () => {};

  const dispatch = createEventDispatcher<{
    complete: { correct: boolean; timeSpent: number; hintsUsed: number };
    hint: { hintIndex: number };
  }>();

  let chess: Chess;
  let currentPosition: string;
  let moves: string[] = [];
  let hintsUsed = 0;
  let startTime: number;
  let isCompleted = false;
  let showHint = false;
  let currentHintIndex = 0;
  let isCorrect = false;

  onMount(() => {
    chess = new Chess(exercise.position?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    currentPosition = chess.fen();
    startTime = Date.now();
  });

  function handleMove(event: CustomEvent) {
    if (isCompleted) return;

    const { from, to, san } = event.detail;
    moves.push(san);
    
    // Check if the move is correct
    const expectedMove = exercise.solution?.[moves.length - 1];
    if (san === expectedMove) {
      // Move is correct
      if (moves.length === exercise.solution.length) {
        // Exercise completed
        isCompleted = true;
        isCorrect = true;
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        
        showToast.success('¡Ejercicio completado correctamente!');
        onComplete(true, timeSpent);
        dispatch('complete', { correct: true, timeSpent, hintsUsed });
      }
    } else {
      // Move is incorrect
      showToast.error('Movimiento incorrecto. Inténtalo de nuevo.');
      resetExercise();
    }
  }

  function resetExercise() {
    chess = new Chess(exercise.position?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    currentPosition = chess.fen();
    moves = [];
    hintsUsed = 0;
    showHint = false;
    currentHintIndex = 0;
    isCompleted = false;
    isCorrect = false;
    startTime = Date.now();
  }

  function showNextHint() {
    if (currentHintIndex < (exercise.hints?.length || 0)) {
      showHint = true;
      hintsUsed++;
      dispatch('hint', { hintIndex: currentHintIndex });
      currentHintIndex++;
    }
  }

  function giveUp() {
    isCompleted = true;
    isCorrect = false;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    showToast.warning('Has abandonado el ejercicio');
    onComplete(false, timeSpent);
    dispatch('complete', { correct: false, timeSpent, hintsUsed });
  }

  function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-slate-400';
    }
  }

  function getCategoryIcon(category: string): string {
    switch (category) {
      case 'tactics': return '⚔️';
      case 'strategy': return '♟️';
      case 'endgame': return '🏁';
      case 'opening': return '🚀';
      case 'checkmate': return '👑';
      default: return '🎯';
    }
  }
</script>

<div class="chess-exercise bg-slate-800 rounded-xl p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center space-x-3">
      <div class="text-2xl">{getCategoryIcon(exercise.category)}</div>
      <div>
        <h3 class="text-xl font-semibold">{exercise.title}</h3>
        <div class="flex items-center space-x-2 text-sm text-slate-400">
          <span class="capitalize">{exercise.category}</span>
          <span>•</span>
          <span class="capitalize {getDifficultyColor(exercise.difficulty)}">
            {exercise.difficulty}
          </span>
        </div>
      </div>
    </div>
    
    <div class="flex items-center space-x-2">
      <button
        on:click={resetExercise}
        class="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        title="Reiniciar ejercicio"
      >
        <RotateCcw class="w-4 h-4" />
      </button>
    </div>
  </div>

  <!-- Description -->
  <div class="mb-6">
    <p class="text-slate-300 mb-4">{exercise.description}</p>
    
    {#if exercise.explanation && isCompleted}
      <div class="bg-slate-700 rounded-lg p-4">
        <h4 class="font-semibold text-slate-200 mb-2">Explicación:</h4>
        <p class="text-slate-300">{exercise.explanation}</p>
      </div>
    {/if}
  </div>

  <!-- Chess Board -->
  <div class="flex justify-center mb-6">
    <ChessBoard
      position={currentPosition}
      interactive={!isCompleted}
      size={400}
      on:move={handleMove}
    />
  </div>

  <!-- Progress -->
  <div class="mb-6">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-slate-400">Progreso</span>
      <span class="text-sm text-slate-400">{moves.length} / {exercise.solution?.length || 0}</span>
    </div>
    <div class="w-full bg-slate-700 rounded-full h-2">
      <div 
        class="bg-primary-500 h-2 rounded-full transition-all duration-300"
        style="width: {(moves.length / (exercise.solution?.length || 1)) * 100}%"
      ></div>
    </div>
  </div>

  <!-- Hints -->
  {#if exercise.hints && exercise.hints.length > 0}
    <div class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-slate-200">Pistas</h4>
        <button
          on:click={showNextHint}
          disabled={currentHintIndex >= (exercise.hints?.length || 0) || isCompleted}
          class="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lightbulb class="w-4 h-4 mr-2" />
          Pista ({currentHintIndex}/{exercise.hints?.length || 0})
        </button>
      </div>
      
      {#if showHint && currentHintIndex > 0 && exercise.hints}
        <div class="bg-slate-700 rounded-lg p-3">
          <p class="text-slate-300 text-sm">
            {exercise.hints[currentHintIndex - 1]}
          </p>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Actions -->
  <div class="flex justify-between items-center">
    <div class="flex items-center space-x-4 text-sm text-slate-400">
      <span>Pistas usadas: {hintsUsed}</span>
      <span>Tiempo: {Math.floor((Date.now() - startTime) / 1000)}s</span>
    </div>
    
    <div class="flex space-x-2">
      {#if !isCompleted}
        <button
          on:click={giveUp}
          class="btn-ghost text-sm"
        >
          Abandonar
        </button>
      {/if}
      
      {#if isCompleted}
        <div class="flex items-center space-x-2">
          {#if isCorrect}
            <CheckCircle class="w-5 h-5 text-green-500" />
            <span class="text-green-500 font-medium">¡Correcto!</span>
          {:else}
            <XCircle class="w-5 h-5 text-red-500" />
            <span class="text-red-500 font-medium">Incorrecto</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Solution (shown after completion) -->
  {#if isCompleted}
    <div class="mt-6 pt-6 border-t border-slate-700">
      <h4 class="font-semibold text-slate-200 mb-3">Solución:</h4>
      <div class="flex flex-wrap gap-2">
        {#each exercise.solution || [] as move, index}
          <span class="px-3 py-1 bg-slate-700 rounded-lg text-sm font-mono">
            {index + 1}. {move}
          </span>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .chess-exercise {
    max-width: 600px;
    margin: 0 auto;
  }
</style>
