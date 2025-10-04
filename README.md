# EcoIsle - Ecosystem Management Game

An interactive ecosystem simulation game that teaches players about ecological balance, natural selection, and environmental management through engaging gameplay.

## ⚠️ CRITICAL: AI Model Configuration

**DO NOT CHANGE THE AI MODEL**

EcoIsle uses **x-ai/grok-4-fast:free** for ALL AI functions throughout the application. This model is hardcoded in the server configuration and must NOT be changed under any circumstances.

### AI Model: x-ai/grok-4-fast:free

- **Location**: `server/ai-service.ts`
- **Usage**: All AI assistant features, recommendations, tutorial help, and ecosystem analysis
- **Status**: LOCKED - Do not modify

The AI model is configured in the OpenRouterService class and is set to `'x-ai/grok-4-fast:free'`. This configuration is NOT overridable via environment variables to ensure consistency across all deployments.

## Features

- **Advanced 3D Visualization**:
  - **Cesium 3D Globe**: Photorealistic Earth with smooth interactions (NEW!)
  - Interactive country selection with real-world geography
  - Environmental data overlays showing ecosystem health
  - Timelapse animations of ecosystem changes
  - Mobile-optimized touch gestures
  - Fallback to Three.js or 2D map for unsupported devices

- **Multiple Game Modes**:
  - Education Mode: Learn ecosystem concepts with guided tutorials
  - Card Game Mode: Strategic card-based ecosystem management
  - Endless Mode: Continuous gameplay challenges
  - Gorilla Mode: Special scenario-based gameplay

- **AI Assistant**: Powered by x-ai/grok-4-fast:free model
  - Real-time ecosystem analysis and recommendations
  - Context-aware advice for different countries
  - Interactive Q&A about game mechanics
  - Tool-based ecosystem modifications

- **Country-Specific Challenges**: 
  - USA, Brazil, Norway, Japan, and Kenya
  - Each with unique environmental challenges and starting conditions

- **Leaderboards**: Global and classroom-based scoring
- **Real-time Updates**: WebSocket-based multiplayer features

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenRouter API key to `.env`:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

   ⚠️ **IMPORTANT**: The AI model is locked to `x-ai/grok-4-fast:free` and cannot be changed via environment variables.

5. (Optional) Configure Cesium 3D Globe:
   ```
   # Choose map engine: 'cesium' (default) or 'threejs'
   VITE_MAP_ENGINE=cesium
   
   # Optional: Add your Cesium Ion token for enhanced features
   VITE_CESIUM_TOKEN=your_token_here
   ```
   
   📚 See `docs/CESIUM_QUICKSTART.md` for detailed Cesium setup

6. Run the development server:
   ```bash
   npm run dev
   ```

## AI Configuration Details

### Server-Side AI Service
File: `server/ai-service.ts`

The AI model is hardcoded:
```typescript
// ⚠️ CRITICAL: DO NOT CHANGE THIS AI MODEL - MUST USE x-ai/grok-4-fast:free
this.model = 'x-ai/grok-4-fast:free';
```

### Client-Side AI Integration
Files using AI features:
- `client/src/components/game/Assistant.tsx` - Main AI assistant
- `client/src/components/game/IntroBot.tsx` - Tutorial AI help
- `client/src/lib/ai-service.ts` - Client API wrapper

All client-side components communicate with the server AI service which uses x-ai/grok-4-fast:free exclusively.

## Technology Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **3D Graphics**: 
  - Cesium (photorealistic 3D globe) - NEW!
  - Three.js with React Three Fiber (alternative/fallback)
- **AI**: OpenRouter API with x-ai/grok-4-fast:free model (LOCKED)
- **State Management**: Zustand
- **Real-time**: WebSocket

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

See `.env.example` for all configuration options.

**Key Variables:**
- `OPENROUTER_API_KEY` - Required for AI features
- `HTTP_REFERER` - Optional HTTP referer for API requests
- `AI_TEST_MODE` - Set to 'true' for simulated AI responses (no API key needed)
- `VITE_MAP_ENGINE` - Choose 'cesium' or 'threejs' for map rendering (default: 'cesium')
- `VITE_CESIUM_TOKEN` - Optional Cesium Ion token for enhanced globe features

⚠️ **Note**: The `AI_MODEL` environment variable is NOT used. The model is hardcoded to `x-ai/grok-4-fast:free`.

## Documentation

- **Cesium Integration Guide**: `docs/CESIUM_INTEGRATION.md` - Complete technical documentation
- **Quick Start Guide**: `docs/CESIUM_QUICKSTART.md` - Get started with the 3D globe in 5 minutes
- **API Reference**: See individual component files for detailed API docs

## License

MIT

## Contributing

When contributing to this project, please note:

1. **DO NOT modify the AI model configuration** in `server/ai-service.ts`
2. The AI model MUST remain `x-ai/grok-4-fast:free` for all features
3. Any pull requests that change the AI model will be rejected
4. Comments indicating the AI model should not be changed must be preserved

---

**⚠️ FINAL REMINDER**: This application uses x-ai/grok-4-fast:free as its AI model. Do not change this configuration.
