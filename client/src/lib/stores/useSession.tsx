import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface SessionState {
  sessionId?: string;
  mode: 'education' | 'cards' | 'endless' | 'gorilla';
  playerName?: string;
  startSession: (country: string, mode?: SessionState['mode'], playerName?: string) => Promise<string | undefined>;
  ensureSession: (country: string) => Promise<string | undefined>;
  clearSession: () => void;
}

export const useSession = create<SessionState>()(
  subscribeWithSelector((set, get) => ({
    sessionId: undefined,
    mode: 'endless',
    playerName: undefined,
    
    startSession: async (country, mode = 'endless', playerName = 'Guest') => {
      try {
        const res = await fetch('/api/game/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country, mode, playerName })
        });
        if (!res.ok) return undefined;
        const data = await res.json();
        set({ sessionId: data.sessionId, mode, playerName });
        return data.sessionId as string;
      } catch {
        return undefined;
      }
    },
    
    ensureSession: async (country: string) => {
      const current = get().sessionId;
      if (current) return current;
      return await get().startSession(country);
    },
    
    clearSession: () => set({ sessionId: undefined })
  }))
);
