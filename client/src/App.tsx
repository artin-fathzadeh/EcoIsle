// ⚠️ CRITICAL: This application uses x-ai/grok-4-fast:free for ALL AI features - DO NOT CHANGE
// AI model is configured in server/ai-service.ts and must remain 'x-ai/grok-4-fast:free'
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { Button } from "./components/ui/button";
import { Trophy, Play } from "lucide-react";

// Import game components
// ⚠️ All components with AI features use x-ai/grok-4-fast:free - DO NOT CHANGE
import WorldMap from "./components/game/WorldMap";
import CesiumWorldMap from "./components/game/CesiumWorldMap";
import FallbackWorldMap from "./components/game/FallbackWorldMap";
import CountrySelector from "./components/game/CountrySelector";
import EcosystemControls from "./components/game/EcosystemControls";
import EcoScore from "./components/game/EcoScore";
import EducationalEcoScore from "./components/game/EducationalEcoScore";
import Assistant from "./components/game/Assistant"; // Uses x-ai/grok-4-fast:free - DO NOT CHANGE
import VisualFeedback from "./components/game/VisualFeedback";
import IntroBot from "./components/game/IntroBot"; // Uses x-ai/grok-4-fast:free - DO NOT CHANGE
import CardGameInterface from "./components/game/CardGameInterface";
import GameModeSelector from "./components/game/GameModeSelector";
import GorillaMode from "./components/game/GorillaMode";
import Leaderboard from "./components/game/Leaderboard";
import GameFlowManager from "./components/game/GameFlowManager";
import { Toaster } from "sonner";

// Import stores
import { useGame } from "./lib/stores/useGame";
import { useCountries } from "./lib/stores/useCountries";
import { useCardGame } from "./lib/stores/useCardGame";
import { useGameFlow } from "./lib/stores/useGameFlow";
import { getFeatureValue } from "./lib/featureFlags";


// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "interact", keys: ["KeyE"] },
  { name: "escape", keys: ["Escape"] },
];

// Main App component
function App() {
  const { phase } = useGame();
  const { selectedCountry } = useCountries();
  const { gameMode } = useCardGame();
  const { currentScreen, navigateToScreen } = useGameFlow();
  const [showCanvas, setShowCanvas] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Get map engine preference from feature flags
  const mapEngine = getFeatureValue('MAP_ENGINE');

  // Check WebGL support and show the canvas once everything is loaded
  useEffect(() => {
    // Simple WebGL detection
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch (e) {
      setWebglSupported(false);
    }
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Toaster position="bottom-center" richColors expand={true} />
      {showCanvas && (
        <KeyboardControls map={controls}>
          {/* Conditionally render Cesium or Three.js map based on feature flag */}
          {mapEngine === 'cesium' ? (
            // Cesium 3D Globe (new)
            webglSupported ? (
              <CesiumWorldMap 
                showEnvironmentalData={true}
                enableTimelapse={currentScreen === 'results'}
              />
            ) : (
              <FallbackWorldMap />
            )
          ) : (
            // Three.js map (original)
            webglSupported ? (
              <Canvas
                shadows
                camera={{
                  position: [0, 15, 25],
                  fov: 45,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#0a1428"]} />

                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight
                  position={[10, 20, 10]}
                  intensity={1}
                  castShadow
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                />

                <Suspense fallback={null}>
                  <WorldMap />
                </Suspense>
              </Canvas>
            ) : (
              <FallbackWorldMap />
            )
          )}

          {/* UI Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Country Selection UI */}
            {!selectedCountry && (
              <CountrySelector />
            )}

            {/* Game UI when country is selected */}
            {selectedCountry && (
              <>
                {/* Game mode selector */}
                <GameModeSelector />
                
                {/* Simulation Mode + Leaderboard buttons grouped together */}
                <div className="fixed top-4 left-40 pointer-events-auto z-40 flex items-center gap-3">
                  <Button
                    onClick={() => navigateToScreen('setup')}
                    className="bg-white/10 hover:bg-white/20 text-white border border-gray-600 rounded-full flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Simulation Mode
                  </Button>

                  <Button
                    onClick={() => setShowLeaderboard(true)}
                    className="bg-white/10 hover:bg-white/20 text-white border border-gray-600 rounded-full flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Button>
                </div>
                
                {/* Intro bot tutorial */}
                <IntroBot />
                
                {/* Score display - use educational version for education mode */}
                {gameMode === 'education' ? <EducationalEcoScore /> : <EcoScore />}
                
                {/* Controls and UI based on game mode - hide during simulation workflow */}
                {currentScreen !== 'idle' ? null : (
                  <>
                    {gameMode === 'education' && (
                      <>
                        <EcosystemControls />
                        <VisualFeedback />
                        <Assistant />
                      </>
                    )}
                    
                    {/* Card game interface for card modes */}
                    {(gameMode === 'cards' || gameMode === 'endless') && (
                      <CardGameInterface />
                    )}
                    
                    {/* Gorilla mode interface */}
                    {gameMode === 'gorilla' && (
                      <GorillaMode />
                    )}
                  </>
                )}
                
                {/* Leaderboard Modal */}
                <Leaderboard 
                  isOpen={showLeaderboard} 
                  onClose={() => setShowLeaderboard(false)} 
                />
              </>
            )}
          </div>
          
          {/* Three-Screen Simulation Workflow */}
          <GameFlowManager />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
