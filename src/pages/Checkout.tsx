import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CreditCard, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Mail, 
  ArrowLeft,
  Shield,
  Truck,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantName: string;
  restaurantId: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get cart items from location state or localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(
    location.state?.cartItems || JSON.parse(localStorage.getItem('cartItems') || '[]')
  );

  // Form states
  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryInstructions: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingZip: ''
  });

  const [orderOptions, setOrderOptions] = useState({
    deliveryMethod: 'delivery', // 'delivery' or 'pickup'
    paymentMethod: 'card', // 'card' or 'cash'
    deliveryTime: 'asap', // 'asap' or 'scheduled'
    scheduledTime: '',
    tip: '18', // percentage
    saveInfo: false
  });

  const [processing, setProcessing] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderOptions.deliveryMethod === 'delivery' ? 3.99 : 0;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const tipAmount = subtotal * (parseInt(orderOptions.tip) / 100);
  const tax = (subtotal + serviceFee) * 0.08; // 8% tax
  const total = subtotal + deliveryFee + serviceFee + tipAmount + tax;

  useEffect(() => {
    // Redirect if no items in cart
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checking out.",
        variant: "destructive"
      });
      navigate('/cart');
    }
  }, [cartItems, navigate, toast]);

  const handleInputChange = (section: 'delivery' | 'payment', field: string, value: string) => {
    if (section === 'delivery') {
      setDeliveryInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const requiredDeliveryFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const requiredPaymentFields = orderOptions.paymentMethod === 'card' 
      ? ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard', 'billingZip']
      : [];

    for (const field of requiredDeliveryFields) {
      if (!deliveryInfo[field as keyof typeof deliveryInfo]) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          variant: "destructive"
        });
        return false;
      }
    }

    for (const field of requiredPaymentFields) {
      if (!paymentInfo[field as keyof typeof paymentInfo]) {
        toast({
          title: "Missing Payment Information",
          description: `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const processOrder = async () => {
    if (!validateForm()) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Clear cart
      localStorage.removeItem('cartItems');
      
      // Show success and redirect
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${Date.now()} has been confirmed. You'll receive updates via email.`,
      });

      navigate('/order-confirmation', {
        state: {
          orderNumber: Date.now(),
          items: cartItems,
          total: total,
          deliveryInfo: deliveryInfo,
          estimatedTime: orderOptions.deliveryTime === 'asap' ? '25-35 minutes' : orderOptions.scheduledTime
        }
      });

    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={() => navigate('/cart')} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your order in just a few steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={orderOptions.deliveryMethod}
                  onValueChange={(value) => setOrderOptions(prev => ({ ...prev, deliveryMethod: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Delivery</p>
                          <p className="text-sm text-gray-600">Get it delivered to your door</p>
                        </div>
                        <span className="text-green-600 font-medium">$3.99</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Pickup</p>
                          <p className="text-sm text-gray-600">Pick up from restaurant</p>
                        </div>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {orderOptions.deliveryMethod === 'delivery' ? 'Delivery' : 'Contact'} Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={deliveryInfo.firstName}
                      onChange={(e) => handleInputChange('delivery', 'firstName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={deliveryInfo.lastName}
                      onChange={(e) => handleInputChange('delivery', 'lastName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={deliveryInfo.email}
                    onChange={(e) => handleInputChange('delivery', 'email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={deliveryInfo.phone}
                    onChange={(e) => handleInputChange('delivery', 'phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                {orderOptions.deliveryMethod === 'delivery' && (
                  <>
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={deliveryInfo.address}
                        onChange={(e) => handleInputChange('delivery', 'address', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <Label htmlFor="apartment">Apartment, Suite, etc.</Label>
                      <Input
                        id="apartment"
                        value={deliveryInfo.apartment}
                        onChange={(e) => handleInputChange('delivery', 'apartment', e.target.value)}
                        placeholder="Apt 4B (optional)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={deliveryInfo.city}
                          onChange={(e) => handleInputChange('delivery', 'city', e.target.value)}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select value={deliveryInfo.state} onValueChange={(value) => handleInputChange('delivery', 'state', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="State" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            {/* Add more states as needed */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          value={deliveryInfo.zipCode}
                          onChange={(e) => handleInputChange('delivery', 'zipCode', e.target.value)}
                          placeholder="10001"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                      <Input
                        id="deliveryInstructions"
                        value={deliveryInfo.deliveryInstructions}
                        onChange={(e) => handleInputChange('delivery', 'deliveryInstructions', e.target.value)}
                        placeholder="Ring doorbell, leave at door, etc."
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Delivery Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Delivery Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={orderOptions.deliveryTime}
                  onValueChange={(value) => setOrderOptions(prev => ({ ...prev, deliveryTime: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asap" id="asap" />
                    <Label htmlFor="asap">As soon as possible (25-35 minutes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled">Schedule for later</Label>
                  </div>
                </RadioGroup>
                
                {orderOptions.deliveryTime === 'scheduled' && (
                  <div className="mt-3">
                    <Label htmlFor="scheduledTime">Preferred Time</Label>
                    <Input
                      id="scheduledTime"
                      type="datetime-local"
                      value={orderOptions.scheduledTime}
                      onChange={(e) => setOrderOptions(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={orderOptions.paymentMethod}
                  onValueChange={(value) => setOrderOptions(prev => ({ ...prev, paymentMethod: value }))}
                  className="space-y-3 mb-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Cash on {orderOptions.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}</Label>
                  </div>
                </RadioGroup>

                {orderOptions.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date *</Label>
                        <Input
                          id="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          value={paymentInfo.cvv}
                          onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="nameOnCard">Name on Card *</Label>
                      <Input
                        id="nameOnCard"
                        value={paymentInfo.nameOnCard}
                        onChange={(e) => handleInputChange('payment', 'nameOnCard', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="billingZip">Billing ZIP Code *</Label>
                      <Input
                        id="billingZip"
                        value={paymentInfo.billingZip}
                        onChange={(e) => handleInputChange('payment', 'billingZip', e.target.value)}
                        placeholder="10001"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveInfo"
                        checked={orderOptions.saveInfo}
                        onCheckedChange={(checked) => setOrderOptions(prev => ({ ...prev, saveInfo: checked as boolean }))}
                      />
                      <Label htmlFor="saveInfo" className="text-sm">
                        Save payment information for faster checkout
                      </Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600">{item.restaurantName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Tip Selection */}
                <div>
                  <Label className="text-sm font-medium">Tip</Label>
                  <RadioGroup
                    value={orderOptions.tip}
                    onValueChange={(value) => setOrderOptions(prev => ({ ...prev, tip: value }))}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {['15', '18', '20', '25'].map((percentage) => (
                      <div key={percentage} className="flex items-center space-x-1">
                        <RadioGroupItem value={percentage} id={`tip-${percentage}`} className="sr-only" />
                        <Label
                          htmlFor={`tip-${percentage}`}
                          className={`px-3 py-1 text-xs border rounded cursor-pointer transition-colors ${
                            orderOptions.tip === percentage
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {percentage}%
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {orderOptions.deliveryMethod === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tip ({orderOptions.tip}%)</span>
                    <span>${tipAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={processOrder}
                  disabled={processing}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Place Order - ${total.toFixed(2)}
                    </div>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;