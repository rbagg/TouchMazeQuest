import { ArrowRight, RotateCcw } from "lucide-react";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNextLevel: () => void;
  onPlayAgain: () => void;
  currentLevel: number;
  hasNextLevel: boolean;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  onNextLevel, 
  onPlayAgain, 
  currentLevel,
  hasNextLevel 
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Create celebration particles
      const particles = ['🌟', '🎉', '🎊', '✨'];
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
          particle.style.position = 'fixed';
          particle.style.left = Math.random() * window.innerWidth + 'px';
          particle.style.top = '20px';
          particle.style.fontSize = '20px';
          particle.style.pointerEvents = 'none';
          particle.style.zIndex = '9999';
          particle.classList.add('celebration-particle');
          document.body.appendChild(particle);
          
          setTimeout(() => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          }, 2000);
        }, i * 100);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center bounce-in">
        <div className="mb-4">
          <div className="w-24 h-24 mx-auto rounded-2xl mb-4 bg-gradient-to-br from-coral to-sunny flex items-center justify-center text-4xl">
            🎉
          </div>
          <h2 className="font-fredoka text-2xl text-dark-gray mb-2">Awesome!</h2>
          <p className="text-gray-600 mb-4">You completed level {currentLevel}!</p>
          <div className="flex justify-center space-x-1 mb-4">
            {[1, 2, 3].map((star, index) => (
              <div 
                key={star}
                className="text-sunny text-2xl celebration-particle"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                ⭐
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {hasNextLevel && (
            <button 
              className="w-full bg-coral hover:bg-coral text-white font-fredoka text-lg py-3 rounded-2xl transition-all duration-200 transform active:scale-95 touch-feedback" 
              onClick={() => {
                onNextLevel();
                onClose();
              }}
            >
              <ArrowRight className="w-5 h-5 mr-2 inline" />
              Next Level
            </button>
          )}
          <button 
            className="w-full bg-gray-200 hover:bg-gray-300 text-dark-gray font-fredoka text-lg py-3 rounded-2xl transition-all duration-200 transform active:scale-95 touch-feedback" 
            onClick={() => {
              onPlayAgain();
              onClose();
            }}
          >
            <RotateCcw className="w-5 h-5 mr-2 inline" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
