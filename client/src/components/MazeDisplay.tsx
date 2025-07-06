import { Flag, Star, Car, Fish, Flower, TreePine } from "lucide-react";
import { useEffect, useState } from "react";

export interface MazeCell {
  x: number;
  y: number;
  isWall: boolean;
  isPath: boolean;
  isStart: boolean;
  isGoal: boolean;
  isVisible?: boolean;
  isExplored?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface MazeTheme {
  name: string;
  pathColor: string;
  wallColor: string;
  playerColor: string;
  goalIcon: React.ReactNode;
  playerIcon: string;
  backgroundClass: string;
  description: string;
}

const THEMES: MazeTheme[] = [
  {
    name: "Ocean Adventure",
    pathColor: "bg-blue-400 border-2 border-blue-600",
    wallColor: "bg-blue-900 border-2 border-blue-800",
    playerColor: "bg-orange-500",
    goalIcon: <Fish className="text-white drop-shadow-md" />,
    playerIcon: "🐠",
    backgroundClass: "bg-gradient-to-br from-blue-100 to-blue-200",
    description: "Swim through the ocean!"
  },
  {
    name: "Forest Quest",
    pathColor: "bg-green-400 border-2 border-green-600",
    wallColor: "bg-green-900 border-2 border-green-800",
    playerColor: "bg-amber-600",
    goalIcon: <TreePine className="text-white drop-shadow-md" />,
    playerIcon: "🐰",
    backgroundClass: "bg-gradient-to-br from-green-100 to-green-200",
    description: "Hop through the forest!"
  },
  {
    name: "Space Mission",
    pathColor: "bg-purple-400 border-2 border-purple-600",
    wallColor: "bg-gray-900 border-2 border-gray-800",
    playerColor: "bg-yellow-500",
    goalIcon: <Star className="text-white drop-shadow-md" />,
    playerIcon: "🚀",
    backgroundClass: "bg-gradient-to-br from-purple-100 to-indigo-200",
    description: "Fly to the stars!"
  },
  {
    name: "Garden Party",
    pathColor: "bg-pink-400 border-2 border-pink-600",
    wallColor: "bg-green-700 border-2 border-green-600",
    playerColor: "bg-yellow-400",
    goalIcon: <Flower className="text-white drop-shadow-md" />,
    playerIcon: "🦋",
    backgroundClass: "bg-gradient-to-br from-pink-100 to-yellow-100",
    description: "Flutter to the flowers!"
  },
  {
    name: "Car Race",
    pathColor: "bg-gray-400 border-2 border-gray-600",
    wallColor: "bg-red-700 border-2 border-red-600",
    playerColor: "bg-blue-500",
    goalIcon: <Flag className="text-white drop-shadow-md" />,
    playerIcon: "🏎️",
    backgroundClass: "bg-gradient-to-br from-gray-100 to-gray-200",
    description: "Race to the finish!"
  }
];

// Helper function to get goal name for dynamic text
function getGoalName(theme: MazeTheme): string {
  switch(theme.name) {
    case "Ocean Adventure": return "fish";
    case "Forest Quest": return "tree"; 
    case "Space Mission": return "star";
    case "Garden Party": return "flower";
    case "Car Race": return "finish line";
    default: return "goal";
  }
}

interface MazeDisplayProps {
  maze: MazeCell[][];
  playerPosition: Position;
  onCellTouch: (x: number, y: number) => void;
  showHint?: boolean;
  exploredCells?: Set<string>;
  useFogOfWar?: boolean;
}

export default function MazeDisplay({ 
  maze, 
  playerPosition, 
  onCellTouch, 
  showHint,
  exploredCells = new Set(),
  useFogOfWar = false
}: MazeDisplayProps) {
  const [cellSize, setCellSize] = useState(60);
  const [currentTheme, setCurrentTheme] = useState<MazeTheme>(THEMES[0]);
  const [moveCount, setMoveCount] = useState(0);
  const [movesRemaining, setMovesRemaining] = useState<number | null>(null);
  const [showMoveUpdate, setShowMoveUpdate] = useState(false);

  // Get current level from localStorage or estimate from player progress
  const getCurrentLevel = () => {
    try {
      const saved = localStorage.getItem('mazeGameProgress');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentLevel || 1;
      }
    } catch (error) {
      console.warn('Could not get current level:', error);
    }
    return 1;
  };

