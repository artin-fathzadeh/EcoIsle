import { create } from 'zustand';

interface UIState {
  scoreBreakdownOpen: boolean;
  setScoreBreakdownOpen: (open: boolean) => void;
  ecoAssistantOffset: number;
  setEcoAssistantOffset: (offset: number) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  scoreBreakdownOpen: false,
  setScoreBreakdownOpen: (open) => set({ scoreBreakdownOpen: open }),
  ecoAssistantOffset: 0,
  setEcoAssistantOffset: (offset) => set({ ecoAssistantOffset: offset }),
  isAnimating: false,
  setIsAnimating: (animating) => set({ isAnimating: animating }),
}));