import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { useUI } from "@/lib/stores/useUI";
import { calculateEcoScore } from "@/lib/ecosystemEngine";
import { Leaf, TrendingUp, TrendingDown, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function EducationalEcoScore() {
  const { ecoScore, scoreHistory, foodChain, resources, humanActivity } = useEcosystem();
  const { selectedCountry, currentCountryData } = useCountries();
  const { setScoreBreakdownOpen, setEcoAssistantOffset, setIsAnimating } = useUI();
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!selectedCountry || !currentCountryData) return null;

  // Calculate individual component scores (simplified approximation)
  const foodChainScore = Math.max(0, Math.min(100, 100 - Math.abs(foodChain - 50) * 2));
  const resourceScore = resources > 60 ? 100 : (resources > 40 ? 50 + (resources - 40) * 2.5 : resources * 1.25);
  const humanActivityScore = Math.max(0, 100 - Math.abs(humanActivity - 50) * 1.5);

  // Calculate trend from recent score history
  const recentScores = scoreHistory.slice(-5);
  const trend = recentScores.length >= 2 
    ? recentScores[recentScores.length - 1] - recentScores[recentScores.length - 2]
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    if (score >= 20) return "Poor";
    return "Critical";
  };

  const getExplanation = (score: number) => {
    if (score >= 80) return "Your ecosystem is thriving! All components are well-balanced, supporting biodiversity and sustainability.";
    if (score >= 60) return "Good ecosystem health with room for improvement. Some factors may need attention.";
    if (score >= 40) return "Ecosystem under moderate stress. Adjust your approach to prevent further degradation.";
    if (score >= 20) return "Poor ecosystem health. Immediate action needed to prevent collapse.";
    return "Critical ecosystem failure! Drastic changes required to restore balance.";
  };

  const getComponentExplanation = (component: string, value: number, score: number) => {
    switch (component) {
      case 'foodChain':
        if (score >= 80) return "Perfect balance in the food chain. All species are thriving.";
        if (score >= 60) return "Good balance with minor imbalances that could be addressed.";
        if (score >= 40) return "Some disruption in the food chain affecting ecosystem stability.";
        return "Severe food chain disruption threatening ecosystem collapse.";
      
      case 'resources':
        if (score >= 80) return "Excellent resource management. All needs are met sustainably.";
        if (score >= 60) return "Adequate resources with some areas needing attention.";
        if (score >= 40) return "Resource shortages affecting ecosystem health.";
        return "Critical resource depletion endangering all species.";
      
      case 'humanActivity':
        if (score >= 80) return "Minimal human impact. Activities are sustainable.";
        if (score >= 60) return "Moderate human activity with manageable environmental effects.";
        if (score >= 40) return "Significant human impact requiring intervention.";
        return "Excessive human activity causing severe environmental damage.";
      
      default:
        return "Component analysis unavailable.";
    }
  };

  // Handle Score Breakdown toggle with animation coordination
  useEffect(() => {
    // Update the global state
    setScoreBreakdownOpen(showBreakdown);

    if (showBreakdown) {
      // The Score Breakdown and Eco Assistant are both positioned at top-4 right-4
      // When breakdown is expanded, they visually overlap since they're at the same position
      // Move the Eco Assistant to the left to avoid overlap
      setEcoAssistantOffset(360); // Move 360px to the left (past card width 320px + padding)
    } else {
      // Reset offset when closing
      setEcoAssistantOffset(0);
    }
  }, [showBreakdown, setScoreBreakdownOpen, setEcoAssistantOffset]);  return (
    <div className="absolute top-4 right-4 pointer-events-auto">
      <Card className="bg-black/90 text-white border-gray-600 backdrop-blur-sm w-80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-lg">Ecosystem Health</span>
            </div>
            <div className="flex items-center gap-1">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : trend < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-400" />
              ) : null}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Main Score Display */}
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(ecoScore)}`}>
              {Math.round(ecoScore)}
            </div>
            <div className="text-sm text-gray-300 font-medium">
              {getScoreLabel(ecoScore)}
            </div>
            <Progress 
              value={ecoScore} 
              className="w-full h-3 mt-2"
            />
          </div>

          {/* Educational Explanation */}
          <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-100">
                {getExplanation(ecoScore)}
              </div>
            </div>
          </div>

          {/* Score Breakdown Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full text-xs text-gray-300 hover:text-white"
          >
            <span>Score Breakdown</span>
            {showBreakdown ? (
              <ChevronUp className="w-4 h-4 ml-2" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-2" />
            )}
          </Button>

          {/* Detailed Breakdown - Simplified */}
          {showBreakdown && (
            <div className="space-y-3 border-t border-gray-600 pt-3">
              {/* Food Chain */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Food Chain Balance:</span>
                  <span className={getScoreColor(foodChainScore)}>{Math.round(foodChainScore)}%</span>
                </div>
                <Progress value={foodChainScore} className="h-1" />
                <div className="text-xs text-gray-400">
                  {getComponentExplanation('foodChain', foodChain, foodChainScore)}
                </div>
              </div>

              {/* Resources */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Resource Management:</span>
                  <span className={getScoreColor(resourceScore)}>{Math.round(resourceScore)}%</span>
                </div>
                <Progress value={resourceScore} className="h-1" />
                <div className="text-xs text-gray-400">
                  {getComponentExplanation('resources', resources, resourceScore)}
                </div>
              </div>

              {/* Human Activity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Human Impact:</span>
                  <span className={getScoreColor(humanActivityScore)}>{Math.round(humanActivityScore)}%</span>
                </div>
                <Progress value={humanActivityScore} className="h-1" />
                <div className="text-xs text-gray-400">
                  {getComponentExplanation('humanActivity', humanActivity, humanActivityScore)}
                </div>
              </div>

              {/* Trend Information */}
              <div className="space-y-1 border-t border-gray-600 pt-2">
                <div className="flex justify-between text-xs">
                  <span>Recent Trend:</span>
                  <span className={trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-gray-400"}>
                    {trend > 0 ? "+" : ""}{Math.round(trend)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {trend > 0 ? "Score improving over recent actions" : 
                   trend < 0 ? "Score declining - review recent changes" : 
                   "Score stable - maintain current approach"}
                </div>
              </div>

              {/* Country Context */}
              <div className="space-y-1">
                <div className="text-xs text-gray-300 font-medium">Country Context:</div>
                <div className="text-xs text-gray-400">
                  Managing ecosystem health for {currentCountryData.name}. 
                  Located in {currentCountryData.climate} climate with {currentCountryData.population} population. 
                  Focus on sustainable practices to maintain biodiversity.
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}