  // Track move count
  useEffect(() => {
    const prevPosition = JSON.stringify(playerPosition);
    const currentPosition = JSON.stringify(playerPosition);

    if (prevPosition !== currentPosition && (playerPosition.x !== 0 || playerPosition.y !== 0 || moveCount > 0)) {
      setMoveCount(prev => prev + 1);
      setShowMoveUpdate(true);
      setTimeout(() => setShowMoveUpdate(false), 1500);
    }
  }, [playerPosition]);

  // Reset move count when maze changes (new level)
  useEffect(() => {
    setMoveCount(0);
  }, [maze]);

  // Change theme based on estimated level
  useEffect(() => {
    const level = getCurrentLevel();
    const themeIndex = Math.floor((level - 1) / 3) % THEMES.length;
    setCurrentTheme(THEMES[themeIndex]);
  }, [maze]); // Update when maze changes (new level)

  // Calculate moves remaining to goal
  useEffect(() => {
    if (maze.length > 0) {
      const goalCell = maze.flat().find(cell => cell.isGoal);
      if (goalCell) {
        const distance = Math.abs(playerPosition.x - goalCell.x) + 
                        Math.abs(playerPosition.y - goalCell.y);
        setMovesRemaining(distance);
      }
    }
  }, [playerPosition, maze]);

