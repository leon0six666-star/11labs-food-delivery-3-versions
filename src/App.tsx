import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import FoodSearch from "./pages/FoodSearch";
import FoodCompare from "./pages/FoodCompare";
import Checkout from "./pages/Checkout";
import MealCurator from "./pages/MealCurator";
import NutritionCurator from "./pages/NutritionCurator";
import AIInterface from "./pages/AIInterface";
import FamilyMealPlanner from "./pages/FamilyMealPlanner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Central Tool Hub for ElevenLabs AI Agent
const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for ElevenLabs agent tool calls
    const handleAgentCall = (event: any) => {
      if (event.detail?.config) {
        event.detail.config.clientTools = {
          // TOOL 1: Navigate to any page
          navigate_to_page: async ({ page }: { page: string }) => {
            navigate(`/${page}`);
            return `Navigated to ${page} page.`;
          },

          // TOOL 2: Browse restaurants with filters
          browse_restaurants: async (filters: {
            cuisine?: string;
            priceRange?: string;
            rating?: number;
            deliveryTime?: number;
            search?: string;
          }) => {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== '') {
                queryParams.set(key, value.toString());
              }
            });
            const url = queryParams.toString() ? `/restaurants?${queryParams}` : '/restaurants';
            navigate(url);
            return `Applied restaurant filters: ${JSON.stringify(filters)}`;
          },

          // TOOL 3: View specific restaurant details
          view_restaurant: async ({ restaurantId }: { restaurantId: string }) => {
            navigate(`/restaurant/${restaurantId}`);
            return `Showing details for restaurant ${restaurantId}.`;
          },

          // TOOL 4: Add item to cart
          add_to_cart: async ({ restaurantId, itemId, quantity = 1 }: {
            restaurantId: string;
            itemId: string;
            quantity?: number;
          }) => {
            // This will trigger cart state update via URL params
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set('addToCart', `${restaurantId}:${itemId}:${quantity}`);
            navigate(`${window.location.pathname}?${currentParams}`);
            return `Added ${quantity} of item ${itemId} to cart.`;
          },

          // TOOL 5: View cart
          view_cart: async () => {
            navigate('/cart');
            return 'Showing shopping cart.';
          },

          // TOOL 6: Search restaurants or food
          search: async ({ query }: { query: string }) => {
            navigate(`/restaurants?search=${encodeURIComponent(query)}`);
            return `Searching for: ${query}`;
          },

          // TOOL 7: Advanced food search across all restaurants
          search_food: async (filters: {
            query?: string;
            categories?: string[];
            ingredients?: string[];
            vegetarian?: boolean;
            spicy?: boolean;
            maxPrice?: number;
          }) => {
            const queryParams = new URLSearchParams();
            if (filters.query) queryParams.set('q', filters.query);
            if (filters.categories?.length) queryParams.set('categories', filters.categories.join(','));
            if (filters.ingredients?.length) queryParams.set('ingredients', filters.ingredients.join(','));
            if (filters.vegetarian) queryParams.set('vegetarian', 'true');
            if (filters.spicy) queryParams.set('spicy', 'true');
            if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
            
            const url = queryParams.toString() ? `/food-search?${queryParams}` : '/food-search';
            navigate(url);
            return `Searching food items with filters: ${JSON.stringify(filters)}`;
          },

          // TOOL 8: Smart add to cart (automatically selects best restaurant)
          add_food_to_cart: async ({ foodName, restaurantPreference }: {
            foodName: string;
            restaurantPreference?: string;
          }) => {
            // Search for the food first, then add to cart
            navigate(`/food-search?q=${encodeURIComponent(foodName)}&autoAdd=true&restaurant=${restaurantPreference || ''}`);
            return `Searching for ${foodName} to add to cart${restaurantPreference ? ` from ${restaurantPreference}` : ''}`;
          },

          // TOOL 9: AI Meal Curator - Create personalized dining experiences
          curate_meal: async (preferences: {
            mood?: string;
            adventure?: number;
            spice?: number;
            hunger?: number;
            budget?: string;
            dietary?: string[];
          }) => {
            const queryParams = new URLSearchParams();
            if (preferences.mood) queryParams.set('mood', preferences.mood);
            if (preferences.adventure) queryParams.set('adventure', preferences.adventure.toString());
            if (preferences.spice) queryParams.set('spice', preferences.spice.toString());
            if (preferences.hunger) queryParams.set('hunger', preferences.hunger.toString());
            if (preferences.budget) queryParams.set('budget', preferences.budget);
            if (preferences.dietary?.length) queryParams.set('dietary', preferences.dietary.join(','));
            queryParams.set('autoBuild', 'true');
            
            navigate(`/meal-curator?${queryParams}`);
            return `Creating personalized meal based on your preferences: ${JSON.stringify(preferences)}`;
          },

          // TOOL 10: Nutrition AI Curator - Scientific nutrition optimization
          nutrition_curator: async (goals: {
            goal?: string;
            calories?: number;
            protein?: number;
            carbs?: number;
            fat?: number;
            specialNeeds?: string[];
          }) => {
            const queryParams = new URLSearchParams();
            if (goals.goal) queryParams.set('goal', goals.goal);
            if (goals.calories) queryParams.set('calories', goals.calories.toString());
            if (goals.protein) queryParams.set('protein', goals.protein.toString());
            if (goals.carbs) queryParams.set('carbs', goals.carbs.toString());
            if (goals.fat) queryParams.set('fat', goals.fat.toString());
            if (goals.specialNeeds?.length) queryParams.set('specialNeeds', goals.specialNeeds.join(','));
            queryParams.set('autoBuild', 'true');
            
            navigate(`/nutrition-curator?${queryParams}`);
            return `Creating nutrition-optimized meal for ${goals.goal || 'your goals'}: ${JSON.stringify(goals)}`;
          }
        };
      }
    };

    // Listen for the ElevenLabs widget call event
    const widget = document.querySelector('elevenlabs-convai');
    if (widget) {
      widget.addEventListener('elevenlabs-convai:call', handleAgentCall);
      return () => widget.removeEventListener('elevenlabs-convai:call', handleAgentCall);
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/food-search" element={<FoodSearch />} />
      <Route path="/food-compare" element={<FoodCompare />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/meal-curator" element={<MealCurator />} />
      <Route path="/nutrition-curator" element={<NutritionCurator />} />
      <Route path="/ai-interface" element={<AIInterface />} />
      <Route path="/family-meal-planner" element={<FamilyMealPlanner />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <AppRoutes />
              {/* ElevenLabs Conversational AI Widget */}
              {import.meta.env.VITE_ELEVENLABS_AGENT_ID && (
                <elevenlabs-convai 
                  agent-id={import.meta.env.VITE_ELEVENLABS_AGENT_ID}
                ></elevenlabs-convai>
              )}
            </div>
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;