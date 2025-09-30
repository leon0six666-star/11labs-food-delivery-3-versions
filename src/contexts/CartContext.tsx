import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { restaurants } from '@/data/mockData';

export interface CartItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  itemId: string;
  itemName: string;
  price: number;
  quantity: number;
  image?: string;
  specialInstructions?: string;
  scheduledDelivery?: Date;
}

export interface RestaurantCart {
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  estimatedDeliveryTime: string;
  scheduledDelivery?: Date;
}

export interface CartState {
  restaurantCarts: Record<string, RestaurantCart>;
  totalItems: number;
  grandTotal: number;
  groupOrderMode: boolean;
  groupOrderName?: string;
  groupOrderMembers: string[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { restaurantId: string; itemId: string; quantity?: number; specialInstructions?: string; scheduledDelivery?: Date } }
  | { type: 'REMOVE_ITEM'; payload: { restaurantId: string; itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { restaurantId: string; itemId: string; quantity: number } }
  | { type: 'CLEAR_RESTAURANT_CART'; payload: { restaurantId: string } }
  | { type: 'CLEAR_ALL_CARTS' }
  | { type: 'SET_SCHEDULED_DELIVERY'; payload: { restaurantId: string; date: Date } }
  | { type: 'ENABLE_GROUP_ORDER'; payload: { groupName: string; members: string[] } }
  | { type: 'DISABLE_GROUP_ORDER' }
  | { type: 'LOAD_FROM_STORAGE'; payload: CartState };

const initialState: CartState = {
  restaurantCarts: {},
  totalItems: 0,
  grandTotal: 0,
  groupOrderMode: false,
  groupOrderMembers: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { restaurantId, itemId, quantity = 1, specialInstructions, scheduledDelivery } = action.payload;
      
      // Find restaurant and item
      const restaurant = restaurants.find(r => r.id === restaurantId);
      const item = restaurant?.menu?.find(i => i.id === itemId) || 
                   { id: itemId, name: 'Sample Item', price: 12.99, category: 'main' };
      
      if (!restaurant || !item) return state;

      const cartItemId = `${restaurantId}-${itemId}`;
      const newRestaurantCarts = { ...state.restaurantCarts };

      // Initialize restaurant cart if it doesn't exist
      if (!newRestaurantCarts[restaurantId]) {
        newRestaurantCarts[restaurantId] = {
          restaurantId,
          restaurantName: restaurant.name,
          items: [],
          subtotal: 0,
          deliveryFee: restaurant.delivery_fee,
          serviceFee: 2.99,
          estimatedDeliveryTime: `${restaurant.delivery_time_min}-${restaurant.delivery_time_max} min`,
          scheduledDelivery,
        };
      }

      const restaurantCart = newRestaurantCarts[restaurantId];
      const existingItemIndex = restaurantCart.items.findIndex(i => i.id === cartItemId);

      if (existingItemIndex >= 0) {
        // Update existing item
        restaurantCart.items[existingItemIndex].quantity += quantity;
        if (specialInstructions) {
          restaurantCart.items[existingItemIndex].specialInstructions = specialInstructions;
        }
      } else {
        // Add new item
        restaurantCart.items.push({
          id: cartItemId,
          restaurantId,
          restaurantName: restaurant.name,
          itemId,
          itemName: item.name,
          price: item.price,
          quantity,
          image: item.image,
          specialInstructions,
          scheduledDelivery,
        });
      }

      // Recalculate subtotal
      restaurantCart.subtotal = restaurantCart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );

      return calculateTotals({ ...state, restaurantCarts: newRestaurantCarts });
    }

    case 'REMOVE_ITEM': {
      const { restaurantId, itemId } = action.payload;
      const cartItemId = `${restaurantId}-${itemId}`;
      
      const newRestaurantCarts = { ...state.restaurantCarts };
      if (!newRestaurantCarts[restaurantId]) return state;

      const restaurantCart = newRestaurantCarts[restaurantId];
      restaurantCart.items = restaurantCart.items.filter(item => item.id !== cartItemId);
      
      // Recalculate subtotal
      restaurantCart.subtotal = restaurantCart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );

      // Remove restaurant cart if empty
      if (restaurantCart.items.length === 0) {
        delete newRestaurantCarts[restaurantId];
      }

