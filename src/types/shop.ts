
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
  status: "pending" | "paid" | "cancelled";
  createdAt: number;
};
