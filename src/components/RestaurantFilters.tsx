import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface FilterProps {
  filters: { [key: string]: string };
  onFilterChange: (newFilters: { [key: string]: string | undefined }) => void;
  onClearFilters: () => void;
}

const RestaurantFilters = ({ filters, onFilterChange, onClearFilters }: FilterProps) => {
  const cuisineOptions = [
    { value: "italian", label: "Italian" },
    { value: "chinese", label: "Chinese" },
    { value: "american", label: "American" },
    { value: "japanese", label: "Japanese" },
    { value: "indian", label: "Indian" },
    { value: "mexican", label: "Mexican" },
    { value: "mediterranean", label: "Mediterranean" },
    { value: "korean", label: "Korean" },
  ];

  const priceRangeOptions = [
    { value: "$", label: "$ - Budget" },
    { value: "$$", label: "$$ - Moderate" },
    { value: "$$$", label: "$$$ - Premium" },
  ];

  const ratingOptions = [
    { value: "4.0", label: "4.0+ stars" },
    { value: "4.3", label: "4.3+ stars" },
    { value: "4.5", label: "4.5+ stars" },
    { value: "4.7", label: "4.7+ stars" },
  ];

  const deliveryTimeOptions = [
    { value: "15", label: "Under 15 min" },
    { value: "30", label: "Under 30 min" },
    { value: "45", label: "Under 45 min" },
  ];

  const sortOptions = [
    { value: "rating", label: "Rating" },
    { value: "delivery_time", label: "Delivery Time" },
    { value: "price", label: "Price" },
    { value: "distance", label: "Distance" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        
        <Select onValueChange={(value) => onFilterChange({ cuisine: value })} value={filters.cuisine || ""}>
          <SelectTrigger className="w-40 bg-popover">
            <SelectValue placeholder="Cuisine" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-medium z-50">
            {cuisineOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ priceRange: value })} value={filters.priceRange || ""}>
          <SelectTrigger className="w-36 bg-popover">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-medium z-50">
            {priceRangeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ rating: value })} value={filters.rating || ""}>
          <SelectTrigger className="w-36 bg-popover">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-medium z-50">
            {ratingOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ deliveryTime: value })} value={filters.deliveryTime || ""}>
          <SelectTrigger className="w-36 bg-popover">
            <SelectValue placeholder="Delivery" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-medium z-50">
            {deliveryTimeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => onFilterChange({ sort: value })} value={filters.sort || ""}>
          <SelectTrigger className="w-32 bg-popover">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border shadow-medium z-50">
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {Object.keys(filters).length > 0 && (
          <Button onClick={onClearFilters} variant="outline" size="sm">
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (key === 'search') return null; // Don't show search as a badge
            
            const displayValue = (() => {
              switch (key) {
                case 'cuisine':
                  return cuisineOptions.find(opt => opt.value === value)?.label || value;
                case 'priceRange':
                  return priceRangeOptions.find(opt => opt.value === value)?.label || value;
                case 'rating':
                  return ratingOptions.find(opt => opt.value === value)?.label || value;
                case 'deliveryTime':
                  return deliveryTimeOptions.find(opt => opt.value === value)?.label || value;
                case 'sort':
                  return `Sort: ${sortOptions.find(opt => opt.value === value)?.label || value}`;
                default:
                  return value;
              }
            })();

            return (
              <Badge 
                key={key} 
                variant="secondary" 
                className="capitalize cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                onClick={() => onFilterChange({ [key]: undefined })}
              >
                {displayValue}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RestaurantFilters;