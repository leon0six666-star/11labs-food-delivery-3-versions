import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  ChefHat, 
  Heart, 
  Zap, 
  Globe, 
  Clock,
  ThermometerSun,
  Brain,
  Star,
  Plus,
  Check,
  ArrowRight,
  Utensils,
  Coffee,
  Cookie
} from "lucide-react";
import { restaurants, MenuItem } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface CuratedMeal {
  id: string;
  type: 'appetizer' | 'main' | 'dessert' | 'drink';
  item: MenuItem & { restaurantName: string; restaurantId: string };
  reasoning: string;
  pairingScore: number;
}

interface UserPreferences {
  mood: string;
  adventureLevel: number; // 1-5
  spiceLevel: number; // 1-5
  hungerLevel: number; // 1-5
  timeOfDay: string;
  weather: string;
  cuisineHistory: string[];
  dietaryRestrictions: string[];
  budget: 'low' | 'medium' | 'high';
  lastMood: string;
}

const MealCurator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Curated meal state
  const [curatedMeal, setCuratedMeal] = useState<CuratedMeal[]>([]);
  const [curationStep, setCurationStep] = useState(0); // 0-100
  const [isBuilding, setIsBuilding] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    mood: '',
    adventureLevel: 3,
    spiceLevel: 3,
    hungerLevel: 3,
    timeOfDay: 'dinner',
    weather: 'mild',
    cuisineHistory: [],
    dietaryRestrictions: [],
    budget: 'medium',
    lastMood: ''
  });

  // Get all food items with restaurant info
  const allFoodItems = restaurants.flatMap(restaurant => 
    restaurant.menu.map(item => ({
      ...item,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantCuisine: restaurant.cuisine,
      restaurantRating: restaurant.avg_rating,
      deliveryTime: `${restaurant.delivery_time_min}-${restaurant.delivery_time_max} min`
    }))
  );

  // Parse URL parameters for AI curation
  useEffect(() => {
    const mood = searchParams.get('mood');
    const adventure = searchParams.get('adventure');
    const spice = searchParams.get('spice');
    const hunger = searchParams.get('hunger');
    const budget = searchParams.get('budget');
    const dietary = searchParams.get('dietary');
    const autoBuild = searchParams.get('autoBuild');

    if (mood || adventure || autoBuild) {
      const preferences: UserPreferences = {
        mood: mood || 'hungry',
        adventureLevel: parseInt(adventure || '3'),
        spiceLevel: parseInt(spice || '3'),
        hungerLevel: parseInt(hunger || '3'),
        timeOfDay: getTimeOfDay(),
        weather: getWeatherMood(),
        cuisineHistory: [],
        dietaryRestrictions: dietary ? dietary.split(',') : [],
        budget: (budget as 'low' | 'medium' | 'high') || 'medium',
        lastMood: ''
      };
      
      setUserPreferences(preferences);
      
      if (autoBuild === 'true') {
        buildMealAutomatically(preferences);
      }
    }
  }, [searchParams]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'breakfast';
    if (hour < 16) return 'lunch';
    if (hour < 18) return 'afternoon';
    return 'dinner';
  };

  const getWeatherMood = () => {
    // In a real app, you'd get actual weather
    const moods = ['cold', 'warm', 'rainy', 'sunny', 'mild'];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  const buildMealAutomatically = async (prefs: UserPreferences) => {
    setIsBuilding(true);
    setCurationStep(0);
    setCuratedMeal([]);

    // Simulate AI thinking process
    await simulateAIThinking(prefs);
  };

  const simulateAIThinking = async (prefs: UserPreferences) => {
    const steps = [
      { text: "Analyzing your mood and preferences...", progress: 20 },
      { text: "Scanning menu items across all restaurants...", progress: 40 },
      { text: "Finding perfect flavor combinations...", progress: 60 },
      { text: "Creating your personalized meal...", progress: 80 },
      { text: "Adding finishing touches...", progress: 100 }
    ];

    for (const step of steps) {
      setCurationStep(step.progress);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    // Generate the actual meal
    const meal = generateCuratedMeal(prefs);
    setCuratedMeal(meal);
    setIsBuilding(false);

    toast({
      title: "🎭 Your Perfect Meal is Ready!",
      description: `I've crafted a ${prefs.mood} dining experience just for you.`,
    });
  };

  const generateCuratedMeal = (prefs: UserPreferences): CuratedMeal[] => {
    const meal: CuratedMeal[] = [];

    // Smart meal building based on preferences
    if (prefs.mood === 'adventurous' || prefs.adventureLevel >= 4) {
      // Adventurous meal - mix cuisines
      meal.push(createCuratedItem('appetizer', selectByMood(prefs, 'appetizer'), 
        "Starting your adventure with exotic flavors"));
      meal.push(createCuratedItem('main', selectByMood(prefs, 'main'), 
        "A bold main dish to satisfy your adventurous spirit"));
    } else if (prefs.mood === 'comfort' || prefs.mood === 'tired') {
      // Comfort meal
      meal.push(createCuratedItem('appetizer', selectComfortFood('appetizer'), 
        "Something warm and comforting to start"));
      meal.push(createCuratedItem('main', selectComfortFood('main'), 
        "Classic comfort food to make you feel better"));
      meal.push(createCuratedItem('dessert', selectComfortFood('dessert'), 
        "Sweet comfort to end on a perfect note"));
    } else if (prefs.mood === 'healthy' || prefs.timeOfDay === 'lunch') {
      // Healthy/balanced meal
      meal.push(createCuratedItem('main', selectHealthyFood(), 
        "A nutritious and delicious main course"));
    } else if (prefs.mood === 'romantic' || prefs.timeOfDay === 'dinner') {
      // Romantic dinner
      meal.push(createCuratedItem('appetizer', selectRomanticFood('appetizer'), 
        "An elegant start to your evening"));
      meal.push(createCuratedItem('main', selectRomanticFood('main'), 
        "A sophisticated main course"));
      meal.push(createCuratedItem('dessert', selectRomanticFood('dessert'), 
        "A sweet ending to share"));
    } else {
      // Default balanced meal
      meal.push(createCuratedItem('main', selectRandomGoodFood(), 
        "A delicious dish I think you'll love"));
      if (prefs.hungerLevel >= 4) {
        meal.push(createCuratedItem('appetizer', selectRandomGoodFood(), 
          "Something extra because you're really hungry"));
      }
    }

    return meal;
  };

  const createCuratedItem = (type: CuratedMeal['type'], item: any, reasoning: string): CuratedMeal => ({
    id: `${type}-${item.id}`,
    type,
    item,
    reasoning,
    pairingScore: Math.floor(Math.random() * 20) + 80 // 80-100 score
  });

  const selectByMood = (prefs: UserPreferences, course: string) => {
    // Advanced selection logic based on preferences
    let candidates = allFoodItems.filter(item => {
      if (prefs.dietaryRestrictions.includes('vegetarian') && !item.isVegetarian) return false;
      if (prefs.spiceLevel < 3 && item.isSpicy) return false;
      if (prefs.spiceLevel >= 4 && !item.isSpicy && Math.random() > 0.7) return false;
      return true;
    });

    if (prefs.adventureLevel >= 4) {
      // Prefer exotic cuisines
      candidates = candidates.filter(item => 
        ['Thai', 'Korean', 'Japanese', 'Indian'].includes(item.restaurantCuisine));
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  const selectComfortFood = (course: string) => {
    const comfortItems = allFoodItems.filter(item => 
      item.category.includes('Comfort') || 
      item.name.toLowerCase().includes('mac') ||
      item.name.toLowerCase().includes('chicken') ||
      item.name.toLowerCase().includes('pasta') ||
      item.name.toLowerCase().includes('burger')
    );
    return comfortItems[Math.floor(Math.random() * comfortItems.length)];
  };

  const selectHealthyFood = () => {
    const healthyItems = allFoodItems.filter(item => 
      item.isVegetarian || 
      item.restaurantCuisine === 'Mediterranean' ||
      item.name.toLowerCase().includes('salad') ||
      item.name.toLowerCase().includes('grilled')
    );
    return healthyItems[Math.floor(Math.random() * healthyItems.length)];
  };

  const selectRomanticFood = (course: string) => {
    const romanticItems = allFoodItems.filter(item => 
      item.restaurantCuisine === 'French' ||
      item.restaurantCuisine === 'Italian' ||
      item.name.toLowerCase().includes('wine') ||
      item.category.includes('Pasta')
    );
    return romanticItems[Math.floor(Math.random() * romanticItems.length)];
  };

  const selectRandomGoodFood = () => {
    const popularItems = allFoodItems.filter(item => item.popular);
    return popularItems[Math.floor(Math.random() * popularItems.length)];
  };

  const addMealToCart = () => {
    curatedMeal.forEach(item => {
      // Add each item to cart
      const cartItem = {
        id: item.item.id,
        name: item.item.name,
        price: item.item.price,
        quantity: 1,
        restaurantName: item.item.restaurantName,
        restaurantId: item.item.restaurantId
      };
      
      // Add to localStorage cart
      const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      existingCart.push(cartItem);
      localStorage.setItem('cartItems', JSON.stringify(existingCart));
    });

    toast({
      title: "🛒 Meal Added to Cart!",
      description: `Your curated ${curatedMeal.length}-course meal is ready for checkout.`,
    });

    navigate('/cart');
  };

  const getCourseIcon = (type: CuratedMeal['type']) => {
    switch (type) {
      case 'appetizer': return <Utensils className="h-5 w-5" />;
      case 'main': return <ChefHat className="h-5 w-5" />;
      case 'dessert': return <Cookie className="h-5 w-5" />;
      case 'drink': return <Coffee className="h-5 w-5" />;
    }
  };

  const totalPrice = curatedMeal.reduce((sum, item) => sum + item.item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Meal Curator
            </h1>
            <Brain className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-gray-600 text-lg">
            Let me craft the perfect dining experience based on your mood and preferences
          </p>
        </div>

        {/* AI Building Animation */}
        {isBuilding && (
          <Card className="mb-8 border-2 border-purple-200">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <Brain className="h-16 w-16 text-purple-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">AI Chef is Creating Your Perfect Meal...</h3>
                <Progress value={curationStep} className="w-full h-3" />
                <div className="flex items-center justify-center gap-2 text-purple-600">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {curationStep < 20 && "Analyzing your preferences..."}
                    {curationStep >= 20 && curationStep < 40 && "Scanning 40+ menu items..."}
                    {curationStep >= 40 && curationStep < 60 && "Finding perfect combinations..."}
                    {curationStep >= 60 && curationStep < 80 && "Creating your meal..."}
                    {curationStep >= 80 && "Adding finishing touches..."}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Curated Meal Display */}
        {curatedMeal.length > 0 && !isBuilding && (
          <div className="space-y-6">
            {/* Meal Overview */}
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Check className="h-6 w-6" />
                  Your Curated {curatedMeal.length}-Course Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${totalPrice.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Total Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{curatedMeal.length}</div>
                    <div className="text-sm text-gray-600">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(curatedMeal.reduce((sum, item) => sum + item.pairingScore, 0) / curatedMeal.length)}%
                    </div>
                    <div className="text-sm text-gray-600">AI Match Score</div>
                  </div>
                </div>
                <Button onClick={addMealToCart} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Complete Meal to Cart - ${totalPrice.toFixed(2)}
                </Button>
              </CardContent>
            </Card>

            {/* Individual Courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curatedMeal.map((course, index) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow border-2 border-gray-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCourseIcon(course.type)}
                        <Badge variant="outline" className="capitalize">
                          {course.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{course.pairingScore}%</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.item.name}</CardTitle>
                    <p className="text-sm text-gray-600">{course.item.restaurantName}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{course.item.description}</p>
                    
                    {/* AI Reasoning */}
                    <div className="bg-purple-50 p-3 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-purple-700 italic">"{course.reasoning}"</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.item.isVegetarian && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Vegetarian</Badge>
                      )}
                      {course.item.isSpicy && (
                        <Badge className="bg-red-100 text-red-800 text-xs">Spicy</Badge>
                      )}
                      {course.item.popular && (
                        <Badge className="bg-orange-100 text-orange-800 text-xs">Popular</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">${course.item.price}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/restaurant/${course.item.restaurantId}`)}
                      >
                        View Menu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => buildMealAutomatically(userPreferences)} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Create Another Meal
              </Button>
              <Button 
                onClick={() => navigate('/food-search')} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Explore All Food
              </Button>
            </div>
          </div>
        )}

        {/* Empty State - Quick Start Options */}
        {curatedMeal.length === 0 && !isBuilding && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Tell Me How You're Feeling</CardTitle>
                <p className="text-center text-gray-600">I'll create the perfect meal for your mood</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { mood: 'adventurous', icon: Globe, color: 'purple', description: 'Try something new' },
                    { mood: 'comfort', icon: Heart, color: 'red', description: 'Cozy and familiar' },
                    { mood: 'healthy', icon: Zap, color: 'green', description: 'Fresh and nutritious' },
                    { mood: 'romantic', icon: Star, color: 'pink', description: 'Special occasion' }
                  ].map(({ mood, icon: Icon, color, description }) => (
                    <Button
                      key={mood}
                      variant="outline"
                      className={`h-24 flex flex-col gap-2 hover:bg-${color}-50 hover:border-${color}-300`}
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('mood', mood);
                        params.set('autoBuild', 'true');
                        navigate(`/meal-curator?${params}`);
                      }}
                    >
                      <Icon className={`h-6 w-6 text-${color}-500`} />
                      <div className="text-center">
                        <div className="font-semibold capitalize">{mood}</div>
                        <div className="text-xs text-gray-500">{description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCurator;