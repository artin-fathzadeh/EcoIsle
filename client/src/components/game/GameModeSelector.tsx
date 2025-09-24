import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCardGame, GameMode } from "@/lib/stores/useCardGame";
import { useCountries } from "@/lib/stores/useCountries";
import { 
  BookOpen, 
  Layers, 
  Infinity, 
  Settings,
  X,
  Gamepad2,
  GraduationCap,
  Zap,
  Crown
} from "lucide-react";

interface GameModeOption {
  mode: GameMode;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
}

const gameModeOptions: GameModeOption[] = [
  {
    mode: 'education',
    name: 'Education Mode',
    description: 'Learn about ecosystems with guided tutorials and explanations',
    icon: GraduationCap,
    features: [
      'Interactive tutorials',
      'Natural selection education',
      'Country-specific insights',
      'Detailed explanations',
      'Eco score breakdown'
    ]
  },
  {
    mode: 'cards',
    name: 'Card Adventure',
    description: 'Progress through levels playing disaster and positive event cards',
    icon: Layers,
    features: [
      'Disaster & positive cards',
      'Level progression system',
      'Shop for potions & boosts',
      'Prophecy cards',
      'Country-specific challenges'
    ]
  },
  {
    mode: 'endless',
    name: 'Endless Challenge',
    description: 'Survive as long as possible with increasing disaster intensity',
    icon: Infinity,
    features: [
      'Infinite gameplay',
      'Escalating difficulty',
      'High score tracking',
      'All cards unlocked',
      'Disaster intensity multipliers'
    ]
  },
  {
    mode: 'gorilla',
    name: '100 Men vs 1 Gorilla',
    description: 'Epic battle mode where one mighty gorilla faces human civilization',
    icon: Crown,
    features: [
      'Real-time battle system',
      'Dynamic population tracking',
      'Special gorilla abilities',
      'Random ecosystem events',
      'Epic victory conditions'
    ]
  }
];

export default function GameModeSelector() {
  const { selectedCountry } = useCountries();
  const { gameMode, initializeCardGame } = useCardGame();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>('education');

  if (!selectedCountry) return null;

  const handleModeSelect = (mode: GameMode) => {
    if (mode !== 'education') {
      initializeCardGame(mode, 1);
    }
    setIsOpen(false);
  };

  const currentModeOption = gameModeOptions.find(option => option.mode === gameMode);

  return (
    <>
      {/* Mode selector button */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Game Mode
        </Button>
      </div>

      {/* Mode selector modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 pointer-events-auto"
          onWheel={(e: React.WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e: React.TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchMove={(e: React.TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEnd={(e: React.TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onScroll={(e: React.UIEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e: React.MouseEvent) => {
            // Only close if clicking the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <Card 
            className="bg-gray-900 text-white border-gray-600 w-full max-w-4xl max-h-[90vh]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <CardHeader className="sticky top-0 bg-gray-900 border-b border-gray-600 z-10">
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-purple-400" />
                  Select Game Mode
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent 
              className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-6"
              onWheel={(e: React.WheelEvent) => {
                // Allow scrolling within the modal content
                const target = e.currentTarget as HTMLElement;
                const { scrollTop, scrollHeight, clientHeight } = target;
                
                // If scrolling up and at top, or scrolling down and at bottom, prevent bubbling
                if ((e.deltaY < 0 && scrollTop === 0) || 
                    (e.deltaY > 0 && scrollTop >= scrollHeight - clientHeight)) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {/* Add margin below header to prevent overlap */}
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                {gameModeOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = selectedMode === option.mode;
                  const isCurrent = gameMode === option.mode;
                  return (
                    <Card
                      key={option.mode}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-900/20' 
                          : 'border-gray-600 hover:border-gray-500'
                      } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
                      onClick={() => setSelectedMode(option.mode)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <IconComponent className="w-5 h-5 text-purple-400" />
                          {option.name}
                          {isCurrent && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-300 text-sm">
                          {option.description}
                        </p>
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-400">Features:</div>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {option.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {/* Current country info */}
              <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-blue-200">Playing as: {selectedCountry}</span>
                </div>
                <p className="text-blue-100 text-sm">
                  Each game mode will use {selectedCountry}'s unique environmental challenges and characteristics.
                  {selectedMode === 'cards' && ' Disaster cards will have location-specific effects!'}
                  {selectedMode === 'endless' && ' Perfect for testing your skills against ' + selectedCountry + "'s toughest scenarios!"}
                  {selectedMode === 'education' && ' Learn about ' + selectedCountry + "'s specific ecological factors."}
                  {selectedMode === 'gorilla' && ' Can one mighty gorilla restore balance in ' + selectedCountry + '?'}
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={() => handleModeSelect(selectedMode)}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={gameMode === selectedMode}
                >
                  {gameMode === selectedMode ? 'Current Mode' : 'Switch Mode'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}