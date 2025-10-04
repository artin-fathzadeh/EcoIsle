/**
 * Environmental Data Visualization System for Cesium Map
 * 
 * This module provides utilities for visualizing ecosystem data on the Cesium globe:
 * - Heatmap generation for various environmental metrics
 * - Dynamic overlay management
 * - Real-time data synchronization
 * - Timelapse animation support
 */

import {
  Viewer,
  Color,
  Cartesian3,
  Entity,
  EllipseGraphics,
  ColorMaterialProperty,
  ConstantProperty,
  CallbackProperty,
  Rectangle,
  ImageMaterialProperty,
} from 'cesium';

export interface EnvironmentalDataLayer {
  type: 'biodiversity' | 'resources' | 'pollution' | 'urbanization' | 'vegetation';
  intensity: number; // 0-100
  coordinates: {
    longitude: number;
    latitude: number;
    radius: number; // in meters
  };
}

export interface TimelapseFrame {
  timestamp: number;
  ecosystemState: {
    foodChain: number;
    resources: number;
    humanActivity: number;
    ecoScore: number;
  };
  visualData?: {
    vegetationDensity?: Float32Array;
    urbanization?: Float32Array;
    waterQuality?: Float32Array;
    biodiversity?: Float32Array;
  };
}

/**
 * Color palettes for different data types
 */
export const DATA_COLOR_PALETTES = {
  biodiversity: {
    high: '#7ed321',
    medium: '#f5a623',
    low: '#e94b3c',
  },
  resources: {
    abundant: '#50e3c2',
    moderate: '#4a90e2',
    scarce: '#8b63c5',
  },
  pollution: {
    clean: '#7ed321',
    moderate: '#f5a623',
    polluted: '#e94b3c',
  },
  urbanization: {
    urban: '#9b9b9b',
    suburban: '#b8b8b8',
    rural: '#7ed321',
  },
  vegetation: {
    dense: '#2d7a2d',
    moderate: '#7ed321',
    sparse: '#c4a747',
  },
};

/**
 * Environmental Data Visualizer Class
 */
export class EnvironmentalDataVisualizer {
  private viewer: Viewer;
  private dataEntities: Map<string, Entity> = new Map();
  private animationHandle: number | null = null;

  constructor(viewer: Viewer) {
    this.viewer = viewer;
  }

  /**
   * Add environmental data overlay
   */
  addDataLayer(layer: EnvironmentalDataLayer, countryName: string): Entity | null {
    const { type, intensity, coordinates } = layer;
    const color = this.getColorForDataType(type, intensity);
    
    const entity = this.viewer.entities.add({
      name: `${countryName}-${type}`,
      position: Cartesian3.fromDegrees(
        coordinates.longitude,
        coordinates.latitude,
        50000
      ),
      ellipse: {
        semiMinorAxis: coordinates.radius,
        semiMajorAxis: coordinates.radius,
        material: Color.fromCssColorString(color).withAlpha(0.4),
        outline: true,
        outlineColor: Color.fromCssColorString(color).withAlpha(0.7),
        outlineWidth: 2,
        height: 50000,
      },
    });

    const key = `${countryName}-${type}`;
    this.dataEntities.set(key, entity);
    
    return entity;
  }

  /**
   * Remove data layer
   */
  removeDataLayer(countryName: string, type: string): void {
    const key = `${countryName}-${type}`;
    const entity = this.dataEntities.get(key);
    
    if (entity) {
      this.viewer.entities.remove(entity);
      this.dataEntities.delete(key);
    }
  }

  /**
   * Update existing data layer
   */
  updateDataLayer(
    countryName: string,
    type: string,
    intensity: number
  ): void {
    const key = `${countryName}-${type}`;
    const entity = this.dataEntities.get(key);
    
    if (entity && entity.ellipse) {
      const color = this.getColorForDataType(type as any, intensity);
      entity.ellipse.material = new ColorMaterialProperty(
        Color.fromCssColorString(color).withAlpha(0.4)
      );
      entity.ellipse.outlineColor = new ConstantProperty(
        Color.fromCssColorString(color).withAlpha(0.7)
      );
    }
  }

