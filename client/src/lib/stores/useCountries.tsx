import { create } from "zustand";
import { COUNTRIES_DATA } from "../../data/countries";
import { useEcosystem } from "./useEcosystem";

export interface Country {
  name: string;
  climate: string;
  population: string;
  challenges: string[];
  startingConditions: {
    foodChain: number;
    resources: number;
    humanActivity: number;
  };
}

interface CountriesState {
  availableCountries: Country[];
  selectedCountry: string | null;
  currentCountryData: Country | null;
  
  // Actions
  selectCountry: (name: string) => void;
  clearSelection: () => void;
  getCountryData: (name: string) => Country | undefined;
}

export const useCountries = create<CountriesState>((set, get) => ({
  availableCountries: COUNTRIES_DATA,
  selectedCountry: null,
  currentCountryData: null,
  
  selectCountry: (name) => {
    const countryData = COUNTRIES_DATA.find(country => country.name === name);
    if (countryData) {
      set({ 
        selectedCountry: name,
        currentCountryData: countryData
      });
      
      // Apply starting conditions to ecosystem
      const { setFoodChain, setResources, setHumanActivity } = useEcosystem.getState();
      setFoodChain(countryData.startingConditions.foodChain);
      setResources(countryData.startingConditions.resources);
      setHumanActivity(countryData.startingConditions.humanActivity);
    }
  },
  
  clearSelection: () => {
    set({ 
      selectedCountry: null,
      currentCountryData: null
    });
  },
  
  getCountryData: (name) => {
    return COUNTRIES_DATA.find(country => country.name === name);
  },
}));
