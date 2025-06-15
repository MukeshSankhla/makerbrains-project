import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { LogOut, Menu, X, Home, ShoppingCart } from "lucide-react";
import logoLight from "/src/images/logo_1.png";
import logoDark from "/src/images/logo_2.png";
import { useAuth } from "@/contexts/AuthContext";
import { FaRegEnvelope } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ProfileDropdown } from "./ProfileDropdown";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await (useAuth().logout());
    setIsMenuOpen(false);
  };

  // Cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Determine active route for highlight
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4 md:px-8">
        <Link to="/" className="flex items-center mr-6">
          <img
            src={logoDark}
            alt="Maker Brains Logo"
            className="h-10 hidden dark:block"
          />
          <img
            src={logoLight}
            alt="Maker Brains Logo"
            className="h-10 block dark:hidden"
          />
        </Link>
        {/* Main Nav Links - Desktop */}
        <div className="hidden md:flex space-x-2">
          <Link to="/" className={isActive("/") ? "font-bold text-primary" : "text-foreground"}>
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
          <Link to="/shop" className={isActive("/shop") ? "font-bold text-primary" : "text-foreground"}>
            <Button variant="ghost" size="sm">Shop</Button>
          </Link>
          <Link to="/courses" className={isActive("/courses") ? "font-bold text-primary" : "text-foreground"}>
            <Button variant="ghost" size="sm">Courses</Button>
          </Link>
          <Link to="/contact" className={isActive("/contact") ? "font-bold text-primary" : "text-foreground"}>
            <Button variant="ghost" size="sm">Contact</Button>
          </Link>
        </div>
        {/* Cart Link */}
        <Link to="/cart" className="ml-2 relative">
          <Button variant="ghost" size="icon" className="p-2 relative" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                {cartCount}
              </span>
            )}
          </Button>
        </Link>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        {/* Right Side Navigation Items */}
        <div className="hidden md:flex ml-auto items-center space-x-1">
          {user ? (
            <ProfileDropdown onLogout={handleLogout} />
          ) : (
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col space-y-2 px-4 py-4 border-t border-border bg-background">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Home
              </Button>
            </Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Shop
              </Button>
            </Link>
            <Link to="/courses" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Courses
              </Button>
            </Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="relative">
              <Button variant="ghost" className="w-full justify-start flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <FaRegEnvelope className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </Link>
            {user ? (
              <ProfileDropdown onLogout={handleLogout} />
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
            <div className="pt-2 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
