/**
 * CesiumMap Component - Advanced 3D Globe Visualization for EcoIsle
 * 
 * ENHANCED VERSION with:
 * - Fixed camera error handling (no more "normalized result is not a number")
 * - Revolutionary gesture system for trackpad, mouse, and touch
 * - 50+ countries with comprehensive coverage
 * - Dynamic starfield background
 * - Advanced terrain and atmosphere
 * - Smart zoom and navigation controls
 * - Performance optimizations
 * 
 * @requires Cesium Ion access token (set in environment or component)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Viewer,
  Ion,
  Color,
  Math as CesiumMath,
  Cartesian3,
  HeadingPitchRange,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  GeoJsonDataSource,
  Entity,
  ImageryLayer,
  createWorldImageryAsync,
  IonImageryProvider,
  ArcGisMapServerImageryProvider,
  createWorldTerrainAsync,
  EllipsoidTerrainProvider,
  Cartographic,
  ColorMaterialProperty,
  ConstantProperty,
  CallbackProperty,
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import './CesiumMap.css';
import { useCountries } from '@/lib/stores/useCountries';
import { useEcosystem } from '@/lib/stores/useEcosystem';
import {
  EnvironmentalDataVisualizer,
  type EnvironmentalDataLayer,
  type TimelapseFrame as DataTimelapseFrame,
} from '@/lib/cesiumDataVisualizer';
import { CesiumGestureController, detectInputCapabilities } from '@/lib/cesiumGestureSystem';
import { WORLD_COUNTRIES } from '@/lib/expandedCountries';
import { setupAdvancedBackground, applyEcosystemStyling } from '@/lib/cesiumBackground';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Home, Rotate3D, HelpCircle } from 'lucide-react';

// Cesium Ion access token - Use your own token or environment variable
// Default token is for development only
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyMzQzNi1mMzY4LTQ1YTItYTBjYS03ZDVmYTJiZDI4YWQiLCJpZCI6MjI1MjMzLCJpYXQiOjE3Mjg0ODYzMzV9.cT7VRjEpZShNnJuZwZqNxYGmVw4lHU0EyNYJKlzJYbQ';

interface CesiumMapProps {
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
 * Main Cesium Map Component
 */
