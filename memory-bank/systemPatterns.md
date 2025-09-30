# System Patterns

## Architecture Overview

### Application Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  React Router   │  │  ElevenLabs AI  │                 │
│  │  (Navigation)   │  │  (Voice Agent)  │                 │
│  └─────────────────┘  └─────────────────┘                 │
│           │                      │                         │
│  ┌─────────────────────────────────────────────────────────┤
│  │                App.tsx (Router + AI Hub)                │
│  └─────────────────────────────────────────────────────────┤
│  │ Pages Layer                                             │
│  │  Home → Restaurants → RestaurantDetail → Cart          │
│  └─────────────────────────────────────────────────────────┤
│  │ Components Layer                                        │
│  │  RestaurantCard | CategoryGrid | RestaurantFilters     │
│  └─────────────────────────────────────────────────────────┤
│  │ UI Components (shadcn/ui)                               │
│  │  40+ Radix-based accessible components                 │
│  └─────────────────────────────────────────────────────────┤
│  │ Data Layer                                              │
│  │  mockData.ts (904 lines of comprehensive test data)    │
│  └─────────────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. AI-Driven URL State Management
**Pattern**: URL parameters serve as the single source of truth for application state, enabling AI voice commands to control the interface.

```typescript
// Pattern Implementation
const [filters, setFilters] = useState(() => {
  const params: { [key: string]: string } = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
});

// AI Tool Integration
browse_restaurants: async (filters) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.set(key, value.toString());
    }
  });
  const url = queryParams.toString() ? `/restaurants?${queryParams}` : '/restaurants';
  navigate(url);
  return `Applied restaurant filters: ${JSON.stringify(filters)}`;
}
```

**Benefits**:
- AI can manipulate application state via URL changes
- Browser back/forward works correctly
- State is shareable via URL
- No complex state management needed

### 2. Central AI Tool Hub Pattern
**Pattern**: All AI agent tools are registered in App.tsx as a central control hub.

```typescript
// Six AI Tools Pattern
const AppRoutes = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAgentCall = (event: any) => {
      if (event.detail?.config) {
        event.detail.config.clientTools = {
          navigate_to_page: async ({ page }) => { /* Navigation */ },
          browse_restaurants: async (filters) => { /* Filtering */ },
          view_restaurant: async ({ restaurantId }) => { /* Detail view */ },
          add_to_cart: async ({ restaurantId, itemId, quantity }) => { /* Cart management */ },
          view_cart: async () => { /* Cart display */ },
          search: async ({ query }) => { /* Search functionality */ }
        };
      }
    };
    // Event listener setup
  }, [navigate]);
```

**Benefits**:
- Single point of AI integration
- Consistent tool interface
- Easy to add new AI capabilities
- Clear separation of concerns

### 3. Mock Data as API Pattern
**Pattern**: Comprehensive mock data structure that mirrors real API responses.

```typescript
// Rich Data Structure
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  category_id: number;
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
  schedule: Schedule;
  menu: MenuItem[];
  coverImage?: string;
}
```

**Benefits**:
- Easy transition to real APIs
- Rich development experience
- Comprehensive testing scenarios
- Real-world data complexity

### 4. Component Composition Pattern
**Pattern**: Build complex UI from smaller, reusable components using shadcn/ui as the foundation.

```typescript
// Compound Component Example
<Card className="cursor-pointer hover:shadow-medium transition-smooth">
  <CardContent className="p-6">
    <Badge variant={restaurant.is_open ? "secondary" : "destructive"}>
      {restaurant.is_open ? "Open" : "Closed"}
    </Badge>
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span>{restaurant.avg_rating}</span>
    </div>
  </CardContent>
</Card>
```

**Benefits**:
- Consistent visual design
- Accessible by default (Radix UI)
- Highly customizable via Tailwind
- Reusable across components

### 5. Location-Aware Distance Calculation
**Pattern**: Calculate and display distances from user location to restaurants.

```typescript
// Distance Calculation Pattern
export const calculateDistance = (userLat: number, userLng: number, restaurantLat: number, restaurantLng: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (restaurantLat - userLat) * Math.PI / 180;
  const dLng = (restaurantLng - userLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLat * Math.PI / 180) * Math.cos(restaurantLat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
};

// Usage Pattern
useEffect(() => {
  const savedLocation = localStorage.getItem('userLocation');
  if (savedLocation) {
    const location = JSON.parse(savedLocation);
    const restaurantsWithDist = restaurants.map(restaurant => ({
      ...restaurant,
      distance: calculateDistance(location.lat, location.lng, restaurant.latitude, restaurant.longitude)
    }));
    setRestaurantsWithDistance(restaurantsWithDist);
  }
}, []);
```

