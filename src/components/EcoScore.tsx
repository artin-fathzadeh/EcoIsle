import { Activity, TrendingUp, Leaf, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface EcoScoreProps {
  score: number;
  breakdown?: {
    balance: number;
    sustainability: number;
    environment: number;
  };
}

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-eco-excellent';
  if (score >= 70) return 'text-eco-good';
  if (score >= 50) return 'text-eco-warning';
  return 'text-eco-critical';
};

const getScoreStatus = (score: number) => {
  if (score >= 90) return 'Optimal';
  if (score >= 80) return 'Healthy';
  if (score >= 60) return 'Stable';
  if (score >= 40) return 'At Risk';
  return 'Critical';
};

export const EcoScore = ({ score, breakdown }: EcoScoreProps) => {
  return (
    <div className="glass rounded-lg p-6 transition-glass">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Ecosystem Health</h3>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-2">
          <div className={cn("text-4xl font-bold", getScoreColor(score))}>
            {score}
          </div>
          <div className="text-sm text-muted-foreground">
            {getScoreStatus(score)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500 ease-out rounded-full",
              score >= 85 ? "bg-eco-excellent" :
              score >= 70 ? "bg-eco-good" :
              score >= 50 ? "bg-eco-warning" : "bg-eco-critical"
            )}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Score Breakdown */}
        {breakdown && (
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/20">
            <div className="text-center space-y-1">
              <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto" />
              <div className="text-xs text-muted-foreground">Balance</div>
              <div className={cn("text-sm font-medium", getScoreColor(breakdown.balance))}>
                {breakdown.balance}
              </div>
            </div>
            <div className="text-center space-y-1">
              <Leaf className="w-4 h-4 text-muted-foreground mx-auto" />
              <div className="text-xs text-muted-foreground">Resources</div>
              <div className={cn("text-sm font-medium", getScoreColor(breakdown.sustainability))}>
                {breakdown.sustainability}
              </div>
            </div>
            <div className="text-center space-y-1">
              <Zap className="w-4 h-4 text-muted-foreground mx-auto" />
              <div className="text-xs text-muted-foreground">Environment</div>
              <div className={cn("text-sm font-medium", getScoreColor(breakdown.environment))}>
                {breakdown.environment}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};