  /**
   * Clear all data layers
   */
  clearAllLayers(): void {
    this.dataEntities.forEach(entity => {
      this.viewer.entities.remove(entity);
    });
    this.dataEntities.clear();
  }

  /**
   * Get appropriate color based on data type and intensity
   */
  private getColorForDataType(
    type: EnvironmentalDataLayer['type'],
    intensity: number
  ): string {
    switch (type) {
      case 'biodiversity':
      case 'resources':
      case 'vegetation': {
        const palette = DATA_COLOR_PALETTES[type];
        if (intensity >= 70) return Object.values(palette)[0];
        if (intensity >= 40) return Object.values(palette)[1];
        return Object.values(palette)[2];
      }
      
      case 'pollution': {
        const palette = DATA_COLOR_PALETTES.pollution;
        if (intensity <= 30) return palette.clean;
        if (intensity <= 60) return palette.moderate;
        return palette.polluted;
      }
      
      case 'urbanization': {
        const palette = DATA_COLOR_PALETTES.urbanization;
        if (intensity >= 70) return palette.urban;
        if (intensity >= 40) return palette.suburban;
        return palette.rural;
      }
      
      default:
        return '#4a90e2';
    }
  }

  /**
   * Create ecosystem health visualization for a country
   */
  createEcosystemHealthOverlay(
    countryName: string,
    coords: { longitude: number; latitude: number },
    ecoScore: number,
    foodChain: number,
    resources: number,
    humanActivity: number
  ): void {
    // Remove existing overlay
    this.removeDataLayer(countryName, 'health');

    // Create multiple concentric circles representing different metrics
    const baseRadius = 400000;

    // Outer ring - Overall health
    this.viewer.entities.add({
      name: `${countryName}-health-outer`,
      position: Cartesian3.fromDegrees(coords.longitude, coords.latitude, 30000),
      ellipse: {
        semiMinorAxis: baseRadius,
        semiMajorAxis: baseRadius,
        material: this.getHealthColor(ecoScore).withAlpha(0.2),
        outline: true,
        outlineColor: this.getHealthColor(ecoScore),
        outlineWidth: 3,
      },
    });

    // Inner rings - Individual metrics
    const metrics = [
      { value: foodChain, radius: baseRadius * 0.7, name: 'foodChain' },
      { value: resources, radius: baseRadius * 0.5, name: 'resources' },
      { value: humanActivity, radius: baseRadius * 0.3, name: 'humanActivity' },
    ];

    metrics.forEach(metric => {
      this.viewer.entities.add({
        name: `${countryName}-health-${metric.name}`,
        position: Cartesian3.fromDegrees(coords.longitude, coords.latitude, 25000),
        ellipse: {
          semiMinorAxis: metric.radius,
          semiMajorAxis: metric.radius,
          material: this.getHealthColor(metric.value).withAlpha(0.15),
          outline: true,
          outlineColor: this.getHealthColor(metric.value).withAlpha(0.6),
          outlineWidth: 2,
        },
      });
    });
  }

  /**
   * Get color based on health value
   */
  private getHealthColor(value: number): Color {
    if (value >= 80) return Color.fromCssColorString('#7ed321');
    if (value >= 60) return Color.fromCssColorString('#f5a623');
    if (value >= 40) return Color.fromCssColorString('#e94b3c');
    return Color.fromCssColorString('#d0021b');
  }

