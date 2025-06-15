
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const snap = await getDocs(collection(db, "products"));
      const found = snap.docs.map(doc => doc.data()).find(p => p.id === id);
      setProduct(found);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-2 bg-background shadow rounded">
      <img src={product.image} alt={product.title} className="w-full max-h-64 object-cover rounded mb-4" />
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <div className="mt-3 font-semibold">₹{product.price} (Tax included)</div>
      <div className="my-4">{product.description}</div>
      <Button onClick={() => addItem({ ...product, quantity: 1 })}>Add to Cart</Button>
    </div>
  );
}
