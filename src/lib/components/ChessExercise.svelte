<script lang="ts">
  import { onMount } from 'svelte';
  import { Chess } from 'chess.js';
  import ChessBoard from './ChessBoard.svelte';
  import { showToast } from '$lib/stores/toast';
  import { Lightbulb, RotateCcw, CheckCircle, XCircle, Target } from 'lucide-svelte';
  import type { ChessExercise } from '$lib/types';
  import { t } from '$lib/i18n';

  interface Props {
    exercise: ChessExercise;
    onComplete?: (correct: boolean, timeSpent: number) => void;
  }

  let { exercise, onComplete }: Props = $props();

  let chess = $state<Chess | null>(null);
  let currentPosition = $state('');
  let moves = $state<string[]>([]);
  let hintsUsed = $state(0);
  let startTime = $state(0);
  let isCompleted = $state(false);
  let showHint = $state(false);
  let currentHintIndex = $state(0);
  let isCorrect = $state(false);
  let currentTime = $state(0);

  onMount(() => {
    initChess();
    const interval = setInterval(() => {
        if (!isCompleted && startTime > 0) {
            currentTime = Math.floor((Date.now() - startTime) / 1000);
        }
    }, 1000);
    return () => clearInterval(interval);
  });

  function initChess() {
    chess = new Chess(exercise.position?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    currentPosition = chess.fen();
    startTime = Date.now();
  }

  function handleMove(data: { from: string; to: string; san: string }) {
    if (isCompleted || !chess) return;

    const { from, to, san } = data;
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
        
        showToast.success($t('simulator.exercise.completed'));
        onComplete?.(true, timeSpent);
      }
    } else {
      // Move is incorrect
      showToast.error($t('simulator.exercise.incorrect'));
      resetExercise();
    }
  }

  function resetExercise() {
    initChess();
    moves = [];
    hintsUsed = 0;
    showHint = false;
    currentHintIndex = 0;
    isCompleted = false;
    isCorrect = false;
  }

  function showNextHint() {
    if (currentHintIndex < (exercise.hints?.length || 0)) {
      showHint = true;
      hintsUsed++;
      currentHintIndex++;
    }
  }

  function giveUp() {
    isCompleted = true;
    isCorrect = false;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    showToast.warning($t('simulator.exercise.abandoned'));
    onComplete?.(false, timeSpent);
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

<div class="chess-exercise bg-slate-800 rounded-none p-6">
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
        onclick={resetExercise}
        class="p-2 rounded-none bg-slate-700 hover:bg-slate-600 transition-colors"
        title={$t('simulator.exercise.reset')}
      >
        <RotateCcw class="w-4 h-4" />
      </button>
    </div>
  </div>

  <!-- Description -->
  <div class="mb-6">
    <p class="text-slate-300 mb-4">{exercise.description}</p>
    
    {#if exercise.explanation && isCompleted}
      <div class="bg-slate-700 rounded-none p-4">
        <h4 class="font-semibold text-slate-200 mb-2">{$t('simulator.exercise.explanation')}</h4>
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
      onmove={handleMove}
    />
  </div>

  <!-- Progress -->
  <div class="mb-6">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-slate-400">{$t('simulator.exercise.progress')}</span>
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
        <h4 class="font-semibold text-slate-200">{$t('simulator.exercise.hints')}</h4>
        <button
          onclick={showNextHint}
          disabled={currentHintIndex >= (exercise.hints?.length || 0) || isCompleted}
          class="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Lightbulb class="w-4 h-4 mr-2" />
          {$t('simulator.exercise.hint_button')} ({currentHintIndex}/{exercise.hints?.length || 0})
        </button>
      </div>
      
      {#if showHint && currentHintIndex > 0 && exercise.hints}
        <div class="bg-slate-700 rounded-none p-3">
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
      <span>{$t('simulator.exercise.hints_used', { count: hintsUsed })}</span>
      <span>{$t('simulator.exercise.time', { seconds: currentTime })}</span>
    </div>
    
    <div class="flex space-x-2">
      {#if !isCompleted}
        <button
          onclick={giveUp}
          class="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          {$t('simulator.exercise.give_up')}
        </button>
      {/if}
      
      {#if isCompleted}
        <div class="flex items-center space-x-2">
          {#if isCorrect}
            <CheckCircle class="w-5 h-5 text-green-500" />
            <span class="text-green-500 font-medium">{$t('simulator.exercise.correct_label')}</span>
          {:else}
            <XCircle class="w-5 h-5 text-red-500" />
            <span class="text-red-500 font-medium">{$t('simulator.exercise.incorrect_label')}</span>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Solution (shown after completion) -->
  {#if isCompleted}
    <div class="mt-6 pt-6 border-t border-slate-700">
      <h4 class="font-semibold text-slate-200 mb-3">{$t('simulator.exercise.solution')}</h4>
      <div class="flex flex-wrap gap-2">
        {#each exercise.solution || [] as move, index}
          <span class="px-3 py-1 bg-slate-700 rounded-none text-sm font-mono">
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
