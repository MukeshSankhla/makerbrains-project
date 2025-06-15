
import { useEffect, useState } from "react";
import { Order } from "@/types/shop";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Order)));
    };
    fetchOrders();
  }, [user]);

  if (!user) return <div>Please log in to view your orders.</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {!orders.length ? (
        <div>No orders yet.</div>
      ) : (
        <ul className="divide-y">
          {orders.map((order) => (
            <li key={order.id} className="py-3">
              <div className="mb-1 font-semibold flex items-center gap-2">
                <Link
                  to={`/orders/${order.id}`}
                  className="underline text-primary hover:opacity-80"
                >
                  Order #{order.id.slice(-5).toUpperCase()}
                </Link>
                <Badge variant={order.status === "completed" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"}>
                  {order.status}
                </Badge>
              </div>
              <div className="mb-1 text-sm">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </div>
              <ul className="text-sm">
                {order.items.map((item) => (
                  <li key={item.id + item.type}>
                    {item.title} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
              <div className="font-bold text-green-700 mt-1">
                Total: ₹{order.totalAmount}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
