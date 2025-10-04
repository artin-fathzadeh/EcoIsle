/**
 * CesiumMapEnhanced - Complete Redesign with All Enhancements
 * 
 * FEATURES:
 * ✅ Fixed camera error handling (no more "normalized result is not a number")
 * ✅ Revolutionary gesture system for trackpad, mouse, and touch
 * ✅ 50+ countries with comprehensive coverage
 * ✅ Dynamic starfield background
 * ✅ Advanced terrain and atmosphere
 * ✅ Smart zoom and navigation controls
 * ✅ Performance optimizations
 * ✅ Gesture help overlay
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Viewer,
  Ion,
  Color,
  Math as CesiumMath,
  Cartesian3,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  Entity,
  createWorldImageryAsync,
  createWorldTerrainAsync,
  CallbackProperty,
  Cartesian2,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './CesiumMap.css';
import { useCountries } from '@/lib/stores/useCountries';
import { useEcosystem } from '@/lib/stores/useEcosystem';
import { EnvironmentalDataVisualizer } from '@/lib/cesiumDataVisualizer';
import { CesiumGestureController, detectInputCapabilities } from '@/lib/cesiumGestureSystem';
import { WORLD_COUNTRIES, type CountryData } from '@/lib/expandedCountries';
import { setupAdvancedBackground } from '@/lib/cesiumBackground';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ZoomIn, ZoomOut, Home, Rotate3D, HelpCircle, X } from 'lucide-react';

// Cesium Ion access token
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyMzQzNi1mMzY4LTQ1YTItYTBjYS03ZDVmYTJiZDI4YWQiLCJpZCI6MjI1MjMzLCJpYXQiOjE3Mjg0ODYzMzV9.cT7VRjEpZShNnJuZwZqNxYGmVw4lHU0EyNYJKlzJYbQ';

interface CesiumMapEnhancedProps {
  selectedCountry?: string;
  onCountrySelect?: (country: string) => void;
  simulationMode?: 'idle' | 'running' | 'complete';
  showEnvironmentalData?: boolean;
  timelapseData?: TimelapseFrame[];
  isSimulating?: boolean;
}

interface TimelapseFrame {
  timestamp: number;
  ecosystemState: {
    foodChain: number;
    resources: number;
    humanActivity: number;
    ecoScore: number;
  };
}

/**
 * Gesture Help Overlay Component
 */
function GestureHelpOverlay({ onClose }: { onClose: () => void }) {
  const capabilities = detectInputCapabilities();
  
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <Card className="bg-slate-900/95 text-white p-6 max-w-md border-blue-500/30">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-blue-400">Navigation Controls</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {capabilities.hasTrackpad ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🖱️</span>
              <div>
                <strong className="text-blue-300">Single finger drag:</strong>
                <span className="text-gray-300"> Rotate globe</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✌️</span>
              <div>
                <strong className="text-blue-300">Two finger drag:</strong>
                <span className="text-gray-300"> Pan across surface</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤏</span>
              <div>
                <strong className="text-blue-300">Pinch:</strong>
                <span className="text-gray-300"> Zoom in/out</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⌘</span>
              <div>
                <strong className="text-blue-300">Cmd + drag:</strong>
                <span className="text-gray-300"> Tilt 3D view</span>
              </div>
            </div>
          </div>
        ) : capabilities.hasTouch ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👆</span>
              <div>
                <strong className="text-blue-300">Single finger drag:</strong>
                <span className="text-gray-300"> Rotate globe</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✌️</span>
              <div>
                <strong className="text-blue-300">Two finger drag:</strong>
                <span className="text-gray-300"> Pan surface</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤏</span>
              <div>
                <strong className="text-blue-300">Pinch:</strong>
                <span className="text-gray-300"> Zoom with elastic feel</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">👇</span>
              <div>
                <strong className="text-blue-300">Double tap:</strong>
                <span className="text-gray-300"> Quick zoom to region</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🖱️</span>
              <div>
                <strong className="text-blue-300">Left drag:</strong>
                <span className="text-gray-300"> Rotate globe</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🖱️</span>
              <div>
                <strong className="text-blue-300">Right drag:</strong>
                <span className="text-gray-300"> Pan across surface</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <strong className="text-blue-300">Scroll wheel:</strong>
                <span className="text-gray-300"> Zoom in/out</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⌃</span>
              <div>
                <strong className="text-blue-300">Ctrl + drag:</strong>
                <span className="text-gray-300"> Tilt 3D view</span>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          onClick={onClose} 
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
        >
          Got it!
        </Button>
      </Card>
    </div>
  );
}

