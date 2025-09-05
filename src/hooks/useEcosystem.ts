import { useState, useEffect, useCallback } from 'react';

export interface EcosystemState {
  population: number;
  predators: number;
  resources: number;
  environment: number;
}

export interface EcosystemScore {
  total: number;
  breakdown: {
    balance: number;
    sustainability: number;
    environment: number;
  };
}

const INITIAL_STATE: EcosystemState = {
  population: 500,
  predators: 25,
  resources: 75,
  environment: 80,
};

export const useEcosystem = () => {
  const [state, setState] = useState<EcosystemState>(INITIAL_STATE);
  const [score, setScore] = useState<EcosystemScore>({
    total: 0,
    breakdown: { balance: 0, sustainability: 0, environment: 0 }
  });

  const calculateEcosystemScore = useCallback((ecosystemState: EcosystemState): EcosystemScore => {
    const { population, predators, resources, environment } = ecosystemState;

    // Calculate predator-to-prey ratio (optimal around 5%)
    const predatorRatio = predators / population;
    const optimalPredatorRatio = 0.05;
    const predatorBalance = Math.max(0, 100 - Math.abs(predatorRatio - optimalPredatorRatio) * 2000);

    // Calculate resource sustainability (resources per capita)
    const resourcePerCapita = resources / (population / 100);
    const optimalResourceRatio = 1.0;
    const resourceBalance = Math.max(0, 100 - Math.abs(resourcePerCapita - optimalResourceRatio) * 50);

    // Population pressure (carrying capacity consideration)
    const populationPressure = population > 800 ? Math.max(0, 100 - (population - 800) / 10) : 100;
    
    // Predator viability (too few predators can't sustain themselves)
    const predatorViability = predators < 5 ? predators * 20 : 100;

    // Balance score (weighted combination of factors)
    const balanceScore = Math.round(
      (predatorBalance * 0.3 + populationPressure * 0.3 + predatorViability * 0.4)
    );

    // Sustainability score (resource management)
    const sustainabilityScore = Math.round(
      (resourceBalance * 0.6 + Math.min(resources, 100) * 0.4)
    );

    // Environment score (direct environmental health)
    const environmentScore = Math.round(environment);

    // Total ecosystem score (weighted average)
    const totalScore = Math.round(
      (balanceScore * 0.4 + sustainabilityScore * 0.3 + environmentScore * 0.3)
    );

    return {
      total: Math.max(0, Math.min(100, totalScore)),
      breakdown: {
        balance: Math.max(0, Math.min(100, balanceScore)),
        sustainability: Math.max(0, Math.min(100, sustainabilityScore)),
        environment: Math.max(0, Math.min(100, environmentScore))
      }
    };
  }, []);

  // Recalculate score whenever state changes
  useEffect(() => {
    const newScore = calculateEcosystemScore(state);
    setScore(newScore);
  }, [state, calculateEcosystemScore]);

  const updateParameter = useCallback((parameter: keyof EcosystemState, value: number) => {
    setState(prev => ({
      ...prev,
      [parameter]: value
    }));
  }, []);

  const resetEcosystem = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const randomizeEcosystem = useCallback(() => {
    setState({
      population: Math.floor(Math.random() * 900) + 100,
      predators: Math.floor(Math.random() * 95) + 5,
      resources: Math.floor(Math.random() * 90) + 10,
      environment: Math.floor(Math.random() * 80) + 20,
    });
  }, []);

  return {
    state,
    score,
    updateParameter,
    resetEcosystem,
    randomizeEcosystem,
  };
};