  // Calculate optimal cell size for mobile
  useEffect(() => {
    const calculateCellSize = () => {
      if (typeof window === 'undefined' || !maze.length) return 60;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Account for padding, margins, and other UI elements
      const availableWidth = screenWidth - 64; // 32px padding on each side
      const availableHeight = Math.min(screenHeight * 0.6, availableWidth); // Max 60% of screen height

      const gridSize = maze.length;
      const maxCellFromWidth = Math.floor(availableWidth / gridSize);
      const maxCellFromHeight = Math.floor(availableHeight / gridSize);

      // Choose the smaller dimension and ensure minimum touch target
      const calculatedSize = Math.min(maxCellFromWidth, maxCellFromHeight);
      return Math.max(50, Math.min(calculatedSize, 90)); // Between 50px and 90px
    };

    setCellSize(calculateCellSize());

    // Recalculate on window resize
    const handleResize = () => setCellSize(calculateCellSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maze]);

  const handleCellClick = (x: number, y: number, cell: MazeCell) => {
    if (cell.isPath || cell.isGoal) {
      onCellTouch(x, y);

      // Enhanced haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const isCellVisible = (x: number, y: number) => {
    if (!useFogOfWar) return true;

    // Always show current player position and immediate neighbors
    const distance = Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y);
    if (distance <= 1) return true;

    // Find and always show the goal area (flag and surrounding cells)
    const goalCell = maze.flat().find(cell => cell.isGoal);
    if (goalCell) {
      const goalDistance = Math.abs(x - goalCell.x) + Math.abs(y - goalCell.y);
      if (goalDistance <= 2) return true;
    }

    // Show explored cells
    return exploredCells.has(`${x},${y}`);
  };

  const isCellExplored = (x: number, y: number) => {
    if (!useFogOfWar) return true;
    return exploredCells.has(`${x},${y}`);
  };

  if (!maze.length) {
    return (
      <div className={`${currentTheme.backgroundClass} rounded-2xl p-6 mb-4 shadow-lg`}>
        <div className="text-center text-gray-500">Loading maze...</div>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.backgroundClass} rounded-2xl p-4 mb-4 shadow-lg`}>
      {/* Theme Title */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {currentTheme.name}
        </h2>
        <p className="text-sm text-gray-600">{currentTheme.description}</p>
      </div>

      {/* Move Counter */}
      <div className="flex justify-center gap-4 mb-4 text-sm">
        <div className={`
          px-3 py-1 rounded-full transition-all duration-300 font-semibold
          ${showMoveUpdate ? 'bg-blue-500 text-white scale-110 shadow-lg' : 'bg-white text-gray-600 shadow-md'}
        `}>
          🚶 Steps: {moveCount}
        </div>
        {movesRemaining !== null && movesRemaining > 0 && (
          <div className="px-3 py-1 bg-green-500 text-white rounded-full font-semibold shadow-md">
            🎯 {movesRemaining} to go!
          </div>
        )}
      </div>

      <div className="maze-container flex justify-center items-center">
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${maze[0]?.length || 1}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${maze.length}, ${cellSize}px)`
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isVisible = isCellVisible(x, y);
              const isExplored = isCellExplored(x, y);
              const isPlayerHere = playerPosition.x === x && playerPosition.y === y;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    relative cursor-pointer transition-all duration-150 rounded-md overflow-hidden
                    ${!isVisible 
                      ? 'bg-gray-800' 
                      : cell.isWall 
                        ? currentTheme.wallColor
                        : currentTheme.pathColor + ' hover:opacity-80 active:scale-95'
                    }
                    ${!isVisible && isExplored ? 'bg-gray-600' : ''}
                    ${showHint && cell.isPath && isVisible ? 'bg-yellow-400 animate-pulse' : ''}
                    ${!isVisible ? 'opacity-30' : 'opacity-100'}
                  `}
                  style={{ 
                    width: `${cellSize}px`, 
                    height: `${cellSize}px`,
                    touchAction: 'manipulation'
                  }}
                  onClick={() => isVisible && handleCellClick(x, y, cell)}
                  onTouchStart={(e) => {
                    e.preventDefault(); // Prevent double-tap zoom
                    if (isVisible) handleCellClick(x, y, cell);
                  }}
                >
                  {/* Player */}
                  {isPlayerHere && (
                    <div className={`
                      absolute inset-1 ${currentTheme.playerColor} rounded-full
                      flex items-center justify-center shadow-lg z-10 animate-pulse
                    `}>
                      <span style={{ fontSize: `${Math.max(cellSize * 0.4, 16)}px` }}>
                        {currentTheme.playerIcon}
                      </span>
                    </div>
                  )}

                  {/* Goal Icon */}
                  {cell.isGoal && isVisible && (
                    <div className={`
                      absolute inset-1 ${currentTheme.playerColor} rounded-full
                      flex items-center justify-center z-10 animate-bounce shadow-lg
                    `}>
                      <div style={{ fontSize: `${Math.max(cellSize * 0.6, 20)}px` }}>
                        {currentTheme.goalIcon}
                      </div>
                    </div>
                  )}

                  {/* Start indicator */}
                  {cell.isStart && !isPlayerHere && isVisible && (
                    <div className="absolute inset-2 bg-green-400 rounded-full opacity-50 animate-pulse" />
                  )}

                  {/* Path hint animation */}
                  {showHint && cell.isPath && isVisible && !isPlayerHere && !cell.isGoal && (
                    <div className="absolute inset-1 bg-yellow-300 rounded-md opacity-60 animate-pulse" />
                  )}

                  {/* Fog of war overlay */}
                  {!isVisible && (
                    <div className="absolute inset-0 bg-gray-700 opacity-95 flex items-center justify-center text-gray-400 rounded-md">
                      <span style={{ fontSize: `${Math.max(cellSize * 0.3, 12)}px` }}>?</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Theme Progress Indicator */}
      <div className="flex justify-center mt-4">
        <div className="flex gap-1">
          {THEMES.map((theme, index) => (
            <div
              key={theme.name}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${theme.name === currentTheme.name ? 'bg-gray-800 scale-125' : 'bg-gray-400'}
              `}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 text-center px-2">
        <p className="text-base text-gray-700 font-semibold">
          <span className="text-2xl mr-2">🎯</span>
          {useFogOfWar 
            ? `Explore to find the ${getGoalName(currentTheme)}!` 
            : `Tap the colored squares to reach the ${getGoalName(currentTheme)}!`
          }
        </p>
      </div>
    </div>
  );
}