export type Product = {
  id: string;
  title: string;
  description: string;
  // Old price (for backward compatibility - will remove in UI?):
  price?: number;
  priceIndia: number;
  priceWorld: number;
  category: string;
  image: string;
  stock: number;
  type: "product";
};

export type Course = {
  id: string;
  title: string;
  description: string;
  // Old price (for backward compatibility - will remove in UI?):
  price?: number;
  priceIndia: number;
  priceWorld: number;
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
  trackingId?: string;
  trackingUrl?: string;
  adminComment?: string;
  // [NEW]
  shippingCost?: number;
};
