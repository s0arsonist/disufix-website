import { ProductCart } from "@/interfaces";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  product: ProductCart;
  quantity: number;
};

type StoreState = {
  cart: CartItem[];
  addToCart: (product: ProductCart) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (uniqueKey: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product: ProductCart) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find(
          (item) => item.product.uniqueKey === product.uniqueKey
        );

        if (existingItem) {
          // Si el producto ya estÃ¡ en el carrito, actualiza la cantidad
          set({
            cart: currentCart.map((item) =>
              item.product.uniqueKey === product.uniqueKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
          toast.success("Â¡Producto agregado al carrito!");
        } else {
          // Si no existe, agrega el nuevo producto al carrito
          set({
            cart: [...currentCart, { product, quantity: 1 }],
          });
          toast.success("Â¡Producto agregado al carrito!");
        }
      },

      removeFromCart: (uniqueKey: string) => {
        set({
          cart: get().cart.filter(
            (item) => item.product.uniqueKey !== uniqueKey
          ),
        });
      },

      updateQuantity: (uniqueKey: string, quantity: number) => {
        set({
          cart: get().cart.map((item) =>
            item.product.uniqueKey === uniqueKey ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0);
      },

      getCartItemsCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "disufix-cart",
    }
  )
);
