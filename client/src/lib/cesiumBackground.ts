/**
 * Advanced Background and Atmosphere System for Cesium
 * Creates immersive space backgrounds and atmospheric effects
 */

import { Viewer, Color, ParticleSystem, Cartesian3, Matrix4, SkyBox } from 'cesium';

export interface BackgroundOptions {
  type: 'starfield' | 'aurora' | 'nebula' | 'gradient';
  animated: boolean;
  intensity: number;
}

/**
 * Create canvas-based starfield texture
 */
function createStarfieldCanvas(size: number = 512): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark space background with blue tint
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, '#0a1428');
  gradient.addColorStop(0.5, '#0d1833');
  gradient.addColorStop(1, '#05080f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Generate stars
  const starCount = 200;
  for (let i = 0; i < starCount; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = Math.random() * 1.5;
    const brightness = Math.random();

    // Star color - mostly white with some blue/yellow tint
    const colorChoice = Math.random();
    let starColor: string;
    if (colorChoice < 0.7) {
      starColor = `rgba(255, 255, 255, ${brightness})`;
    } else if (colorChoice < 0.85) {
      starColor = `rgba(200, 220, 255, ${brightness})`; // Blue stars
    } else {
      starColor = `rgba(255, 240, 200, ${brightness})`; // Yellow stars
    }

    // Draw star with glow
    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
    glowGradient.addColorStop(0, starColor);
    glowGradient.addColorStop(0.5, starColor.replace(/[\d.]+\)/, '0.3)'));
    glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Bright center
    ctx.fillStyle = starColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add some nebula-like clouds
  for (let i = 0; i < 5; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const radius = 50 + Math.random() * 100;
    const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    
    // Random nebula colors (blue/purple/pink)
    const nebulaColors = [
      'rgba(100, 150, 255, 0.05)',
      'rgba(150, 100, 255, 0.05)',
      'rgba(255, 100, 150, 0.03)',
    ];
    const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
    
    nebulaGradient.addColorStop(0, color);
    nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = nebulaGradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

/**
 * Create dynamic starfield skybox
 */
export function createStarfieldSkyBox(viewer: Viewer, animated: boolean = true): void {
  try {
    // Create six faces for the skybox
    const faces = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    const canvases: Record<string, HTMLCanvasElement> = {};
    
    faces.forEach(face => {
      canvases[face] = createStarfieldCanvas(512);
    });

    // Create skybox from canvases
    const skyBox = new SkyBox({
      sources: {
        positiveX: canvases.px.toDataURL(),
        negativeX: canvases.nx.toDataURL(),
        positiveY: canvases.py.toDataURL(),
        negativeY: canvases.ny.toDataURL(),
        positiveZ: canvases.pz.toDataURL(),
        negativeZ: canvases.nz.toDataURL(),
      },
    });

    viewer.scene.skyBox = skyBox;
    viewer.scene.skyBox.show = true;

    // Add subtle animation if requested
    if (animated) {
      let time = 0;
      viewer.scene.preRender.addEventListener(() => {
        time += 0.0001;
        // Very subtle rotation to give sense of movement
        if (viewer.scene.skyBox) {
          // Skybox doesn't have direct rotation, but we can update textures
          // For now, keep static but could implement texture rotation
        }
      });
    }
  } catch (error) {
    console.warn('Failed to create starfield skybox:', error);
  }
}

/**
 * Apply enhanced atmosphere with dark theme
 */
export function applyDarkAtmosphere(viewer: Viewer): void {
  const scene = viewer.scene;
  const globe = scene.globe;

  // Enable atmosphere with custom settings
  globe.showGroundAtmosphere = true;
  
  if (scene.skyAtmosphere) {
    // Adjust atmosphere colors for dark theme
    scene.skyAtmosphere.hueShift = 0.1; // Slight blue shift
    scene.skyAtmosphere.saturationShift = -0.2; // Less saturated
    scene.skyAtmosphere.brightnessShift = -0.3; // Darker
  }

  // Configure globe lighting
  globe.enableLighting = false; // Disable sun lighting for consistent dark theme
  globe.dynamicAtmosphereLighting = false;
  globe.dynamicAtmosphereLightingFromSun = false;

  // Set ambient light for visibility
  scene.light.intensity = 1.5; // Slightly brighter ambient light
}

/**
 * Create aurora particle effect (optional, for special regions)
 */
export function createAuroraEffect(
  viewer: Viewer,
  position: Cartesian3,
  color: Color = Color.fromCssColorString('#50e3c2')
): ParticleSystem {
  // Create aurora particle texture
  const particleCanvas = document.createElement('canvas');
  particleCanvas.width = 32;
  particleCanvas.height = 32;
  const ctx = particleCanvas.getContext('2d')!;
  
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const particleSystem = new ParticleSystem({
    image: particleCanvas.toDataURL(),
    startColor: color.withAlpha(0.7),
    endColor: color.withAlpha(0.0),
    particleLife: 10.0,
    speed: 50.0,
    imageSize: new Cartesian3(15, 15, 0) as any,
    emissionRate: 30.0,
    lifetime: 16.0,
    modelMatrix: Matrix4.fromTranslation(position),
    emitterModelMatrix: Matrix4.fromScale(new Cartesian3(200000, 200000, 200000)),
  });

  viewer.scene.primitives.add(particleSystem);
  return particleSystem;
}

/**
 * Apply comprehensive background system
 */
export function setupAdvancedBackground(
  viewer: Viewer,
  options: BackgroundOptions = {
    type: 'starfield',
    animated: true,
    intensity: 1.0,
  }
): void {
  // Set base background color
  viewer.scene.backgroundColor = Color.fromCssColorString('#0a1428');

  // Apply starfield
  if (options.type === 'starfield') {
    createStarfieldSkyBox(viewer, options.animated);
  }

  // Apply enhanced atmosphere
  applyDarkAtmosphere(viewer);

  // Configure scene for optimal appearance
  const scene = viewer.scene;
  scene.fog.enabled = false; // Disable fog for clearer space view
  if (scene.sun) scene.sun.show = false; // Hide sun for dark theme
  if (scene.moon) scene.moon.show = false; // Hide moon
  
  // Adjust globe appearance
  scene.globe.baseColor = Color.fromCssColorString('#1a4870').withAlpha(0.8);
  scene.globe.translucency.enabled = false;
  
  // Apply intensity adjustment
  if (options.intensity !== 1.0) {
    scene.light.intensity = 1.0 + (options.intensity - 1.0) * 0.5;
  }
}

/**
 * Create animated gradient background (alternative to starfield)
 */
export function createGradientBackground(viewer: Viewer): void {
  const scene = viewer.scene;
  
  // Animated gradient background
  let time = 0;
  scene.preRender.addEventListener(() => {
    time += 0.001;
    
    // Interpolate between dark blue shades
    const r = 0.04 + Math.sin(time) * 0.02;
    const g = 0.08 + Math.sin(time * 1.3) * 0.02;
    const b = 0.16 + Math.sin(time * 0.7) * 0.04;
    
    scene.backgroundColor = new Color(r, g, b, 1.0);
  });
}

/**
 * Setup terrain-specific styling
 */
export function applyEcosystemStyling(
  viewer: Viewer,
  ecosystemType: string
): void {
  const globe = viewer.scene.globe;
  
  // Ecosystem-specific globe tinting
  const ecosystemColors: Record<string, string> = {
    rainforest: '#1a4f1a',
    desert: '#8b7355',
    arctic: '#e6f3ff',
    savanna: '#daa520',
    temperate: '#2d5a2d',
    boreal: '#2d4a2d',
    tropical: '#1a5f1a',
    maritime: '#3d5a6b',
  };

  const color = ecosystemColors[ecosystemType] || '#1a4870';
  globe.baseColor = Color.fromCssColorString(color).withAlpha(0.3);
}
