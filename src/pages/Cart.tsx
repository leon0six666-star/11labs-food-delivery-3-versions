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

  const scheduleDelivery = (restaurantId: string, timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // If time is in the past, schedule for tomorrow
    if (scheduledTime < new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    cartHelpers.scheduleDelivery(dispatch, restaurantId, scheduledTime);
    
    toast({
      title: "Delivery Scheduled",
      description: `Your order will be delivered at ${formatTime(scheduledTime)}`,
    });
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

          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some delicious items to get started
            </p>
            <Button onClick={() => navigate('/restaurants')} variant="gradient">
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          onClick={() => navigate('/restaurants')} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <p className="text-muted-foreground">
              {state.totalItems} {state.totalItems === 1 ? 'item' : 'items'} from {Object.keys(state.restaurantCarts).length} restaurant{Object.keys(state.restaurantCarts).length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {state.groupOrderMode && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {state.groupOrderName}
            </Badge>
          )}
        </div>

        {/* Group Order Setup */}
        {!state.groupOrderMode && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Users className="h-5 w-5" />
                Group Order
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-blue-600">
                Ordering for multiple people? Enable group ordering to coordinate deliveries and split costs.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Group order name (e.g., 'Office lunch')"
                  value={groupOrderName}
                  onChange={(e) => setGroupOrderName(e.target.value)}
                />
                <Input
                  placeholder="Members (optional, comma-separated)"
                  value={groupMembers}
                  onChange={(e) => setGroupMembers(e.target.value)}
                />
                <Button onClick={enableGroupOrder} size="sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restaurant Carts */}
        <div className="space-y-6 mb-8">
          {Object.values(state.restaurantCarts).map((cart) => (
            <Card key={cart.restaurantId} className="shadow-soft">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{cart.restaurantName}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    {cart.estimatedDeliveryTime}
                    {cart.scheduledDelivery && (
                      <Badge variant="outline" className="ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(cart.scheduledDelivery)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Scheduled Delivery */}
                {!cart.scheduledDelivery && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <Input
                      type="time"
                      placeholder="Schedule delivery time"
                      className="flex-1"
                      onChange={(e) => e.target.value && scheduleDelivery(cart.restaurantId, e.target.value)}
                    />
                    <span className="text-sm text-orange-600">Optional</span>
                  </div>
                )}

                {/* Cart Items */}
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{item.image || '🍽️'}</div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{item.itemName}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                      {item.specialInstructions && (
                        <p className="text-xs text-blue-600 mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => cartHelpers.updateQuantity(dispatch, item.restaurantId, item.itemId, item.quantity - 1)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium min-w-[2rem] text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() => cartHelpers.updateQuantity(dispatch, item.restaurantId, item.itemId, item.quantity + 1)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => cartHelpers.removeItem(dispatch, item.restaurantId, item.itemId)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Restaurant Cart Summary */}
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal</span>
                    <span>${cart.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Delivery Fee</span>
                    <span>${cart.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Service Fee</span>
                    <span>${cart.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Restaurant Total</span>
                    <span>${(cart.subtotal + cart.deliveryFee + cart.serviceFee).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Final Order Summary */}
        <Card className="shadow-medium border-2 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Final Order Summary
            </h3>
            
            <div className="space-y-2 mb-4">
              {Object.values(state.restaurantCarts).map((cart) => (
                <div key={cart.restaurantId} className="flex justify-between text-sm">
                  <span>{cart.restaurantName}</span>
                  <span>${(cart.subtotal + cart.deliveryFee + cart.serviceFee).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total</span>
                <span>${state.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Multiple delivery warning */}
            {Object.keys(state.restaurantCarts).length > 1 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium">Multiple Restaurant Order</p>
                  <p>Items will be delivered separately as they may have different preparation times.</p>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleCheckout} 
              variant="gradient" 
              size="lg" 
              className="w-full"
            >
              {state.groupOrderMode ? 'Place Group Order' : 'Place Order'} - ${state.grandTotal.toFixed(2)}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-3">
              {Object.keys(state.restaurantCarts).length > 1 
                ? 'Multiple deliveries • Times may vary by restaurant'
                : `Estimated delivery: ${Object.values(state.restaurantCarts)[0]?.estimatedDeliveryTime}`
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cart;