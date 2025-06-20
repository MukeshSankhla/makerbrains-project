export type Product = {
  id: string;
  title: string;
  description: string;
  price: number; // in INR
  category: string;
  image: string;
  stock: number;
  type: "product"; // distinguishes from course
};

export type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  instructor: string;
  type: "course";
};

export type CartItem =
  | (Product & { quantity: number })
  | (Course & { quantity: number });

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  paymentProvider: "stripe" | "razorpay" | "paypal";
  status: "pending" | "shipped" | "completed" | "cancelled";
  createdAt: number;
  email?: string;
  addressId?: string;
  shippingAddress?: Omit<import("./address").Address, "id" | "userId" | "createdAt" | "updatedAt">;
  trackingId?: string;           // [NEW] for shipment tracking
  trackingUrl?: string;          // [NEW] for shipment tracking link
  adminComment?: string;         // [NEW] for admin-user communication
};
