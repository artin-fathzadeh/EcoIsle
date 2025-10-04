/**
 * Advanced Gesture System for Cesium
 * Provides intelligent input detection and adaptive gesture handling
 * for trackpads, mice, and touch devices
 */

import { Viewer, ScreenSpaceEventHandler, ScreenSpaceEventType, Cartesian3, Math as CesiumMath } from 'cesium';

export interface InputCapabilities {
  hasTouch: boolean;
  hasTrackpad: boolean;
  hasMouse: boolean;
  pointerType: 'mouse' | 'touch' | 'pen';
  screenSize: 'mobile' | 'tablet' | 'desktop';
  isLowEnd: boolean;
}

export interface GestureSettings {
  rotateSpeed: number;
  panSpeed: number;
  zoomSpeed: number;
  tiltSpeed: number;
  momentum: boolean;
  dampening: number;
}

const GESTURE_CONFIGS: Record<string, GestureSettings> = {
  trackpad: {
    rotateSpeed: 2.5,
    panSpeed: 1.8,
    zoomSpeed: 1.5,
    tiltSpeed: 1.2,
    momentum: true,
    dampening: 0.95,
  },
  mouse: {
    rotateSpeed: 1.0,
    panSpeed: 1.0,
    zoomSpeed: 1.0,
    tiltSpeed: 1.0,
    momentum: false,
    dampening: 0.9,
  },
  touch: {
    rotateSpeed: 1.5,
    panSpeed: 1.3,
    zoomSpeed: 1.2,
    tiltSpeed: 1.1,
    momentum: true,
    dampening: 0.93,
  },
};

/**
 * Detect input capabilities and device type
 */
export function detectInputCapabilities(): InputCapabilities {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const userAgent = navigator.userAgent.toLowerCase();
  const isMac = userAgent.includes('mac');
  const hasTrackpad = isMac && !hasTouch;
  
  // Detect screen size
  const width = window.innerWidth;
  const screenSize = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
  
  // Detect low-end devices
  const isLowEnd = /android.*4\.|ios.*9\.|iphone.*os [89]_/i.test(userAgent) ||
    (navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false);
  
  return {
    hasTouch,
    hasTrackpad,
    hasMouse: !hasTouch,
    pointerType: hasTouch ? 'touch' : 'mouse',
    screenSize,
    isLowEnd,
  };
}

/**
 * Get gesture settings based on detected input type
 */
export function getGestureSettings(capabilities: InputCapabilities): GestureSettings {
  if (capabilities.hasTouch) {
    return GESTURE_CONFIGS.touch;
  }
  if (capabilities.hasTrackpad) {
    return GESTURE_CONFIGS.trackpad;
  }
  return GESTURE_CONFIGS.mouse;
}

/**
 * Advanced Gesture Controller for Cesium
 */
export class CesiumGestureController {
  private viewer: Viewer;
  private capabilities: InputCapabilities;
  private settings: GestureSettings;
  private handler: ScreenSpaceEventHandler | null = null;
  private lastClickTime = 0;
  private isCtrlPressed = false;
  private isShiftPressed = false;
  private isCmdPressed = false;

  constructor(viewer: Viewer) {
    this.viewer = viewer;
    this.capabilities = detectInputCapabilities();
    this.settings = getGestureSettings(this.capabilities);
    this.initialize();
  }

  private initialize() {
    this.setupKeyboardListeners();
    this.configureCamera();
    this.setupGestureHandlers();
    this.setupConflictResolution();
  }

