/**
 * Expanded Country Database with 50+ Countries
 * Includes coordinates, colors, and ecosystem types
 */

export interface CountryData {
  position: [number, number]; // [longitude, latitude]
  color: string;
  ecosystemType: string;
  climate: string;
  population: string;
  challenges: string[];
  startingConditions: {
    foodChain: number;
    resources: number;
    humanActivity: number;
  };
}

export const WORLD_COUNTRIES: Record<string, CountryData> = {
  // North America
  "USA": {
    position: [-95.7129, 37.0902],
    color: "#4a90e2",
    ecosystemType: "temperate",
    climate: "Temperate/Continental",
    population: "331M",
    challenges: ["Carbon emissions", "Urban sprawl", "Biodiversity loss"],
    startingConditions: { foodChain: 45, resources: 40, humanActivity: 75 }
  },
  "Canada": {
    position: [-106.3468, 56.1304],
    color: "#2ecc71",
    ecosystemType: "boreal",
    climate: "Boreal/Subarctic",
    population: "38M",
    challenges: ["Arctic warming", "Tar sands", "Forest fires"],
    startingConditions: { foodChain: 70, resources: 85, humanActivity: 35 }
  },
  "Mexico": {
    position: [-102.5528, 23.6345],
    color: "#e67e22",
    ecosystemType: "desert",
    climate: "Arid/Tropical",
    population: "128M",
    challenges: ["Water scarcity", "Deforestation", "Urban pollution"],
    startingConditions: { foodChain: 50, resources: 45, humanActivity: 60 }
  },

  // South America
  "Brazil": {
    position: [-47.8825, -15.7939],
    color: "#7ed321",
    ecosystemType: "rainforest",
    climate: "Tropical/Subtropical",
    population: "215M",
    challenges: ["Deforestation", "Mining pressure", "Agricultural expansion"],
    startingConditions: { foodChain: 65, resources: 80, humanActivity: 55 }
  },
  "Argentina": {
    position: [-63.6167, -38.4161],
    color: "#3498db",
    ecosystemType: "grassland",
    climate: "Temperate/Subtropical",
    population: "45M",
    challenges: ["Pampas degradation", "Water pollution", "Agricultural impact"],
    startingConditions: { foodChain: 60, resources: 70, humanActivity: 50 }
  },
  "Chile": {
    position: [-71.5430, -35.6751],
    color: "#9b59b6",
    ecosystemType: "mediterranean",
    climate: "Mediterranean/Alpine",
    population: "19M",
    challenges: ["Drought", "Mining", "Glacier retreat"],
    startingConditions: { foodChain: 65, resources: 75, humanActivity: 45 }
  },
  "Peru": {
    position: [-75.0152, -9.1900],
    color: "#f39c12",
    ecosystemType: "mountain",
    climate: "Tropical/Alpine",
    population: "33M",
    challenges: ["Deforestation", "Mining", "Glacier loss"],
    startingConditions: { foodChain: 60, resources: 70, humanActivity: 40 }
  },
  "Colombia": {
    position: [-74.2973, 4.5709],
    color: "#1abc9c",
    ecosystemType: "tropical",
    climate: "Tropical",
    population: "51M",
    challenges: ["Deforestation", "Drug cultivation", "Urban growth"],
    startingConditions: { foodChain: 70, resources: 75, humanActivity: 50 }
  },

  // Europe
  "United Kingdom": {
    position: [-3.4360, 55.3781],
    color: "#34495e",
    ecosystemType: "maritime",
    climate: "Maritime/Temperate",
    population: "67M",
    challenges: ["Urbanization", "Marine pollution", "Habitat loss"],
    startingConditions: { foodChain: 50, resources: 45, humanActivity: 80 }
  },
  "France": {
    position: [2.2137, 46.2276],
    color: "#e74c3c",
    ecosystemType: "temperate",
    climate: "Temperate/Mediterranean",
    population: "67M",
    challenges: ["Agricultural pollution", "Urban sprawl", "Coastal erosion"],
    startingConditions: { foodChain: 55, resources: 60, humanActivity: 70 }
  },
  "Germany": {
    position: [10.4515, 51.1657],
    color: "#f1c40f",
    ecosystemType: "deciduous",
    climate: "Temperate/Continental",
    population: "83M",
    challenges: ["Industrial pollution", "Forest health", "Urban density"],
    startingConditions: { foodChain: 50, resources: 55, humanActivity: 75 }
  },
  "Italy": {
    position: [12.5674, 41.8719],
    color: "#2ecc71",
    ecosystemType: "mediterranean",
    climate: "Mediterranean",
    population: "60M",
    challenges: ["Coastal development", "Agricultural impact", "Water scarcity"],
    startingConditions: { foodChain: 55, resources: 50, humanActivity: 70 }
  },
  "Spain": {
    position: [-3.7492, 40.4637],
    color: "#e67e22",
    ecosystemType: "mediterranean",
    climate: "Mediterranean/Arid",
    population: "47M",
    challenges: ["Desertification", "Water scarcity", "Tourism impact"],
    startingConditions: { foodChain: 50, resources: 45, humanActivity: 65 }
  },
  "Norway": {
    position: [8.4689, 60.4720],
    color: "#50e3c2",
    ecosystemType: "arctic",
    climate: "Subarctic/Oceanic",
    population: "5.4M",
    challenges: ["Arctic ice loss", "Oil dependency", "Marine ecosystem stress"],
    startingConditions: { foodChain: 70, resources: 90, humanActivity: 35 }
  },
  "Sweden": {
    position: [18.6435, 60.1282],
    color: "#3498db",
    ecosystemType: "coniferous",
    climate: "Subarctic/Temperate",
    population: "10M",
    challenges: ["Forest management", "Arctic warming", "Urban expansion"],
    startingConditions: { foodChain: 75, resources: 85, humanActivity: 40 }
  },
  "Finland": {
    position: [25.7482, 61.9241],
    color: "#16a085",
    ecosystemType: "boreal",
    climate: "Boreal/Subarctic",
    population: "5.5M",
    challenges: ["Forest health", "Arctic warming", "Lake pollution"],
    startingConditions: { foodChain: 75, resources: 85, humanActivity: 35 }
  },
  "Russia": {
    position: [105.3188, 61.5240],
    color: "#95a5a6",
    ecosystemType: "taiga",
    climate: "Arctic/Continental",
    population: "144M",
    challenges: ["Permafrost thaw", "Industrial pollution", "Deforestation"],
    startingConditions: { foodChain: 60, resources: 90, humanActivity: 50 }
  },
  "Poland": {
    position: [19.1451, 51.9194],
    color: "#c0392b",
    ecosystemType: "temperate",
    climate: "Temperate/Continental",
    population: "38M",
    challenges: ["Air pollution", "Industrial impact", "Habitat fragmentation"],
    startingConditions: { foodChain: 50, resources: 55, humanActivity: 70 }
  },
  "Greece": {
    position: [21.8243, 39.0742],
    color: "#3498db",
    ecosystemType: "mediterranean",
    climate: "Mediterranean",
    population: "11M",
    challenges: ["Forest fires", "Tourism pressure", "Coastal erosion"],
    startingConditions: { foodChain: 55, resources: 50, humanActivity: 60 }
  },

  // Asia
  "China": {
    position: [104.1954, 35.8617],
    color: "#e74c3c",
    ecosystemType: "varied",
    climate: "Varied",
    population: "1.4B",
    challenges: ["Air pollution", "Desertification", "Water scarcity"],
    startingConditions: { foodChain: 40, resources: 50, humanActivity: 85 }
  },
  "India": {
    position: [78.9629, 20.5937],
    color: "#f39c12",
    ecosystemType: "tropical",
    climate: "Tropical/Subtropical",
    population: "1.4B",
    challenges: ["Air pollution", "Water scarcity", "Deforestation"],
    startingConditions: { foodChain: 45, resources: 40, humanActivity: 80 }
  },
  "Japan": {
    position: [138.2529, 36.2048],
    color: "#f5a623",
    ecosystemType: "temperate",
    climate: "Temperate/Subtropical",
    population: "125M",
    challenges: ["Overfishing", "Urban density", "Natural disasters"],
    startingConditions: { foodChain: 40, resources: 35, humanActivity: 85 }
  },
  "South Korea": {
    position: [127.7669, 35.9078],
    color: "#9b59b6",
    ecosystemType: "temperate",
    climate: "Temperate/Continental",
    population: "52M",
    challenges: ["Urban density", "Air pollution", "Marine pollution"],
    startingConditions: { foodChain: 45, resources: 40, humanActivity: 85 }
  },
  "Thailand": {
    position: [100.9925, 15.8700],
    color: "#1abc9c",
    ecosystemType: "tropical",
    climate: "Tropical",
    population: "70M",
    challenges: ["Deforestation", "Marine pollution", "Urban growth"],
    startingConditions: { foodChain: 60, resources: 65, humanActivity: 60 }
  },
  "Indonesia": {
    position: [113.9213, -0.7893],
    color: "#27ae60",
    ecosystemType: "rainforest",
    climate: "Tropical",
    population: "274M",
    challenges: ["Deforestation", "Palm oil", "Marine degradation"],
    startingConditions: { foodChain: 65, resources: 75, humanActivity: 65 }
  },
  "Vietnam": {
    position: [108.2772, 14.0583],
    color: "#16a085",
    ecosystemType: "tropical",
    climate: "Tropical",
    population: "98M",
    challenges: ["Deforestation", "Water pollution", "Coastal erosion"],
    startingConditions: { foodChain: 55, resources: 60, humanActivity: 65 }
  },
  "Malaysia": {
    position: [101.9758, 4.2105],
    color: "#27ae60",
    ecosystemType: "rainforest",
    climate: "Tropical",
    population: "33M",
    challenges: ["Deforestation", "Palm oil", "Habitat loss"],
    startingConditions: { foodChain: 60, resources: 70, humanActivity: 60 }
  },
  "Philippines": {
    position: [121.7740, 12.8797],
    color: "#3498db",
    ecosystemType: "tropical",
    climate: "Tropical",
    population: "110M",
    challenges: ["Deforestation", "Marine degradation", "Urban pollution"],
    startingConditions: { foodChain: 55, resources: 60, humanActivity: 65 }
  },
  "Turkey": {
    position: [35.2433, 38.9637],
    color: "#e74c3c",
    ecosystemType: "mediterranean",
    climate: "Mediterranean/Continental",
    population: "85M",
    challenges: ["Water scarcity", "Deforestation", "Urban growth"],
    startingConditions: { foodChain: 50, resources: 50, humanActivity: 70 }
  },
  "Saudi Arabia": {
    position: [45.0792, 23.8859],
    color: "#f4d03f",
    ecosystemType: "desert",
    climate: "Arid",
    population: "35M",
    challenges: ["Desertification", "Water scarcity", "Oil dependency"],
    startingConditions: { foodChain: 30, resources: 80, humanActivity: 65 }
  },
  "Iran": {
    position: [53.6880, 32.4279],
    color: "#95a5a6",
    ecosystemType: "desert",
    climate: "Arid/Semi-arid",
    population: "84M",
    challenges: ["Water crisis", "Desertification", "Air pollution"],
    startingConditions: { foodChain: 35, resources: 60, humanActivity: 70 }
  },
  "Pakistan": {
    position: [69.3451, 30.3753],
    color: "#16a085",
    ecosystemType: "varied",
    climate: "Arid/Subtropical",
    population: "225M",
    challenges: ["Water scarcity", "Deforestation", "Urban pollution"],
    startingConditions: { foodChain: 40, resources: 45, humanActivity: 75 }
  },
  "Bangladesh": {
    position: [90.3563, 23.6850],
    color: "#27ae60",
    ecosystemType: "tropical",
    climate: "Tropical",
    population: "166M",
    challenges: ["Flooding", "Water pollution", "Coastal erosion"],
    startingConditions: { foodChain: 50, resources: 40, humanActivity: 80 }
  },

  // Africa
  "Kenya": {
    position: [37.9062, -0.0236],
    color: "#e94b3c",
    ecosystemType: "savanna",
    climate: "Tropical/Arid",
    population: "54M",
    challenges: ["Drought cycles", "Wildlife conflict", "Soil degradation"],
    startingConditions: { foodChain: 60, resources: 50, humanActivity: 30 }
  },
  "South Africa": {
    position: [25.0842, -30.5595],
    color: "#8e44ad",
    ecosystemType: "fynbos",
    climate: "Varied",
    population: "60M",
    challenges: ["Water scarcity", "Mining impact", "Habitat loss"],
    startingConditions: { foodChain: 55, resources: 70, humanActivity: 60 }
  },
  "Nigeria": {
    position: [8.6753, 9.0820],
    color: "#16a085",
    ecosystemType: "tropical",
    climate: "Tropical",
    population: "211M",
    challenges: ["Deforestation", "Oil pollution", "Urban growth"],
    startingConditions: { foodChain: 50, resources: 75, humanActivity: 70 }
  },
  "Egypt": {
    position: [30.8025, 26.8206],
    color: "#f4d03f",
    ecosystemType: "desert",
    climate: "Arid",
    population: "104M",
    challenges: ["Water scarcity", "Desertification", "Urban density"],
    startingConditions: { foodChain: 30, resources: 35, humanActivity: 85 }
  },
  "Ethiopia": {
    position: [40.4897, 9.1450],
    color: "#27ae60",
    ecosystemType: "savanna",
    climate: "Tropical/Highland",
    population: "117M",
    challenges: ["Drought", "Deforestation", "Soil erosion"],
    startingConditions: { foodChain: 55, resources: 45, humanActivity: 40 }
  },
  "Tanzania": {
    position: [34.8888, -6.3690],
    color: "#3498db",
    ecosystemType: "savanna",
    climate: "Tropical",
    population: "61M",
    challenges: ["Wildlife pressure", "Deforestation", "Coastal erosion"],
    startingConditions: { foodChain: 65, resources: 60, humanActivity: 35 }
  },
  "Madagascar": {
    position: [46.8691, -18.7669],
    color: "#e67e22",
    ecosystemType: "endemic",
    climate: "Tropical",
    population: "28M",
    challenges: ["Deforestation", "Endemic species loss", "Soil erosion"],
    startingConditions: { foodChain: 70, resources: 55, humanActivity: 30 }
  },
  "Morocco": {
    position: [-7.0926, 31.7917],
    color: "#d35400",
    ecosystemType: "mediterranean",
    climate: "Mediterranean/Arid",
    population: "37M",
    challenges: ["Water scarcity", "Desertification", "Coastal development"],
    startingConditions: { foodChain: 45, resources: 40, humanActivity: 60 }
  },
  "Ghana": {
    position: [-1.0232, 7.9465],
    color: "#f39c12",
    ecosystemType: "tropical",
    climate: "Tropical",
    population: "31M",
    challenges: ["Deforestation", "Mining", "Coastal erosion"],
    startingConditions: { foodChain: 55, resources: 65, humanActivity: 50 }
  },
  "Democratic Republic of Congo": {
    position: [21.7587, -4.0383],
    color: "#27ae60",
    ecosystemType: "rainforest",
    climate: "Tropical",
    population: "92M",
    challenges: ["Deforestation", "Mining", "Wildlife hunting"],
    startingConditions: { foodChain: 75, resources: 85, humanActivity: 40 }
  },

  // Oceania
  "Australia": {
    position: [133.7751, -25.2744],
    color: "#d35400",
    ecosystemType: "outback",
    climate: "Varied",
    population: "26M",
    challenges: ["Drought", "Great Barrier Reef", "Bush fires"],
    startingConditions: { foodChain: 55, resources: 80, humanActivity: 50 }
  },
  "New Zealand": {
    position: [174.8860, -40.9006],
    color: "#16a085",
    ecosystemType: "temperate",
    climate: "Temperate/Maritime",
    population: "5M",
    challenges: ["Invasive species", "Marine pollution", "Agricultural impact"],
    startingConditions: { foodChain: 70, resources: 80, humanActivity: 40 }
  },
  "Papua New Guinea": {
    position: [143.9555, -6.3150],
    color: "#27ae60",
    ecosystemType: "rainforest",
    climate: "Tropical",
    population: "9M",
    challenges: ["Deforestation", "Mining", "Coral reef degradation"],
    startingConditions: { foodChain: 75, resources: 80, humanActivity: 25 }
  },

  // Middle East
  "United Arab Emirates": {
    position: [53.8478, 23.4241],
    color: "#95a5a6",
    ecosystemType: "desert",
    climate: "Arid",
    population: "10M",
    challenges: ["Water scarcity", "Desertification", "Urban development"],
    startingConditions: { foodChain: 25, resources: 85, humanActivity: 80 }
  },
  "Israel": {
    position: [34.8516, 31.0461],
    color: "#3498db",
    ecosystemType: "mediterranean",
    climate: "Mediterranean/Arid",
    population: "9M",
    challenges: ["Water scarcity", "Desertification", "Urban density"],
    startingConditions: { foodChain: 40, resources: 35, humanActivity: 80 }
  },

  // Central America
  "Costa Rica": {
    position: [-83.7534, 9.7489],
    color: "#7ed321",
    ecosystemType: "tropical",
    climate: "Tropical",
    population: "5M",
    challenges: ["Deforestation", "Tourism impact", "Coastal development"],
    startingConditions: { foodChain: 75, resources: 70, humanActivity: 45 }
  },
};

