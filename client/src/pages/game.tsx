import { useGameState } from "@/hooks/useGameState";
import MazeDisplay from "@/components/MazeDisplay";
import SuccessModal from "@/components/SuccessModal";

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
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen font-opensans overflow-x-hidden">
      {/* Header - cleaner and more toddler-friendly */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 text-center shadow-lg">
        <h1 className="font-bold text-xl">🧩 Maze Adventure</h1>
        <div className="text-sm mt-1 opacity-90">
          Level {gameState.currentLevel} • Score: {gameState.totalScore}
        </div>
      </div>

      {/* Main game area - improved responsive layout */}
      <main className="w-full px-4 py-4 pb-24 max-w-none mx-auto">
        <MazeDisplay 
          maze={currentMaze}
          playerPosition={gameState.playerPosition}
          onCellTouch={movePlayer}
          showHint={gameState.showingHint}
          exploredCells={gameState.exploredCells}
          useFogOfWar={gameState.useFogOfWar}
        />

        {/* Game controls - larger, more toddler-friendly */}
        <div className="mt-4 space-y-3">
          <button
            onClick={restartMaze}
            className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-h-[60px]"
          >
            🔄 Try Again
          </button>

          <button
            onClick={showHint}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 min-h-[60px]"
          >
            💡 Show Hint
          </button>
        </div>

        {/* Level selector - improved for mobile */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold mb-3 text-lg text-center text-gray-700">Choose Your Level</h3>
          <div className="grid grid-cols-5 gap-2">
            {[1,2,3,4,5,6,7,8,9,10].map(level => (
              <button
                key={level}
                onClick={() => selectLevel(level)}
                className={`
                  p-3 rounded-lg text-base font-bold transition-all duration-200 min-h-[60px] min-w-[60px] shadow-md
                  ${level === gameState.currentLevel 
                    ? 'bg-blue-600 text-white transform scale-110 shadow-lg' 
                    : level <= gameState.unlockedLevels 
                      ? 'bg-blue-300 text-blue-800 hover:bg-blue-400 hover:scale-105' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
                disabled={level > gameState.unlockedLevels}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Show progress */}
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600 mb-2">
              Completed: {gameState.completedLevels.length} levels
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(gameState.completedLevels.length / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Instructions for parents/kids */}
        <div className="mt-4 p-4 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="text-center">
            <div className="text-2xl mb-2">🌟</div>
            <div className="text-green-800 font-semibold">
              Tap the blue squares to move!
            </div>
            <div className="text-green-600 text-sm mt-1">
              Help the smiley face reach the flag!
            </div>
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