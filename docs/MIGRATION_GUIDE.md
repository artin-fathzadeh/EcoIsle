# Migration Guide: Three.js to Cesium

## Overview

This guide helps you understand the differences between the Three.js and Cesium implementations and how to work with both.

## Key Differences

### Architecture

| Aspect | Three.js (Old) | Cesium (New) |
|--------|---------------|--------------|
| **Component** | `WorldMap.tsx` | `CesiumMap.tsx` + `CesiumWorldMap.tsx` |
| **Rendering** | React Three Fiber | Native Cesium Viewer |
| **Countries** | Manual 3D blocks | Real-world coordinates |
| **Ocean** | Mesh plane | Globe with actual oceans |
| **Camera** | OrbitControls | Cesium Camera Controller |
| **Lighting** | Three.js lights | Globe lighting + atmosphere |

### Code Comparison

#### Country Selection (Three.js)
```tsx
// WorldMap.tsx
<CountryBlock
  name="USA"
  position={[-8, 0, 5]}
  color="#4a90e2"
  onClick={() => selectCountry("USA")}
  isSelected={selectedCountry === "USA"}
/>
```

#### Country Selection (Cesium)
```tsx
// CesiumMap.tsx
viewer.entities.add({
  name: "USA",
  position: Cartesian3.fromDegrees(-95.7129, 37.0902, 100000),
  point: {
    pixelSize: 20,
    color: Color.fromCssColorString("#4a90e2"),
  },
  label: {
    text: "USA",
    font: '16px Inter, sans-serif',
  },
});
```

## Migration Steps

### Step 1: Feature Flag Toggle

The easiest way to migrate is using the feature flag:

```bash
# .env file
VITE_MAP_ENGINE=cesium  # Use Cesium
# or
VITE_MAP_ENGINE=threejs  # Use Three.js
```

### Step 2: Update Imports

If creating new components that use the map:

```tsx
// Before (Three.js)
import WorldMap from './components/game/WorldMap';

// After (Cesium)
import CesiumWorldMap from './components/game/CesiumWorldMap';
```

### Step 3: Update Props (if needed)

Both components share similar interfaces, but Cesium has additional props:

```tsx
// Three.js (in Canvas)
<WorldMap />

// Cesium (standalone)
<CesiumWorldMap 
  showEnvironmentalData={true}
  enableTimelapse={false}
/>
```

### Step 4: Data Visualization

Three.js had no built-in data visualization. Cesium provides comprehensive overlays:

```tsx
// New capability in Cesium
import { EnvironmentalDataVisualizer } from '@/lib/cesiumDataVisualizer';

const visualizer = new EnvironmentalDataVisualizer(viewer);
visualizer.addDataLayer({
  type: 'biodiversity',
  intensity: 75,
  coordinates: { longitude: -95.7129, latitude: 37.0902, radius: 500000 }
}, 'USA');
```

## Backward Compatibility

### Both Engines Available

The app supports both engines simultaneously via feature flags:
- Old Three.js code remains functional
- New Cesium code runs in parallel
- Switch between them without code changes

### No Breaking Changes

All existing functionality works with Cesium:
- Country selection
- State management (Zustand stores)
- UI components
- Game modes
- AI assistant integration

## Feature Parity

| Feature | Three.js | Cesium | Notes |
|---------|----------|--------|-------|
| Country Selection | ✅ | ✅ | Cesium uses real coordinates |
| Hover Effects | ✅ | ✅ | Cesium has smoother animations |
| Camera Controls | ✅ | ✅ | Cesium has more natural rotation |
| Mobile Support | ⚠️ Basic | ✅ Full | Cesium is optimized |
| Data Overlays | ❌ | ✅ | New in Cesium |
| Timelapse | ❌ | ✅ | New in Cesium |
| Performance | Good | Better | Cesium uses LOD |

## Common Issues

### Issue 1: Cesium Assets Not Loading

**Solution:**
```bash
npm install cesium vite-plugin-cesium
```

Ensure `vite.config.ts` has the Cesium plugin:
```typescript
import cesium from 'vite-plugin-cesium';

export default defineConfig({
  plugins: [react(), cesium()],
});
```

### Issue 2: Three.js Still Showing

