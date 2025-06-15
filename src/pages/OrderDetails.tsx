import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Order } from "@/types/shop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/types/address";

// Timeline UI
const statuses = [
  { key: "pending", label: "Order Placed" },
  { key: "shipped", label: "Shipped" },
  { key: "completed", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" }
];

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    getDoc(doc(db, "orders", orderId)).then((snap) => {
      if (snap.exists()) {
        setOrder({ ...snap.data(), id: snap.id } as Order);
      }
      setLoading(false);
    });
  }, [orderId]);

  useEffect(() => {
    if (!order || !order.addressId) {
      setShippingAddress(null);
      return;
    }
    getDoc(doc(db, "addresses", order.addressId)).then((addrSnap) => {
      if (addrSnap.exists()) {
        setShippingAddress({ ...addrSnap.data(), id: addrSnap.id } as Address);
      }
    });
  }, [order]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center">Order not found.</div>;
  if (user?.uid !== order.userId) return <div className="p-8 text-center">You don't have permission to view this order.</div>;

  // Timeline logic
  const currentStatusIdx = statuses.findIndex(s => s.key === order.status);

  return (
    <div className="container max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Order Tracking</h1>
      <div className="mb-4">
        <span className="font-medium">Order ID:</span>
        <span className="ml-2 text-muted-foreground">{order.id.slice(-6).toUpperCase()}</span>
        <Badge variant={
          order.status === "completed"
            ? "default"
            : order.status === "cancelled"
            ? "destructive"
            : "secondary"
        } className="ml-2 capitalize">{order.status}</Badge>
      </div>
      {/* Timeline */}
      <div className="flex flex-col gap-2 mb-8">
        {order.status === "cancelled" ? (
          <div className="flex gap-3 items-center">
            <div className="w-4 h-4 rounded-full border-2 bg-red-500 border-red-500" />
            <span className="text-destructive font-semibold">Cancelled</span>
          </div>
        ) : (
          statuses.slice(0, 3).map((step, idx) => (
            <div key={step.key} className="flex gap-3 items-center">
              <div className={`w-4 h-4 rounded-full border-2 ${idx <= currentStatusIdx
                ? "bg-primary border-primary"
                : "bg-muted border-muted-foreground"
              }`} />
              <span className={idx <= currentStatusIdx
                ? "text-primary font-semibold"
                : "text-muted-foreground"
              }>
                {step.label}
              </span>
            </div>
          ))
        )}
      </div>
      {/* Details */}
      <div className="mb-4">
        <div><b>Placed:</b> {order && new Date(order.createdAt).toLocaleString()}</div>
        <div className="mt-2 font-medium">Shipping Address:</div>
        {shippingAddress ? (
          <div className="mb-2 text-sm">
            {shippingAddress.name}, {shippingAddress.line1}
            {shippingAddress.line2 && <> {shippingAddress.line2}</>}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zip}, {shippingAddress.country}<br />
            <span className="text-xs text-muted-foreground">{shippingAddress.phone}</span>
          </div>
        ) : (
          <div className="mb-2 text-muted-foreground text-xs">N/A</div>
        )}
        <div className="mt-2 font-medium">Items:</div>
        <ul className="mb-2 list-disc pl-6">
          {order.items.map(item => (
            <li key={item.id + item.type}>{item.title} x {item.quantity} (₹{item.price} each)</li>
          ))}
        </ul>
        <div className="font-bold mt-2">Total: ₹{order.totalAmount}</div>
      </div>
      <Button asChild variant="outline">
        <Link to="/orders">Back to Orders</Link>
      </Button>
    </div>
  );
}
