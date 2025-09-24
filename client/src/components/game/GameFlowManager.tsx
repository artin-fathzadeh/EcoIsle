import { useGameFlow } from "@/lib/stores/useGameFlow";
import { AnimatePresence } from "framer-motion";
import SetupScreen from "./screens/SetupScreen";
import SimulationScreen from "./screens/SimulationScreen";
import ResultsScreen from "./screens/ResultsScreen";

export default function GameFlowManager() {
  const { currentScreen } = useGameFlow();

  // Don't render anything if in idle state
  if (currentScreen === 'idle') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {currentScreen === 'setup' && (
        <SetupScreen key="setup" />
      )}
      
      {currentScreen === 'simulation' && (
        <SimulationScreen key="simulation" />
      )}
      
      {currentScreen === 'results' && (
        <ResultsScreen key="results" />
      )}
    </AnimatePresence>
  );
}