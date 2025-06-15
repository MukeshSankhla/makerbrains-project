import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Order } from "@/types/shop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/types/address";
import { ListOrdered, Timer, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

// Timeline UI
const statuses = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Timer },
  { key: "completed", label: "Delivered", icon: TrendingUp },
  { key: "cancelled", label: "Cancelled", icon: TrendingDown }
];

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const { currency, format } = useCurrency();

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

  // For address, try shippingAddress (new), fall back to legacy lookup:
  const getOrderAddressDisplay = () => {
    if (order?.shippingAddress) {
      const a = order.shippingAddress;
      return (
        <div className="mb-2 text-sm">
          {a.name}, {a.line1}
          {a.line2 && <> {a.line2}</>}, {a.city}, {a.state}, {a.zip}, {a.country}
          {a.phone && <>
            <br /><span className="text-xs text-muted-foreground">{a.phone}</span>
          </>}
        </div>
      );
    }
    if (shippingAddress) {
      return (
        <div className="mb-2 text-sm">
          {shippingAddress.name}, {shippingAddress.line1}
          {shippingAddress.line2 && <> {shippingAddress.line2}</>}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zip}, {shippingAddress.country}
          <br />
          <span className="text-xs text-muted-foreground">{shippingAddress.phone}</span>
        </div>
      );
    }
    return <div className="mb-2 text-muted-foreground text-xs">N/A</div>;
  };

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
      <div className="flex flex-col gap-4 mb-8">
        {order.status === "cancelled" ? (
          <div className="flex gap-3 items-center">
            <TrendingDown className="w-5 h-5 text-destructive" />
            <span className="text-destructive font-semibold">Cancelled</span>
          </div>
        ) : (
          statuses.slice(0, 3).map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex gap-3 items-center">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${idx <= currentStatusIdx
                  ? "bg-primary border-primary text-white"
                  : "bg-muted border-muted-foreground text-muted-foreground"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={idx <= currentStatusIdx
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
                }>
                  {step.label}
                </span>
              </div>
            );
          })
        )}
      </div>
      {/* Details */}
      <div className="mb-4">
        <div><b>Placed:</b> {order && new Date(order.createdAt).toLocaleString()}</div>
        <div className="mt-2 font-medium">Shipping Address:</div>
        {getOrderAddressDisplay()}
        <div className="mt-2 font-medium">Items:</div>
        <ul className="mb-2 list-disc pl-6">
          {order.items.map(item => (
            <li key={item.id + item.type}>{item.title} x {item.quantity} (₹{item.price} each)</li>
          ))}
        </ul>
        <div className="font-bold mt-2">Total: {format(order.totalAmount)}</div>
        {/* Admin comment & tracking if set */}
        {(order.adminComment || order.trackingId || order.trackingUrl) && (
          <div className="mt-4 p-3 border rounded bg-muted">
            {order.adminComment && (
              <div className="mb-2">
                <b>Message from Admin:</b>
                <div className="text-sm whitespace-pre-line">{order.adminComment}</div>
              </div>
            )}
            {(order.trackingId || order.trackingUrl) && (
              <div>
                <b>Tracking:</b>{" "}
                {order.trackingId && <span className="mr-2">{order.trackingId}</span>}
                {order.trackingUrl && (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Track Package
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <Button asChild variant="outline">
        <Link to="/orders">Back to Orders</Link>
      </Button>
    </div>
  );
}
