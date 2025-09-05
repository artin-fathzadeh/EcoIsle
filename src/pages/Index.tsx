import { useState } from 'react';
import { WorldMap } from '@/components/WorldMap';
import { EcoSlider } from '@/components/EcoSlider';
import { EcoScore } from '@/components/EcoScore';
import { Sidebar } from '@/components/Sidebar';
import { useEcosystem } from '@/hooks/useEcosystem';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Zap, 
  Leaf, 
  Thermometer, 
  RotateCcw, 
  Shuffle,
  MapPin
} from 'lucide-react';

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');
  const { state, score, updateParameter, resetEcosystem, randomizeEcosystem } = useEcosystem();

  const handleCountrySelect = (countryId: string, countryName: string) => {
    setSelectedCountry(countryId);
    setSelectedCountryName(countryName);
  };

  return (
    <Sidebar selectedCountry={selectedCountry} score={score}>
      <div className="flex-1 bg-background">
        {/* Header */}
        <div className="glass-float border-b border-border/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">EcoIsle</h1>
              <p className="text-sm text-muted-foreground">Global Ecosystem Simulation Platform</p>
            </div>
            {selectedCountryName && (
              <div className="flex items-center gap-2 glass rounded-lg px-3 py-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{selectedCountryName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Content Grid */}
          <div className="grid xl:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="xl:col-span-2">
              <WorldMap 
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
              />
            </div>

            {/* Score Card */}
            <div>
              <EcoScore score={score.total} breakdown={score.breakdown} />
            </div>
          </div>

          {/* Control Panel */}
          {selectedCountry && (
            <div className="glass rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Ecosystem Parameters</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={randomizeEcosystem}
                    className="glass-float border-border/20"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Randomize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetEcosystem}
                    className="glass-float border-border/20"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                <EcoSlider
                  label="Population"
                  value={state.population}
                  onValueChange={(value) => updateParameter('population', value)}
                  min={100}
                  max={1000}
                  step={10}
                  icon={Users}
                  description="Herbivore population"
                />

                <EcoSlider
                  label="Predators"
                  value={state.predators}
                  onValueChange={(value) => updateParameter('predators', value)}
                  min={1}
                  max={100}
                  step={1}
                  icon={Zap}
                  description="Carnivore population"
                />

                <EcoSlider
                  label="Resources"
                  value={state.resources}
                  onValueChange={(value) => updateParameter('resources', value)}
                  min={10}
                  max={100}
                  step={1}
                  unit="%"
                  icon={Leaf}
                  description="Available vegetation"
                />

                <EcoSlider
                  label="Environment"
                  value={state.environment}
                  onValueChange={(value) => updateParameter('environment', value)}
                  min={20}
                  max={100}
                  step={1}
                  unit="%"
                  icon={Thermometer}
                  description="Climate quality"
                />
              </div>
            </div>
          )}

          {/* Instructions */}
          {!selectedCountry && (
            <div className="text-center py-12">
              <div className="glass rounded-lg p-8 max-w-md mx-auto">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Get Started</h3>
                <p className="text-sm text-muted-foreground">
                  Click anywhere on the map to select a region and begin your ecosystem simulation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default Index;