      return calculateTotals({ ...state, restaurantCarts: newRestaurantCarts });
    }

    case 'UPDATE_QUANTITY': {
      const { restaurantId, itemId, quantity } = action.payload;
      const cartItemId = `${restaurantId}-${itemId}`;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { restaurantId, itemId } });
      }

      const newRestaurantCarts = { ...state.restaurantCarts };
      if (!newRestaurantCarts[restaurantId]) return state;

      const restaurantCart = newRestaurantCarts[restaurantId];
      const itemIndex = restaurantCart.items.findIndex(item => item.id === cartItemId);
      
      if (itemIndex >= 0) {
        restaurantCart.items[itemIndex].quantity = quantity;
        
        // Recalculate subtotal
        restaurantCart.subtotal = restaurantCart.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
      }

      return calculateTotals({ ...state, restaurantCarts: newRestaurantCarts });
    }

    case 'CLEAR_RESTAURANT_CART': {
      const { restaurantId } = action.payload;
      const newRestaurantCarts = { ...state.restaurantCarts };
      delete newRestaurantCarts[restaurantId];
      
      return calculateTotals({ ...state, restaurantCarts: newRestaurantCarts });
    }

    case 'CLEAR_ALL_CARTS': {
      return { ...initialState };
    }

    case 'SET_SCHEDULED_DELIVERY': {
      const { restaurantId, date } = action.payload;
      const newRestaurantCarts = { ...state.restaurantCarts };
      
      if (newRestaurantCarts[restaurantId]) {
        newRestaurantCarts[restaurantId].scheduledDelivery = date;
      }

      return { ...state, restaurantCarts: newRestaurantCarts };
    }

    case 'ENABLE_GROUP_ORDER': {
      const { groupName, members } = action.payload;
      return {
        ...state,
        groupOrderMode: true,
        groupOrderName: groupName,
        groupOrderMembers: members,
      };
    }

    case 'DISABLE_GROUP_ORDER': {
      return {
        ...state,
        groupOrderMode: false,
        groupOrderName: undefined,
        groupOrderMembers: [],
      };
    }

    case 'LOAD_FROM_STORAGE': {
      return action.payload;
    }

    default:
      return state;
  }
}

function calculateTotals(state: CartState): CartState {
  const totalItems = Object.values(state.restaurantCarts).reduce(
    (sum, cart) => sum + cart.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  const grandTotal = Object.values(state.restaurantCarts).reduce(
    (sum, cart) => sum + cart.subtotal + cart.deliveryFee + cart.serviceFee, 0
  );

  return {
    ...state,
    totalItems,
    grandTotal,
  };
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('food-delivery-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedCart });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('food-delivery-cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper functions for easier cart management
export const cartHelpers = {
  addItem: (dispatch: React.Dispatch<CartAction>, restaurantId: string, itemId: string, quantity = 1, specialInstructions?: string, scheduledDelivery?: Date) => {
    dispatch({ type: 'ADD_ITEM', payload: { restaurantId, itemId, quantity, specialInstructions, scheduledDelivery } });
  },

  removeItem: (dispatch: React.Dispatch<CartAction>, restaurantId: string, itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { restaurantId, itemId } });
  },

  updateQuantity: (dispatch: React.Dispatch<CartAction>, restaurantId: string, itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { restaurantId, itemId, quantity } });
  },

  clearRestaurantCart: (dispatch: React.Dispatch<CartAction>, restaurantId: string) => {
    dispatch({ type: 'CLEAR_RESTAURANT_CART', payload: { restaurantId } });
  },

  clearAllCarts: (dispatch: React.Dispatch<CartAction>) => {
    dispatch({ type: 'CLEAR_ALL_CARTS' });
  },

  scheduleDelivery: (dispatch: React.Dispatch<CartAction>, restaurantId: string, date: Date) => {
    dispatch({ type: 'SET_SCHEDULED_DELIVERY', payload: { restaurantId, date } });
  },

  enableGroupOrder: (dispatch: React.Dispatch<CartAction>, groupName: string, members: string[]) => {
    dispatch({ type: 'ENABLE_GROUP_ORDER', payload: { groupName, members } });
  },

  disableGroupOrder: (dispatch: React.Dispatch<CartAction>) => {
    dispatch({ type: 'DISABLE_GROUP_ORDER' });
  },
};