/**
 * Main Enhanced Cesium Map Component
 */
export default function CesiumMapEnhanced({
  selectedCountry,
  onCountrySelect,
  simulationMode = 'idle',
  showEnvironmentalData = false,
  timelapseData,
  isSimulating = false,
}: CesiumMapEnhancedProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const gestureControllerRef = useRef<CesiumGestureController | null>(null);
  const eventHandlerRef = useRef<ScreenSpaceEventHandler | null>(null);
  const countryEntitiesRef = useRef<Map<string, Entity>>(new Map());
  const dataVisualizerRef = useRef<EnvironmentalDataVisualizer | null>(null);
  
  const { selectCountry } = useCountries();
  const { ecoScore, foodChain, resources, humanActivity } = useEcosystem();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [terrainEnabled, setTerrainEnabled] = useState(false);

  /**
   * Initialize Cesium Viewer with all enhancements
   */
  useEffect(() => {
    if (!cesiumContainerRef.current || viewerRef.current) return;

    try {
      console.log('Initializing Enhanced Cesium Viewer...');
      
      // Create viewer with optimized settings
      const viewer = new Viewer(cesiumContainerRef.current, {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        skyBox: false,
        skyAtmosphere: false,
      });

      // Setup advanced background and atmosphere
      setupAdvancedBackground(viewer, {
        type: 'starfield',
        animated: true,
        intensity: 1.0,
      });

      // Apply dark imagery
      applyDarkImagery(viewer);

      // Enable terrain (optional, can be toggled)
      enableWorldTerrain(viewer);

      // Set initial camera position
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(0, 20, 20000000),
        orientation: {
          heading: 0,
          pitch: CesiumMath.toRadians(-45),
          roll: 0,
        },
      });

      // Initialize gesture controller
      gestureControllerRef.current = new CesiumGestureController(viewer);

      viewerRef.current = viewer;
      
      // Initialize data visualizer
      dataVisualizerRef.current = new EnvironmentalDataVisualizer(viewer);
      
      setIsInitialized(true);
      console.log('Cesium Enhanced Viewer initialized successfully');

      // Cleanup on unmount
      return () => {
        if (dataVisualizerRef.current) {
          dataVisualizerRef.current.destroy();
        }
        if (gestureControllerRef.current) {
          gestureControllerRef.current.destroy();
        }
        if (eventHandlerRef.current) {
          eventHandlerRef.current.destroy();
        }
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }
      };
    } catch (error) {
      console.error('Failed to initialize Cesium viewer:', error);
    }
  }, []);

  /**
   * Apply dark themed imagery
   */
  const applyDarkImagery = async (viewer: Viewer) => {
    const scene = viewer.scene;
    const imageryLayers = viewer.imageryLayers;
    imageryLayers.removeAll();

    try {
      const imagery = await createWorldImageryAsync();
      const darkImagery = imageryLayers.addImageryProvider(imagery);
      darkImagery.alpha = 0.3;
      darkImagery.brightness = 0.4;
      darkImagery.contrast = 1.0;
      darkImagery.saturation = 0.8;
    } catch (error) {
      console.warn('Could not load custom imagery:', error);
    }
  };

  /**
   * Enable world terrain (optional)
   */
  const enableWorldTerrain = async (viewer: Viewer) => {
    try {
      const terrainProvider = await createWorldTerrainAsync({
        requestWaterMask: true,
        requestVertexNormals: true,
      });
      viewer.terrainProvider = terrainProvider;
      viewer.scene.globe.depthTestAgainstTerrain = false;
      setTerrainEnabled(true);
      console.log('World terrain enabled');
    } catch (error) {
      console.warn('Could not enable world terrain, using ellipsoid:', error);
    }
  };

  /**
   * Load country markers for all 50+ countries
   */
  useEffect(() => {
    if (!isInitialized || !viewerRef.current) return;

    const viewer = viewerRef.current;
    
    console.log(`Loading ${Object.keys(WORLD_COUNTRIES).length} countries...`);
    
    // Create country markers/entities
    Object.entries(WORLD_COUNTRIES).forEach(([countryName, countryData]: [string, CountryData]) => {
      const color = Color.fromCssColorString(countryData.color);
      
      // Create a pulsing point entity for each country
      const entity = viewer.entities.add({
        name: countryName,
        position: Cartesian3.fromDegrees(
          countryData.position[0],
          countryData.position[1],
          100000
        ),
        point: {
          pixelSize: new CallbackProperty(() => {
            if (selectedCountry === countryName) return 30;
            if (hoveredCountry === countryName) return 25;
            return 20;
          }, false) as any,
          color: new CallbackProperty(() => {
            if (selectedCountry === countryName) {
              return Color.WHITE.withAlpha(0.9);
            }
            if (hoveredCountry === countryName) {
              return color.withAlpha(0.9);
            }
            return color.withAlpha(0.7);
          }, false) as any,
          outlineColor: new CallbackProperty(() => {
            if (selectedCountry === countryName || hoveredCountry === countryName) {
              return Color.WHITE;
            }
            return color.brighten(0.5, new Color());
          }, false) as any,
          outlineWidth: new CallbackProperty(() => {
            if (selectedCountry === countryName) return 4;
            if (hoveredCountry === countryName) return 3;
            return 2;
          }, false) as any,
        },
        label: {
          text: countryName,
          font: '14px Inter, sans-serif',
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 0, // FILL_AND_OUTLINE
          verticalOrigin: 1, // BOTTOM
          pixelOffset: new Cartesian2(0, -40),
          showBackground: true,
          backgroundColor: Color.fromCssColorString('#0a1428').withAlpha(0.7),
          backgroundPadding: new Cartesian2(8, 4),
          distanceDisplayCondition: undefined,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
      
      countryEntitiesRef.current.set(countryName, entity);
    });

    // Setup click handler for country selection
    setupInteractionHandlers(viewer);

    console.log('Countries loaded successfully');
  }, [isInitialized, selectedCountry, hoveredCountry]);

  /**
   * Setup mouse and touch interaction handlers
   */
  const setupInteractionHandlers = (viewer: Viewer) => {
    if (eventHandlerRef.current) {
      eventHandlerRef.current.destroy();
    }

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    // Left click - select country
    handler.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.position);
      
      if (defined(pickedObject) && defined(pickedObject.id)) {
        const entity = pickedObject.id;
        if (entity.name && WORLD_COUNTRIES[entity.name]) {
          handleCountryClick(entity.name);
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // Mouse move - hover effect
    handler.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);
      
      if (defined(pickedObject) && defined(pickedObject.id)) {
        const entity = pickedObject.id;
        if (entity.name && WORLD_COUNTRIES[entity.name]) {
          setHoveredCountry(entity.name);
          viewer.scene.canvas.style.cursor = 'pointer';
          return;
        }
      }
      
      setHoveredCountry(null);
      viewer.scene.canvas.style.cursor = 'default';
    }, ScreenSpaceEventType.MOUSE_MOVE);

    eventHandlerRef.current = handler;
  };

  /**
   * Handle country selection with smooth animation
   */
  const handleCountryClick = useCallback((countryName: string) => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;
    const countryData = WORLD_COUNTRIES[countryName];
    
    if (!countryData) return;

    console.log(`Flying to ${countryName}...`);

    // Fly to selected country with smooth animation
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        countryData.position[0],
        countryData.position[1],
        2500000
      ),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-40),
        roll: 0,
      },
      duration: 2.0,
    });

    // Update state
    if (onCountrySelect) {
      onCountrySelect(countryName);
    } else {
      selectCountry(countryName);
    }

    viewer.scene.requestRender();
  }, [onCountrySelect, selectCountry]);

  /**
   * Update camera when country selection changes externally
   */
  useEffect(() => {
    if (!viewerRef.current || !selectedCountry) return;

    const countryData = WORLD_COUNTRIES[selectedCountry];
    if (countryData) {
      viewerRef.current.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          countryData.position[0],
          countryData.position[1],
          2500000
        ),
        duration: 2.0,
      });
    }
  }, [selectedCountry]);

  /**
   * Add environmental data overlays
   */
  useEffect(() => {
    if (!isInitialized || !viewerRef.current || !showEnvironmentalData || !selectedCountry) return;
    if (!dataVisualizerRef.current) return;

    const countryData = WORLD_COUNTRIES[selectedCountry];
    if (!countryData) return;

    const visualizer = dataVisualizerRef.current;
    
    // Create ecosystem health visualization
    visualizer.createEcosystemHealthOverlay(
      selectedCountry,
      { longitude: countryData.position[0], latitude: countryData.position[1] },
      ecoScore,
      foodChain,
      resources,
      humanActivity
    );
  }, [isInitialized, showEnvironmentalData, selectedCountry, ecoScore, foodChain, resources, humanActivity]);

  /**
   * Handle timelapse animation
   */
  useEffect(() => {
    if (!timelapseData || !viewerRef.current || timelapseData.length === 0) return;
    if (!dataVisualizerRef.current || !selectedCountry) return;

    const countryData = WORLD_COUNTRIES[selectedCountry];
    if (!countryData) return;

    const visualizer = dataVisualizerRef.current;
    
    visualizer.animateTimelapse(
      timelapseData,
      selectedCountry,
      { longitude: countryData.position[0], latitude: countryData.position[1] },
      (frame, index) => {
        console.log(`Timelapse frame ${index}:`, frame.ecosystemState);
      },
      1000
    );

    return () => {
      visualizer.stopTimelapse();
    };
  }, [timelapseData, selectedCountry]);

  /**
   * Request render on state changes
   */
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scene.requestRender();
    }
  }, [selectedCountry, hoveredCountry, ecoScore]);

  /**
   * Navigation control handlers
   */
  const handleZoomIn = () => gestureControllerRef.current?.smartZoomIn();
  const handleZoomOut = () => gestureControllerRef.current?.smartZoomOut();
  const handleReset = () => gestureControllerRef.current?.resetCameraToSafePosition('default');
  const handle3DTilt = () => gestureControllerRef.current?.toggle3DTilt();

  return (
    <>
      <div 
        ref={cesiumContainerRef} 
        className="cesium-container"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      
      {/* Navigation Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <Button
          onClick={handleZoomIn}
          className="bg-blue-600/90 hover:bg-blue-700 text-white p-3 shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleZoomOut}
          className="bg-blue-600/90 hover:bg-blue-700 text-white p-3 shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          onClick={handleReset}
          className="bg-purple-600/90 hover:bg-purple-700 text-white p-3 shadow-lg"
          title="Reset View"
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button
          onClick={handle3DTilt}
          className="bg-green-600/90 hover:bg-green-700 text-white p-3 shadow-lg"
          title="Toggle 3D Tilt"
        >
          <Rotate3D className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setShowHelp(true)}
          className="bg-gray-600/90 hover:bg-gray-700 text-white p-3 shadow-lg mt-2"
          title="Navigation Help"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>

      {/* Country Count Indicator */}
      <div className="absolute top-6 right-6 bg-slate-900/80 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm z-10">
        <div className="text-xs text-gray-400">Available Countries</div>
        <div className="text-2xl font-bold text-blue-400">
          {Object.keys(WORLD_COUNTRIES).length}
        </div>
      </div>

      {/* Terrain Indicator */}
      {terrainEnabled && (
        <div className="absolute top-24 right-6 bg-green-900/80 text-white px-3 py-1 rounded text-xs shadow-lg z-10">
          ⛰️ 3D Terrain Active
        </div>
      )}

      {/* Gesture Help Overlay */}
      {showHelp && <GestureHelpOverlay onClose={() => setShowHelp(false)} />}
    </>
  );
}
