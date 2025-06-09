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
      
      // Add haptic feedback for supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    }
  };

  const isCellVisible = (x: number, y: number) => {
    if (!useFogOfWar) return true;
    
    // Always show current player position and immediate neighbors
    const distance = Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y);
    if (distance <= 1) return true;
    
    // Show explored cells
    return exploredCells.has(`${x},${y}`);
  };

  const isCellExplored = (x: number, y: number) => {
    if (!useFogOfWar) return true;
    return exploredCells.has(`${x},${y}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
      <div className="maze-container">
        <div className="grid gap-1 aspect-square" style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 7}, 1fr)` }}>
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isVisible = isCellVisible(x, y);
              const isExplored = isCellExplored(x, y);
              
              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    maze-cell aspect-square relative cursor-pointer touch-feedback
                    ${!isVisible 
                      ? 'bg-gray-900' 
                      : cell.isWall 
                        ? 'maze-wall' 
                        : 'maze-path'
                    }
                    ${!isVisible && isExplored ? 'bg-gray-700' : ''}
                    ${showHint && cell.isPath && isVisible ? 'bg-yellow-300' : ''}
                    ${!isVisible ? 'opacity-90' : ''}
                  `}
                  onClick={() => isVisible && handleCellClick(x, y, cell)}
                  onTouchStart={() => isVisible && handleCellClick(x, y, cell)}
                >
                  {playerPosition.x === x && playerPosition.y === y && (
                    <div className="player-dot w-8 h-8 absolute inset-1 pulse-animation" />
                  )}
                  
                  {cell.isGoal && isVisible && (
                    <div className="goal-flag absolute inset-1">
                      <Flag className="w-full h-full text-white" />
                    </div>
                  )}
                  
                  {!isVisible && (
                    <div className="absolute inset-0 bg-black opacity-95 flex items-center justify-center text-gray-500 text-xs">
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
        <p className="text-sm text-gray-600 font-opensans">
          <span className="text-coral mr-1">👆</span>
          {useFogOfWar 
            ? "Explore the dark areas to find the flag!" 
            : "Tap the path to move to the flag!"
          }
        </p>
      </div>
    </div>
  );
}
