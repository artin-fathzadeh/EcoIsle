import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGameFlow } from "@/lib/stores/useGameFlow";
import { useCountries } from "@/lib/stores/useCountries";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { calculateEcoScore } from "@/lib/ecosystemEngine";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Leaf, Zap, Activity, TrendingUp } from "lucide-react";

interface SimulationFrame {
  time: number;
  foodChain: number;
  resources: number;
  humanActivity: number;
  ecoScore: number;
}

export default function SimulationScreen() {
  const { selectedCountry } = useCountries();
  const { 
    setupParameters, 
    simulationProgress, 
    simulationDuration,
    updateSimulationProgress,
    completeSimulation 
  } = useGameFlow();
  
  const [currentFrame, setCurrentFrame] = useState<SimulationFrame>({
    time: 0,
    foodChain: setupParameters.foodChain,
    resources: setupParameters.resources,
    humanActivity: setupParameters.humanActivity,
    ecoScore: calculateEcoScore(setupParameters.foodChain, setupParameters.resources, setupParameters.humanActivity)
  });
  
  const [simulationHistory, setSimulationHistory] = useState<SimulationFrame[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string>("Initializing ecosystem...");

  // Simulation phases for narrative
  const phases = [
    "Initializing ecosystem parameters...",
    "Establishing food chain dynamics...",
    "Balancing resource distribution...",
    "Simulating human impact patterns...",
    "Processing environmental changes...",
    "Calculating ecosystem interactions...",
    "Analyzing biodiversity trends...",
    "Finalizing ecosystem state..."
  ];

  useEffect(() => {
    const startTime = Date.now();
    const targetDuration = simulationDuration * 1000; // Convert to milliseconds
    const frameRate = 60; // 60 FPS
    const totalFrames = simulationDuration * frameRate;
    
    let currentFrameIndex = 0;
    const history: SimulationFrame[] = [];
    
    // Generate simulation trajectory with realistic ecosystem evolution
    const generateFrame = (progress: number): SimulationFrame => {
      const time = progress * simulationDuration;
      
      // Create natural evolution curves with some randomness
      const evolutionFactor = Math.sin(progress * Math.PI * 2) * 0.1 + progress * 0.2;
      const noise = (Math.random() - 0.5) * 5; // Small random variations
      
      // Simulate ecosystem dynamics
      const foodChain = Math.max(0, Math.min(100, 
        setupParameters.foodChain + evolutionFactor * 20 + noise
      ));
      
      const resources = Math.max(0, Math.min(100, 
        setupParameters.resources + evolutionFactor * 15 + noise * 0.8
      ));
      
      const humanActivity = Math.max(0, Math.min(100, 
        setupParameters.humanActivity + evolutionFactor * 10 + noise * 0.5
      ));
      
      const ecoScore = calculateEcoScore(foodChain, resources, humanActivity);
      
      return { time, foodChain, resources, humanActivity, ecoScore };
    };

    const animationLoop = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / targetDuration, 1);
      
      // Update progress
      updateSimulationProgress(progress * 100);
      
      // Update current phase
      const phaseIndex = Math.floor(progress * phases.length);
      if (phaseIndex < phases.length) {
        setCurrentPhase(phases[phaseIndex]);
      }
      
      // Generate current frame
      const frame = generateFrame(progress);
      setCurrentFrame(frame);
      history.push(frame);
      setSimulationHistory([...history]);
      
      // Continue animation or complete
      if (progress < 1) {
        requestAnimationFrame(animationLoop);
      } else {
        // Simulation complete
        const initialState = {
          foodChain: setupParameters.foodChain,
          resources: setupParameters.resources,
          humanActivity: setupParameters.humanActivity,
          ecoScore: calculateEcoScore(setupParameters.foodChain, setupParameters.resources, setupParameters.humanActivity)
        };
        
        const finalFrame = history[history.length - 1];
        const finalState = {
          foodChain: finalFrame.foodChain,
          resources: finalFrame.resources,
          humanActivity: finalFrame.humanActivity,
          ecoScore: finalFrame.ecoScore
        };
        
        completeSimulation({
          initialState,
          finalState,
          simulationHistory: history,
          duration: simulationDuration
        });
      }
    };
    
    // Start animation
    requestAnimationFrame(animationLoop);
  }, [setupParameters, simulationDuration, updateSimulationProgress, completeSimulation]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-20 bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl space-y-6">
          
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Ecosystem Simulation Running
            </h1>
            <p className="text-blue-300">
              Simulating {selectedCountry} ecosystem evolution over time...
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-black/60 border-blue-500/50 backdrop-blur-md">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Progress</span>
                    <span className="text-blue-300">{Math.round(simulationProgress)}%</span>
                  </div>
                  <Progress 
                    value={simulationProgress} 
                    className="h-3 bg-slate-800"
                  />
                </div>
                <p className="text-center text-blue-200 text-sm">
                  {currentPhase}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Real-time Ecosystem Metrics */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Food Chain */}
            <Card className="bg-black/60 border-blue-500/30 backdrop-blur-md">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Food Chain</span>
                </div>
                <div className="text-2xl font-bold text-blue-300">
                  {Math.round(currentFrame.foodChain)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Predator-Prey Balance
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="bg-black/60 border-green-500/30 backdrop-blur-md">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Resources</span>
                </div>
                <div className="text-2xl font-bold text-green-300">
                  {Math.round(currentFrame.resources)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Natural Availability
                </div>
              </CardContent>
            </Card>

            {/* Human Activity */}
            <Card className="bg-black/60 border-orange-500/30 backdrop-blur-md">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-medium">Human Activity</span>
                </div>
                <div className="text-2xl font-bold text-orange-300">
                  {Math.round(currentFrame.humanActivity)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Development Level
                </div>
              </CardContent>
            </Card>

            {/* Eco Score */}
            <Card className="bg-black/60 border-purple-500/30 backdrop-blur-md">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Eco Score</span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(currentFrame.ecoScore)}`}>
                  {Math.round(currentFrame.ecoScore)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Overall Health
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Animated Visual Elements */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-4 border-blue-400/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-4 border-green-400/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-4 border-purple-400/30 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}