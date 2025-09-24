import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCountries } from "@/lib/stores/useCountries";
import { Globe, Users, Cloud, Sparkles } from "lucide-react";
import { useState } from "react";
import { aiService } from "@/lib/ai-service";

export default function CountrySelector() {
  const { availableCountries, selectCountry } = useCountries();
  const [selectedForAI, setSelectedForAI] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleCountrySelect = (countryName: string) => {
    selectCountry(countryName);
  };

  const getCountryAIInfo = async (countryName: string) => {
    setIsLoadingAI(true);
    setSelectedForAI(countryName);
    try {
      const contextualPrompt = aiService.createContextualPrompt('country_selection', 
        `Tell me about the unique ecological challenges and opportunities for ${countryName} in the EcoIsle simulation.`
      );

      const response = await aiService.getRecommendation({
        ecosystemState: { foodChain: 50, resources: 50, humanActivity: 50, ecoScore: 50 },
        country: countryName,
        userMessage: contextualPrompt,
        allowTools: false
      });

      setAiResponse(response);
    } catch (error) {
      console.error('Failed to get country AI info:', error);
      setAiResponse({
        success: false,
        error: 'Failed to get AI information. Please try again.'
      });
    }
    setIsLoadingAI(false);
  };

  return (
    <div className="absolute top-4 left-4 pointer-events-auto">
      <Card className="bg-black/90 text-white border-gray-600 backdrop-blur-sm max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Select a Country
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300 mb-4">
            Choose a country to manage its ecosystem. Each country has unique environmental challenges.
          </p>
          
          <div className="space-y-3">
            {availableCountries.map((country) => (
              <div key={country.name} className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => handleCountrySelect(country.name)}
                  className="w-full p-3 h-auto text-left border-gray-600 hover:border-gray-500 hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0">
                      {country.name === 'USA' && <span className="text-2xl">🇺🇸</span>}
                      {country.name === 'Brazil' && <span className="text-2xl">🇧🇷</span>}
                      {country.name === 'Norway' && <span className="text-2xl">🇳🇴</span>}
                      {country.name === 'Japan' && <span className="text-2xl">🇯🇵</span>}
                      {country.name === 'Kenya' && <span className="text-2xl">🇰🇪</span>}
                    </div>
                    <div className="flex-grow">
                      <div className="font-semibold text-white mb-1">{country.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Cloud className="w-3 h-3" />
                          {country.climate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {country.population}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Challenges: {country.challenges.slice(0, 2).join(', ')}
                        {country.challenges.length > 2 && '...'}
                      </div>
                    </div>
                  </div>
                </Button>
                
                {/* AI Info Button */}
                <div className="flex justify-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => getCountryAIInfo(country.name)}
                    disabled={isLoadingAI}
                    className="text-xs text-purple-300 hover:text-purple-200 hover:bg-purple-900/30"
                  >
                    {isLoadingAI && selectedForAI === country.name ? (
                      <>
                        <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-1" />
                        Loading AI Info...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Country Info
                      </>
                    )}
                  </Button>
                </div>
                
                {/* AI Response */}
                {selectedForAI === country.name && aiResponse && (
                  <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3 text-sm">
                    {aiResponse.success ? (
                      <div className="text-purple-100">
                        {aiResponse.message}
                      </div>
                    ) : (
                      <div className="text-red-300">
                        {aiResponse.error || "Failed to get AI information"}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedForAI(null);
                        setAiResponse(null);
                      }}
                      className="text-xs text-purple-300 hover:text-purple-200 mt-2"
                    >
                      Close
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-400 mt-4 text-center">
            Select a country above to begin managing its ecosystem
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
