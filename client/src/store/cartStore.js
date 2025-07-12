import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  addToCart: (product, quantity = 1) => {
    set(state => {
      const existing = state.items.find(item => item.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      } else {
        return {
          items: [...state.items, { product, quantity }]
        };
      }
    });
  },
  removeFromCart: (productId) => {
    set(state => ({
      items: state.items.filter(item => item.product.id !== productId)
    }));
  },
  updateQuantity: (productId, quantity) => {
    set(state => ({
      items: state.items.map(item =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
})); 