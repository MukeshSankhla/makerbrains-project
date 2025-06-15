
import { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { Order } from "@/types/shop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import { OrderAdminDialog } from "./OrderAdminDialog";
import { Printer, Trash2, MessageSquare, Link as LinkIcon } from "lucide-react";
import { OrderAdminViewDialog } from "./OrderAdminViewDialog";

// Helper to cache/fetch users for table
async function fetchUserNames(uids: string[]) {
  const result: Record<string, string> = {};
  const promises = uids.map(async (uid) => {
    if (!uid) return;
    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists()) result[uid] = userSnap.data().fullName || uid;
    else result[uid] = uid;
  });
  await Promise.all(promises);
  return result;
}

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
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();
  const { currency, format } = useCurrency();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));
      const docs = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
      setOrders(docs);
      const uids = Array.from(new Set(docs.map(o => o.userId)));
      const names = await fetchUserNames(uids);
      setUserNames(names);
    };
    fetchOrders();
  }, []);

  // Order status update handler
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
      console.error("Failed to trigger order email send:", e);
    }
    toast({
      title: "Order updated",
      description: `Order ${orderId.slice(-6).toUpperCase()} set to ${status}`,
      variant: status === "cancelled" ? "destructive" : "default"
    });
    setUpdating(null);
  };

  // Delete order with confirmation
  const handleDelete = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    await deleteDoc(doc(db, "orders", orderId));
    setOrders(orders => orders.filter(o => o.id !== orderId));
    toast({
      title: "Order deleted",
      description: `Order ${orderId.slice(-6).toUpperCase()} has been deleted.`,
      variant: "destructive"
    });
  };

  // Update comment and tracking
  const handleAdminOrderUpdate = async (
    orderId: string,
    updates: { adminComment: string; trackingUrl: string; trackingId: string }
  ) => {
    setUpdating(orderId);
    await updateDoc(doc(db, "orders", orderId), updates);
    setOrders(orders => orders.map(o => o.id === orderId ? { ...o, ...updates } : o));
    toast({
      title: "Order updated",
      description: "Details saved.",
      variant: "default"
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
              <th className="p-2">User Name</th>
              <th className="p-2">Placed</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Change Status</th>
              <th className="p-2">Admin Actions</th>
              <th className="p-2">View/Print</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="p-2 font-mono">{order.id.slice(-6).toUpperCase()}</td>
                <td className="p-2">{userNames[order.userId] || order.userId}</td>
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
                <td className="p-2 flex gap-2 items-center">
                  {/* Comment + Tracking Editor */}
                  <OrderAdminDialog
                    trigger={
                      <Button size="icon" variant="secondary" title="Edit Comment/Tracking" className="text-blue-600">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    }
                    currentComment={order.adminComment}
                    currentTrackingId={order.trackingId}
                    currentTrackingUrl={order.trackingUrl}
                    onSave={fields =>
                      handleAdminOrderUpdate(order.id, fields)
                    }
                  />
                  {/* Show tracking url (if set) */}
                  {order.trackingUrl && (
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" title="Tracking URL">
                      <LinkIcon className="w-4 h-4 text-emerald-600" />
                    </a>
                  )}
                  {/* Delete */}
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Delete Order"
                    className="text-red-600"
                    onClick={() => handleDelete(order.id)}
                    disabled={updating === order.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
                <td className="p-2 flex gap-2 items-center">
                  <OrderAdminViewDialog
                    order={order}
                    userName={userNames[order.userId] || order.userId}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
