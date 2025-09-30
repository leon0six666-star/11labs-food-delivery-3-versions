// SAMPLE ENHANCED NUTRITION DATA FOR SPECIALIZED SCENARIOS
// This shows how we'll upgrade ALL menu items for revolutionary voice experiences

import { MenuItem } from './src/data/mockData';

// EXAMPLE 1: GYM BRO FRIENDLY FOODS
const bulgogiBulking: MenuItem = {
  id: "36",
  name: "Bulgogi", 
  description: "Marinated grilled beef with vegetables and steamed rice",
  price: 18.99,
  category: "Main Dishes",
  popular: true,
  ingredients: ["Marinated Beef", "Onions", "Scallions", "Sesame", "Rice"],
  
  // COMPLETE NUTRITION DATA
  nutrition: {
    calories: 850,     // High calorie for bulking
    protein: 42,       // High protein for muscle building
    carbs: 65,         // Good carbs for energy
    fat: 28,           // Healthy fats
    fiber: 4,
    sugar: 12,
    sodium: 1200,
    iron: 4.5,         // Iron for blood oxygen
    calcium: 80        // Bone health
  },
  
  // FITNESS PROFILE
  fitnessProfile: {
    isBulking: true,        // Perfect for muscle gain
    isPostWorkout: true,    // Protein + carbs for recovery
    isEndurance: false      // Too heavy for endurance
  },
  
  // HEALTH PROFILE  
  healthProfile: {
    isPregnancySafe: true,     // No raw ingredients
    isDiabeticFriendly: false, // High carbs
    isHeartHealthy: false,     // Higher sodium
    isKidFriendly: true        // Mild flavors
  },
  
  allergens: ['soy', 'sesame'],
  dietaryTags: ['high-protein', 'muscle-building']
};

// EXAMPLE 2: PREGNANCY SUPERFOOD
const salmonSashimi: MenuItem = {
  id: "20",
  name: "Salmon Sashimi",
  description: "Fresh Atlantic salmon, 6 pieces",
  price: 14.99,
  category: "Sashimi",
  ingredients: ["Fresh Salmon"],
  
  nutrition: {
    calories: 220,
    protein: 32,       // Excellent protein
    carbs: 0,          // Zero carbs
    fat: 9,            // Omega-3 rich
    fiber: 0,
    sugar: 0,
    sodium: 85,        // Low sodium
    iron: 1.2,
    calcium: 15,
    folate: 35         // CRITICAL for pregnancy brain development
  },
  
  fitnessProfile: {
    isCutting: true,        // High protein, low calorie
    isPostWorkout: true,    // Excellent recovery food
    isBulking: false        // Too low calorie for bulking
  },
  
  healthProfile: {
    isPregnancySafe: false,    // RAW FISH = DANGER for pregnancy
    isDiabeticFriendly: true,  // Zero carbs
    isHeartHealthy: true,      // Omega-3, low sodium
    isAntiInflammatory: true   // Omega-3 anti-inflammatory
  },
  
  allergens: ['fish'],
  dietaryTags: ['keto', 'omega-3', 'anti-inflammatory']
};

// EXAMPLE 3: DIABETIC-FRIENDLY OPTION
const greekSalad: MenuItem = {
  id: "41",
  name: "Greek Salad",
  description: "Mixed greens, feta cheese, olives, tomatoes, cucumber, olive oil dressing",
  price: 11.99,
  category: "Salads",
  isVegetarian: true,
  popular: true,
  ingredients: ["Mixed Greens", "Feta", "Olives", "Tomatoes", "Cucumber"],
  
  nutrition: {
    calories: 280,
    protein: 12,
    carbs: 15,         // LOW CARBS for diabetics
    fat: 22,           // Healthy olive oil fats
    fiber: 8,          // High fiber slows glucose absorption
    sugar: 9,          // Natural vegetable sugars
    sodium: 650,
    iron: 2.1,
    calcium: 180,      // High calcium from feta
    folate: 85
  },
  
  fitnessProfile: {
    isCutting: true,        // Low calorie, high nutrition
    isPreWorkout: false,    // Too heavy with fats
    isEndurance: false      // Not enough carbs for endurance
  },
  
  healthProfile: {
    isPregnancySafe: true,     // All safe ingredients
    isDiabeticFriendly: true,  // LOW CARBS, high fiber
    isHeartHealthy: true,      // Mediterranean diet
    isAntiInflammatory: true,  // Olive oil, vegetables
    isKidFriendly: false       // Strong feta flavor
  },
  
  allergens: ['dairy'],
  dietaryTags: ['mediterranean', 'low-carb', 'diabetic-friendly', 'anti-inflammatory']
};

