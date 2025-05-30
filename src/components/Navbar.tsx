import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Palette, ChevronDown } from 'lucide-react';

interface NavLinkProps {
  to: string;
  label: string;
  isScrolled?: boolean;
}

interface MobileNavLinkProps {
  to: string;
  label: string;
  isNested?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, isScrolled = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        text-lg font-medium transition-colors duration-300 hover:text-amber-600
        ${isActive ? 'text-amber-600' : isScrolled ? 'text-indigo-900' : 'text-white'}
      `}
    >
      {label}
    </Link>
  );
};

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, isNested = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block py-2 ${
        isNested ? 'pl-8 text-lg' : 'text-xl'
      } ${
        isActive ? 'text-amber-600 font-medium' : 'text-indigo-900 hover:text-amber-600'
      }`}
    >
      {label}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [canvasDropdownOpen, setCanvasDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setCanvasDropdownOpen(false);
  }, [location]);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white bg-opacity-95 shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Palette size={28} className="text-indigo-900" />
            <span className={`text-xl font-serif font-bold ${
              isScrolled ? 'text-indigo-900' : 'text-white'
            }`}>
              Best Art Technology
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" label="Home" isScrolled={isScrolled} />
            <NavLink to="/murals" label="Mural Gallery" isScrolled={isScrolled} />
            
            {/* Canvas Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setCanvasDropdownOpen(true)}
              onMouseLeave={() => setCanvasDropdownOpen(false)}
            >
              <div className="flex items-center gap-1 cursor-pointer">
                <Link
                  to="/canvas"
                  className={`text-lg font-medium transition-colors duration-300 hover:text-amber-600 ${
                    location.pathname.startsWith('/canvas') 
                      ? 'text-amber-600' 
                      : isScrolled ? 'text-indigo-900' : 'text-white'
                  }`}
                >
                  Canvas Gallery
                </Link>
                <ChevronDown size={18} className={`transition-transform duration-200 ${
                  canvasDropdownOpen ? 'rotate-180' : ''
                } ${
                  isScrolled ? 'text-indigo-900' : 'text-white'
                }`} />
              </div>
              
              {canvasDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/canvas"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    5 Panel Canvas
                  </Link>
                  <Link
                    to="/canvas/single"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Single Panel Canvas
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/about" label="About" isScrolled={isScrolled} />
            <NavLink to="/contact" label="Contact" isScrolled={isScrolled} />
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} className={isScrolled ? 'text-indigo-900' : 'text-white'} />
            ) : (
              <Menu size={24} className={isScrolled ? 'text-indigo-900' : 'text-white'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
          <MobileNavLink to="/" label="Home" />
          <MobileNavLink to="/murals" label="Mural Gallery" />
          
          {/* Mobile Canvas Dropdown */}
          <div className="flex flex-col">
            <button 
              className="flex items-center justify-between text-xl py-2 text-indigo-900 hover:text-amber-600"
              onClick={() => setCanvasDropdownOpen(!canvasDropdownOpen)}
            >
              <span>Canvas Gallery</span>
              <ChevronDown size={18} className={`transition-transform ${
                canvasDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {canvasDropdownOpen && (
              <div className="space-y-2 mt-1">
                <MobileNavLink to="/canvas" label="5 Panel Canvas" isNested />
                <MobileNavLink to="/canvas/single" label="Single Panel Canvas" isNested />
              </div>
            )}
          </div>

          <MobileNavLink to="/about" label="About" />
          <MobileNavLink to="/contact" label="Contact" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;