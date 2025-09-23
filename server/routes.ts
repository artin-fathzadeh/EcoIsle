import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { storage } from "./storage";

// Extend WebSocket to include custom properties
interface ExtendedWebSocket extends WebSocket {
  sessionId?: string;
  classroom?: string;
}

interface GameSession {
  id: string;
  country: string;
  mode: 'education' | 'cards' | 'endless' | 'gorilla';
  startTime: number;
  currentState: {
    foodChain: number;
    resources: number;
    humanActivity: number;
    ecoScore: number;
    level?: number;
    cardsPlayed?: number;
  };
  events: Array<{
    timestamp: number;
    type: string;
    data: any;
  }>;
}

// In-memory storage for game sessions (would use database in production)
const gameSessions = new Map<string, GameSession>();
const leaderboards = {
  global: [] as Array<{country: string, ecoScore: number, player: string, timestamp: string}>,
  classroom: new Map<string, Array<{country: string, ecoScore: number, player: string, timestamp: string}>>()
};

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
  
  // Start new game session
  app.post("/api/game/start", (req, res) => {
    const { country, mode, playerName } = req.body;
    
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: GameSession = {
      id: sessionId,
      country,
      mode,
      startTime: Date.now(),
      currentState: {
        foodChain: mode === 'gorilla' ? 20 : 50, // Special starting conditions for gorilla mode
        resources: mode === 'gorilla' ? 80 : 60,
        humanActivity: mode === 'gorilla' ? 5 : 40,
        ecoScore: mode === 'gorilla' ? 85 : 70,
        level: mode === 'cards' || mode === 'endless' ? 1 : undefined,
        cardsPlayed: mode === 'cards' || mode === 'endless' ? 0 : undefined
      },
      events: []
    };
    
    gameSessions.set(sessionId, session);
    
    res.json({
      sessionId,
      success: true,
      message: `Game session started for ${country} in ${mode} mode`,
      initialState: session.currentState
    });
  });
  
  // Update game session
  app.put("/api/game/:sessionId", (req, res) => {
    const { sessionId } = req.params;
    const { state, event } = req.body;
    
    const session = gameSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Game session not found" });
    }
    
    // Update state
    session.currentState = { ...session.currentState, ...state };
    
    // Add event to history
    if (event) {
      session.events.push({
        timestamp: Date.now(),
        type: event.type,
        data: event.data
      });
    }
    
    res.json({
      success: true,
      currentState: session.currentState,
      sessionId
    });
  });
  
  // Get leaderboard/high scores
  app.get("/api/leaderboard", (req, res) => {
    const { type = 'global', classroom } = req.query;
    
    let leaderboard;
    if (type === 'classroom' && classroom) {
      leaderboard = leaderboards.classroom.get(classroom as string) || [];
    } else {
      leaderboard = leaderboards.global;
    }
    
    // Sort by eco score descending
    const sortedLeaderboard = [...leaderboard].sort((a, b) => b.ecoScore - a.ecoScore);
    
    res.json(sortedLeaderboard);
  });
  
  // Submit score to leaderboard
  app.post("/api/leaderboard", (req, res) => {
    const { country, ecoScore, player, classroom, mode } = req.body;
    
    const entry = {
      country,
      ecoScore,
      player,
      mode,
      timestamp: new Date().toISOString()
    };
    
    // Add to global leaderboard
    leaderboards.global.push(entry);
    
    // Add to classroom leaderboard if specified
    if (classroom) {
      if (!leaderboards.classroom.has(classroom)) {
        leaderboards.classroom.set(classroom, []);
      }
      leaderboards.classroom.get(classroom)!.push(entry);
    }
    
    // Keep only top 100 entries
    leaderboards.global = leaderboards.global
      .sort((a, b) => b.ecoScore - a.ecoScore)
      .slice(0, 100);
    
    res.json({ success: true, message: "Score submitted to leaderboard" });
  });
  
  // Special endpoint for Gorilla Mode
  app.post("/api/game/gorilla-challenge", (req, res) => {
    const { sessionId, action } = req.body;
    
    const session = gameSessions.get(sessionId);
    if (!session || session.mode !== 'gorilla') {
      return res.status(400).json({ error: "Invalid gorilla mode session" });
    }
    
    // Simulate gorilla vs humans ecosystem dynamics
    let result = { success: false, message: "", effectsApplied: {} };
    
    switch (action) {
      case 'deploy_gorilla':
        session.currentState.foodChain = Math.max(0, session.currentState.foodChain - 30);
        session.currentState.humanActivity = Math.max(0, session.currentState.humanActivity - 20);
        result = {
          success: true,
          message: "Mighty gorilla deployed! Humans retreating, predator population affected!",
          effectsApplied: { foodChain: -30, humanActivity: -20 }
        };
        break;
        
      case 'human_resistance':
        session.currentState.humanActivity = Math.min(100, session.currentState.humanActivity + 25);
        session.currentState.resources = Math.max(0, session.currentState.resources - 15);
        result = {
          success: true,
          message: "Humans fighting back! Development increases but resources depleted!",
          effectsApplied: { humanActivity: 25, resources: -15 }
        };
        break;
        
      case 'natural_balance':
        session.currentState.foodChain = Math.min(100, session.currentState.foodChain + 15);
        session.currentState.resources = Math.min(100, session.currentState.resources + 10);
        result = {
          success: true,
          message: "Nature finds balance! Ecosystem stability improves!",
          effectsApplied: { foodChain: 15, resources: 10 }
        };
        break;
        
      default:
        return res.status(400).json({ error: "Unknown gorilla mode action" });
    }
    
    // Recalculate eco score
    const { foodChain, resources, humanActivity } = session.currentState;
    session.currentState.ecoScore = Math.round(
      (foodChain * 0.4) + (resources * 0.35) + ((100 - Math.abs(humanActivity - 50)) * 0.25)
    );
    
    res.json({
      ...result,
      currentState: session.currentState
    });
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer });
  
  wss.on('connection', (ws: ExtendedWebSocket, req) => {
    console.log('WebSocket connection established');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different WebSocket message types
        switch (data.type) {
          case 'join_session':
            // Join a game session for real-time updates
            ws.sessionId = data.sessionId;
            ws.send(JSON.stringify({ 
              type: 'joined', 
              sessionId: data.sessionId,
              message: 'Successfully joined game session'
            }));
            break;
            
          case 'ecosystem_update':
            // Broadcast ecosystem changes to other connected clients
            wss.clients.forEach(client => {
              const extendedClient = client as ExtendedWebSocket;
              if (extendedClient !== ws && extendedClient.sessionId === data.sessionId) {
                extendedClient.send(JSON.stringify({
                  type: 'ecosystem_changed',
                  data: data.state
                }));
              }
            });
            break;
            
          case 'chat_message':
            // Classroom chat functionality
            wss.clients.forEach(client => {
              const extendedClient = client as ExtendedWebSocket;
              if (extendedClient.classroom === data.classroom) {
                extendedClient.send(JSON.stringify({
                  type: 'chat_message',
                  from: data.from,
                  message: data.message,
                  timestamp: Date.now()
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
  
  return httpServer;
}
