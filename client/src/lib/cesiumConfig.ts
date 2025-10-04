/**
 * Cesium Configuration for EcoIsle
 * 
 * This file contains all Cesium-specific configuration options
 * Modify these settings to customize the Cesium globe behavior
 */

export const CESIUM_CONFIG = {
  /**
   * Cesium Ion Access Token
   * Get yours from: https://ion.cesium.com/tokens
   */
  ION_TOKEN: import.meta.env.VITE_CESIUM_TOKEN || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyMzQzNi1mMzY4LTQ1YTItYTBjYS03ZDVmYTJiZDI4YWQiLCJpZCI6MjI1MjMzLCJpYXQiOjE3Mjg0ODYzMzV9.cT7VRjEpZShNnJuZwZqNxYGmVw4lHU0EyNYJKlzJYbQ',

  /**
   * Viewer Configuration
   */
  VIEWER: {
    // UI Elements (all disabled for custom integration)
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

    // Performance
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,

    // Scene
    skyBox: false,
    skyAtmosphere: false,
  },

  /**
   * Camera Configuration
   */
  CAMERA: {
    // Initial position (overview of Earth)
    initialPosition: {
      longitude: 0,
      latitude: 20,
      altitude: 20000000, // 20,000 km
    },

    // Initial orientation
    initialOrientation: {
      heading: 0,
      pitch: -45, // degrees
      roll: 0,
    },

    // Zoom limits
    minimumZoomDistance: 1000000, // 1,000 km
    maximumZoomDistance: 40000000, // 40,000 km

    // Movement parameters
    inertiaSpin: 0.9,
    inertiaTranslate: 0.9,
    inertiaZoom: 0.8,

    // Animation duration for flyTo
    flyToDuration: 2.0, // seconds

    // Camera change threshold for rendering
    percentageChanged: 0.01,
  },

  /**
   * Globe Appearance
   */
  GLOBE: {
    // Base color (ocean)
    baseColor: '#1a4870',

    // Lighting
    enableLighting: false,
    showGroundAtmosphere: true,

    // Terrain
    depthTestAgainstTerrain: false,
    
    // LOD settings
    maximumScreenSpaceError: 2, // Lower = higher quality, slower
    tileCacheSize: 1000, // Number of tiles to cache
  },

  /**
   * Scene Background & Atmosphere
   */
  SCENE: {
    // Background color (space)
    backgroundColor: '#0a1428',

    // Atmosphere adjustments (if enabled)
    atmosphere: {
      hueShift: -0.8,
      saturationShift: -0.3,
      brightnessShift: -0.5,
    },
  },

  /**
   * Imagery Configuration
   */
  IMAGERY: {
    // Base layer alpha (transparency)
    alpha: 0.3,

    // Brightness adjustment
    brightness: 0.4,

    // Contrast adjustment
    contrast: 1.0,

    // Hue adjustment
    hue: 0.0,

    // Saturation adjustment
    saturation: 1.0,

    // Gamma correction
    gamma: 1.0,
  },

  /**
   * Country Markers
   */
  COUNTRIES: {
    // Point size
    pointSize: {
      default: 20,
      hover: 25,
      selected: 30,
    },

    // Outline width
    outlineWidth: {
      default: 2,
      hover: 3,
      selected: 4,
    },

    // Label configuration
    label: {
      font: '16px Inter, sans-serif',
      fillColor: '#ffffff',
      outlineColor: '#000000',
      outlineWidth: 2,
      verticalOffset: -40, // pixels above point
      backgroundColor: '#0a1428',
      backgroundAlpha: 0.7,
      backgroundPadding: { x: 8, y: 4 },
    },

    // Animation
    enablePulse: true,
    pulseSpeed: 1.0,
  },

  /**
   * Environmental Data Overlays
   */
  OVERLAYS: {
    // Default overlay radius (meters)
    defaultRadius: 500000, // 500 km

    // Overlay alpha (transparency)
    alpha: 0.4,

    // Outline alpha
    outlineAlpha: 0.7,

    // Outline width
    outlineWidth: 2,

    // Height above ground (meters)
    height: 50000, // 50 km

    // Animation speed
    animationSpeed: 1000, // ms per frame
  },

  /**
   * Performance Optimization
   */
  PERFORMANCE: {
    // Enable/disable features based on performance
    enableHighQuality: true,
    enableShadows: false,
    enableAtmosphere: false,
    enableTerrain: false,

    // Render throttling
    targetFrameRate: 60,
    
    // Memory limits
    maxMemoryMB: 500,
  },

  /**
   * Mobile Optimization
   */
  MOBILE: {
    // Reduce quality on mobile
    reducedQuality: true,

    // Touch gesture settings
    touchSensitivity: 1.0,
    pinchSensitivity: 1.0,

    // Disable expensive features on mobile
    disableAtmosphere: true,
    disableShadows: true,
  },

  /**
   * Debug Options
   */
  DEBUG: {
    // Show FPS counter
    showFPS: import.meta.env.DEV,

    // Show memory usage
    showMemory: import.meta.env.DEV,

    // Show tile loading info
    showTiles: false,

    // Log camera position
    logCameraPosition: false,

    // Show entity bounding boxes
    showBoundingBoxes: false,
  },
} as const;

