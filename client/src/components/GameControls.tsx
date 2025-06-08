import { RotateCcw, Lightbulb } from "lucide-react";

interface GameControlsProps {
  onRestart: () => void;
  onHint: () => void;
}

export default function GameControls({ onRestart, onHint }: GameControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button 
        className="bg-sunny hover:bg-sunny text-dark-gray font-fredoka text-lg py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform active:scale-95 touch-feedback" 
        onClick={onRestart}
      >
        <RotateCcw className="w-5 h-5 mr-2 inline" />
        Restart
      </button>
      <button 
        className="bg-mint hover:bg-mint text-white font-fredoka text-lg py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform active:scale-95 touch-feedback" 
        onClick={onHint}
      >
        <Lightbulb className="w-5 h-5 mr-2 inline" />
        Hint
      </button>
    </div>
  );
}
