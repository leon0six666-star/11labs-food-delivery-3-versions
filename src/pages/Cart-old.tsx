import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  Clock, 
  Users, 
  Calendar,
  Store,
  Truck,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart, cartHelpers } from "@/contexts/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, dispatch } = useCart();
  
  const [groupOrderName, setGroupOrderName] = useState("");
  const [groupMembers, setGroupMembers] = useState("");

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const enableGroupOrder = () => {
    if (!groupOrderName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group order.",
        variant: "destructive"
      });
      return;
    }
    
    const members = groupMembers.split(',').map(m => m.trim()).filter(m => m);
    cartHelpers.enableGroupOrder(dispatch, groupOrderName, members);
    
    toast({
      title: "Group order enabled!",
      description: `Created group order "${groupOrderName}" for ${members.length || 1} people.`,
    });
  };

  const scheduleDelivery = (restaurantId: string, time: string) => {
    const [hours, minutes] = time.split(':');
    const scheduledDate = new Date();
    scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // If the time is in the past, schedule for tomorrow
    if (scheduledDate < new Date()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }
    
    cartHelpers.scheduleDelivery(dispatch, restaurantId, scheduledDate);
    
    toast({
      title: "Delivery scheduled!",
      description: `Delivery scheduled for ${formatTime(scheduledDate)}`,
    });
  };

  const handleCheckout = () => {
    if (Object.keys(state.restaurantCarts).length === 0) return;
    
    toast({
      title: "Order placed!",
      description: `${state.groupOrderMode ? 'Group order' : 'Order'} has been successfully placed from ${Object.keys(state.restaurantCarts).length} restaurant(s).`,
      duration: 5000,
    });
    
    cartHelpers.clearAllCarts(dispatch);
    navigate('/');
  };

  if (Object.keys(state.restaurantCarts).length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Button 
            onClick={() => navigate('/restaurants')} 
            variant="ghost" 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Restaurants
          </Button>
          
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some delicious food to your cart to get started
            </p>
            <Button onClick={() => navigate('/restaurants')} variant="gradient" size="lg">
              Browse Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button 
          onClick={() => navigate('/restaurants')} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
        <p className="text-muted-foreground mb-8">
          {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
        </p>

        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <Card key={item.id} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{item.image}</div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      from {item.restaurantName}
                    </p>
                    <p className="font-bold text-primary">${item.price}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <Card className="shadow-medium">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>$3.99</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>$1.99</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(getTotalPrice() + 3.99 + 1.99).toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleCheckout} 
              variant="gradient" 
              size="lg" 
              className="w-full"
            >
              Place Order - ${(getTotalPrice() + 3.99 + 1.99).toFixed(2)}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-3">
              Estimated delivery: 25-35 minutes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;