# Quick Start Guide: Cesium 3D Globe Integration

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies (Already Done)
```bash
npm install cesium vite-plugin-cesium
```

### 2. Configure Environment (Optional)
```bash
# Copy the example env file if you don't have one
cp .env.example .env

# Edit .env and set (optional - has defaults):
VITE_MAP_ENGINE=cesium
VITE_CESIUM_TOKEN=your_token_here  # Optional, has default
```

### 3. Start Development Server
```bash
npm run dev
```

That's it! The Cesium 3D globe will now render instead of the Three.js map.

## 🎮 Features You Get

### Interactive Globe
- **Click countries** to select them
- **Drag** to rotate the globe
- **Scroll** to zoom in/out
- **Smooth animations** for all interactions

### Environmental Visualization
- **Color-coded health indicators** around countries
- **Multi-layer overlays** showing:
  - Ecosystem health (outer ring)
  - Food chain balance
  - Resource availability
  - Human activity impact

### Timelapse Animations
- Watch ecosystems evolve over time
- See the impact of your decisions
- Automatic playback during simulations

## 🔄 Switching Between Map Engines

### Use Cesium (Default)
```bash
echo "VITE_MAP_ENGINE=cesium" >> .env
```

### Use Three.js (Original)
```bash
echo "VITE_MAP_ENGINE=threejs" >> .env
```

Then restart the dev server.

## 🎨 Visual Customization

All colors match EcoIsle's theme:
- **Background**: `#0a1428` (dark blue)
- **Ocean**: `#1a4870` (medium blue)
- **Health Colors**:
  - Green: Excellent (80-100)
  - Yellow: Good (60-79)
  - Orange: Warning (40-59)
  - Red: Critical (0-39)

## 📱 Mobile Support

The Cesium globe is fully optimized for mobile:
- Touch gestures for rotation and zoom
- Responsive layout
- Optimized performance
- Fallback to 2D map if WebGL unavailable

## 🐛 Troubleshooting

### Cesium Not Loading?
1. Check console for errors
2. Verify WebGL is supported: Visit `https://get.webgl.org/`
3. Clear browser cache
4. Try different browser

### Performance Issues?
1. Close other tabs
2. Reduce browser zoom to 100%
3. Enable hardware acceleration in browser settings
4. Switch to Three.js mode if needed

### Want the Old Map Back?
Just set `VITE_MAP_ENGINE=threejs` in your `.env` file!

## 📚 Learn More

- Full documentation: `docs/CESIUM_INTEGRATION.md`
- Cesium docs: https://cesium.com/docs/
- Report issues: Create a GitHub issue

## ✨ What's Different?

| Feature | Three.js (Old) | Cesium (New) |
|---------|---------------|--------------|
| **Globe Realism** | Simplified blocks | Photorealistic globe |
| **Countries** | 5 floating blocks | Real country locations |
| **Rotation** | Fixed axis | Free rotation |
| **Data Visualization** | None | Multi-layer overlays |
| **Animations** | Basic | Advanced timelapse |
| **Mobile Support** | Basic | Optimized |
| **Performance** | Good | Excellent |

## 🎯 Next Steps

1. **Customize**: Edit colors in `CesiumMap.tsx`
2. **Add Data**: Use `EnvironmentalDataVisualizer` class
3. **Create Animations**: Add timelapse frames
4. **Extend**: Add more countries or data layers

---

**Need Help?** Check the full documentation or create an issue!
