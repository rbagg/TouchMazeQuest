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
    <div className="bg-gray-50 min-h-screen font-opensans">
      {/* Debug header - visible header */}
      <div className="bg-blue-500 text-white p-4 text-center font-bold">
        Maze Adventure - Level {gameState.currentLevel} - Score: {gameState.totalScore}
      </div>
      
      <main className="max-w-md mx-auto p-4 pb-20">
        {/* Debug progress */}
        <div className="bg-yellow-200 p-3 mb-4 rounded">
          Progress: {Math.round(gameState.progress || 0)}% | Level: {gameState.currentLevel}
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
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={restartMaze}
            className="bg-orange-500 text-white p-4 rounded-lg font-bold"
          >
            🔄 Restart
          </button>
          <button
            onClick={showHint}
            className="bg-yellow-500 text-white p-4 rounded-lg font-bold"
          >
            💡 Hint
          </button>
        </div>
        
        {/* Debug level selector */}
        <div className="mt-4 p-3 bg-green-200 rounded">
          <p className="font-bold mb-2">Select Level:</p>
          <div className="grid grid-cols-5 gap-2">
            {[1,2,3,4,5].map(level => (
              <button
                key={level}
                onClick={() => selectLevel(level)}
                className={`p-2 rounded ${
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
