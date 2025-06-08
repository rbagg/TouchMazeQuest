import { Flag } from "lucide-react";

export interface MazeCell {
  x: number;
  y: number;
  isWall: boolean;
  isPath: boolean;
  isStart: boolean;
  isGoal: boolean;
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
}

export default function MazeDisplay({ 
  maze, 
  playerPosition, 
  onCellTouch, 
  showHint 
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

  return (
    <div className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
      <div className="maze-container">
        <div className="grid gap-1 aspect-square" style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 7}, 1fr)` }}>
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`
                  maze-cell aspect-square relative cursor-pointer touch-feedback
                  ${cell.isWall ? 'maze-wall' : 'maze-path'}
                  ${showHint && cell.isPath ? 'bg-yellow-200' : ''}
                `}
                onClick={() => handleCellClick(x, y, cell)}
                onTouchStart={() => handleCellClick(x, y, cell)}
              >
                {playerPosition.x === x && playerPosition.y === y && (
                  <div className="player-dot w-8 h-8 absolute inset-1 pulse-animation" />
                )}
                
                {cell.isGoal && (
                  <div className="goal-flag absolute inset-1">
                    <Flag className="w-full h-full text-white" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 font-opensans">
          <span className="text-coral mr-1">👆</span>
          Tap the path to move to the flag!
        </p>
      </div>
    </div>
  );
}
