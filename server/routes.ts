import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Ecosystem simulation API routes
  
  // Get ecosystem data for a country
  app.get("/api/ecosystem/:country", (req, res) => {
    const { country } = req.params;
    
    // Return country-specific ecosystem data
    const ecosystemData = {
      country,
      timestamp: new Date().toISOString(),
      // This would typically come from a database
      currentState: {
        foodChain: 50,
        resources: 60, 
        humanActivity: 40,
        ecoScore: 70
      }
    };
    
    res.json(ecosystemData);
  });
  
  // Save ecosystem state
  app.post("/api/ecosystem/:country", (req, res) => {
    const { country } = req.params;
    const { foodChain, resources, humanActivity, ecoScore } = req.body;
    
    // Validate input
    if (typeof foodChain !== 'number' || typeof resources !== 'number' || 
        typeof humanActivity !== 'number' || typeof ecoScore !== 'number') {
      return res.status(400).json({ error: "Invalid ecosystem data" });
    }
    
    // In a real app, this would save to database
    console.log(`Saving ecosystem data for ${country}:`, {
      foodChain, resources, humanActivity, ecoScore
    });
    
    res.json({ 
      success: true, 
      message: `Ecosystem data saved for ${country}`,
      timestamp: new Date().toISOString()
    });
  });
  
  // Get leaderboard/high scores
  app.get("/api/leaderboard", (req, res) => {
    // Mock leaderboard data - in a real app this would come from database
    const leaderboard = [
      { country: "Norway", ecoScore: 92, player: "EcoMaster" },
      { country: "Brazil", ecoScore: 88, player: "RainforestGuardian" },
      { country: "Kenya", ecoScore: 85, player: "WildlifeProtector" },
      { country: "USA", ecoScore: 78, player: "GreenAmerica" },
      { country: "Japan", ecoScore: 75, player: "BalanceSeeker" }
    ];
    
    res.json(leaderboard);
  });

  const httpServer = createServer(app);
  return httpServer;
}
