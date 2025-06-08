import { Star } from "lucide-react";

interface GameHeaderProps {
  currentLevel: number;
  completedLevels: number[];
}

export default function GameHeader({ currentLevel, completedLevels }: GameHeaderProps) {
  const isLevelCompleted = (level: number) => completedLevels.includes(level);
  
  return (
    <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <div className="text-coral text-2xl">🧩</div>
          <h1 className="font-fredoka text-xl text-dark-gray">Maze Adventure</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Level {currentLevel}</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star}
                className={`w-4 h-4 transition-all duration-300 ${
                  star <= Math.min(3, completedLevels.length)
                    ? 'text-sunny fill-sunny level-star completed' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