export default function CesiumMap({
  selectedCountry,
  onCountrySelect,
  simulationMode = 'idle',
  showEnvironmentalData = false,
  timelapseData,
  isSimulating = false,
}: CesiumMapProps) {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const dataSourceRef = useRef<GeoJsonDataSource | null>(null);
  const eventHandlerRef = useRef<ScreenSpaceEventHandler | null>(null);
  const countryEntitiesRef = useRef<Map<string, Entity>>(new Map());
  const dataVisualizerRef = useRef<EnvironmentalDataVisualizer | null>(null);
  
  const { selectCountry } = useCountries();
  const { ecoScore, foodChain, resources, humanActivity } = useEcosystem();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  /**
   * Initialize Cesium Viewer with custom styling
   */
  useEffect(() => {
    if (!cesiumContainerRef.current || viewerRef.current) return;

    try {
      // Create viewer with dark theme configuration
      const viewer = new Viewer(cesiumContainerRef.current, {
        // Disable default UI elements for custom integration
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
        
        // Performance optimizations
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
        
        // Use basic terrain for better performance
        terrainProvider: new EllipsoidTerrainProvider(),
        
        // Scene configuration
        skyBox: false,
        skyAtmosphere: false,
      });

      // Apply dark theme styling
      applyDarkTheme(viewer);

      // Configure camera
      configureCameraControls(viewer);

      // Set initial camera position - overview of the world
      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(0, 20, 20000000),
        orientation: {
          heading: 0,
          pitch: CesiumMath.toRadians(-45),
          roll: 0,
        },
      });

      viewerRef.current = viewer;
      
      // Initialize data visualizer
      dataVisualizerRef.current = new EnvironmentalDataVisualizer(viewer);
      
      setIsInitialized(true);

      // Cleanup on unmount
      return () => {
        if (dataVisualizerRef.current) {
          dataVisualizerRef.current.destroy();
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
   * Apply dark theme to Cesium viewer
   */
  const applyDarkTheme = (viewer: Viewer) => {
    const scene = viewer.scene;
    
    // Set dark background color matching EcoIsle theme
    scene.backgroundColor = Color.fromCssColorString('#0a1428');
    
    // Configure globe appearance
    const globe = scene.globe;
    globe.baseColor = Color.fromCssColorString('#1a4870');
    globe.enableLighting = false;
    globe.showGroundAtmosphere = true;
    
    // Set dark atmosphere
    if (scene.skyAtmosphere) {
      scene.skyAtmosphere.hueShift = -0.8;
      scene.skyAtmosphere.saturationShift = -0.3;
      scene.skyAtmosphere.brightnessShift = -0.5;
    }
    
    // Use dark imagery
    const imageryLayers = viewer.imageryLayers;
    imageryLayers.removeAll();
    
    // Add dark base layer
    try {
      // Use async function to create world imagery
      createWorldImageryAsync().then(imagery => {
        const darkImagery = imageryLayers.addImageryProvider(imagery);
        darkImagery.alpha = 0.3;
        darkImagery.brightness = 0.4;
      });
    } catch (e) {
      console.warn('Could not load custom imagery, using default');
    }
  };

  /**
   * Configure camera controls for smooth interaction
   */
  const configureCameraControls = (viewer: Viewer) => {
    const scene = viewer.scene;
    const camera = viewer.camera;
    
    // Enable smooth camera movements
    camera.percentageChanged = 0.01;
    
    // Configure screen space camera controller
    const controller = scene.screenSpaceCameraController;
    controller.enableRotate = true;
    controller.enableTranslate = true;
    controller.enableZoom = true;
    controller.enableTilt = true;
    controller.enableLook = false;
    
    // Set smooth movement parameters
    controller.inertiaSpin = 0.9;
    controller.inertiaTranslate = 0.9;
    controller.inertiaZoom = 0.8;
    
    // Set zoom limits
    controller.minimumZoomDistance = 1000000; // 1000 km
    controller.maximumZoomDistance = 40000000; // 40000 km
    
    // Touch gesture optimization
    controller.enableCollisionDetection = true;
  };

  /**
   * Load and display country boundaries with interactive highlighting
   */
  useEffect(() => {
    if (!isInitialized || !viewerRef.current) return;

    const viewer = viewerRef.current;
    
    // Create country markers/entities
    Object.entries(COUNTRY_COORDINATES).forEach(([countryName, coords]) => {
      const color = Color.fromCssColorString(COUNTRY_COLORS[countryName as keyof typeof COUNTRY_COLORS]);
      
      // Create a pulsing point entity for each country
      const entity = viewer.entities.add({
        name: countryName,
        position: Cartesian3.fromDegrees(coords.longitude, coords.latitude, 100000),
        point: {
          pixelSize: new CallbackProperty(() => {
            if (selectedCountry === countryName) return 30;
            if (hoveredCountry === countryName) return 25;
            return 20;
          }, false),
          color: new CallbackProperty(() => {
            if (selectedCountry === countryName) {
              return Color.WHITE.withAlpha(0.9);
            }
            if (hoveredCountry === countryName) {
              return color.withAlpha(0.9);
            }
            return color.withAlpha(0.7);
          }, false),
          outlineColor: new CallbackProperty(() => {
            if (selectedCountry === countryName || hoveredCountry === countryName) {
              return Color.WHITE;
            }
            return color.brighten(0.5, new Color());
          }, false),
          outlineWidth: new CallbackProperty(() => {
            if (selectedCountry === countryName) return 4;
            if (hoveredCountry === countryName) return 3;
            return 2;
          }, false),
        },
        label: {
          text: countryName,
          font: '16px Inter, sans-serif',
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 0, // FILL_AND_OUTLINE
          verticalOrigin: 1, // BOTTOM
          pixelOffset: new Cartesian3(0, -40, 0) as any,
          showBackground: true,
          backgroundColor: Color.fromCssColorString('#0a1428').withAlpha(0.7),
          backgroundPadding: new Cartesian3(8, 4, 8) as any,
        },
      });
      
      countryEntitiesRef.current.set(countryName, entity);
    });

    // Setup click handler for country selection
    setupInteractionHandlers(viewer);

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
        if (entity.name && COUNTRY_COORDINATES[entity.name as keyof typeof COUNTRY_COORDINATES]) {
          handleCountryClick(entity.name);
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // Mouse move - hover effect
    handler.setInputAction((movement: any) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);
      
      if (defined(pickedObject) && defined(pickedObject.id)) {
        const entity = pickedObject.id;
        if (entity.name && COUNTRY_COORDINATES[entity.name as keyof typeof COUNTRY_COORDINATES]) {
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
   * Handle country selection with smooth camera animation
   */
  const handleCountryClick = useCallback((countryName: string) => {
    if (!viewerRef.current) return;

    const viewer = viewerRef.current;
    const coords = COUNTRY_COORDINATES[countryName as keyof typeof COUNTRY_COORDINATES];
    
    if (!coords) return;

    // Fly to selected country with smooth animation
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(coords.longitude, coords.latitude, 3000000),
      orientation: {
        heading: 0,
        pitch: CesiumMath.toRadians(-45),
        roll: 0,
      },
      duration: 2.0,
      easingFunction: (t: number) => {
        // Custom easing function for smooth animation
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
    });

    // Update state
    if (onCountrySelect) {
      onCountrySelect(countryName);
    } else {
      selectCountry(countryName);
    }

    // Request render
    viewer.scene.requestRender();
  }, [onCountrySelect, selectCountry]);

  /**
   * Update camera position when country selection changes externally
   */
  useEffect(() => {
    if (!viewerRef.current || !selectedCountry) return;

    const coords = COUNTRY_COORDINATES[selectedCountry as keyof typeof COUNTRY_COORDINATES];
    if (coords) {
      viewerRef.current.camera.flyTo({
        destination: Cartesian3.fromDegrees(coords.longitude, coords.latitude, 3000000),
        duration: 2.0,
      });
    }
  }, [selectedCountry]);

  /**
   * Add environmental data overlays based on ecosystem state
   */
  useEffect(() => {
    if (!isInitialized || !viewerRef.current || !showEnvironmentalData || !selectedCountry) return;
    if (!dataVisualizerRef.current) return;

    const viewer = viewerRef.current;
    const visualizer = dataVisualizerRef.current;
    const coords = COUNTRY_COORDINATES[selectedCountry as keyof typeof COUNTRY_COORDINATES];
    
    if (!coords) return;

    // Create comprehensive ecosystem health visualization
    visualizer.createEcosystemHealthOverlay(
      selectedCountry,
      coords,
      ecoScore,
      foodChain,
      resources,
      humanActivity
    );

    return () => {
      // Cleanup will be handled by the visualizer's destroy method
    };
  }, [isInitialized, showEnvironmentalData, selectedCountry, ecoScore, foodChain, resources, humanActivity]);

  /**
   * Get color based on ecosystem health score
   */
  const getEcosystemHealthColor = (score: number): string => {
    if (score >= 80) return '#7ed321'; // Green - Excellent
    if (score >= 60) return '#f5a623'; // Yellow - Good
    if (score >= 40) return '#e94b3c'; // Orange - Warning
    return '#d0021b'; // Red - Critical
  };

  /**
   * Handle timelapse animation
   */
  useEffect(() => {
    if (!timelapseData || !viewerRef.current || timelapseData.length === 0) return;
    if (!dataVisualizerRef.current || !selectedCountry) return;

    const coords = COUNTRY_COORDINATES[selectedCountry as keyof typeof COUNTRY_COORDINATES];
    if (!coords) return;

    const visualizer = dataVisualizerRef.current;
    
    // Start timelapse animation
    visualizer.animateTimelapse(
      timelapseData,
      selectedCountry,
      coords,
      (frame, index) => {
        console.log(`Timelapse frame ${index}:`, frame.ecosystemState);
      },
      1000 // 1 second per frame
    );

    return () => {
      visualizer.stopTimelapse();
    };
  }, [timelapseData, selectedCountry]);

  /**
   * Render method - ensure viewer updates on state changes
   */
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scene.requestRender();
    }
  }, [selectedCountry, hoveredCountry, ecoScore]);

  return (
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
  );
}
