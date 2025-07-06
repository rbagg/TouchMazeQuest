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
    <div className="bg-gray-50 min-h-screen font-opensans overflow-x-hidden">
      {/* Header */}
      <div className="bg-blue-500 text-white p-2 text-center font-bold text-sm">
        Maze Adventure - Level {gameState.currentLevel} - Score: {gameState.totalScore}
      </div>

      <main className="w-full px-3 py-3 pb-20 max-w-sm mx-auto">
        <MazeDisplay 
          maze={currentMaze}
          playerPosition={gameState.playerPosition}
          onCellTouch={movePlayer}
          showHint={gameState.showingHint}
          exploredCells={gameState.exploredCells}
          useFogOfWar={gameState.useFogOfWar}
        />

        {/* Controls */}
        <div className="mt-2 space-y-2">
          <button
            onClick={restartMaze}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg font-bold text-sm transition-colors"
          >
            🔄 Restart Level
          </button>

          <button
            onClick={showHint}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg font-bold text-sm transition-colors"
          >
            💡 Show Hint
          </button>
        </div>

        {/* Level selector */}
        <div className="mt-4 p-2 bg-green-200 rounded">
          <p className="font-bold mb-2 text-sm">Select Level:</p>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({length: 20}, (_, i) => i + 1).map(level => (
              <button
                key={level}
                onClick={() => selectLevel(level)}
                className={`p-2 rounded text-xs font-bold transition-colors ${
                  level === gameState.currentLevel 
                    ? 'bg-blue-600 text-white' 
                    : gameState.completedLevels.includes(level)
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-300 text-black hover:bg-blue-400'
                }`}
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
        hasNextLevel={gameState.currentLevel < 50} // Updated to 50 levels
      />
    </div>
  );
}