import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// This is a dummy payment page, expects order/cart/course info in location state

export default function Payment() {
  // Forcefully log as the VERY first line in component
  // (if you do NOT see this line in devtools, the file is not even imported or rendered!)
  console.log("[DEBUG] PAYMENT PAGE MOUNT");

  // Always render this so you never get a blank page:
  // If the rest errors, you at least see this!
  // You can comment/remove after debug.
  if (typeof window !== "undefined" && !(window as any).__seen_payment_debug) {
    (window as any).__seen_payment_debug = true;
    setTimeout(() => {
      alert("Payment page rendered - TOP OF COMPONENT - if you see blank page, something is broken in routing or import/export!");
    }, 1000);
  }

  // Defensive: wrap location in try/catch to test for error at access
  let location, navigate;
  try {
    location = useLocation();
    navigate = useNavigate();
  } catch (e) {
    return (
      <div className="container mx-auto py-20">
        <h1 className="text-red-600 text-3xl font-bold">Error mounting Payment Page</h1>
        <p className="mt-6 p-4 bg-yellow-100 border rounded">
          {JSON.stringify(e)}
        </p>
      </div>
    );
  }

  // Defensive: try/catch for structure errors
  let order, course, type;
  try {
    ({ order, course, type = "order" } = location.state || {});
    console.log("[DEBUG] location:", location);
    console.log("[DEBUG] order:", order, "| course:", course, "| type:", type);
  } catch (e) {
    return (
      <div className="container mx-auto py-20">
        <h2 className="text-red-500 text-xl font-bold mb-4">Payment Page Error</h2>
        <p>Failed to parse navigation data.</p>
        <pre className="mt-6 p-3 text-xs bg-slate-100 rounded border overflow-x-auto">{String(e)}</pre>
      </div>
    );
  }

  // fallback block
  if (!order && !course) {
    return (
      <div className="container max-w-md mx-auto py-10">
        <div className="rounded-lg border-4 border-red-500 p-6 bg-yellow-100 text-center">
          <h2 className="text-2xl font-bold mb-2 text-red-700">No Payment Information Detected</h2>
          <p className="mb-4 text-lg font-semibold text-slate-700">
            No order or course data was found.
            <br />
            Please go back to your cart or course page to proceed with a purchase.
          </p>
          <Button className="mx-2" onClick={() => navigate("/cart")}>Go to Cart</Button>
          <Button variant="outline" className="mx-2" onClick={() => navigate("/courses")}>Browse Courses</Button>
          <div className="mt-5 p-2 bg-white border rounded text-left">
            <b>Debug info:</b>
            <pre className="text-xs bg-slate-100 p-2 mt-2 rounded text-black overflow-x-auto" style={{ maxWidth: 320 }}>
{JSON.stringify(location, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

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
