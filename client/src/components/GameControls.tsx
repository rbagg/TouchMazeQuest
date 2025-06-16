import { RotateCcw, Lightbulb } from "lucide-react";

interface GameControlsProps {
  onRestart: () => void;
  onHint: () => void;
}

export default function GameControls({ onRestart, onHint }: GameControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <button
        onClick={onRestart}
        className="bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 text-lg touch-manipulation transition-colors duration-150"
        style={{ minHeight: '60px' }} // Ensure mobile-friendly size
      >
        <RotateCcw size={24} />
        <span>Try Again</span>
      </button>

      <button
        onClick={onHint}
        className="bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 text-lg touch-manipulation transition-colors duration-150"
        style={{ minHeight: '60px' }} // Ensure mobile-friendly size
      >
        <Lightbulb size={24} />
        <span>Hint</span>
      </button>
    </div>
  );
}