import React from "react";
import { Link } from "react-router-dom";
import LOGO from "../assets/elite-white.png";

import { FaInstagram, FaYoutube } from 'react-icons/fa'; // Import social media icons

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img src={LOGO} alt="EliteRetoucher Logo" className="h-10 w-auto" />
            </div>
            <p className="text-blue-200 text-sm mb-6 max-w-md">
              Professional photo retouching services that elevate your images naturally.
              Fast, affordable, and guaranteed satisfaction for photographers and brands worldwide.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/elite.retoucher?igsh=NGxlaGRjMTRmeGo4" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-blue-300 hover:text-white transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@eliteretoucher?si=iFM8P3MAyx1C3xgc" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-blue-300 hover:text-white transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/services" className="text-blue-200 hover:text-white transition-colors text-sm">
                Photo Retouching
              </Link>
              <Link to="/portfolio" className="text-blue-200 hover:text-white transition-colors text-sm">
                Portfolio
              </Link>
              <Link to="/pricing" className="text-blue-200 hover:text-white transition-colors text-sm">
                Pricing Plans
              </Link>
              <Link to="/about" className="text-blue-200 hover:text-white transition-colors text-sm">
                About Us
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/contact" className="text-blue-200 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <a href="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                Help Center
              </a>
              <Link to="/terms-privacy" className="text-blue-200 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/terms-privacy" className="text-blue-200 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">
              © 2023 EliteRetoucher. Professional photo retouching services.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
