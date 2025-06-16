import { useState, useEffect, useCallback } from "react";
import { Position, MazeCell } from "@/components/MazeDisplay";
import { 
  GameState, 
  INITIAL_GAME_STATE, 
  saveGameState, 
  loadGameState,
  calculateLevelScore,
  isValidMove,
  calculateProgress
} from "@/lib/gameLogic";
import { getMazeForLevel } from "@/lib/mazeGenerator";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [currentMaze, setCurrentMaze] = useState<MazeCell[][]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  // Load saved game state on mount
  useEffect(() => {
    const savedState = loadGameState();
    setGameState(savedState);
    setCurrentMaze(getMazeForLevel(savedState.currentLevel));
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Calculate progress whenever player position changes
  useEffect(() => {
    if (currentMaze.length > 0) {
      const goalCell = currentMaze.flat().find(cell => cell.isGoal);
      if (goalCell) {
        const progress = calculateProgress(
          gameState.playerPosition,
          { x: goalCell.x, y: goalCell.y },
          currentMaze.length
        );
        setGameState(prev => ({ ...prev, progress }));
      }
    }
  }, [gameState.playerPosition, currentMaze]);

  const movePlayer = useCallback((x: number, y: number) => {
    const targetCell = currentMaze[y]?.[x];
    if (!targetCell || (!targetCell.isPath && !targetCell.isGoal)) {
      return;
    }

    if (!isValidMove(gameState.playerPosition, { x, y }, currentMaze)) {
      return;
    }

    setMoveCount(prev => prev + 1);

    // Update explored cells for fog of war
    const newExploredCells = new Set(gameState.exploredCells);

    // Add current position and adjacent cells to explored
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < currentMaze[0]?.length && newY >= 0 && newY < currentMaze.length) {
          newExploredCells.add(`${newX},${newY}`);
        }
      }
    }

    setGameState(prev => ({
      ...prev,
      playerPosition: { x, y },
      exploredCells: newExploredCells
    }));

    // Check if player reached the goal
    if (targetCell.isGoal) {
      const levelScore = calculateLevelScore(gameState.currentLevel, moveCount + 1);

      setGameState(prev => ({
        ...prev,
        completedLevels: prev.completedLevels.includes(prev.currentLevel)
          ? prev.completedLevels
          : [...prev.completedLevels, prev.currentLevel],
        totalScore: prev.totalScore + levelScore,
        unlockedLevels: Math.max(prev.unlockedLevels, prev.currentLevel + 1),
        isComplete: true,
        progress: 100
      }));

      setTimeout(() => {
        setShowSuccess(true);
      }, 500);
    }
  }, [gameState.playerPosition, gameState.exploredCells, currentMaze, moveCount, gameState.currentLevel]);

  const restartMaze = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerPosition: { x: 1, y: 1 },
      isComplete: false,
      progress: 0,
      exploredCells: new Set(['1,1'])
    }));
    setMoveCount(0);
    setShowSuccess(false);
  }, []);

  const showHint = useCallback(() => {
    setGameState(prev => ({ ...prev, showingHint: true }));
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showingHint: false }));
    }, 3000); // Longer hint duration for children
  }, []);

  const nextLevel = useCallback(() => {
    const newLevel = gameState.currentLevel + 1;
    if (newLevel <= 15) { // Increased max levels
      const newMaze = getMazeForLevel(newLevel);
      setCurrentMaze(newMaze);
      setGameState(prev => ({
        ...prev,
        currentLevel: newLevel,
        playerPosition: { x: 1, y: 1 },
        isComplete: false,
        progress: 0,
        exploredCells: new Set(['1,1']),
        useFogOfWar: newLevel >= 12 // CHANGED: Enable fog of war starting from level 12 instead of 8
      }));
      setMoveCount(0);
    }
  }, [gameState.currentLevel]);

  const selectLevel = useCallback((level: number) => {
    if (level <= gameState.unlockedLevels) {
      const newMaze = getMazeForLevel(level);
      setCurrentMaze(newMaze);
      setGameState(prev => ({
        ...prev,
        currentLevel: level,
        playerPosition: { x: 1, y: 1 },
        isComplete: false,
        progress: 0,
        exploredCells: new Set(['1,1']),
        useFogOfWar: level >= 12 // CHANGED: Enable fog of war starting from level 12 instead of 8
      }));
      setMoveCount(0);
      setShowSuccess(false);
    }
  }, [gameState.unlockedLevels]);

  return {
    gameState,
    currentMaze,
    movePlayer,
    restartMaze,
    showHint,
    nextLevel,
    selectLevel,
    showSuccess,
    setShowSuccess
  };
}