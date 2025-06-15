
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "@/types/shop";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      const ref = doc(db, "products", productId);
      const snap = await getDoc(ref);
      if (snap.exists()) setProduct(snap.data() as Product);
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto py-8 flex flex-col md:flex-row gap-12">
      <img src={product.image} alt={product.title} className="w-72 h-72 object-cover rounded-lg border mx-auto mb-8 md:mb-0" />
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-lg text-muted-foreground">{product.description}</p>
        <div className="text-xl font-semibold">₹{product.price}</div>
        <div>
          <Button onClick={() => addItem({ ...product, quantity: 1 })}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
