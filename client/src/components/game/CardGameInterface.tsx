import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCardGame } from "@/lib/stores/useCardGame";
import { useCountries } from "@/lib/stores/useCountries";
import CardComponent from "./Card";
import Shop from "./Shop";
import { 
  Coins, 
  Target, 
  RotateCcw, 
  Eye, 
  ShoppingCart,
  X,
  Shuffle,
  Crown,
  Flame
} from "lucide-react";

export default function CardGameInterface() {
  const { selectedCountry } = useCountries();
  const {
    gameMode,
    currentLevel,
    hand,
    deck,
    discardPile,
    cardsPlayed,
    cardsToWin,
    isLevelComplete,
    coins,
    inventory,
    prophecyActive,
    prophecyRevealed,
    disasterMultiplier,
    playCard,
    discardCard,
    drawCard,
    closeProphecy,
    nextLevel,
    resetLevel
  } = useCardGame();
  
  const [showShop, setShowShop] = useState(false);
  const [selectedCardForDiscard, setSelectedCardForDiscard] = useState<string | null>(null);

  if (!selectedCountry || gameMode === 'education') return null;

  const handlePlayCard = (cardId: string) => {
    playCard(cardId);
  };

  const handleDiscardCard = (cardId: string) => {
    discardCard(cardId);
    setSelectedCardForDiscard(null);
  };

  const progress = Math.min(100, (cardsPlayed / cardsToWin) * 100);

  return (
    <>
      {/* Card Game UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header with game stats */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <Card className="bg-black/90 text-white border-gray-600 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span>Level {currentLevel}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span>{cardsPlayed}/{gameMode === 'endless' ? '∞' : cardsToWin}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>{coins}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span>Deck: {deck.length}</span>
                  <span>|</span>
                  <span>Discard: {discardPile.length}</span>
                </div>
                
                {gameMode === 'endless' && disasterMultiplier > 1 && (
                  <div className="flex items-center gap-2 text-red-400">
                    <Flame className="w-4 h-4" />
                    <span>{(disasterMultiplier * 100).toFixed(0)}% intensity</span>
                  </div>
                )}
              </div>
              
              {gameMode !== 'endless' && (
                <div className="mt-2">
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Player hand */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="flex gap-2 max-w-screen-lg overflow-x-auto pb-2">
            {hand.map((card) => (
              <CardComponent
                key={card.id}
                card={card}
                onPlay={handlePlayCard}
                onDiscard={selectedCardForDiscard === card.id ? undefined : () => setSelectedCardForDiscard(card.id)}
                size="small"
              />
            ))}
            
            {hand.length === 0 && (
              <Card className="w-32 h-40 bg-gray-800/50 border-gray-600 border-dashed flex items-center justify-center">
                <CardContent className="text-center text-gray-400 text-sm p-4">
                  No cards in hand
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Side panel with controls */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
          <Card className="bg-black/90 text-white border-gray-600 backdrop-blur-sm w-48">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Game Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => drawCard()}
                disabled={deck.length === 0 && discardPile.length === 0}
                className="w-full"
                size="sm"
              >
                Draw Card
              </Button>
              
              <Button
                onClick={() => setShowShop(true)}
                className="w-full"
                size="sm"
                variant="outline"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Shop
              </Button>
              
              <Button
                onClick={resetLevel}
                className="w-full"
                size="sm"
                variant="outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Level
              </Button>
              
              {inventory.length > 0 && (
                <div className="border-t border-gray-600 pt-3">
                  <div className="text-sm font-medium mb-2">Inventory</div>
                  <div className="space-y-1">
                    {inventory.map((potion, index) => (
                      <Button
                        key={`${potion.id}_${index}`}
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs justify-start p-1"
                        onClick={() => useCardGame.getState().usePotion(potion.id)}
                      >
                        {potion.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prophecy Modal */}
      {prophecyActive && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Card className="bg-gray-900 text-white border-purple-500 border-2 max-w-4xl w-full mx-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  Prophecy: Next 5 Cards
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeProphecy}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center overflow-x-auto pb-4">
                {prophecyRevealed.map((card, index) => (
                  <div key={`prophecy_${card.id}_${index}`} className="flex-shrink-0">
                    <CardComponent
                      card={card}
                      showControls={false}
                      size="medium"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Level Complete Modal */}
      {isLevelComplete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Card className="bg-gray-900 text-white border-green-500 border-2 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-center text-green-400">
                <Crown className="w-8 h-8 mx-auto mb-2" />
                Level {currentLevel} Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-gray-300">
                Cards Played: {cardsPlayed}
              </div>
              <div className="text-yellow-400">
                Coins Earned: +{cardsPlayed * 10}
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button onClick={nextLevel} className="bg-green-600 hover:bg-green-700">
                  Next Level
                </Button>
                <Button onClick={resetLevel} variant="outline">
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Discard Confirmation Modal */}
      {selectedCardForDiscard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Card className="bg-gray-900 text-white border-red-500 w-full max-w-sm mx-4">
            <CardHeader>
              <CardTitle className="text-red-400">Discard Card?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Are you sure you want to discard this card?
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleDiscardCard(selectedCardForDiscard)}
                  variant="destructive"
                  className="flex-1"
                >
                  Yes, Discard
                </Button>
                <Button 
                  onClick={() => setSelectedCardForDiscard(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shop Modal */}
      <Shop isOpen={showShop} onClose={() => setShowShop(false)} />
    </>
  );
}