import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-violet-600 text-white py-6">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center">
          {/* Website Logo/Name */}
          <div className="text-2xl font-semibold">
            <Link to="/" className="text-white hover:text-violet-200">
              StackSphere
            </Link>
          </div>

          {/* Useful Links */}
          <div className="space-x-6">
            <Link to="/about" className="text-sm hover:text-violet-200">
              About Us
            </Link>
            <Link to="/contact" className="text-sm hover:text-violet-200">
              Contact
            </Link>
            <Link to="/terms" className="text-sm hover:text-violet-200">
              Terms & Conditions
            </Link>
            <Link to="/privacy" className="text-sm hover:text-violet-200">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Copyright Text */}
        <div className="mt-4 text-center text-sm">
          <p>© {new Date().getFullYear()} StackSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;