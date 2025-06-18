import { Flag } from "lucide-react";
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
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
        <div className="text-center text-gray-500">Loading maze...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
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
                        ? 'bg-gray-100 border-2 border-gray-300' 
                        : 'bg-blue-400 border-2 border-blue-600 hover:bg-blue-500 active:bg-blue-600'
                    }
                    ${!isVisible && isExplored ? 'bg-gray-600' : ''}
                    ${showHint && cell.isPath && isVisible ? 'bg-yellow-400 animate-pulse' : ''}
                    ${!isVisible ? 'opacity-80' : ''}
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
                  {isPlayerHere && (
                    <div className="absolute inset-1 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold animate-pulse shadow-lg z-10">
                      <span style={{ fontSize: `${Math.max(cellSize * 0.4, 16)}px` }}>😊</span>
                    </div>
                  )}

                  {cell.isGoal && isVisible && (
                    <div className="absolute inset-1 bg-green-500 rounded-full flex items-center justify-center z-10 animate-bounce">
                      <Flag 
                        className="text-white drop-shadow-md" 
                        size={Math.max(cellSize * 0.6, 20)}
                      />
                    </div>
                  )}

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

      <div className="mt-4 text-center px-2">
        <p className="text-base text-gray-700 font-semibold">
          <span className="text-2xl mr-2">🎯</span>
          {useFogOfWar 
            ? "Explore to find the flag!" 
            : "Tap the blue squares to reach the flag!"
          }
        </p>
      </div>
    </div>
  );
}