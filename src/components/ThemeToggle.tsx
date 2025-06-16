import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <span
      className="relative w-6 h-6 cursor-pointer hover:scale-110"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="absolute inset-0 transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute inset-0 transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </span>
  );
}