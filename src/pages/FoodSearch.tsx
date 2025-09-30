import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Clock, DollarSign, Plus, Filter, Search, ChefHat } from "lucide-react";
import { restaurants, MenuItem } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface FoodItemWithRestaurant extends MenuItem {
  restaurantId: string;
  restaurantName: string;
  restaurantCuisine: string;
  restaurantRating: number;
  restaurantImage: string;
  deliveryTime: string;
}

const FoodSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [compareItems, setCompareItems] = useState<string[]>([]);

  // Flatten all menu items with restaurant info
  const allFoodItems: FoodItemWithRestaurant[] = useMemo(() => {
    return restaurants.flatMap(restaurant => 
      restaurant.menu.map(item => ({
        ...item,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantCuisine: restaurant.cuisine,
        restaurantRating: restaurant.avg_rating,
        restaurantImage: restaurant.image,
        deliveryTime: `${restaurant.delivery_time_min}-${restaurant.delivery_time_max} min`
      }))
    );
  }, []);

  // Get all unique categories and ingredients
  const allCategories = useMemo(() => 
    [...new Set(allFoodItems.map(item => item.category))].sort(), [allFoodItems]);
  
  const allIngredients = useMemo(() => 
    [...new Set(allFoodItems.flatMap(item => item.ingredients || []))].sort(), [allFoodItems]);

  // Filter food items based on search criteria
  const filteredItems = useMemo(() => {
    return allFoodItems.filter(item => {
      // Text search
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.ingredients || []).some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurantCuisine.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(item.category);

      // Ingredient filter
      const matchesIngredients = selectedIngredients.length === 0 ||
        selectedIngredients.every(ing => 
          (item.ingredients || []).some(itemIng => 
            itemIng.toLowerCase().includes(ing.toLowerCase())
          )
        );

      // Price filter
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      // Vegetarian filter
      const matchesVegetarian = !showVegetarianOnly || item.isVegetarian;

      return matchesSearch && matchesCategory && matchesIngredients && matchesPrice && matchesVegetarian;
    });
  }, [allFoodItems, searchQuery, selectedCategories, selectedIngredients, priceRange, showVegetarianOnly]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (selectedIngredients.length > 0) params.set("ingredients", selectedIngredients.join(","));
    if (priceRange[0] !== 0 || priceRange[1] !== 50) params.set("price", `${priceRange[0]}-${priceRange[1]}`);
    if (showVegetarianOnly) params.set("vegetarian", "true");
    setSearchParams(params);
  }, [searchQuery, selectedCategories, selectedIngredients, priceRange, showVegetarianOnly, setSearchParams]);

  const addToCart = (item: FoodItemWithRestaurant) => {
    // Navigate to restaurant detail page with add to cart parameter
    navigate(`/restaurant/${item.restaurantId}?addToCart=${item.restaurantId}:${item.id}:1`);
    toast({
      title: "Added to Cart",
      description: `${item.name} from ${item.restaurantName} added to your cart!`,
    });
  };

  const toggleCompare = (itemId: string) => {
    setCompareItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : prev.length < 3 
          ? [...prev, itemId] 
          : prev
    );
  };

  const viewComparison = () => {
    const compareItemsData = filteredItems.filter(item => compareItems.includes(item.id));
    navigate("/food-compare", { state: { items: compareItemsData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <ChefHat className="text-orange-500" />
            Food Discovery
          </h1>
          <p className="text-gray-600">Search across all restaurants and find exactly what you're craving</p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Search */}
          <div className="lg:col-span-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for food, ingredients, or restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>

          {/* Filters */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Categories */}
              <div>
                <h4 className="font-semibold mb-2">Categories</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allCategories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          }
                        }}
                      />
                      <label htmlFor={category} className="text-sm">{category}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h4 className="font-semibold mb-2">Ingredients</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allIngredients.slice(0, 15).map(ingredient => (
                    <div key={ingredient} className="flex items-center space-x-2">
                      <Checkbox
                        id={ingredient}
                        checked={selectedIngredients.includes(ingredient)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIngredients([...selectedIngredients, ingredient]);
                          } else {
                            setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
                          }
                        }}
                      />
                      <label htmlFor={ingredient} className="text-sm capitalize">{ingredient}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vegetarian */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vegetarian"
                  checked={showVegetarianOnly}
                  onCheckedChange={setShowVegetarianOnly}
                />
                <label htmlFor="vegetarian" className="text-sm">Vegetarian Only</label>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Compare Bar */}
            {compareItems.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {compareItems.length} item(s) selected for comparison
                </span>
                <div className="space-x-2">
                  <Button
                    onClick={viewComparison}
                    disabled={compareItems.length < 2}
                    size="sm"
                  >
                    Compare ({compareItems.length})
                  </Button>
                  <Button
                    onClick={() => setCompareItems([])}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                {filteredItems.length} food items found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Food Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={`${item.restaurantId}-${item.id}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{item.restaurantName}</p>
                        <Badge variant="outline" className="mt-1">
                          {item.restaurantCuisine}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${item.price}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {item.restaurantRating}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    {/* Ingredients */}
                    {item.ingredients && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Ingredients:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.ingredients.slice(0, 4).map(ingredient => (
                            <Badge key={ingredient} variant="secondary" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                          {item.ingredients.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.ingredients.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.isVegetarian && <Badge className="bg-green-100 text-green-800">Vegetarian</Badge>}
                      {item.isSpicy && <Badge className="bg-red-100 text-red-800">Spicy</Badge>}
                      {item.popular && <Badge className="bg-orange-100 text-orange-800">Popular</Badge>}
                    </div>

                    {/* Restaurant Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.deliveryTime}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {item.category}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(item)}
                        className="flex-1"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        onClick={() => toggleCompare(item.id)}
                        variant={compareItems.includes(item.id) ? "default" : "outline"}
                        size="sm"
                        disabled={!compareItems.includes(item.id) && compareItems.length >= 3}
                      >
                        {compareItems.includes(item.id) ? "✓" : "Compare"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No food items found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or browse our restaurants</p>
                <Button
                  onClick={() => navigate("/restaurants")}
                  className="mt-4"
                >
                  Browse Restaurants
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSearch;