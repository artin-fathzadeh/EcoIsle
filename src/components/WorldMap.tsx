import { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { Globe } from 'lucide-react';

interface Country {
  name: string;
  coords: [number, number];
}

const countries: Country[] = [
  { name: 'United States', coords: [39.8283, -98.5795] },
  { name: 'Canada', coords: [56.1304, -106.3468] },
  { name: 'Brazil', coords: [-14.2350, -51.9253] },
  { name: 'United Kingdom', coords: [55.3781, -3.4360] },
  { name: 'France', coords: [46.6034, 2.2137] },
  { name: 'Germany', coords: [51.1657, 10.4515] },
  { name: 'Russia', coords: [61.5240, 105.3188] },
  { name: 'China', coords: [35.8617, 104.1954] },
  { name: 'India', coords: [20.5937, 78.9629] },
  { name: 'Japan', coords: [36.2048, 138.2529] },
  { name: 'Australia', coords: [-25.2744, 133.7751] },
  { name: 'South Africa', coords: [-30.5595, 22.9375] }
];

interface WorldMapProps {
  selectedCountry: string | null;
  onCountrySelect: (countryId: string, countryName: string) => void;
}

function MapEvents({ onCountrySelect }: { onCountrySelect: (country: string, name: string) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      
      // Find closest country based on click coordinates
      let closestCountry = countries[0];
      let minDistance = Infinity;
      
      countries.forEach(country => {
        const distance = Math.sqrt(
          Math.pow(lat - country.coords[0], 2) + 
          Math.pow(lng - country.coords[1], 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestCountry = country;
        }
      });
      
      onCountrySelect(closestCountry.name.toLowerCase().replace(/\s+/g, ''), closestCountry.name);
    }
  });
  return null;
}

export const WorldMap = ({ selectedCountry, onCountrySelect }: WorldMapProps) => {
  return (
    <div className="h-full w-full glass rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-border/20">
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Global Ecosystem Selection</span>
      </div>
      
      <div className="h-[400px] w-full">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapEvents onCountrySelect={onCountrySelect} />
        </MapContainer>
      </div>
      
      {!selectedCountry && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="glass-float px-3 py-2 rounded-md">
            <p className="text-xs text-muted-foreground">Click anywhere to select an ecosystem</p>
          </div>
        </div>
      )}
    </div>
  );
};