
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="mr-4 flex items-center font-semibold">
          MakerBrains
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/shop">Shop</Link>
          <Link to="/courses">Courses</Link>
          {user && <Link to="/orders">Orders</Link>}
          {isAdmin && <Link to="/admin">Admin</Link>}
          {user && <Link to="/address-book">Address Book</Link>}
          <ModeToggle />
          {user ? (
            <div className="flex items-center space-x-4">
              <span>{user.email}</span>
              <Button size="sm" onClick={() => logout()}>
                Logout
              </Button>
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full px-1 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            <div className="space-x-2">
              <Button size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate("/register")}>
                Register
              </Button>
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full px-1 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>
        <Sheet>
          <SheetTrigger className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Explore MakerBrains
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Link to="/shop">Shop</Link>
              <Link to="/courses">Courses</Link>
              {user && <Link to="/orders">Orders</Link>}
              {isAdmin && <Link to="/admin">Admin</Link>}
              {user && <Link to="/address-book">Address Book</Link>}
              <ModeToggle />
              {user ? (
                <div className="flex flex-col space-y-2">
                  <span>{user.email}</span>
                  <Button size="sm" onClick={() => logout()}>
                    Logout
                  </Button>
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full px-1 text-xs">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </div>
              ) : (
                <div className="space-x-2">
                  <Button size="sm" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate("/register")}>
                    Register
                  </Button>
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full px-1 text-xs">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Header;
