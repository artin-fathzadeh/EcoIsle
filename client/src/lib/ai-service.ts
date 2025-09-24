interface EcosystemState {
  foodChain: number;
  resources: number;
  humanActivity: number;
  ecoScore: number;
  scoreHistory?: number[];
}

interface AIRecommendationRequest {
  ecosystemState: EcosystemState;
  country: string;
  userMessage?: string;
  allowTools?: boolean;
}

interface AIRecommendationResponse {
  success: boolean;
  message?: string;
  toolCalls?: any[];
  error?: string;
}

interface ApplyToolsResponse {
  success: boolean;
  appliedChanges?: any[];
  currentState?: EcosystemState;
  error?: string;
}

class AIService {
  private baseUrl = '/api/ai';

  async getRecommendation(request: AIRecommendationRequest): Promise<AIRecommendationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`
        };
      }

      return await response.json();
    } catch (error) {
      console.error('AI service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }    
  }

  async applyToolCalls(sessionId: string, toolCalls: any[]): Promise<ApplyToolsResponse> {
    try {
      const response = await fetch('/api/ai/apply-tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, toolCalls })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}`
        };
      }

      return await response.json();
    } catch (error) {
      console.error('AI tool application error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Helper method to create context-aware prompts for different parts of the app
  createContextualPrompt(context: string, additionalInfo?: string): string {
    const prompts: { [key: string]: string } = {
      'intro': 'Explain the basics of ecosystem management in EcoIsle to a new player. Focus on the three main variables and how they interact.',
      'country_selection': 'Help me understand the unique ecological challenges and opportunities for this country in the EcoIsle simulation.',
      'card_game': 'Provide strategic advice for the EcoIsle card game mode, focusing on optimal card play for ecosystem balance.',
      'tutorial': 'Guide me through this step of the EcoIsle tutorial, explaining the ecological concepts clearly.',
      'general': 'Analyze my current ecosystem state and provide expert recommendations.'
    };

    const basePrompt = prompts[context] || prompts['general'];
    return additionalInfo ? `${basePrompt} Additional context: ${additionalInfo}` : basePrompt;
  }
}

export const aiService = new AIService();
export type { AIRecommendationRequest, AIRecommendationResponse, ApplyToolsResponse, EcosystemState };