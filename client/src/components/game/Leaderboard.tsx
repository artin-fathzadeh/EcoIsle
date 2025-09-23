import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCardGame } from "@/lib/stores/useCardGame";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { 
  Trophy, 
  Medal, 
  Crown, 
  X, 
  Users, 
  Globe,
  Star,
  Upload,
  Loader2
} from "lucide-react";

interface LeaderboardEntry {
  country: string;
  ecoScore: number;
  player: string;
  mode?: string;
  timestamp?: string;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const { gameMode } = useCardGame();
  const { ecoScore } = useEcosystem();
  const { selectedCountry } = useCountries();
  
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'classroom'>('global');
  const [classroomCode, setClassroomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch leaderboard data
  useEffect(() => {
    if (!isOpen) return;
    
    fetchLeaderboard();
  }, [isOpen, leaderboardType, classroomCode]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        type: leaderboardType,
        ...(leaderboardType === 'classroom' && classroomCode && { classroom: classroomCode })
      });
      
      const response = await fetch(`/api/leaderboard?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      } else {
        // Fallback to mock data if server is not available
        setLeaderboardData([
          { country: "Norway", ecoScore: 95, player: "EcoMaster", mode: "education" },
          { country: "Brazil", ecoScore: 88, player: "RainforestGuardian", mode: "cards" },
          { country: "Kenya", ecoScore: 85, player: "WildlifeProtector", mode: "endless" },
          { country: "USA", ecoScore: 78, player: "GreenAmerica", mode: "gorilla" },
          { country: "Japan", ecoScore: 75, player: "BalanceSeeker", mode: "education" }
        ]);
      }
    } catch (error) {
      console.log('Server not available, using mock data');
      setLeaderboardData([
        { country: "Norway", ecoScore: 95, player: "EcoMaster", mode: "education" },
        { country: "Brazil", ecoScore: 88, player: "RainforestGuardian", mode: "cards" },
        { country: "Kenya", ecoScore: 85, player: "WildlifeProtector", mode: "endless" },
        { country: "USA", ecoScore: 78, player: "GreenAmerica", mode: "gorilla" },
        { country: "Japan", ecoScore: 75, player: "BalanceSeeker", mode: "education" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const submitScore = async () => {
    if (!playerName || !selectedCountry) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry,
          ecoScore: Math.round(ecoScore),
          player: playerName,
          mode: gameMode,
          ...(leaderboardType === 'classroom' && classroomCode && { classroom: classroomCode })
        })
      });
      
      if (response.ok) {
        // Refresh leaderboard
        await fetchLeaderboard();
        // Clear form
        setPlayerName('');
      }
    } catch (error) {
      console.log('Score submission failed, server not available');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1: return <Medal className="w-5 h-5 text-gray-400" />;
      case 2: return <Trophy className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const getModeColor = (mode?: string) => {
    switch (mode) {
      case 'education': return 'text-blue-400';
      case 'cards': return 'text-purple-400';
      case 'endless': return 'text-red-400';
      case 'gorilla': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 text-white border-gray-600 w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="sticky top-0 bg-gray-900 border-b border-gray-600">
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Global Leaderboard
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Leaderboard Type Selector */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={leaderboardType === 'global' ? 'default' : 'outline'}
              onClick={() => setLeaderboardType('global')}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Global
            </Button>
            <Button
              size="sm"
              variant={leaderboardType === 'classroom' ? 'default' : 'outline'}
              onClick={() => setLeaderboardType('classroom')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Classroom
            </Button>
          </div>

          {/* Classroom Code Input */}
          {leaderboardType === 'classroom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Classroom Code</label>
              <Input
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                placeholder="Enter classroom code..."
                className="bg-gray-800 border-gray-600"
              />
            </div>
          )}

          {/* Submit Score Section */}
          {selectedCountry && (
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Upload className="w-4 h-4 text-blue-400" />
                <span className="font-medium text-blue-200">Submit Your Score</span>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-blue-100">
                  <div>Country: <span className="font-medium">{selectedCountry}</span></div>
                  <div>Current Score: <span className={`font-bold ${getScoreColor(ecoScore)}`}>{Math.round(ecoScore)}</span></div>
                  <div>Mode: <span className={`font-medium ${getModeColor(gameMode)}`}>{gameMode}</span></div>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    className="bg-gray-800 border-gray-600 flex-1"
                  />
                  <Button
                    onClick={submitScore}
                    disabled={!playerName || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {leaderboardType === 'global' ? 'Global Rankings' : `Classroom: ${classroomCode || 'All'}`}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={fetchLeaderboard}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Refresh'
                )}
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading leaderboard...
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No scores submitted yet. Be the first!
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboardData.map((entry, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getRankIcon(index)}
                          </div>
                          <div>
                            <div className="font-medium">{entry.player}</div>
                            <div className="text-sm text-gray-400 flex items-center gap-2">
                              <span>{entry.country}</span>
                              {entry.mode && (
                                <>
                                  <span>•</span>
                                  <span className={getModeColor(entry.mode)}>{entry.mode}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(entry.ecoScore)}`}>
                            {entry.ecoScore}
                          </div>
                          <div className="text-xs text-gray-500">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}