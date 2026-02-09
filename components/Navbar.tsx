import React, { useState } from 'react';

interface NavbarProps {
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1 - Logo Only */}
        <div className="flex justify-start items-center h-20 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#0a9c82] to-[#4ac59d] rounded-lg p-1.5 shadow-md">
              <div className="w-6 h-6 bg-white rounded"></div>
            </div>
            <span className="text-2xl font-bold text-[#073b4c]">
              Openreach <span className="text-[#0a9c82]">ORIT</span>
            </span>
          </div>
        </div>

        {/* Row 2 - Navigation Below Logo */}
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-[#0a9c82] font-medium transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0a9c82] group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#about" className="text-gray-700 hover:text-[#0a9c82] font-medium transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0a9c82] group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          <button
            onClick={onLoginClick}
            className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Staff Login
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <a href="#home" className="block text-gray-700 hover:text-[#0a9c82] font-medium py-2">Home</a>
            <a href="#about" className="block text-gray-700 hover:text-[#0a9c82] font-medium py-2">About</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
