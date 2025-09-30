// Comprehensive mock data for food delivery app

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export interface Schedule {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  // ENHANCED DIETARY RESTRICTIONS
  isSoyFree?: boolean;
  isDairyFree?: boolean;
  isNutFree?: boolean;
  isShellfishFree?: boolean;
  isEggFree?: boolean;
  isKeto?: boolean;
  isPaleo?: boolean;
  isLowCarb?: boolean;
  isLowSodium?: boolean;
  isHalal?: boolean;
  isKosher?: boolean;
  // ALLERGEN INFORMATION
  allergens?: string[]; // ['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'shellfish', 'fish']
  // TEXTURE/SENIOR CONSIDERATIONS
  isEasyChew?: boolean; // Suitable for seniors or dental issues
  isLowSodium?: boolean; // Heart healthy, senior-friendly
  calories?: number;
  ingredients?: string[];
  popular?: boolean;
  // ENHANCED NUTRITION DATA FOR AI SCENARIOS
  nutrition: {
    calories: number;
    protein: number; // grams
    carbs: number;   // grams  
    fat: number;     // grams
    fiber: number;   // grams
    sugar: number;   // grams
    sodium: number;  // mg
    iron?: number;   // mg (for pregnancy)
    calcium?: number; // mg (for bone health)
    folate?: number; // mcg (for pregnancy)
  };
  // SPECIALIZED SCENARIO TAGS
  fitnessProfile?: {
    isPreWorkout?: boolean;    // Quick energy, easy digestion
    isPostWorkout?: boolean;   // Protein + carbs for recovery
    isBulking?: boolean;       // High calorie, high protein
    isCutting?: boolean;       // High protein, lower calorie
    isEndurance?: boolean;     // Complex carbs, sustained energy
  };
  healthProfile?: {
    isPregnancySafe?: boolean; // No raw fish, alcohol, high mercury
    isDiabeticFriendly?: boolean; // Low glycemic index
    isHeartHealthy?: boolean;  // Low sodium, healthy fats
    isAntiInflammatory?: boolean; // Omega-3, antioxidants
    isKidFriendly?: boolean;   // Mild flavors, familiar foods
  };
  allergens?: string[];   // 'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish'
  dietaryTags?: string[]; // 'keto', 'paleo', 'whole30', 'mediterranean', 'anti-inflammatory'
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  category_id: number;
  avg_rating: number;
  total_reviews: number;
  delivery_time_min: number;
  delivery_time_max: number;
  price_range: string;
  is_open: boolean;
  image: string;
  featured_items: string[];
  tags: string[];
  delivery_fee: number;
  min_order: number;
  promoted: boolean;
  distance?: number;
  schedule: Schedule;
  menu: MenuItem[];
  coverImage?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

// Helper function to calculate if restaurant is currently open
const isRestaurantOpen = (schedule: Schedule): boolean => {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = dayNames[now.getDay()];
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const todaySchedule = schedule[today];
  if (!todaySchedule) return false;
  
  const openTime = parseInt(todaySchedule.open.replace(':', ''));
  const closeTime = parseInt(todaySchedule.close.replace(':', ''));
  
  return currentTime >= openTime && currentTime <= closeTime;
};

// Categories
export const categories: Category[] = [
  { id: 1, name: "Italian", description: "Pizza, pasta, and Mediterranean delights", icon: "🍝" },
  { id: 2, name: "Chinese", description: "Authentic Asian flavors and dim sum", icon: "🥡" },
  { id: 3, name: "American", description: "Burgers, fries, and classic comfort food", icon: "🍔" },
  { id: 4, name: "Japanese", description: "Sushi, ramen, and Japanese cuisine", icon: "🍣" },
  { id: 5, name: "Indian", description: "Spicy curries and aromatic dishes", icon: "🍛" },
  { id: 6, name: "Mexican", description: "Tacos, burritos, and fresh salsas", icon: "🌮" },
  { id: 7, name: "Thai", description: "Authentic Thai flavors and spices", icon: "🍜" },
  { id: 8, name: "Mediterranean", description: "Healthy Mediterranean cuisine", icon: "🥙" },
  { id: 9, name: "Korean", description: "Korean BBQ and comfort food", icon: "🍖" },
  { id: 10, name: "French", description: "Classic French cuisine", icon: "🥐" },
];

// Expanded restaurant data
export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Bella Vista Pizza",
    description: "Authentic wood-fired pizzas made with imported Italian ingredients. Family-owned since 1952.",
    address: "123 Oak Street, Downtown, NY 10001",
    phone: "+1 (555) 123-4567",
    latitude: 40.7128,
    longitude: -74.0060,
    category_id: 1,
    cuisine: "italian",
    avg_rating: 4.8,
    total_reviews: 324,
    delivery_time_min: 25,
    delivery_time_max: 35,
    price_range: "$$",
    is_open: true,
    image: "🍕",
    featured_items: ["Margherita Pizza", "Truffle Pasta", "Tiramisu"],
    tags: ["Pizza", "Pasta", "Wine", "Family-friendly", "Authentic"],
    delivery_fee: 2.99,
    min_order: 15.00,
    promoted: true,
    schedule: {
      monday: { open: "11:00", close: "22:00", isOpen: true },
      tuesday: { open: "11:00", close: "22:00", isOpen: true },
      wednesday: { open: "11:00", close: "22:00", isOpen: true },
      thursday: { open: "11:00", close: "22:00", isOpen: true },
      friday: { open: "11:00", close: "23:00", isOpen: true },
      saturday: { open: "11:00", close: "23:00", isOpen: true },
      sunday: { open: "12:00", close: "21:00", isOpen: true }
    },
    menu: [
      // Pizzas
      {
        id: "1",
        name: "Margherita Pizza",
        description: "Classic pizza with fresh tomato sauce and mozzarella",
        price: 18.99,
        category: "Pizza",
        isVegetarian: true,
        popular: true,
        ingredients: ["Tomato sauce", "mozzarella cheese", "fresh basil", "olive oil"]
      },
      {
        id: "2",
        name: "Pepperoni Pizza",
        description: "Spicy pepperoni with rich tomato sauce",
        price: 21.99,
        category: "Pizza",
        popular: true,
        ingredients: ["Tomato sauce", "mozzarella", "pepperoni", "oregano"]
      },
      {
        id: "3",
        name: "Quattro Formaggi",
        description: "Blend of four cheeses for a creamy delight",
        price: 24.99,
        category: "Pizza",
        isVegetarian: true,
        ingredients: ["Mozzarella", "gorgonzola", "parmesan", "fontina", "olive oil"]
      },
      {
        id: "4",
        name: "Veggie Supreme",
        description: "Loaded with fresh vegetables",
        price: 22.99,
        category: "Pizza",
        isVegetarian: true,
        ingredients: ["Tomato sauce", "mozzarella", "bell peppers", "mushrooms", "olives", "onions"]
      },
      {
        id: "5",
        name: "Prosciutto e Funghi",
        description: "Ham and mushroom classic",
        price: 25.99,
        category: "Pizza",
        ingredients: ["Tomato sauce", "mozzarella", "prosciutto", "mushrooms"]
      },
      // Pastas
      {
        id: "6",
        name: "Spaghetti Carbonara",
        description: "Creamy egg-based sauce with pancetta",
        price: 19.99,
        category: "Pasta",
        popular: true,
        ingredients: ["Spaghetti", "eggs", "pecorino cheese", "pancetta", "black pepper"]
      },
      {
        id: "7",
        name: "Fusilli Pesto",
        description: "Fresh basil pesto with spiral pasta",
        price: 17.99,
        category: "Pasta",
        isVegetarian: true,
        ingredients: ["Fusilli", "basil", "pine nuts", "parmesan", "garlic", "olive oil"]
      },
      {
        id: "8",
        name: "Lasagna Bolognese",
        description: "Layered pasta with meat sauce",
        price: 23.99,
        category: "Pasta",
        popular: true,
        ingredients: ["Lasagna noodles", "beef ragu", "béchamel", "mozzarella", "parmesan"]
      },
      {
        id: "9",
        name: "Penne Arrabbiata",
        description: "Spicy tomato sauce with a kick",
        price: 16.99,
        category: "Pasta",
        isSpicy: true,
        isVegetarian: true,
        ingredients: ["Penne", "tomatoes", "chili flakes", "garlic", "parsley"]
      },
      {
        id: "10",
        name: "Ravioli Ricotta",
        description: "Stuffed pasta with creamy ricotta",
        price: 20.99,
        category: "Pasta",
        isVegetarian: true,
        ingredients: ["Ricotta cheese", "spinach", "parmesan", "egg pasta"]
      },
      // Others
      {
        id: "11",
        name: "Bruschetta",
        description: "Toasted bread with fresh tomato topping",
        price: 8.99,
        category: "Appetizers",
        isVegetarian: true,
        ingredients: ["Baguette", "tomatoes", "basil", "garlic", "olive oil"]
      },
      {
        id: "12",
        name: "Insalata Caprese",
        description: "Fresh tomato and mozzarella salad",
        price: 12.99,
        category: "Salads",
        isVegetarian: true,
        ingredients: ["Tomatoes", "mozzarella", "basil", "balsamic glaze"]
      },
      {
        id: "13",
        name: "Tiramisu",
        description: "Classic Italian coffee dessert",
        price: 8.99,
        category: "Desserts",
        isVegetarian: true,
        popular: true,
        ingredients: ["Mascarpone", "coffee", "ladyfingers", "cocoa powder"]
      }
    ]
  },
  {
    id: "2",
    name: "Dragon Palace",
    description: "Traditional Chinese cuisine with modern presentation. Specialized in Szechuan and Cantonese dishes.",
    address: "456 Main Avenue, Chinatown, NY 10013",
    phone: "+1 (555) 234-5678",
    latitude: 40.7589,
    longitude: -73.9851,
    category_id: 2,
    cuisine: "chinese",
    avg_rating: 4.6,
    total_reviews: 198,
    delivery_time_min: 30,
    delivery_time_max: 40,
    price_range: "$$$",
    is_open: true,
    image: "🥡",
    featured_items: ["Kung Pao Chicken", "Sweet & Sour Pork", "Dim Sum"],
    tags: ["Dim Sum", "Spicy", "Vegetarian Options", "Late Night", "Authentic"],
    delivery_fee: 3.99,
    min_order: 20.00,
    promoted: false,
    schedule: {
      monday: { open: "11:30", close: "22:30", isOpen: true },
      tuesday: { open: "11:30", close: "22:30", isOpen: true },
      wednesday: { open: "11:30", close: "22:30", isOpen: true },
      thursday: { open: "11:30", close: "22:30", isOpen: true },
      friday: { open: "11:30", close: "23:30", isOpen: true },
      saturday: { open: "11:30", close: "23:30", isOpen: true },
      sunday: { open: "12:00", close: "22:00", isOpen: true }
    },
    menu: [
      // Main Dishes
      {
        id: "8",
        name: "Kung Pao Chicken",
        description: "Spicy stir-fry with peanuts",
        price: 17.99,
        category: "Main Dishes",
        isSpicy: true,
        popular: true,
        ingredients: ["Chicken", "peanuts", "bell peppers", "chili peppers", "soy sauce"]
      },
      {
        id: "9",
        name: "Beef with Broccoli",
        description: "Tender beef with crisp broccoli",
        price: 18.99,
        category: "Main Dishes",
        popular: true,
        ingredients: ["Beef", "broccoli", "oyster sauce", "garlic", "ginger"]
      },
      {
        id: "10",
        name: "Sweet and Sour Pork",
        description: "Crispy pork in tangy sauce",
        price: 19.99,
        category: "Main Dishes",
        popular: true,
        ingredients: ["Pork", "pineapple", "bell peppers", "vinegar", "sugar"]
      },
      {
        id: "11",
        name: "Mapo Tofu",
        description: "Spicy tofu with minced pork",
        price: 15.99,
        category: "Main Dishes",
        isSpicy: true,
        ingredients: ["Tofu", "pork", "Sichuan peppercorns", "chili oil", "soy sauce"]
      },
      {
        id: "12",
        name: "General Tso's Chicken",
        description: "Crispy chicken in sweet-spicy sauce",
        price: 18.99,
        category: "Main Dishes",
        isSpicy: true,
        popular: true,
        ingredients: ["Chicken", "hoisin sauce", "chili peppers", "soy sauce"]
      },
      // Dim Sum
      {
        id: "13",
        name: "Shrimp Dumplings",
        description: "Steamed dumplings with shrimp filling",
        price: 8.99,
        category: "Dim Sum",
        popular: true,
        ingredients: ["Shrimp", "bamboo shoots", "sesame oil", "rice flour"]
      },
      {
        id: "14",
        name: "Pork Siu Mai",
        description: "Open-faced pork dumplings",
        price: 7.99,
        category: "Dim Sum",
        ingredients: ["Pork", "shrimp", "mushrooms", "water chestnuts"]
      },
      {
        id: "15",
        name: "BBQ Pork Buns",
        description: "Fluffy buns with savory pork",
        price: 9.99,
        category: "Dim Sum",
        popular: true,
        ingredients: ["Pork", "hoisin sauce", "oyster sauce", "flour"]
      },
      {
        id: "16",
        name: "Spring Rolls",
        description: "Crispy rolls with vegetable filling",
        price: 6.99,
        category: "Dim Sum",
        isVegetarian: true,
        ingredients: ["Cabbage", "carrots", "mushrooms", "rice paper"]
      },
      {
        id: "17",
        name: "Custard Tarts",
        description: "Flaky pastry with creamy custard",
        price: 5.99,
        category: "Dim Sum",
        isVegetarian: true,
        ingredients: ["Eggs", "milk", "sugar", "flour"]
      },
      // Others
      {
        id: "18",
        name: "Fried Rice",
        description: "Classic rice with veggies and egg",
        price: 12.99,
        category: "Rice",
        isVegetarian: true,
        ingredients: ["Rice", "eggs", "peas", "carrots", "soy sauce"]
      },
      {
        id: "19",
        name: "Chow Mein",
        description: "Stir-fried noodles with vegetables",
        price: 14.99,
        category: "Noodles",
        isVegetarian: true,
        ingredients: ["Noodles", "cabbage", "bean sprouts", "soy sauce"]
      },
      {
        id: "20",
        name: "Hot and Sour Soup",
        description: "Spicy and tangy soup",
        price: 8.99,
        category: "Soups",
        isSpicy: true,
        isVegetarian: true,
        ingredients: ["Tofu", "bamboo shoots", "mushrooms", "vinegar"]
      },
      {
        id: "11",
        name: "Vegetable Spring Rolls",
        description: "Fresh vegetables wrapped in crispy pastry, served with sweet chili sauce",
        price: 8.99,
        category: "Appetizers",
        isVegetarian: true,
        ingredients: ["Mixed Vegetables", "Spring Roll Wrapper", "Sweet Chili Sauce"]
      },
      {
        id: "12",
        name: "Dim Sum Platter",
        description: "Assorted dim sum including dumplings, buns, and spring rolls",
        price: 24.99,
        category: "Appetizers",
        popular: true,
        ingredients: ["Pork Dumplings", "Shrimp Har Gow", "BBQ Pork Buns", "Spring Rolls"]
      }
    ]
  },
  {
    id: "3",
    name: "Burger Spot",
    description: "Gourmet burgers made with grass-fed beef and artisan buns. Local favorite since 2018.",
    address: "789 Burger Lane, Midtown, NY 10018",
    phone: "+1 (555) 345-6789",
    latitude: 40.7505,
    longitude: -73.9934,
    category_id: 3,
    cuisine: "american",
    avg_rating: 4.9,
    total_reviews: 567,
    delivery_time_min: 15,
    delivery_time_max: 25,
    price_range: "$$",
    is_open: true,
    image: "🍔",
    featured_items: ["Signature Burger", "Loaded Fries", "Milkshakes"],
    tags: ["Burgers", "Fries", "Shakes", "Quick Delivery", "Premium"],
    delivery_fee: 1.99,
    min_order: 12.00,
    promoted: true,
    schedule: {
      monday: { open: "10:00", close: "23:00", isOpen: true },
      tuesday: { open: "10:00", close: "23:00", isOpen: true },
      wednesday: { open: "10:00", close: "23:00", isOpen: true },
      thursday: { open: "10:00", close: "23:00", isOpen: true },
      friday: { open: "10:00", close: "24:00", isOpen: true },
      saturday: { open: "10:00", close: "24:00", isOpen: true },
      sunday: { open: "11:00", close: "22:00", isOpen: true }
    },
    menu: [
      // Burgers
      {
        id: "21",
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with cheddar",
        price: 12.99,
        category: "Burgers",
        popular: true,
        ingredients: ["Beef", "cheddar cheese", "lettuce", "tomato", "bun"]
      },
      {
        id: "22",
        name: "Bacon Burger",
        description: "Beef with crispy bacon",
        price: 14.99,
        category: "Burgers",
        popular: true,
        ingredients: ["Beef", "bacon", "cheddar", "lettuce", "bun"]
      },
      {
        id: "23",
        name: "BBQ Burger",
        description: "Smoky BBQ sauce topping",
        price: 15.99,
        category: "Burgers",
        ingredients: ["Beef", "BBQ sauce", "onion rings", "cheddar", "bun"]
      },
      {
        id: "24",
        name: "Veggie Burger",
        description: "Plant-based patty with fresh veggies",
        price: 13.99,
        category: "Burgers",
        isVegetarian: true,
        ingredients: ["Veggie patty", "lettuce", "tomato", "avocado", "bun"]
      },
      {
        id: "25",
        name: "Mushroom Swiss Burger",
        description: "Beef with sautéed mushrooms",
        price: 16.99,
        category: "Burgers",
        ingredients: ["Beef", "swiss cheese", "mushrooms", "bun"]
      },
      // Comfort Food
      {
        id: "26",
        name: "Mac and Cheese",
        description: "Creamy cheddar cheese sauce",
        price: 10.99,
        category: "Comfort Food",
        isVegetarian: true,
        popular: true,
        ingredients: ["Elbow macaroni", "cheddar", "milk", "butter"]
      },
      {
        id: "27",
        name: "Fried Chicken",
        description: "Crispy Southern-style chicken",
        price: 15.99,
        category: "Comfort Food",
        popular: true,
        ingredients: ["Chicken", "flour", "paprika", "buttermilk"]
      },
      {
        id: "28",
        name: "Mashed Potatoes",
        description: "Creamy potatoes with gravy",
        price: 7.99,
        category: "Comfort Food",
        isVegetarian: true,
        ingredients: ["Potatoes", "butter", "milk", "brown gravy"]
      },
      {
        id: "29",
        name: "Chicken Wings",
        description: "Spicy buffalo wings",
        price: 12.99,
        category: "Comfort Food",
        isSpicy: true,
        popular: true,
        ingredients: ["Chicken wings", "hot sauce", "butter"]
      },
      {
        id: "30",
        name: "Grilled Cheese",
        description: "Melted cheese sandwich",
        price: 8.99,
        category: "Comfort Food",
        isVegetarian: true,
        ingredients: ["Bread", "cheddar cheese", "butter"]
      },
      // Sides and Desserts
      {
        id: "31",
        name: "French Fries",
        description: "Crispy golden fries",
        price: 5.99,
        category: "Sides",
        isVegetarian: true,
        popular: true,
        ingredients: ["Potatoes", "salt", "vegetable oil"]
      },
      {
        id: "32",
        name: "Onion Rings",
        description: "Crispy fried onions",
        price: 6.99,
        category: "Sides",
        isVegetarian: true,
        ingredients: ["Onions", "flour", "breadcrumbs"]
      },
      {
        id: "33",
        name: "Apple Pie",
        description: "Classic American dessert",
        price: 6.99,
        category: "Desserts",
        isVegetarian: true,
        ingredients: ["Apples", "cinnamon", "sugar", "pie crust"]
      },
      {
        id: "34",
        name: "Chocolate Chip Cookies",
        description: "Soft and chewy cookies",
        price: 4.99,
        category: "Desserts",
        isVegetarian: true,
        ingredients: ["Flour", "chocolate chips", "butter", "sugar"]
      }
    ]
  },
  {
    id: "4",
    name: "Sakura Sushi",
    description: "Fresh sushi and sashimi prepared by experienced Japanese chefs. Premium ingredients daily.",
    address: "321 Cherry Blossom St, East Side, NY 10021",
    phone: "+1 (555) 456-7890",
    latitude: 40.7614,
    longitude: -73.9776,
    category_id: 4,
    cuisine: "japanese",
    avg_rating: 4.7,
    total_reviews: 289,
    delivery_time_min: 35,
    delivery_time_max: 45,
    price_range: "$$$",
    is_open: true,
    image: "🍣",
    featured_items: ["Dragon Roll", "Salmon Sashimi", "Miso Soup"],
    tags: ["Sushi", "Fresh Fish", "Premium", "Date Night", "Authentic"],
    delivery_fee: 4.99,
    min_order: 25.00,
    promoted: false,
    schedule: {
      monday: { open: "17:00", close: "22:00", isOpen: false },
      tuesday: { open: "12:00", close: "22:00", isOpen: true },
      wednesday: { open: "12:00", close: "22:00", isOpen: true },
      thursday: { open: "12:00", close: "22:00", isOpen: true },
      friday: { open: "12:00", close: "23:00", isOpen: true },
      saturday: { open: "12:00", close: "23:00", isOpen: true },
      sunday: { open: "12:00", close: "21:00", isOpen: true }
    },
    menu: [
      {
        id: "18",
        name: "Dragon Roll",
        description: "Shrimp tempura, cucumber, topped with eel and avocado",
        price: 16.99,
        category: "Sushi Rolls",
        popular: true,
        ingredients: ["Shrimp Tempura", "Cucumber", "Eel", "Avocado", "Eel Sauce"]
      },
      {
        id: "19",
        name: "Rainbow Roll",
        description: "California roll topped with assorted fresh fish",
        price: 18.99,
        category: "Sushi Rolls",
        popular: true,
        ingredients: ["Crab", "Cucumber", "Avocado", "Tuna", "Salmon", "Yellowtail"]
      },
      {
        id: "20",
        name: "Salmon Sashimi",
        description: "Fresh Atlantic salmon, 6 pieces",
        price: 14.99,
        category: "Sashimi",
        ingredients: ["Fresh Salmon"]
      },
      {
        id: "21",
        name: "Chirashi Bowl",
        description: "Assorted sashimi over sushi rice with vegetables",
        price: 22.99,
        category: "Rice Bowls",
        popular: true,
        ingredients: ["Assorted Sashimi", "Sushi Rice", "Mixed Vegetables"]
      },
      {
        id: "22",
        name: "Miso Soup",
        description: "Traditional soybean paste soup with tofu and seaweed",
        price: 3.99,
        category: "Soups",
        isVegetarian: true,
        ingredients: ["Miso Paste", "Tofu", "Seaweed", "Scallions"]
      }
    ]
  },
  {
    id: "5",
    name: "Spice Garden",
    description: "Authentic Indian flavors with vegetarian and vegan options. Traditional recipes passed down generations.",
    address: "654 Curry Road, Little India, NY 10029",
    phone: "+1 (555) 567-8901",
    latitude: 40.7935,
    longitude: -73.9523,
    category_id: 5,
    cuisine: "indian",
    avg_rating: 4.5,
    total_reviews: 412,
    delivery_time_min: 25,
    delivery_time_max: 35,
    price_range: "$$",
    is_open: true,
    image: "🍛",
    featured_items: ["Butter Chicken", "Biryani", "Naan Bread"],
    tags: ["Curry", "Vegetarian", "Spicy", "Authentic", "Vegan Options"],
    delivery_fee: 3.49,
    min_order: 18.00,
    promoted: false,
    schedule: {
      monday: { open: "11:00", close: "22:00", isOpen: true },
      tuesday: { open: "11:00", close: "22:00", isOpen: true },
      wednesday: { open: "11:00", close: "22:00", isOpen: true },
      thursday: { open: "11:00", close: "22:00", isOpen: true },
      friday: { open: "11:00", close: "23:00", isOpen: true },
      saturday: { open: "11:00", close: "23:00", isOpen: true },
      sunday: { open: "12:00", close: "21:00", isOpen: true }
    },
    menu: [
      {
        id: "23",
        name: "Butter Chicken",
        description: "Tender chicken in creamy tomato curry sauce",
        price: 16.99,
        category: "Main Dishes",
        popular: true,
        ingredients: ["Chicken", "Tomato Sauce", "Cream", "Indian Spices"]
      },
      {
        id: "24",
        name: "Chicken Biryani",
        description: "Fragrant basmati rice with spiced chicken and aromatic herbs",
        price: 18.99,
        category: "Rice Dishes",
        popular: true,
        isSpicy: true,
        ingredients: ["Basmati Rice", "Chicken", "Saffron", "Indian Spices"]
      },
      {
        id: "25",
        name: "Palak Paneer",
        description: "Cottage cheese cubes in spiced spinach curry",
        price: 14.99,
        category: "Main Dishes",
        isVegetarian: true,
        ingredients: ["Paneer", "Spinach", "Onions", "Indian Spices"]
      },
      {
        id: "26",
        name: "Garlic Naan",
        description: "Fresh baked bread with garlic and herbs",
        price: 3.99,
        category: "Breads",
        isVegetarian: true,
        popular: true,
        ingredients: ["Flour", "Garlic", "Butter", "Herbs"]
      },
      {
        id: "27",
        name: "Samosas",
        description: "Crispy pastries filled with spiced potatoes and peas (3 pieces)",
        price: 6.99,
        category: "Appetizers",
        isVegetarian: true,
        ingredients: ["Potatoes", "Peas", "Pastry", "Indian Spices"]
      }
    ]
  },
  {
    id: "6",
    name: "Taco Libre",
    description: "Fresh Mexican street food with bold flavors. Made-to-order tacos and burritos with house-made salsas.",
    address: "987 Fiesta Avenue, South Beach, NY 10014",
    phone: "+1 (555) 678-9012",
    latitude: 40.7282,
    longitude: -74.0776,
    category_id: 6,
    cuisine: "mexican",
    avg_rating: 4.4,
    total_reviews: 156,
    delivery_time_min: 20,
    delivery_time_max: 30,
    price_range: "$",
    is_open: true,
    image: "🌮",
    featured_items: ["Fish Tacos", "Carnitas Burrito", "Guacamole"],
    tags: ["Tacos", "Fresh", "Budget-friendly", "Healthy Options", "Authentic"],
    delivery_fee: 2.49,
    min_order: 10.00,
    promoted: true,
    schedule: {
      monday: { open: "10:00", close: "23:00", isOpen: true },
      tuesday: { open: "10:00", close: "23:00", isOpen: true },
      wednesday: { open: "10:00", close: "23:00", isOpen: true },
      thursday: { open: "10:00", close: "23:00", isOpen: true },
      friday: { open: "10:00", close: "24:00", isOpen: true },
      saturday: { open: "10:00", close: "24:00", isOpen: true },
      sunday: { open: "11:00", close: "22:00", isOpen: true }
    },
    menu: [
      {
        id: "28",
        name: "Fish Tacos",
        description: "Grilled fish with cabbage slaw, pico de gallo, and chipotle crema (3 tacos)",
        price: 12.99,
        category: "Tacos",
        popular: true,
        ingredients: ["Grilled Fish", "Cabbage", "Pico de Gallo", "Chipotle Crema"]
      },
      {
        id: "29",
        name: "Carnitas Burrito",
        description: "Slow-cooked pork with rice, beans, cheese, salsa, and sour cream",
        price: 11.99,
        category: "Burritos",
        popular: true,
        ingredients: ["Carnitas", "Rice", "Beans", "Cheese", "Salsa", "Sour Cream"]
      },
      {
        id: "30",
        name: "Veggie Quesadilla",
        description: "Grilled vegetables and cheese in crispy tortilla",
        price: 9.99,
        category: "Quesadillas",
        isVegetarian: true,
        ingredients: ["Mixed Vegetables", "Cheese", "Tortilla", "Salsa"]
      },
      {
        id: "31",
        name: "Guac & Chips",
        description: "Fresh house-made guacamole with crispy tortilla chips",
        price: 7.99,
        category: "Appetizers",
        isVegetarian: true,
        popular: true,
        ingredients: ["Avocado", "Tomatoes", "Onions", "Lime", "Tortilla Chips"]
      }
    ]
  },
  {
    id: "7",
    name: "Thai Orchid",
    description: "Authentic Thai cuisine with fresh herbs and traditional cooking methods. Family recipes from Bangkok.",
    address: "159 Thai Street, Midtown, NY 10019",
    phone: "+1 (555) 789-0123",
    latitude: 40.7589,
    longitude: -73.9851,
    category_id: 7,
    cuisine: "thai",
    avg_rating: 4.6,
    total_reviews: 203,
    delivery_time_min: 25,
    delivery_time_max: 35,
    price_range: "$$",
    is_open: true,
    image: "🍜",
    featured_items: ["Pad Thai", "Green Curry", "Tom Yum Soup"],
    tags: ["Authentic", "Spicy", "Fresh Herbs", "Vegetarian Options", "Healthy"],
    delivery_fee: 3.49,
    min_order: 16.00,
    promoted: false,
    schedule: {
      monday: { open: "11:30", close: "22:00", isOpen: true },
      tuesday: { open: "11:30", close: "22:00", isOpen: true },
      wednesday: { open: "11:30", close: "22:00", isOpen: true },
      thursday: { open: "11:30", close: "22:00", isOpen: true },
      friday: { open: "11:30", close: "22:30", isOpen: true },
      saturday: { open: "12:00", close: "22:30", isOpen: true },
      sunday: { open: "12:00", close: "21:30", isOpen: true }
    },
    menu: [
      {
        id: "32",
        name: "Pad Thai",
        description: "Stir-fried rice noodles with shrimp, tofu, bean sprouts, and peanuts",
        price: 14.99,
        category: "Noodles",
        popular: true,
        ingredients: ["Rice Noodles", "Shrimp", "Tofu", "Bean Sprouts", "Peanuts", "Tamarind"]
      },
      {
        id: "33",
        name: "Green Curry",
        description: "Spicy green curry with chicken, Thai basil, and coconut milk",
        price: 16.99,
        category: "Curries",
        popular: true,
        isSpicy: true,
        ingredients: ["Chicken", "Green Curry Paste", "Coconut Milk", "Thai Basil"]
      },
      {
        id: "34",
        name: "Tom Yum Soup",
        description: "Spicy and sour soup with shrimp, mushrooms, and lemongrass",
        price: 8.99,
        category: "Soups",
        isSpicy: true,
        ingredients: ["Shrimp", "Mushrooms", "Lemongrass", "Lime Leaves", "Chili"]
      },
      {
        id: "35",
        name: "Mango Sticky Rice",
        description: "Sweet sticky rice with fresh mango and coconut cream",
        price: 6.99,
        category: "Desserts",
        isVegetarian: true,
        ingredients: ["Sticky Rice", "Mango", "Coconut Cream", "Palm Sugar"]
      }
    ]
  },
  {
    id: "8",
    name: "Seoul Kitchen",
    description: "Korean BBQ and comfort food. Authentic kimchi, bulgogi, and Korean fried chicken.",
    address: "246 K-Town Plaza, Koreatown, NY 10001",
    phone: "+1 (555) 890-1234",
    latitude: 40.7484,
    longitude: -73.9857,
    category_id: 9,
    cuisine: "korean",
    avg_rating: 4.6,
    total_reviews: 178,
    delivery_time_min: 25,
    delivery_time_max: 35,
    price_range: "$$",
    is_open: true,
    image: "🍖",
    featured_items: ["Korean BBQ", "Bibimbap", "Korean Fried Chicken"],
    tags: ["BBQ", "Korean", "Spicy", "Comfort Food", "Authentic"],
    delivery_fee: 3.49, 
    min_order: 20.00,
    promoted: false,
    schedule: {
      monday: { open: "12:00", close: "22:00", isOpen: true },
      tuesday: { open: "12:00", close: "22:00", isOpen: true },
      wednesday: { open: "12:00", close: "22:00", isOpen: true },
      thursday: { open: "12:00", close: "22:00", isOpen: true },
      friday: { open: "12:00", close: "23:00", isOpen: true },
      saturday: { open: "12:00", close: "23:00", isOpen: true },
      sunday: { open: "13:00", close: "21:00", isOpen: true }
    },
    menu: [
      {
        id: "36",
        name: "Bulgogi",
        description: "Marinated grilled beef with vegetables and steamed rice",
        price: 18.99,
        category: "Main Dishes",
        popular: true,
        ingredients: ["Marinated Beef", "Onions", "Scallions", "Sesame", "Rice"]
      },
      {
        id: "37",
        name: "Korean Fried Chicken",
        description: "Crispy chicken with sweet and spicy Korean sauce",
        price: 16.99,
        category: "Main Dishes",
        popular: true,
        isSpicy: true,
        ingredients: ["Chicken Wings", "Korean Chili Sauce", "Garlic", "Ginger"]
      },
      {
        id: "38",
        name: "Bibimbap",
        description: "Rice bowl with assorted vegetables, meat, and fried egg",
        price: 15.99,
        category: "Rice Bowls",
        popular: true,
        ingredients: ["Rice", "Mixed Vegetables", "Beef", "Fried Egg", "Gochujang"]
      },
      {
        id: "39",
        name: "Kimchi",
        description: "Traditional fermented cabbage side dish",
        price: 4.99,
        category: "Sides",
        isVegetarian: true,
        isSpicy: true,
        ingredients: ["Napa Cabbage", "Korean Chili Flakes", "Garlic", "Ginger"]
      }
    ]
  },
  {
    id: "9",
    name: "Mediterranean Breeze",
    description: "Healthy Mediterranean cuisine with fresh ingredients. Grilled meats, fresh salads, and homemade hummus.",
    address: "159 Olive Street, Greenwich Village, NY 10012",
    phone: "+1 (555) 789-0123",
    latitude: 40.7359,
    longitude: -74.0034,
    category_id: 8,
    cuisine: "mediterranean",
    avg_rating: 4.3,
    total_reviews: 203,
    delivery_time_min: 30,
    delivery_time_max: 40,
    price_range: "$$",
    is_open: false,
    image: "🥙",
    featured_items: ["Gyro Wrap", "Greek Salad", "Falafel"],
    tags: ["Healthy", "Mediterranean", "Vegetarian", "Fresh", "Organic"],
    delivery_fee: 3.99,
    min_order: 16.00,
    promoted: false,
    schedule: {
      monday: { open: "11:00", close: "21:00", isOpen: false },
      tuesday: { open: "11:00", close: "21:00", isOpen: true },
      wednesday: { open: "11:00", close: "21:00", isOpen: true },
      thursday: { open: "11:00", close: "21:00", isOpen: true },
      friday: { open: "11:00", close: "22:00", isOpen: true },
      saturday: { open: "11:00", close: "22:00", isOpen: true },
      sunday: { open: "12:00", close: "20:00", isOpen: true }
    },
    menu: [
      {
        id: "40",
        name: "Gyro Wrap",
        description: "Seasoned lamb and beef with tzatziki, tomatoes, and onions in pita",
        price: 13.99,
        category: "Wraps",
        popular: true,
        ingredients: ["Lamb", "Beef", "Tzatziki", "Tomatoes", "Onions", "Pita"]
      },
      {
        id: "41",
        name: "Greek Salad",
        description: "Mixed greens, feta cheese, olives, tomatoes, cucumber, olive oil dressing",
        price: 11.99,
        category: "Salads",
        isVegetarian: true,
        popular: true,
        ingredients: ["Mixed Greens", "Feta", "Olives", "Tomatoes", "Cucumber"]
      },
      {
        id: "42",
        name: "Falafel Plate",
        description: "Crispy chickpea balls with hummus, tahini, and vegetables",
        price: 12.99,
        category: "Main Dishes",
        isVegetarian: true,
        isVegan: true,
        ingredients: ["Chickpeas", "Hummus", "Tahini", "Mixed Vegetables"]
      },
      {
        id: "43",
        name: "Hummus & Pita",
        description: "Creamy chickpea dip with warm pita bread and olive oil",
        price: 7.99,
        category: "Appetizers",
        isVegetarian: true,
        isVegan: true,
        ingredients: ["Chickpeas", "Tahini", "Olive Oil", "Pita Bread"]
      }
    ]
  },
  {
    id: "10",
    name: "Le Petit Café",
    description: "Charming French bistro serving classic French dishes and pastries. Authentic recipes from Lyon.",
    address: "88 French Quarter, SoHo, NY 10012",
    phone: "+1 (555) 901-2345",
    latitude: 40.7259,
    longitude: -74.0034,
    category_id: 10,
    cuisine: "french",
    avg_rating: 4.7,
    total_reviews: 156,
    delivery_time_min: 35,
    delivery_time_max: 45,
    price_range: "$$$",
    is_open: true,
    image: "🥐",
    featured_items: ["Coq au Vin", "French Onion Soup", "Crème Brûlée"],
    tags: ["French", "Bistro", "Wine", "Romantic", "Authentic"],
    delivery_fee: 4.99,
    min_order: 25.00,
    promoted: false,
    schedule: {
      monday: { open: "11:00", close: "21:00", isOpen: true },
      tuesday: { open: "11:00", close: "21:00", isOpen: true },
      wednesday: { open: "11:00", close: "21:00", isOpen: true },
      thursday: { open: "11:00", close: "21:00", isOpen: true },
      friday: { open: "11:00", close: "22:00", isOpen: true },
      saturday: { open: "10:00", close: "22:00", isOpen: true },
      sunday: { open: "10:00", close: "20:00", isOpen: true }
    },
    menu: [
      {
        id: "44",
        name: "Coq au Vin",
        description: "Braised chicken in red wine with mushrooms and pearl onions",
        price: 24.99,
        category: "Main Dishes",
        popular: true,
        ingredients: ["Chicken", "Red Wine", "Mushrooms", "Pearl Onions", "Herbs"]
      },
      {
        id: "45",
        name: "French Onion Soup",
        description: "Classic soup with caramelized onions, beef broth, and Gruyère cheese",
        price: 9.99,
        category: "Soups",
        popular: true,
        ingredients: ["Onions", "Beef Broth", "Gruyère Cheese", "Bread"]
      },
      {
        id: "46",
        name: "Ratatouille",
        description: "Provençal vegetable stew with eggplant, zucchini, and tomatoes",
        price: 16.99,
        category: "Main Dishes",
        isVegetarian: true,
        ingredients: ["Eggplant", "Zucchini", "Tomatoes", "Bell Peppers", "Herbs"]
      },
      {
        id: "47",
        name: "Crème Brûlée",
        description: "Classic vanilla custard with caramelized sugar top",
        price: 8.99,
        category: "Desserts",
        isVegetarian: true,
        popular: true,
        ingredients: ["Cream", "Vanilla", "Eggs", "Sugar"]
      },
      {
        id: "48",
        name: "Croissant",
        description: "Buttery, flaky French pastry (2 pieces)",
        price: 4.99,
        category: "Pastries",
        isVegetarian: true,
        ingredients: ["Flour", "Butter", "Eggs", "Yeast"]
      }
    ]
  }
];

// Update restaurant open/closed status based on schedule
restaurants.forEach(restaurant => {
  restaurant.is_open = isRestaurantOpen(restaurant.schedule);
});

// Calculate distance function (mock implementation)
export const calculateDistance = (userLat: number, userLng: number, restaurantLat: number, restaurantLng: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (restaurantLat - userLat) * Math.PI / 180;
  const dLng = (restaurantLng - userLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLat * Math.PI / 180) * Math.cos(restaurantLat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
};

export default restaurants;