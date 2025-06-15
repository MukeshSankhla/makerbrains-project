
import { useState, useEffect } from "react";
import { CartItem } from "@/types/shop";

const CART_KEY = "ecom_cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id && i.type === item.type);
      if (idx >= 0) {
        // Already in cart: update quantity
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string, type: "product" | "course") =>
    setCart((cart) => cart.filter((i) => !(i.id === id && i.type === type)));

  const clearCart = () => setCart([]);

  return { cart, addItem, removeItem, clearCart };
}
