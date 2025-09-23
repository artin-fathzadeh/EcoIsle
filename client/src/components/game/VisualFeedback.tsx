import { useEcosystem } from "@/lib/stores/useEcosystem";
import { useCountries } from "@/lib/stores/useCountries";

export default function VisualFeedback() {
  const { ecoScore } = useEcosystem();
  const { selectedCountry } = useCountries();

  if (!selectedCountry) return null;

  // Calculate overlay color based on eco score
  const getOverlayColor = (score: number) => {
    if (score >= 80) return "rgba(34, 197, 94, 0.1)"; // Green
    if (score >= 60) return "rgba(234, 179, 8, 0.1)"; // Yellow
    if (score >= 40) return "rgba(249, 115, 22, 0.1)"; // Orange
    return "rgba(239, 68, 68, 0.1)"; // Red
  };

  const overlayColor = getOverlayColor(ecoScore);

  return (
    <>
      {/* Ecosystem health overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: overlayColor }}
      />
      
      {/* Particle effects for extreme conditions */}
      {ecoScore < 30 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Pollution particles */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gray-600 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {ecoScore > 80 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Sparkle effects for excellent health */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-300 rounded-full opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `sparkle ${1 + Math.random()}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 1}s`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
