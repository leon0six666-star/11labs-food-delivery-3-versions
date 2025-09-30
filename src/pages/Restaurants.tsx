import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import RestaurantFilters from "@/components/RestaurantFilters";
import RestaurantCard from "@/components/RestaurantCard";
import CategoryGrid from "@/components/CategoryGrid";
import { restaurants, categories, calculateDistance, type Restaurant } from "@/data/mockData";

const mockReviews = [
  { id: 1, restaurant_id: "1", user_name: "Sarah M.", rating: 5, comment: "Amazing pizza! Best in the city.", date: "2024-09-20" },
  { id: 2, restaurant_id: "1", user_name: "Mike R.", rating: 4, comment: "Great taste, fast delivery.", date: "2024-09-18" },
  { id: 3, restaurant_id: "3", user_name: "Jenny L.", rating: 5, comment: "Perfect burgers every time!", date: "2024-09-19" },
];

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get user location for distance calculation
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [restaurantsWithDistance, setRestaurantsWithDistance] = useState<Restaurant[]>(restaurants);
  
  // URL-driven state - following ElevenLabs guide
  const [filters, setFilters] = useState(() => {
    const params: { [key: string]: string } = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  });

  const [searchQuery, setSearchQuery] = useState(filters.search || "");

  // Load user location and calculate distances
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      setUserLocation(location);
      
      // Calculate distances for all restaurants
      const restaurantsWithDist = restaurants.map(restaurant => ({
        ...restaurant,
        distance: calculateDistance(location.lat, location.lng, restaurant.latitude, restaurant.longitude)
      }));
      setRestaurantsWithDistance(restaurantsWithDist);
    } else {
      setRestaurantsWithDistance(restaurants);
    }
  }, []);

  // Update filters when URL changes (for AI agent control)
  useEffect(() => {
    const newFilters: { [key: string]: string } = {};
    for (const [key, value] of searchParams.entries()) {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    setSearchQuery(newFilters.search || "");
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = (newFilters: { [key: string]: string | undefined }) => {
    const updatedFilters = { ...filters };
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        updatedFilters[key] = value;
      } else {
        delete updatedFilters[key];
      }
    });

    setFilters(updatedFilters);
    const newParams = new URLSearchParams(updatedFilters);
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    updateFilters({ search: searchQuery });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSearchParams(new URLSearchParams());
  };

  // Filter restaurants based on URL parameters
  const filteredRestaurants = restaurantsWithDistance.filter(restaurant => {
    if (filters.cuisine && restaurant.cuisine !== filters.cuisine.toLowerCase()) return false;
    if (filters.priceRange && restaurant.price_range !== filters.priceRange) return false;
    if (filters.rating && restaurant.avg_rating < parseFloat(filters.rating)) return false;
    if (filters.deliveryTime && restaurant.delivery_time_max > parseInt(filters.deliveryTime)) return false;
    if (filters.isOpen === 'true' && !restaurant.is_open) return false;
    if (filters.maxDistance && restaurant.distance && restaurant.distance > parseFloat(filters.maxDistance)) return false;
    if (filters.dietary) {
      const hasOption = restaurant.menu.some(item => {
        if (filters.dietary === 'vegetarian') return item.isVegetarian;
        if (filters.dietary === 'vegan') return item.isVegan;
        if (filters.dietary === 'gluten-free') return item.isGlutenFree;
        return false;
      });
      if (!hasOption) return false;
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      return restaurant.name.toLowerCase().includes(query) || 
             restaurant.cuisine.toLowerCase().includes(query) ||
             restaurant.description.toLowerCase().includes(query) ||
             restaurant.tags.some(tag => tag.toLowerCase().includes(query)) ||
             restaurant.featured_items.some(item => item.toLowerCase().includes(query)) ||
             restaurant.menu.some(item => item.name.toLowerCase().includes(query) || 
                                         item.description.toLowerCase().includes(query));
    }
    return true;
  });

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (filters.sort) {
      case 'rating':
        return b.avg_rating - a.avg_rating;
      case 'delivery_time':
        return a.delivery_time_min - b.delivery_time_min;
      case 'price':
        const priceOrder = { '$': 1, '$$': 2, '$$$': 3 };
        return priceOrder[a.price_range as keyof typeof priceOrder] - priceOrder[b.price_range as keyof typeof priceOrder];
      case 'distance':
        return a.distance - b.distance;
      default:
        // Default: promoted restaurants first, then by rating
        if (a.promoted && !b.promoted) return -1;
        if (!a.promoted && b.promoted) return 1;
        return b.avg_rating - a.avg_rating;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-soft border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Restaurants</h1>
              <p className="text-muted-foreground">
                {sortedRestaurants.length} restaurants available
              </p>
            </div>
            <Button onClick={() => navigate('/')} variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="default">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Grid */}
          <CategoryGrid 
            categories={categories}
            onCategorySelect={(category) => updateFilters({ cuisine: category })}
            selectedCategory={filters.cuisine}
          />

          {/* Filter Controls */}
          <RestaurantFilters 
            filters={filters}
            onFilterChange={updateFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant}
            />
          ))}
        </div>

        {sortedRestaurants.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;