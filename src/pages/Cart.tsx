
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { CartItem, Order } from "@/types/shop";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Cart() {
  const { cart, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentProvider, setPaymentProvider] = useState<"stripe" | "razorpay" | "paypal">("stripe");
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please log in to place your order.");
      return;
    }
    if (!cart.length) return;

    setLoading(true);

    // Save order to Firestore (simulate payment for now)
    const order: Omit<Order, "id"> = {
      userId: user.uid,
      items: cart,
      totalAmount: total,
      paymentProvider,
      status: "pending",
      createdAt: Date.now()
    };

    try {
      await addDoc(collection(db, "orders"), order);
      clearCart();
      alert("Order placed! (payment simulated for now)");
    } catch {
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {!cart.length ? (
        <div>Your cart is empty.</div>
      ) : (
        <div>
          <ul className="divide-y mb-4">
            {cart.map((item) => (
              <li key={item.id + item.type} className="flex justify-between py-2">
                <span>
                  {item.title}{" "}
                  <span className="mx-2 text-xs text-gray-500">{item.quantity} × ₹{item.price}</span>
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeItem(item.id, item.type as "product" | "course")}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <div className="mb-4 font-semibold">Total: ₹{total}</div>
          <div className="mb-4">
            <label className="mr-3 font-medium">Choose Payment:</label>
            <select
              value={paymentProvider}
              onChange={(e) =>
                setPaymentProvider(e.target.value as "stripe" | "razorpay" | "paypal")
              }
              className="border rounded px-2 py-1"
            >
              <option value="stripe">Stripe</option>
              <option value="razorpay">Razorpay</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <Button onClick={handleCheckout} disabled={loading || !cart.length}>
            {loading ? "Processing..." : "Place Order"}
          </Button>
          <div className="mt-2 text-xs text-gray-500">
            Payment is simulated for now. Real payments coming soon!
          </div>
        </div>
      )}
    </div>
  );
}
