import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { CartItem, Order } from "@/types/shop";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddressSelectModal from "@/components/AddressSelectModal";
import { useAddressBook } from "@/hooks/useAddressBook";
import { Address } from "@/types/address";
import { useCurrency } from "@/hooks/useCurrency";

export default function Cart() {
  const { cart, removeItem, clearCart, addItem } = useCart();
  const { user } = useAuth();
  const [paymentProvider, setPaymentProvider] = useState<"stripe" | "razorpay" | "paypal">("stripe");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [addressModal, setAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { addresses } = useAddressBook();
  const { currency, format } = useCurrency();

  // Single cart totals calculation
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal; // only total, as price is inclusive of tax

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to place your order.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedAddress) {
      toast({
        title: "Select shipping address",
        description: "Please select a shipping address before checkout.",
        variant: "destructive",
      });
      setAddressModal(true);
      return;
    }
    if (!cart.length) return;

    // [NEW] Go to dummy payment page, passing cart/order info
    // For simplicity, add a hardcoded shipping cost (can be dynamic later)
    const shippingCost = 100; // INR, admin-chosen in future
    const order = {
      items: cart,
      shippingCost,
    };
    navigate("/payment", { state: { order, type: "order" } });
  };

  // Inline quantity change handlers
  const handleDecreaseQty = (item: CartItem) => {
    if (item.quantity > 1) {
      addItem({ ...item, quantity: -1 }); // addItem merges by id/type, negative quantity will decrease
    }
  };
  const handleIncreaseQty = (item: CartItem) => {
    addItem({ ...item, quantity: 1 });
  };

  return (
    <div className="container mx-auto py-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ShoppingCart className="h-7 w-7 text-primary" />
          Your Cart
        </h1>
        {!cart.length ? (
          <div className="p-8 rounded-lg bg-muted text-center text-muted-foreground max-w-lg mx-auto">
            <ShoppingBag className="mx-auto mb-2 h-10 w-10" />
            <p className="mb-4 font-medium">Your cart is empty.</p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="shadow border rounded-lg overflow-hidden bg-card">
            <div className="divide-y">
              {cart.map((item) => (
                <div
                  key={item.id + item.type}
                  className="flex flex-col sm:flex-row gap-4 items-center py-4 px-3"
                >
                  <div className="flex items-center gap-4 w-full sm:w-fit">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                    <div className="flex flex-col gap-0.5 min-w-36">
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {item.type === "product" ? "Product" : "Course"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ₹{item.price} / unit
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 ml-auto">
                    {/* Inline quantity adjust */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="p-2"
                      onClick={() => handleDecreaseQty(item)}
                      disabled={item.quantity === 1}
                      aria-label="Decrease quantity"
                    >-</Button>
                    <span className="px-2 text-base font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="p-2"
                      onClick={() => handleIncreaseQty(item)}
                      aria-label="Increase quantity"
                    >+</Button>
                  </div>
                  <div className="w-24 text-right font-semibold">
                    ₹{item.price * item.quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id, item.type as "product" | "course")}
                    className="p-2 ml-2"
                    aria-label="Remove item"
                  >
                    <span className="sr-only">Remove</span>
                    <span className="text-destructive text-lg font-bold">&times;</span>
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-between items-center border-t p-4 bg-muted">
              <Button asChild size="sm" variant="outline">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => clearCart()}>
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Order summary column */}
      {cart.length > 0 && (
        <div className="w-full md:w-80 max-w-[32rem]">
          <div className="rounded-lg border shadow p-6 bg-card space-y-4 sticky top-24">
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>
            {/* GST (18%) line removed */}
            {/* <div className="flex justify-between text-sm">
              <span>GST (18%)</span>
              <span>{format(tax)}</span>
            </div> */}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="text-primary">{format(total)}</span>
            </div>
            <div>
              <label className="mr-3 font-medium">Payment Method:</label>
              <select
                value={paymentProvider}
                onChange={(e) =>
                  setPaymentProvider(e.target.value as "stripe" | "razorpay" | "paypal")
                }
                className="border rounded px-3 py-1 w-full mt-1"
              >
                <option value="stripe">Stripe</option>
                <option value="razorpay">Razorpay</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
            <div>
              <label className="mr-3 font-medium">Shipping Address:</label>
              {selectedAddress ? (
                <span className="block bg-muted rounded p-2 mt-1">
                  {selectedAddress.name} - {selectedAddress.line1}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}, {selectedAddress.country}
                  <Button className="ml-2" size="sm" variant="outline" onClick={() => setAddressModal(true)}>Change</Button>
                </span>
              ) : (
                <Button size="sm" onClick={() => setAddressModal(true)}>
                  Select Address
                </Button>
              )}
              <Button asChild size="sm" variant="link" className="ml-2" >
                <Link to="/address-book">Manage Addresses</Link>
              </Button>
            </div>
            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={loading || !cart.length}
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>
            <div className="mt-2 text-xs text-muted-foreground">
              {/* Payment is simulated for now. Real payments coming soon! */}
              Payment is simulated for now. Real payments coming soon!
            </div>
          </div>
        </div>
      )}
      {addressModal && (
        <AddressSelectModal
          open={addressModal}
          onClose={() => setAddressModal(false)}
          selectedId={selectedAddress?.id}
          onSelect={(addr) => setSelectedAddress(addr)}
        />
      )}
    </div>
  );
}
