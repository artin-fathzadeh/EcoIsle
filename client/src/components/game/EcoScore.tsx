import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { useUI } from "@/lib/stores/useUI";
import { Leaf, TrendingUp, TrendingDown } from "lucide-react";
import { Draggable, DragHandle } from "@/components/ui/draggable";
import React from "react";

export default function EcoScore() {
  const { ecoScore, scoreHistory } = useEcosystem();
  const { selectedCountry } = useCountries();
  const { ecoAssistantOffset } = useUI();
  const [manuallyPlaced, setManuallyPlaced] = React.useState(false);

  React.useEffect(() => {
    try {
      const v = localStorage.getItem('draggable-eco-score-manuallyPlaced');
      setManuallyPlaced(v === 'true');
    } catch {}
  }, []);

  if (!selectedCountry) return null;

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

  return (
    <Draggable
      defaultPosition={{ x: 0, y: 0 }}
      persistPosition="eco-score"
      dragHandleClassName="drag-handle"
      className="top-4 right-4 pointer-events-auto"
      externalOffset={!manuallyPlaced ? { x: -(ecoAssistantOffset || 0) } : undefined}
    >
  <Card className="bg-black/70 text-white border-gray-600 backdrop-blur-sm rounded-2xl w-64">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Eco Score</span>
            </div>
            <div className="flex items-center gap-1">
              <DragHandle className="drag-handle" />
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : trend < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-400" />
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(ecoScore)}`}>
                {Math.round(ecoScore)}
              </div>
              <div className="text-sm text-gray-400">
                {getScoreLabel(ecoScore)}
              </div>
            </div>

            <Progress 
              value={ecoScore} 
              className="w-full h-2"
            />

            <div className="text-xs text-gray-400">
              <div className="font-medium text-white mb-1">{selectedCountry}</div>
              <div>Balance all environmental factors to achieve a high eco score</div>
            </div>

            {/* Score breakdown */}
            <div className="text-xs space-y-1 border-t border-gray-600 pt-2">
              <div className="flex justify-between">
                <span>Ecosystem Health:</span>
                <span className={getScoreColor(ecoScore)}>{Math.round(ecoScore)}%</span>
              </div>
              {trend !== 0 && (
                <div className="flex justify-between">
                  <span>Trend:</span>
                  <span className={trend > 0 ? "text-green-400" : "text-red-400"}>
                    {trend > 0 ? "+" : ""}{trend.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Draggable>
  );
}
