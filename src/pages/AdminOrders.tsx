
import AdminOrderTable from "@/components/AdminOrderTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function AdminOrders() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin: Orders Management</h1>
        <Button asChild><Link to="/">Home</Link></Button>
      </div>
      <AdminOrderTable />
    </div>
  );
}
