# Tech Context

## Technology Stack

### Core Technologies
- **React 18.3.1**: Latest React with concurrent features for optimal performance
- **TypeScript 5.8.3**: Full type safety across the application
- **Vite 5.4.19**: Ultra-fast build tool and dev server with HMR
- **Node.js**: Runtime environment (package manager: npm + bun lockfile)

### UI Framework & Styling
- **shadcn/ui**: High-quality, accessible component library built on Radix UI
- **TailwindCSS 3.4.17**: Utility-first CSS framework with custom design system
- **Radix UI Primitives**: 30+ accessible, unstyled UI components
- **Lucide React**: Beautiful, customizable SVG icons
- **TailwindCSS Animate**: Smooth animations and transitions

### Routing & State Management
- **React Router DOM 6.30.1**: Client-side routing with nested routes
- **TanStack Query 5.83.0**: Server state management and caching
- **React Hook Form 7.61.1**: Performant forms with minimal re-renders
- **Zod 3.25.76**: TypeScript-first schema validation

### AI Integration
- **ElevenLabs Conversational AI**: Voice-powered navigation and ordering
- **Custom Tool Integration**: Six AI agent tools for complete voice control
- **URL-Based State Management**: Enables AI to control application state via URL parameters

### Development Tools
- **ESLint 9.32.0**: Code linting with React-specific rules
- **TypeScript ESLint**: Enhanced linting for TypeScript code
- **Lovable Tagger**: Component tagging for rapid development platform
- **PostCSS**: CSS post-processing with Autoprefixer

## Development Setup

### Prerequisites
```bash
# Node.js (LTS version recommended)
node --version  # v18+ required

# Package manager
npm --version   # npm for dependency management
bun --version   # bun lockfile present for faster installs
```

### Installation & Setup
```bash
# Clone repository
git clone <repo-url>
cd food-delivery

# Install dependencies (npm/bun compatible)
npm install

# Start development server
npm run dev
# Runs on http://localhost:8080 (custom port via Vite config)

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Configuration
- **Vite Config**: Custom host ("::" for all interfaces) and port (8080)
- **Path Aliases**: `@/` maps to `./src/` for cleaner imports
- **TypeScript Configs**: Separate configs for app and Node.js code
- **Development Mode**: Lovable component tagger enabled in dev only

## Architecture Decisions

### File Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components (40+ components)
│   ├── CategoryGrid.tsx
│   ├── RestaurantCard.tsx
│   └── RestaurantFilters.tsx
├── pages/               # Route-level components
│   ├── Home.tsx
│   ├── Restaurants.tsx
│   ├── RestaurantDetail.tsx
│   ├── Cart.tsx
│   └── NotFound.tsx
├── data/               # Mock data and types
│   └── mockData.ts     # Comprehensive restaurant/menu data
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utility functions
│   └── utils.ts        # cn() utility for className merging
├── assets/             # Static assets
│   └── hero-food.jpg
├── App.tsx             # Main app with routing and AI integration
├── main.tsx            # React entry point
└── index.css           # Global styles with CSS variables
```

### Type System
- **Strict TypeScript**: All components and functions fully typed
- **Interface Definitions**: Restaurant, MenuItem, Category, Address types
- **Zod Schemas**: Runtime validation for forms and external data
- **Type Safety**: No `any` types, comprehensive error handling

### State Management Strategy
- **URL-First State**: Search params drive filter state for AI integration
- **Local State**: React useState for component-specific state
- **React Query**: Caching and server state (prepared for future API integration)
- **LocalStorage**: User location and preferences persistence

## Technical Constraints

### Platform Constraints
- **Lovable Platform**: Built for rapid prototyping with specific conventions
- **Static Deployment**: No backend server, mock data only
- **Browser Compatibility**: Modern browsers with ES6+ support
- **Mobile Responsive**: Must work on all device sizes

### Performance Requirements
- **Fast Startup**: Vite ensures sub-second dev server start
- **Small Bundle**: Tree-shaking and code splitting optimization
- **Minimal Re-renders**: Optimized component updates
- **Smooth Animations**: 60fps animations via CSS transitions

### Security Considerations
- **No Sensitive Data**: All data is mock/public
- **XSS Protection**: TypeScript and proper data sanitization
- **Safe External Integrations**: ElevenLabs integration via secure APIs
- **CSP Ready**: Compatible with Content Security Policy

## Integration Patterns

### ElevenLabs AI Integration
```typescript
// AI Tool Registration Pattern
const handleAgentCall = (event: any) => {
  if (event.detail?.config) {
    event.detail.config.clientTools = {
      navigate_to_page: async ({ page }) => { /* ... */ },
      browse_restaurants: async (filters) => { /* ... */ },
      view_restaurant: async ({ restaurantId }) => { /* ... */ },
      add_to_cart: async ({ restaurantId, itemId, quantity }) => { /* ... */ },
      view_cart: async () => { /* ... */ },
      search: async ({ query }) => { /* ... */ }
    };
  }
};
```

### URL State Management
```typescript
// URL-driven filtering for AI control
const [filters, setFilters] = useState(() => {
  const params = {};
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params;
});
```

### Component Architecture
- **Compound Components**: Complex UI built from smaller, reusable pieces
- **Props Interface**: Clear, typed interfaces for all component props
- **Event Handling**: Consistent event patterns across components
- **Error Boundaries**: Graceful error handling and fallbacks

## Future Technical Considerations

### Scalability Preparation
- **API Integration Ready**: Mock data designed to mirror real API responses
- **State Management**: TanStack Query prepared for server state
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Testing Framework**: Structure supports easy test addition

### Enhancement Opportunities
- **PWA Support**: Service workers for offline functionality
- **Real-time Updates**: WebSocket integration for order tracking
- **Advanced Caching**: Sophisticated caching strategies
- **Performance Monitoring**: Analytics and performance tracking