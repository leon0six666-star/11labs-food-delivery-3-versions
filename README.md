# eat-speak-easy - AI-Powered Food Delivery 🎙️🍕

An advanced food delivery website with **ElevenLabs voice AI integration** that allows users to order food using natural language voice commands.

## 🚀 Features

- **Voice-Powered Ordering**: Natural language food ordering with ElevenLabs AI
- **10 Restaurants**: Italian, Chinese, American, Japanese, Indian, Mexican, Thai, Korean, Mediterranean, French
- **40+ Menu Items**: Comprehensive menu with prices, descriptions, and dietary tags
- **Smart Filtering**: Filter by cuisine, price range, delivery time, ratings, and dietary needs
- **Real-time Cart Management**: Add items with voice commands and review orders
- **Location Services**: Distance calculations and delivery zones
- **Responsive Design**: Optimized for all devices
- **Error Handling**: Robust error boundaries and user feedback

## 🎯 ElevenLabs Integration

This website is **100% compliant** with the ElevenLabs agnostic guide:

### ✅ Perfect Implementation:
- **URL as Single Source of Truth**: All state managed through URL parameters
- **Central Tool Hub**: App.tsx contains all 6 AI tools for voice control
- **Agent-Friendly Components**: Real-time URL ↔ State synchronization
- **Production-Ready**: TypeScript, error handling, and performance optimization

### 🛠️ Available Voice Tools:
1. **navigate_to_page** - Navigate between sections
2. **browse_restaurants** - Filter restaurants by any criteria
3. **view_restaurant** - Show restaurant details and menus
4. **add_to_cart** - Add items with quantities
5. **view_cart** - Review shopping cart contents
6. **search** - Universal search functionality

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Configure ElevenLabs
1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Add your ElevenLabs Agent ID to `.env`:
   ```env
   VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
   ```

### 3. Set Up ElevenLabs Agent

#### Upload Knowledgebase:
- Copy contents from `elevenlabs-knowledgebase.md`
- Paste into ElevenLabs web interface knowledgebase section

#### Configure System Prompt:
- Copy contents from `elevenlabs-system-prompt.md`
- Paste into ElevenLabs web interface system prompt section

#### Set Up Tools:
- Copy contents from `elevenlabs-tool-definitions.json`
- Add each tool definition in ElevenLabs web interface tools section

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see your AI-powered food delivery website!

## 🗂️ Project Structure

```
food-delivery/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── data/               # Mock data and restaurant information
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── elevenlabs-knowledgebase.md    # Voice agent knowledge base
├── elevenlabs-system-prompt.md    # Voice agent personality
├── elevenlabs-tool-definitions.json # Tool definitions for ElevenLabs
└── memory-bank/            # Development documentation
```

## 🎮 How to Use

### Without Voice (Traditional):
1. Browse restaurants by clicking on categories or using filters
2. Click on restaurants to view menus
3. Add items to cart manually
4. Review cart and proceed to checkout

### With Voice AI (ElevenLabs):
1. Click the voice widget (appears when agent ID is configured)
2. Say things like:
   - "Show me Italian restaurants"
   - "I want something spicy and under $15"
   - "Add two margherita pizzas to my cart"
   - "What's in my cart?"
   - "Find restaurants with fast delivery"

## 📊 Restaurant Data

### Available Restaurants:
1. **Bella Vista Pizza** (Italian) - Wood-fired pizzas, pasta
2. **Dragon Palace** (Chinese) - Dim sum, Szechuan dishes  
3. **Burger Spot** (American) - Gourmet burgers, comfort food
4. **Sakura Sushi** (Japanese) - Fresh sushi, sashimi, ramen
5. **Spice Garden** (Indian) - Authentic curries, vegetarian options
6. **Taco Libre** (Mexican) - Street food, fresh salsas
7. **Thai Orchid** (Thai) - Authentic Thai with fresh herbs
8. **Seoul Kitchen** (Korean) - BBQ, comfort food, kimchi
9. **Mediterranean Breeze** (Mediterranean) - Healthy cuisine
10. **Le Petit Café** (French) - Classic French dishes

### Price Ranges:
- **$** (Budget): $10-15 average
- **$$** (Moderate): $12-20 average  
- **$$$** (Premium): $18-25+ average

### Delivery Times:
- **Fast**: 15-25 minutes (Burger Spot)
- **Standard**: 25-35 minutes (most restaurants)
- **Premium**: 35-45 minutes (sushi, French)

## 🔧 Development

### Available Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting

### Technology Stack:
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State**: URL-driven state management (ElevenLabs compliant)
- **Voice AI**: ElevenLabs Conversational AI

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting platform

3. Ensure your ElevenLabs agent ID is configured in production environment variables

## 🎯 Voice Agent Tips

### Best Practices:
- Speak clearly and naturally
- Mention specific preferences (cuisine, price, dietary needs)
- Confirm items before adding to cart
- Use conversational language ("I want pizza" vs "navigate to pizza")

### Example Voice Commands:
- "Show me cheap and fast options"
- "I'm vegetarian, what do you recommend?"
- "Add a burger and fries to my cart"
- "Find Italian restaurants with good ratings"
- "What's the spiciest food you have?"

## 📞 Support

For issues or questions:
1. Check the error boundary messages (development mode shows detailed errors)
2. Verify ElevenLabs agent ID is correctly configured
3. Ensure all required files are uploaded to ElevenLabs interface

---

**Built with ❤️ and AI** - This project showcases the future of voice-powered e-commerce experiences.