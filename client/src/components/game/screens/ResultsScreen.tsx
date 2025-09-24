import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGameFlow } from "@/lib/stores/useGameFlow";
import { useCountries } from "@/lib/stores/useCountries";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Trophy, RotateCcw, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { aiService, type AIRecommendationResponse } from "@/lib/ai-service";

export default function ResultsScreen() {
  const { selectedCountry } = useCountries();
  const { 
    simulationData, 
    showAIAnalysis, 
    showAIResults, 
    resetGameFlow 
  } = useGameFlow();
  
  const [aiAnalysis, setAiAnalysis] = useState<AIRecommendationResponse | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  if (!simulationData || !selectedCountry) return null;

  const { initialState, finalState, simulationHistory } = simulationData;

  // Calculate changes
  const changes = {
    foodChain: finalState.foodChain - initialState.foodChain,
    resources: finalState.resources - initialState.resources,
    humanActivity: finalState.humanActivity - initialState.humanActivity,
    ecoScore: finalState.ecoScore - initialState.ecoScore
  };

  // Get performance rating
  const getPerformanceRating = (score: number) => {
    if (score >= 90) return { label: "Exceptional", color: "text-green-400", icon: Trophy };
    if (score >= 80) return { label: "Excellent", color: "text-green-400", icon: Trophy };
    if (score >= 70) return { label: "Good", color: "text-blue-400", icon: TrendingUp };
    if (score >= 60) return { label: "Fair", color: "text-yellow-400", icon: Minus };
    if (score >= 40) return { label: "Poor", color: "text-orange-400", icon: TrendingDown };
    return { label: "Critical", color: "text-red-400", icon: TrendingDown };
  };

  const performance = getPerformanceRating(finalState.ecoScore);

  // Prepare chart data
  const chartData = simulationHistory.map((frame, index) => ({
    time: `${Math.round(frame.time)}s`,
    ecoScore: Math.round(frame.ecoScore),
    foodChain: Math.round(frame.foodChain),
    resources: Math.round(frame.resources),
    humanActivity: Math.round(frame.humanActivity)
  }));

  // Get AI analysis
  const getAIAnalysis = async () => {
    if (aiAnalysis) return; // Already loaded
    
    setIsLoadingAI(true);
    try {
      const response = await aiService.getRecommendation({
        ecosystemState: {
          foodChain: finalState.foodChain,
          resources: finalState.resources,
          humanActivity: finalState.humanActivity,
          ecoScore: finalState.ecoScore,
          scoreHistory: simulationHistory.map(f => f.ecoScore)
        },
        country: selectedCountry,
        userMessage: `Analyze the ecosystem simulation results. Initial score: ${initialState.ecoScore}, Final score: ${finalState.ecoScore}. Provide detailed analysis of the changes and future recommendations.`,
        allowTools: false
      });
      setAiAnalysis(response);
    } catch (error) {
      console.error('Failed to get AI analysis:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  useEffect(() => {
    if (showAIAnalysis) {
      getAIAnalysis();
    }
  }, [showAIAnalysis]);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm overflow-y-auto"
    >
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <performance.icon className={`w-8 h-8 ${performance.color}`} />
              <h1 className="text-3xl font-bold text-white">
                Simulation Complete
              </h1>
            </div>
            <p className="text-gray-300">
              {selectedCountry} ecosystem evolution analysis
            </p>
          </motion.div>

          {/* Performance Summary */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-black/80 border-gray-600 backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">
                  Final Ecosystem Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-2 ${performance.color}`}>
                    {Math.round(finalState.ecoScore)}
                  </div>
                  <div className={`text-xl font-medium mb-4 ${performance.color}`}>
                    {performance.label}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <span>Score change:</span>
                    {getChangeIcon(changes.ecoScore)}
                    <span className={getChangeColor(changes.ecoScore)}>
                      {changes.ecoScore > 0 ? '+' : ''}{Math.round(changes.ecoScore)} points
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Food Chain */}
            <Card className="bg-black/60 border-blue-500/30 backdrop-blur-md">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Food Chain Balance</div>
                  <div className="text-3xl font-bold text-blue-300 mb-2">
                    {Math.round(finalState.foodChain)}%
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {getChangeIcon(changes.foodChain)}
                    <span className={`text-sm ${getChangeColor(changes.foodChain)}`}>
                      {changes.foodChain > 0 ? '+' : ''}{Math.round(changes.foodChain)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-black/60 border-green-500/30 backdrop-blur-md">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Natural Resources</div>
                  <div className="text-3xl font-bold text-green-300 mb-2">
                    {Math.round(finalState.resources)}%
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {getChangeIcon(changes.resources)}
                    <span className={`text-sm ${getChangeColor(changes.resources)}`}>
                      {changes.resources > 0 ? '+' : ''}{Math.round(changes.resources)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Human Activity */}
            <Card className="bg-black/60 border-orange-500/30 backdrop-blur-md">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">Human Activity</div>
                  <div className="text-3xl font-bold text-orange-300 mb-2">
                    {Math.round(finalState.humanActivity)}%
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {getChangeIcon(changes.humanActivity)}
                    <span className={`text-sm ${getChangeColor(changes.humanActivity)}`}>
                      {changes.humanActivity > 0 ? '+' : ''}{Math.round(changes.humanActivity)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Simulation Timeline Chart */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-black/80 border-gray-600 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Ecosystem Evolution Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }} 
                    />
                    <Area type="monotone" dataKey="ecoScore" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    <Line type="monotone" dataKey="foodChain" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="resources" stroke="#10B981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="humanActivity" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Analysis Section */}
          {!showAIAnalysis ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex justify-center"
            >
              <Button
                onClick={showAIResults}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get AI Analysis
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/50 backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <CardTitle className="text-white">AI Ecosystem Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingAI ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                      <span className="ml-2 text-gray-300">Analyzing ecosystem data...</span>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="text-gray-200 whitespace-pre-wrap">
                      {aiAnalysis.message}
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      Failed to load AI analysis. Please try again.
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex justify-center gap-4 pb-8"
          >
            <Button
              onClick={resetGameFlow}
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Run New Simulation
            </Button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}