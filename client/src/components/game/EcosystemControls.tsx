import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";
import { RotateCcw } from "lucide-react";

export default function EcosystemControls() {
  const { 
    foodChain, 
    resources, 
    humanActivity, 
    setFoodChain, 
    setResources, 
    setHumanActivity,
    resetToDefaults 
  } = useEcosystem();
  
  const { selectedCountry } = useCountries();

  if (!selectedCountry) return null;

  return (
    <div className="absolute bottom-4 left-4 pointer-events-auto">
      <Card className="bg-black/80 text-white border-gray-600 backdrop-blur-sm w-80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            Ecosystem Controls
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="border-gray-600 hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Food Chain Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Food Chain Balance</label>
              <span className="text-xs text-gray-400">{Math.round(foodChain)}%</span>
            </div>
            <Slider
              value={[foodChain]}
              onValueChange={(value) => setFoodChain(value[0])}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Predator ← → Prey balance
            </div>
          </div>

          {/* Resources Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Natural Resources</label>
              <span className="text-xs text-gray-400">{Math.round(resources)}%</span>
            </div>
            <Slider
              value={[resources]}
              onValueChange={(value) => setResources(value[0])}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Conservation ← → Extraction
            </div>
          </div>

          {/* Human Activity Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Human Activity</label>
              <span className="text-xs text-gray-400">{Math.round(humanActivity)}%</span>
            </div>
            <Slider
              value={[humanActivity]}
              onValueChange={(value) => setHumanActivity(value[0])}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Rural ← → Urban development
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-4">
            Adjust sliders to balance the ecosystem. Extreme values may trigger disasters!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
