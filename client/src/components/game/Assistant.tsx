import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { useUI } from "@/lib/stores/useUI";
import { AlertTriangle, Info, CheckCircle, X, Bot, Sparkles, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { aiService, type AIRecommendationResponse } from "@/lib/ai-service";

export default function Assistant() {
  const { foodChain, resources, humanActivity, ecoScore, scoreHistory, setFoodChain, setResources, setHumanActivity } = useEcosystem();
  const { selectedCountry } = useCountries();
  const { scoreBreakdownOpen } = useUI();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIRecommendationResponse | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showToolConfirmation, setShowToolConfirmation] = useState(false);

  if (!selectedCountry) return null;

  // Generate contextual advice based on current state
  const getAdvice = () => {
    const messages = [];

    // Check for extreme values
    if (foodChain < 20) {
      messages.push({
        type: "warning",
        message: "Predator population is too low! Prey species may overpopulate.",
        icon: AlertTriangle
      });
    } else if (foodChain > 80) {
      messages.push({
        type: "warning", 
        message: "Too many predators! Prey species are at risk of extinction.",
        icon: AlertTriangle
      });
    }

    if (resources < 30) {
      messages.push({
        type: "warning",
        message: "Natural resources are being depleted rapidly. Consider conservation measures.",
        icon: AlertTriangle
      });
    } else if (resources > 70) {
      messages.push({
        type: "info",
        message: "Good resource conservation! This supports long-term ecosystem health.",
        icon: CheckCircle
      });
    }

    if (humanActivity > 80) {
      messages.push({
        type: "warning",
        message: "High urbanization is stressing the ecosystem. Consider green spaces.",
        icon: AlertTriangle
      });
    } else if (humanActivity < 20) {
      messages.push({
        type: "info",
        message: "Low development preserves nature but may limit economic growth.",
        icon: Info
      });
    }

    // Overall score advice
    if (ecoScore > 80) {
      messages.push({
        type: "success",
        message: "Excellent ecosystem balance! You're doing great!",
        icon: CheckCircle
      });
    } else if (ecoScore < 40) {
      messages.push({
        type: "warning",
        message: "Ecosystem is under stress. Try adjusting your approach.",
        icon: AlertTriangle
      });
    }

    // Default message if no specific advice
    if (messages.length === 0) {
      messages.push({
        type: "info",
        message: "Keep monitoring your ecosystem. Small changes can have big impacts!",
        icon: Info
      });
    }

    return messages[0]; // Return the most important message
  };

  const getAIRecommendation = async (allowTools = false) => {
    setIsLoadingAI(true);
    try {
      const ecosystemState = {
        foodChain,
        resources,
        humanActivity,
        ecoScore,
        scoreHistory
      };

      const response = await aiService.getRecommendation({
        ecosystemState,
        country: selectedCountry,
        userMessage: "Please analyze my current ecosystem and provide recommendations for improvement.",
        allowTools
      });

      setAiResponse(response);
      setIsAIMode(true);

      // If there are tool calls and user hasn't confirmed yet, show confirmation
      if (response.toolCalls && response.toolCalls.length > 0 && allowTools) {
        setShowToolConfirmation(true);
      }
    } catch (error) {
      console.error('Failed to get AI recommendation:', error);
      setAiResponse({
        success: false,
        error: 'Failed to connect to AI service. Please try again.'
      });
      setIsAIMode(true);
    }
    setIsLoadingAI(false);
  };

  const applyAIRecommendations = async () => {
    if (!aiResponse?.toolCalls || aiResponse.toolCalls.length === 0) return;

    try {
      // For now, we'll simulate session ID - in a real app this would come from a session store
      const sessionId = `session_${Date.now()}`;
      
      // Apply tool calls by directly updating the ecosystem state
      for (const toolCall of aiResponse.toolCalls) {
        if (toolCall.type === 'function') {
          const { name, arguments: args } = toolCall.function;
          
          switch (name) {
            case 'adjust_food_chain':
              const newFoodChain = Math.max(0, Math.min(100, foodChain + args.change));
              setFoodChain(newFoodChain);
              break;
            case 'adjust_resources':
              const newResources = Math.max(0, Math.min(100, resources + args.change));
              setResources(newResources);
              break;
            case 'adjust_human_activity':
              const newHumanActivity = Math.max(0, Math.min(100, humanActivity + args.change));
              setHumanActivity(newHumanActivity);
              break;
          }
        }
      }
      
      setShowToolConfirmation(false);
      // Refresh AI response to show new state
      setTimeout(() => getAIRecommendation(false), 1000);
    } catch (error) {
      console.error('Failed to apply AI recommendations:', error);
    }
  };

  const advice = getAdvice();

  const getIconColor = (type: string) => {
    switch (type) {
      case "warning": return "text-yellow-400";
      case "success": return "text-green-400";
      case "info": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const getCardBorder = (type: string) => {
    switch (type) {
      case "warning": return "border-yellow-600";
      case "success": return "border-green-600";
      case "info": return "border-blue-600";
      default: return "border-gray-600";
    }
  };

  if (isMinimized) {
    return (
      <div 
        className="absolute bottom-4 pointer-events-auto transition-all duration-500 ease-out"
        style={{
          right: scoreBreakdownOpen ? `${16 + 340}px` : '16px',
        }}
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
          title="Open Eco Assistant"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="absolute bottom-20 pointer-events-auto transition-all duration-500 ease-out"
      style={{
        right: scoreBreakdownOpen ? `${16 + 340}px` : '16px',
      }}
    >
      <Card className={`bg-black/80 text-white backdrop-blur-sm w-80 ${
        isAIMode ? 'border-purple-600' : getCardBorder(advice.type)
      }`}>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {isAIMode ? (
                <Sparkles className="w-5 h-5 text-purple-400" />
              ) : (
                <advice.icon className={`w-5 h-5 ${getIconColor(advice.type)}`} />
              )}
              <span className="font-semibold text-sm">
                {isAIMode ? "EcoIsle AI Assistant" : "Eco Assistant"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {!isAIMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => getAIRecommendation(false)}
                  disabled={isLoadingAI}
                  className="h-6 w-6 p-0 hover:bg-purple-700"
                  title="Get AI recommendations"
                >
                  {isLoadingAI ? (
                    <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-purple-400" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsMinimized(true);
                  setIsAIMode(false);
                  setAiResponse(null);
                  setShowToolConfirmation(false);
                }}
                className="h-6 w-6 p-0 hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-gray-300 leading-relaxed">
            {isAIMode && aiResponse ? (
              <div className="space-y-3">
                {aiResponse.success ? (
                  <>
                    <p>{aiResponse.message}</p>
                    
                    {/* Show tool confirmation if needed */}
                    {showToolConfirmation && aiResponse.toolCalls && aiResponse.toolCalls.length > 0 && (
                      <div className="bg-purple-900/30 border border-purple-600 rounded p-3 space-y-2">
                        <div className="flex items-center gap-2 text-purple-300">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-medium text-xs">AI wants to make changes:</span>
                        </div>
                        <ul className="text-xs space-y-1 text-purple-200 ml-6">
                          {aiResponse.toolCalls.map((toolCall, index) => (
                            <li key={index}>
                              • {toolCall.function.arguments.reason}
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={applyAIRecommendations}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto"
                          >
                            Apply Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowToolConfirmation(false)}
                            className="border-purple-600 text-purple-300 hover:bg-purple-900/30 text-xs px-3 py-1 h-auto"
                          >
                            Just Advice
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => getAIRecommendation(true)}
                        disabled={isLoadingAI}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto"
                      >
                        {isLoadingAI ? "Loading..." : "Give Recommendations"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsAIMode(false);
                          setAiResponse(null);
                          setShowToolConfirmation(false);
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs px-3 py-1 h-auto"
                      >
                        Back to Tips
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <p className="text-red-300">
                      {aiResponse.error || "Failed to get AI recommendation"}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAIMode(false);
                        setAiResponse(null);
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs px-2 py-1 h-auto"
                    >
                      Back to Tips
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <p>{advice.message}</p>
                
                {/* Give recommendations button */}
                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    onClick={() => getAIRecommendation(false)}
                    disabled={isLoadingAI}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto flex items-center gap-1"
                  >
                    {isLoadingAI ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        Give Recommendations
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Country-specific tips - only show when not in AI mode */}
          {!isAIMode && (
            <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs">
              <span className="text-gray-400">💡 Tip for {selectedCountry}: </span>
              <span className="text-gray-300">
                {selectedCountry === "USA" && "Focus on reducing carbon emissions and protecting national parks."}
                {selectedCountry === "Brazil" && "Balance rainforest preservation with economic development."}
                {selectedCountry === "Norway" && "Leverage renewable energy while managing fishing quotas."}
                {selectedCountry === "Japan" && "Address urban density while protecting marine ecosystems."}
                {selectedCountry === "Kenya" && "Manage wildlife conservation with agricultural needs."}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
