import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Mail, Phone, Facebook, Globe, Pointer as Pinterest } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-indigo-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette size={24} className="text-amber-400" />
              <span className="text-xl font-serif font-bold">Best Art Technology</span>
            </div>
            <p className="text-indigo-200 mb-4">
              Celebrating art that speaks through murals and canvas, we bring you a curated collection of stunning artworks.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/BestArtCanvasNepal/photos" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-amber-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://bat.com.np" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-amber-400 transition-colors">
                <Globe size={20} />
              </a>
              <a href="https://www.pinterest.com/bestarttech" target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-amber-400 transition-colors">
                <Pinterest size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-indigo-200 hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/murals" className="text-indigo-200 hover:text-amber-400 transition-colors">
                  Mural Gallery
                </Link>
              </li>
              <li>
                <Link to="/canvas" className="text-indigo-200 hover:text-amber-400 transition-colors">
                  Canvas Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-indigo-200 hover:text-amber-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-indigo-200 hover:text-amber-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-400" />
                <span className="text-indigo-200">bestarttechnology@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-400" />
                <span className="text-indigo-200">+977-9803337100</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-800 mt-8 pt-8 text-center text-indigo-300">
          <p>&copy; {new Date().getFullYear()} Best Art Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;