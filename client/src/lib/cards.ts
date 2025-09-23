// Card system types and interfaces

export type CardType = 'disaster' | 'positive' | 'neutral';
export type DisasterType = 'flood' | 'drought' | 'fire' | 'tornado';
export type PositiveType = 'prophecy' | 'rainyDay';

export interface BaseCard {
  id: string;
  name: string;
  description: string;
  type: CardType;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  cost?: number; // For shop system
  level: number; // Minimum level required
}

export interface DisasterCard extends BaseCard {
  type: 'disaster';
  disasterType: DisasterType;
  effects: {
    foodChain: number;
    resources: number;
    humanActivity: number;
  };
  severity: 'mild' | 'moderate' | 'severe';
  locationMultiplier?: Record<string, number>; // Country-specific multipliers
}

export interface PositiveCard extends BaseCard {
  type: 'positive';
  positiveType: PositiveType;
  effects: {
    foodChain?: number;
    resources?: number;
    humanActivity?: number;
  };
  special?: {
    type: 'prophecy' | 'resource_bonus';
    value?: any;
  };
}

export type Card = DisasterCard | PositiveCard;

// Predefined disaster cards
export const DISASTER_CARDS: DisasterCard[] = [
  {
    id: 'flood_mild',
    name: 'Minor Flooding',
    description: 'Seasonal flooding affects local habitats but provides soil nutrients.',
    type: 'disaster',
    disasterType: 'flood',
    rarity: 'common',
    level: 1,
    effects: {
      foodChain: -10,
      resources: 5,
      humanActivity: -5
    },
    severity: 'mild',
    locationMultiplier: {
      'Brazil': 0.8, // Less impact due to adapted ecosystems
      'Netherlands': 0.6 // Better flood management
    }
  },
  {
    id: 'flood_severe',
    name: 'Devastating Flood',
    description: 'Major flooding destroys habitats and disrupts entire food chains.',
    type: 'disaster',
    disasterType: 'flood',
    rarity: 'uncommon',
    level: 2,
    effects: {
      foodChain: -25,
      resources: -15,
      humanActivity: -20
    },
    severity: 'severe',
    locationMultiplier: {
      'Japan': 1.2, // Higher impact due to islands
      'Kenya': 1.3 // Poor infrastructure
    }
  },
  {
    id: 'drought_mild',
    name: 'Dry Season',
    description: 'Extended dry period stresses vegetation and water sources.',
    type: 'disaster',
    disasterType: 'drought',
    rarity: 'common',
    level: 1,
    effects: {
      foodChain: -8,
      resources: -15,
      humanActivity: -5
    },
    severity: 'mild',
    locationMultiplier: {
      'Kenya': 1.5, // More vulnerable to drought
      'Norway': 0.3 // Less affected
    }
  },
  {
    id: 'drought_severe',
    name: 'Extreme Drought',
    description: 'Severe drought causes mass migration and ecosystem collapse.',
    type: 'disaster',
    disasterType: 'drought',
    rarity: 'rare',
    level: 3,
    effects: {
      foodChain: -30,
      resources: -40,
      humanActivity: -15
    },
    severity: 'severe',
    locationMultiplier: {
      'Kenya': 2.0,
      'USA': 1.2,
      'Norway': 0.2
    }
  },
  {
    id: 'fire_mild',
    name: 'Controlled Burn',
    description: 'Natural fire cycle helps regenerate forest ecosystems.',
    type: 'disaster',
    disasterType: 'fire',
    rarity: 'common',
    level: 1,
    effects: {
      foodChain: -5,
      resources: 10, // Nutrients from ash
      humanActivity: 0
    },
    severity: 'mild'
  },
  {
    id: 'fire_severe',
    name: 'Wildfire',
    description: 'Uncontrolled wildfire devastates forests and wildlife habitats.',
    type: 'disaster',
    disasterType: 'fire',
    rarity: 'uncommon',
    level: 2,
    effects: {
      foodChain: -35,
      resources: -25,
      humanActivity: -10
    },
    severity: 'severe',
    locationMultiplier: {
      'USA': 1.3, // California fires
      'Brazil': 1.8, // Amazon fires
      'Norway': 0.4 // Less fire prone
    }
  },
  {
    id: 'tornado_mild',
    name: 'Dust Devil',
    description: 'Minor wind disturbance affects local vegetation.',
    type: 'disaster',
    disasterType: 'tornado',
    rarity: 'common',
    level: 1,
    effects: {
      foodChain: -3,
      resources: -5,
      humanActivity: -2
    },
    severity: 'mild'
  },
  {
    id: 'tornado_severe',
    name: 'Category F5 Tornado',
    description: 'Massive tornado destroys everything in its path.',
    type: 'disaster',
    disasterType: 'tornado',
    rarity: 'rare',
    level: 3,
    effects: {
      foodChain: -20,
      resources: -20,
      humanActivity: -30
    },
    severity: 'severe',
    locationMultiplier: {
      'USA': 1.5, // Tornado Alley
      'Japan': 0.8,
      'Norway': 0.3
    }
  }
];

// Predefined positive cards
export const POSITIVE_CARDS: PositiveCard[] = [
  {
    id: 'prophecy',
    name: 'Prophecy',
    description: 'Peer into the future and see the next 5 cards in your deck.',
    type: 'positive',
    positiveType: 'prophecy',
    rarity: 'uncommon',
    level: 1,
    effects: {},
    special: {
      type: 'prophecy',
      value: 5 // Number of cards to reveal
    }
  },
  {
    id: 'rainy_day',
    name: 'Perfect Weather',
    description: 'Ideal conditions boost all ecosystem components.',
    type: 'positive',
    positiveType: 'rainyDay',
    rarity: 'common',
    level: 1,
    effects: {
      foodChain: 15,
      resources: 25, // 25% resource bonus as mentioned
      humanActivity: 10
    }
  },
  {
    id: 'conservation_grant',
    name: 'Conservation Grant',
    description: 'Government funding supports environmental protection initiatives.',
    type: 'positive',
    positiveType: 'rainyDay',
    rarity: 'uncommon',
    level: 2,
    effects: {
      resources: 20,
      humanActivity: -10 // Reduces harmful activities
    }
  },
  {
    id: 'species_discovery',
    name: 'New Species Discovery',
    description: 'Scientists discover new species, boosting biodiversity research.',
    type: 'positive',
    positiveType: 'rainyDay',
    rarity: 'rare',
    level: 2,
    effects: {
      foodChain: 20,
      resources: 10
    }
  }
];

export const ALL_CARDS: Card[] = [...DISASTER_CARDS, ...POSITIVE_CARDS];

// Deck building utilities
export function buildDeckForLevel(level: number): Card[] {
  const availableCards = ALL_CARDS.filter(card => card.level <= level);
  const deck: Card[] = [];
  
  // Add cards based on rarity and level
  availableCards.forEach(card => {
    let copies = 1;
    
    // More copies of common cards, fewer of rare cards
    switch (card.rarity) {
      case 'common':
        copies = Math.min(3, level);
        break;
      case 'uncommon':
        copies = Math.min(2, Math.max(1, level - 1));
        break;
      case 'rare':
        copies = level >= 3 ? 1 : 0;
        break;
      case 'legendary':
        copies = level >= 5 ? 1 : 0;
        break;
    }
    
    for (let i = 0; i < copies; i++) {
      deck.push({...card, id: `${card.id}_${i}`}); // Unique IDs for copies
    }
  });
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Apply disaster multiplier based on country
export function getDisasterMultiplier(card: DisasterCard, country: string): number {
  return card.locationMultiplier?.[country] || 1.0;
}