import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Card, buildDeckForLevel, shuffleDeck, DisasterCard, getDisasterMultiplier } from "../cards";
import { useEcosystem } from "./useEcosystem";
import { useCountries } from "./useCountries";

export type GameMode = 'education' | 'cards' | 'endless' | 'gorilla';

interface Potion {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: 'discard_2' | 'boost_food_chain' | 'boost_resources' | 'boost_human_activity';
  value?: number;
}

export const AVAILABLE_POTIONS: Potion[] = [
  {
    id: 'discard_potion',
    name: 'Discard Potion',
    description: 'Discard 2 cards from your hand',
    cost: 50,
    effect: 'discard_2'
  },
  {
    id: 'nature_boost',
    name: 'Nature\'s Blessing',
    description: '+15 Food Chain Balance',
    cost: 100,
    effect: 'boost_food_chain',
    value: 15
  },
  {
    id: 'resource_boost',
    name: 'Conservation Grant',
    description: '+20 Natural Resources',
    cost: 80,
    effect: 'boost_resources',
    value: 20
  },
  {
    id: 'tech_advance',
    name: 'Green Technology',
    description: '-10 Human Activity (reduces negative impact)',
    cost: 120,
    effect: 'boost_human_activity',
    value: -10
  }
];

interface CardGameState {
  // Game mode and level
  gameMode: GameMode;
  currentLevel: number;
  maxLevel: number;
  
  // Deck and hand management
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  cardsPlayed: number;
  
  // Level progression
  cardsToWin: number;
  isLevelComplete: boolean;
  isGameComplete: boolean;
  
  // Shop and currency
  coins: number;
  availablePotions: Potion[];
  inventory: Potion[];
  
  // Endless mode
  disasterMultiplier: number; // Increases each shuffle in endless mode
  shuffleCount: number;
  
  // Prophecy state
  prophecyRevealed: Card[];
  prophecyActive: boolean;
  
  // Actions
  initializeCardGame: (mode: GameMode, level?: number) => void;
  drawCard: () => Card | null;
  playCard: (cardId: string) => boolean;
  discardCard: (cardId: string) => void;
  reshuffleDeck: () => void;
  
  // Level management
  completeLevel: () => void;
  nextLevel: () => void;
  resetLevel: () => void;
  
  // Shop actions
  buyPotion: (potionId: string) => boolean;
  usePotion: (potionId: string) => boolean;
  
  // Prophecy actions
  activateProphecy: () => void;
  closeProphecy: () => void;
  
  // Utility
  getHandSize: () => number;
  getDeckSize: () => number;
  canPlayCard: (card: Card) => boolean;
}

