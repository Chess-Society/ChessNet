<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { Chess } from 'chess.js';
  import type { ChessPosition } from '$lib/types';

  export let position: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  export let interactive: boolean = true;
  export let showCoordinates: boolean = true;
  export let size: number = 400;
  export let orientation: 'white' | 'black' = 'white';

  const dispatch = createEventDispatcher<{
    move: { from: string; to: string; san: string };
    positionChange: { fen: string; moves: string[] };
    check: { isCheck: boolean; isCheckmate: boolean; isStalemate: boolean };
  }>();

  let chess: Chess;
  let boardElement: HTMLDivElement;
  let selectedSquare: string | null = null;
  let possibleMoves: string[] = [];
  let isDragging = false;
  let dragStartSquare: string | null = null;

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
    const piece = chess.get(square as any);
    if (!piece) return null;
    const key = `${piece.color}${piece.type}`.toUpperCase();
    return pieceSymbols[key] || null;
  };

  // Get square coordinates
  const getSquareCoords = (square: string): { file: number; rank: number } => {
    const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
    const rank = parseInt(square[1]) - 1; // 1=0, 2=1, etc.
    return { file, rank };
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
      // Deselect
      selectedSquare = null;
      possibleMoves = [];
    } else if (selectedSquare && possibleMoves.includes(square)) {
      // Make move
      try {
        const move = chess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q' // Auto-promote to queen
        });
        
        if (move) {
          dispatch('move', {
            from: selectedSquare,
            to: square,
            san: move.san
          });
          
          dispatch('positionChange', {
            fen: chess.fen(),
            moves: chess.moves()
          });

          dispatch('check', {
            isCheck: chess.isCheck(),
            isCheckmate: chess.isCheckmate(),
            isStalemate: chess.isStalemate()
          });
        }
      } catch (error) {
        console.error('Invalid move:', error);
      }
      
      selectedSquare = null;
      possibleMoves = [];
    } else if (piece && piece.color === chess.turn()) {
      // Select piece
      selectedSquare = square;
      possibleMoves = chess.moves({ square: square as any, verbose: true }).map((m: any) => m.to);
    } else {
      // Deselect
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
        dispatch('move', {
          from: dragStartSquare,
          to: targetSquare,
          san: move.san
        });
        
        dispatch('positionChange', {
          fen: chess.fen(),
          moves: chess.moves()
        });

        dispatch('check', {
          isCheck: chess.isCheck(),
          isCheckmate: chess.isCheckmate(),
          isStalemate: chess.isStalemate()
        });
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    
    isDragging = false;
    dragStartSquare = null;
    selectedSquare = null;
    possibleMoves = [];
  };

  // Handle drag end
  const handleDragEnd = () => {
    isDragging = false;
    dragStartSquare = null;
  };

  // Initialize chess
  onMount(() => {
    chess = new Chess(position);
    
    // Dispatch initial state
    dispatch('positionChange', {
      fen: chess.fen(),
      moves: chess.moves()
    });

    dispatch('check', {
      isCheck: chess.isCheck(),
      isCheckmate: chess.isCheckmate(),
      isStalemate: chess.isStalemate()
    });
  });

  // Update position when prop changes
  $: if (chess && position !== chess.fen()) {
    chess.load(position);
    selectedSquare = null;
    possibleMoves = [];
    
    dispatch('positionChange', {
      fen: chess.fen(),
      moves: chess.moves()
    });

    dispatch('check', {
      isCheck: chess.isCheck(),
      isCheckmate: chess.isCheckmate(),
      isStalemate: chess.isStalemate()
    });
  }

  // Generate board squares
  const squares: Array<{
    square: string;
    file: number;
    rank: number;
    piece: string | null;
    isSelected: boolean;
    isPossibleMove: boolean;
    isHighlighted: boolean;
  }> = [];
  for (let rank = 7; rank >= 0; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = getSquareName(file, rank);
      const displayFile = orientation === 'white' ? file : 7 - file;
      const displayRank = orientation === 'white' ? rank : 7 - rank;
      
      squares.push({
        square,
        file: displayFile,
        rank: displayRank,
        piece: getPieceAt(square),
        isSelected: selectedSquare === square,
        isPossibleMove: possibleMoves.includes(square),
        isHighlighted: false
      });
    }
  }
</script>

<div class="chess-board-container" style="width: {size}px; height: {size}px;">
  <div 
    bind:this={boardElement}
    class="chess-board relative border-2 border-slate-600 rounded-lg overflow-hidden"
    style="width: 100%; height: 100%;"
  >
    <!-- Board squares -->
    {#each squares as { square, file, rank, piece, isSelected, isPossibleMove }}
      <div
        class="chess-square relative {getSquareColor(file, rank)} {isSelected ? 'ring-2 ring-yellow-400' : ''} {isPossibleMove ? 'ring-2 ring-green-400' : ''}"
        style="width: 12.5%; height: 12.5%; position: absolute; top: {rank * 12.5}%; left: {file * 12.5}%;"
        on:click={() => handleSquareClick(square)}
        on:keydown={(e) => e.key === 'Enter' || e.key === ' ' ? handleSquareClick(square) : null}
        on:dragstart={(e) => handleDragStart(e, square)}
        on:dragover={handleDragOver}
        on:drop={(e) => handleDrop(e, square)}
        on:dragend={handleDragEnd}
        draggable={interactive && !!piece}
        role="button"
        tabindex="0"
        aria-label="Casilla {square}"
      >
        <!-- Piece -->
        {#if piece}
          <div class="absolute inset-0 flex items-center justify-center text-2xl font-bold select-none pointer-events-none">
            {piece}
          </div>
        {/if}
        
        <!-- Possible move indicator -->
        {#if isPossibleMove && !piece}
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-3 h-3 bg-green-500 rounded-full opacity-70"></div>
          </div>
        {/if}
        
        <!-- Coordinates -->
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
