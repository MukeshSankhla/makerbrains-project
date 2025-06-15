
import { useEffect, useState } from "react";
import { Product } from "@/types/shop";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/hooks/useCart";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    // Fetch products from Firestore
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((doc) => doc.data() as Product));
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Shop</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            item={p}
            onAddToCart={() => addItem({ ...p, quantity: 1 })}
          />
        ))}
      </div>
    </div>
  );
}
