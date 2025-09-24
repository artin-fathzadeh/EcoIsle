import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { useUI } from "@/lib/stores/useUI";
import { AlertTriangle, Info, CheckCircle, X, Bot } from "lucide-react";
import { useState, useEffect } from "react";

export default function Assistant() {
  const { foodChain, resources, humanActivity, ecoScore } = useEcosystem();
  const { selectedCountry } = useCountries();
  const { scoreBreakdownOpen } = useUI();
  const [isMinimized, setIsMinimized] = useState(false);

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
      <Card className={`bg-black/80 text-white backdrop-blur-sm w-80 ${getCardBorder(advice.type)}`}>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <advice.icon className={`w-5 h-5 ${getIconColor(advice.type)}`} />
              <span className="font-semibold text-sm">Eco Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6 p-0 hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-300 leading-relaxed">
            {advice.message}
          </p>

          {/* Country-specific tips */}
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
        </CardContent>
      </Card>
    </div>
  );
}
