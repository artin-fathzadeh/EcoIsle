import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountries } from "@/lib/stores/useCountries";

export default function CountrySelector() {
  const { availableCountries } = useCountries();

  return (
    <div className="absolute top-4 left-4 pointer-events-auto">
      <Card className="bg-black/80 text-white border-gray-600 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Select a Country</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-300 mb-4">
            Choose a country to manage its ecosystem. Each country has unique environmental challenges.
          </p>
          
          <div className="space-y-2">
            {availableCountries.map((country) => (
              <div key={country.name} className="text-sm">
                <span className="font-semibold">{country.name}</span>
                <div className="text-xs text-gray-400">
                  Climate: {country.climate} | Population: {country.population}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-400 mt-4">
            Click on a country in the 3D map to select it
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
