import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { LogOut, Menu, X, Shield, User, Phone, Home } from "lucide-react";
import logoLight from "/src/images/logo_1.png";
import logoDark from "/src/images/logo_2.png";
import { useAuth } from "@/contexts/AuthContext";
import { FaRegEnvelope } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ProfileDropdown } from "./ProfileDropdown";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  // Use initial/fallback for avatar
  const initials = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";

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
                <Home className="mr-2 h-4 w-4" />
                Home
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
