import type { Country } from "../lib/stores/useCountries";

export const COUNTRIES_DATA: Country[] = [
  {
    name: "USA",
    climate: "Temperate/Continental",
    population: "331M",
    challenges: ["Carbon emissions", "Urban sprawl", "Biodiversity loss"],
    startingConditions: {
      foodChain: 45, // Slightly unbalanced due to habitat fragmentation
      resources: 40, // High consumption rate
      humanActivity: 75, // High urbanization and industrialization
    }
  },
  {
    name: "Brazil", 
    climate: "Tropical/Subtropical",
    population: "215M",
    challenges: ["Deforestation", "Mining pressure", "Agricultural expansion"],
    startingConditions: {
      foodChain: 65, // Rich biodiversity but under pressure
      resources: 80, // Abundant natural resources
      humanActivity: 55, // Growing urban development
    }
  },
  {
    name: "Norway",
    climate: "Subarctic/Oceanic", 
    population: "5.4M",
    challenges: ["Arctic ice loss", "Oil dependency", "Marine ecosystem stress"],
    startingConditions: {
      foodChain: 70, // Relatively stable marine ecosystems
      resources: 90, // Excellent resource management
      humanActivity: 35, // Low population density, sustainable practices
    }
  },
  {
    name: "Japan",
    climate: "Temperate/Subtropical",
    population: "125M", 
    challenges: ["Overfishing", "Urban density", "Natural disasters"],
    startingConditions: {
      foodChain: 40, // Stressed marine food chains
      resources: 35, // Limited natural resources
      humanActivity: 85, // Very high urbanization
    }
  },
  {
    name: "Kenya",
    climate: "Tropical/Arid",
    population: "54M",
    challenges: ["Drought cycles", "Wildlife conflict", "Soil degradation"],
    startingConditions: {
      foodChain: 60, // Rich wildlife but migration disrupted
      resources: 50, // Variable rainfall affects resources
      humanActivity: 30, // Lower industrialization, more rural
    }
  }
];