// EXAMPLE 4: PRE-WORKOUT ENERGY
const oatmealBowl: MenuItem = {
  id: "49",
  name: "Power Oatmeal Bowl",
  description: "Steel-cut oats with banana, berries, and honey",
  price: 8.99,
  category: "Breakfast",
  isVegetarian: true,
  ingredients: ["Steel-cut Oats", "Banana", "Mixed Berries", "Honey"],
  
  nutrition: {
    calories: 320,
    protein: 8,
    carbs: 65,         // HIGH CARBS for energy
    fat: 4,            // Low fat for easy digestion
    fiber: 12,         // High fiber for sustained energy
    sugar: 25,         // Natural fruit sugars
    sodium: 25,        // Very low sodium
    iron: 3.2,
    calcium: 60,
    folate: 45
  },
  
  fitnessProfile: {
    isPreWorkout: true,     // PERFECT pre-workout fuel
    isEndurance: true,      // Sustained carb energy
    isPostWorkout: false,   // Not enough protein for recovery
    isBulking: false        // Too low calorie
  },
  
  healthProfile: {
    isPregnancySafe: true,     // All natural, safe
    isDiabeticFriendly: false, // High carbs (but fiber helps)
    isHeartHealthy: true,      // Oats lower cholesterol
    isKidFriendly: true,       // Sweet, mild flavors
    isAntiInflammatory: true   // Berries have antioxidants
  },
  
  allergens: ['gluten'],
  dietaryTags: ['pre-workout', 'whole-grain', 'antioxidants']
};

// EXAMPLE VOICE COMMANDS FOR SPECIALIZED SCENARIOS:

export const nutritionScenarios = {
  
  // GYM BRO SCENARIO
  "I'm bulking, need 3000 calories": {
    filters: {
      minCalories: 800,
      minProtein: 30,
      fitnessProfile: { isBulking: true }
    },
    suggestions: [bulgogiBulking, "Double Bacon Burger", "Protein Smoothie Bowl"]
  },
  
  // PREGNANCY SCENARIO
  "I'm pregnant and need iron and folate": {
    filters: {
      healthProfile: { isPregnancySafe: true },
      minIron: 2,
      minFolate: 30
    },
    avoid: ["raw fish", "alcohol", "high mercury fish"],
    suggestions: ["Spinach dishes", "Fortified cereals", "Lean meats"]
  },
  
  // DIABETIC SCENARIO
  "I'm diabetic, keep carbs under 30g": {
    filters: {
      maxCarbs: 30,
      healthProfile: { isDiabeticFriendly: true }
    },
    suggestions: [greekSalad, "Grilled Chicken", "Vegetable dishes"]
  },
  
  // PRE-WORKOUT SCENARIO
  "Pre-workout meal in 1 hour": {
    filters: {
      fitnessProfile: { isPreWorkout: true },
      maxFat: 10,  // Easy digestion
      minCarbs: 40 // Energy needs
    },
    suggestions: [oatmealBowl, "Banana with peanut butter", "Energy smoothie"]
  },
  
  // ANTI-INFLAMMATORY SCENARIO
  "I have joint pain, need anti-inflammatory foods": {
    filters: {
      healthProfile: { isAntiInflammatory: true },
      dietaryTags: ['omega-3', 'antioxidants']
    },
    suggestions: ["Salmon dishes", "Berry smoothies", "Turmeric curry"]
  }
};

// REVOLUTIONARY VOICE EXPERIENCES:
export const voiceExamples = [
  
  // COMPLEX NUTRITION GOAL
  {
    voice: "I'm 6 months pregnant, craving something sweet but need folate",
    ai_response: "Perfect! I found a Mango Sticky Rice that's pregnancy-safe with added spinach for folate, plus a Berry Smoothie with fortified yogurt. Both satisfy cravings while supporting baby's development.",
    calories: 580,
    folate: "125mcg (31% daily value for pregnancy)"
  },
  
  // GYM PERFORMANCE
  {
    voice: "Post-workout meal, I need 40g protein within 30 minutes", 
    ai_response: "Got it! Korean BBQ Bowl with extra protein - 42g protein, plus chocolate protein smoothie. Total 58g protein for optimal muscle recovery.",
    timing: "Fast delivery restaurants prioritized",
    macros: "58g protein, 45g carbs, 18g fat"
  },
  
  // DIABETIC MANAGEMENT
  {
    voice: "My blood sugar is high, I need something filling under 20g carbs",
    ai_response: "I've curated a Mediterranean feast: Greek Salad (15g carbs) with grilled chicken (0g carbs). High fiber and protein will help stabilize your levels.",
    bloodSugar: "Low glycemic index",
    carbs: "15g net carbs after fiber"
  }
];

export default nutritionScenarios;