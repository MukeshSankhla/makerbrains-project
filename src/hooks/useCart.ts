
import { useState, useEffect, useCallback } from "react";
import { CartItem } from "@/types/shop";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebase";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  updateDoc,
  deleteField
} from "firebase/firestore";

const CART_KEY = "ecom_cart";

export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const isLoggedIn = !!user;

  // Cloud cart reference for Firestore users
  const cartDocRef = user
    ? doc(db, "carts", user.uid)
    : null;

  // Load cart items initially
  useEffect(() => {
    if (isLoggedIn && cartDocRef) {
      // Subscribe to Firestore cart for logged-in user
      const unsub = onSnapshot(cartDocRef, (docSnap) => {
        const items = docSnap.exists() ? docSnap.data()?.items || [] : [];
        setCart(items);
      });
      return unsub;
    } else {
      // Guest: load cart from local storage
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setCart(JSON.parse(stored));
      else setCart([]);
    }
    // eslint-disable-next-line
  }, [isLoggedIn, user?.uid]);

  // Save guest cart to localStorage on change
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  // Write entire cart to Firestore for user
  const saveCloudCart = useCallback(async (items: CartItem[]) => {
    if (!user) return;
    await setDoc(cartDocRef!, { items });
  }, [user]);

  const addItem = async (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id && i.type === item.type);
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx].quantity += item.quantity;
        if (updated[idx].quantity < 1) updated[idx].quantity = 1;
      } else {
        updated = [...prev, item];
      }
      if (isLoggedIn) saveCloudCart(updated);
      return updated;
    });
  };

  const removeItem = async (id: string, type: "product" | "course") => {
    setCart((prev) => {
      const updated = prev.filter((i) => !(i.id === id && i.type === type));
      if (isLoggedIn) saveCloudCart(updated);
      return updated;
    });
  };

  const clearCart = async () => {
    setCart([]);
    if (isLoggedIn) saveCloudCart([]);
  };

  // when logging in: migrate guest cart to cloud if cloud cart is empty
  useEffect(() => {
    const migrateGuestCartToCloud = async () => {
      if (isLoggedIn && cartDocRef) {
        const cloudSnap = await getDoc(cartDocRef);
        const cloudItems = cloudSnap.exists() ? cloudSnap.data()?.items || [] : [];
        if (cloudItems.length === 0) {
          // migrate guest cart if exists
          const guest = localStorage.getItem(CART_KEY);
          const guestCart: CartItem[] = guest ? JSON.parse(guest) : [];
          if (guestCart.length > 0) {
            await setDoc(cartDocRef, { items: guestCart });
            setCart(guestCart);
            localStorage.removeItem(CART_KEY);
          }
        }
      }
    };
    migrateGuestCartToCloud();
    // eslint-disable-next-line
  }, [isLoggedIn, user?.uid]);

  return { cart, addItem, removeItem, clearCart };
}