export const useCardGame = create<CardGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameMode: 'education',
    currentLevel: 1,
    maxLevel: 10,
    
    deck: [],
    hand: [],
    discardPile: [],
    cardsPlayed: 0,
    
    cardsToWin: 20,
    isLevelComplete: false,
    isGameComplete: false,
    
    coins: 100,
    availablePotions: AVAILABLE_POTIONS,
    inventory: [],
    
    disasterMultiplier: 1.0,
    shuffleCount: 0,
    
    prophecyRevealed: [],
    prophecyActive: false,
    
    initializeCardGame: (mode: GameMode, level = 1) => {
      const newDeck = buildDeckForLevel(level);
      const initialHand: Card[] = [];
      
      // Draw initial hand of 5 cards
      for (let i = 0; i < Math.min(5, newDeck.length); i++) {
        initialHand.push(newDeck.pop()!);
      }
      
      set({
        gameMode: mode,
        currentLevel: level,
        deck: newDeck,
        hand: initialHand,
        discardPile: [],
        cardsPlayed: 0,
        cardsToWin: mode === 'endless' ? Infinity : 15 + (level * 5),
        isLevelComplete: false,
        isGameComplete: false,
        disasterMultiplier: 1.0,
        shuffleCount: 0,
        prophecyRevealed: [],
        prophecyActive: false
      });
    },
    
    drawCard: () => {
      const { deck, hand } = get();
      
      if (deck.length === 0) {
        // Auto-reshuffle in endless mode
        if (get().gameMode === 'endless') {
          get().reshuffleDeck();
        } else {
          return null; // No more cards
        }
      }
      
      const newDeck = [...deck];
      const drawnCard = newDeck.pop();
      
      if (drawnCard) {
        set({
          deck: newDeck,
          hand: [...hand, drawnCard]
        });
        return drawnCard;
      }
      
      return null;
    },
    
    playCard: (cardId: string) => {
      const { hand, discardPile, cardsPlayed, cardsToWin, currentLevel } = get();
      const ecosystem = useEcosystem.getState();
      const countries = useCountries.getState();
      
      const cardIndex = hand.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return false;
      
      const card = hand[cardIndex];
      
      // Apply card effects
      if (card.type === 'disaster') {
        const disasterCard = card as DisasterCard;
        const multiplier = countries.selectedCountry 
          ? getDisasterMultiplier(disasterCard, countries.selectedCountry)
          : 1.0;
        
        const finalMultiplier = multiplier * get().disasterMultiplier;
        
        // Apply disaster effects
        const newFoodChain = Math.max(0, Math.min(100, 
          ecosystem.foodChain + (disasterCard.effects.foodChain * finalMultiplier)
        ));
        const newResources = Math.max(0, Math.min(100,
          ecosystem.resources + (disasterCard.effects.resources * finalMultiplier)
        ));
        const newHumanActivity = Math.max(0, Math.min(100,
          ecosystem.humanActivity + (disasterCard.effects.humanActivity * finalMultiplier)
        ));
        
        ecosystem.setFoodChain(newFoodChain);
        ecosystem.setResources(newResources);
        ecosystem.setHumanActivity(newHumanActivity);
        
      } else if (card.type === 'positive') {
        // Handle positive cards
        if (card.special?.type === 'prophecy') {
          get().activateProphecy();
        } else {
          // Apply positive effects
          if (card.effects.foodChain) {
            ecosystem.setFoodChain(Math.min(100, ecosystem.foodChain + card.effects.foodChain));
          }
          if (card.effects.resources) {
            ecosystem.setResources(Math.min(100, ecosystem.resources + card.effects.resources));
          }
          if (card.effects.humanActivity) {
            ecosystem.setHumanActivity(Math.max(0, ecosystem.humanActivity + card.effects.humanActivity));
          }
        }
      }
      
      // Move card to discard pile
      const newHand = hand.filter((_, index) => index !== cardIndex);
      const newDiscardPile = [...discardPile, card];
      const newCardsPlayed = cardsPlayed + 1;
      
      // Check level completion
      const levelComplete = newCardsPlayed >= cardsToWin;
      const gameComplete = levelComplete && currentLevel >= get().maxLevel;
      
      // Award coins for playing cards
      const coinsEarned = card.rarity === 'common' ? 10 : 
                         card.rarity === 'uncommon' ? 15 :
                         card.rarity === 'rare' ? 25 : 50;
      
      set({
        hand: newHand,
        discardPile: newDiscardPile,
        cardsPlayed: newCardsPlayed,
        isLevelComplete: levelComplete,
        isGameComplete: gameComplete,
        coins: get().coins + coinsEarned
      });
      
      // Draw a new card
      get().drawCard();
      
      return true;
    },
    
    discardCard: (cardId: string) => {
      const { hand, discardPile } = get();
      const cardIndex = hand.findIndex(card => card.id === cardId);
      
      if (cardIndex === -1) return;
      
      const card = hand[cardIndex];
      const newHand = hand.filter((_, index) => index !== cardIndex);
      
      set({
        hand: newHand,
        discardPile: [...discardPile, card]
      });
    },
    
    reshuffleDeck: () => {
      const { discardPile, shuffleCount, gameMode } = get();
      
      if (discardPile.length === 0) return;
      
      const newDeck = shuffleDeck([...discardPile]);
      const newShuffleCount = shuffleCount + 1;
      
      // Increase disaster multiplier in endless mode
      const newMultiplier = gameMode === 'endless' 
        ? 1.0 + (newShuffleCount * 0.1) // 10% increase per shuffle
        : 1.0;
      
      set({
        deck: newDeck,
        discardPile: [],
        shuffleCount: newShuffleCount,
        disasterMultiplier: newMultiplier
      });
    },
    
    completeLevel: () => {
      set({ isLevelComplete: true });
    },
    
    nextLevel: () => {
      const { currentLevel, maxLevel } = get();
      const nextLevel = Math.min(currentLevel + 1, maxLevel);
      
      get().initializeCardGame(get().gameMode, nextLevel);
    },
    
    resetLevel: () => {
      get().initializeCardGame(get().gameMode, get().currentLevel);
    },
    
    buyPotion: (potionId: string) => {
      const { coins, inventory, availablePotions } = get();
      const potion = availablePotions.find(p => p.id === potionId);
      
      if (!potion || coins < potion.cost) return false;
      
      set({
        coins: coins - potion.cost,
        inventory: [...inventory, potion]
      });
      
      return true;
    },
    
    usePotion: (potionId: string) => {
      const { inventory, hand } = get();
      const potionIndex = inventory.findIndex(p => p.id === potionId);
      
      if (potionIndex === -1) return false;
      
      const potion = inventory[potionIndex];
      const ecosystem = useEcosystem.getState();
      
      // Apply potion effect
      switch (potion.effect) {
        case 'discard_2':
          // Let player choose which cards to discard (simplified: discard first 2)
          const cardsToDiscard = hand.slice(0, Math.min(2, hand.length));
          cardsToDiscard.forEach(card => get().discardCard(card.id));
          break;
          
        case 'boost_food_chain':
          ecosystem.setFoodChain(Math.min(100, ecosystem.foodChain + (potion.value || 0)));
          break;
          
        case 'boost_resources':
          ecosystem.setResources(Math.min(100, ecosystem.resources + (potion.value || 0)));
          break;
          
        case 'boost_human_activity':
          ecosystem.setHumanActivity(Math.max(0, ecosystem.humanActivity + (potion.value || 0)));
          break;
      }
      
      // Remove potion from inventory
      const newInventory = inventory.filter((_, index) => index !== potionIndex);
      set({ inventory: newInventory });
      
      return true;
    },
    
    activateProphecy: () => {
      const { deck } = get();
      const revealed = deck.slice(-5); // Show top 5 cards
      
      set({
        prophecyRevealed: revealed,
        prophecyActive: true
      });
    },
    
    closeProphecy: () => {
      set({
        prophecyRevealed: [],
        prophecyActive: false
      });
    },
    
    // Utility functions
    getHandSize: () => get().hand.length,
    getDeckSize: () => get().deck.length,
    canPlayCard: (card: Card) => {
      // All cards are playable by default, but could add restrictions here
      return true;
    }
  }))
);