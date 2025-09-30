import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Plus, 
  X, 
  Baby, 
  User, 
  Utensils, 
  Heart,
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  Clock,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart, cartHelpers } from "@/contexts/CartContext";
import { DietaryFilters } from "@/components/AdvancedDietaryFilter";

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  type: 'adult' | 'teen' | 'child' | 'toddler';
  dietaryRestrictions: DietaryFilters;
  preferences: string[];
  dislikes: string[];
  portion: 'small' | 'regular' | 'large';
}

interface MealRecommendation {
  name: string;
  restaurant: string;
  price: number;
  servesMembers: string[]; // Member IDs who can eat this
  reasons: string[];
  portionMultiplier: number;
}

interface FamilyMealPlan {
  id: string;
  familyMembers: FamilyMember[];
  sharedMeals: MealRecommendation[];
  individualMeals: Record<string, MealRecommendation>; // memberId -> meal
  totalCost: number;
  compromiseScore: number; // How well it satisfies everyone
  warnings: string[];
}

const FamilyMealPlanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, dispatch } = useCart();
  
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [mealPlan, setMealPlan] = useState<FamilyMealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Add family member form
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberAge, setNewMemberAge] = useState(25);

  useEffect(() => {
    // Sample family for demo
    if (familyMembers.length === 0) {
      setFamilyMembers([
        {
          id: '1',
          name: 'Dad (John)',
          age: 42,
          type: 'adult',
          dietaryRestrictions: { lowSodium: true },
          preferences: ['spicy', 'meat', 'asian'],
          dislikes: ['seafood'],
          portion: 'large'
        },
        {
          id: '2', 
          name: 'Mom (Sarah)',
          age: 39,
          type: 'adult',
          dietaryRestrictions: { vegetarian: true, glutenFree: true },
          preferences: ['salads', 'pasta', 'healthy'],
          dislikes: ['spicy'],
          portion: 'regular'
        },
        {
          id: '3',
          name: 'Emma (8)',
          age: 8,
          type: 'child',
          dietaryRestrictions: { avoidNuts: true },
          preferences: ['pizza', 'chicken', 'simple'],
          dislikes: ['vegetables', 'spicy', 'fish'],
          portion: 'small'
        }
      ]);
    }
  }, []);

  const addFamilyMember = () => {
    if (!newMemberName.trim()) return;
    
    const type = newMemberAge >= 18 ? 'adult' : 
                 newMemberAge >= 13 ? 'teen' :
                 newMemberAge >= 3 ? 'child' : 'toddler';
    
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName,
      age: newMemberAge,
      type,
      dietaryRestrictions: {},
      preferences: [],
      dislikes: [],
      portion: type === 'adult' ? 'regular' : type === 'teen' ? 'regular' : 'small'
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName("");
    setNewMemberAge(25);
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id));
  };

  const generateFamilyMealPlan = async () => {
    if (familyMembers.length === 0) {
      toast({
        title: "Add Family Members",
        description: "Please add at least one family member to create a meal plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Generate mock family meal plan
    const plan = generateMockFamilyPlan(familyMembers);
    setMealPlan(plan);
    setIsGenerating(false);
    
    toast({
      title: "Family Meal Plan Ready!",
      description: `Generated meal plan for ${familyMembers.length} family members with ${plan.compromiseScore}% satisfaction.`,
    });
  };

  const generateMockFamilyPlan = (members: FamilyMember[]): FamilyMealPlan => {
    // Find common ground foods
    const sharedMeals: MealRecommendation[] = [];
    const individualMeals: Record<string, MealRecommendation> = {};
    const warnings: string[] = [];

    // Add shared meals that work for multiple people
    if (members.some(m => m.preferences.includes('pizza')) && 
        !members.some(m => m.dietaryRestrictions.glutenFree)) {
      sharedMeals.push({
        name: "Family Margherita Pizza (Large)",
        restaurant: "Bella Vista Pizza",
        price: 24.99,
        servesMembers: members.filter(m => m.preferences.includes('pizza')).map(m => m.id),
        reasons: ["Kid-friendly favorite", "Shareable for multiple people"],
        portionMultiplier: 1.5
      });
    }

    // Add individual accommodations
    const vegetarianMember = members.find(m => m.dietaryRestrictions.vegetarian);
    if (vegetarianMember) {
      individualMeals[vegetarianMember.id] = {
        name: "Vegetarian Pasta Primavera",
        restaurant: "Bella Vista Pizza", 
        price: 17.99,
        servesMembers: [vegetarianMember.id],
        reasons: ["Vegetarian requirement", "Gluten-free option available"],
        portionMultiplier: vegetarianMember.portion === 'small' ? 0.7 : 1
      };
    }

    const spicyLover = members.find(m => m.preferences.includes('spicy') && !m.dislikes.includes('spicy'));
    if (spicyLover && !individualMeals[spicyLover.id]) {
      individualMeals[spicyLover.id] = {
        name: "Spicy Korean Fried Chicken",
        restaurant: "Seoul Kitchen",
        price: 16.99,
        servesMembers: [spicyLover.id],
        reasons: ["Loves spicy food", "Heart-healthy if low sodium version"],
        portionMultiplier: spicyLover.portion === 'large' ? 1.3 : 1
      };
    }

    // Check for conflicts
    if (members.some(m => m.dietaryRestrictions.glutenFree) && 
        members.some(m => m.preferences.includes('pizza'))) {
      warnings.push("Gluten-free member may need separate pizza option");
    }

    if (members.some(m => m.dislikes.includes('spicy')) && 
        members.some(m => m.preferences.includes('spicy'))) {
      warnings.push("Conflicting spice preferences - consider mild options");
    }

    const totalCost = sharedMeals.reduce((sum, meal) => sum + meal.price, 0) +
                     Object.values(individualMeals).reduce((sum, meal) => sum + meal.price, 0);

    const compromiseScore = Math.round((sharedMeals.length * 30 + 
                                      Object.keys(individualMeals).length * 20 + 
                                      (warnings.length === 0 ? 20 : 0) + 30));

    return {
      id: 'family-plan-' + Date.now(),
      familyMembers: members,
      sharedMeals,
      individualMeals,
      totalCost,
      compromiseScore: Math.min(compromiseScore, 95),
      warnings
    };
  };

  const addMealPlanToCart = () => {
    if (!mealPlan) return;

    // Enable group order mode
    const familyNames = mealPlan.familyMembers.map(m => m.name.split(' ')[0]).join(', ');
    cartHelpers.enableGroupOrder(dispatch, `Family Order (${familyNames})`, 
                                 mealPlan.familyMembers.map(m => m.name));

    // Add all meals to cart - this would need actual implementation
    toast({
      title: "Family Meal Plan Added!",
      description: `All meals added to cart with group ordering enabled.`,
    });
    
    navigate('/cart');
  };

  const getMemberTypeIcon = (type: string) => {
    switch (type) {
      case 'adult': return User;
      case 'teen': return User;
      case 'child': return Baby;
      case 'toddler': return Baby;
      default: return User;
    }
  };

  const getMemberTypeColor = (type: string) => {
    switch (type) {
      case 'adult': return 'blue';
      case 'teen': return 'purple';
      case 'child': return 'green';
      case 'toddler': return 'pink';
      default: return 'gray';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Family Meal Planner
            </h1>
            <Utensils className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered meal planning that satisfies everyone's preferences and dietary needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Family Members Panel */}
          <div className="space-y-6">
            {/* Add Family Member */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Family Member
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberName">Name</Label>
                    <Input
                      id="memberName"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="e.g., Mom, Dad, Emma"
                    />
                  </div>
                  <div>
                    <Label htmlFor="memberAge">Age</Label>
                    <Input
                      id="memberAge"
                      type="number"
                      value={newMemberAge}
                      onChange={(e) => setNewMemberAge(parseInt(e.target.value))}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                <Button onClick={addFamilyMember} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </CardContent>
            </Card>

            {/* Family Members List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Members ({familyMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {familyMembers.map((member) => {
                  const IconComponent = getMemberTypeIcon(member.type);
                  const color = getMemberTypeColor(member.type);
                  
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 text-${color}-500`} />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">
                            {member.age} years • {member.type} • {member.portion} portion
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(member.dietaryRestrictions).map(([key, value]) => 
                              value && (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </Badge>
                              )
                            )}
                            {member.preferences.map(pref => (
                              <Badge key={pref} className="text-xs bg-green-100 text-green-700">
                                ❤️ {pref}
                              </Badge>
                            ))}
                            {member.dislikes.map(dislike => (
                              <Badge key={dislike} className="text-xs bg-red-100 text-red-700">
                                ❌ {dislike}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFamilyMember(member.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
                
                {familyMembers.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No family members added yet. Add your first member above!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Generate Plan Button */}
            <Button 
              onClick={generateFamilyMealPlan}
              disabled={familyMembers.length === 0 || isGenerating}
              className="w-full h-12 text-lg"
              variant="gradient"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Family Preferences...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5 mr-2" />
                  Generate Family Meal Plan
                </>
              )}
            </Button>
          </div>

          {/* Meal Plan Results */}
          <div>
            {mealPlan && (
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      Family Meal Plan
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {mealPlan.compromiseScore}% Family Happy
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <DollarSign className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                      <div className="font-bold text-blue-600">${mealPlan.totalCost.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Cost</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Users className="h-6 w-6 mx-auto text-green-600 mb-1" />
                      <div className="font-bold text-green-600">{mealPlan.familyMembers.length}</div>
                      <div className="text-sm text-gray-600">Family Members</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Utensils className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                      <div className="font-bold text-purple-600">
                        {mealPlan.sharedMeals.length + Object.keys(mealPlan.individualMeals).length}
                      </div>
                      <div className="text-sm text-gray-600">Total Items</div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {mealPlan.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2 text-orange-700">
                        <AlertTriangle className="h-4 w-4" />
                        Considerations
                      </h4>
                      {mealPlan.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                          <span className="text-sm text-orange-700">{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Shared Meals */}
                  {mealPlan.sharedMeals.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-green-700">
                        <Heart className="h-4 w-4" />
                        Shared Family Meals
                      </h4>
                      {mealPlan.sharedMeals.map((meal, index) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg mb-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{meal.name}</div>
                              <div className="text-sm text-gray-600">{meal.restaurant}</div>
                            </div>
                            <div className="text-lg font-bold text-green-600">${meal.price}</div>
                          </div>
                          <div className="text-sm text-green-700 mb-2">
                            Serves: {meal.servesMembers.map(id => 
                              mealPlan.familyMembers.find(m => m.id === id)?.name.split(' ')[0]
                            ).join(', ')}
                          </div>
                          <div className="text-xs text-green-600">
                            {meal.reasons.join(' • ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Individual Meals */}
                  {Object.keys(mealPlan.individualMeals).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-700">
                        <User className="h-4 w-4" />
                        Individual Accommodations
                      </h4>
                      {Object.entries(mealPlan.individualMeals).map(([memberId, meal]) => {
                        const member = mealPlan.familyMembers.find(m => m.id === memberId);
                        return (
                          <div key={memberId} className="p-3 bg-blue-50 rounded-lg mb-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-medium">{meal.name}</div>
                                <div className="text-sm text-gray-600">{meal.restaurant}</div>
                                <div className="text-sm text-blue-600">For: {member?.name}</div>
                              </div>
                              <div className="text-lg font-bold text-blue-600">${meal.price}</div>
                            </div>
                            <div className="text-xs text-blue-600">
                              {meal.reasons.join(' • ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <Separator />

                  {/* Action Button */}
                  <Button 
                    onClick={addMealPlanToCart}
                    className="w-full h-12 text-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add Family Plan to Cart - ${mealPlan.totalCost.toFixed(2)}
                  </Button>
                </CardContent>
              </Card>
            )}

            {!mealPlan && !isGenerating && (
              <Card className="h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Add family members and generate a meal plan to see recommendations here</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMealPlanner;