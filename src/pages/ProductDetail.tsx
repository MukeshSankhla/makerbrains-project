
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Product } from "@/types/shop";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "products", id)).then((snap) => {
      if (snap.exists()) {
        setProduct({ ...snap.data(), id: snap.id } as Product);
      }
    });
  }, [id]);

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  // "Buy Now" puts only this product in "cart",
  // then sends to /cart with buyNow state to proceed checkout for this product only
  function handleBuyNow() {
    if (!user) {
      navigate('/login');
      return;
    }
    addItem({ ...product, quantity: 1 }); // ensure it's in cart
    navigate("/cart", { state: { buyNow: product.id } });
  }

  return (
    <div className="container max-w-xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.image} alt={product.title} className="w-full md:w-64 h-48 object-cover rounded" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{product.title}</h1>
          <div className="mt-2 font-bold text-primary text-xl mb-2">₹{product.price}</div>
          <div className="mb-4">{product.description}</div>
          {Array.isArray((product as any).specs) && (
            <div className="mb-3">
              <div className="font-semibold mb-1">Specifications:</div>
              <ul className="list-disc ml-6 text-sm">
                {(product as any).specs.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => addItem({ ...product, quantity: 1 })}>
              Add to Cart
            </Button>
            <Button onClick={handleBuyNow}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
