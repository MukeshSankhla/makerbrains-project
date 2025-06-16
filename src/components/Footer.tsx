import { ThemeToggle } from "./ThemeToggle";
import { 
  Youtube, 
  Github, 
  Linkedin, 
  Instagram, 
  Mail, 
  Info,
  HelpCircle,
  Phone,
  FileText,
  Shield,
  Copyright as CopyrightIcon,
  Link2Icon
} from "lucide-react"; 
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info Section */}
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-primary" />
              About Us
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Info className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100" />
                  Our Story
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <HelpCircle className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100" />
                  Help & Support
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Phone className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/legal" 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <FileText className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal" 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Shield className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal" 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <CopyrightIcon className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100" />
                  Copyright
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-primary" />
              Get in Touch
            </h3>
            <div className="space-y-4">
              <div>
                <p 
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <Mail className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100" />
                  mukeshdiy1@gmail.com
                </p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2 font-medium">Follow us for updates:</p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://www.youtube.com/@makerbrains" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-gray-700 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    aria-label="Visit our YouTube channel"
                  >
                    <Youtube className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium">YouTube</span>
                  </a>
                  <a 
                    href="https://github.com/MukeshSankhla" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Visit our GitHub profile"
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/mukeshsankhla/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-gray-700 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                    aria-label="Visit our LinkedIn profile"
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/makerbrains_official/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-gray-700 rounded-md hover:bg-pink-200 dark:hover:bg-pink-900/30 transition-colors"
                    aria-label="Visit our Instagram profile"
                  >
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <span className="text-sm font-medium">Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Border */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center text-sm text-muted-foreground">
              <CopyrightIcon className="w-4 h-4 mr-1" />
              {new Date().getFullYear()} Maker Brains. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}