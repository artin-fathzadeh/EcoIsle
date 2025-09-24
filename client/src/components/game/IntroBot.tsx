import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Bot, X, Lightbulb, BookOpen, Target, Sparkles } from "lucide-react";
import { useCountries } from "@/lib/stores/useCountries";
import { useUI } from "@/lib/stores/useUI";
import { aiService } from "@/lib/ai-service";

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  icon: React.ComponentType<any>;
  type: 'welcome' | 'gameplay' | 'science' | 'country' | 'goals';
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to EcoIsle!",
    content: "I'm your ecological guide! I'll teach you how to balance ecosystems and understand natural selection. Ready to become an ecosystem master?",
    icon: Bot,
    type: 'welcome'
  },
  {
    id: 2,
    title: "The Three Pillars",
    content: "Every ecosystem has three key factors: Food Chain Balance (predator-prey relationships), Natural Resources (availability and conservation), and Human Activity (development vs. preservation).",
    icon: BookOpen,
    type: 'gameplay'
  },
  {
    id: 3,
    title: "Natural Selection in Action",
    content: "Over time, populations evolve! Environmental pressures cause mutations and adaptations. A drought might favor animals with better water conservation, while abundant resources might support larger populations.",
    icon: Lightbulb,
    type: 'science'
  },
  {
    id: 4,
    title: "Country-Specific Challenges",
    content: "Each country has unique starting conditions based on real-world factors. The USA faces high pollution, Brazil has deforestation pressures, and Norway deals with Arctic changes.",
    icon: Target,
    type: 'country'
  },
  {
    id: 5,
    title: "Your Mission",
    content: "Use the sliders to maintain ecosystem balance. Watch for natural disasters when things get extreme, and look for positive events when you achieve harmony. Your eco-score reflects your success!",
    icon: Target,
    type: 'goals'
  }
];

export default function IntroBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    // Check localStorage to see if user has seen intro before
    return localStorage.getItem('ecoisle-intro-seen') === 'true';
  });
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const { selectedCountry } = useCountries();
  const { ecoAssistantOffset } = useUI();

  // Auto-open when a country is first selected and user hasn't seen intro
  useEffect(() => {
    if (selectedCountry && !hasSeenIntro) {
      setIsOpen(true);
    }
  }, [selectedCountry, hasSeenIntro]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const closeTutorial = () => {
    setIsOpen(false);
    setHasSeenIntro(true);
    setIsAIMode(false);
    setAiResponse(null);
    // Save to localStorage so it persists across page reloads
    localStorage.setItem('ecoisle-intro-seen', 'true');
  };

  const reopenTutorial = () => {
    setIsOpen(true);
    setCurrentStep(0);
    setIsAIMode(false);
    setAiResponse(null);
  };

  const getAITutorialHelp = async () => {
    setIsLoadingAI(true);
    try {
      const contextualPrompt = aiService.createContextualPrompt('tutorial', 
        `Tutorial step: ${currentStepData.title}. Content: ${currentStepData.content}. Country: ${selectedCountry}`
      );

      const response = await aiService.getRecommendation({
        ecosystemState: { foodChain: 50, resources: 50, humanActivity: 50, ecoScore: 50 },
        country: selectedCountry || 'Unknown',
        userMessage: contextualPrompt,
        allowTools: false
      });

      setAiResponse(response);
      setIsAIMode(true);
    } catch (error) {
      console.error('Failed to get AI tutorial help:', error);
      setAiResponse({
        success: false,
        error: 'Failed to get AI help. Please try again.'
      });
      setIsAIMode(true);
    }
    setIsLoadingAI(false);
  };

  const currentStepData = tutorialSteps[currentStep];
  const IconComponent = currentStepData?.icon || Bot;

  if (!selectedCountry) return null;

  return (
    <>
      {/* Tutorial Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 pointer-events-auto"
          onWheel={(e: React.WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchStart={(e: React.TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchMove={(e: React.TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchEnd={(e: React.TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onScroll={(e: React.UIEvent) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e: React.MouseEvent) => {
            // Only close if clicking the backdrop, not the modal content
            if (e.target === e.currentTarget) {
              closeTutorial();
            }
          }}
        >
          <Card 
            className="w-full max-w-lg bg-white shadow-xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <CardHeader className="relative">
              <div className="absolute right-2 top-2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={getAITutorialHelp}
                  disabled={isLoadingAI}
                  className="h-8 w-8 hover:bg-purple-100"
                  title="Get AI help with this tutorial step"
                >
                  {isLoadingAI ? (
                    <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeTutorial}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="flex items-center gap-2 text-lg pr-20">
                {isAIMode ? (
                  <Sparkles className="w-5 h-5 text-purple-600" />
                ) : (
                  <IconComponent className="w-5 h-5 text-blue-600" />
                )}
                {isAIMode ? "AI Tutorial Helper" : currentStepData.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {isAIMode && aiResponse ? (
                <div className="space-y-3">
                  {aiResponse.success ? (
                    <div className="text-gray-700 leading-relaxed">
                      {aiResponse.message}
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm">
                      {aiResponse.error || "Failed to get AI help"}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsAIMode(false);
                        setAiResponse(null);
                      }}
                      className="text-xs"
                    >
                      Back to Tutorial
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-gray-700 leading-relaxed">
                    {currentStepData.content}
                  </div>

                  {/* Country-specific tip for step 4 */}
                  {currentStep === 3 && selectedCountry && (
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium text-blue-900">
                        {selectedCountry} Tip:
                      </div>
                      <div className="text-blue-700 text-sm mt-1">
                        {selectedCountry === "USA" && "Focus on reducing human activity while maintaining economic growth."}
                        {selectedCountry === "Brazil" && "Balance resource extraction with biodiversity preservation."}
                        {selectedCountry === "Norway" && "Leverage renewable energy and sustainable fishing practices."}
                        {selectedCountry === "Japan" && "Manage urban density while protecting marine ecosystems."}
                        {selectedCountry === "Kenya" && "Address wildlife-human conflict while promoting conservation."}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Progress indicator - only show when not in AI mode */}
              {!isAIMode && (
                <div className="flex justify-center gap-2">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Navigation buttons - only show when not in AI mode */}
              {!isAIMode && (
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentStep === tutorialSteps.length - 1 ? (
                    <Button
                      onClick={closeTutorial}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      Start Playing!
                      <Target className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}