import logoLight from "/src/images/logo_1.png";
import logoDark from "/src/images/logo_2.png";
import { Link } from "react-router-dom";
import { Youtube, Github, Linkedin, Instagram, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border sticky backdrop-blur-md">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center mr-6">
                <img
                  src={logoDark}
                  alt="Maker Brains Logo"
                  className="h-8 hidden dark:block"
                />
                <img
                  src={logoLight}
                  alt="Maker Brains Logo"
                  className="h-8 block dark:hidden"
                />
              </Link>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering makers with innovative DIY electronics, robotics projects, and educational content.
            </p>
            <div className="flex space-x-4 items-center">
              <a 
                href="https://www.youtube.com/@makerbrains" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/MukeshSankhla" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/mukeshsankhla/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/makerbrains_official/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/legal" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal" className="text-muted-foreground hover:text-primary transition-colors">
                  Delivery & Return
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>mukeshdiy1@.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 9390977075</span>
              </div>
              <div className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Zaheerabad, Telangana,<br />India 502220</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-2 pt-2 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Maker Brains. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Made with ❤️ by Mukesh Sankhla
          </p>
        </div>
      </div>
    </footer>
  );
};
