
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
  MapPin,
  Clock,
  Heart
} from "lucide-react"; 
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Maker Brains</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Empowering creators and innovators through hands-on learning experiences. 
              Join our community of makers and bring your ideas to life.
            </p>
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Building the future, one project at a time</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/about" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group text-sm"
                >
                  <Heart className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 text-red-400" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/shop" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group text-sm"
                >
                  <Info className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 text-blue-400" />
                  Shop
                </Link>
              </li>
              <li>
                <Link 
                  to="/workshops" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group text-sm"
                >
                  <Clock className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 text-green-400" />
                  Workshops
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group text-sm"
                >
                  <Info className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 text-purple-400" />
                  Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <HelpCircle className="w-5 h-5 mr-2 text-green-400" />
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group text-sm"
                >
                  <Phone className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 text-green-400" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group text-sm"
                >
                  <HelpCircle className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 text-blue-400" />
                  Help & Support
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group text-sm"
                >
                  <FileText className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 text-yellow-400" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal" 
                  className="flex items-center text-slate-300 hover:text-white transition-colors group text-sm"
                >
                  <Shield className="w-4 h-4 mr-2 opacity-60 group-hover:opacity-100 text-red-400" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Mail className="w-5 h-5 mr-2 text-blue-400" />
              Connect
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="flex items-center text-slate-300 text-sm">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  mukeshdiy1@gmail.com
                </p>
              </div>
              
              <div>
                <p className="text-sm text-slate-300 mb-3 font-medium">Follow us:</p>
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href="https://www.youtube.com/@makerbrains" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-2 bg-red-600/20 rounded-md hover:bg-red-600/30 transition-colors text-sm"
                    aria-label="Visit our YouTube channel"
                  >
                    <Youtube className="w-4 h-4 text-red-400" />
                    <span className="text-slate-200 font-medium">YouTube</span>
                  </a>
                  <a 
                    href="https://github.com/MukeshSankhla" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600/20 rounded-md hover:bg-gray-600/30 transition-colors text-sm"
                    aria-label="Visit our GitHub profile"
                  >
                    <Github className="w-4 h-4 text-gray-300" />
                    <span className="text-slate-200 font-medium">GitHub</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/mukeshsankhla/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 rounded-md hover:bg-blue-600/30 transition-colors text-sm"
                    aria-label="Visit our LinkedIn profile"
                  >
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-200 font-medium">LinkedIn</span>
                  </a>
                  <a 
                    href="https://www.instagram.com/makerbrains_official/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-3 py-2 bg-pink-600/20 rounded-md hover:bg-pink-600/30 transition-colors text-sm"
                    aria-label="Visit our Instagram profile"
                  >
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span className="text-slate-200 font-medium">Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center text-sm text-slate-400">
              <CopyrightIcon className="w-4 h-4 mr-1" />
              {new Date().getFullYear()} Maker Brains. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <p className="text-xs text-slate-500">Made with ❤️ for the maker community</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
