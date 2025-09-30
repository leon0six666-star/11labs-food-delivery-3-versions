import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  X, 
  Heart, 
  Wheat, 
  Milk, 
  Nut,
  Fish,
  Beef,
  Leaf,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export interface DietaryFilters {
  // Main dietary categories
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  
  // Allergens to avoid
  avoidNuts?: boolean;
  avoidSoy?: boolean;
  avoidEggs?: boolean;
  avoidShellfish?: boolean;
  avoidFish?: boolean;
  
  // Lifestyle diets
  keto?: boolean;
  paleo?: boolean;
  lowCarb?: boolean;
  lowSodium?: boolean;
  
  // Religious/Cultural
  halal?: boolean;
  kosher?: boolean;
  
  // Special needs
  easyChew?: boolean; // For seniors or dental issues
  lowSugar?: boolean; // For diabetics
  highProtein?: boolean;
  antiInflammatory?: boolean;
  pregnancySafe?: boolean;
}

interface AdvancedDietaryFilterProps {
  filters: DietaryFilters;
  onFiltersChange: (filters: DietaryFilters) => void;
  onClose?: () => void;
}

const AdvancedDietaryFilter = ({ filters, onFiltersChange, onClose }: AdvancedDietaryFilterProps) => {
  const [localFilters, setLocalFilters] = useState<DietaryFilters>(filters);

  const handleFilterChange = (key: keyof DietaryFilters, value: boolean) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose?.();
  };

  const clearAllFilters = () => {
    const emptyFilters: DietaryFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(localFilters).filter(Boolean).length;
  };

  // Quick filter presets for common combinations
  const quickPresets = [
    {
      name: "Vegan + Gluten-Free",
      icon: Leaf,
      color: "green",
      filters: { vegan: true, glutenFree: true, dairyFree: true }
    },
    {
      name: "Keto + Dairy-Free",
      icon: Beef,
      color: "purple", 
      filters: { keto: true, dairyFree: true, lowCarb: true }
    },
    {
      name: "Nut-Free + Soy-Free",
      icon: ShieldCheck,
      color: "orange",
      filters: { avoidNuts: true, avoidSoy: true }
    },
    {
      name: "Senior-Friendly",
      icon: Heart,
      color: "blue",
      filters: { easyChew: true, lowSodium: true, lowSugar: true }
    },
    {
      name: "Pregnancy Safe",
      icon: Heart,
      color: "pink",
      filters: { pregnancySafe: true, lowSodium: true, avoidFish: true }
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Dietary Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary">{getActiveFilterCount()} active</Badge>
          )}
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Presets */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Quick Presets
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickPresets.map((preset) => {
              const IconComponent = preset.icon;
              return (
                <Button
                  key={preset.name}
                  variant="outline"
                  className={`justify-start h-auto p-3 hover:bg-${preset.color}-50 hover:border-${preset.color}-300`}
                  onClick={() => {
                    setLocalFilters({ ...localFilters, ...preset.filters });
                  }}
                >
                  <IconComponent className={`h-4 w-4 mr-2 text-${preset.color}-500`} />
                  <div className="text-left">
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-gray-500">
                      {Object.keys(preset.filters).length} filters
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Main Dietary Categories */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Leaf className="h-4 w-4 text-green-500" />
            Dietary Preferences
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'vegetarian', label: 'Vegetarian', icon: Leaf, color: 'green' },
              { key: 'vegan', label: 'Vegan', icon: Leaf, color: 'green' },
              { key: 'glutenFree', label: 'Gluten-Free', icon: Wheat, color: 'orange' },
              { key: 'dairyFree', label: 'Dairy-Free', icon: Milk, color: 'blue' },
              { key: 'lowCarb', label: 'Low Carb', icon: Beef, color: 'purple' },
              { key: 'keto', label: 'Keto', icon: Beef, color: 'purple' },
              { key: 'paleo', label: 'Paleo', icon: Beef, color: 'brown' },
              { key: 'lowSodium', label: 'Low Sodium', icon: Heart, color: 'red' }
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={localFilters[key as keyof DietaryFilters] || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange(key as keyof DietaryFilters, checked as boolean)
                  }
                />
                <label htmlFor={key} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Icon className={`h-4 w-4 text-${color}-500`} />
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Allergen Avoidance */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Allergen Avoidance
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'avoidNuts', label: 'Avoid Nuts', icon: Nut, color: 'red' },
              { key: 'avoidSoy', label: 'Avoid Soy', icon: Leaf, color: 'red' },
              { key: 'avoidEggs', label: 'Avoid Eggs', icon: Beef, color: 'red' },
              { key: 'avoidShellfish', label: 'Avoid Shellfish', icon: Fish, color: 'red' },
              { key: 'avoidFish', label: 'Avoid Fish', icon: Fish, color: 'red' }
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={localFilters[key as keyof DietaryFilters] || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange(key as keyof DietaryFilters, checked as boolean)
                  }
                />
                <label htmlFor={key} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Icon className={`h-4 w-4 text-${color}-500`} />
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Religious/Cultural */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            Religious & Cultural
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'halal', label: 'Halal', icon: ShieldCheck, color: 'green' },
              { key: 'kosher', label: 'Kosher', icon: ShieldCheck, color: 'blue' }
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={localFilters[key as keyof DietaryFilters] || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange(key as keyof DietaryFilters, checked as boolean)
                  }
                />
                <label htmlFor={key} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Icon className={`h-4 w-4 text-${color}-500`} />
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Special Health Needs */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            Special Health Needs
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'easyChew', label: 'Easy to Chew (Seniors)', icon: Heart, color: 'blue' },
              { key: 'lowSugar', label: 'Low Sugar (Diabetic)', icon: Heart, color: 'red' },
              { key: 'highProtein', label: 'High Protein (Fitness)', icon: Beef, color: 'purple' },
              { key: 'antiInflammatory', label: 'Anti-Inflammatory', icon: Heart, color: 'green' },
              { key: 'pregnancySafe', label: 'Pregnancy Safe', icon: Heart, color: 'pink' }
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={localFilters[key as keyof DietaryFilters] || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange(key as keyof DietaryFilters, checked as boolean)
                  }
                />
                <label htmlFor={key} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Icon className={`h-4 w-4 text-${color}-500`} />
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters ({getActiveFilterCount()})
          </Button>
          <Button variant="outline" onClick={clearAllFilters}>
            Clear All
          </Button>
        </div>

        {/* Active Filters Summary */}
        {getActiveFilterCount() > 0 && (
          <div className="pt-4 border-t">
            <h5 className="text-sm font-medium mb-2">Active Filters:</h5>
            <div className="flex flex-wrap gap-1">
              {Object.entries(localFilters).map(([key, value]) => 
                value && (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange(key as keyof DietaryFilters, false)}
                    />
                  </Badge>
                )
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to check if a menu item matches dietary filters
export const matchesDietaryFilters = (item: any, filters: DietaryFilters): boolean => {
  // Check main dietary preferences
  if (filters.vegetarian && !item.isVegetarian) return false;
  if (filters.vegan && !item.isVegan) return false;
  if (filters.glutenFree && !item.isGlutenFree) return false;
  if (filters.dairyFree && !item.isDairyFree) return false;
  
  // Check allergen avoidance
  if (filters.avoidNuts && item.allergens?.includes('nuts')) return false;
  if (filters.avoidSoy && item.allergens?.includes('soy')) return false;
  if (filters.avoidEggs && item.allergens?.includes('eggs')) return false;
  if (filters.avoidShellfish && item.allergens?.includes('shellfish')) return false;
  if (filters.avoidFish && item.allergens?.includes('fish')) return false;
  
  // Check lifestyle diets
  if (filters.keto && !item.isKeto) return false;
  if (filters.paleo && !item.isPaleo) return false;
  if (filters.lowCarb && !item.isLowCarb) return false;
  if (filters.lowSodium && !item.isLowSodium) return false;
  
  // Check religious/cultural
  if (filters.halal && !item.isHalal) return false;
  if (filters.kosher && !item.isKosher) return false;
  
  // Check special health needs
  if (filters.easyChew && !item.isEasyChew) return false;
  if (filters.pregnancySafe && !item.healthProfile?.isPregnancySafe) return false;
  if (filters.antiInflammatory && !item.healthProfile?.isAntiInflammatory) return false;
  
  // Check nutrition-based filters
  if (filters.lowSugar && item.nutrition?.sugar > 10) return false;
  if (filters.highProtein && item.nutrition?.protein < 20) return false;
  
  return true;
};

export default AdvancedDietaryFilter;