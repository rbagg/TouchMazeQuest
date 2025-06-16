import { Star } from "lucide-react";

interface LevelPreviewProps {
  currentLevel: number;
  unlockedLevels: number;
  completedLevels: number[];
  onSelectLevel: (level: number) => void;
}

// Helper function to get level style names
function getLevelStyleName(level: number): string {
  if (level <= 3) return "Simple Path";
  if (level <= 6) return "Choose Route";  
  if (level <= 9) return "Spiral";
  if (level <= 12) return "Maze";
  return "Advanced";
}

export default function LevelPreview({ 
  currentLevel, 
  unlockedLevels, 
  completedLevels, 
  onSelectLevel 
}: LevelPreviewProps) {
  const maxLevels = 15; // Increased from 10
  const availableLevels = Array.from({ length: Math.min(unlockedLevels, maxLevels) }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h3 className="text-lg font-bold text-gray-700 mb-3 text-center">Choose Level</h3>

      {/* Mobile-optimized scrollable level selection */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {availableLevels.map(level => (
            <button
              key={level}
              onClick={() => onSelectLevel(level)}
              className={`
                level-button flex-shrink-0 rounded-lg font-bold text-sm flex flex-col items-center justify-center touch-manipulation transition-all duration-200
                ${currentLevel === level 
                  ? 'bg-purple-500 text-white shadow-lg scale-105' 
                  : completedLevels.includes(level)
                    ? 'bg-green-400 text-white hover:bg-green-500'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }
              `}
              style={{ 
                minWidth: '70px', 
                minHeight: '70px',
                width: '70px',
                height: '70px'
              }}
            >
              <span className="text-lg font-bold">{level}</span>
              <span className="text-xs mt-1 leading-tight text-center">
                {getLevelStyleName(level)}
              </span>
              {completedLevels.includes(level) && (
                <Star className="w-3 h-3 mt-1" fill="currentColor" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Show progress */}
      <div className="mt-3 text-center text-sm text-gray-600">
        <span className="font-semibold">{completedLevels.length}</span> of <span className="font-semibold">{unlockedLevels}</span> levels completed
      </div>

      {/* Show current level info */}
      <div className="mt-2 text-center text-xs text-gray-500">
        Current: Level {currentLevel} - {getLevelStyleName(currentLevel)}
      </div>
    </div>
  );
}