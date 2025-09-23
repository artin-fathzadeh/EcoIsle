/**
 * Core ecosystem simulation engine
 * Calculates eco score based on the balance between environmental factors
 */

export function calculateEcoScore(
  foodChain: number, 
  resources: number, 
  humanActivity: number
): number {
  // Normalize inputs to 0-1 range
  const fc = foodChain / 100;
  const res = resources / 100;
  const human = humanActivity / 100;
  
  // Calculate individual factor scores
  const foodChainScore = calculateFoodChainScore(fc);
  const resourceScore = calculateResourceScore(res);
  const humanActivityScore = calculateHumanActivityScore(human);
  const balanceScore = calculateBalanceScore(fc, res, human);
  
  // Weighted combination of scores
  const totalScore = (
    foodChainScore * 0.3 +
    resourceScore * 0.25 +
    humanActivityScore * 0.25 +
    balanceScore * 0.2
  ) * 100;
  
  // Ensure score is within bounds
  return Math.max(0, Math.min(100, totalScore));
}

function calculateFoodChainScore(foodChain: number): number {
  // Optimal food chain is around 0.5 (balanced predator-prey ratio)
  // Score decreases as we move away from the optimal point
  const optimal = 0.5;
  const deviation = Math.abs(foodChain - optimal);
  
  // Use a quadratic function that peaks at optimal
  return Math.max(0, 1 - (deviation * 2) ** 2);
}

function calculateResourceScore(resources: number): number {
  // Higher resource conservation is generally better
  // But too much conservation (very low extraction) can hurt economy
  if (resources >= 0.6) {
    return 1; // Excellent conservation
  } else if (resources >= 0.4) {
    return 0.5 + (resources - 0.4) * 2.5; // Good balance
  } else {
    return resources * 1.25; // Poor conservation, linear decline
  }
}

function calculateHumanActivityScore(humanActivity: number): number {
  // Moderate human activity is optimal
  // Too little = no economic development
  // Too much = environmental destruction
  const optimal = 0.4;
  const deviation = Math.abs(humanActivity - optimal);
  
  // Quadratic function with peak at optimal level
  return Math.max(0.1, 1 - (deviation * 1.5) ** 2);
}

function calculateBalanceScore(
  foodChain: number, 
  resources: number, 
  humanActivity: number
): number {
  // Reward balanced approaches across all three factors
  // Penalize extreme imbalances
  
  const factors = [foodChain, resources, humanActivity];
  const mean = factors.reduce((sum, val) => sum + val, 0) / factors.length;
  
  // Calculate variance from mean
  const variance = factors.reduce((sum, val) => sum + (val - mean) ** 2, 0) / factors.length;
  
  // Lower variance = better balance = higher score
  return Math.max(0, 1 - variance * 4);
}

/**
 * Check for disaster conditions
 */
export function checkForDisasters(
  foodChain: number,
  resources: number, 
  humanActivity: number
): string[] {
  const disasters = [];
  
  if (foodChain < 10) {
    disasters.push("Ecosystem collapse: Predator extinction!");
  } else if (foodChain > 90) {
    disasters.push("Prey extinction: Food chain breakdown!");
  }
  
  if (resources < 15) {
    disasters.push("Resource depletion: Environmental crisis!");
  }
  
  if (humanActivity > 90) {
    disasters.push("Urbanization overload: Habitat destruction!");
  }
  
  // Check for extreme imbalances
  const values = [foodChain, resources, humanActivity];
  const max = Math.max(...values);
  const min = Math.min(...values);
  
  if (max - min > 80) {
    disasters.push("Severe imbalance: Ecosystem instability!");
  }
  
  return disasters;
}

/**
 * Generate positive events for good balance
 */
export function checkForPositiveEvents(
  foodChain: number,
  resources: number,
  humanActivity: number,
  ecoScore: number
): string[] {
  const events = [];
  
  if (ecoScore > 85) {
    events.push("Biodiversity boom: New species discovered!");
  }
  
  if (resources > 80 && humanActivity < 50) {
    events.push("Conservation success: Protected area established!");
  }
  
  if (Math.abs(foodChain - 50) < 10 && ecoScore > 70) {
    events.push("Predator-prey balance achieved: Ecosystem thriving!");
  }
  
  return events;
}
