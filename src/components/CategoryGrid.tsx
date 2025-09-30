import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface CategoryGridProps {
  categories: Category[];
  onCategorySelect: (category: string) => void;
  selectedCategory?: string;
}

const CategoryGrid = ({ categories, onCategorySelect, selectedCategory }: CategoryGridProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Browse by Cuisine</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer hover:shadow-medium transition-smooth hover:scale-105 ${
              selectedCategory === category.name.toLowerCase() 
                ? 'ring-2 ring-primary bg-primary/5' 
                : ''
            }`}
            onClick={() => onCategorySelect(category.name.toLowerCase())}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">{category.icon}</div>
              <h3 className="font-medium text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;