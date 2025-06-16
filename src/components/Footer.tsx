import { ThemeToggle } from "./ThemeToggle";
import { Youtube, Github, Linkedin, Instagram, Mail } from "lucide-react"; 
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-4 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary/100 transition-colors">
                  Maker Brains Overview
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary/100 transition-colors">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary/100 transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-primary/100 transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary/100 transition-colors">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legal" className="hover:text-primary/100 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-primary/100 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-primary/100 transition-colors">
                  Copyright
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-primary/100 transition-colors">
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>

          {/* Find Us On Social Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Find Us On Social</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.youtube.com/@makerbrains" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary/100 transition-colors flex items-center gap-2"
                >
                  <Youtube className="w-4 h-4" />
                  YouTube
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/MukeshSankhla" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary/100 transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/in/mukeshsankhla/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary/100 transition-colors flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/makerbrains_official/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-primary/100 transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="hover:text-primary/100 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary/100 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary/100 transition-colors">
                  DIY Projects
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary/100 transition-colors">
                  Maker Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-700 mt-6 pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              © {new Date().getFullYear()} Maker Brains. All rights reserved.
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
