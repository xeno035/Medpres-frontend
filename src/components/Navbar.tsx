import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <HeartPulse className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-blue-800 tracking-tight">MedPress</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
          <Link to="/doctor/login" className="text-gray-600 hover:text-blue-600 font-medium">Doctor</Link>
          <Link to="/pharmacist/login" className="text-gray-600 hover:text-green-600 font-medium">Pharmacist</Link>
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="h-7 w-7 text-blue-600" />
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="flex flex-col items-center py-4 space-y-2">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/doctor/login" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileOpen(false)}>Doctor</Link>
            <Link to="/pharmacist/login" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setMobileOpen(false)}>Pharmacist</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;