/**
 * Example Usage: Cesium Environmental Data Visualization
 * 
 * This file demonstrates how to use the Cesium integration
 * and environmental data visualizer in your components.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from 'cesium';
import {
  EnvironmentalDataVisualizer,
  generateSampleEnvironmentalData,
  generateSampleTimelapseData,
  type EnvironmentalDataLayer,
  type TimelapseFrame,
} from '@/lib/cesiumDataVisualizer';

// ========================================
// Example 1: Basic Cesium Map Usage
// ========================================

export function BasicCesiumExample() {
  return (
    <div className="w-full h-screen">
      <CesiumWorldMap 
        showEnvironmentalData={true}
        enableTimelapse={false}
      />
    </div>
  );
}

// ========================================
// Example 2: Custom Data Overlay
// ========================================

export function CustomDataOverlayExample() {
  const visualizerRef = useRef<EnvironmentalDataVisualizer | null>(null);
  const [viewer, setViewer] = useState<Viewer | null>(null);

  useEffect(() => {
    if (!viewer) return;

    // Initialize visualizer
    const visualizer = new EnvironmentalDataVisualizer(viewer);
    visualizerRef.current = visualizer;

    // Add biodiversity overlay for Brazil
    visualizer.addDataLayer({
      type: 'biodiversity',
      intensity: 85, // High biodiversity
      coordinates: {
        longitude: -47.8825,
        latitude: -15.7939,
        radius: 500000, // 500km radius
      }
    }, 'Brazil');

    // Add pollution overlay for USA
    visualizer.addDataLayer({
      type: 'pollution',
      intensity: 65, // Moderate pollution
      coordinates: {
        longitude: -95.7129,
        latitude: 37.0902,
        radius: 400000,
      }
    }, 'USA');

    // Cleanup
    return () => {
      visualizer.destroy();
    };
  }, [viewer]);

  // ... rest of component
}

// ========================================
// Example 3: Timelapse Animation
// ========================================

export function TimelapseAnimationExample() {
  const visualizerRef = useRef<EnvironmentalDataVisualizer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startTimelapse = () => {
    if (!visualizerRef.current) return;

    // Generate sample data
    const frames: TimelapseFrame[] = generateSampleTimelapseData(
      {
        foodChain: 60,
        resources: 70,
        humanActivity: 50,
        ecoScore: 75,
      },
      20 // 20 frames
    );

    // Start animation
    visualizerRef.current.animateTimelapse(
      frames,
      'Brazil',
      { longitude: -47.8825, latitude: -15.7939 },
      (frame, index) => {
        console.log(`Frame ${index}:`, frame.ecosystemState.ecoScore);
      },
      1000 // 1 second per frame
    );

    setIsPlaying(true);
  };

  const stopTimelapse = () => {
    if (!visualizerRef.current) return;
    visualizerRef.current.stopTimelapse();
    setIsPlaying(false);
  };

  return (
    <div>
      <button onClick={startTimelapse} disabled={isPlaying}>
        Start Timelapse
      </button>
      <button onClick={stopTimelapse} disabled={!isPlaying}>
        Stop Timelapse
      </button>
    </div>
  );
}

// ========================================
// Example 4: Ecosystem Health Visualization
// ========================================

export function EcosystemHealthExample() {
  const visualizerRef = useRef<EnvironmentalDataVisualizer | null>(null);

  const updateEcosystemHealth = (
    country: string,
    coords: { longitude: number; latitude: number },
    metrics: {
      ecoScore: number;
      foodChain: number;
      resources: number;
      humanActivity: number;
    }
  ) => {
    if (!visualizerRef.current) return;

    visualizerRef.current.createEcosystemHealthOverlay(
      country,
      coords,
      metrics.ecoScore,
      metrics.foodChain,
      metrics.resources,
      metrics.humanActivity
    );
  };

  // Example: Update USA ecosystem health
  useEffect(() => {
    updateEcosystemHealth(
      'USA',
      { longitude: -95.7129, latitude: 37.0902 },
      {
        ecoScore: 65,
        foodChain: 55,
        resources: 60,
        humanActivity: 75,
      }
    );
  }, []);

  // ... rest of component
}

// ========================================
// Example 5: Interactive Country Selection
// ========================================

export function InteractiveCountryExample() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCountrySelect = (country: string) => {
    console.log(`Selected country: ${country}`);
    setSelectedCountry(country);
    
    // You can trigger additional actions here
    // - Load country-specific data
    // - Show information panel
    // - Update ecosystem parameters
  };

  return (
    <div className="relative w-full h-screen">
      <CesiumWorldMap 
        selectedCountry={selectedCountry || undefined}
        onCountrySelect={handleCountrySelect}
        showEnvironmentalData={true}
      />
      
      {selectedCountry && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded">
          <h3 className="font-bold">Selected: {selectedCountry}</h3>
          <p>Click another country to change selection</p>
        </div>
      )}
    </div>
  );
}

// ========================================
// Example 6: Programmatic Camera Control
// ========================================

export function CameraControlExample() {
  const viewerRef = useRef<Viewer | null>(null);

  const flyToCountry = (
    longitude: number,
    latitude: number,
    altitude: number = 3000000
  ) => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;
    const { Cartesian3, Math: CesiumMath } = await import('cesium');

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(longitude, latitude, altitude),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-45),
        roll: 0,
      },
      duration: 2.0,
    });
  };

  return (
    <div>
      <div className="flex gap-2 p-4">
        <button onClick={() => flyToCountry(-95.7129, 37.0902)}>
          Fly to USA
        </button>
        <button onClick={() => flyToCountry(-47.8825, -15.7939)}>
          Fly to Brazil
        </button>
        <button onClick={() => flyToCountry(138.2529, 36.2048)}>
          Fly to Japan
        </button>
      </div>
    </div>
  );
}

// ========================================
// Example 7: Real-time Data Updates
// ========================================

export function RealTimeDataExample() {
  const visualizerRef = useRef<EnvironmentalDataVisualizer | null>(null);
  const [pollutionLevel, setPollutionLevel] = useState(50);

  // Update pollution visualization in real-time
  useEffect(() => {
    if (!visualizerRef.current) return;

    visualizerRef.current.updateDataLayer(
      'USA',
      'pollution',
      pollutionLevel
    );
  }, [pollutionLevel]);

  return (
    <div>
      <input
        type="range"
        min="0"
        max="100"
        value={pollutionLevel}
        onChange={(e) => setPollutionLevel(Number(e.target.value))}
      />
      <p>Pollution Level: {pollutionLevel}</p>
    </div>
  );
}

// ========================================
// Example 8: Multiple Data Layers
// ========================================

export function MultipleLayersExample() {
  const visualizerRef = useRef<EnvironmentalDataVisualizer | null>(null);
  const [viewer, setViewer] = useState<Viewer | null>(null);

  useEffect(() => {
    if (!viewer) return;

    const visualizer = new EnvironmentalDataVisualizer(viewer);
    visualizerRef.current = visualizer;

    // Generate and add multiple data layers for a country
    const sampleData = generateSampleEnvironmentalData({
      longitude: -47.8825,
      latitude: -15.7939,
    });

    // Add all layers
    sampleData.forEach(layer => {
      visualizer.addDataLayer(layer, 'Brazil');
    });

    return () => {
      visualizer.destroy();
    };
  }, [viewer]);

  // ... rest of component
}

// ========================================
// Example 9: Annotations and Labels
// ========================================

export function AnnotationsExample() {
  const visualizerRef = useRef<EnvironmentalDataVisualizer | null>(null);

  const addEcosystemAnnotation = (
    longitude: number,
    latitude: number,
    title: string,
    description: string
  ) => {
    if (!visualizerRef.current) return;

    visualizerRef.current.addAnnotation(
      { longitude, latitude },
      title,
      description
    );
  };

  useEffect(() => {
    // Add annotations for important ecosystems
    addEcosystemAnnotation(
      -60.0,
      -3.0,
      'Amazon Rainforest',
      'The world\'s largest tropical rainforest'
    );

    addEcosystemAnnotation(
      28.0,
      -3.0,
      'Congo Basin',
      'Second largest rainforest in the world'
    );
  }, []);

  // ... rest of component
}

// ========================================
// Example 10: Performance Optimization
// ========================================

export function PerformanceOptimizedExample() {
  // Enable high performance mode
  useEffect(() => {
    // Set feature flag for high performance
    // This reduces visual quality but improves frame rate
    
    // You can also manually control render requests
    const viewer = viewerRef.current;
    if (viewer) {
      // Only render when needed
      viewer.scene.requestRenderMode = true;
      viewer.scene.maximumRenderTimeChange = Infinity;
    }
  }, []);

  // ... rest of component
}

// ========================================
// Helper: Get Current Cesium Viewer
// ========================================

export function useeCesiumViewer() {
  const [viewer, setViewer] = useState<Viewer | null>(null);

  // This would be implemented to access the viewer instance
  // from CesiumMap component via context or ref

  return viewer;
}
