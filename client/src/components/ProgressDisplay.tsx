interface ProgressDisplayProps {
  score: number;
  progress: number;
}

export default function ProgressDisplay({ score, progress }: ProgressDisplayProps) {
  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-sunny flex items-center justify-center text-2xl">
            🐰
          </div>
          <div>
            <p className="font-fredoka text-dark-gray text-lg">Great job!</p>
            <p className="text-sm text-gray-600">Keep going to the exit!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-fredoka text-coral">{score}</div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-coral to-sunny h-3 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
