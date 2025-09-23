import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCardGame, AVAILABLE_POTIONS } from "@/lib/stores/useCardGame";
import { 
  Coins, 
  ShoppingCart, 
  X, 
  Star, 
  Zap,
  TreePine,
  Droplets,
  Building
} from "lucide-react";

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Shop({ isOpen, onClose }: ShopProps) {
  const { coins, inventory, buyPotion } = useCardGame();

  if (!isOpen) return null;

  const getPotionIcon = (effectType: string) => {
    switch (effectType) {
      case 'discard_2': return X;
      case 'boost_food_chain': return TreePine;
      case 'boost_resources': return Droplets;
      case 'boost_human_activity': return Building;
      default: return Star;
    }
  };

  const getPotionColor = (effectType: string) => {
    switch (effectType) {
      case 'discard_2': return 'from-red-900 to-red-700 border-red-500';
      case 'boost_food_chain': return 'from-green-900 to-green-700 border-green-500';
      case 'boost_resources': return 'from-blue-900 to-blue-700 border-blue-500';
      case 'boost_human_activity': return 'from-purple-900 to-purple-700 border-purple-500';
      default: return 'from-gray-900 to-gray-700 border-gray-500';
    }
  };

  const handleBuyPotion = (potionId: string) => {
    buyPotion(potionId);
  };

  const canAfford = (cost: number) => coins >= cost;
  const ownedCount = (potionId: string) => inventory.filter(p => p.id === potionId).length;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 text-white border-gray-600 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="sticky top-0 bg-gray-900 border-b border-gray-600">
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-yellow-400" />
              Ecosystem Shop
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-900/30 px-3 py-1 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-bold">{coins}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Shop description */}
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium text-blue-200">Ecological Enhancement Shop</span>
              </div>
              <p className="text-blue-100 text-sm">
                Purchase potions and boosts to help manage your ecosystem. Earn coins by playing cards successfully!
              </p>
            </div>

            {/* Potions grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {AVAILABLE_POTIONS.map((potion) => {
                const IconComponent = getPotionIcon(potion.effect);
                const owned = ownedCount(potion.id);
                const affordable = canAfford(potion.cost);
                
                return (
                  <Card
                    key={potion.id}
                    className={`bg-gradient-to-b ${getPotionColor(potion.effect)} border-2 relative overflow-hidden transition-transform hover:scale-105`}
                  >
                    {/* Owned indicator */}
                    {owned > 0 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {owned}
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <IconComponent className="w-5 h-5" />
                        <span className="truncate">{potion.name}</span>
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {/* Description */}
                      <p className="text-xs text-gray-200">
                        {potion.description}
                      </p>
                      
                      {/* Effect details */}
                      <div className="text-xs space-y-1">
                        {potion.effect === 'discard_2' && (
                          <div className="text-red-300">
                            <Zap className="w-3 h-3 inline mr-1" />
                            Remove unwanted cards
                          </div>
                        )}
                        {potion.effect.startsWith('boost_') && potion.value && (
                          <div className="text-green-300">
                            <Zap className="w-3 h-3 inline mr-1" />
                            {potion.value > 0 ? '+' : ''}{potion.value} points
                          </div>
                        )}
                      </div>
                      
                      {/* Price and buy button */}
                      <div className="space-y-2 pt-2 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <Coins className="w-3 h-3 text-yellow-400" />
                            <span className="font-bold text-yellow-400">{potion.cost}</span>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleBuyPotion(potion.id)}
                          disabled={!affordable}
                          className={`w-full text-xs ${
                            affordable 
                              ? 'bg-white/20 hover:bg-white/30 border-white/30' 
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {affordable ? 'Buy Potion' : 'Not Enough Coins'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Current inventory */}
            {inventory.length > 0 && (
              <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-green-200">Your Inventory ({inventory.length} items)</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {inventory.map((potion, index) => (
                    <div
                      key={`inventory_${potion.id}_${index}`}
                      className="bg-green-800/50 px-3 py-1 rounded-full text-sm text-green-200 border border-green-500/30"
                    >
                      {potion.name}
                    </div>
                  ))}
                </div>
                
                <p className="text-green-100 text-xs mt-2">
                  Use potions from the game controls panel during gameplay.
                </p>
              </div>
            )}

            {/* Tips */}
            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="font-medium text-purple-200">Shopping Tips</span>
              </div>
              <ul className="text-purple-100 text-sm space-y-1">
                <li>• Earn coins by playing cards - rarer cards give more coins</li>
                <li>• Discard potions help when you have too many disaster cards</li>
                <li>• Boost potions can help recover from severe disasters</li>
                <li>• Stock up between levels for tougher challenges ahead</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}