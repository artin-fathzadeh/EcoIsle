import { useCountries } from "@/lib/stores/useCountries";

// Country data for fallback 2D map
const COUNTRIES_2D = [
  { name: "USA", x: 20, y: 35, color: "#4a90e2" },
  { name: "Brazil", x: 35, y: 65, color: "#7ed321" },
  { name: "Norway", x: 55, y: 20, color: "#50e3c2" },
  { name: "Japan", x: 85, y: 40, color: "#f5a623" },
  { name: "Kenya", x: 65, y: 55, color: "#e94b3c" },
];

export default function FallbackWorldMap() {
  const { selectedCountry, selectCountry } = useCountries();

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-blue-900 to-blue-700 overflow-hidden">
      {/* Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">EcoIsle</h1>
        <p className="text-lg text-blue-200">Ecosystem Balance Simulation</p>
        <p className="text-sm text-blue-300 mt-2">Click on a country to start</p>
      </div>

      {/* 2D World Map */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-64 bg-gradient-to-br from-green-800 to-green-600 rounded-lg shadow-2xl border-4 border-blue-400">
          {/* Ocean background */}
          <div className="absolute inset-0 bg-blue-600 rounded-lg opacity-70"></div>
          
          {/* Continents */}
          <div className="absolute top-4 left-4 w-16 h-12 bg-green-700 rounded-md opacity-80"></div>
          <div className="absolute top-12 left-20 w-20 h-16 bg-green-700 rounded-lg opacity-80"></div>
          <div className="absolute top-6 right-8 w-12 h-10 bg-green-700 rounded-md opacity-80"></div>
          <div className="absolute bottom-8 left-12 w-24 h-14 bg-green-700 rounded-lg opacity-80"></div>
          <div className="absolute bottom-6 right-12 w-18 h-12 bg-green-700 rounded-md opacity-80"></div>

          {/* Country markers */}
          {COUNTRIES_2D.map((country) => (
            <button
              key={country.name}
              onClick={() => selectCountry(country.name)}
              className={`absolute group transition-all duration-200 hover:scale-110 ${
                selectedCountry === country.name ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${country.x}%`,
                top: `${country.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                  selectedCountry === country.name 
                    ? 'scale-150 ring-4 ring-white ring-opacity-50' 
                    : 'hover:scale-125'
                }`}
                style={{ backgroundColor: country.color }}
              ></div>
              
              {/* Country label */}
              <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
                selectedCountry === country.name
                  ? 'bg-white text-gray-800 opacity-100'
                  : 'bg-black bg-opacity-70 text-white opacity-0 group-hover:opacity-100'
              }`}>
                {country.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notice about fallback mode */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-yellow-600 bg-opacity-90 text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
            <span>2D Mode Active</span>
          </div>
          <div className="text-xs mt-1 text-yellow-100">
            Using fallback map due to WebGL limitation
          </div>
        </div>
      </div>
    </div>
  );
}