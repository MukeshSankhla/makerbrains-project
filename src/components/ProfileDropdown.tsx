
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Shield, User as UserIcon, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function ProfileDropdown({ onLogout }: { onLogout: () => void }) {
  const { user, userProfile, isAdmin } = useAuth();

  const fullName = userProfile?.fullName || userProfile?.displayName || user?.displayName || "User";
  const initials = fullName[0]?.toUpperCase() || "?";
  const photoURL = user?.photoURL || userProfile?.photoURL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2 py-1 h-auto">
          <Avatar className="w-8 h-8 ring-2 ring-primary/40">
            <AvatarImage src={photoURL || undefined} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium max-w-[130px] truncate">{fullName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Orders
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 text-destructive"
          onSelect={(e) => {
            e.preventDefault();
            onLogout();
          }}
          role="button"
          tabIndex={0}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
