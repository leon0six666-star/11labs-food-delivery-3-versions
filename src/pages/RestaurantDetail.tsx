import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { restaurants, calculateDistance, type MenuItem } from "@/data/mockData";

// Create a restaurant lookup object
const restaurantLookup = restaurants.reduce((acc, restaurant) => {
  acc[restaurant.id] = restaurant;
  return acc;
}, {} as Record<string, typeof restaurants[0]>);

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const restaurant = id ? restaurantLookup[id] : null;
  const [restaurantDistance, setRestaurantDistance] = useState<number | null>(null);

  // Calculate distance if user location is available
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation && restaurant) {
      const location = JSON.parse(savedLocation);
      setUserLocation(location);
      const distance = calculateDistance(location.lat, location.lng, restaurant.latitude, restaurant.longitude);
      setRestaurantDistance(distance);
    }
  }, [restaurant]);

  // Handle add to cart from URL (for AI agent)
  useEffect(() => {
    const addToCartParam = searchParams.get('addToCart');
    if (addToCartParam) {
      const [restaurantId, itemId, quantity] = addToCartParam.split(':');
      if (restaurantId === id) {
        setCart(prev => ({
          ...prev,
          [itemId]: (prev[itemId] || 0) + parseInt(quantity || '1')
        }));
        
        const item = restaurant?.menu.find(item => item.id === itemId);
        toast({
          title: "Added to cart",
          description: `${item?.name} has been added to your cart.`,
        });
        
        // Clear the parameter
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('addToCart');
        setSearchParams(newParams);
      }
    }
  }, [searchParams, id, restaurant, toast, setSearchParams]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant not found</h1>
          <Button onClick={() => navigate('/restaurants')} variant="outline">
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
    
    const item = restaurant.menu.find(item => item.id === itemId);
    toast({
      title: "Added to cart",
      description: `${item?.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = restaurant.menu.find(item => item.id === itemId);
      return total + (item?.price || 0) * quantity;
    }, 0);
  };

  const menuCategories = [...new Set(restaurant.menu.map(item => item.category))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-soft border-b">
        <div className="container mx-auto px-4 py-6">
          <Button 
            onClick={() => navigate('/restaurants')} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Restaurants
          </Button>

          <div className="flex items-start gap-6">
            <div className="text-6xl">{restaurant.image}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-muted-foreground mb-4">{restaurant.description}</p>
              
              <div className="flex items-center gap-6 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.avg_rating}</span>
                  <span className="text-muted-foreground">({restaurant.total_reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{restaurant.delivery_time_min}-{restaurant.delivery_time_max} min</span>
                </div>
                {restaurantDistance && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{restaurantDistance}km away</span>
                  </div>
                )}
                <Badge variant="outline">{restaurant.price_range}</Badge>
                <Badge variant={restaurant.is_open ? "secondary" : "destructive"}>
                  {restaurant.is_open ? "Open" : "Closed"}
                </Badge>
                <Badge variant="secondary" className="capitalize">{restaurant.cuisine}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{restaurant.phone}</span>
                </div>
              </div>

              {/* Restaurant Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Delivery Info */}
              <div className="bg-secondary/20 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Delivery fee: <strong>${restaurant.delivery_fee}</strong></span>
                  <span>Minimum order: <strong>${restaurant.min_order}</strong></span>
                </div>
              </div>
            </div>
            
            {getTotalItems() > 0 && (
              <Button onClick={() => navigate('/cart')} variant="gradient" className="ml-auto">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({getTotalItems()}) - ${getTotalPrice().toFixed(2)}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        
        {menuCategories.map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="grid gap-4">
              {restaurant.menu
                .filter(item => item.category === category)
                .map(item => (
                  <Card key={item.id} className="shadow-soft">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{item.name}</h4>
                            {item.popular && <Badge variant="secondary" className="text-xs">Popular</Badge>}
                            {item.isVegetarian && <Badge variant="outline" className="text-xs text-green-600">🌱 Veg</Badge>}
                            {item.isVegan && <Badge variant="outline" className="text-xs text-green-600">🌿 Vegan</Badge>}
                            {item.isSpicy && <Badge variant="outline" className="text-xs text-red-600">🌶️ Spicy</Badge>}
                          </div>
                          <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                          {item.ingredients && (
                            <p className="text-xs text-muted-foreground mb-3">
                              <strong>Ingredients:</strong> {item.ingredients.join(", ")}
                            </p>
                          )}
                          <p className="font-bold text-lg text-primary">${item.price}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 ml-6">
                          {cart[item.id] ? (
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => removeFromCart(item.id)}
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium min-w-[2rem] text-center">
                                {cart[item.id]}
                              </span>
                              <Button
                                onClick={() => addToCart(item.id)}
                                variant="default"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button onClick={() => addToCart(item.id)} variant="default">
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            {category !== menuCategories[menuCategories.length - 1] && (
              <Separator className="mt-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;