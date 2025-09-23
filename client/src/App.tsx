import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";

// Import game components
import WorldMap from "./components/game/WorldMap";
import FallbackWorldMap from "./components/game/FallbackWorldMap";
import CountrySelector from "./components/game/CountrySelector";
import EcosystemControls from "./components/game/EcosystemControls";
import EcoScore from "./components/game/EcoScore";
import EducationalEcoScore from "./components/game/EducationalEcoScore";
import Assistant from "./components/game/Assistant";
import VisualFeedback from "./components/game/VisualFeedback";
import IntroBot from "./components/game/IntroBot";
import CardGameInterface from "./components/game/CardGameInterface";
import GameModeSelector from "./components/game/GameModeSelector";

// Import stores
import { useGame } from "./lib/stores/useGame";
import { useCountries } from "./lib/stores/useCountries";
import { useCardGame } from "./lib/stores/useCardGame";


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
  const [showCanvas, setShowCanvas] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

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
      {showCanvas && (
        <KeyboardControls map={controls}>
          {/* Conditionally render 3D or 2D map based on WebGL support */}
          {webglSupported ? (
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
                
                {/* Intro bot tutorial */}
                <IntroBot />
                
                {/* Score display - use educational version for education mode */}
                {gameMode === 'education' ? <EducationalEcoScore /> : <EcoScore />}
                
                {/* Controls and UI based on game mode */}
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
              </>
            )}
          </div>
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
