import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GameScreen = 'idle' | 'setup' | 'simulation' | 'results';

interface SimulationData {
  initialState: {
    foodChain: number;
    resources: number;
    humanActivity: number;
    ecoScore: number;
  };
  finalState: {
    foodChain: number;
    resources: number;
    humanActivity: number;
    ecoScore: number;
  };
  simulationHistory: Array<{
    time: number;
    foodChain: number;
    resources: number;
    humanActivity: number;
    ecoScore: number;
  }>;
  duration: number; // in seconds
}

interface GameFlowState {
  // Current screen state
  currentScreen: GameScreen;
  
  // Setup screen state
  setupParameters: {
    foodChain: number;
    resources: number;
    humanActivity: number;
  };
  setupCompleted: boolean;
  
  // Simulation screen state
  simulationRunning: boolean;
  simulationProgress: number; // 0-100
  simulationStartTime: number;
  simulationDuration: number; // in seconds
  
  // Results screen state
  simulationData: SimulationData | null;
  showAIAnalysis: boolean;
  
  // Actions
  navigateToScreen: (screen: GameScreen) => void;
  setSetupParameters: (params: Partial<GameFlowState['setupParameters']>) => void;
  completeSetup: () => void;
  startSimulation: () => void;
  updateSimulationProgress: (progress: number) => void;
  completeSimulation: (data: SimulationData) => void;
  resetGameFlow: () => void;
  showAIResults: () => void;
}

const DEFAULT_SETUP_PARAMETERS = {
  foodChain: 50,
  resources: 60,
  humanActivity: 40,
};

export const useGameFlow = create<GameFlowState>()((set, get) => ({
  // Initial state - idle until user starts simulation workflow
  currentScreen: 'idle',
  setupParameters: { ...DEFAULT_SETUP_PARAMETERS },
  setupCompleted: false,
  simulationRunning: false,
  simulationProgress: 0,
  simulationStartTime: 0,
  simulationDuration: 15, // 15 seconds as specified
  simulationData: null,
  showAIAnalysis: false,
  
  // Actions
  navigateToScreen: (screen) => {
    set({ currentScreen: screen });
  },
  
  setSetupParameters: (params) => {
    set((state) => ({
      setupParameters: { ...state.setupParameters, ...params }
    }));
  },
  
  completeSetup: () => {
    set({ 
      setupCompleted: true,
      currentScreen: 'simulation'
    });
  },
  
  startSimulation: () => {
    set({
      simulationRunning: true,
      simulationProgress: 0,
      simulationStartTime: Date.now(),
      currentScreen: 'simulation'
    });
  },
  
  updateSimulationProgress: (progress) => {
    set({ simulationProgress: Math.min(100, Math.max(0, progress)) });
  },
  
  completeSimulation: (data) => {
    set({
      simulationRunning: false,
      simulationProgress: 100,
      simulationData: data,
      currentScreen: 'results'
    });
  },
  
  resetGameFlow: () => {
    set({
      currentScreen: 'idle',
      setupParameters: { ...DEFAULT_SETUP_PARAMETERS },
      setupCompleted: false,
      simulationRunning: false,
      simulationProgress: 0,
      simulationStartTime: 0,
      simulationData: null,
      showAIAnalysis: false
    });
  },
  
  showAIResults: () => {
    set({ showAIAnalysis: true });
  }
}));