  /**
   * Animate timelapse data
   */
  animateTimelapse(
    frames: TimelapseFrame[],
    countryName: string,
    coords: { longitude: number; latitude: number },
    onFrameChange?: (frame: TimelapseFrame, index: number) => void,
    speed: number = 1000
  ): void {
    // Stop any existing animation
    this.stopTimelapse();

    let currentFrame = 0;

    const animate = () => {
      if (currentFrame >= frames.length) {
        currentFrame = 0; // Loop
      }

      const frame = frames[currentFrame];
      
      // Update visualization
      this.createEcosystemHealthOverlay(
        countryName,
        coords,
        frame.ecosystemState.ecoScore,
        frame.ecosystemState.foodChain,
        frame.ecosystemState.resources,
        frame.ecosystemState.humanActivity
      );

      // Callback
      if (onFrameChange) {
        onFrameChange(frame, currentFrame);
      }

      currentFrame++;
      this.animationHandle = window.setTimeout(animate, speed);
    };

    animate();
  }

  /**
   * Stop timelapse animation
   */
  stopTimelapse(): void {
    if (this.animationHandle !== null) {
      window.clearTimeout(this.animationHandle);
      this.animationHandle = null;
    }
  }

  /**
   * Create particle effects for dynamic elements
   */
  createParticleEffect(
    type: 'migration' | 'pollution' | 'weather',
    start: { longitude: number; latitude: number },
    end: { longitude: number; latitude: number },
    color: string = '#ffffff'
  ): void {
    // Create a path showing movement/flow
    const positions = [
      Cartesian3.fromDegrees(start.longitude, start.latitude, 100000),
      Cartesian3.fromDegrees(end.longitude, end.latitude, 100000),
    ];

    this.viewer.entities.add({
      name: `particle-${type}`,
      polyline: {
        positions: positions,
        width: 3,
        material: Color.fromCssColorString(color).withAlpha(0.6),
        clampToGround: false,
      },
    });
  }

  /**
   * Add information annotation at specific location
   */
  addAnnotation(
    coords: { longitude: number; latitude: number },
    text: string,
    description?: string
  ): Entity {
    return this.viewer.entities.add({
      name: 'annotation',
      position: Cartesian3.fromDegrees(coords.longitude, coords.latitude, 100000),
      point: {
        pixelSize: 15,
        color: Color.fromCssColorString('#4a90e2'),
        outlineColor: Color.WHITE,
        outlineWidth: 2,
      },
      label: {
        text: text,
        font: '14px Inter, sans-serif',
        fillColor: Color.WHITE,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        style: 0,
        verticalOrigin: 1,
        pixelOffset: new Cartesian3(0, -20, 0) as any,
        showBackground: true,
        backgroundColor: Color.fromCssColorString('#0a1428').withAlpha(0.8),
        backgroundPadding: new Cartesian3(6, 4, 6) as any,
      },
      description: description,
    });
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stopTimelapse();
    this.clearAllLayers();
  }
}

/**
 * Utility: Generate sample environmental data for testing
 */
export function generateSampleEnvironmentalData(
  countryCoords: { longitude: number; latitude: number }
): EnvironmentalDataLayer[] {
  const types: EnvironmentalDataLayer['type'][] = [
    'biodiversity',
    'resources',
    'pollution',
    'urbanization',
    'vegetation',
  ];

  return types.map(type => ({
    type,
    intensity: Math.random() * 100,
    coordinates: {
      longitude: countryCoords.longitude + (Math.random() - 0.5) * 5,
      latitude: countryCoords.latitude + (Math.random() - 0.5) * 5,
      radius: 200000 + Math.random() * 300000,
    },
  }));
}

/**
 * Utility: Generate sample timelapse data
 */
export function generateSampleTimelapseData(
  baseState: {
    foodChain: number;
    resources: number;
    humanActivity: number;
    ecoScore: number;
  },
  frames: number = 10
): TimelapseFrame[] {
  const data: TimelapseFrame[] = [];
  const startTime = Date.now();

  for (let i = 0; i < frames; i++) {
    const progress = i / frames;
    
    data.push({
      timestamp: startTime + i * 1000,
      ecosystemState: {
        foodChain: baseState.foodChain + (Math.random() - 0.5) * 20,
        resources: baseState.resources - progress * 10,
        humanActivity: baseState.humanActivity + progress * 15,
        ecoScore: baseState.ecoScore - progress * 5,
      },
    });
  }

  return data;
}
