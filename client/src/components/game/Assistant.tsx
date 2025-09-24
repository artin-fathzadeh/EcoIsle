import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { useUI } from "@/lib/stores/useUI";
import { AlertTriangle, Info, CheckCircle, X, Bot, Sparkles, AlertCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { aiService, type AIRecommendationResponse } from "@/lib/ai-service";
import { useSession } from "@/lib/stores/useSession";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function Assistant() {
  const { foodChain, resources, humanActivity, ecoScore, scoreHistory, setFoodChain, setResources, setHumanActivity } = useEcosystem();
  const { selectedCountry } = useCountries();
  const { scoreBreakdownOpen } = useUI();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIRecommendationResponse | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showToolConfirmation, setShowToolConfirmation] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { ensureSession } = useSession();
  const [selectedSuggestions, setSelectedSuggestions] = useState<Record<number, boolean>>({});
  const [userInput, setUserInput] = useState("");
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);

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

      // If tools were requested but none provided, add a fallback suggestion
      if (allowTools && response.success && (!response.toolCalls || response.toolCalls.length === 0)) {
        response.toolCalls = [{
          type: 'function',
          function: {
            name: 'adjust_resources',
            arguments: { change: 5, reason: 'Small resource adjustment to maintain ecosystem balance' }
          }
        }];
      }

      // If there are tool calls and user hasn't confirmed yet, show confirmation
      if (response.toolCalls && response.toolCalls.length > 0 && allowTools) {
        setShowToolConfirmation(true);
        // Preselect all suggestions by default
        const pre: Record<number, boolean> = {};
        response.toolCalls.forEach((_, idx) => (pre[idx] = true));
        setSelectedSuggestions(pre);
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
      const sessionId = await ensureSession(selectedCountry);
      if (!sessionId) throw new Error('Unable to create a session');

      // Apply tool calls on server for consistency and auditing
      const selectedToolCalls = aiResponse.toolCalls.filter((_, idx) => selectedSuggestions[idx]);
      if (selectedToolCalls.length === 0) {
        setShowToolConfirmation(false);
        return;
      }
      const result = await aiService.applyToolCalls(sessionId, selectedToolCalls);
      if (!result.success) throw new Error(result.error || 'Failed applying tools');

      // Reflect returned state in local store
      if (result.currentState) {
        setFoodChain(result.currentState.foodChain);
        setResources(result.currentState.resources);
        setHumanActivity(result.currentState.humanActivity);
      }

      setShowToolConfirmation(false);
      // Refresh AI response to show new state (advice only)
      setTimeout(() => getAIRecommendation(false), 600);
      toast.success("Eco changes applied", { description: "Your ecosystem has been updated." });
    } catch (error) {
      console.error('Failed to apply AI recommendations:', error);
      toast.error("Couldn't apply changes");
    }
  };

  const sendQuestion = async () => {
    if (!userInput.trim()) return;
    
    setIsSendingQuestion(true);
    try {
      const ecosystemState = {
        foodChain,
        resources,
        humanActivity,
        ecoScore,
        scoreHistory
      };

      const question = userInput.trim();
      setUserInput("");

      // First, check for direct tool-like syntax in the user's message and parse locally.
      // This lets users type tool calls directly and get the confirmation UI immediately.
      const raw = question;
      const inlineRegex = /`?([a-zA-Z0-9_]+)\s*\(\s*([^)]*)\s*\)`?/gi;
      let m: RegExpExecArray | null;
      const parsedTools: any[] = [];

      const nameMap: Record<string, string> = {
        'change_human_activity': 'adjust_human_activity',
        'set_human_activity': 'adjust_human_activity',
        'adjusthumanactivity': 'adjust_human_activity',
        'adjust_human_activity': 'adjust_human_activity',
        'sethumanactivity': 'adjust_human_activity',
        'adjust_resources': 'adjust_resources',
        'set_resources': 'adjust_resources',
        'adjust_food_chain': 'adjust_food_chain',
        'set_food_chain': 'adjust_food_chain'
      };

      const normalizeName = (rawName: string) => {
        const cleaned = rawName.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
        return nameMap[cleaned] || (cleaned.includes('human') ? 'adjust_human_activity' : cleaned.includes('resource') ? 'adjust_resources' : cleaned.includes('food') ? 'adjust_food_chain' : cleaned);
      };

      while ((m = inlineRegex.exec(raw)) !== null) {
        const rawName = m[1];
        const argsStr = m[2] || '';
        const name = normalizeName(rawName);
        const args: any = {};
        if (argsStr.trim()) {
          if (argsStr.includes(':')) {
            const pairs = argsStr.split(',').map(s => s.trim()).filter(Boolean);
            pairs.forEach(pair => {
              const [k, v] = pair.split(':').map(s => s.trim());
              if (k && typeof v !== 'undefined') {
                const n = parseFloat(v.replace(/['"]/g, ''));
                args[k] = isNaN(n) ? v.replace(/^['"]|['"]$/g, '') : n;
              }
            });
          } else {
            const n = parseFloat(argsStr.trim());
            if (!isNaN(n)) args.change = n;
          }
        }
        parsedTools.push({ type: 'function', function: { name, arguments: args } });
      }

      if (parsedTools.length > 0) {
        // Provide a cleaned message (remove inline tool syntax)
        const cleaned = raw.replace(/`?[a-zA-Z0-9_]+\s*\([^)]*\)`?/gi, '').trim();
        const response: AIRecommendationResponse = {
          success: true,
          message: cleaned || 'Tool change requested',
          toolCalls: parsedTools
        };
        setAiResponse(response);
        setIsAIMode(true);
        setShowToolConfirmation(true);
        const pre: Record<number, boolean> = {};
        response.toolCalls!.forEach((_: any, idx: number) => (pre[idx] = true));
        setSelectedSuggestions(pre);
        setIsSendingQuestion(false);
        setExpanded(false);
        return;
      }

      // No direct tool call found in user message: forward to AI normally (no tools)
      const response = await aiService.getRecommendation({
        ecosystemState,
        country: selectedCountry,
        userMessage: question,
        allowTools: false
      });
      try { console.debug('[Assistant] AI response', response); } catch {}
      setAiResponse(response);
      setIsAIMode(true);
      setExpanded(false);
    } catch (error) {
      console.error('Failed to send question:', error);
      toast.error("Failed to send question");
    }
    setIsSendingQuestion(false);
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
      <Card className={`w-full max-w-sm sm:max-w-md md:max-w-lg text-white rounded-2xl border shadow-xl backdrop-blur-md bg-gradient-to-b from-zinc-900/70 to-zinc-900/40 ${
        isAIMode ? 'border-purple-600' : getCardBorder(advice.type)
      }`}>
        <CardContent className="pt-4 max-h-96 overflow-y-auto">
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
          
          <div className="text-sm text-gray-200 leading-relaxed">
            {isAIMode && aiResponse ? (
              <div className="space-y-3">
                {aiResponse.success ? (
                  <>
                    {aiResponse.message && (
                      <div className="relative">
                        <div className={`transition-all ${expanded ? '' : 'max-h-16 overflow-hidden'}`}>
                          <p>{aiResponse.message}</p>
                        </div>
                        {!expanded && aiResponse.message.length > 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-zinc-900/90 to-transparent" />
                        )}
                        {aiResponse.message.length > 100 && (
                          <button
                            className="mt-2 px-2 py-1 text-xs text-purple-300 hover:text-purple-200 bg-purple-900/20 hover:bg-purple-900/40 rounded inline-flex items-center gap-1 transition-colors"
                            onClick={() => setExpanded((v) => !v)}
                          >
                            {expanded ? <><ChevronUp className="w-3 h-3"/> Show less</> : <><ChevronDown className="w-3 h-3"/> Read more</>}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Show tool confirmation if needed */}
                    {showToolConfirmation && aiResponse.toolCalls && aiResponse.toolCalls.length > 0 && (
                      <div className="bg-purple-900/30 border border-purple-600 rounded-xl p-3 space-y-2">
                        <div className="flex items-center gap-2 text-purple-300">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-medium text-xs">AI wants to make changes:</span>
                        </div>
                        <div className="space-y-1 text-xs text-purple-100">
                          {aiResponse.toolCalls.map((toolCall, index) => {
                            let reason = toolCall.function?.arguments?.reason || 'Suggested change';
                            const name = toolCall.function?.name;
                            const change = toolCall.function?.arguments?.change;
                            return (
                              <label key={index} className="flex items-center justify-between gap-2 bg-purple-950/40 border border-purple-700/40 rounded-md px-2 py-1 cursor-pointer">
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={!!selectedSuggestions[index]}
                                    onChange={(e) => setSelectedSuggestions((prev) => ({ ...prev, [index]: e.target.checked }))}
                                    className="accent-purple-500"
                                  />
                                  <div className="truncate">
                                    <span className="opacity-80">{index+1}.</span> {reason}
                                  </div>
                                </div>
                                <div className="text-[10px] font-mono opacity-80">
                                  {name}:{typeof change==='number'? (change>0?`+${change}`:change):''}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={applyAIRecommendations}
                            className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto rounded-full"
                          >
                            Apply Selected
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowToolConfirmation(false)}
                            className="border-purple-600 text-purple-300 hover:bg-purple-900/30 text-xs px-3 py-1 h-auto rounded-full"
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
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto rounded-full"
                      >
                        {isLoadingAI ? "Loading..." : "Suggest Changes"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsAIMode(false);
                          setAiResponse(null);
                          setShowToolConfirmation(false);
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs px-3 py-1 h-auto rounded-full"
                      >
                        Back to Tips
                      </Button>
                    </div>
                    
                    {/* Question input */}
                    <div className="mt-4 pt-3 border-t border-gray-600">
                      <div className="flex gap-2">
                        <Input
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder="Ask about your ecosystem..."
                          className="flex-1 bg-gray-800/50 border-gray-600 text-white text-sm placeholder-gray-400 rounded-full"
                          onKeyDown={(e) => e.key === 'Enter' && sendQuestion()}
                        />
                        <Button
                          size="sm"
                          onClick={sendQuestion}
                          disabled={!userInput.trim() || isSendingQuestion}
                          className="bg-purple-600 hover:bg-purple-700 rounded-full px-3"
                        >
                          {isSendingQuestion ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Ask questions about ecosystem balance, game mechanics, or get more details.
                      </p>
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
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs px-2 py-1 h-auto rounded-full"
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
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1 h-auto flex items-center gap-1 rounded-full"
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
