import type { Country } from "../lib/stores/useCountries";
import { WORLD_COUNTRIES } from "../lib/expandedCountries";

// Legacy data - now using WORLD_COUNTRIES from expandedCountries.ts
// This file kept for backward compatibility
export const COUNTRIES_DATA: Country[] = [
  {
    name: "USA",
    climate: "Temperate/Continental",
    population: "331M",
    challenges: ["Carbon emissions", "Urban sprawl", "Biodiversity loss"],
    startingConditions: {
      foodChain: 45,
      resources: 40,
      humanActivity: 75,
    }
  },
  {
    name: "Brazil", 
    climate: "Tropical/Subtropical",
    population: "215M",
    challenges: ["Deforestation", "Mining pressure", "Agricultural expansion"],
    startingConditions: {
      foodChain: 65,
      resources: 80,
      humanActivity: 55,
    }
  },
  {
    name: "Norway",
    climate: "Subarctic/Oceanic", 
    population: "5.4M",
    challenges: ["Arctic ice loss", "Oil dependency", "Marine ecosystem stress"],
    startingConditions: {
      foodChain: 70,
      resources: 90,
      humanActivity: 35,
    }
  },
  {
    name: "Japan",
    climate: "Temperate/Subtropical",
    population: "125M", 
    challenges: ["Overfishing", "Urban density", "Natural disasters"],
    startingConditions: {
      foodChain: 40,
      resources: 35,
      humanActivity: 85,
    }
  },
  {
    name: "Kenya",
    climate: "Tropical/Arid",
    population: "54M",
    challenges: ["Drought cycles", "Wildlife conflict", "Soil degradation"],
    startingConditions: {
      foodChain: 60,
      resources: 50,
      humanActivity: 30,
    }
  }
];

// Convert expanded countries to legacy format for backward compatibility
export function getCountryData(countryName: string): Country | undefined {
  const expandedData = WORLD_COUNTRIES[countryName];
  if (!expandedData) return undefined;

  return {
    name: countryName,
    climate: expandedData.climate,
    population: expandedData.population,
    challenges: expandedData.challenges,
    startingConditions: expandedData.startingConditions,
  };
}

// Get all available country names
export function getAllCountryNames(): string[] {
  return Object.keys(WORLD_COUNTRIES);
}
