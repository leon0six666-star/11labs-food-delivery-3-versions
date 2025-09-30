import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  cuisine: string;
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
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const navigate = useNavigate();

  const formatDeliveryTime = (min: number, max: number) => `${min}-${max} min`;

  return (
    <Card
      className="card-luxury cursor-pointer group relative overflow-hidden"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      {restaurant.promoted && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-accent text-accent-foreground shadow-medium">
            Featured
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl group-hover:animate-food-float group-hover:scale-110 transition-all duration-300">{restaurant.image}</div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className="font-medium">{restaurant.price_range}</Badge>
            {!restaurant.is_open && (
              <Badge variant="destructive" className="text-xs">Closed</Badge>
            )}
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-smooth">{restaurant.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{restaurant.description}</p>
        
        {/* Featured Items */}
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-1">Popular:</p>
          <p className="text-sm font-medium line-clamp-1">
            {restaurant.featured_items.slice(0, 2).join(", ")}
          </p>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{restaurant.avg_rating}</span>
            <span className="text-muted-foreground">({restaurant.total_reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatDeliveryTime(restaurant.delivery_time_min, restaurant.delivery_time_max)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{restaurant.distance || 1.2}km away</span>
          </div>
          <span>Delivery: ${restaurant.delivery_fee}</span>
          <span>Min: ${restaurant.min_order}</span>
        </div>
        
        <Badge variant="secondary" className="capitalize font-medium">
          {restaurant.cuisine}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;