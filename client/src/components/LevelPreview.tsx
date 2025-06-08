import { Lock, Star } from "lucide-react";

interface LevelPreviewProps {
  currentLevel: number;
  unlockedLevels: number;
  completedLevels: number[];
  onSelectLevel: (level: number) => void;
}

export default function LevelPreview({ 
  currentLevel, 
  unlockedLevels, 
  completedLevels, 
  onSelectLevel 
}: LevelPreviewProps) {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  
  const isLevelUnlocked = (level: number) => level <= unlockedLevels;
  const isLevelCompleted = (level: number) => completedLevels.includes(level);
  
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <h3 className="font-fredoka text-lg text-dark-gray mb-3 text-center">
        Choose Your Adventure
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level);
          const completed = isLevelCompleted(level);
          const current = level === currentLevel;
          
          return (
            <button
              key={level}
              className={`
                relative overflow-hidden cursor-pointer transition-all duration-200 transform active:scale-95 touch-feedback
                font-fredoka text-sm py-3 rounded-xl text-center
                ${unlocked 
                  ? current 
                    ? 'bg-purple text-white ring-2 ring-sunny' 
                    : 'bg-coral text-white hover:bg-coral'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              onClick={() => unlocked && onSelectLevel(level)}
              disabled={!unlocked}
            >
              <div className="relative z-10">{level}</div>
              {completed && (
                <Star className="absolute top-1 right-1 w-3 h-3 text-sunny fill-sunny" />
              )}
              {!unlocked && (
                <Lock className="absolute inset-0 m-auto w-4 h-4" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
