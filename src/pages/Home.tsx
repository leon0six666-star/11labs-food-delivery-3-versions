import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-food.jpg";
import { categories, restaurants } from "@/data/mockData";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/restaurants');
    }
  };

  const handleAddressSubmit = () => {
    if (userAddress.trim()) {
      // Mock geocoding - in real app, use Google Maps API
      const mockCoordinates = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      };
      setUserLocation(mockCoordinates);
      localStorage.setItem('userAddress', userAddress);
      localStorage.setItem('userLocation', JSON.stringify(mockCoordinates));
      
      toast({
        title: "Address saved!",
        description: "We'll show delivery times and distances for your location.",
      });
    }
  };

  useEffect(() => {
    // Load saved address on component mount
    const savedAddress = localStorage.getItem('userAddress');
    const savedLocation = localStorage.getItem('userLocation');
    if (savedAddress && savedLocation) {
      setUserAddress(savedAddress);
      setUserLocation(JSON.parse(savedLocation));
    }
  }, []);

  const popularCuisines = categories.map(category => category.name);
  const featuredRestaurants = restaurants.filter(r => r.promoted).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Floating Elements */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110 transition-transform duration-[20s] ease-out"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(251, 146, 60, 0.9) 0%, rgba(236, 72, 153, 0.8) 50%, rgba(168, 85, 247, 0.7) 100%), url(${heroImage})`
          }}
        />
        
        {/* Floating Food Elements - Responsive */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Desktop floating elements */}
          <div className="hidden md:block absolute top-20 left-20 text-6xl animate-food-float">🍕</div>
          <div className="hidden md:block absolute top-40 right-32 text-5xl animate-food-float" style={{animationDelay: '1s'}}>🍔</div>
          <div className="hidden md:block absolute bottom-40 left-1/4 text-4xl animate-food-float" style={{animationDelay: '2s'}}>🍜</div>
          <div className="hidden md:block absolute top-1/3 right-20 text-5xl animate-food-float" style={{animationDelay: '0.5s'}}>🌮</div>
          <div className="hidden md:block absolute bottom-32 right-1/4 text-4xl animate-food-float" style={{animationDelay: '1.5s'}}>🍝</div>
          <div className="hidden md:block absolute top-60 left-1/3 text-3xl animate-food-float" style={{animationDelay: '2.5s'}}>🥗</div>
          
          {/* Mobile floating elements - fewer and smaller */}
          <div className="md:hidden absolute top-16 left-8 text-3xl animate-food-float">🍕</div>
          <div className="md:hidden absolute top-32 right-8 text-3xl animate-food-float" style={{animationDelay: '1s'}}>🍔</div>
          <div className="md:hidden absolute bottom-24 left-1/4 text-2xl animate-food-float" style={{animationDelay: '2s'}}>🌮</div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <div className="animate-slide-down">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              Food{' '}
              <span className="text-gradient-hero bg-clip-text text-transparent animate-ai-pulse">
                delivered
              </span>{' '}
              fast
            </h1>
            <p className="text-xl md:text-3xl mb-12 text-white/95 font-light max-w-4xl mx-auto leading-relaxed">
              🚀 Revolutionary AI-powered dining experience with{' '}
              <span className="font-semibold text-yellow-300">scientific nutrition optimization</span>,{' '}
              <span className="font-semibold text-green-300">family meal coordination</span>, and{' '}
              <span className="font-semibold text-purple-300">voice-first ordering</span>
            </p>
          </div>
          
          {/* Address Input */}
          {!userLocation && (
            <div className="max-w-lg mx-auto mb-6">
              <div className="flex gap-2 bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-strong">
                <MapPin className="h-5 w-5 text-muted-foreground mt-3 ml-2" />
                <Input
                  placeholder="Enter your delivery address..."
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
                  className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={handleAddressSubmit} variant="hero" size="sm">
                  Set Location
                </Button>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="max-w-md mx-auto flex gap-2 bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-strong">
            <Search className="h-5 w-5 text-muted-foreground mt-3 ml-2" />
            <Input
              placeholder="What are you craving today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground"
            />
            <Button onClick={handleSearch} variant="hero" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Mobile-Responsive Button Layout */}
          <div className="mt-12 animate-scale-in">
            {/* Mobile: Stack vertically with full width */}
            <div className="md:hidden flex flex-col gap-4 max-w-sm mx-auto">
              <Button 
                onClick={() => navigate('/restaurants')} 
                variant="hero" 
                size="lg" 
                className="w-full shadow-glow-orange"
              >
                🍽️ Explore Restaurants
              </Button>
              <Button 
                onClick={() => navigate('/ai-interface')} 
                variant="ai" 
                size="lg"
                className="w-full"
              >
                🤖 AI Voice Chef
              </Button>
              <Button 
                onClick={() => navigate('/nutrition-curator')} 
                variant="nutrition" 
                size="lg"
                className="w-full"
              >
                🧬 Nutrition AI
              </Button>
              <Button 
                onClick={() => navigate('/family-meal-planner')} 
                variant="family" 
                size="lg"
                className="w-full"
              >
                👨‍👩‍👧‍👦 Family Planner
              </Button>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className="hidden md:flex flex-wrap gap-6 justify-center">
              <Button 
                onClick={() => navigate('/restaurants')} 
                variant="hero" 
                size="xl" 
                className="shadow-glow-orange"
              >
                🍽️ Explore Restaurants
              </Button>
              <Button 
                onClick={() => navigate('/ai-interface')} 
                variant="ai" 
                size="xl"
              >
                🤖 AI Voice Chef
              </Button>
              <Button 
                onClick={() => navigate('/nutrition-curator')} 
                variant="nutrition" 
                size="xl"
              >
                🧬 Nutrition AI
              </Button>
              <Button 
                onClick={() => navigate('/family-meal-planner')} 
                variant="family" 
                size="xl"
              >
                👨‍👩‍👧‍👦 Family Planner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cuisines */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Cuisines</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {popularCuisines.map((cuisine) => (
              <Badge 
                key={cuisine}
                variant="outline"
                className="cursor-pointer py-2 px-4 hover:bg-primary hover:text-primary-foreground transition-smooth"
                onClick={() => navigate(`/restaurants?cuisine=${cuisine.toLowerCase()}`)}
              >
                {cuisine}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Restaurants</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {featuredRestaurants.map((restaurant) => (
              <Card 
                key={restaurant.id}
                className="card-elevated cursor-pointer group"
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 transition-transform duration-300 group-hover:animate-food-float group-hover:scale-110">{restaurant.image}</div>
                  <Badge variant={restaurant.is_open ? "secondary" : "destructive"} className="mb-2">
                    {restaurant.is_open ? "Open" : "Closed"}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>
                  <p className="text-muted-foreground mb-2 capitalize">{restaurant.cuisine}</p>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{restaurant.avg_rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{restaurant.delivery_time_min}-{restaurant.delivery_time_max} min</span>
                    </div>
                    {userLocation && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{restaurant.distance || '1.2'}km</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;