**Solution:** Check your `.env` file:
```bash
VITE_MAP_ENGINE=cesium
```

Then restart the dev server:
```bash
npm run dev
```

### Issue 3: TypeScript Errors

**Solution:** Cesium types are included. Run:
```bash
npm run check
```

If errors persist, check that imports are correct.

### Issue 4: Performance Problems

**Solution:** Enable performance mode:
```typescript
// In featureFlags.ts
HIGH_PERFORMANCE_MODE: true
```

Or use Three.js as fallback:
```bash
VITE_MAP_ENGINE=threejs
```

## Testing Both Engines

You can test both engines in development:

```bash
# Terminal 1 - Test Cesium
VITE_MAP_ENGINE=cesium npm run dev

# Terminal 2 - Test Three.js  
VITE_MAP_ENGINE=threejs npm run dev
```

## Gradual Migration

You don't need to migrate everything at once:

### Phase 1: Evaluation (Current)
- Both engines available
- Feature flag controls which is used
- Test Cesium in development

### Phase 2: Soft Launch
- Cesium as default for new users
- Three.js available as fallback
- Monitor performance and feedback

### Phase 3: Full Migration
- Cesium as primary engine
- Three.js removed or deprecated
- All features migrated

## API Differences

### Camera Control

```tsx
// Three.js - OrbitControls
<OrbitControls
  enablePan={true}
  enableZoom={true}
  enableRotate={true}
/>

// Cesium - Screen Space Camera Controller
const controller = scene.screenSpaceCameraController;
controller.enableRotate = true;
controller.enableTranslate = true;
controller.enableZoom = true;
```

### Animation

```tsx
// Three.js - useFrame hook
useFrame((state) => {
  meshRef.current.rotation.y += 0.01;
});

// Cesium - Entity properties with CallbackProperty
entity.point.pixelSize = new CallbackProperty(() => {
  return selectedCountry === name ? 30 : 20;
}, false);
```

### Event Handling

```tsx
// Three.js - React events
<mesh onClick={handleClick} onPointerEnter={handleHover} />

// Cesium - ScreenSpaceEventHandler
const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction((movement) => {
  const pickedObject = viewer.scene.pick(movement.position);
  // Handle click
}, ScreenSpaceEventType.LEFT_CLICK);
```

## Best Practices

### 1. Use Feature Flags
```typescript
import { getFeatureValue } from '@/lib/featureFlags';
const mapEngine = getFeatureValue('MAP_ENGINE');
```

### 2. Clean Up Resources
```tsx
useEffect(() => {
  // Setup
  const visualizer = new EnvironmentalDataVisualizer(viewer);
  
  return () => {
    // Cleanup
    visualizer.destroy();
  };
}, [viewer]);
```

### 3. Handle WebGL Fallbacks
```tsx
{webglSupported ? (
  mapEngine === 'cesium' ? <CesiumWorldMap /> : <WorldMap />
) : (
  <FallbackWorldMap />
)}
```

### 4. TypeScript Types
```typescript
import type { Viewer } from 'cesium';
import type { TimelapseFrame } from '@/lib/cesiumDataVisualizer';

const viewerRef = useRef<Viewer | null>(null);
```

## Performance Tips

### Cesium Optimization

1. **Request Render Mode**: Only render when needed
```typescript
viewer.scene.requestRenderMode = true;
```

2. **LOD Management**: Adjust level of detail
```typescript
viewer.scene.globe.maximumScreenSpaceError = 2;
```

3. **Tile Caching**: Enable tile caching
```typescript
viewer.scene.globe.tileCacheSize = 1000;
```

### Three.js Optimization

1. **Reduce Polygon Count**: Use simpler geometries
2. **Texture Compression**: Use compressed textures
3. **Object Pooling**: Reuse objects

## Support

- **Issues**: Create GitHub issue with `[Cesium]` or `[Three.js]` tag
- **Questions**: Check `docs/CESIUM_INTEGRATION.md`
- **Examples**: See `docs/CESIUM_EXAMPLES.tsx`

## Conclusion

The migration to Cesium is designed to be seamless with zero breaking changes. Both engines coexist peacefully, allowing gradual adoption and easy rollback if needed.

**Recommendation**: Use Cesium for new features, keep Three.js as fallback.