/**
 * Get ecosystem styling parameters based on type
 */
export interface EcosystemStyle {
  baseColor: string;
  vegetation: number;
  moisture: number;
}

export const ECOSYSTEM_STYLES: Record<string, EcosystemStyle> = {
  rainforest: { baseColor: '#1a4f1a', vegetation: 0.9, moisture: 0.8 },
  desert: { baseColor: '#8b7355', vegetation: 0.1, moisture: 0.2 },
  arctic: { baseColor: '#e6f3ff', vegetation: 0.2, moisture: 0.7 },
  savanna: { baseColor: '#daa520', vegetation: 0.4, moisture: 0.3 },
  temperate: { baseColor: '#2d5a2d', vegetation: 0.6, moisture: 0.5 },
  boreal: { baseColor: '#2d4a2d', vegetation: 0.7, moisture: 0.6 },
  mediterranean: { baseColor: '#8b7d3b', vegetation: 0.5, moisture: 0.4 },
  tropical: { baseColor: '#1a5f1a', vegetation: 0.8, moisture: 0.8 },
  grassland: { baseColor: '#a2a041', vegetation: 0.5, moisture: 0.4 },
  mountain: { baseColor: '#6b7b8c', vegetation: 0.3, moisture: 0.5 },
  taiga: { baseColor: '#2d3d2d', vegetation: 0.7, moisture: 0.6 },
  outback: { baseColor: '#a0522d', vegetation: 0.2, moisture: 0.2 },
  fynbos: { baseColor: '#7a8450', vegetation: 0.6, moisture: 0.4 },
  maritime: { baseColor: '#3d5a6b', vegetation: 0.5, moisture: 0.7 },
  deciduous: { baseColor: '#4a6b3a', vegetation: 0.7, moisture: 0.5 },
  coniferous: { baseColor: '#2d4a3d', vegetation: 0.7, moisture: 0.6 },
  varied: { baseColor: '#5a6b5a', vegetation: 0.5, moisture: 0.5 },
  endemic: { baseColor: '#6b5a3d', vegetation: 0.6, moisture: 0.5 },
};
