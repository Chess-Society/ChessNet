<script lang="ts">
  import { onMount } from 'svelte';
  import { Chess } from 'chess.js';
  import { t } from '$lib/i18n';

  interface Props {
    position?: string;
    interactive?: boolean;
    showCoordinates?: boolean;
    size?: number;
    orientation?: 'white' | 'black';
    onmove?: (data: { from: string; to: string; san: string }) => void;
    onpositionChange?: (data: { fen: string; moves: string[] }) => void;
    oncheck?: (data: { isCheck: boolean; isCheckmate: boolean; isStalemate: boolean }) => void;
  }

  let { 
    position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    interactive = true,
    showCoordinates = true,
    size = 400,
    orientation = 'white',
    onmove,
    onpositionChange,
    oncheck
  } = $props<Props>();

  let chess = $state(new Chess(position));
  let boardElement = $state<HTMLDivElement>();
  let selectedSquare = $state<string | null>(null);
  let possibleMoves = $state<string[]>([]);
  let isDragging = $state(false);
  let dragStartSquare = $state<string | null>(null);

  // Piece symbols
  const pieceSymbols: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };

  // Square colors
  const getSquareColor = (file: number, rank: number): string => {
    return (file + rank) % 2 === 0 ? 'bg-amber-100' : 'bg-amber-800';
  };

  // Get piece at square
  const getPieceAt = (square: string): string | null => {
    // Accessing chess to ensure reactivity
    const _ = chess;
    const piece = chess.get(square as any);
    if (!piece) return null;
    const key = `${piece.color}${piece.type}`.toUpperCase();
    return pieceSymbols[key] || null;
  };

  // Get square name from coordinates
  const getSquareName = (file: number, rank: number): string => {
    return String.fromCharCode(97 + file) + (rank + 1);
  };

  // Handle square click
  const handleSquareClick = (square: string) => {
    if (!interactive) return;

    const piece = chess.get(square as any);
    
    if (selectedSquare === square) {
      selectedSquare = null;
      possibleMoves = [];
    } else if (selectedSquare && possibleMoves.includes(square)) {
      try {
        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q' 
        });
        
        if (move) {
          onmove?.({ from: selectedSquare, to: square, san: move.san });
          onpositionChange?.({ fen: chess.fen(), moves: chess.moves() });
          oncheck?.({
            isCheck: chess.isCheck(),
            isCheckmate: chess.isCheckmate(),
            isStalemate: chess.isStalemate()
          });
          // Update the state
          chess = new Chess(chess.fen());
        }
      } catch (error) {
        console.error('Invalid move:', error);
      }
      
      selectedSquare = null;
      possibleMoves = [];
    } else if (piece && piece.color === chess.turn()) {
      selectedSquare = square;
      possibleMoves = chess.moves({ square: square as any, verbose: true }).map((m: any) => m.to);
    } else {
      selectedSquare = null;
      possibleMoves = [];
    }
  };

  // Handle drag start
  const handleDragStart = (event: DragEvent, square: string) => {
    if (!interactive) return;
    
    const piece = chess.get(square as any);
    if (piece && piece.color === chess.turn()) {
      isDragging = true;
      dragStartSquare = square;
      selectedSquare = square;
      possibleMoves = chess.moves({ square: square as any, verbose: true }).map((m: any) => m.to);
      
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', square);
      }
    } else {
      event.preventDefault();
    }
  };

  // Handle drag over
  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  };

  // Handle drop
  const handleDrop = (event: DragEvent, targetSquare: string) => {
    event.preventDefault();
    if (!isDragging || !dragStartSquare) return;
    
    try {
      const move = chess.move({
        from: dragStartSquare,
        to: targetSquare,
        promotion: 'q'
      });
      
      if (move) {
        onmove?.({ from: dragStartSquare, to: targetSquare, san: move.san });
        onpositionChange?.({ fen: chess.fen(), moves: chess.moves() });
        oncheck?.({
          isCheck: chess.isCheck(),
          isCheckmate: chess.isCheckmate(),
          isStalemate: chess.isStalemate()
        });
        chess = new Chess(chess.fen());
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    
    isDragging = false;
    dragStartSquare = null;
    selectedSquare = null;
    possibleMoves = [];
  };

  const handleDragEnd = () => {
    isDragging = false;
    dragStartSquare = null;
  };

  // Update position when prop changes
  $effect(() => {
    if (position !== chess.fen()) {
      chess.load(position);
      selectedSquare = null;
      possibleMoves = [];
      
      onpositionChange?.({
        fen: chess.fen(),
        moves: chess.moves()
      });

      oncheck?.({
        isCheck: chess.isCheck(),
        isCheckmate: chess.isCheckmate(),
        isStalemate: chess.isStalemate()
      });
      
      chess = new Chess(chess.fen());
    }
  });

  // Derived squares for the view
  const squares = $derived.by(() => {
    const list = [];
    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const square = getSquareName(file, rank);
        const displayFile = orientation === 'white' ? file : 7 - file;
        const displayRank = orientation === 'white' ? rank : 7 - rank;
        
        list.push({
          square,
          file: displayFile,
          rank: displayRank,
          piece: getPieceAt(square),
          isSelected: selectedSquare === square,
          isPossibleMove: possibleMoves.includes(square),
        });
      }
    }
    return list;
  });
</script>

<div class="chess-board-container" style="width: {size}px; height: {size}px;">
  <div 
    bind:this={boardElement}
    class="chess-board relative border-2 border-slate-600 rounded-lg overflow-hidden"
    style="width: 100%; height: 100%;"
  >
    {#each squares as { square, file, rank, piece, isSelected, isPossibleMove }}
      <div
        class="chess-square relative {getSquareColor(file, rank)} {isSelected ? 'ring-2 ring-yellow-400' : ''} {isPossibleMove ? 'ring-2 ring-green-400' : ''}"
        style="width: 12.5%; height: 12.5%; position: absolute; top: {rank * 12.5}%; left: {file * 12.5}%;"
        onclick={() => handleSquareClick(square)}
        onkeydown={(e: KeyboardEvent) => e.key === 'Enter' || e.key === ' ' ? handleSquareClick(square) : null}
        ondragstart={(e: DragEvent) => handleDragStart(e, square)}
        ondragover={handleDragOver}
        ondrop={(e: DragEvent) => handleDrop(e, square)}
        ondragend={handleDragEnd}
        draggable={interactive && !!piece}
        role="button"
        tabindex="0"
        aria-label={$t('chess.square', { square })}
      >
        {#if piece}
          <div class="absolute inset-0 flex items-center justify-center text-2xl font-bold select-none pointer-events-none">
            {piece}
          </div>
        {/if}
        
        {#if isPossibleMove && !piece}
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-3 h-3 bg-green-500 rounded-full opacity-70"></div>
          </div>
        {/if}
        
        {#if showCoordinates}
          {#if file === 0}
            <div class="absolute bottom-0 left-1 text-xs font-bold text-slate-700">
              {orientation === 'white' ? rank + 1 : 8 - rank}
            </div>
          {/if}
          {#if rank === 0}
            <div class="absolute top-0 right-1 text-xs font-bold text-slate-700">
              {String.fromCharCode(97 + (orientation === 'white' ? file : 7 - file))}
            </div>
          {/if}
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .chess-square {
    transition: all 0.2s ease;
  }
  
  .chess-square:hover {
    box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  .chess-square:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.8);
  }
</style>
