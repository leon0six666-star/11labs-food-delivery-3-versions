import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dumbbell, 
  Baby, 
  Heart, 
  Zap, 
  Scale,
  Activity,
  Brain,
  Calculator,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NutritionGoal {
  id: string;
  type: 'fitness' | 'health' | 'medical' | 'lifestyle';
  scenario: string;
  icon: any;
  color: string;
  requirements: {
    calories?: { min?: number; max?: number; target?: number };
    protein?: { min?: number; target?: number };
    carbs?: { max?: number; min?: number };
    fat?: { max?: number; min?: number };
    fiber?: { min?: number };
    sodium?: { max?: number };
    specialNutrients?: string[]; // iron, folate, omega-3, etc.
  };
  restrictions: string[];
  timeConstraints?: string;
  description: string;
}

interface CuratedNutritionMeal {
  id: string;
  foods: Array<{
    name: string;
    restaurant: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    specialNutrients?: Record<string, number>;
    whyChosen: string;
  }>;
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
  goalMatch: number; // percentage match to user's goals
  warnings?: string[];
  benefits: string[];
  totalPrice: number;
}

const NutritionCurator = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedGoal, setSelectedGoal] = useState<NutritionGoal | null>(null);
  const [curatedMeal, setCuratedMeal] = useState<CuratedNutritionMeal | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildingStep, setBuildingStep] = useState(0);

  // SPECIALIZED NUTRITION SCENARIOS
  const nutritionGoals: NutritionGoal[] = [
    {
      id: 'bulking',
      type: 'fitness',
      scenario: 'Muscle Bulking',
      icon: Dumbbell,
      color: 'purple',
      requirements: {
        calories: { target: 3000, min: 2500 },
        protein: { target: 150, min: 120 },
        carbs: { min: 300 }
      },
      restrictions: [],
      description: 'High-calorie, high-protein meals for muscle gain',
    },
    {
      id: 'pregnancy',
      type: 'health',
      scenario: 'Pregnancy Nutrition',
      icon: Baby,
      color: 'pink',
      requirements: {
        calories: { target: 2200, min: 1800 },
        protein: { target: 75, min: 60 },
        specialNutrients: ['folate', 'iron', 'calcium']
      },
      restrictions: ['raw fish', 'alcohol', 'high mercury fish', 'unpasteurized cheese'],
      description: 'Safe, nutrient-rich foods for mother and baby',
    },
    {
      id: 'diabetic',
      type: 'medical',
      scenario: 'Diabetic Management',
      icon: Heart,
      color: 'red',
      requirements: {
        carbs: { max: 45 },
        fiber: { min: 25 },
        sodium: { max: 2000 }
      },
      restrictions: ['high sugar', 'refined carbs', 'processed foods'],
      description: 'Low-carb, high-fiber foods for blood sugar control',
    },
    {
      id: 'cutting',
      type: 'fitness',
      scenario: 'Weight Loss (Cutting)',
      icon: Scale,
      color: 'green',
      requirements: {
        calories: { max: 1500, target: 1200 },
        protein: { min: 100, target: 120 },
        fat: { max: 50 }
      },
      restrictions: [],
      description: 'High-protein, low-calorie foods for fat loss',
    },
    {
      id: 'preworkout',
      type: 'fitness',
      scenario: 'Pre-Workout Energy',
      icon: Zap,
      color: 'orange',
      requirements: {
        carbs: { min: 40, target: 60 },
        fat: { max: 10 },
        protein: { min: 15 }
      },
      restrictions: ['high fiber', 'high fat'],
      timeConstraints: 'Easy digestion, 1-2 hours before workout',
      description: 'Quick energy without digestive stress',
    },
    {
      id: 'antiinflammatory',
      type: 'health',
      scenario: 'Anti-Inflammatory',
      icon: Activity,
      color: 'blue',
      requirements: {
        specialNutrients: ['omega-3', 'antioxidants', 'vitamin-d']
      },
      restrictions: ['processed foods', 'trans fats', 'excessive sugar'],
      description: 'Foods that reduce inflammation and joint pain',
    },
    {
      id: 'senior',
      type: 'health',
      scenario: 'Senior Nutrition (65+)',
      icon: Heart,
      color: 'purple',
      requirements: {
        calories: { target: 1800, max: 2200 },
        protein: { min: 60, target: 80 },
        specialNutrients: ['calcium', 'vitamin-d', 'vitamin-b12', 'fiber', 'potassium']
      },
      restrictions: ['hard-to-chew', 'high-sodium', 'raw-foods', 'tough-meats'],
      description: 'Easy-to-digest, nutrient-dense meals for healthy aging',
    },
    {
      id: 'heart-healthy',
      type: 'health',
      scenario: 'Heart Healthy',
      icon: Activity,
      color: 'red',
      requirements: {
        calories: { max: 2000 },
        sodium: { max: 1500 },
        specialNutrients: ['omega-3', 'potassium', 'fiber', 'magnesium']
      },
      restrictions: ['high-sodium', 'saturated-fat', 'trans-fat', 'processed-meats'],
      description: 'Low-sodium, heart-protective meals for cardiovascular health',
    }
  ];

  // Parse URL parameters
  useEffect(() => {
    const goalId = searchParams.get('goal');
    const autoBuild = searchParams.get('autoBuild');
    
    if (goalId) {
      const goal = nutritionGoals.find(g => g.id === goalId);
      if (goal) {
        setSelectedGoal(goal);
        if (autoBuild === 'true') {
          buildNutritionMeal(goal);
        }
      }
    }
  }, [searchParams]);

  const buildNutritionMeal = async (goal: NutritionGoal) => {
    setIsBuilding(true);
    setBuildingStep(0);
    setCuratedMeal(null);

    // Simulate AI nutrition analysis
    const steps = [
      "Analyzing your nutritional requirements...",
      "Scanning menus for optimal nutrient profiles...", 
      "Calculating macro and micronutrient combinations...",
      "Applying dietary restrictions and safety filters...",
      "Optimizing for taste and satisfaction...",
      "Finalizing your personalized nutrition plan..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setBuildingStep((i + 1) * (100 / steps.length));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Generate nutrition-optimized meal based on goal
    const meal = generateNutritionMeal(goal);
    setCuratedMeal(meal);
    setIsBuilding(false);

    toast({
      title: `🧬 ${goal.scenario} Meal Ready!`,
      description: `Optimized for your nutritional goals with ${meal.goalMatch}% accuracy.`,
    });
  };

  const generateNutritionMeal = (goal: NutritionGoal): CuratedNutritionMeal => {
    // MOCK NUTRITION-OPTIMIZED MEALS based on goal
    switch (goal.id) {
      case 'bulking':
        return {
          id: 'bulking-meal',
          foods: [
            {
              name: 'Bulgogi with Extra Rice',
              restaurant: 'Seoul Kitchen',
              calories: 950,
              protein: 45,
              carbs: 85,
              fat: 32,
              whyChosen: 'High calories and protein for muscle building, complex carbs for sustained energy'
            },
            {
              name: 'Protein Smoothie (Chocolate)',
              restaurant: 'Supplement Bar',
              calories: 420,
              protein: 35,
              carbs: 45,
              fat: 8,
              whyChosen: 'Fast-absorbing protein for post-workout, additional calories for surplus'
            },
            {
              name: 'Avocado Toast',
              restaurant: 'Healthy Corner',
              calories: 380,
              protein: 12,
              carbs: 35,
              fat: 24,
              whyChosen: 'Healthy fats and additional calories, moderate protein'
            }
          ],
          totalNutrition: {
            calories: 1750,
            protein: 92,
            carbs: 165,
            fat: 64,
            fiber: 18,
            sodium: 1850
          },
          goalMatch: 89,
          benefits: [
            'Exceeds protein target for muscle synthesis',
            'High-quality complex carbohydrates',
            'Caloric surplus for muscle gain',
            'Balanced macro distribution'
          ],
          totalPrice: 45.97
        };

      case 'pregnancy':
        return {
          id: 'pregnancy-meal',
          foods: [
            {
              name: 'Spinach and Feta Salad',
              restaurant: 'Mediterranean Breeze',
              calories: 320,
              protein: 18,
              carbs: 25,
              fat: 18,
              specialNutrients: { folate: 180, iron: 3.5, calcium: 250 },
              whyChosen: 'High folate for neural development, iron for blood health, calcium for bones'
            },
            {
              name: 'Grilled Salmon (Cooked)',
              restaurant: 'Sakura Sushi',
              calories: 380,
              protein: 35,
              carbs: 0,
              fat: 22,
              specialNutrients: { omega3: 1200, iron: 1.8 },
              whyChosen: 'Omega-3 for brain development, high-quality protein, fully cooked for safety'
            },
            {
              name: 'Fortified Orange Juice',
              restaurant: 'Fresh Juice Bar',
              calories: 120,
              protein: 2,
              carbs: 28,
              fat: 0,
              specialNutrients: { folate: 60, calcium: 150 },
              whyChosen: 'Additional folate and calcium, vitamin C for iron absorption'
            }
          ],
          totalNutrition: {
            calories: 820,
            protein: 55,
            carbs: 53,
            fat: 40,
            fiber: 8,
            sodium: 950
          },
          goalMatch: 94,
          warnings: ['Limit caffeine intake', 'Ensure salmon is fully cooked'],
          benefits: [
            '240mcg folate (60% of pregnancy needs)',
            '5.3mg iron (30% of pregnancy needs)', 
            '400mg calcium (40% of pregnancy needs)',
            'Omega-3 for baby brain development',
            'All pregnancy-safe ingredients'
          ],
          totalPrice: 32.50
        };

      case 'diabetic':
        return {
          id: 'diabetic-meal',
          foods: [
            {
              name: 'Greek Salad (Large)',
              restaurant: 'Mediterranean Breeze',
              calories: 280,
              protein: 12,
              carbs: 15,
              fat: 22,
              whyChosen: 'Very low carbs, high fiber, healthy fats slow glucose absorption'
            },
            {
              name: 'Grilled Chicken Breast',
              restaurant: 'Healthy Grill',
              calories: 220,
              protein: 40,
              carbs: 0,
              fat: 6,
              whyChosen: 'Zero carbs, high protein helps stabilize blood sugar'
            },
            {
              name: 'Steamed Broccoli',
              restaurant: 'Veggie Delight',
              calories: 60,
              protein: 4,
              carbs: 12,
              fat: 1,
              whyChosen: 'High fiber (8g), low net carbs, nutrient dense'
            }
          ],
          totalNutrition: {
            calories: 560,
            protein: 56,
            carbs: 27,
            fat: 29,
            fiber: 15,
            sodium: 850
          },
          goalMatch: 96,
          benefits: [
            'Only 27g total carbs (within limit)',
            '15g fiber helps slow glucose absorption',
            'High protein prevents blood sugar spikes',
            'Low glycemic index foods',
            'Heart-healthy Mediterranean fats'
          ],
          totalPrice: 28.75
        };

      case 'senior':
        return {
          id: 'senior-meal',
          foods: [
            {
              name: 'Soft Chicken Teriyaki Bowl',
              restaurant: 'Healthy Kitchen',
              calories: 420,
              protein: 35,
              carbs: 45,
              fat: 12,
              specialNutrients: { calcium: 180, vitaminD: 15, vitaminB12: 2.4, potassium: 650 },
              whyChosen: 'Tender chicken, easy to chew, fortified with senior-essential nutrients'
            },
            {
              name: 'Steamed Fish with Soft Vegetables',
              restaurant: 'Mediterranean Breeze',
              calories: 320,
              protein: 28,
              carbs: 20,
              fat: 14,
              specialNutrients: { omega3: 800, calcium: 120, potassium: 480 },
              whyChosen: 'Soft texture, brain-healthy omega-3, heart-friendly low sodium'
            },
            {
              name: 'Fortified Yogurt with Berries',
              restaurant: 'Dairy Fresh',
              calories: 180,
              protein: 12,
              carbs: 25,
              fat: 4,
              specialNutrients: { calcium: 350, vitaminD: 25, vitaminB12: 1.8 },
              whyChosen: 'Easy to digest, bone-strengthening calcium and vitamin D'
            }
          ],
          totalNutrition: {
            calories: 920,
            protein: 75,
            carbs: 90,
            fat: 30,
            fiber: 12,
            sodium: 980
          },
          goalMatch: 92,
          benefits: [
            '75g protein supports muscle maintenance in seniors',
            '650mg calcium + vitamin D for bone health',
            'All foods are soft and easy to chew',
            'Low sodium (980mg) protects heart health',
            'B12 fortified to prevent deficiency common in seniors',
            'Omega-3 supports brain and heart health'
          ],
          totalPrice: 34.20
        };

      case 'heart-healthy':
        return {
          id: 'heart-healthy-meal',
          foods: [
            {
              name: 'Grilled Salmon Salad (No Salt)',
              restaurant: 'Heart Smart Kitchen',
              calories: 380,
              protein: 32,
              carbs: 15,
              fat: 22,
              specialNutrients: { omega3: 1400, potassium: 720, magnesium: 85 },
              whyChosen: 'Rich in heart-protective omega-3, zero added sodium, high potassium'
            },
            {
              name: 'Quinoa Bowl with Avocado',
              restaurant: 'Whole Grains Co',
              calories: 350,
              protein: 14,
              carbs: 45,
              fat: 16,
              specialNutrients: { fiber: 12, potassium: 540, magnesium: 60 },
              whyChosen: 'High fiber lowers cholesterol, magnesium supports heart rhythm'
            },
            {
              name: 'Unsalted Mixed Nuts',
              restaurant: 'Natural Snacks',
              calories: 200,
              protein: 8,
              carbs: 8,
              fat: 18,
              specialNutrients: { magnesium: 95, potassium: 200, fiber: 4 },
              whyChosen: 'Healthy fats, magnesium for heart function, zero sodium'
            }
          ],
          totalNutrition: {
            calories: 930,
            protein: 54,
            carbs: 68,
            fat: 56,
            fiber: 16,
            sodium: 450
          },
          goalMatch: 95,
          benefits: [
            'Only 450mg sodium (well under 1500mg limit)',
            '16g fiber helps lower cholesterol naturally',
            '1400mg omega-3 reduces inflammation',
            '1460mg potassium supports healthy blood pressure',
            '240mg magnesium for heart rhythm regulation',
            'Zero processed meats or trans fats'
          ],
          totalPrice: 31.85
        };

      default:
        return {
          id: 'default-meal',
          foods: [],
          totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
          goalMatch: 0,
          benefits: [],
          totalPrice: 0
        };
    }
  };

  const addMealToCart = () => {
    if (!curatedMeal) return;
    
    // Add all foods to cart logic here
    toast({
      title: "🛒 Nutrition Plan Added!",
      description: `Your optimized ${selectedGoal?.scenario} meal plan is ready for checkout.`,
    });
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-blue-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Nutrition AI Curator
            </h1>
            <Calculator className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-gray-600 text-lg">
            Scientifically optimized meals for your specific health and fitness goals
          </p>
        </div>

        {/* AI Building Animation */}
        {isBuilding && (
          <Card className="mb-8 border-2 border-blue-200">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <Brain className="h-16 w-16 text-blue-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">Nutrition AI Analyzing Your Goals...</h3>
                <Progress value={buildingStep} className="w-full h-3" />
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Calculator className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Processing nutritional requirements and optimizing combinations...
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Curated Nutrition Meal Display */}
        {curatedMeal && !isBuilding && selectedGoal && (
          <div className="space-y-6">
            {/* Meal Overview */}
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-6 w-6" />
                  Your {selectedGoal.scenario} Nutrition Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Nutrition Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{curatedMeal.totalNutrition.calories}</div>
                    <div className="text-sm text-gray-600">Calories</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{curatedMeal.totalNutrition.protein}g</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{curatedMeal.totalNutrition.carbs}g</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{curatedMeal.goalMatch}%</div>
                    <div className="text-sm text-gray-600">Goal Match</div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-green-700">Why This Meal Plan Works:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {curatedMeal.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                {curatedMeal.warnings && curatedMeal.warnings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-orange-700">Important Notes:</h4>
                    {curatedMeal.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-orange-700">{warning}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button onClick={addMealToCart} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  <Target className="h-5 w-5 mr-2" />
                  Add Nutrition Plan to Cart - ${curatedMeal.totalPrice.toFixed(2)}
                </Button>
              </CardContent>
            </Card>

            {/* Individual Foods */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curatedMeal.foods.map((food, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{food.name}</CardTitle>
                    <p className="text-sm text-gray-600">{food.restaurant}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div><span className="font-medium">Calories:</span> {food.calories}</div>
                      <div><span className="font-medium">Protein:</span> {food.protein}g</div>
                      <div><span className="font-medium">Carbs:</span> {food.carbs}g</div>
                      <div><span className="font-medium">Fat:</span> {food.fat}g</div>
                    </div>
                    
                    {/* Special Nutrients */}
                    {food.specialNutrients && (
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">Key Nutrients:</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(food.specialNutrients).map(([nutrient, value]) => (
                            <Badge key={nutrient} className="bg-blue-100 text-blue-800 text-xs">
                              {nutrient}: {value}{nutrient.includes('omega') ? 'mg' : nutrient.includes('folate') ? 'mcg' : 'mg'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Reasoning */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Brain className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-700 italic">"{food.whyChosen}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Goal Selection */}
        {!selectedGoal && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Choose Your Nutrition Goal</CardTitle>
                <p className="text-center text-gray-600">AI will optimize your meal for maximum results</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nutritionGoals.map((goal) => {
                    const IconComponent = goal.icon;
                    return (
                      <Button
                        key={goal.id}
                        variant="outline"
                        className={`h-32 flex flex-col gap-3 hover:bg-${goal.color}-50 hover:border-${goal.color}-300`}
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set('goal', goal.id);
                          params.set('autoBuild', 'true');
                          navigate(`/nutrition-curator?${params}`);
                        }}
                      >
                        <IconComponent className={`h-8 w-8 text-${goal.color}-500`} />
                        <div className="text-center">
                          <div className="font-semibold">{goal.scenario}</div>
                          <div className="text-xs text-gray-500 mt-1">{goal.description}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionCurator;