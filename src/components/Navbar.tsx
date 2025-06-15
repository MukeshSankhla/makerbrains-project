import { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user, logout } = useAuth();

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="mr-4 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <Link to="/shop" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Shop
            </Link>
            <Link to="/courses" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Courses
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Contact
            </Link>
          </nav>
          {user ? (
            <ProfileDropdown onLogout={logout} />
          ) : (
            <Link to="/login">
              <Button size="sm">
                Login
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <Icons.menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link to="/" className="mr-4 flex items-center space-x-2">
                  <Icons.logo className="h-6 w-6" />
                  <span className="font-bold">{siteConfig.name}</span>
                </Link>
                <nav className="grid gap-6 text-lg mt-4">
                  <Link to="/shop" className="text-sm font-medium transition-colors hover:text-foreground/80">
                    Shop
                  </Link>
                  <Link to="/courses" className="text-sm font-medium transition-colors hover:text-foreground/80">
                    Courses
                  </Link>
                  <Link to="/contact" className="text-sm font-medium transition-colors hover:text-foreground/80">
                    Contact
                  </Link>
                </nav>
                <div className="mt-4">
                  {user ? (
                    <ProfileDropdown onLogout={logout} />
                  ) : (
                    <Link to="/login">
                      <Button size="sm">
                        Login
                        <Icons.arrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
};

export { Navbar };
