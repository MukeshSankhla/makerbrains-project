
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const paymentOptions = [
  { key: "stripe", label: "Stripe" },
  { key: "razorpay", label: "Razorpay" },
  { key: "paypal", label: "PayPal" },
];

// This is a dummy payment page, expects order/cart/course info in location state
export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  // Info will be in location.state
  const { order, course, type = "order" } = location.state || {};
  // Default selection
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  // Shipping cost handling for demo. If passed from prev page, use it.
  const [shippingCost] = useState(order?.shippingCost ?? 100); // Default 100 INR

  // Product/course may have one or two prices
  const getPriceFields = (item: any) => ({
    india: item.priceIndia ?? 0,
    world: item.priceWorld ?? 0,
  });

  const handlePay = () => {
    // Simulate payment, then redirect appropriately
    setTimeout(() => {
      // Simulate "successful" payment, redirect to success.
      navigate("/payment-success");
    }, 700);
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Payment</h1>
      <div className="mb-6">
        <label className="block font-semibold mb-2">Select Payment Method:</label>
        <div className="flex gap-4 mb-2">
          {paymentOptions.map((opt) => (
            <Button
              key={opt.key}
              variant={paymentProvider === opt.key ? "default" : "outline"}
              onClick={() => setPaymentProvider(opt.key)}
              className="flex-1 capitalize"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="border rounded p-4 bg-muted mb-5">
        {type === "course" && course && (
          <>
            <div className="font-medium">Course: {course.title}</div>
            <div className="mb-1 text-sm">
              <b>Price (India):</b> ₹{course.priceIndia}
              <br />
              <b>Price (World):</b> ₹{course.priceWorld}
            </div>
            <div className="text-sm"><b>Shipping:</b> ₹{shippingCost}</div>
            <div className="font-semibold text-primary mt-2">
              Total: ₹{course.priceIndia + shippingCost} <span className="ml-1 text-xs text-muted-foreground">(India)</span>
            </div>
            <div className="font-semibold text-primary">
              Total: ₹{course.priceWorld + shippingCost} <span className="ml-1 text-xs text-muted-foreground">(Out of India)</span>
            </div>
          </>
        )}
        {type === "order" && order && (
          <>
            <div className="font-medium">Order contains {order.items?.length || 0} item(s)</div>
            <div className="mb-1 text-sm">
              {order.items?.map((item: any) => (
                <div key={item.id + item.type}>
                  {item.title} ({item.type}) × {item.quantity}<br />
                  Price (India): ₹{item.priceIndia ?? 0}, Price (World): ₹{item.priceWorld ?? 0}
                </div>
              ))}
            </div>
            <div className="text-sm"><b>Shipping:</b> ₹{shippingCost}</div>
            <div className="font-semibold text-primary mt-2">
              Total (India): ₹{order.items?.reduce((sum: number, i: any) => sum + (i.priceIndia * i.quantity), 0) + shippingCost}
            </div>
            <div className="font-semibold text-primary">
              Total (World): ₹{order.items?.reduce((sum: number, i: any) => sum + (i.priceWorld * i.quantity), 0) + shippingCost}
            </div>
          </>
        )}
      </div>
      <Button
        className="w-full"
        size="lg"
        onClick={handlePay}
      >Proceed to Pay (Dummy)</Button>
    </div>
  );
}
