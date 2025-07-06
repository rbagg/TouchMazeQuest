import { Position } from "@/components/MazeDisplay";

export interface GameState {
  currentLevel: number;
  playerPosition: Position;
  completedLevels: number[];
  totalScore: number;
  unlockedLevels: number;
  isComplete: boolean;
  progress?: number;
  showingHint?: boolean;
  exploredCells?: Set<string>;
  useFogOfWar?: boolean;
}

export const INITIAL_GAME_STATE: GameState = {
  currentLevel: 1,
  playerPosition: { x: 0, y: 0 }, // FIXED: Start at (0,0) to match maze generation
  completedLevels: [],
  totalScore: 0,
  unlockedLevels: 50, // FIXED: Allow jumping to any level up to 50
  isComplete: false,
  progress: 0,
  showingHint: false,
  exploredCells: new Set(['0,0']), // FIXED: Match starting position
  useFogOfWar: false,
};

export function saveGameState(gameState: GameState): void {
  try {
    const serializable = {
      ...gameState,
      exploredCells: Array.from(gameState.exploredCells || [])
    };
    localStorage.setItem('mazeGameProgress', JSON.stringify(serializable));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
}

export function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem('mazeGameProgress');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...INITIAL_GAME_STATE, 
        ...parsed,
        exploredCells: new Set(parsed.exploredCells || ['0,0']),
        unlockedLevels: 50 // Always allow level jumping
      };
    }
  } catch (error) {
    console.warn('Failed to load game state:', error);
  }
  return INITIAL_GAME_STATE;
}

export function calculateLevelScore(level: number, moves: number): number {
  const baseScore = level * 10;
  const moveBonus = Math.max(0, 50 - moves);
  return baseScore + moveBonus;
}

export function isValidMove(
  from: Position, 
  to: Position, 
  maze: any[][]
): boolean {
  // Check if positions are adjacent
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);

  if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    // Check if target cell is walkable
    const cell = maze[to.y]?.[to.x];
    return cell && (cell.isPath || cell.isGoal);
  }

  return false;
}

export function calculateProgress(
  playerPosition: Position,
  goalPosition: Position,
  mazeSize: number
): number {
  const distance = Math.abs(playerPosition.x - goalPosition.x) + 
                  Math.abs(playerPosition.y - goalPosition.y);
  const maxDistance = mazeSize * 2;
  return Math.max(0, Math.min(100, ((maxDistance - distance) / maxDistance) * 100));
}

// IMPROVED: Better fog of war logic for advanced toddlers
export function shouldUseFogOfWar(level: number): boolean {
  // Introduce fog of war earlier for advanced toddlers
  if (level <= 3) {
    return false; // No fog for very early levels
  } else if (level <= 8) {
    return true; // Light fog for medium levels
  } else {
    return true; // Full fog for advanced levels
  }
}

// NEW: Dynamic visibility radius based on level
export function getFogOfWarRadius(level: number): number {
  if (level <= 5) {
    return 2; // Large radius for beginners
  } else if (level <= 10) {
    return 1; // Medium radius
  } else {
    return 1; // Challenging radius for advanced
  }
}

// NEW: Helper for toddler-friendly features
export function getToddlerFeatures(level: number) {
  return {
    showHintsEasily: level <= 6,
    allowMultipleHints: level <= 3,
    highlightGoal: level <= 5,
    largerTouchTargets: level <= 8,
    animatedPathHints: level <= 10,
    celebrationDuration: level <= 3 ? 3000 : 2000, // Longer celebration for early levels
  };
}