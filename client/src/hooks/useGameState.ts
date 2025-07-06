import { useState, useEffect, useCallback } from "react";
import { Position, MazeCell } from "@/components/MazeDisplay";
import { 
  GameState, 
  INITIAL_GAME_STATE, 
  saveGameState, 
  loadGameState,
  calculateLevelScore,
  isValidMove,
  calculateProgress,
  shouldUseFogOfWar,
  getFogOfWarRadius,
  getToddlerFeatures
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

    // IMPROVED: Dynamic fog of war radius based on level
    const newExploredCells = new Set(gameState.exploredCells);
    const fogRadius = getFogOfWarRadius(gameState.currentLevel);

    // Add current position and surrounding cells based on radius
    for (let dy = -fogRadius; dy <= fogRadius; dy++) {
      for (let dx = -fogRadius; dx <= fogRadius; dx++) {
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
      const toddlerFeatures = getToddlerFeatures(gameState.currentLevel);

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

      // IMPROVED: Longer celebration for early levels
      setTimeout(() => {
        setShowSuccess(true);
      }, 500);

      // Auto-advance to next level after celebration for early levels
      if (gameState.currentLevel <= 3) {
        setTimeout(() => {
          nextLevel();
        }, toddlerFeatures.celebrationDuration);
      }
    }
  }, [gameState.playerPosition, gameState.exploredCells, currentMaze, moveCount, gameState.currentLevel]);

  const restartMaze = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerPosition: { x: 0, y: 0 }, // FIXED: Consistent start position
      isComplete: false,
      progress: 0,
      exploredCells: new Set(['0,0']) // FIXED: Match starting position
    }));
    setMoveCount(0);
    setShowSuccess(false);
  }, []);

  const showHint = useCallback(() => {
    const toddlerFeatures = getToddlerFeatures(gameState.currentLevel);

    setGameState(prev => ({ ...prev, showingHint: true }));

    // IMPROVED: Longer hints for early levels, shorter for advanced
    const hintDuration = toddlerFeatures.showHintsEasily ? 4000 : 2000;

    setTimeout(() => {
      setGameState(prev => ({ ...prev, showingHint: false }));
    }, hintDuration);
  }, [gameState.currentLevel]);

  const nextLevel = useCallback(() => {
    const newLevel = gameState.currentLevel + 1;
    // IMPROVED: Support more levels (up to 50)
    if (newLevel <= 50) {
      const newMaze = getMazeForLevel(newLevel);
      setCurrentMaze(newMaze);
      setGameState(prev => ({
        ...prev,
        currentLevel: newLevel,
        playerPosition: { x: 0, y: 0 }, // FIXED: Consistent start position
        isComplete: false,
        progress: 0,
        exploredCells: new Set(['0,0']), // FIXED: Match starting position
        useFogOfWar: shouldUseFogOfWar(newLevel) // IMPROVED: Dynamic fog of war
      }));
      setMoveCount(0);
      setShowSuccess(false);
    }
  }, [gameState.currentLevel]);

  const selectLevel = useCallback((level: number) => {
    // FIXED: Allow jumping to any level (no unlocking requirement)
    if (level >= 1 && level <= 50) {
      const newMaze = getMazeForLevel(level);
      setCurrentMaze(newMaze);
      setGameState(prev => ({
        ...prev,
        currentLevel: level,
        playerPosition: { x: 0, y: 0 }, // FIXED: Consistent start position
        isComplete: false,
        progress: 0,
        exploredCells: new Set(['0,0']), // FIXED: Match starting position
        useFogOfWar: shouldUseFogOfWar(level) // IMPROVED: Dynamic fog of war
      }));
      setMoveCount(0);
      setShowSuccess(false);
    }
  }, []);

  const getCurrentFeatures = useCallback(() => {
    return getToddlerFeatures(gameState.currentLevel);
  }, [gameState.currentLevel]);

  return {
    gameState,
    currentMaze,
    movePlayer,
    restartMaze,
    showHint,
    nextLevel,
    selectLevel,
    showSuccess,
    setShowSuccess,
    getCurrentFeatures, // NEW: Access to toddler-friendly features
    fogRadius: getFogOfWarRadius(gameState.currentLevel), // NEW: Current fog radius
    moveCount // NEW: Current move count for display
  };
}