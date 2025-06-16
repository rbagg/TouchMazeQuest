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
  playerPosition: { x: 1, y: 1 },
  completedLevels: [],
  totalScore: 0,
  unlockedLevels: 1,
  isComplete: false,
  progress: 0,
  showingHint: false,
  exploredCells: new Set(['1,1']),
  useFogOfWar: false, // Start with fog of war disabled
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
        exploredCells: new Set(parsed.exploredCells || ['1,1'])
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