/**
 * Country coordinate database
 */
export const COUNTRY_COORDINATES = {
  'USA': { 
    longitude: -95.7129, 
    latitude: 37.0902,
    name: 'United States',
    color: '#4a90e2',
  },
  'Brazil': { 
    longitude: -47.8825, 
    latitude: -15.7939,
    name: 'Brazil',
    color: '#7ed321',
  },
  'Norway': { 
    longitude: 8.4689, 
    latitude: 60.4720,
    name: 'Norway',
    color: '#50e3c2',
  },
  'Japan': { 
    longitude: 138.2529, 
    latitude: 36.2048,
    name: 'Japan',
    color: '#f5a623',
  },
  'Kenya': { 
    longitude: 37.9062, 
    latitude: -0.0236,
    name: 'Kenya',
    color: '#e94b3c',
  },
} as const;

/**
 * Color schemes for data visualization
 */
export const DATA_COLORS = {
  // Ecosystem health
  health: {
    excellent: '#7ed321',  // 80-100
    good: '#f5a623',       // 60-79
    warning: '#e94b3c',    // 40-59
    critical: '#d0021b',   // 0-39
  },

  // Biodiversity
  biodiversity: {
    high: '#7ed321',
    medium: '#f5a623',
    low: '#e94b3c',
  },

  // Resources
  resources: {
    abundant: '#50e3c2',
    moderate: '#4a90e2',
    scarce: '#8b63c5',
  },

  // Pollution
  pollution: {
    clean: '#7ed321',
    moderate: '#f5a623',
    polluted: '#e94b3c',
  },

  // Urbanization
  urbanization: {
    urban: '#9b9b9b',
    suburban: '#b8b8b8',
    rural: '#7ed321',
  },

  // Vegetation
  vegetation: {
    dense: '#2d7a2d',
    moderate: '#7ed321',
    sparse: '#c4a747',
  },
} as const;

/**
 * Get ecosystem health color based on score
 */
export function getHealthColor(score: number): string {
  if (score >= 80) return DATA_COLORS.health.excellent;
  if (score >= 60) return DATA_COLORS.health.good;
  if (score >= 40) return DATA_COLORS.health.warning;
  return DATA_COLORS.health.critical;
}

/**
 * Get country coordinates by name
 */
export function getCountryCoordinates(countryName: string) {
  return COUNTRY_COORDINATES[countryName as keyof typeof COUNTRY_COORDINATES];
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Apply mobile optimizations
 */
export function getMobileConfig() {
  if (!isMobileDevice()) return CESIUM_CONFIG;

  return {
    ...CESIUM_CONFIG,
    GLOBE: {
      ...CESIUM_CONFIG.GLOBE,
      maximumScreenSpaceError: 4, // Lower quality
    },
    PERFORMANCE: {
      ...CESIUM_CONFIG.PERFORMANCE,
      enableHighQuality: false,
    },
  };
}
