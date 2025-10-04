# ⚠️ CRITICAL: AI MODEL CONFIGURATION LOCK

## DO NOT CHANGE THE AI MODEL

This document serves as a **permanent lock** on the AI model configuration for EcoIsle.

### Current AI Model Configuration

**Model**: `x-ai/grok-4-fast:free`  
**Provider**: OpenRouter  
**Configuration File**: `server/ai-service.ts`

### Why This Lock Exists

The AI model `x-ai/grok-4-fast:free` has been explicitly selected for ALL AI functions in EcoIsle. This model must remain unchanged to ensure:

1. **Consistency**: All AI features work with the same model behavior
2. **Cost Management**: The free tier model keeps operational costs low
3. **Performance**: This model has been tested and optimized for our use case
4. **Compatibility**: All prompts and tool calling are configured for this specific model

### What Is Locked

The following are **PERMANENTLY LOCKED** and must NOT be changed:

1. **Model Name**: `x-ai/grok-4-fast:free`
2. **Model Selection Logic**: Hardcoded in constructor, no environment variable override
3. **All AI Endpoints**: Must use this model exclusively

### Code Location

**Primary Configuration**:
```typescript
// File: server/ai-service.ts
class OpenRouterService {
  constructor() {
    // ⚠️ CRITICAL: DO NOT CHANGE THIS AI MODEL
    this.model = 'x-ai/grok-4-fast:free';
  }
}
```

### Files With AI Model Comments

The following files contain critical comments about the AI model that must be preserved:

- `server/ai-service.ts` - Main AI service (PRIMARY LOCK)
- `server/routes.ts` - API routes that use AI
- `server/index.ts` - Server entry point
- `client/src/lib/ai-service.ts` - Client API wrapper
- `client/src/components/game/Assistant.tsx` - AI assistant component
- `client/src/components/game/IntroBot.tsx` - Tutorial AI helper
- `client/src/App.tsx` - Main app file
- `.env.example` - Environment configuration template
- `package.json` - Project metadata
- `README.md` - Project documentation

### What Happens If You Change It?

**DO NOT**:
- Modify the model name in `server/ai-service.ts`
- Add environment variable overrides for model selection
- Use a different AI model for any feature
- Remove or modify the warning comments
- Create alternate AI services with different models

**Consequences**:
- Pull requests will be rejected
- Breaking changes to AI functionality
- Inconsistent behavior across features
- Potential cost increases
- System instability

### For Developers

If you need to modify AI functionality:

✅ **Allowed**:
- Adjust prompts and system messages
- Modify temperature or other parameters
- Add new AI features using the same model
- Improve error handling
- Enhance tool calling logic

❌ **NOT Allowed**:
- Changing the model name
- Adding model selection logic
- Using different models for different features
- Creating model override mechanisms

### Verification

To verify the AI model is correctly locked, check:

```bash
# Search for the model configuration
grep -r "x-ai/grok-4-fast:free" server/ai-service.ts

# Ensure no environment variable override
grep -r "process.env.AI_MODEL" server/ai-service.ts
# (Should show commented out or removed code)
```

### Emergency Contact

If there is a critical need to change the AI model (which should be extremely rare):

1. Create a detailed proposal explaining why
2. Document all affected components
3. Test extensively with the new model
4. Update all related comments and documentation
5. Get approval from project maintainers

---

**Last Updated**: October 1, 2025  
**Status**: LOCKED  
**Model**: x-ai/grok-4-fast:free  
**Change Permission**: DENIED

**⚠️ THIS CONFIGURATION IS PERMANENT - DO NOT MODIFY ⚠️**
