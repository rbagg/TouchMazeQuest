import { Flag } from "lucide-react";

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
  const handleCellClick = (x: number, y: number, cell: MazeCell) => {
    if (cell.isPath || cell.isGoal) {
      onCellTouch(x, y);

      // Enhanced haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50); // Slightly longer vibration
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
      if (goalDistance <= 2) return true; // Show goal and 2 blocks around it
    }

    // Show explored cells
    return exploredCells.has(`${x},${y}`);
  };

  const isCellExplored = (x: number, y: number) => {
    if (!useFogOfWar) return true;
    return exploredCells.has(`${x},${y}`);
  };

  // Calculate dynamic cell size for mobile optimization
  const getCellSize = () => {
    if (typeof window === 'undefined') return '50px';

    const screenWidth = window.innerWidth;
    const padding = 48; // Total padding from container
    const maxSize = screenWidth - padding;
    const gridSize = maze[0]?.length || 7;
    const cellSize = Math.floor(maxSize / gridSize);
    const finalSize = Math.max(50, Math.min(cellSize, 80)); // Between 50px and 80px
    return `${finalSize}px`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
      <div className="maze-container overflow-hidden">
        <div 
          className="grid gap-1 mx-auto" 
          style={{ 
            gridTemplateColumns: `repeat(${maze[0]?.length || 7}, ${getCellSize()})`,
            maxWidth: '100vw',
            justifyContent: 'center'
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isVisible = isCellVisible(x, y);
              const isExplored = isCellExplored(x, y);

              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    maze-cell aspect-square relative cursor-pointer touch-feedback touch-manipulation
                    ${!isVisible 
                      ? 'bg-gray-900' 
                      : cell.isWall 
                        ? 'maze-wall' 
                        : 'maze-path'
                    }
                    ${!isVisible && isExplored ? 'bg-gray-700' : ''}
                    ${showHint && cell.isPath && isVisible ? 'bg-yellow-300 animate-pulse' : ''}
                    ${!isVisible ? 'opacity-90' : ''}
                  `}
                  style={{ 
                    minHeight: '50px', 
                    minWidth: '50px',
                    height: getCellSize(),
                    width: getCellSize()
                  }}
                  onClick={() => isVisible && handleCellClick(x, y, cell)}
                  onTouchStart={() => isVisible && handleCellClick(x, y, cell)}
                >
                  {playerPosition.x === x && playerPosition.y === y && (
                    <div className="player-dot w-full h-full absolute inset-1 pulse-animation" />
                  )}

                  {cell.isGoal && isVisible && (
                    <div className="goal-flag absolute inset-1">
                      <Flag className="w-full h-full text-white" />
                    </div>
                  )}

                  {!isVisible && (
                    <div className="absolute inset-0 bg-black opacity-95 flex items-center justify-center text-gray-500 text-xs rounded">
                      ?
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-base text-gray-600 font-opensans font-semibold">
          <span className="text-coral mr-1">👆</span>
          {useFogOfWar 
            ? "Explore the dark areas to find the flag!" 
            : "Tap the blue squares to move to the flag!"
          }
        </p>
      </div>
    </div>
  );
}