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
      <GameHeader 
        currentLevel={gameState.currentLevel}
        completedLevels={gameState.completedLevels}
      />
      
      <main className="max-w-md mx-auto p-4 pb-20">
        <ProgressDisplay 
          score={gameState.totalScore}
          progress={gameState.progress || 0}
        />
        
        <MazeDisplay 
          maze={currentMaze}
          playerPosition={gameState.playerPosition}
          onCellTouch={movePlayer}
          showHint={gameState.showingHint}
          exploredCells={gameState.exploredCells}
          useFogOfWar={gameState.useFogOfWar}
        />
        
        <GameControls 
          onRestart={restartMaze}
          onHint={showHint}
        />
        
        <LevelPreview 
          currentLevel={gameState.currentLevel}
          unlockedLevels={gameState.unlockedLevels}
          completedLevels={gameState.completedLevels}
          onSelectLevel={selectLevel}
        />
      </main>
      
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onNextLevel={nextLevel}
        onPlayAgain={restartMaze}
        currentLevel={gameState.currentLevel}
        hasNextLevel={gameState.currentLevel < 10}
      />
      
      <BottomNavigation />
    </div>
  );
}
