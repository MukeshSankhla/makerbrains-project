import { Product, Course } from "@/types/shop";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  item: Product | Course;
  onAddToCart?: () => void;
}

export function ProductCard({ item, onAddToCart }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      // Optionally: open login modal here
      return;
    }
    onAddToCart();
  };

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
      {onAddToCart && (
        <Button variant="outline" className="mt-3" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      )}
    </div>
  );
}