  /**
   * Setup keyboard event listeners for modifier keys
   */
  private setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      this.isCtrlPressed = e.ctrlKey;
      this.isShiftPressed = e.shiftKey;
      this.isCmdPressed = e.metaKey;
    });

    window.addEventListener('keyup', (e) => {
      this.isCtrlPressed = e.ctrlKey;
      this.isShiftPressed = e.shiftKey;
      this.isCmdPressed = e.metaKey;
    });
  }

  /**
   * Configure camera with adaptive settings
   */
  private configureCamera() {
    const controller = this.viewer.scene.screenSpaceCameraController;
    
    // Enable all input types
    controller.enableInputs = true;
    controller.enableLook = true;
    controller.enableRotate = true;
    controller.enableTilt = true;
    controller.enableTranslate = true;
    controller.enableZoom = true;
    
    // Apply momentum settings
    controller.inertiaSpin = this.settings.momentum ? this.settings.dampening : 0;
    controller.inertiaTranslate = this.settings.momentum ? this.settings.dampening : 0;
    controller.inertiaZoom = this.settings.momentum ? this.settings.dampening : 0;
    
    // Set zoom limits
    controller.minimumZoomDistance = 1000000; // 1,000 km
    controller.maximumZoomDistance = 50000000; // 50,000 km
    
    // Enable collision detection
    controller.enableCollisionDetection = true;
  }

  /**
   * Setup custom gesture handlers
   */
  private setupGestureHandlers() {
    if (this.handler) {
      this.handler.destroy();
    }

    this.handler = new ScreenSpaceEventHandler(this.viewer.scene.canvas);

    // Override wheel event for better zoom control
    this.handler.setInputAction((wheelEvent: any) => {
      const delta = wheelEvent;
      this.handleSmartZoom(delta > 0 ? 1 : -1);
    }, ScreenSpaceEventType.WHEEL);

    // Add touch-specific handlers if needed
    if (this.capabilities.hasTouch) {
      this.setupTouchGestures();
    }
  }

  /**
   * Setup touch-specific gestures
   */
  private setupTouchGestures() {
    if (!this.handler) return;

    let lastTouchTime = 0;

    // Double tap to zoom
    this.handler.setInputAction((event: any) => {
      const currentTime = Date.now();
      if (currentTime - lastTouchTime < 300) {
        // Double tap detected
        this.smartZoomToPosition(event.position);
      }
      lastTouchTime = currentTime;
    }, ScreenSpaceEventType.LEFT_DOWN);
  }

  /**
   * Smart zoom with context awareness
   */
  private handleSmartZoom(direction: number) {
    const camera = this.viewer.camera;
    const currentHeight = camera.positionCartographic.height;
    
    let zoomFactor: number;
    if (currentHeight > 10000000) {
      zoomFactor = 0.5;
    } else if (currentHeight > 1000000) {
      zoomFactor = 0.7;
    } else if (currentHeight > 100000) {
      zoomFactor = 0.85;
    } else {
      zoomFactor = 0.9;
    }

    const targetHeight = direction > 0 
      ? Math.max(currentHeight * zoomFactor, 10000)
      : Math.min(currentHeight / zoomFactor, 50000000);
    
    const zoomAmount = currentHeight - targetHeight;
    
    if (direction > 0) {
      camera.zoomIn(Math.abs(zoomAmount));
    } else {
      camera.zoomOut(Math.abs(zoomAmount));
    }
    
    this.viewer.scene.requestRender();
  }

  /**
   * Smart zoom to a specific position
   */
  private smartZoomToPosition(position: any) {
    const ray = this.viewer.camera.getPickRay(position);
    if (!ray) return;

    const intersection = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    if (!intersection) return;

    this.viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        CesiumMath.toDegrees(this.viewer.camera.positionCartographic.longitude),
        CesiumMath.toDegrees(this.viewer.camera.positionCartographic.latitude),
        this.viewer.camera.positionCartographic.height * 0.5
      ),
      duration: 1.0,
    });
  }

  /**
   * Setup conflict resolution to prevent camera errors
   */
  private setupConflictResolution() {
    // Prevent accidental double-click zoom when selecting countries
    this.viewer.cesiumWidget.canvas.addEventListener('click', (event) => {
      const currentTime = Date.now();
      if (currentTime - this.lastClickTime < 300) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      this.lastClickTime = currentTime;
    });

    // Add camera boundary checks
    this.viewer.camera.changed.addEventListener(() => {
      this.validateCameraPosition();
    });
  }

  /**
   * Validate and correct camera position to prevent errors
   */
  private validateCameraPosition() {
    const cartographic = this.viewer.camera.positionCartographic;
    
    if (!cartographic) return;

    // Check for invalid values
    if (!isFinite(cartographic.height) || 
        !isFinite(cartographic.latitude) || 
        !isFinite(cartographic.longitude)) {
      console.warn('Invalid camera position detected, resetting...');
      this.resetCameraToSafePosition();
      return;
    }

    // Prevent camera from going too close or too far
    if (cartographic.height < 1000) {
      this.viewer.camera.zoomOut(1000 - cartographic.height);
    } else if (cartographic.height > 50000000) {
      this.viewer.camera.zoomIn(cartographic.height - 50000000);
    }
  }

  /**
   * Reset camera to safe position
   */
  public resetCameraToSafePosition(level: 'default' | 'focused' = 'default') {
    const positions = {
      default: {
        destination: Cartesian3.fromDegrees(0, 20, 20000000),
        orientation: {
          heading: 0,
          pitch: CesiumMath.toRadians(-45),
          roll: 0,
        },
      },
      focused: {
        destination: Cartesian3.fromDegrees(0, 20, 8000000),
        orientation: {
          heading: 0,
          pitch: CesiumMath.toRadians(-30),
          roll: 0,
        },
      },
    };

    this.viewer.camera.flyTo({
      ...positions[level],
      duration: 1.5,
    });
  }

  /**
   * Zoom in with smart behavior
   */
  public smartZoomIn() {
    this.handleSmartZoom(1);
  }

  /**
   * Zoom out with smart behavior
   */
  public smartZoomOut() {
    this.handleSmartZoom(-1);
  }

  /**
   * Toggle 3D tilt mode
   */
  public toggle3DTilt() {
    const camera = this.viewer.camera;
    const currentPitch = CesiumMath.toDegrees(camera.pitch);
    
    const targetPitch = Math.abs(currentPitch + 90) < 10 
      ? -30  // If at top view, go to tilted
      : -90; // If tilted, go to top view

    this.viewer.camera.flyTo({
      destination: camera.position,
      orientation: {
        heading: camera.heading,
        pitch: CesiumMath.toRadians(targetPitch),
        roll: camera.roll,
      },
      duration: 1.0,
    });
  }

  /**
   * Get current capabilities
   */
  public getCapabilities(): InputCapabilities {
    return this.capabilities;
  }

  /**
   * Cleanup
   */
  public destroy() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
  }
}

/**
 * Sanitize vector to prevent NaN errors
 */
export function sanitizeVector(vector: Cartesian3): Cartesian3 {
  if (!vector || 
      !isFinite(vector.x) || !isFinite(vector.y) || !isFinite(vector.z) ||
      (vector.x === 0 && vector.y === 0 && vector.z === 0)) {
    return Cartesian3.clone(Cartesian3.UNIT_Z);
  }
  return vector;
}

/**
 * Safe camera update with validation
 */
export function updateCameraSafely(
  viewer: Viewer,
  position: Cartesian3,
  direction: Cartesian3
): boolean {
  try {
    const safePosition = sanitizeVector(position);
    const safeDirection = sanitizeVector(direction);
    
    if (Cartesian3.magnitude(safePosition) < 1000) {
      console.warn('Camera too close to globe center, rejecting update');
      return false;
    }
    
    viewer.camera.setView({
      destination: safePosition,
      orientation: {
        direction: safeDirection,
        up: Cartesian3.UNIT_Z,
      },
    });
    return true;
  } catch (error) {
    console.warn('Camera update failed:', error);
    return false;
  }
}
