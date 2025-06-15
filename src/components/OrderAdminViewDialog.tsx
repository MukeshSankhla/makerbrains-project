
import React, { useRef } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";
import { Order } from "@/types/shop";
import { useCurrency } from "@/hooks/useCurrency";

// Print utility: print a specific dom node
function printRefContent(ref: React.RefObject<HTMLDivElement>) {
  if (ref.current) {
    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Order Bill</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .print-header { font-size:1.25rem; font-weight:bold; margin-bottom:8px;}
          .print-table { border-collapse: collapse; width: 100%; margin-top: 8px;}
          .print-table th, .print-table td { border: 1px solid #ddd; padding: 5px; }
          .print-total { font-weight: bold; color: #27994C;}
        </style>
      </head><body>`);
      printWindow.document.write(ref.current.innerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 300);
    }
  }
}

type Props = {
  order: Order;
  userName: string;
};

export const OrderAdminViewDialog: React.FC<Props> = ({ order, userName }) => {
  const [open, setOpen] = React.useState(false);
  const { format } = useCurrency();
  const billRef = useRef<HTMLDivElement>(null);

  // Address rendering
  let addressNode: React.ReactNode = "N/A";
  if (order.shippingAddress) {
    const a = order.shippingAddress;
    addressNode = (
      <div>
        {a.name}, {a.line1}
        {a.line2 && <span> {a.line2},</span>} {a.city}, {a.state}, {a.zip}, {a.country}
        {a.phone && <><br /><span style={{ fontSize: 11, color: "#888" }}>{a.phone}</span></>}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" title="View/Print details">View</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Full Details</DialogTitle>
        </DialogHeader>
        <div ref={billRef} className="space-y-4 print:p-0 print:m-0">
          <div className="print-header">Order Bill/Details</div>
          <div><b>Order ID:</b> {order.id.slice(-6).toUpperCase()}</div>
          <div><b>User Name:</b> {userName}</div>
          <div><b>Placed:</b> {new Date(order.createdAt).toLocaleString()}</div>
          <div><b>Status:</b> 
            <Badge variant={order.status === "completed" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"} className="capitalize ml-2">
              {order.status}
            </Badge>
          </div>
          <div>
            <strong>Shipping Address:</strong>
            <div>{addressNode}</div>
          </div>
          <div>
            <strong>Items:</strong>
            <table className="print-table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Qty</th>
                  <th>Price Each</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id + item.type}>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>{format(item.price)}</td>
                    <td>{format(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="print-total mt-2 mb-2 text-right">Total: {format(order.totalAmount)}</div>
          </div>
          {(order.adminComment || order.trackingId || order.trackingUrl) && (
            <div>
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
        <DialogFooter>
          <Button type="button" onClick={() => printRefContent(billRef)} variant="outline">
            <Printer className="w-4 h-4 mr-2" /> Print Bill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