## Critical Implementation Paths

### 1. Voice Command → UI State Flow
```
Voice Input → ElevenLabs AI → Tool Function → URL Update → React Router → Component Re-render → UI Update
```

### 2. Restaurant Discovery Flow
```
Home Page → Search/Filter → Restaurants Page → Filter Applied → Results Displayed → Restaurant Selected → Detail Page
```

### 3. Ordering Flow
```
Restaurant Detail → Add to Cart → Cart State Update → Cart Page → Order Summary → Checkout (Mock)
```

### 4. Location Flow
```
User Address → Mock Geocoding → LocalStorage → Distance Calculation → UI Updates
```

## Component Relationships

### Page-Level Components
- **Home**: Entry point, search, featured restaurants
- **Restaurants**: Filtering, browsing, restaurant grid
- **RestaurantDetail**: Menu display, cart management
- **Cart**: Order summary, checkout process
- **NotFound**: Error handling

### Shared Components
- **RestaurantCard**: Used in Home and Restaurants pages
- **CategoryGrid**: Used in Home and Restaurants pages
- **RestaurantFilters**: Used only in Restaurants page

### UI Component Dependencies
```
All Pages → shadcn/ui components → Radix UI primitives → DOM
```

## State Management Patterns

### 1. URL-First State
- Search parameters drive filter state
- Navigation changes trigger state updates
- No global state management needed

### 2. Local Component State
- Cart items (temporary - will move to context later)
- Form inputs and validation
- UI interaction state (modals, dropdowns)

### 3. Persistent State
- User location in localStorage
- User address in localStorage
- No authentication or user accounts yet

### 4. Derived State
- Filtered restaurant lists
- Calculated distances
- Menu categories
- Cart totals

## Error Handling Patterns

### 1. Graceful Degradation
- Missing restaurant data → Show error state
- No user location → Hide distance calculations
- Failed AI commands → Fall back to manual interaction

### 2. User Feedback
- Toast notifications for actions
- Loading states for async operations
- Clear error messages with recovery actions

### 3. Defensive Programming
- Type guards for data access
- Optional chaining for object properties
- Default values for missing data

## Performance Patterns

### 1. React Optimization
- Minimal re-renders with proper key props
- Memoization where beneficial
- Lazy loading prepared for future enhancement

### 2. Bundle Optimization
- Tree-shaking with ES modules
- Code splitting at route level
- Minimal dependency footprint

### 3. User Experience
- Optimistic updates for cart actions
- Instant search with debouncing ready
- Smooth transitions and animations

## ElevenLabs Production Integration (COMPLETED)

### Widget Integration Pattern
```html
<!-- index.html -->
<script src="https://elevenlabs.io/convai-widget/index.js" async></script>
```

```typescript
// App.tsx - Environment-driven widget loading
{import.meta.env.VITE_ELEVENLABS_AGENT_ID && (
  <elevenlabs-convai 
    agent-id={import.meta.env.VITE_ELEVENLABS_AGENT_ID}
  ></elevenlabs-convai>
)}
```

### Environment Configuration Pattern
```bash
# .env
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
VITE_APP_NAME=eat-speak-easy
VITE_APP_DESCRIPTION=AI-Powered Food Delivery
```

### Production Files Created
1. **elevenlabs-knowledgebase.md** - Complete restaurant/menu database
2. **elevenlabs-system-prompt.md** - Voice agent personality and behavior
3. **elevenlabs-tool-definitions.json** - 6 tool definitions for interface
4. **README.md** - Complete setup and deployment guide
5. **ErrorBoundary.tsx** - Production error handling component

### Error Handling Pattern
```typescript
// ErrorBoundary.tsx - Production-grade error handling
class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

## Future Architecture Considerations

### 1. Real API Integration
- TanStack Query already configured
- Mock data structure matches expected API responses
- Error boundaries ready for network failures

### 2. Authentication System
- User context pattern ready for implementation
- Protected routes structure prepared
- Session management patterns identified

### 3. Real-time Features
- WebSocket integration points identified
- Order tracking state management planned
- Live updates architecture outlined