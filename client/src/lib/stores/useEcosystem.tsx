import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { calculateEcoScore } from "../ecosystemEngine";

interface EcosystemState {
  // Core variables
  foodChain: number; // 0-100, balance between predators and prey
  resources: number; // 0-100, natural resource availability
  humanActivity: number; // 0-100, level of human development
  
  // Derived values
  ecoScore: number; // 0-100, overall ecosystem health
  scoreHistory: number[]; // Track score over time
  
  // State tracking
  lastUpdateTime: number;
  isSimulating: boolean;
  
  // Actions
  setFoodChain: (value: number) => void;
  setResources: (value: number) => void;
  setHumanActivity: (value: number) => void;
  updateEcoScore: () => void;
  resetToDefaults: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
}

// Default values for a balanced ecosystem
const DEFAULT_VALUES = {
  foodChain: 50,
  resources: 60,
  humanActivity: 40,
};

export const useEcosystem = create<EcosystemState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    foodChain: DEFAULT_VALUES.foodChain,
    resources: DEFAULT_VALUES.resources,
    humanActivity: DEFAULT_VALUES.humanActivity,
    ecoScore: 70,
    scoreHistory: [70],
    lastUpdateTime: Date.now(),
    isSimulating: false,
    
    // Setters that automatically update eco score
    setFoodChain: (value) => {
      set({ foodChain: value });
      get().updateEcoScore();
    },
    
    setResources: (value) => {
      set({ resources: value });
      get().updateEcoScore();
    },
    
    setHumanActivity: (value) => {
      set({ humanActivity: value });
      get().updateEcoScore();
    },
    
    updateEcoScore: () => {
      const { foodChain, resources, humanActivity, scoreHistory } = get();
      const newScore = calculateEcoScore(foodChain, resources, humanActivity);
      
      // Update history (keep last 50 entries)
      const newHistory = [...scoreHistory, newScore].slice(-50);
      
      set({ 
        ecoScore: newScore,
        scoreHistory: newHistory,
        lastUpdateTime: Date.now()
      });
    },
    
    resetToDefaults: () => {
      set({
        foodChain: DEFAULT_VALUES.foodChain,
        resources: DEFAULT_VALUES.resources,
        humanActivity: DEFAULT_VALUES.humanActivity,
      });
      get().updateEcoScore();
    },
    
    startSimulation: () => {
      set({ isSimulating: true });
    },
    
    stopSimulation: () => {
      set({ isSimulating: false });
    },
  }))
);

// Note: Auto-update is handled directly in the setters above to avoid circular dependencies
