import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Order } from "@/types/shop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";

const statusLabels: Record<Order["status"], string> = {
  pending: "Pending",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled"
};

const statusVariants: Record<Order["status"], "default" | "secondary" | "destructive"> = {
  pending: "secondary",
  shipped: "default",
  completed: "default",
  cancelled: "destructive"
};

export default function AdminOrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();
  const { currency, format } = useCurrency();

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));
      setOrders(snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order)));
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: Order["status"], email: string) => {
    setUpdating(orderId);
    await updateDoc(doc(db, "orders", orderId), { status });
    setOrders(orders => orders.map(o => (o.id === orderId ? { ...o, status } : o)));

    // Call API trigger to send email
    try {
      await fetch("/api/sendOrderEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, email })
      });
    } catch (e) {
      // Log email sending error (for now)
      console.error("Failed to trigger order email send:", e);
    }

    toast({
      title: "Order updated",
      description: `Order ${orderId.slice(-6).toUpperCase()} set to ${status}`,
      variant: status === "cancelled" ? "destructive" : "default"
    });
    setUpdating(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-muted text-muted-foreground text-sm">
              <th className="p-2">Order ID</th>
              <th className="p-2">User</th>
              <th className="p-2">Placed</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="p-2 font-mono">{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-2">{order.userId}</td>
                <td className="p-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="p-2 font-semibold">{format(order.totalAmount)}</td>
                <td className="p-2">
                  <Badge variant={statusVariants[order.status]} className="capitalize">{statusLabels[order.status]}</Badge>
                </td>
                <td className="p-2">
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    className="border rounded px-2 py-1"
                    onChange={e =>
                      handleStatusChange(order.id, e.target.value as Order["status"], order.email || "")
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
