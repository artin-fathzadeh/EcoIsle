/**
 * Feature Flags for EcoIsle
 * 
 * Centralized configuration for enabling/disabling features
 */

export const FEATURE_FLAGS = {
  // Map rendering engine: 'threejs' | 'cesium'
  MAP_ENGINE: (import.meta.env.VITE_MAP_ENGINE || 'cesium') as 'threejs' | 'cesium',
  
  // Enable Cesium environmental data overlays
  CESIUM_ENVIRONMENTAL_DATA: true,
  
  // Enable Cesium timelapse animations
  CESIUM_TIMELAPSE: true,
  
  // Performance mode
  HIGH_PERFORMANCE_MODE: false,
  
  // Debug mode
  DEBUG_MODE: import.meta.env.DEV,
} as const;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature] as boolean;
}

/**
 * Get feature value
 */
export function getFeatureValue<K extends keyof typeof FEATURE_FLAGS>(
  feature: K
): typeof FEATURE_FLAGS[K] {
  return FEATURE_FLAGS[feature];
}

/**
 * Log feature status (development only)
 */
if (FEATURE_FLAGS.DEBUG_MODE) {
  console.log('🚀 EcoIsle Feature Flags:', FEATURE_FLAGS);
}
