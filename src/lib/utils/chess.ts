import { Chess } from "chess.js";
import type { ChessPosition, ChessExercise } from "$lib/types";

// Chess.js instance for game logic
export const createChessGame = () => {
  return new Chess();
};

// Parse FEN position
export const parsePosition = (fen: string): ChessPosition => {
  const chess = new Chess(fen);
  return {
    fen: chess.fen(),
    moves: chess.moves(),
    evaluation: 0, // Could integrate with chess engine
  };
};

// Generate random position for exercises
export const generateRandomPosition = (): ChessPosition => {
  const chess = new Chess();

  // Make some random moves to create a position
  const moves = ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6"];
  moves.forEach((move) => {
    try {
      chess.move(move);
    } catch (e) {
      // Ignore invalid moves
    }
  });

  return {
    fen: chess.fen(),
    moves: chess.moves(),
  };
};

// Check if move is legal
export const isLegalMove = (fen: string, move: string): boolean => {
  try {
    const chess = new Chess(fen);
    const result = chess.move(move);
    return !!result;
  } catch {
    return false;
  }
};

// Get all legal moves for a position
export const getLegalMoves = (fen: string): string[] => {
  try {
    const chess = new Chess(fen);
    return chess.moves();
  } catch {
    return [];
  }
};

// Check if position is checkmate
export const isCheckmate = (fen: string): boolean => {
  try {
    const chess = new Chess(fen);
    return chess.isCheckmate();
  } catch {
    return false;
  }
};

// Check if position is stalemate
export const isStalemate = (fen: string): boolean => {
  try {
    const chess = new Chess(fen);
    return chess.isStalemate();
  } catch {
    return false;
  }
};

// Get piece at square
export const getPieceAt = (fen: string, square: string): string | null => {
  try {
    const chess = new Chess(fen);
    const piece = chess.get(square as any);
    return piece ? `${piece.color}${piece.type}` : null;
  } catch {
    return null;
  }
};

// Convert algebraic notation to coordinates
export const algebraicToCoords = (
  move: string,
): { from: string; to: string } | null => {
  try {
    const chess = new Chess();
    const result = chess.move(move);
    if (result) {
      return {
        from: result.from,
        to: result.to,
      };
    }
    return null;
  } catch {
    return null;
  }
};

// Create exercise from position
export const createExercise = (
  title: string,
  description: string,
  position: ChessPosition,
  solution: string[],
  owner_id: string,
  difficulty: "beginner" | "intermediate" | "advanced" = "beginner",
  category: "tactics" | "strategy" | "endgame" | "opening" = "tactics",
): ChessExercise => {
  return {
    id: crypto.randomUUID(),
    owner_id,
    title,
    description,
    position,
    solution,
    difficulty,
    category,
    created_at: new Date().toISOString(),
  };
};

// Validate exercise solution
export const validateSolution = (
  position: ChessPosition,
  moves: string[],
): boolean => {
  try {
    const chess = new Chess(position.fen);

    for (const move of moves) {
      const result = chess.move(move);
      if (!result) return false;
    }

    return true;
  } catch {
    return false;
  }
};
