import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { 
  Crown, 
  Users, 
  TreePine, 
  Zap, 
  Sword, 
  Shield,
  Target,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface GorillaAction {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  effects: {
    foodChain?: number;
    resources?: number;
    humanActivity?: number;
  };
  cooldown: number; // seconds
  cost?: number;
}

const GORILLA_ACTIONS: GorillaAction[] = [
  {
    id: 'deploy_gorilla',
    name: 'Deploy Alpha Gorilla',
    description: 'Send the mighty gorilla to disrupt human settlements and predator territories!',
    icon: Crown,
    effects: {
      foodChain: -30,
      humanActivity: -20
    },
    cooldown: 15
  },
  {
    id: 'human_resistance',
    name: 'Human Resistance',
    description: 'Humans fight back with technology and numbers, increasing development but depleting resources!',
    icon: Sword,
    effects: {
      humanActivity: 25,
      resources: -15
    },
    cooldown: 12
  },
  {
    id: 'natural_balance',
    name: 'Natural Harmony',
    description: 'Allow nature to restore balance, improving ecosystem stability gradually.',
    icon: TreePine,
    effects: {
      foodChain: 15,
      resources: 10
    },
    cooldown: 20
  }
];

export default function GorillaMode() {
  const { selectedCountry } = useCountries();
  const { foodChain, resources, humanActivity, ecoScore } = useEcosystem();
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [actionCooldowns, setActionCooldowns] = useState<Record<string, number>>({});
  const [gameTime, setGameTime] = useState(0);
  const [events, setEvents] = useState<string[]>([]);
  const [gorillaHealth, setGorillaHealth] = useState(100);
  const [humanPopulation, setHumanPopulation] = useState(100);

  // Timer effect
  useEffect(() => {
    if (!gameStarted) return;
    
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
      
      // Reduce cooldowns
      setActionCooldowns(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) {
            updated[key] = Math.max(0, updated[key] - 1);
          }
        });
        return updated;
      });
      
      // Dynamic ecosystem changes
      if (Math.random() < 0.1) { // 10% chance per second
        const randomEvent = getRandomEvent();
        setEvents(prev => [...prev.slice(-4), randomEvent.message]);
        
        // Apply random event effects
        const ecosystem = useEcosystem.getState();
        if (randomEvent.effects.foodChain) {
          ecosystem.setFoodChain(Math.max(0, Math.min(100, 
            ecosystem.foodChain + randomEvent.effects.foodChain
          )));
        }
        if (randomEvent.effects.resources) {
          ecosystem.setResources(Math.max(0, Math.min(100,
            ecosystem.resources + randomEvent.effects.resources
          )));
        }
        if (randomEvent.effects.humanActivity) {
          ecosystem.setHumanActivity(Math.max(0, Math.min(100,
            ecosystem.humanActivity + randomEvent.effects.humanActivity
          )));
        }
      }
      
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted]);

  const getRandomEvent = () => {
    const events = [
      {
        message: "🌪️ Tornado disrupts both humans and wildlife!",
        effects: { foodChain: -5, humanActivity: -10 }
      },
      {
        message: "🌱 Forest regrowth helps ecosystem recover!",
        effects: { foodChain: 8, resources: 12 }
      },
      {
        message: "🏭 Industrial expansion threatens nature!",
        effects: { humanActivity: 15, resources: -8 }
      },
      {
        message: "🦅 Predator population surge affects balance!",
        effects: { foodChain: 20, resources: -5 }
      },
      {
        message: "🌍 Climate change affects all systems!",
        effects: { foodChain: -10, resources: -10, humanActivity: -5 }
      }
    ];
    
    return events[Math.floor(Math.random() * events.length)];
  };

  const handleAction = async (action: GorillaAction) => {
    if (actionCooldowns[action.id] > 0) return;
    
    // Set cooldown
    setActionCooldowns(prev => ({
      ...prev,
      [action.id]: action.cooldown
    }));
    
    // Apply effects
    const ecosystem = useEcosystem.getState();
    if (action.effects.foodChain) {
      ecosystem.setFoodChain(Math.max(0, Math.min(100, 
        ecosystem.foodChain + action.effects.foodChain
      )));
    }
    if (action.effects.resources) {
      ecosystem.setResources(Math.max(0, Math.min(100,
        ecosystem.resources + action.effects.resources
      )));
    }
    if (action.effects.humanActivity) {
      ecosystem.setHumanActivity(Math.max(0, Math.min(100,
        ecosystem.humanActivity + action.effects.humanActivity
      )));
    }
    
    // Update populations based on action
    if (action.id === 'deploy_gorilla') {
      setHumanPopulation(prev => Math.max(10, prev - 15));
      setGorillaHealth(prev => Math.max(20, prev - 5));
    } else if (action.id === 'human_resistance') {
      setHumanPopulation(prev => Math.min(100, prev + 10));
      setGorillaHealth(prev => Math.max(0, prev - 10));
    } else if (action.id === 'natural_balance') {
      setGorillaHealth(prev => Math.min(100, prev + 8));
    }
    
    // Add event
    setEvents(prev => [...prev.slice(-4), `⚡ ${action.name} activated!`]);
    
    // Update score
    setScore(prev => prev + (action.effects.foodChain || 0) + (action.effects.resources || 0));
    
    // Try to send to server
    try {
      await fetch('/api/game/gorilla-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'gorilla_session_' + Date.now(),
          action: action.id
        })
      });
    } catch (error) {
      console.log('Server not available, continuing offline');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameTime(0);
    setScore(0);
    setGorillaHealth(100);
    setHumanPopulation(100);
    setEvents(['🦍 The mighty gorilla enters the ecosystem!']);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWinner = () => {
    if (gorillaHealth <= 0) return "Humans Win!";
    if (humanPopulation <= 20) return "Gorilla Wins!";
    if (ecoScore > 90) return "Nature Wins!";
    return null;
  };

  const winner = getWinner();

  if (!selectedCountry) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Game Header */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <Card className="bg-black/90 text-white border-red-600 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-center flex items-center justify-center gap-2 text-xl">
              <Crown className="w-6 h-6 text-yellow-400" />
              100 Men vs 1 Gorilla Mode
              <Crown className="w-6 h-6 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!gameStarted ? (
              <div className="text-center space-y-3">
                <p className="text-gray-300">
                  Can one mighty gorilla restore natural balance against 100 humans?
                </p>
                <Button 
                  onClick={startGame}
                  className="bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  START BATTLE
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="text-center">
                  <div className="text-yellow-400 font-bold">{formatTime(gameTime)}</div>
                  <div className="text-xs text-gray-400">Time</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold">{score}</div>
                  <div className="text-xs text-gray-400">Eco Points</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-bold">{gorillaHealth}%</div>
                  <div className="text-xs text-gray-400">Gorilla</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-bold">{humanPopulation}</div>
                  <div className="text-xs text-gray-400">Humans</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Battle Status */}
      {gameStarted && (
        <div className="absolute top-4 right-4 pointer-events-auto">
          <Card className="bg-black/90 text-white border-gray-600 backdrop-blur-sm w-64">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-red-400" />
                Battle Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Health Bars */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>🦍 Gorilla Health</span>
                  <span>{gorillaHealth}%</span>
                </div>
                <Progress value={gorillaHealth} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>👥 Human Population</span>
                  <span>{humanPopulation}</span>
                </div>
                <Progress value={humanPopulation} className="h-2" />
              </div>
              
              {/* Winner Display */}
              {winner && (
                <div className="text-center p-3 bg-yellow-900/50 border border-yellow-500 rounded">
                  <div className="font-bold text-yellow-400">{winner}</div>
                  <div className="text-xs text-yellow-200">Final Score: {score}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Panel */}
      {gameStarted && !winner && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <Card className="bg-black/90 text-white border-red-600 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {GORILLA_ACTIONS.map((action) => {
                  const IconComponent = action.icon;
                  const cooldownRemaining = actionCooldowns[action.id] || 0;
                  const isOnCooldown = cooldownRemaining > 0;
                  
                  return (
                    <Button
                      key={action.id}
                      onClick={() => handleAction(action)}
                      disabled={isOnCooldown}
                      className={`h-auto p-3 ${
                        isOnCooldown 
                          ? 'bg-gray-700 cursor-not-allowed' 
                          : 'bg-red-700 hover:bg-red-600'
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <IconComponent className="w-6 h-6 mx-auto" />
                        <div className="font-medium text-xs">{action.name}</div>
                        {isOnCooldown ? (
                          <div className="text-xs text-red-300">
                            Cooldown: {cooldownRemaining}s
                          </div>
                        ) : (
                          <div className="text-xs text-gray-300">
                            {Object.entries(action.effects).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-center gap-1">
                                {value > 0 ? (
                                  <TrendingUp className="w-3 h-3 text-green-400" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 text-red-400" />
                                )}
                                <span>{value > 0 ? '+' : ''}{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Events Log */}
      {gameStarted && (
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <Card className="bg-black/90 text-white border-gray-600 backdrop-blur-sm w-64">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Battle Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {events.slice(-5).map((event, index) => (
                <div key={index} className="text-xs text-gray-300 py-1">
                  {event}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}