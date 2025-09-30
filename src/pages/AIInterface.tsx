import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Mic, 
  MicOff,
  Cpu,
  Activity,
  Zap,
  Target,
  ChefHat,
  Dumbbell,
  Baby,
  Heart,
  Scale,
  Sparkles,
  Volume2,
  VolumeX
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  nutritionData?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    micronutrients?: Record<string, number>;
  };
  foodItems?: Array<{
    name: string;
    restaurant: string;
    price: number;
    image?: string;
  }>;
}

interface AIProcess {
  id: string;
  name: string;
  status: 'idle' | 'processing' | 'complete';
  progress: number;
  icon: any;
  color: string;
}

const AIInterface = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [aiProcesses, setAIProcesses] = useState<AIProcess[]>([]);
  const [currentNutritionGoal, setCurrentNutritionGoal] = useState<string | null>(null);
  const [aiThinking, setAIThinking] = useState(false);

  // Initialize AI processes
  useEffect(() => {
    setAIProcesses([
      {
        id: 'voice-recognition',
        name: 'Voice Recognition',
        status: 'idle',
        progress: 0,
        icon: Mic,
        color: 'blue'
      },
      {
        id: 'nutrition-analysis',
        name: 'Nutrition Analysis',
        status: 'idle',
        progress: 0,
        icon: Brain,
        color: 'purple'
      },
      {
        id: 'meal-curation',
        name: 'Meal Curation',
        status: 'idle',
        progress: 0,
        icon: ChefHat,
        color: 'green'
      },
      {
        id: 'restaurant-matching',
        name: 'Restaurant Matching',
        status: 'idle',
        progress: 0,
        icon: Target,
        color: 'orange'
      }
    ]);

    // Add welcome message
    addMessage({
      type: 'ai',
      content: "Welcome to the AI Nutrition Interface. I'm your personal AI chef and nutritionist. Tell me your goals, and I'll create the perfect meal plan for you.",
    });
  }, []);

  // Parse URL parameters for AI demos
  useEffect(() => {
    const demo = searchParams.get('demo');
    const goal = searchParams.get('goal');
    
    if (demo) {
      runAIDemo(demo);
    } else if (goal) {
      setCurrentNutritionGoal(goal);
      processNutritionGoal(goal);
    }
  }, [searchParams]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message: Omit<AIMessage, 'id' | 'timestamp'>) => {
    const newMessage: AIMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const updateProcess = (processId: string, updates: Partial<AIProcess>) => {
    setAIProcesses(prev => prev.map(process => 
      process.id === processId ? { ...process, ...updates } : process
    ));
  };

  const runAIDemo = async (demoType: string) => {
    setAIThinking(true);
    
    switch (demoType) {
      case 'bulking':
        await demonstrateBulkingScenario();
        break;
      case 'pregnancy':
        await demonstratePregnancyScenario();
        break;
      case 'diabetic':
        await demonstrateDiabeticScenario();
        break;
      default:
        await demonstrateGeneralAI();
    }
    
    setAIThinking(false);
  };

  const demonstrateBulkingScenario = async () => {
    // Simulate user voice input
    addMessage({
      type: 'user',
      content: "I'm bulking, need a meal with 3000 calories and high protein"
    });

    // Simulate AI processing
    updateProcess('voice-recognition', { status: 'processing', progress: 100 });
    await delay(800);
    updateProcess('voice-recognition', { status: 'complete' });

    updateProcess('nutrition-analysis', { status: 'processing', progress: 0 });
    for (let i = 0; i <= 100; i += 10) {
      updateProcess('nutrition-analysis', { progress: i });
      await delay(150);
    }
    updateProcess('nutrition-analysis', { status: 'complete' });

    // AI analyzing response
    addMessage({
      type: 'system',
      content: "🧬 AI analyzing bulking requirements: 3000+ calories, 150g+ protein, complex carbs..."
    });

    updateProcess('meal-curation', { status: 'processing', progress: 0 });
    for (let i = 0; i <= 100; i += 15) {
      updateProcess('meal-curation', { progress: i });
      await delay(200);
    }
    updateProcess('meal-curation', { status: 'complete' });

    updateProcess('restaurant-matching', { status: 'processing', progress: 0 });
    for (let i = 0; i <= 100; i += 20) {
      updateProcess('restaurant-matching', { progress: i });
      await delay(150);
    }
    updateProcess('restaurant-matching', { status: 'complete' });

    // AI response with nutrition data
    addMessage({
      type: 'ai',
      content: "Perfect! I've created your bulking meal plan with 3,250 calories and 165g protein. This combination will support optimal muscle growth.",
      nutritionData: {
        calories: 3250,
        protein: 165,
        carbs: 285,
        fat: 95
      },
      foodItems: [
        { name: "Bulgogi with Extra Rice", restaurant: "Seoul Kitchen", price: 18.99 },
        { name: "Double Bacon Burger", restaurant: "Burger Spot", price: 16.99 },
        { name: "Protein Smoothie Bowl", restaurant: "Nutrition Bar", price: 12.99 }
      ]
    });
  };

  const demonstratePregnancyScenario = async () => {
    addMessage({
      type: 'user',
      content: "I'm 6 months pregnant and craving something sweet but need folate and iron"
    });

    updateProcess('voice-recognition', { status: 'processing', progress: 100 });
    await delay(600);
    updateProcess('voice-recognition', { status: 'complete' });

    addMessage({
      type: 'system',
      content: "🤰 AI analyzing pregnancy nutrition: Folate for neural development, iron for blood health, pregnancy-safe ingredients only..."
    });

    updateProcess('nutrition-analysis', { status: 'processing', progress: 0 });
    for (let i = 0; i <= 100; i += 12) {
      updateProcess('nutrition-analysis', { progress: i });
      await delay(180);
    }
    updateProcess('nutrition-analysis', { status: 'complete' });

    updateProcess('meal-curation', { status: 'processing', progress: 0 });
    for (let i = 0; i <= 100; i += 15) {
      updateProcess('meal-curation', { progress: i });
      await delay(220);
    }
    updateProcess('meal-curation', { status: 'complete' });

    addMessage({
      type: 'ai',
      content: "I've found the perfect pregnancy-safe sweet treat! Fortified berry smoothie bowl with spinach (hidden taste) provides 180mcg folate and 4.2mg iron while satisfying your sweet cravings.",
      nutritionData: {
        calories: 420,
        protein: 18,
        carbs: 65,
        fat: 8,
        micronutrients: {
          folate: 180,
          iron: 4.2,
          calcium: 320
        }
      },
      foodItems: [
        { name: "Berry Smoothie Bowl with Spinach", restaurant: "Healthy Corner", price: 9.99 },
        { name: "Fortified Orange Juice", restaurant: "Fresh Bar", price: 4.99 }
      ]
    });
  };

  const demonstrateDiabeticScenario = async () => {
    addMessage({
      type: 'user',
      content: "I'm diabetic, my blood sugar is high. I need something filling under 20g carbs"
    });

    updateProcess('voice-recognition', { status: 'processing', progress: 100 });
    await delay(700);
    updateProcess('voice-recognition', { status: 'complete' });

    addMessage({
      type: 'system',
      content: "❤️ AI analyzing diabetic requirements: <20g carbs, high fiber, low glycemic index, blood sugar stabilization..."
    });

    updateProcess('nutrition-analysis', { status: 'processing', progress: 0 });
    for (let i = 0; i <= 100; i += 8) {
      updateProcess('nutrition-analysis', { progress: i });
      await delay(120);
    }
    updateProcess('nutrition-analysis', { status: 'complete' });

    updateProcess('meal-curation', { status: 'processing', progress: 0 });
    for (let i = 0; i <= 100; i += 10) {
      updateProcess('meal-curation', { progress: i });
      await delay(180);
    }
    updateProcess('meal-curation', { status: 'complete' });

    addMessage({
      type: 'ai',
      content: "Excellent choice for blood sugar management! Greek salad with grilled chicken - only 18g carbs, but 12g fiber offsets absorption. High protein helps stabilize glucose levels.",
      nutritionData: {
        calories: 580,
        protein: 52,
        carbs: 18,
        fat: 28,
        micronutrients: {
          fiber: 12,
          sodium: 890
        }
      },
      foodItems: [
        { name: "Large Greek Salad", restaurant: "Mediterranean Breeze", price: 11.99 },
        { name: "Grilled Chicken Breast", restaurant: "Healthy Grill", price: 8.99 }
      ]
    });
  };

  const demonstrateGeneralAI = async () => {
    addMessage({
      type: 'user',
      content: "I don't know what I want to eat"
    });

    updateProcess('voice-recognition', { status: 'processing', progress: 100 });
    await delay(500);
    updateProcess('voice-recognition', { status: 'complete' });

    addMessage({
      type: 'system',
      content: "🎭 AI activating mood analysis and preference learning..."
    });

    updateProcess('meal-curation', { status: 'processing', progress: 0 });
    for (let i = 0; i <= 100; i += 20) {
      updateProcess('meal-curation', { progress: i });
      await delay(300);
    }
    updateProcess('meal-curation', { status: 'complete' });

    addMessage({
      type: 'ai',
      content: "No worries! Based on the time of day and popular choices, I recommend a comforting Italian meal. How about Bella Vista Pizza's Margherita with a side salad?",
      foodItems: [
        { name: "Margherita Pizza", restaurant: "Bella Vista Pizza", price: 18.99 },
        { name: "Insalata Caprese", restaurant: "Bella Vista Pizza", price: 12.99 }
      ]
    });
  };

  const processNutritionGoal = async (goal: string) => {
    setAIThinking(true);
    
    addMessage({
      type: 'system',
      content: `🧬 Processing ${goal} nutrition optimization...`
    });

    // Simulate processing
    await delay(2000);
    
    setAIThinking(false);
    navigate(`/nutrition-curator?goal=${goal}&autoBuild=true`);
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      updateProcess('voice-recognition', { status: 'processing', progress: 50 });
    } else {
      updateProcess('voice-recognition', { status: 'idle', progress: 0 });
    }
  };

  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'text-blue-500';
      case 'complete': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/40 to-slate-900"></div>
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 bg-blue-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <Brain className="h-12 w-12 text-blue-400" />
              {aiThinking && (
                <div className="absolute inset-0 h-12 w-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI NUTRITION INTERFACE
            </h1>
            <Cpu className="h-12 w-12 text-purple-400 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300">
            Advanced AI-powered nutrition optimization and meal curation system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Processes Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  AI Systems Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiProcesses.map((process) => {
                  const IconComponent = process.icon;
                  return (
                    <div key={process.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-4 w-4 ${getProcessStatusColor(process.status)}`} />
                          <span className="text-sm text-gray-300">{process.name}</span>
                        </div>
                        <Badge 
                          variant={process.status === 'complete' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            process.status === 'processing' ? 'bg-blue-500' : 
                            process.status === 'complete' ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          {process.status}
                        </Badge>
                      </div>
                      <Progress value={process.progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Voice Controls */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-blue-400" />
                  Voice Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <Button
                    onClick={toggleListening}
                    className={`h-16 w-16 rounded-full ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                </div>
                <p className="text-center text-sm text-gray-400">
                  {isListening ? 'Listening... Speak now' : 'Click to start voice input'}
                </p>
              </CardContent>
            </Card>

            {/* Quick Nutrition Goals */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-400" />
                  Quick Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { goal: 'bulking', icon: Dumbbell, label: 'Bulking', color: 'purple' },
                  { goal: 'pregnancy', icon: Baby, label: 'Pregnancy', color: 'pink' },
                  { goal: 'diabetic', icon: Heart, label: 'Diabetic', color: 'red' },
                  { goal: 'cutting', icon: Scale, label: 'Weight Loss', color: 'green' }
                ].map(({ goal, icon: Icon, label, color }) => (
                  <Button
                    key={goal}
                    variant="outline"
                    className="w-full justify-start border-slate-600 hover:bg-slate-700"
                    onClick={() => navigate(`/ai-interface?demo=${goal}`)}
                  >
                    <Icon className={`h-4 w-4 mr-2 text-${color}-400`} />
                    {label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  AI Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.type === 'system'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-gray-100'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Nutrition Data Display */}
                        {message.nutritionData && (
                          <div className="mt-3 p-2 bg-slate-600 rounded text-xs">
                            <div className="grid grid-cols-2 gap-2">
                              <div>Calories: {message.nutritionData.calories}</div>
                              <div>Protein: {message.nutritionData.protein}g</div>
                              <div>Carbs: {message.nutritionData.carbs}g</div>
                              <div>Fat: {message.nutritionData.fat}g</div>
                            </div>
                            {message.nutritionData.micronutrients && (
                              <div className="mt-2 pt-2 border-t border-slate-500">
                                {Object.entries(message.nutritionData.micronutrients).map(([key, value]) => (
                                  <Badge key={key} className="mr-1 mb-1 text-xs">
                                    {key}: {value}{key === 'folate' ? 'mcg' : 'mg'}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Food Items Display */}
                        {message.foodItems && (
                          <div className="mt-3 space-y-2">
                            {message.foodItems.map((item, index) => (
                              <div key={index} className="p-2 bg-slate-600 rounded text-xs">
                                <div className="font-semibold">{item.name}</div>
                                <div className="text-gray-300">{item.restaurant} - ${item.price}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleListening}
                    variant={isListening ? "destructive" : "default"}
                    size="sm"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1 p-2 bg-slate-700 rounded text-gray-400 text-sm">
                    {isListening 
                      ? "🎤 Listening... (Voice input active)" 
                      : "Click microphone or say: 'I'm bulking', 'I'm pregnant', 'I'm diabetic'..."
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={() => navigate('/meal-curator')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <ChefHat className="h-4 w-4 mr-2" />
            Mood-Based Curator
          </Button>
          <Button 
            onClick={() => navigate('/nutrition-curator')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Brain className="h-4 w-4 mr-2" />
            Nutrition AI
          </Button>
          <Button 
            onClick={() => navigate('/food-search')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Target className="h-4 w-4 mr-2" />
            Food Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIInterface;