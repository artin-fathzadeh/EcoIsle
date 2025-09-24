import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useGameFlow } from "@/lib/stores/useGameFlow";
import { useCountries } from "@/lib/stores/useCountries";
import { PlayCircle, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function SetupScreen() {
  const { selectedCountry } = useCountries();
  const { 
    setupParameters, 
    setSetupParameters, 
    completeSetup 
  } = useGameFlow();

  if (!selectedCountry) return null;

  const handleStartSimulation = () => {
    completeSetup();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-20 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl bg-black/80 text-white border-gray-600 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Settings className="w-6 h-6 text-blue-400" />
              <CardTitle className="text-2xl">Ecosystem Setup</CardTitle>
            </div>
            <p className="text-gray-300">
              Configure your {selectedCountry} ecosystem parameters. Your choices will determine how the ecosystem evolves.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Food Chain Balance */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-medium text-white">
                  Food Chain Balance
                </label>
                <span className="text-blue-400 font-mono text-lg">
                  {Math.round(setupParameters.foodChain)}%
                </span>
              </div>
              <Slider
                value={[setupParameters.foodChain]}
                onValueChange={(value) => setSetupParameters({ foodChain: value[0] })}
                max={100}
                min={0}
                step={1}
                className="w-full h-3"
              />
              <div className="text-sm text-gray-400 mt-2 flex justify-between">
                <span>More Prey</span>
                <span>Balanced</span>
                <span>More Predators</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Controls the predator-prey balance in your ecosystem
              </p>
            </div>

            {/* Natural Resources */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-medium text-white">
                  Natural Resources
                </label>
                <span className="text-green-400 font-mono text-lg">
                  {Math.round(setupParameters.resources)}%
                </span>
              </div>
              <Slider
                value={[setupParameters.resources]}
                onValueChange={(value) => setSetupParameters({ resources: value[0] })}
                max={100}
                min={0}
                step={1}
                className="w-full h-3"
              />
              <div className="text-sm text-gray-400 mt-2 flex justify-between">
                <span>Depleted</span>
                <span>Sustainable</span>
                <span>Abundant</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Determines resource availability and conservation levels
              </p>
            </div>

            {/* Human Activity */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-medium text-white">
                  Human Activity
                </label>
                <span className="text-orange-400 font-mono text-lg">
                  {Math.round(setupParameters.humanActivity)}%
                </span>
              </div>
              <Slider
                value={[setupParameters.humanActivity]}
                onValueChange={(value) => setSetupParameters({ humanActivity: value[0] })}
                max={100}
                min={0}
                step={1}
                className="w-full h-3"
              />
              <div className="text-sm text-gray-400 mt-2 flex justify-between">
                <span>Rural</span>
                <span>Balanced</span>
                <span>Urban</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Level of human development and environmental impact
              </p>
            </div>

            {/* Country-specific guidance */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h3 className="font-medium text-yellow-400 mb-2">
                💡 {selectedCountry} Considerations:
              </h3>
              <p className="text-sm text-gray-300">
                {selectedCountry === "USA" && "Balance industrial growth with conservation efforts. Focus on renewable energy transitions."}
                {selectedCountry === "Brazil" && "Consider rainforest preservation while managing economic development pressures."}
                {selectedCountry === "Norway" && "Leverage renewable energy advantages while protecting Arctic ecosystems."}
                {selectedCountry === "Japan" && "Address urban density challenges while preserving marine biodiversity."}
                {selectedCountry === "Kenya" && "Balance wildlife conservation with agricultural and economic development needs."}
              </p>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleStartSimulation}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Ecosystem Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}