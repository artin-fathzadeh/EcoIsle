/**
 * CesiumWorldMap - Wrapper Component for Seamless Integration
 * 
 * This component provides a drop-in replacement for the existing WorldMap component,
 * maintaining the same interface while using Cesium for 3D globe visualization.
 * 
 * Features:
 * - Maintains exact same props interface as WorldMap
 * - Handles WebGL detection and fallback
 * - Integrates with existing Zustand stores
 * - Provides smooth transitions and animations
 * - Touch and mobile optimized
 */

import React, { Suspense, useState, useEffect } from 'react';
import { useCountries } from '@/lib/stores/useCountries';
import { useEcosystem } from '@/lib/stores/useEcosystem';
import { useGameFlow } from '@/lib/stores/useGameFlow';
import CesiumMapEnhanced from './CesiumMapEnhanced';
import { Loader2 } from 'lucide-react';

interface CesiumWorldMapProps {
  showEnvironmentalData?: boolean;
  enableTimelapse?: boolean;
}

/**
 * Loading component for Cesium initialization
 */
function CesiumLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a1428] to-[#1a4870]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        <div className="text-white text-lg font-medium">Loading 3D Globe...</div>
        <div className="text-gray-400 text-sm">Initializing Cesium viewer</div>
      </div>
    </div>
  );
}

/**
 * Error boundary fallback for Cesium errors
 */
function CesiumError({ error }: { error: Error }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0a1428] to-[#1a4870]">
      <div className="max-w-md p-6 bg-red-900/20 border border-red-500/50 rounded-lg">
        <h3 className="text-red-400 text-lg font-bold mb-2">3D Globe Error</h3>
        <p className="text-gray-300 text-sm mb-4">
          Failed to initialize Cesium 3D globe. This may be due to:
        </p>
        <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
          <li>WebGL not supported by your device</li>
          <li>Insufficient graphics memory</li>
          <li>Network connectivity issues</li>
        </ul>
        <div className="mt-4 p-3 bg-black/30 rounded text-xs text-gray-500 font-mono">
          {error.message}
        </div>
      </div>
    </div>
  );
}

/**
 * Main wrapper component
 */
export default function CesiumWorldMap({
  showEnvironmentalData = false,
  enableTimelapse = false,
}: CesiumWorldMapProps) {
  const { selectedCountry } = useCountries();
  const { ecoScore, foodChain, resources, humanActivity, isSimulating } = useEcosystem();
  const { currentScreen } = useGameFlow();
  
  const [error, setError] = useState<Error | null>(null);
  const [timelapseData, setTimelapseData] = useState<any[]>([]);

  // Generate sample timelapse data when simulation is running
  useEffect(() => {
    if (isSimulating && enableTimelapse) {
      // Generate timelapse frames based on current ecosystem state
      const frames = Array.from({ length: 10 }, (_, i) => ({
        timestamp: Date.now() + i * 1000,
        ecosystemState: {
          foodChain: foodChain - i * 2,
          resources: resources - i * 3,
          humanActivity: humanActivity + i * 2,
          ecoScore: ecoScore - i * 1,
        },
      }));
      setTimelapseData(frames);
    } else {
      setTimelapseData([]);
    }
  }, [isSimulating, enableTimelapse, foodChain, resources, humanActivity, ecoScore]);

  // Error boundary handling
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('Cesium') || event.message.includes('WebGL')) {
        setError(new Error(event.message));
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return <CesiumError error={error} />;
  }

  return (
    <Suspense fallback={<CesiumLoader />}>
      <CesiumMapEnhanced
        selectedCountry={selectedCountry || undefined}
        simulationMode={currentScreen === 'idle' ? 'idle' : 'running'}
        showEnvironmentalData={showEnvironmentalData || !!selectedCountry}
        timelapseData={enableTimelapse ? timelapseData : undefined}
        isSimulating={isSimulating}
      />
      
      {/* Floating UI text overlays matching original WorldMap */}
      {!selectedCountry && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Ecosystem Balance
          </h1>
          <p className="text-xl text-gray-300 drop-shadow-md">
            Click on a country to start
          </p>
        </div>
      )}
    </Suspense>
  );
}
