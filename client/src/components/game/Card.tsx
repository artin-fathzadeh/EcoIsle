import React from 'react';
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Card as GameCard, DisasterCard, PositiveCard } from "@/lib/cards";
import { 
  CloudRain, 
  Sun, 
  Flame, 
  Wind, 
  Eye, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Star
} from "lucide-react";

interface CardComponentProps {
  card: GameCard;
  onPlay?: (cardId: string) => void;
  onDiscard?: (cardId: string) => void;
  isPlayable?: boolean;
  showControls?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onPlay,
  onDiscard,
  isPlayable = true,
  showControls = true,
  size = 'medium'
}) => {
  
  const getCardIcon = (card: GameCard) => {
    if (card.type === 'disaster') {
      const disasterCard = card as DisasterCard;
      switch (disasterCard.disasterType) {
        case 'flood': return CloudRain;
        case 'drought': return Sun;
        case 'fire': return Flame;
        case 'tornado': return Wind;
        default: return AlertTriangle;
      }
    } else if (card.type === 'positive') {
      const positiveCard = card as PositiveCard;
      switch (positiveCard.positiveType) {
        case 'prophecy': return Eye;
        case 'rainyDay': return Sparkles;
        default: return Star;
      }
    }
    return Star;
  };

  const getCardColor = (card: GameCard) => {
    switch (card.type) {
      case 'disaster':
        return 'from-red-900 to-red-700 border-red-500';
      case 'positive':
        return 'from-green-900 to-green-700 border-green-500';
      default:
        return 'from-gray-900 to-gray-700 border-gray-500';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-blue-400';
      case 'rare': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-32 h-40';
      case 'medium': return 'w-40 h-48';
      case 'large': return 'w-48 h-56';
      default: return 'w-40 h-48';
    }
  };

  const getEffectDisplay = (card: GameCard) => {
    const effects = [];
    
    if (card.type === 'disaster') {
      const disasterCard = card as DisasterCard;
      if (disasterCard.effects.foodChain !== 0) {
        effects.push({
          label: 'Food Chain',
          value: disasterCard.effects.foodChain,
          icon: disasterCard.effects.foodChain > 0 ? TrendingUp : TrendingDown
        });
      }
      if (disasterCard.effects.resources !== 0) {
        effects.push({
          label: 'Resources',
          value: disasterCard.effects.resources,
          icon: disasterCard.effects.resources > 0 ? TrendingUp : TrendingDown
        });
      }
      if (disasterCard.effects.humanActivity !== 0) {
        effects.push({
          label: 'Human Activity',
          value: disasterCard.effects.humanActivity,
          icon: disasterCard.effects.humanActivity > 0 ? TrendingUp : TrendingDown
        });
      }
    } else if (card.type === 'positive') {
      const positiveCard = card as PositiveCard;
      if (positiveCard.effects.foodChain) {
        effects.push({
          label: 'Food Chain',
          value: positiveCard.effects.foodChain,
          icon: TrendingUp
        });
      }
      if (positiveCard.effects.resources) {
        effects.push({
          label: 'Resources', 
          value: positiveCard.effects.resources,
          icon: TrendingUp
        });
      }
      if (positiveCard.effects.humanActivity) {
        effects.push({
          label: 'Human Activity',
          value: positiveCard.effects.humanActivity,
          icon: positiveCard.effects.humanActivity > 0 ? TrendingUp : TrendingDown
        });
      }
    }
    
    return effects;
  };

  const IconComponent = getCardIcon(card);
  const effects = getEffectDisplay(card);

  return (
    <div className={`${getSizeClasses()} transition-all duration-200 hover:scale-105 ${!isPlayable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <UICard className={`h-full bg-gradient-to-b ${getCardColor(card)} text-white border-2 relative overflow-hidden`}>
        {/* Rarity indicator */}
        <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${getRarityColor(card.rarity)} bg-current opacity-80`} />
        
        {/* Level indicator */}
        <div className="absolute top-1 left-1 bg-black/40 px-2 py-1 rounded text-xs font-bold">
          L{card.level}
        </div>
        
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-sm flex items-center gap-2">
            <IconComponent className="w-4 h-4" />
            <span className="truncate">{card.name}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col justify-between h-full pb-2">
          {/* Description */}
          <div className="text-xs text-gray-200 mb-3 flex-grow">
            {card.description}
          </div>
          
          {/* Effects */}
          <div className="space-y-1 mb-3">
            {effects.map((effect, index) => {
              const EffectIcon = effect.icon;
              return (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="truncate">{effect.label}:</span>
                  <div className="flex items-center gap-1">
                    <EffectIcon className="w-3 h-3" />
                    <span className={effect.value > 0 ? 'text-green-300' : 'text-red-300'}>
                      {effect.value > 0 ? '+' : ''}{effect.value}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Special effects */}
            {card.type === 'positive' && (card as PositiveCard).special && (
              <div className="text-xs text-yellow-300">
                <Star className="w-3 h-3 inline mr-1" />
                Special Effect
              </div>
            )}
          </div>
          
          {/* Controls */}
          {showControls && (
            <div className="space-y-1">
              <Button
                size="sm"
                onClick={() => onPlay?.(card.id)}
                disabled={!isPlayable}
                className="w-full text-xs py-1 bg-white/20 hover:bg-white/30 border-white/30"
              >
                Play Card
              </Button>
              
              {onDiscard && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDiscard(card.id)}
                  className="w-full text-xs py-1 bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  Discard
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </UICard>
    </div>
  );
};

export default CardComponent;