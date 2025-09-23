import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { calculateEcoScore } from "@/lib/ecosystemEngine";
import { Leaf, TrendingUp, TrendingDown, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function EducationalEcoScore() {
  const { ecoScore, scoreHistory, foodChain, resources, humanActivity } = useEcosystem();
  const { selectedCountry } = useCountries();
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!selectedCountry) return null;

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
        if (value < 30) return "Too few predators - prey species may overpopulate and overgraze.";
        if (value > 70) return "Too many predators - prey species at risk of extinction.";
        return "Good predator-prey balance supporting natural selection.";
      
      case 'resources':
        if (value < 40) return "Resource depletion threatens ecosystem sustainability.";
        if (value > 80) return "Excellent conservation supporting long-term health.";
        return "Moderate resource management - balance extraction with conservation.";
      
      case 'humanActivity':
        if (value < 20) return "Very low development - preserves nature but limits economic growth.";
        if (value > 80) return "High urbanization stressing natural habitats.";
        return "Balanced development with environmental consideration.";
      
      default:
        return "";
    }
  };

  return (
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

          {/* Detailed Breakdown */}
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

              {/* Country Context */}
              <div className="bg-green-900/20 p-2 rounded text-xs border border-green-500/30">
                <div className="font-medium text-green-300 mb-1">{selectedCountry} Context:</div>
                <div className="text-green-100">
                  {selectedCountry === "USA" && "Industrial nation balancing economic growth with environmental protection."}
                  {selectedCountry === "Brazil" && "Biodiversity hotspot managing development pressures and conservation needs."}
                  {selectedCountry === "Norway" && "Arctic nation leveraging renewable resources while protecting marine ecosystems."}
                  {selectedCountry === "Japan" && "Island nation addressing urban density and marine resource management."}
                  {selectedCountry === "Kenya" && "Developing country balancing wildlife conservation with human needs."}
                </div>
              </div>

              {/* Trend Information */}
              {trend !== 0 && (
                <div className="flex justify-between text-xs border-t border-gray-600 pt-2">
                  <span>Recent Trend:</span>
                  <span className={trend > 0 ? "text-green-400" : "text-red-400"}>
                    {trend > 0 ? "Improving +" : "Declining "}{Math.abs(trend).toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}