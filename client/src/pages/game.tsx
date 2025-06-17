import { useGameState } from "@/hooks/useGameState";
import GameHeader from "@/components/GameHeader";
import ProgressDisplay from "@/components/ProgressDisplay";
import MazeDisplay from "@/components/MazeDisplay";
import GameControls from "@/components/GameControls";
import LevelPreview from "@/components/LevelPreview";
import SuccessModal from "@/components/SuccessModal";
import BottomNavigation from "@/components/BottomNavigation";

export default function Game() {
  const {
    gameState,
    currentMaze,
    movePlayer,
    restartMaze,
    showHint,
    nextLevel,
    selectLevel,
    showSuccess,
    setShowSuccess
  } = useGameState();

  return (
    <div className="bg-gray-50 min-h-screen font-opensans overflow-x-hidden">
      {/* Debug header - visible header */}
      <div className="bg-blue-500 text-white p-2 text-center font-bold text-sm">
        Maze Adventure - Level {gameState.currentLevel} - Score: {gameState.totalScore}
      </div>
      
      <main className="w-full px-2 py-2 pb-20">
        {/* Debug progress */}
        <div className="bg-yellow-200 p-2 mb-2 rounded text-sm">
          Progress: {Math.round(gameState.progress || 0)}%
        </div>
        
        <MazeDisplay 
          maze={currentMaze}
          playerPosition={gameState.playerPosition}
          onCellTouch={movePlayer}
          showHint={gameState.showingHint}
          exploredCells={gameState.exploredCells}
          useFogOfWar={gameState.useFogOfWar}
        />
        
        {/* Debug controls */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={restartMaze}
            className="bg-orange-500 text-white p-3 rounded-lg font-bold text-sm"
          >
            🔄 Restart
          </button>
          <button
            onClick={showHint}
            className="bg-yellow-500 text-white p-3 rounded-lg font-bold text-sm"
          >
            💡 Hint
          </button>
        </div>
        
        {/* Debug level selector */}
        <div className="mt-2 p-2 bg-green-200 rounded">
          <p className="font-bold mb-1 text-sm">Select Level:</p>
          <div className="grid grid-cols-5 gap-1">
            {[1,2,3,4,5].map(level => (
              <button
                key={level}
                onClick={() => selectLevel(level)}
                className={`p-2 rounded text-sm ${
                  level === gameState.currentLevel 
                    ? 'bg-blue-600 text-white' 
                    : level <= gameState.unlockedLevels 
                      ? 'bg-blue-300 text-black' 
                      : 'bg-gray-300 text-gray-500'
                }`}
                disabled={level > gameState.unlockedLevels}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </main>
      
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onNextLevel={nextLevel}
        onPlayAgain={restartMaze}
        currentLevel={gameState.currentLevel}
        hasNextLevel={gameState.currentLevel < 15}
      />
    </div>
  );
}
