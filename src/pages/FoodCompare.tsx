import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, Clock, Plus, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodItemWithRestaurant {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  popular?: boolean;
  restaurantId: string;
  restaurantName: string;
  restaurantCuisine: string;
  restaurantRating: number;
  deliveryTime: string;
}

const FoodCompare = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const items: FoodItemWithRestaurant[] = location.state?.items || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Compare</h1>
            <p className="text-gray-600 mb-6">Please select items from the food search page to compare them.</p>
            <Button onClick={() => navigate("/food-search")}>
              Go to Food Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const addToCart = (item: FoodItemWithRestaurant) => {
    navigate(`/restaurant/${item.restaurantId}?addToCart=${item.restaurantId}:${item.id}:1`);
    toast({
      title: "Added to Cart",
      description: `${item.name} from ${item.restaurantName} added to your cart!`,
    });
  };

  const allIngredients = [...new Set(items.flatMap(item => item.ingredients || []))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button onClick={() => navigate(-1)} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Food Comparison</h1>
          <p className="text-gray-600">Compare {items.length} selected items side by side</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => (
            <Card key={`${item.restaurantId}-${item.id}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{item.restaurantName}</p>
                    <Badge variant="outline" className="mt-1">{item.restaurantCuisine}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">${item.price}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {item.restaurantRating}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.isVegetarian && <Badge className="bg-green-100 text-green-800 text-xs">Vegetarian</Badge>}
                  {item.isSpicy && <Badge className="bg-red-100 text-red-800 text-xs">Spicy</Badge>}
                  {item.popular && <Badge className="bg-orange-100 text-orange-800 text-xs">Popular</Badge>}
                </div>
                <Button onClick={() => addToCart(item)} className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Feature</TableHead>
                    {items.map((item) => (
                      <TableHead key={`${item.restaurantId}-${item.id}`} className="min-w-48">
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.restaurantName}</div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Price</TableCell>
                    {items.map((item) => (
                      <TableCell key={`${item.restaurantId}-${item.id}`}>
                        <span className="text-lg font-bold text-green-600">${item.price}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Category</TableCell>
                    {items.map((item) => (
                      <TableCell key={`${item.restaurantId}-${item.id}`}>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Vegetarian</TableCell>
                    {items.map((item) => (
                      <TableCell key={`${item.restaurantId}-${item.id}`}>
                        {item.isVegetarian ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Spicy</TableCell>
                    {items.map((item) => (
                      <TableCell key={`${item.restaurantId}-${item.id}`}>
                        {item.isSpicy ? (
                          <CheckCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {allIngredients.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ingredients Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Ingredient</TableHead>
                      {items.map((item) => (
                        <TableHead key={`${item.restaurantId}-${item.id}`} className="min-w-48">
                          <div>
                            <div className="font-bold">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.restaurantName}</div>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allIngredients.map((ingredient) => (
                      <TableRow key={ingredient}>
                        <TableCell className="font-medium capitalize">{ingredient}</TableCell>
                        {items.map((item) => (
                          <TableCell key={`${item.restaurantId}-${item.id}`}>
                            {(item.ingredients || []).some(ing => 
                              ing.toLowerCase() === ingredient.toLowerCase()
                            ) ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button onClick={() => navigate("/food-search")} variant="outline">
            Search More Food
          </Button>
          <Button onClick={() => navigate("/restaurants")} variant="outline">
            Browse Restaurants
          </Button>
          <Button onClick={() => navigate("/cart")} className="bg-green-600 hover:bg-green-700">
            View Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCompare;