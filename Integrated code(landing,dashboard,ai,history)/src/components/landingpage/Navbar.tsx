import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Moved inside the component

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href="#" className="text-2xl font-bold text-tpl-orange">
            Intelli<span className="text-gray-800">Claims</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-tpl-orange transition-colors">Features</a>
            <a href="#intelliclaim" className="text-gray-700 hover:text-tpl-orange transition-colors">IntelliClaim</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-tpl-orange transition-colors">How It Works</a>
            <a href="#faq" className="text-gray-700 hover:text-tpl-orange transition-colors">FAQ</a>
            <button
        onClick={() => navigate("/login")}
        className="bg-tpl-orange text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 hover:bg-[#e85c1e] active:shadow-[0_0_20px_5px_hsl(24,92%,58%)] active:scale-95"
      >
        Get Started
      </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-tpl-orange"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-700 hover:text-tpl-orange transition-colors" onClick={toggleMobileMenu}>Features</a>
              <a href="#intelliclaim" className="text-gray-700 hover:text-tpl-orange transition-colors" onClick={toggleMobileMenu}>IntelliClaim</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-tpl-orange transition-colors" onClick={toggleMobileMenu}>How It Works</a>
              <a href="#faq" className="text-gray-700 hover:text-tpl-orange transition-colors" onClick={toggleMobileMenu}>FAQ</a>
              <Button
                onClick={() => {
                  toggleMobileMenu();
                  navigate("/login"); // ✅ Navigate to login from mobile menu
                }}
                className="bg-tpl-orange hover:bg-tpl-orange-dark text-white w-full cta-button"
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
