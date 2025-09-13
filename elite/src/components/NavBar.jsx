import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import LOGO from "../assets/eliteretoucher-logo.png";
import { useAuth } from "../context/AuthContext";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      if (isMenuOpen) {
        setIsMenuOpen(false); // Close menu on scroll
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Function to handle logo click and redirect to home
  const handleLogoClick = () => {
    navigate("/"); // Navigate to home using React Router
  };

  return (
    <>
      {/* Header */}
      <header
        className={`fixed right-0 left-0 top-0 z-50 transition-all duration-300 
          border-b border-gray-300
          ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-gray-100"}`}
      >
        <div className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo - Now clickable */}
              <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
                <img src={LOGO} alt="EliteRetoucher Logo" className="h-9 w-auto" />
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex gap-8 text-gray-700 items-center">
                <Link to="/services" className="hover:text-blue-700 transition-colors font-medium">Services</Link>
                <Link to="/portfolio" className="hover:text-blue-700 transition-colors font-medium">Portfolio</Link>
                <Link to="/pricing" className="hover:text-blue-700 transition-colors font-medium">Pricing</Link>
                <Link to="/about" className="hover:text-blue-700 transition-colors font-medium">About</Link>
                <Link to="/contact" className="hover:text-blue-700 transition-colors font-medium">Contact</Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-md transition-colors font-medium shadow-md inline-block"
                  >
                    Admin
                  </Link>
                )}
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/dashboard"
                      className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-md transition-colors font-medium shadow-md inline-block"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-md transition-colors font-medium shadow-md inline-block"
                  >
                    Login
                  </Link>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 bg-gradient-to-b from-blue-900 to-blue-800
          flex flex-col items-center justify-center
          transform transition-all duration-500 ease-in-out
          ${isMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto z-40" : "-translate-y-full opacity-0 pointer-events-none z-40"}
        `}
      >
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="absolute top-6 right-6 p-2 text-white hover:text-blue-200 transition-colors"
          aria-label="Close menu"
        >
          <FiX className="w-8 h-8" />
        </button>

        {/* Mobile Nav */}
        <nav className="flex flex-col items-center space-y-8 text-white text-xl">
          <Link to="/services" onClick={closeMenu} className="hover:text-blue-200 transition-colors py-2 font-medium">Services</Link>
          <Link to="/portfolio" onClick={closeMenu} className="hover:text-blue-200 transition-colors py-2 font-medium">Portfolio</Link>
          <Link to="/pricing" onClick={closeMenu} className="hover:text-blue-200 transition-colors py-2 font-medium">Pricing</Link>
          <Link to="/about" onClick={closeMenu} className="hover:text-blue-200 transition-colors py-2 font-medium">About</Link>
          <Link to="/contact" onClick={closeMenu} className="hover:text-blue-200 transition-colors py-2 font-medium">Contact</Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md inline-block"
              onClick={closeMenu}
            >
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <Link
                to="/dashboard"
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md inline-block"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md font-medium mt-4 transition-colors shadow-md inline-block"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-10 text-blue-200 text-sm text-center px-4">
          <p>© 2023 EliteRetoucher. Professional photo retouching services.</p>
        </div>
      </div>
    </>
  );
};

export default NavBar;