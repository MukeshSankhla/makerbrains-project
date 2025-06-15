import { Product, Course } from "@/types/shop";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  item: Product | Course;
  onAddToCart?: () => void;
  onBuy?: () => void; // Only for course
  isOwned?: boolean; // Only for course
  type?: "product" | "course";
}

export function ProductCard({
  item,
  onAddToCart,
  onBuy,
  isOwned,
  type
}: ProductCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleAdd() {
    if (!user) {
      navigate("/login");
      return;
    }
    onAddToCart && onAddToCart();
  }

  function handleBuy() {
    if (!user) {
      navigate("/login");
      return;
    }
    onBuy && onBuy();
  }

  return (
    <div className="rounded border bg-card text-card-foreground p-4 shadow hover:shadow-lg flex flex-col justify-between transition-colors">
      <img
        src={item.image}
        alt={item.title}
        className="mb-2 w-full h-36 object-cover rounded"
        loading="lazy"
      />
      <div>
        <h2 className="font-semibold text-lg">{item.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
        {"instructor" in item && (
          <div className="mt-1 text-xs font-medium text-muted-foreground">
            By {item.instructor}
          </div>
        )}
        <div className="mt-2 font-bold text-primary">
          ₹{item.price}
        </div>
      </div>
      {/* Course flow: Buy Now/Access */}
      {type === "course" && onBuy && (
        <Button
          variant={isOwned ? "default" : "outline"}
          className="mt-3"
          onClick={handleBuy}
        >
          {isOwned ? "Access" : "Buy Now"}
        </Button>
      )}
      {/* Product flow: Add to Cart (unchanged) */}
      {type !== "course" && onAddToCart && (
        <Button variant="outline" className="mt-3" onClick={handleAdd}>
          Add to Cart
        </Button>
      )}
    </div>
  );
}
