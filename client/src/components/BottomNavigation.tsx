import { Home, Settings, Info } from "lucide-react";

export default function BottomNavigation() {
  const handleNavClick = (action: string) => {
    console.log(`Navigation: ${action}`);
    // Future implementation for different views
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <button 
            className="flex flex-col items-center py-2 text-coral transition-colors duration-200 touch-feedback"
            onClick={() => handleNavClick('home')}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-opensans">Home</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 touch-feedback"
            onClick={() => handleNavClick('settings')}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-xs font-opensans">Settings</span>
          </button>
          <button 
            className="flex flex-col items-center py-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 touch-feedback"
            onClick={() => handleNavClick('info')}
          >
            <Info className="w-5 h-5 mb-1" />
            <span className="text-xs font-opensans">Info</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
